import React from 'react';
import { FiTrendingUp, FiTarget } from 'react-icons/fi';

const ProgressTracker = ({ goal }) => {
  const getStatusColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const progress = (goal.current / goal.target) * 100;
  const statusColor = getStatusColor(progress);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FiTrendingUp className="text-blue-500 mr-2" size={20} />
          <h3 className="text-lg font-semibold">Affinity Expansion Goal</h3>
        </div>
        <div className="flex items-center">
          <FiTarget className="text-gray-500 mr-2" size={16} />
          <span className="text-sm text-gray-500">Target: {goal.target}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${statusColor} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <div>
          <span className="text-gray-500">Current:</span>
          <span className="ml-1 font-medium">{goal.current}</span>
        </div>
        <div>
          <span className="text-gray-500">Last Updated:</span>
          <span className="ml-1 font-medium">{new Date(goal.lastUpdated).toLocaleDateString()}</span>
        </div>
        <div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
            ${goal.status === 'completed' ? 'bg-green-100 text-green-800' :
              goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'}`}>
            {goal.status.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker; 