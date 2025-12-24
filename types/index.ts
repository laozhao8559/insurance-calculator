// 城市标准表
export interface City {
  id?: number;
  city_name: string;
  year: string;
  rate: number;
  base_min: number;
  base_max: number;
}

// 员工工资表
export interface Salary {
  id?: number;
  employee_id: string;
  employee_name: string;
  month: string;
  salary_amount: number;
}

// 计算结果表
export interface Result {
  id?: number;
  employee_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 员工工资汇总（用于计算）
export interface EmployeeSalarySummary {
  employee_name: string;
  total_salary: number;
  month_count: number;
  avg_salary: number;
}
