import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Navigation item component
 */
const NavigationItem = ({ path, label, icon, isActive }) => {
  const { theme } = useAppContext();
  
  return (
    <NavItemLink 
      to={path} 
      className={isActive ? 'active' : ''} 
      theme={theme}
    >
      <IconWrapper>{icon}</IconWrapper>
      <ItemLabel>{label}</ItemLabel>
    </NavItemLink>
  );
};

const NavItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-normal);
  color: inherit;
  text-decoration: none;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &.active {
    background-color: var(--primary-color);
    color: white;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const ItemLabel = styled.span`
  font-size: var(--font-size-sm);
`;

export default NavigationItem; 