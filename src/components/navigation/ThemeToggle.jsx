import React from 'react';
import styled from 'styled-components';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Theme toggle component
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppContext();
  
  return (
    <ToggleButton onClick={toggleTheme} theme={theme}>
      {theme === 'light' ? <FiMoon /> : <FiSun />}
      <ToggleText>
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </ToggleText>
    </ToggleButton>
  );
};

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  background-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  color: inherit;
  font-weight: var(--font-weight-medium);
  transition: var(--transition-normal);
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
  
  svg {
    font-size: 1.25rem;
  }
`;

const ToggleText = styled.span`
  font-size: var(--font-size-sm);
`;

export default ThemeToggle; 