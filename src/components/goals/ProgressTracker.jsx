import React from 'react';
import { FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';

const ProgressTracker = ({ 
  completed, 
  total, 
  inProgress, 
  notStarted,
  lastUpdated 
}) => {
  const progress = (completed / total) * 100;
  
  const getStatusColor = (value) => {
    if (value >= 75) return 'bg-green-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Progress Tracker</h3>
        <span className="text-sm text-gray-500">Last updated: {lastUpdated}</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-medium">{completed}/{total}</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getStatusColor(progress)}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center p-3 bg-green-50 rounded-lg">
          <FiCheckCircle className="text-green-500 text-xl mr-3" />
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-xl font-semibold">{completed}</p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
          <FiClock className="text-blue-500 text-xl mr-3" />
          <div>
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-xl font-semibold">{inProgress}</p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-red-50 rounded-lg">
          <FiAlertTriangle className="text-red-500 text-xl mr-3" />
          <div>
            <p className="text-sm text-gray-600">Not Started</p>
            <p className="text-xl font-semibold">{notStarted}</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="text-lg font-semibold">{Math.round((completed / total) * 100)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-lg font-semibold">{total - completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker; 