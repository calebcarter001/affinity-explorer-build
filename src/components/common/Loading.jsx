import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Loading indicator component
 */
const Loading = ({ 
  size = 'medium',
  color = 'primary',
  text = 'Loading...',
  fullPage = false,
  ...props 
}) => {
  return (
    <LoadingContainer fullPage={fullPage} {...props}>
      <Spinner size={size} color={color} />
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  ${props => props.fullPage && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: var(--z-modal);
    
    .dark & {
      background-color: rgba(0, 0, 0, 0.7);
    }
  `}
`;

const Spinner = styled.div`
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  border-top-color: transparent;
  
  ${props => {
    switch(props.size) {
      case 'small':
        return `
          width: 1.5rem;
          height: 1.5rem;
          border-width: 2px;
        `;
      case 'large':
        return `
          width: 3rem;
          height: 3rem;
          border-width: 4px;
        `;
      default: // medium
        return `
          width: 2rem;
          height: 2rem;
          border-width: 3px;
        `;
    }
  }}
  
  ${props => {
    switch(props.color) {
      case 'secondary':
        return `border: solid var(--secondary-color);`;
      case 'success':
        return `border: solid var(--success-color);`;
      case 'danger':
        return `border: solid var(--danger-color);`;
      case 'warning':
        return `border: solid var(--warning-color);`;
      case 'info':
        return `border: solid var(--info-color);`;
      default: // primary
        return `border: solid var(--primary-color);`;
    }
  }}
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: var(--secondary-color);
  font-size: var(--font-size-sm);
`;

export default Loading; 