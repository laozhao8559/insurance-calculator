'use client';

import { useEffect, useState } from 'react';
import { Result } from '@/types';

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/results');
      const data = await response.json();

      if (data.success) {
        setResults(data.data || []);
      } else {
        setError(data.error || '获取结果失败');
      }
    } catch (err) {
      setError('请求失败');
    } finally {
      setLoading(false);
    }
  };

  // 格式化金额显示
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 返回主页 */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回主页
        </Link>

        {/* 页面标题 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">计算结果</h1>
          <p className="text-gray-600">员工社保公积金缴纳明细</p>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        )}

        {/* 错误提示 */}
        {error && !loading && (
          <div className="bg-red-100 text-red-800 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* 无数据提示 */}
        {!loading && !error && results.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无数据</h3>
            <p className="text-gray-500 mb-6">请先上传数据并执行计算</p>
            <Link
              href="/upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              前往上传
            </Link>
          </div>
        )}

        {/* 结果表格 */}
        {!loading && !error && results.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">员工姓名</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">年度月平均工资</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">缴费基数</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">公司应缴金额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {result.employee_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-right">
                        {formatCurrency(result.avg_salary)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-right">
                        {formatCurrency(result.contribution_base)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold text-blue-600">
                        {formatCurrency(result.company_fee)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 统计信息 */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  共 <span className="font-semibold text-gray-800">{results.length}</span> 位员工
                </span>
                <span className="text-sm text-gray-600">
                  总计: <span className="font-semibold text-blue-600">
                    {formatCurrency(results.reduce((sum, r) => sum + r.company_fee, 0))}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 刷新按钮 */}
        {!loading && results.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={fetchResults}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新数据
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

import Link from 'next/link';
