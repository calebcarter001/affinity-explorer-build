import React from 'react';
import { badge } from '../../styles/design-system';

/**
 * Reusable Badge component
 */
const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  rounded = false,
  className = '',
  ...props 
}) => {
  const getVariantClasses = () => {
    switch(variant) {
      case 'success':
        return badge.success;
      case 'warning':
        return badge.warning;
      case 'danger':
        return badge.danger;
      case 'info':
        return badge.info;
      case 'primary':
        return badge.primary;
      default:
        return badge.neutral;
    }
  };

  const getSizeClasses = () => {
    switch(size) {
      case 'small':
        return badge.small;
      case 'large':
        return badge.large;
      default: // medium
        return badge.medium;
    }
  };

  return (
    <span 
      className={`
        ${badge.base}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${rounded ? badge.rounded : badge.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge; 