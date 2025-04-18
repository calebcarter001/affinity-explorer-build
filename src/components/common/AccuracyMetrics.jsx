import React from 'react';
import { FiCheckCircle, FiUserCheck, FiMessageSquare } from 'react-icons/fi';

const AccuracyMetrics = ({ 
  title, 
  current, 
  target, 
  totalValidated, 
  totalAffinities,
  breakdown = null,
  className = ''
}) => {
  // Calculate percentage
  const percentage = Math.round((current / 100) * 100);
  const targetPercentage = Math.round((target / 100) * 100);
  
  // Determine status
  const getStatus = () => {
    if (current >= target) return 'complete';
    if (current >= target * 0.8) return 'in-progress';
    if (current >= target * 0.6) return 'at-risk';
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
  
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center">
          <span className={`font-bold ${getStatusColor()}`}>{current}%</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-gray-600">{target}%</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{totalValidated} of {totalAffinities} affinities validated</span>
          <span>{percentage}% of target</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`${getStatusColor().replace('text', 'bg')} h-2.5 rounded-full`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Target: {target}% validation accuracy
        </div>
      </div>
      
      {breakdown && (
        <div className="mt-2">
          <h4 className="font-medium mb-2 text-sm">Validation Methods:</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <FiUserCheck className="text-blue-500 text-xs" />
              </div>
              <span className="text-sm text-gray-700">Human Validated</span>
              <span className="ml-auto font-medium">{breakdown.humanValidated} affinities</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <FiMessageSquare className="text-green-500 text-xs" />
              </div>
              <span className="text-sm text-gray-700">Review Validated</span>
              <span className="ml-auto font-medium">{breakdown.reviewValidated} affinities</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccuracyMetrics; 