import React from 'react';
import { scoring, layout, typography } from '../../styles/design-system';

/**
 * Score visualization bar component
 */
const ScoreBar = ({ 
  score, 
  maxScore = 10,
  showValue = true,
  height = 'medium',
  animate = true,
  className = '',
  ...props 
}) => {
  const percentage = (score / maxScore) * 100;
  
  const getHeightClasses = () => {
    switch(height) {
      case 'small':
        return scoring.bar.small;
      case 'large':
        return scoring.bar.large;
      default: // medium
        return scoring.bar.medium;
    }
  };

  const getColorClasses = () => {
    return scoring.bar.primary;
  };
  
  return (
    <div className={`${scoring.bar.container} ${className}`} {...props}>
      <div className={`${scoring.bar.track} ${getHeightClasses()}`}>
        <div 
          className={`
            ${scoring.bar.fill} 
            ${getColorClasses()}
            ${animate ? scoring.bar.animate : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className={`${typography.semibold} text-gray-900 dark:text-gray-100 ${scoring.bar.value}`}>
          {score.toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default ScoreBar; 