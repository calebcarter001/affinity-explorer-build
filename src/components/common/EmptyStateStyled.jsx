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
  // Use preset if type is provided, otherwise use custom props
  const preset = type ? EMPTY_STATE_TYPES[type] : null;
  const finalIcon = icon || (preset?.icon ?? 'inbox');
  const finalTitle = title || preset?.title;
  const finalDescription = description || preset?.description;
  const finalSuggestions = suggestions || preset?.suggestions;

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
      case 'building':
        return <FiHome className="w-12 h-12 text-gray-400" />;
      case 'inbox':
      default:
        return <FiInbox className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div className={`text-center p-8 ${compact ? 'py-4' : ''} ${className}`}>
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {finalTitle}
      </h3>
      <p className="text-gray-500 mb-4">
        {finalDescription}
      </p>
      {finalSuggestions && (
        <ul className="text-sm text-gray-500 mb-4">
          {finalSuggestions.map((suggestion, index) => (
            <li key={index} className="mb-1">
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
};

export default EmptyStateStyled; 