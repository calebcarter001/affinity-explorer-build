import React from 'react';
import ModernProgressBar from '../common/ModernProgressBar';

const ProgressTracker = ({ goal }) => {
  const getStatusColor = (progress) => {
    if (progress >= 75) return 'green';
    if (progress >= 50) return 'yellow';
    return 'blue';
  };

  const progress = (goal.current / goal.target) * 100;
  const statusColor = getStatusColor(progress);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold mb-2">Progress</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Target: {goal.target}</span>
        </div>
        <div className="mb-4">
          <ModernProgressBar
            progress={progress}
            color={statusColor}
            height="lg"
            showLabel={true}
            labelPosition="right"
            className="mb-2"
          />
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
    </div>
  );
};

export default ProgressTracker; 