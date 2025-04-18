import React from 'react';
import styled from 'styled-components';
import { FiUser, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'create':
        return <FiPlus />;
      case 'edit':
        return <FiEdit />;
      case 'delete':
        return <FiTrash2 />;
      default:
        return <FiUser />;
    }
  };

  return (
    <FeedContainer>
      {activities.map((activity) => (
        <ActivityItem key={activity.id}>
          <ActivityIcon type={activity.type}>
            {getActivityIcon(activity.type)}
          </ActivityIcon>
          <ActivityContent>
            <ActivityText>
              <strong>{activity.user}</strong> {activity.action}{' '}
              <strong>{activity.target}</strong>
            </ActivityText>
            <ActivityTime>{activity.timestamp}</ActivityTime>
          </ActivityContent>
        </ActivityItem>
      ))}
    </FeedContainer>
  );
};

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--background-color);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-color);
  }
`;

const ActivityIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ type }) => {
    switch (type) {
      case 'create':
        return 'var(--success-color-light)';
      case 'edit':
        return 'var(--warning-color-light)';
      case 'delete':
        return 'var(--error-color-light)';
      default:
        return 'var(--primary-color-light)';
    }
  }};
  color: ${({ type }) => {
    switch (type) {
      case 'create':
        return 'var(--success-color)';
      case 'edit':
        return 'var(--warning-color)';
      case 'delete':
        return 'var(--error-color)';
      default:
        return 'var(--primary-color)';
    }
  }};

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const ActivityTime = styled.span`
  font-size: 0.75rem;
  color: var(--secondary-color);
  margin-top: 0.25rem;
  display: block;
`;

export default ActivityFeed; 