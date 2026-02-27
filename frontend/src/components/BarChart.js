import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, title }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available</div>;
  }

  const months = Object.keys(data).sort();
  const income = months.map((m) => data[m].income || 0);
  const expense = months.map((m) => data[m].expense || 0);

  const chartData = {
    labels: months.map((m) => {
      const [year, month] = m.split('-');
      return new Date(year, parseInt(month) - 1).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }),
    datasets: [
      {
        label: 'Income',
        data: income,
        backgroundColor: '#10B981',
        borderRadius: 4,
      },
      {
        label: 'Expense',
        data: expense,
        backgroundColor: '#EF4444',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
