import React from 'react';
import { FiPieChart, FiTarget } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ModernProgressBar from '../common/ModernProgressBar';

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
    <div className="bg-white rounded-lg shadow-md p-2 mb-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <FiPieChart className="text-purple-500 mr-2" size={20} />
          <h3 className="text-lg font-semibold">Accuracy Metrics</h3>
        </div>
        <div className="flex items-center">
          <FiTarget className="text-gray-500 mr-2" size={16} />
          <span className="text-sm text-gray-500">Target: {goal.target}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="mb-2">
            <ModernProgressBar
              progress={progress}
              color="purple"
              height="md"
              showLabel={true}
              labelPosition="right"
              className="mb-2"
            />
          </div>

          <div className="text-sm">
            <div className="mb-1">
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-1 font-medium">{new Date(goal.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="h-[160px] w-full flex items-center justify-center">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AccuracyMetrics; 