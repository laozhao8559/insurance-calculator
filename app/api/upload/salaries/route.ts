import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Salary, ApiResponse } from '@/types';
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
    const data = xlsx.utils.sheet_to_json(worksheet) as any[];

    // 处理数据
    const salaries: Salary[] = data.map((row) => ({
      employee_id: String(row.employee_id || ''),
      employee_name: row.employee_name || '',
      month: String(row.month || ''),
      salary_amount: parseInt(row.salary_amount) || 0,
    }));

    // 插入数据库
    const { error } = await supabase().from('salaries').insert(salaries);

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: `数据库插入失败: ${error.message}`,
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `成功上传 ${salaries.length} 条工资数据`,
    });
  } catch (err) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: `文件处理失败: ${err instanceof Error ? err.message : '未知错误'}`,
    });
  }
}
