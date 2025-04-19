import React from 'react';
import { card, layout, typography } from '../../styles/design-system';

/**
 * Reusable Card component
 */
const Card = ({ 
  children, 
  title,
  subtitle, 
  actions,
  variant = 'default',
  padding = 'medium',
  onClick,
  className = '',
  ...props 
}) => {
  const getVariantClasses = () => {
    switch(variant) {
      case 'outlined':
        return card.outlined;
      case 'elevated':
        return card.elevated;
      default:
        return card.base;
    }
  };

  const getPaddingClasses = () => {
    switch(padding) {
      case 'small':
        return card.paddingSmall;
      case 'large':
        return card.paddingLarge;
      case 'none':
        return '';
      default: // medium
        return card.paddingMedium;
    }
  };

  return (
    <div 
      className={`
        ${getVariantClasses()}
        ${getPaddingClasses()}
        ${onClick ? card.interactive : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {(title || actions) && (
        <div className={`${layout.flex.between} ${card.header}`}>
          <div>
            {title && <h3 className={typography.h3}>{title}</h3>}
            {subtitle && <div className={typography.small}>{subtitle}</div>}
          </div>
          {actions && <div className={layout.flex.gap}>{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card; 