# 五险一金计算器 - 项目上下文管理中枢

## 项目目标

构建一个迷你的"五险一金"计算器 Web 应用，根据预设的员工工资数据和城市社保标准，计算出公司为每位员工应缴纳的社保公积金费用，并将结果清晰地展示出来。

---

## 技术栈

| 类型 | 技术 |
|------|------|
| 前端框架 | Next.js 15 (App Router) |
| UI/样式 | Tailwind CSS |
| 数据库/后端 | Supabase |
| Excel 处理 | xlsx 库 |

---

## 数据结构

### cities 表 (城市标准)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 (自增) |
| city_name | text | 城市名 |
| year | text | 年份 |
| rate | float | 综合缴纳比例 (如 0.14 = 14%) |
| base_min | int | 社保基数下限 |
| base_max | int | 社保基数上限 |

**注意事项**: Excel 文件中列名为 `city_namte` (拼写错误)，代码已处理此问题。

### salaries 表 (员工工资)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 (自增) |
| employee_id | text | 员工工号 |
| employee_name | text | 员工姓名 |
| month | text | 年份月份 (YYYYMM 格式) |
| salary_amount | int | 该月工资金额 |

### results 表 (计算结果)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 (自增) |
| employee_name | text | 员工姓名 |
| avg_salary | float | 年度月平均工资 |
| contribution_base | float | 最终缴费基数 |
| company_fee | float | 公司缴纳金额 |

---

## 核心业务逻辑

```
1. 从 salaries 表读取所有数据
2. 按 employee_name 分组，计算每位员工的年度月平均工资
3. 从 cities 表获取佛山的数据 (year, base_min, base_max, rate)
4. 确定缴费基数:
   - avg_salary < base_min  → 使用 base_min
   - avg_salary > base_max  → 使用 base_max
   - 否则                    → 使用 avg_salary
5. 计算公司缴纳金额: contribution_base × rate
6. 将结果存入 results 表
```

---

## 页面功能

### `/` 主页

- 两个可点击的功能卡片
- "数据上传" → 跳转至 `/upload`
- "结果查询" → 跳转至 `/results`

### `/upload` 上传页

- **上传 cities.xlsx**: 向 cities 表追加插入数据
- **上传 salaries.xlsx**: 向 salaries 表追加插入数据
- **执行计算并存储结果**: 执行核心计算逻辑，向 results 表追加插入数据
- 显示操作反馈（成功/失败、处理条数）

### `/results` 结果页

- 从 results 表获取所有数据
- 使用 Tailwind CSS 表格展示
- 显示统计信息（员工总数、总金额）

---

## 重要约定

1. **固定城市**: 当前版本固定使用佛山数据
2. **年份**: 使用 Excel 表格中的年份
3. **数据操作**: 上传和计算都采用追加模式（可能导致重复数据）
4. **反馈机制**: 每个操作都需返回明确的状态反馈

---

## API Routes

| 路径 | 方法 | 功能 |
|------|------|------|
| `/api/upload/cities` | POST | 上传城市数据 |
| `/api/upload/salaries` | POST | 上传工资数据 |
| `/api/calculate` | POST | 执行计算并存储 |
| `/api/results` | GET | 获取计算结果 |

---

## TodoList - 开发任务清单

### 阶段一: 项目初始化 ✅
- [x] 1.1 创建 Next.js 项目
- [x] 1.2 配置 Tailwind CSS
- [x] 1.3 安装 Supabase 客户端
- [x] 1.4 安装 xlsx 库
- [x] 1.5 配置项目结构

### 阶段二: Supabase 配置 ✅
- [x] 2.1 创建建表 SQL 脚本
- [x] 2.2 定义数据表结构
- [x] 2.3 配置 RLS 策略

### 阶段三: 基础结构 ✅
- [x] 3.1 创建 Supabase 客户端 (`lib/supabase.ts`)
- [x] 3.2 创建类型定义 (`types/index.ts`)
- [x] 3.3 配置全局样式

### 阶段四: 主页开发 ✅
- [x] 4.1 创建主页组件 (`app/page.tsx`)
- [x] 4.2 设计卡片布局

### 阶段五: 上传页开发 ✅
- [x] 5.1 创建上传页面 (`app/upload/page.tsx`)
- [x] 5.2 创建 cities 上传 API
- [x] 5.3 创建 salaries 上传 API
- [x] 5.4 创建计算 API
- [x] 5.5 添加反馈 UI

### 阶段六: 结果页开发 ✅
- [x] 6.1 创建结果页面 (`app/results/page.tsx`)
- [x] 6.2 创建结果获取 API
- [x] 6.3 设计数据表格

### 阶段七: 核心计算逻辑 ✅
- [x] 7.1 实现员工工资分组和平均计算
- [x] 7.2 实现缴费基数确定逻辑
- [x] 7.3 实现公司缴纳金额计算
- [x] 7.4 实现结果存储

### 阶段八: 测试与优化
- [ ] 8.1 配置 Supabase 环境变量
- [ ] 8.2 在 Supabase 中执行建表脚本
- [ ] 8.3 测试上传功能
- [ ] 8.4 测试计算逻辑
- [ ] 8.5 测试结果展示

---

## 待配置项目

- [ ] Supabase URL
- [ ] Supabase ANON_KEY
- [ ] 执行 `supabase-setup.sql` 建表脚本

---

## 关键文件路径

```
insurance-calculator/
├── app/
│   ├── api/
│   │   ├── upload/cities/route.ts
│   │   ├── upload/salaries/route.ts
│   │   ├── calculate/route.ts
│   │   └── results/route.ts
│   ├── page.tsx              # 主页
│   ├── upload/page.tsx       # 上传页
│   ├── results/page.tsx      # 结果页
│   ├── layout.tsx            # 根布局
│   └── globals.css           # 全局样式
├── lib/supabase.ts           # Supabase 客户端
├── types/index.ts            # 类型定义
├── supabase-setup.sql        # 建表脚本
├── claude.md                 # 本文件
└── .env.local                # 环境变量 (需创建)
```

---

## Excel 示例数据位置

```
../cities.xlsx    # 城市标准数据 (佛山 2024年)
../salaries.xlsx  # 员工工资数据 (张三、李四、王五 各12个月)
```
