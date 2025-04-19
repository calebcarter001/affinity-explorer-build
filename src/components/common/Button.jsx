import React from 'react';
import { button, layout } from '../../styles/design-system';

/**
 * Reusable Button component
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const getVariantClasses = () => {
    switch(variant) {
      case 'secondary':
        return button.secondary;
      case 'text':
        return button.text;
      case 'danger':
        return button.danger;
      default: // primary
        return button.primary;
    }
  };

  const getSizeClasses = () => {
    switch(size) {
      case 'small':
        return button.small;
      case 'large':
        return button.large;
      default: // medium
        return button.medium;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${button.base}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? layout.fullWidth : ''}
        ${disabled ? button.disabled : ''}
        ${className}
      `}
      {...props}
    >
      {icon && <span className={button.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button; 