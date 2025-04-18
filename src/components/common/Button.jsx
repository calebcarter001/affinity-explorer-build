import React from 'react';
import styled, { css } from 'styled-components';

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
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  cursor: pointer;
  gap: 0.5rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${props => {
    switch(props.size) {
      case 'small':
        return css`
          padding: 0.375rem 0.75rem;
          font-size: var(--font-size-xs);
        `;
      case 'large':
        return css`
          padding: 0.75rem 1.5rem;
          font-size: var(--font-size-md);
        `;
      default: // medium
        return css`
          padding: 0.5rem 1rem;
          font-size: var(--font-size-sm);
        `;
    }
  }}
  
  ${props => {
    switch(props.variant) {
      case 'secondary':
        return css`
          background-color: transparent;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          
          &:hover:not(:disabled) {
            background-color: rgba(74, 108, 247, 0.1);
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: var(--primary-color);
          border: none;
          
          &:hover:not(:disabled) {
            background-color: rgba(74, 108, 247, 0.1);
          }
        `;
      case 'danger':
        return css`
          background-color: var(--danger-color);
          color: white;
          border: none;
          
          &:hover:not(:disabled) {
            background-color: #dc2626;
          }
        `;
      default: // primary
        return css`
          background-color: var(--primary-color);
          color: white;
          border: none;
          
          &:hover:not(:disabled) {
            background-color: #3451c4;
          }
        `;
    }
  }}
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Button; 