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
  FiSettings,
  FiHome
} from 'react-icons/fi';
import { layout, typography, button } from '../../styles/design-system';

const EMPTY_STATE_TYPES = {
  NO_RESULTS: {
    icon: 'search',
    title: 'No Results Found',
    description: 'Try adjusting your search terms or filters',
    suggestions: [
      'Check for typos in your search',
      'Try using fewer filters',
      'Search for a different term'
    ]
  },
  NO_DATA: {
    icon: 'inbox',
    title: 'No Data Available',
    description: 'There is no data to display at this time',
    suggestions: [
      'Check if data has been imported',
      'Verify your data source',
      'Contact support if the issue persists'
    ]
  },
  ERROR: {
    icon: 'alert',
    title: 'Something Went Wrong',
    description: 'An error occurred while fetching the data',
    suggestions: [
      'Check your internet connection',
      'Verify your API credentials',
      'Try refreshing the page'
    ]
  },
  FILTERED: {
    icon: 'filter',
    title: 'No Matching Items',
    description: 'Try adjusting your filters to see more results',
    suggestions: [
      'Clear all filters',
      'Try different category selections',
      'Check your search terms'
    ]
  },
  NO_ACCESS: {
    icon: 'lock',
    title: 'Access Required',
    description: 'You don\'t have permission to view this content',
    suggestions: [
      'Contact your administrator',
      'Verify your account permissions',
      'Try logging out and back in'
    ]
  },
  OFFLINE: {
    icon: 'offline',
    title: 'You\'re Offline',
    description: 'Check your internet connection and try again',
    suggestions: [
      'Check your network settings',
      'Verify your Wi-Fi connection',
      'Try using a different network'
    ]
  },
  NO_AFFINITIES: {
    icon: 'file',
    title: 'No Affinities Found',
    description: 'Start by creating your first affinity or importing existing ones',
    suggestions: [
      'Create a new affinity',
      'Import existing affinities',
      'Use the Discovery Agent to find potential affinities'
    ]
  },
  NO_PROPERTIES: {
    icon: 'building',
    title: 'No Properties Found',
    description: 'Add properties to start analyzing affinities',
    suggestions: [
      'Import property data',
      'Add properties manually',
      'Connect to your property management system'
    ]
  },
  NEEDS_SETUP: {
    icon: 'settings',
    title: 'Setup Required',
    description: 'Complete the initial setup to get started',
    suggestions: [
      'Configure your account settings',
      'Set up your data sources',
      'Define your scoring criteria'
    ]
  }
};

const EmptyStateStyled = ({ 
  type,
  icon, 
  title, 
  description, 
  actionButton,
  suggestions,
  className = '',
  compact = false
}) => {
  const getIcon = () => {
    const iconSize = compact ? 'text-3xl' : 'text-4xl';
    const iconClass = `${iconSize} text-gray-400`;
    
    switch(icon || (type && EMPTY_STATE_TYPES[type]?.icon)) {
      case 'search':
        return <FiSearch className={iconClass} />;
      case 'inbox':
        return <FiInbox className={iconClass} />;
      case 'alert':
        return <FiAlertCircle className={iconClass} />;
      case 'filter':
        return <FiFilter className={iconClass} />;
      case 'refresh':
        return <FiRefreshCw className={iconClass} />;
      case 'offline':
        return <FiWifiOff className={iconClass} />;
      case 'lock':
        return <FiLock className={iconClass} />;
      case 'file':
        return <FiFileText className={iconClass} />;
      case 'settings':
        return <FiSettings className={iconClass} />;
      default:
        return <FiHome className={iconClass} />;
    }
  };

  const finalTitle = title || (type && EMPTY_STATE_TYPES[type]?.title);
  const finalDescription = description || (type && EMPTY_STATE_TYPES[type]?.description);
  const finalSuggestions = suggestions || (type && EMPTY_STATE_TYPES[type]?.suggestions);

  return (
    <div className={`${layout.flex.col} ${layout.flex.center} p-8 ${compact ? 'py-4' : ''} ${className}`}>
      <div className={layout.flex.center}>
        {getIcon()}
      </div>
      <h3 className={`${typography.h3} ${typography.textCenter} mt-4`}>
        {finalTitle}
      </h3>
      <p className={`${typography.body} ${typography.textCenter} ${typography.textSecondary} mt-2`}>
        {finalDescription}
      </p>
      {finalSuggestions && (
        <ul className={`${typography.small} ${typography.textSecondary} mt-4 space-y-1`}>
          {finalSuggestions.map((suggestion, index) => (
            <li key={index} className={typography.textCenter}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className={`${button.primary} ${button.medium} mt-6`}
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
};

export default EmptyStateStyled; 