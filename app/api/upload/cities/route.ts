import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { City, ApiResponse } from '@/types';
import * as xlsx from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '未选择文件',
      });
    }

    // 读取 Excel 文件
    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 清理列名中的空格（Excel 中列名可能是 city_namte 而不是 city_name）
    const range = xlsx.utils.decode_range(worksheet['!ref'] || 'A1');
    const colMap: Record<number, string> = {};
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = xlsx.utils.encode_cell({ r: range.s.r, c: C });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) {
        const cleanColName = String(cell.v).trim();
        colMap[C] = cleanColName;
      }
    }

    const data: any[] = [];
    for (let R = range.s.r + 1; R <= range.e.r; R++) {
      const row: any = {};
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = xlsx.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        const colName = colMap[C];
        if (colName) {
          row[colName] = cell ? cell.v : undefined;
        }
      }
      // 只添加有数据的行
      if (Object.keys(row).length > 0) {
        data.push(row);
      }
    }

    // 处理数据 - 注意 Excel 中的列名是 city_namte (可能有空格)
    const cities: City[] = data.map((row) => ({
      city_name: (row.city_namte || row.city_name || '').toString().trim(),
      year: String(row.year || '').trim(),
      rate: parseFloat(row.rate) || 0,
      base_min: parseInt(row.base_min) || 0,
      base_max: parseInt(row.base_max) || 0,
    }));

    // 插入数据库
    const { error } = await supabase().from('cities').insert(cities);

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: `数据库插入失败: ${error.message}`,
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `成功上传 ${cities.length} 条城市数据`,
    });
  } catch (err) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: `文件处理失败: ${err instanceof Error ? err.message : '未知错误'}`,
    });
  }
}
