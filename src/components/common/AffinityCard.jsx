import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import AddToCollectionIcon from './AddToCollectionIcon';
import Tooltip from './Tooltip';

const validateAffinity = (affinity) => {
  if (!affinity || typeof affinity !== 'object') return false;
  if (typeof affinity.id !== 'string') return false;
  if (typeof affinity.name !== 'string') return false;
  if (typeof affinity.status !== 'string') return false;
  return true;
};

/**
 * AffinityCard
 * @param {object} affinity - The affinity object to display
 * @param {array} userCollections - The user's collections (for AddToCollectionIcon)
 * @param {function} onAddToCollection - Handler for adding affinity to a collection
 * @param {string} className - Optional extra className
 * @param {function} onClick - Optional click handler
 * @param {boolean} compact - Optional compact mode
 * @param {boolean} selected - Optional selected state
 */
const AffinityCard = ({
  affinity,
  userCollections,
  onAddToCollection,
  className = '',
  onClick,
  compact = false,
  selected = false
}) => {
  const { } = useAppContext();

  if (!validateAffinity(affinity)) {
    return null;
  }

  if (userCollections && !Array.isArray(userCollections)) {
    return null;
  }

  const getStatusBadgeClasses = () => {
    switch (affinity.status.toLowerCase()) {
      case 'validated':
        return 'bg-blue-100 text-blue-700';
      case 'in development':
        return 'bg-yellow-100 text-yellow-800';
      case 'deprecated':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const formatScore = (affinity) => {
    if (typeof affinity.averageScore === 'number') {
      return affinity.averageScore.toFixed(2);
    }
    if (typeof affinity.score === 'number') {
      return affinity.score.toFixed(2);
    }
    return 'N/A';
  };

  const formatCoverage = (coverage) => {
    if (typeof coverage !== 'number') return 'N/A';
    return `${coverage.toFixed(1)}%`;
  };

  return (
    <div
      className={`card-prominent ${selected ? 'border-2 border-blue-500 ring-2 ring-blue-200' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {affinity.icon && (
            <img
              src={affinity.icon}
              alt={`${affinity.name} icon`}
              className="w-6 h-6"
            />
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses()}`}>
            {affinity.status}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {userCollections && (
            <AddToCollectionIcon
              affinity={affinity}
              userCollections={userCollections}
              onAdd={onAddToCollection}
            />
          )}
        </div>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-gray-900">{affinity.name}</h3>
      
      {!compact && (
        <>
          {affinity.category && (
            <p className="mt-1 text-sm text-gray-500">{affinity.category}</p>
          )}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div>
              <span className="font-medium">Average Score:</span>{' '}
              <span className="text-gray-600">{formatScore(affinity)}</span>
            </div>
            <div>
              <span className="font-medium">Coverage:</span>{' '}
              <span className="text-gray-600">{formatCoverage(affinity.coverage)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AffinityCard; 