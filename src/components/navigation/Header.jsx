import React from 'react';
import { FiMenu } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { header, layout, button } from '../../styles/design-system';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Header component for mobile view
 */
const Header = ({ onMenuClick }) => {
  const { theme } = useAppContext();
  
  return (
    <header className={`
      ${header.base}
      ${theme === 'dark' ? header.dark : header.light}
    `}>
      <button 
        onClick={onMenuClick}
        className={`
          ${button.icon}
          ${header.menuButton}
        `}
      >
        <FiMenu />
      </button>
      
      <div className={header.themeToggle}>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header; 