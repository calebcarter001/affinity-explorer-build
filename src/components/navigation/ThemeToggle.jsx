import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { button, layout, typography } from '../../styles/design-system';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Theme toggle component
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppContext();
  
  return (
    <button 
      onClick={toggleTheme} 
      className={`
        ${button.base}
        ${layout.flex.base}
        ${layout.flex.itemsCenter}
        ${layout.flex.gap}
        ${layout.fullWidth}
        ${theme === 'dark' ? button.darkMode : button.lightMode}
      `}
    >
      {theme === 'light' ? (
        <FiMoon className={button.icon} />
      ) : (
        <FiSun className={button.icon} />
      )}
      <span className={typography.small}>
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;