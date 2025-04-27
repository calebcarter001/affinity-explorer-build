import React from 'react';
import PropTypes from 'prop-types';

const ModernProgressBar = ({ progress, color = 'blue', showLabel = false, label }) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  
  // Get color classes based on color prop
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'blue':
        return 'bg-blue-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-600">{label}</span>
          <span className="text-xs font-medium text-gray-700">{normalizedProgress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${getColorClasses()} h-2 rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
    </div>
  );
};

ModernProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['green', 'blue', 'yellow', 'red', 'gray']),
  showLabel: PropTypes.bool,
  label: PropTypes.string
};

export default ModernProgressBar; 