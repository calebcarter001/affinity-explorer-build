import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiClock, FiSettings } from 'react-icons/fi';

const ImplementationStatus = ({
  title,
  status,
  progress,
  lastUpdated,
  owner,
  metrics = [],
  className = ''
}) => {
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-blue-500';
      case 'at-risk':
        return 'text-yellow-500';
      case 'behind':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'in-progress':
        return <FiClock className="text-blue-500" />;
      case 'at-risk':
        return <FiAlertCircle className="text-yellow-500" />;
      case 'behind':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiSettings className="text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FiSettings className="text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex items-center">
          {getStatusIcon()}
          <span className={`font-bold ml-2 ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
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

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500">Last Updated</div>
          <div className="text-sm font-medium">{formatDate(lastUpdated)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Owner</div>
          <div className="text-sm font-medium">{owner}</div>
        </div>
      </div>

      {metrics.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Implementation Metrics</h4>
          {metrics.map((metric, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{metric.label}</span>
              <span className="text-sm font-medium">{metric.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImplementationStatus; 