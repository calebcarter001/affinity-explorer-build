import React from 'react';
import PropTypes from 'prop-types';
import { FiCheckCircle, FiAlertCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import ModernProgressBar from './ModernProgressBar';

const ImplementationStatus = ({ title, status, progress, lastUpdated, owner, metrics }) => {
  // Get status icon based on status
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'in-progress':
        return <FiTrendingUp className="text-blue-500" />;
      case 'at-risk':
        return <FiClock className="text-yellow-500" />;
      case 'behind':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  // Get status color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in-progress':
        return 'blue';
      case 'at-risk':
        return 'yellow';
      case 'behind':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Get status text based on status
  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Ready for Production';
      case 'in-progress':
        return 'In Progress';
      case 'at-risk':
        return 'At Risk';
      case 'behind':
        return 'Behind Schedule';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-lg">{title}</h4>
        <div className="flex items-center">
          {getStatusIcon()}
          <span className={`ml-2 text-sm font-medium text-${getStatusColor()}-600`}>
            {getStatusText()}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <ModernProgressBar 
          progress={progress} 
          color={getStatusColor()} 
          showLabel={true}
          label={`${progress}% Complete`}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {metrics.map((metric, index) => (
          <div key={index} className="text-sm">
            <span className="text-gray-500">{metric.label}:</span>
            <span className="ml-1 font-medium">{metric.value}</span>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500">
        <div>Last Updated: {lastUpdated}</div>
        <div>Owner: {owner}</div>
      </div>
    </div>
  );
};

ImplementationStatus.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['completed', 'in-progress', 'at-risk', 'behind', 'unknown']).isRequired,
  progress: PropTypes.number.isRequired,
  lastUpdated: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ImplementationStatus; 