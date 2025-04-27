import React from 'react';
import PropTypes from 'prop-types';

const ModernCard = ({
  children,
  onClick,
  className = '',
  selected = false,
  hover = true,
  compact = false,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border transition-all duration-200';
  const hoverClasses = hover ? 'hover:shadow-md hover:border-blue-200' : '';
  const selectedClasses = selected ? 'border-2 border-blue-500 ring-2 ring-blue-200' : 'border border-gray-200';
  const paddingClasses = compact ? 'p-3' : 'p-4';
  const cursorClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${selectedClasses} ${paddingClasses} ${cursorClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

ModernCard.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  selected: PropTypes.bool,
  hover: PropTypes.bool,
  compact: PropTypes.bool,
};

export default ModernCard; 