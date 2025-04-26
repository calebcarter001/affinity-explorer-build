import React from 'react';
import styled from 'styled-components';
import Card from '../common/Card';

/**
 * Agent card component for displaying agent information
 */
const AgentCard = ({ 
  agent, 
  title,
  description,
  icon,
  active,
  onClick,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`card-prominent flex items-center gap-4 ${active ? 'border-blue-500 border-2' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <AgentIcon>{icon}</AgentIcon>}
      <AgentContent>
        <AgentTitle>{title}</AgentTitle>
        {description && <AgentDescription>{description}</AgentDescription>}
      </AgentContent>
    </div>
  );
};

const AgentCardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: ${props => props.active ? 'rgba(74, 108, 247, 0.1)' : 'var(--card-bg-light)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  cursor: pointer;
  transition: var(--transition-normal);
  
  .dark & {
    background-color: ${props => props.active ? 'rgba(74, 108, 247, 0.1)' : 'var(--card-bg-dark)'};
    border-color: ${props => props.active ? 'var(--primary-color)' : '#374151'};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
`;

const AgentIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: rgba(74, 108, 247, 0.1);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const AgentContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const AgentTitle = styled.h3`
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 0.25rem;
`;

const AgentDescription = styled.p`
  font-size: var(--font-size-sm);
  color: var(--secondary-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default AgentCard; 