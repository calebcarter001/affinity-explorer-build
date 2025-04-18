import React from 'react';
import { FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

const ProgressTracker = ({ 
  title, 
  current, 
  total, 
  target, 
  unit = '', 
  status = 'in-progress',
  breakdown = null,
  className = ''
}) => {
  // Calculate percentage
  const percentage = Math.round((current / total) * 100);
  const targetPercentage = target ? Math.round((target / total) * 100) : null;
  
  // Determine status color
  const getStatusColor = () => {
    switch (status) {
      case 'complete':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'behind':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  // Determine status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <FiCheck className="text-white" />;
      case 'in-progress':
        return <FiClock className="text-white" />;
      case 'at-risk':
      case 'behind':
        return <FiAlertCircle className="text-white" />;
      default:
        return <FiClock className="text-white" />;
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{current}{unit} of {total}{unit}</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`${getStatusColor()} h-2.5 rounded-full`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        {targetPercentage && (
          <div className="mt-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Target: {target}{unit}</span>
              <span>{targetPercentage}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
              <div 
                className="bg-gray-400 h-1 rounded-full" 
                style={{ width: `${targetPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {breakdown && (
        <div className="mt-2 text-sm">
          <h4 className="font-medium mb-1">Breakdown:</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(breakdown).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker; 