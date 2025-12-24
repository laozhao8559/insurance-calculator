import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Result, ApiResponse, EmployeeSalarySummary } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // 1. 获取所有工资数据
    const { data: salaries, error: salariesError } = await supabase()
      .from('salaries')
      .select('*');

    if (salariesError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: `获取工资数据失败: ${salariesError.message}`,
      });
    }

    if (!salaries || salaries.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '没有工资数据，请先上传工资数据',
      });
    }

    // 2. 获取佛山城市标准
    const { data: cities, error: citiesError } = await supabase()
      .from('cities')
      .select('*')
      .eq('city_name', '佛山')
      .limit(1);

    if (citiesError || !cities || cities.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '未找到佛山城市数据，请先上传城市标准数据',
      });
    }

    const cityData = cities[0];

    // 3. 按员工分组计算平均工资
    const employeeMap = new Map<string, EmployeeSalarySummary>();

    for (const salary of salaries) {
      const name = salary.employee_name;
      if (!employeeMap.has(name)) {
        employeeMap.set(name, {
          employee_name: name,
          total_salary: 0,
          month_count: 0,
          avg_salary: 0,
        });
      }
      const summary = employeeMap.get(name)!;
      summary.total_salary += salary.salary_amount;
      summary.month_count += 1;
    }

    // 计算平均工资
    const summaries: EmployeeSalarySummary[] = Array.from(employeeMap.values());
    summaries.forEach((s) => {
      s.avg_salary = s.total_salary / s.month_count;
    });

    // 4. 计算缴费基数和公司应缴金额
    const results: Result[] = summaries.map((summary) => {
      // 确定缴费基数
      let contributionBase: number;
      if (summary.avg_salary < cityData.base_min) {
        contributionBase = cityData.base_min;
      } else if (summary.avg_salary > cityData.base_max) {
        contributionBase = cityData.base_max;
      } else {
        contributionBase = summary.avg_salary;
      }

      // 计算公司缴纳金额
      const companyFee = contributionBase * cityData.rate;

      return {
        employee_name: summary.employee_name,
        avg_salary: parseFloat(summary.avg_salary.toFixed(2)),
        contribution_base: parseFloat(contributionBase.toFixed(2)),
        company_fee: parseFloat(companyFee.toFixed(2)),
      };
    });

    // 5. 插入结果到数据库
    const { error: insertError } = await supabase().from('results').insert(results);

    if (insertError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: `保存结果失败: ${insertError.message}`,
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `成功计算并保存 ${results.length} 条结果`,
      data: results,
    });
  } catch (err) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: `计算失败: ${err instanceof Error ? err.message : '未知错误'}`,
    });
  }
}
