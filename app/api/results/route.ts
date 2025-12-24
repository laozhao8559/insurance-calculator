import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Result, ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: `获取结果失败: ${error.message}`,
      });
    }

    return NextResponse.json<ApiResponse<Result[]>>({
      success: true,
      message: `获取到 ${data?.length || 0} 条结果`,
      data: data || [],
    });
  } catch (err) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: `请求失败: ${err instanceof Error ? err.message : '未知错误'}`,
    });
  }
}
