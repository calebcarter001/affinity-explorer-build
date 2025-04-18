import React from 'react';
import { FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';

const CompletenessIndicator = ({ 
  title, 
  complete, 
  incomplete, 
  total, 
  requiredSubScores = 5,
  breakdown = null,
  className = ''
}) => {
  // Calculate percentage
  const percentage = Math.round((complete / total) * 100);
  
  // Determine status
  const getStatus = () => {
    if (percentage >= 90) return 'complete';
    if (percentage >= 70) return 'in-progress';
    if (percentage >= 50) return 'at-risk';
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
        <span className={`font-bold ${getStatusColor()}`}>{percentage}%</span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{complete} of {total} complete</span>
          <span>{incomplete} incomplete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`${getStatusColor().replace('text', 'bg')} h-2.5 rounded-full`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Required: {requiredSubScores} sub-scores per affinity
        </div>
      </div>
      
      {breakdown && (
        <div className="mt-2">
          <h4 className="font-medium mb-2 text-sm">Missing Sub-Scores:</h4>
          <div className="space-y-2">
            {Object.entries(breakdown).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
                  <FiX className="text-red-500 text-xs" />
                </div>
                <span className="text-sm text-gray-700">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                <span className="ml-auto font-medium">{value} affinities</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletenessIndicator; 