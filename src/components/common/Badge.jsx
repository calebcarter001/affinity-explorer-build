import React from 'react';
import styled, { css } from 'styled-components';

/**
 * Reusable Badge component
 */
const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  rounded = false,
  ...props 
}) => {
  return (
    <BadgeContainer 
      variant={variant}
      size={size}
      rounded={rounded}
      {...props}
    >
      {children}
    </BadgeContainer>
  );
};

const BadgeContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-medium);
  border-radius: ${props => props.rounded ? 'var(--radius-full)' : 'var(--radius-sm)'};
  
  ${props => {
    switch(props.size) {
      case 'small':
        return css`
          padding: 0.125rem 0.375rem;
          font-size: var(--font-size-xs);
        `;
      case 'large':
        return css`
          padding: 0.375rem 0.75rem;
          font-size: var(--font-size-sm);
        `;
      default: // medium
        return css`
          padding: 0.25rem 0.5rem;
          font-size: var(--font-size-xs);
        `;
    }
  }}
  
  ${props => {
    switch(props.variant) {
      case 'success':
        return css`
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        `;
      case 'warning':
        return css`
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
        `;
      case 'danger':
        return css`
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger-color);
        `;
      case 'info':
        return css`
          background-color: rgba(59, 130, 246, 0.1);
          color: var(--info-color);
        `;
      case 'primary':
        return css`
          background-color: rgba(74, 108, 247, 0.1);
          color: var(--primary-color);
        `;
      default:
        return css`
          background-color: rgba(107, 114, 128, 0.1);
          color: var(--secondary-color);
        `;
    }
  }}
`;

export default Badge; 