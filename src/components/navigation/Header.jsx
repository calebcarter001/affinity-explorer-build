import React from 'react';
import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Header component for mobile view
 */
const Header = ({ onMenuClick }) => {
  const { theme } = useAppContext();
  
  return (
    <HeaderContainer theme={theme}>
      <MenuButton onClick={onMenuClick}>
        <FiMenu />
      </MenuButton>
      
      <MobileThemeToggle>
        <ThemeToggle />
      </MobileThemeToggle>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
`;

const MenuButton = styled.button`
  background: transparent;
  font-size: 1.5rem;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileThemeToggle = styled.div`
  margin-left: auto;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

export default Header; 