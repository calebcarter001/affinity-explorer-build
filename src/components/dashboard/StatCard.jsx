import React from 'react';
import styled from 'styled-components';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const StatCard = ({ title, value, change, positive }) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <CardValue>{value}</CardValue>
      {change && (
        <ChangeIndicator positive={positive}>
          {positive ? <FiArrowUp /> : <FiArrowDown />}
          <span>{change}</span>
        </ChangeIndicator>
      )}
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: var(--card-bg-light);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  color: var(--secondary-color);
  margin-bottom: 0.75rem;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const ChangeIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: ${props => props.positive ? 'var(--success-color)' : 'var(--danger-color)'};
  
  svg {
    font-size: 1rem;
  }
`;

export default StatCard; 