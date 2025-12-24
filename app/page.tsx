import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">五险一金计算器</h1>
          <p className="text-gray-600">根据员工工资数据和城市社保标准，自动计算公司应缴纳费用</p>
        </div>

        {/* 卡片容器 */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 数据上传卡片 */}
          <Link href="/upload" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-100">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">数据上传</h2>
              <p className="text-gray-600 leading-relaxed">
                上传城市标准和员工工资数据，执行计算操作。支持 Excel 文件格式导入。
              </p>
              <div className="mt-6 text-blue-600 font-medium group-hover:text-blue-700 flex items-center">
                前往上传
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>

          {/* 结果查询卡片 */}
          <Link href="/results" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-100">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">结果查询</h2>
              <p className="text-gray-600 leading-relaxed">
                查看已计算完成的员工社保公积金缴纳结果，包含详细的数据表格展示。
              </p>
              <div className="mt-6 text-green-600 font-medium group-hover:text-green-700 flex items-center">
                前往查询
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* 页脚说明 */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>固定城市：佛山 | 计算年份：Excel 数据中的年份</p>
        </div>
      </div>
    </main>
  );
}
