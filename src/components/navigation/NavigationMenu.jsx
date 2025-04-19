import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationItem from './NavigationItem';
import { navigation } from '../../styles/design-system';
import { 
  FiHome, 
  FiBook, 
  FiSearch, 
  FiLifeBuoy, 
  FiLayers, 
  FiCpu, 
  FiCode, 
  FiBarChart2, 
  FiSettings, 
  FiHelpCircle 
} from 'react-icons/fi';

/**
 * Main navigation menu component
 */
const NavigationMenu = () => {
  const location = useLocation();
  
  const navigationItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <FiHome />
    },
    {
      path: '/affinity-library',
      label: 'Affinity Library',
      icon: <FiBook />
    },
    {
      path: '/scoring-explorer',
      label: 'Property Affinity Scores',
      icon: <FiSearch />
    },
    {
      path: '/lifecycle-tracker',
      label: 'Lifecycle Tracker',
      icon: <FiLifeBuoy />
    },
    {
      path: '/affinity-combination',
      label: 'Affinity Combination',
      icon: <FiLayers />
    },
    {
      path: '/agent-view',
      label: 'Agent View',
      icon: <FiCpu />
    },
    {
      path: '/implementation-guide',
      label: 'Implementation Guide',
      icon: <FiCode />
    },
    {
      path: '/reports-analytics',
      label: 'Reports & Analytics',
      icon: <FiBarChart2 />
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <FiSettings />
    },
    {
      path: '/help-support',
      label: 'Help & Support',
      icon: <FiHelpCircle />
    }
  ];
  
  return (
    <nav className={navigation.menu.container}>
      {navigationItems.map(item => (
        <NavigationItem 
          key={item.path}
          path={item.path}
          label={item.label}
          icon={item.icon}
          isActive={
            item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path)
          }
        />
      ))}
    </nav>
  );
};

export default NavigationMenu; 