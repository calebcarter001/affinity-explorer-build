import React from 'react';
import { FiTarget, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

const GoalAlignment = ({
  title,
  goal,
  keyResults = [],
  className = ''
}) => {
  // Calculate overall progress
  const calculateProgress = () => {
    if (!keyResults.length) return 0;
    const totalProgress = keyResults.reduce((sum, kr) => sum + kr.progress, 0);
    return Math.round(totalProgress / keyResults.length);
  };

  const progress = calculateProgress();
  
  // Determine status
  const getStatus = () => {
    if (progress >= 100) return 'complete';
    if (progress >= 80) return 'in-progress';
    if (progress >= 60) return 'at-risk';
    return 'behind';
  };
  
  // Determine status color
  const getStatusColor = () => {
    switch (getStatus()) {
      case 'complete':
        return 'text-green-500';
      case 'in-progress':
        return 'text-blue-500';
      case 'at-risk':
        return 'text-yellow-500';
      case 'behind':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (getStatus()) {
      case 'complete':
        return <FiCheckCircle className="text-green-500" />;
      case 'in-progress':
        return <FiClock className="text-blue-500" />;
      case 'at-risk':
        return <FiAlertCircle className="text-yellow-500" />;
      case 'behind':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiClock className="text-blue-500" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FiTarget className="text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex items-center">
          {getStatusIcon()}
          <span className={`font-bold ml-2 ${getStatusColor()}`}>{progress}%</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`${getStatusColor().replace('text', 'bg')} h-2.5 rounded-full`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        {keyResults.map((kr, index) => (
          <div key={index} className="border-t pt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{kr.title}</span>
              <span className={`text-sm ${kr.progress >= 100 ? 'text-green-500' : 'text-gray-600'}`}>
                {kr.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div 
                className={`${kr.progress >= 100 ? 'bg-green-500' : 'bg-blue-500'} h-1.5 rounded-full`}
                style={{ width: `${kr.progress}%` }}
              ></div>
            </div>
            {kr.description && (
              <p className="text-xs text-gray-500 mt-1">{kr.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalAlignment; 