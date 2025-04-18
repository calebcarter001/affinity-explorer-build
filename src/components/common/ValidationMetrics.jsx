import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiClock, FiBarChart2 } from 'react-icons/fi';

const ValidationMetrics = ({
  title,
  current,
  target,
  totalValidated,
  totalAffinities,
  breakdown = [],
  className = ''
}) => {
  // Calculate percentage
  const percentage = Math.round((current / target) * 100);
  
  // Determine status
  const getStatus = () => {
    if (percentage >= 100) return 'complete';
    if (percentage >= 80) return 'in-progress';
    if (percentage >= 60) return 'at-risk';
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
          <FiBarChart2 className="text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex items-center">
          {getStatusIcon()}
          <span className={`font-bold ml-2 ${getStatusColor()}`}>{percentage}%</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`${getStatusColor().replace('text', 'bg')} h-2.5 rounded-full`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{current}</div>
          <div className="text-sm text-gray-500">Current</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{target}</div>
          <div className="text-sm text-gray-500">Target</div>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Validation Breakdown</h4>
          {breakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Validated</span>
          <span className="text-sm font-medium">{totalValidated} / {totalAffinities}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
          <div 
            className="bg-blue-500 h-1.5 rounded-full"
            style={{ width: `${(totalValidated / totalAffinities) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ValidationMetrics; 