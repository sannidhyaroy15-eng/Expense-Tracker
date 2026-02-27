import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { analyticsAPI } from '../api/axios';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';

const Analytics = () => {
  const [expenseByCategory, setExpenseByCategory] = useState([]);
  const [monthlyData, setMonthlyData] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(6);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalyticsData();
  }, [months, days]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [categoryRes, monthlyRes, trendRes, summaryRes] = await Promise.all([
        analyticsAPI.getExpenseByCategory(),
        analyticsAPI.getMonthlyComparison({ months }),
        analyticsAPI.getSpendingTrend({ days }),
        analyticsAPI.getSummary(),
      ]);

      setExpenseByCategory(categoryRes.data.data);
      setMonthlyData(monthlyRes.data.data);
      setTrendData(trendRes.data.data);
      setSummary(summaryRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Analytics & Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">This Month Income</h3>
          <p className="text-2xl font-bold text-green-500">
            ${summary?.currentMonth?.income?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">This Month Expenses</h3>
          <p className="text-2xl font-bold text-red-500">
            ${summary?.currentMonth?.expense?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Last 30 Days Avg Daily Spend</h3>
          <p className="text-2xl font-bold text-blue-500">
            ${((summary?.last30Days?.expense || 0) / 30).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Monthly Comparison (Last)</label>
            <select
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Spending Trend (Last)</label>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {expenseByCategory.length > 0 && (
          <PieChart data={expenseByCategory} title="Expense Distribution by Category" />
        )}
        {Object.keys(monthlyData).length > 0 && (
          <BarChart data={monthlyData} title="Monthly Income vs Expenses" />
        )}
        {trendData.length > 0 && (
          <div className="lg:col-span-2">
            <LineChart data={trendData} title={`Spending Trend (Last ${days} Days)`} />
          </div>
        )}
      </div>

      {/* Detailed Expense Report */}
      {expenseByCategory.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Expense Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Category</th>
                  <th className="px-6 py-3 text-left font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold">Transactions</th>
                  <th className="px-6 py-3 text-left font-semibold">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {expenseByCategory.map((item) => {
                  const total = expenseByCategory.reduce((sum, cat) => sum + cat.amount, 0);
                  const percentage = ((item.amount / total) * 100).toFixed(1);
                  return (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold">
                        {item.icon} {item.category}
                      </td>
                      <td className="px-6 py-3 text-red-500 font-semibold">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-3">{item.count}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
