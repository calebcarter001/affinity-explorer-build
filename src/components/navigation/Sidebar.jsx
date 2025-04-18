import React from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import NavigationMenu from './NavigationMenu';
import ThemeToggle from './ThemeToggle';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Main sidebar navigation component
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { theme } = useAppContext();
  
  return (
    <SidebarContainer className={isOpen ? 'open' : ''} theme={theme}>
      <LogoSection>
        <Logo>
          <LogoImage src="/logo.svg" alt="Affinity Explorer" />
          <LogoText>Affinity Explorer</LogoText>
        </Logo>
        <CloseButton onClick={onClose}>
          <FiX />
        </CloseButton>
      </LogoSection>
      
      <NavigationMenu />
      
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.aside`
  width: 260px;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-right: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: var(--z-fixed);
  overflow-y: auto;
  transition: var(--transition-normal);
  
  @media (max-width: 768px) {
    transform: translateX(-100%);
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoImage = styled.img`
  width: 2rem;
  height: 2rem;
`;

const LogoText = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const CloseButton = styled.button`
  background: transparent;
  display: none;
  font-size: 1.25rem;
  color: var(--secondary-color);
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding-top: 1rem;
`;

export default Sidebar; 