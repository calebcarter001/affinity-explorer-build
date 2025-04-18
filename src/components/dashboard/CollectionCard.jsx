import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiFolder } from 'react-icons/fi';

const CollectionCard = ({ title, count, to }) => {
  return (
    <CardContainer to={to}>
      <IconContainer>
        <FiFolder />
      </IconContainer>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardCount>{count} affinities</CardCount>
      </CardContent>
    </CardContainer>
  );
};

const CardContainer = styled(Link)`
  display: flex;
  align-items: center;
  background-color: var(--card-bg-light);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 8px;
  background-color: rgba(74, 108, 247, 0.1);
  color: var(--primary-color);
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const CardCount = styled.p`
  font-size: 0.875rem;
  color: var(--secondary-color);
`;

export default CollectionCard; 