import React from 'react';
import { FiStar } from 'react-icons/fi';
import { useAppContext } from '../../contexts/AppContext';

const AffinityCard = ({ affinity }) => {
  const { favorites, toggleFavorite, addToRecentlyViewed } = useAppContext();
  const isFavorite = favorites.includes(affinity.id);
  
  const handleClick = () => {
    addToRecentlyViewed(affinity);
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(affinity.id);
  };

  const getStatusBadgeClasses = () => {
    switch(affinity.status) {
      case 'Validated':
        return 'bg-green-100 text-green-800';
      case 'In Development':
        return 'bg-yellow-100 text-yellow-800';
      case 'Proposed':
        return 'bg-blue-100 text-blue-800';
      case 'Deprecated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      onClick={handleClick}
    >
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">
          {affinity.icon || '📋'}
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses()}`}>
          {affinity.status}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{affinity.name}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {affinity.description}
      </p>
      
      <div className="flex justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Score:
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {affinity.score ? `${affinity.score.toFixed(1)}/10` : 'N/A'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Coverage:
          </span>
          <span className="font-semibold">
            {affinity.coverage ? `${affinity.coverage}%` : 'N/A'}
          </span>
        </div>
      </div>
      
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {affinity.category}
      </span>
    </div>
  );
};

export default AffinityCard; 