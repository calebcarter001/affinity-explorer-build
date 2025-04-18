import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import MobileNavOverlay from '../components/navigation/MobileNavOverlay';
import { useAppContext } from '../contexts/AppContext';

const MainLayout = () => {
  const { theme } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <MainContent>
        <Header onMenuClick={toggleSidebar} />
        
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainContent>
      
      <MobileNavOverlay isOpen={sidebarOpen} onClose={closeSidebar} />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: 1.5rem;
`;

export default MainLayout; 