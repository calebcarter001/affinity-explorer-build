import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { layout } from '../styles/design-system';
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
    <div className={layout.mainLayout.container}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <main className={layout.mainLayout.content}>
        <Header onMenuClick={toggleSidebar} />
        
        <div className={layout.mainLayout.wrapper}>
          <Outlet />
        </div>
      </main>
      
      <MobileNavOverlay isOpen={sidebarOpen} onClose={closeSidebar} />
    </div>
  );
};

export default MainLayout;