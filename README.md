# 五险一金计算器

根据员工工资数据和城市社保标准，自动计算公司应缴纳的社保公积金费用。

## 技术栈

- **前端**: Next.js 15 (App Router) + React 19
- **UI**: Tailwind CSS
- **后端/数据库**: Supabase
- **Excel 处理**: xlsx

---

## 快速开始

### 1. 配置 Supabase

#### 1.1 获取 Supabase 凭证

登录您的 [Supabase 控制台](https://supabase.com/dashboard)，获取以下信息：
- Project URL
- anon/public key

#### 1.2 创建数据库表

在 Supabase 控制台的 SQL Editor 中，执行 `supabase-setup.sql` 文件中的 SQL 语句，创建三张数据表：
- `cities` - 城市标准表
- `salaries` - 员工工资表
- `results` - 计算结果表

#### 1.3 配置环境变量

复制环境变量模板并填入您的凭证：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

---

## 使用说明

### 1. 上传数据

在 `/upload` 页面中：

1. **上传城市标准**: 选择 `cities.xlsx` 文件上传
2. **上传工资数据**: 选择 `salaries.xlsx` 文件上传
3. **执行计算**: 点击"执行计算并存储结果"按钮

### 2. 查看结果

在 `/results` 页面查看计算结果，包括：
- 员工姓名
- 年度月平均工资
- 缴费基数
- 公司应缴金额

---

## 数据格式

### cities.xlsx

| id | city_name | year | rate | base_min | base_max |
|----|-----------|------|------|----------|----------|
| 1  | 佛山      | 2024 | 0.14 | 4546     | 26421    |

### salaries.xlsx

| id | employee_id | employee_name | month  | salary_amount |
|----|-------------|---------------|--------|---------------|
| 1  | 1           | 张三          | 202401 | 30000         |

---

## 项目结构

```
insurance-calculator/
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   ├── cities/route.ts      # 上传城市数据
│   │   │   └── salaries/route.ts    # 上传工资数据
│   │   ├── calculate/route.ts       # 执行计算
│   │   └── results/route.ts         # 获取结果
│   ├── page.tsx                     # 主页
│   ├── upload/page.tsx              # 上传页
│   └── results/page.tsx             # 结果页
├── lib/supabase.ts                  # Supabase 客户端
├── types/index.ts                   # 类型定义
└── supabase-setup.sql               # 数据库设置脚本
```

---

## 计算逻辑

1. 从 `salaries` 表读取所有数据
2. 按员工姓名分组，计算年度月平均工资
3. 从 `cities` 表获取佛山数据（基数上下限、比例）
4. 确定缴费基数：
   - 平均工资 < 下限 → 使用下限
   - 平均工资 > 上限 → 使用上限
   - 否则 → 使用平均工资
5. 计算公司缴纳金额：缴费基数 × 比例
6. 存入 `results` 表

---

## 注意事项

- 当前版本固定使用佛山数据
- Excel 中城市名列拼写为 `city_namte`（已在代码中处理）
- 数据上传采用追加模式，重复上传会产生重复数据
