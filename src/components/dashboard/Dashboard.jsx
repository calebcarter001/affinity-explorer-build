import React, { useState } from 'react';
import styled from 'styled-components';
import RecentItem from './RecentItem';
import ActivityFeed from './ActivityFeed';

const Dashboard = () => {
  const [recentItems, setRecentItems] = useState([
    {
      id: '1',
      type: 'document',
      name: 'Project Proposal',
      lastModified: '2 hours ago',
      isFavorite: false
    },
    {
      id: '2',
      type: 'spreadsheet',
      name: 'Q1 Financial Report',
      lastModified: '1 day ago',
      isFavorite: true
    },
    {
      id: '3',
      type: 'presentation',
      name: 'Team Meeting Slides',
      lastModified: '3 days ago',
      isFavorite: false
    }
  ]);

  const [activities] = useState([
    {
      id: '1',
      type: 'create',
      user: 'John Doe',
      action: 'created',
      target: 'Project Proposal',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'edit',
      user: 'Jane Smith',
      action: 'updated',
      target: 'Q1 Financial Report',
      timestamp: '1 day ago'
    },
    {
      id: '3',
      type: 'delete',
      user: 'Mike Johnson',
      action: 'deleted',
      target: 'Old Budget Plan',
      timestamp: '2 days ago'
    }
  ]);

  const handleFavorite = (itemId) => {
    setRecentItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );
  };

  return (
    <DashboardContainer>
      <DashboardSection>
        <SectionTitle>Recent Items</SectionTitle>
        <RecentItemsGrid>
          {recentItems.map(item => (
            <RecentItem
              key={item.id}
              item={item}
              onFavorite={() => handleFavorite(item.id)}
            />
          ))}
        </RecentItemsGrid>
      </DashboardSection>

      <DashboardSection>
        <SectionTitle>Recent Activity</SectionTitle>
        <ActivityFeed activities={activities} />
      </DashboardSection>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DashboardSection = styled.section`
  background-color: var(--surface-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: var(--text-primary);
`;

const RecentItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

export default Dashboard; 