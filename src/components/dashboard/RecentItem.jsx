import React from 'react';
import styled from 'styled-components';
import { FiClock, FiStar } from 'react-icons/fi';

const RecentItem = ({ item, onFavorite }) => {
  return (
    <ItemContainer>
      <ItemIcon>
        {item.type === 'collection' ? <FiStar /> : <FiClock />}
      </ItemIcon>
      <ItemContent>
        <ItemTitle>{item.name}</ItemTitle>
        <ItemMeta>
          {item.type === 'collection' ? 'Collection' : 'Recently Viewed'} • {item.lastViewed}
        </ItemMeta>
      </ItemContent>
      <FavoriteButton onClick={() => onFavorite(item.id)}>
        <FiStar fill={item.isFavorite ? 'currentColor' : 'none'} />
      </FavoriteButton>
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--primary-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: var(--primary-color);
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ItemMeta = styled.p`
  font-size: 0.875rem;
  color: var(--secondary-color);
`;

const FavoriteButton = styled.button`
  background: none;
  border: none;
  color: var(--secondary-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--hover-color);
    color: var(--primary-color);
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export default RecentItem; 