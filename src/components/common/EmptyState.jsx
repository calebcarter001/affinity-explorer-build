import React from 'react';
import { FiInbox, FiSearch, FiAlertCircle } from 'react-icons/fi';

/**
 * Empty state component for when there's no data to display
 */
const EmptyState = ({ 
  icon = 'inbox', 
  title, 
  description, 
  actionButton,
  className = '' 
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <FiSearch className="w-12 h-12 text-gray-400" />;
      case 'alert':
        return <FiAlertCircle className="w-12 h-12 text-gray-400" />;
      case 'inbox':
      default:
        return <FiInbox className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">{description}</p>
      {actionButton && (
        <div className="mt-4">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyState; 