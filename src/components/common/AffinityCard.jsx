import React from 'react';
import styled from 'styled-components';
import { FiStar, FiHeart } from 'react-icons/fi';
import { useAppContext } from '../../contexts/AppContext';

const AffinityCard = ({ affinity }) => {
  const { favorites, toggleFavorite, addToRecentlyViewed } = useAppContext();
  const isFavorite = favorites.includes(affinity.id);
  
  const handleClick = () => {
    addToRecentlyViewed(affinity);
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(affinity.id);
  };
  
  return (
    <CardContainer onClick={handleClick}>
      <CardHeader>
        <IconContainer>{affinity.icon || '📋'}</IconContainer>
        <StatusBadge status={affinity.status}>{affinity.status}</StatusBadge>
        <FavoriteButton 
          isFavorite={isFavorite} 
          onClick={handleFavoriteClick}
        >
          <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
        </FavoriteButton>
      </CardHeader>
      
      <CardTitle>{affinity.name}</CardTitle>
      <CardDescription>{affinity.description}</CardDescription>
      
      <ScoreSection>
        <ScoreItem>
          <ScoreLabel>Score:</ScoreLabel>
          <ScoreValue>
            {affinity.score ? (
              <>{affinity.score.toFixed(1)}/10</>
            ) : (
              'N/A'
            )}
          </ScoreValue>
        </ScoreItem>
        <ScoreItem>
          <ScoreLabel>Coverage:</ScoreLabel>
          <ScoreValue>
            {affinity.coverage ? (
              <>{affinity.coverage}%</>
            ) : (
              'N/A'
            )}
          </ScoreValue>
        </ScoreItem>
      </ScoreSection>
      
      <CategoryTag>{affinity.category}</CategoryTag>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: var(--card-bg-light);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const IconContainer = styled.div`
  font-size: 1.5rem;
  margin-right: 0.75rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
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
`;

const FavoriteButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.25rem;
  margin-left: auto;
  color: ${props => props.isFavorite ? 'var(--danger-color)' : 'var(--secondary-color)'};
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  color: var(--secondary-color);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ScoreSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const ScoreLabel = styled.span`
  font-size: 0.75rem;
  color: var(--secondary-color);
  margin-bottom: 0.25rem;
`;

const ScoreValue = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

const CategoryTag = styled.div`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: rgba(74, 108, 247, 0.1);
  color: var(--primary-color);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export default AffinityCard; 