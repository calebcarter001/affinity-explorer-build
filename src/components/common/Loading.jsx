import React from 'react';
import { loading, layout, typography } from '../../styles/design-system';

/**
 * Loading indicator component
 */
const Loading = ({ 
  size = 'medium',
  color = 'primary',
  text = 'Loading...',
  fullPage = false,
  className = '',
  ...props 
}) => {
  const getSizeClasses = () => {
    switch(size) {
      case 'small':
        return loading.small;
      case 'large':
        return loading.large;
      default: // medium
        return loading.medium;
    }
  };

  const getColorClasses = () => {
    switch(color) {
      case 'secondary':
        return loading.secondary;
      case 'success':
        return loading.success;
      case 'danger':
        return loading.danger;
      case 'warning':
        return loading.warning;
      case 'info':
        return loading.info;
      default: // primary
        return loading.primary;
    }
  };

  return (
    <div 
      className={`
        ${layout.flex.col}
        ${layout.flex.center}
        ${loading.container}
        ${fullPage ? loading.fullPage : ''}
        ${className}
      `}
      {...props}
    >
      <div className={`
        ${loading.spinner}
        ${getSizeClasses()}
        ${getColorClasses()}
      `} />
      {text && <p className={`${typography.small} ${loading.text}`}>{text}</p>}
    </div>
  );
};

export default Loading; 