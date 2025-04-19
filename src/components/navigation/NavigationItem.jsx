import React from 'react';
import { NavLink } from 'react-router-dom';
import { navigation, layout, typography } from '../../styles/design-system';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Navigation item component
 */
const NavigationItem = ({ path, label, icon, isActive }) => {
  const { theme } = useAppContext();
  
  return (
    <NavLink 
      to={path} 
      className={({ isActive }) => `
        ${navigation.item.base}
        ${layout.flex.base}
        ${layout.flex.itemsCenter}
        ${layout.flex.gap}
        ${isActive ? navigation.item.active : navigation.item.default}
        ${theme === 'dark' ? navigation.item.dark : navigation.item.light}
      `}
    >
      <div className={navigation.item.icon}>{icon}</div>
      <span className={typography.small}>{label}</span>
    </NavLink>
  );
};

export default NavigationItem; 