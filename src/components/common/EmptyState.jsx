import React from 'react';
import { 
  FiInbox, 
  FiSearch, 
  FiAlertCircle, 
  FiFilter, 
  FiRefreshCw,
  FiWifiOff,
  FiLock,
  FiFileText,
  FiSettings
} from 'react-icons/fi';

const EMPTY_STATE_TYPES = {
  NO_RESULTS: {
    icon: 'search',
    title: 'No Results Found',
    description: 'Try adjusting your search terms or filters',
  },
  NO_DATA: {
    icon: 'inbox',
    title: 'No Data Available',
    description: 'There is no data to display at this time',
  },
  ERROR: {
    icon: 'alert',
    title: 'Something Went Wrong',
    description: 'An error occurred while fetching the data',
  },
  FILTERED: {
    icon: 'filter',
    title: 'No Matching Items',
    description: 'Try adjusting your filters to see more results',
  },
  NO_ACCESS: {
    icon: 'lock',
    title: 'Access Required',
    description: 'You don\'t have permission to view this content',
  },
  OFFLINE: {
    icon: 'offline',
    title: 'You\'re Offline',
    description: 'Check your internet connection and try again',
  },
  NO_AFFINITIES: {
    icon: 'file',
    title: 'No Affinities Found',
    description: 'Start by creating your first affinity or importing existing ones',
  },
  NO_PROPERTIES: {
    icon: 'building',
    title: 'No Properties Found',
    description: 'Add properties to start analyzing affinities',
  },
  NEEDS_SETUP: {
    icon: 'settings',
    title: 'Setup Required',
    description: 'Complete the initial setup to get started',
  }
};

/**
 * Enhanced empty state component with various presets and customization options
 */
const EmptyState = ({ 
  type,
  icon, 
  title, 
  description, 
  actionButton,
  suggestions,
  className = '',
  compact = false
}) => {
  // Use preset if type is provided, otherwise use custom props
  const preset = type ? EMPTY_STATE_TYPES[type] : null;
  const finalIcon = icon || (preset?.icon ?? 'inbox');
  const finalTitle = title || preset?.title;
  const finalDescription = description || preset?.description;

  const getIcon = () => {
    switch (finalIcon) {
      case 'search':
        return <FiSearch className="w-12 h-12 text-gray-400" />;
      case 'alert':
        return <FiAlertCircle className="w-12 h-12 text-red-400" />;
      case 'filter':
        return <FiFilter className="w-12 h-12 text-gray-400" />;
      case 'offline':
        return <FiWifiOff className="w-12 h-12 text-gray-400" />;
      case 'lock':
        return <FiLock className="w-12 h-12 text-gray-400" />;
      case 'file':
        return <FiFileText className="w-12 h-12 text-gray-400" />;
      case 'settings':
        return <FiSettings className="w-12 h-12 text-gray-400" />;
      case 'refresh':
        return <FiRefreshCw className="w-12 h-12 text-gray-400" />;
      case 'inbox':
      default:
        return <FiInbox className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div 
      className={`
        flex flex-col items-center justify-center 
        ${compact ? 'p-4' : 'p-8'} 
        text-center 
        ${className}
      `}
    >
      <div className={`${compact ? 'mb-2' : 'mb-4'}`}>
        {getIcon()}
      </div>
      <h3 className={`text-lg font-medium text-gray-900 ${compact ? 'mb-1' : 'mb-2'}`}>
        {finalTitle}
      </h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">
        {finalDescription}
      </p>
      
      {suggestions && suggestions.length > 0 && (
        <div className="mt-2 space-y-1">
          {suggestions.map((suggestion, index) => (
            <p key={index} className="text-sm text-gray-500">
              • {suggestion}
            </p>
          ))}
        </div>
      )}

      {actionButton && (
        <div className={`${compact ? 'mt-2' : 'mt-4'}`}>
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyState; 