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

// Iconography mapping for affinities
const getAffinityIcon = (affinity) => {
  const name = affinity.name?.toLowerCase() || '';
  const category = affinity.category?.toLowerCase() || '';
  
  // Primary icon based on affinity name
  if (name.includes('pet') || name.includes('dog') || name.includes('cat')) return '🐕';
  if (name.includes('romantic') || name.includes('romance') || name.includes('couple')) return '💕';
  if (name.includes('family') || name.includes('kids') || name.includes('children')) return '👨‍👩‍👧‍👦';
  if (name.includes('luxury') || name.includes('premium') || name.includes('upscale')) return '✨';
  if (name.includes('business') || name.includes('corporate') || name.includes('work')) return '💼';
  if (name.includes('all-inclusive') || name.includes('inclusive')) return '🎯';
  if (name.includes('oceanview') || name.includes('ocean view') || name.includes('sea view')) return '🌊';
  if (name.includes('beach') || name.includes('shore') || name.includes('coast')) return '🏖️';
  if (name.includes('spa') || name.includes('wellness') || name.includes('relaxation')) return '🧘‍♀️';
  if (name.includes('pool') || name.includes('swimming')) return '🏊‍♂️';
  if (name.includes('wifi') || name.includes('internet')) return '📶';
  if (name.includes('parking') || name.includes('garage')) return '🅿️';
  if (name.includes('fitness') || name.includes('gym') || name.includes('exercise')) return '🏋️‍♂️';
  if (name.includes('restaurant') || name.includes('dining') || name.includes('food')) return '🍽️';
  if (name.includes('bar') || name.includes('cocktail') || name.includes('drinks')) return '🍸';
  if (name.includes('mountain') || name.includes('ski') || name.includes('slope')) return '⛰️';
  if (name.includes('city') || name.includes('urban') || name.includes('downtown')) return '🏙️';
  if (name.includes('nature') || name.includes('forest') || name.includes('eco')) return '🌲';
  if (name.includes('historic') || name.includes('heritage') || name.includes('cultural')) return '🏛️';
  if (name.includes('accessible') || name.includes('wheelchair') || name.includes('disability')) return '♿';
  if (name.includes('quiet') || name.includes('peaceful') || name.includes('tranquil')) return '🔇';
  if (name.includes('adventure') || name.includes('activity') || name.includes('sports')) return '🏃‍♂️';
  if (name.includes('budget') || name.includes('affordable') || name.includes('economy')) return '💰';
  if (name.includes('boutique') || name.includes('unique') || name.includes('charming')) return '🎨';
  if (name.includes('eco') || name.includes('sustainable') || name.includes('green') || name.includes('environment')) return '🌱';
  if (name.includes('historic') || name.includes('heritage') || name.includes('cultural')) return '🏛️';
  
  // Fallback to category-based icons
  switch (category) {
    case 'amenity': return '🛎️';
    case 'experience': return '⭐';
    case 'purpose': return '🎯';
    case 'service': return '🔧';
    case 'feature': return '🏨';
    case 'location': return '📍';
    case 'family': return '👨‍👩‍👧‍👦';
    case 'adults': return '🥂';
    case 'premium': return '💎';
    case 'outdoors': return '🏞️';
    case 'cultural': return '🎭';
    case 'pricing': return '💰';
    case 'sustainability': return '🌱';
    default: return '🏨';
  }
};

// Secondary icon based on category for additional context
const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'amenity': return '🛎️';
    case 'experience': return '⭐';
    case 'purpose': return '🎯';
    case 'service': return '🔧';
    case 'feature': return '🏨';
    case 'location': return '📍';
    case 'family': return '👨‍👩‍👧‍👦';
    case 'adults': return '🥂';
    case 'premium': return '💎';
    case 'outdoors': return '🏞️';
    case 'cultural': return '🎭';
    case 'pricing': return '💰';
    case 'sustainability': return '🌱';
    default: return null;
  }
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

  const primaryIcon = getAffinityIcon(affinity);
  const categoryIcon = getCategoryIcon(affinity.category);

  return (
    <div
      className={`card-prominent ${selected ? 'border-2 border-blue-500 ring-2 ring-blue-200' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {/* Icon section */}
          <div className="flex items-center space-x-1">
            <span className="text-2xl" title={`${affinity.name} icon`}>
              {primaryIcon}
            </span>
            {categoryIcon && categoryIcon !== primaryIcon && (
              <span className="text-sm opacity-70" title={`${affinity.category} category`}>
                {categoryIcon}
              </span>
            )}
          </div>
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
            <p className="mt-1 text-sm text-gray-500 capitalize">{affinity.category}</p>
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