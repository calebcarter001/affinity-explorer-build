import React from 'react';
import styled, { css } from 'styled-components';

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
  ...props 
}) => {
  return (
    <CardContainer 
      variant={variant}
      padding={padding}
      onClick={onClick}
      clickable={!!onClick}
      {...props}
    >
      {(title || actions) && (
        <CardHeader>
          <HeaderContent>
            {title && <CardTitle>{title}</CardTitle>}
            {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
          </HeaderContent>
          {actions && <CardActions>{actions}</CardActions>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: var(--card-bg-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: var(--transition-normal);
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
  
  ${props => props.clickable && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
    }
  `}
  
  ${props => {
    switch(props.variant) {
      case 'outlined':
        return css`
          border: 1px solid var(--border-color);
          box-shadow: none;
          
          .dark & {
            border-color: #374151;
          }
        `;
      case 'elevated':
        return css`
          box-shadow: var(--shadow-md);
        `;
      default:
        return '';
    }
  }}
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
  
  .dark & {
    border-color: #374151;
  }
`;

const HeaderContent = styled.div``;

const CardTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 0.25rem;
`;

const CardSubtitle = styled.div`
  font-size: var(--font-size-sm);
  color: var(--secondary-color);
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CardContent = styled.div`
  ${props => {
    switch(props.padding) {
      case 'small':
        return css`padding: 0.75rem;`;
      case 'large':
        return css`padding: 2rem;`;
      case 'none':
        return css`padding: 0;`;
      default: // medium
        return css`padding: 1.5rem;`;
    }
  }}
`;

export default Card; 