import React from 'react';
import { FiPieChart, FiTarget } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const AccuracyMetrics = ({ goal }) => {
  const chartData = {
    labels: goal.validationStrategies.map(strategy => strategy.name),
    datasets: [{
      data: goal.validationStrategies.map(strategy => strategy.contribution),
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          padding: 20,
          boxWidth: 12,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  };

  const progress = (goal.current / goal.target) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FiPieChart className="text-purple-500 mr-2" size={20} />
          <h3 className="text-lg font-semibold">Accuracy Metrics</h3>
        </div>
        <div className="flex items-center">
          <FiTarget className="text-gray-500 mr-2" size={16} />
          <span className="text-sm text-gray-500">Target: {goal.target}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Current Accuracy</span>
              <span className="text-sm font-medium text-gray-700">{goal.current}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-sm">
            <div className="mb-2">
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-1 font-medium">{new Date(goal.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="h-[200px] relative">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AccuracyMetrics; 