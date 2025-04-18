import React from 'react';
import styled from 'styled-components';

/**
 * Empty state component for when there's no data to display
 */
const EmptyState = ({ 
  title = 'No data found',
  message = 'There are no items to display at this time.',
  action,
  icon,
  ...props 
}) => {
  return (
    <EmptyStateContainer {...props}>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyMessage>{message}</EmptyMessage>
      {action && <ActionWrapper>{action}</ActionWrapper>}
    </EmptyStateContainer>
  );
};

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  background-color: var(--card-bg-light);
  border-radius: var(--radius-lg);
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  opacity: 0.7;
`;

const EmptyTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 0.75rem;
  color: var(--secondary-color);
`;

const EmptyMessage = styled.p`
  font-size: var(--font-size-sm);
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  max-width: 400px;
`;

const ActionWrapper = styled.div``;

export default EmptyState; 