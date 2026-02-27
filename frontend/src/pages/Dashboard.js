import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { analyticsAPI } from '../api/axios';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [expenseByCategory, setExpenseByCategory] = useState([]);
  const [monthlyData, setMonthlyData] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, categoryRes, monthlyRes, trendRes] = await Promise.all([
        analyticsAPI.getSummary(),
        analyticsAPI.getExpenseByCategory(),
        analyticsAPI.getMonthlyComparison({ months: 6 }),
        analyticsAPI.getSpendingTrend({ days: 30 }),
      ]);

      setSummary(summaryRes.data.data);
      setExpenseByCategory(categoryRes.data.data);
      setMonthlyData(monthlyRes.data.data);
      setTrendData(trendRes.data.data);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Failed to fetch dashboard data';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const currentMonth = summary?.currentMonth || { income: 0, expense: 0, balance: 0 };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10 slide-in-up">
        <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">Track and manage your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Income Card */}
        <div className="group hover-lift">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-green-100 text-sm font-semibold uppercase tracking-wide">Total Income</h3>
                <span className="text-3xl">📈</span>
              </div>
              <p className="text-5xl font-bold">
                ${currentMonth.income?.toFixed(2) || '0.00'}
              </p>
              <p className="text-green-100 text-sm mt-3">This month</p>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="group hover-lift">
          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-red-100 text-sm font-semibold uppercase tracking-wide">Total Expenses</h3>
                <span className="text-3xl">💸</span>
              </div>
              <p className="text-5xl font-bold">
                ${currentMonth.expense?.toFixed(2) || '0.00'}
              </p>
              <p className="text-red-100 text-sm mt-3">This month</p>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="group hover-lift">
          <div className={`bg-gradient-to-br ${currentMonth.balance >= 0 ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600'} rounded-2xl shadow-lg p-8 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Balance</h3>
                <span className="text-3xl">{currentMonth.balance >= 0 ? '✨' : '⚠️'}</span>
              </div>
              <p className={`text-5xl font-bold ${currentMonth.balance >= 0 ? 'text-white' : 'text-white'}`}>
                ${currentMonth.balance?.toFixed(2) || '0.00'}
              </p>
              <p className="text-blue-100 text-sm mt-3">{currentMonth.balance >= 0 ? 'You\'re in good shape!' : 'Over budget'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Top Row - Pie and Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {expenseByCategory.length > 0 && (
            <div className="card hover-lift scale-in" style={{animationDelay: '0.1s'}}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Expense Distribution
                </h2>
                <p className="text-gray-500 text-sm mt-1">Breakdown by category</p>
              </div>
              <PieChart data={expenseByCategory} title="Expense Distribution by Category" />
            </div>
          )}
          
          {Object.keys(monthlyData).length > 0 && (
            <div className="card hover-lift scale-in" style={{animationDelay: '0.2s'}}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  Monthly Comparison
                </h2>
                <p className="text-gray-500 text-sm mt-1">Income vs Expenses over time</p>
              </div>
              <BarChart data={monthlyData} title="Monthly Income vs Expenses" />
            </div>
          )}
        </div>

        {/* Bottom Row - Full Width Trend Chart */}
        {trendData.length > 0 && (
          <div className="card hover-lift scale-in" style={{animationDelay: '0.3s'}}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📉</span>
                Spending Trend
              </h2>
              <p className="text-gray-500 text-sm mt-1">Last 30 days analysis</p>
            </div>
            <LineChart data={trendData} title="Spending Trend (Last 30 Days)" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
