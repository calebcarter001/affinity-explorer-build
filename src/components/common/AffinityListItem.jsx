import React from 'react';
import styled from 'styled-components';
import { FiChevronRight } from 'react-icons/fi';
import { useAppContext } from '../../contexts/AppContext';

const AffinityListItem = ({ affinity }) => {
  const { addToRecentlyViewed } = useAppContext();
  
  const handleClick = () => {
    addToRecentlyViewed(affinity);
  };
  
  return (
    <ListItemContainer onClick={handleClick}>
      <IconAndName>
        <IconContainer>{affinity.icon || '📋'}</IconContainer>
        <NameAndDescription>
          <AffinityName>{affinity.name}</AffinityName>
          <AffinityDescription>{affinity.description}</AffinityDescription>
        </NameAndDescription>
      </IconAndName>
      
      <CategoryBadge>{affinity.category}</CategoryBadge>
      
      <ScoreContainer>
        <ScoreBox>
          <ScoreLabel>Score</ScoreLabel>
          <ScoreValue>
            {affinity.score ? (
              <>{affinity.score.toFixed(1)}/10</>
            ) : (
              'N/A'
            )}
          </ScoreValue>
        </ScoreBox>
        <ScoreBox>
          <ScoreLabel>Coverage</ScoreLabel>
          <ScoreValue>
            {affinity.coverage ? (
              <>{affinity.coverage}%</>
            ) : (
              'N/A'
            )}
          </ScoreValue>
        </ScoreBox>
      </ScoreContainer>
      
      <StatusBadge status={affinity.status}>{affinity.status}</StatusBadge>
    </ListItemContainer>
  );
};

const ListItemContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--card-bg-light);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const IconAndName = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding-right: 1rem;
`;

const IconContainer = styled.div`
  font-size: 1.5rem;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const NameAndDescription = styled.div`
  min-width: 0;
`;

const AffinityName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AffinityDescription = styled.p`
  color: var(--secondary-color);
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  
  @media (max-width: 1024px) {
    max-width: 200px;
  }
`;

const ScoreContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 0 1.5rem;
  
  @media (max-width: 768px) {
    margin: 0;
    width: 100%;
    justify-content: space-between;
  }
`;

const ScoreBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreLabel = styled.span`
  font-size: 0.75rem;
  color: var(--secondary-color);
  margin-bottom: 0.25rem;
`;

const ScoreValue = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
`;

const CategoryBadge = styled.div`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: rgba(74, 108, 247, 0.1);
  color: var(--primary-color);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 1.5rem;
  
  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 1.5rem;
  
  ${props => {
    switch(props.status) {
      case 'Validated':
        return `
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        `;
      case 'In Development':
        return `
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
        `;
      case 'Proposed':
        return `
          background-color: rgba(59, 130, 246, 0.1);
          color: var(--info-color);
        `;
      case 'Deprecated':
        return `
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger-color);
        `;
      default:
        return `
          background-color: rgba(107, 114, 128, 0.1);
          color: var(--secondary-color);
        `;
    }
  }}
  
  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

export default AffinityListItem; 