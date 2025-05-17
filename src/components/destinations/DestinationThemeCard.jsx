import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid'; // Optional: for an explicit click cue

// Helper function to determine relevance based on score
const getRelevanceInfo = (score) => {
  if (score === undefined || score === null) {
    return {
      text: 'N/A',
      badgeColorClass: 'bg-gray-100 text-gray-500',
      scoreColorClass: 'text-gray-500',
      textColorClass: 'text-gray-500'
    };
  }
  if (score >= 0.7) {
    return {
      text: 'High Relevance',
      badgeColorClass: 'bg-green-100 text-green-800',
      scoreColorClass: 'text-green-600 font-bold',
      textColorClass: 'text-green-800'
    };
  } else if (score >= 0.4) {
    return {
      text: 'Medium Relevance',
      badgeColorClass: 'bg-sky-100 text-sky-800',
      scoreColorClass: 'text-sky-600 font-semibold',
      textColorClass: 'text-sky-800'
    };
  } else {
    return {
      text: 'Low Relevance',
      badgeColorClass: 'bg-gray-100 text-gray-700',
      scoreColorClass: 'text-gray-500',
      textColorClass: 'text-gray-700'
    };
  }
};

const DestinationThemeCard = ({ theme, coverageItem, onClick, isExpanded }) => {
  if (!theme) {
    return null;
  }

  const relevance = getRelevanceInfo(theme.score);

  // Popularity styling - let's make it more neutral or positive
  let popularityBadgeColor = 'bg-gray-100 text-gray-700'; // Default
  let popularityText = theme.popularity;

  if (theme.popularity === 'High') {
    popularityBadgeColor = 'bg-indigo-100 text-indigo-700';
  } else if (theme.popularity === 'Medium') {
    popularityBadgeColor = 'bg-blue-100 text-blue-700';
  } else if (theme.popularity === 'Low') {
    popularityBadgeColor = 'bg-slate-100 text-slate-600';
  } else if (!theme.popularity) {
    popularityText = 'N/A'; // Handle undefined popularity
  }

  const handleClick = () => {
    if (onClick) {
      onClick(theme);
    }
  };

  return (
    <div 
      className="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
      onClick={handleClick}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()} // Accessibility for keyboard navigation
      tabIndex={0} // Make it focusable
    >
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-indigo-700 leading-tight">{theme.name}</h3>
          {popularityText && (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${popularityBadgeColor}`}>
              {popularityText}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-3">Category: {theme.category || 'N/A'}</p>
        
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Affinity Score:
            </p>
            <span className={`text-2xl ${relevance.scoreColorClass}`}>
                {theme.score !== undefined ? theme.score.toFixed(2) : 'N/A'}
            </span>
          </div>
          <div className={`mt-1 px-2 py-0.5 inline-block rounded-md text-xs font-medium ${relevance.badgeColorClass}`}>
            {relevance.text}
          </div>
        </div>

        {coverageItem && (
          <p className="text-sm text-gray-600 mb-3">
            Properties Tagged: 
            <span className="font-semibold text-indigo-600 ml-1.5">{coverageItem.coverageCount}</span>
          </p>
        )}

        {theme.description && (
            <p className="text-sm text-gray-600 mb-1 italic line-clamp-3" title={theme.description}>
              {theme.description}
            </p>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-gray-200 flex justify-end items-center">
        <span className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
          {isExpanded ? 'Collapse' : 'View Details'}
          <ChevronRightIcon className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
        </span>
      </div>

      {isExpanded && (
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 animate-fade-in">
          <h4 className="text-lg font-semibold text-indigo-800 mb-2">Theme Details</h4>
          <p className="mb-2 text-gray-700"><span className="font-semibold">Description:</span> {theme.description}</p>
          {theme.keyCharacteristics && (
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Key Characteristics:</span>
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-700">
                {theme.keyCharacteristics.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {theme.primaryDataSources && (
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Primary Data Sources:</span>
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-700">
                {theme.primaryDataSources.map((src, idx) => (
                  <li key={idx}>{src}</li>
                ))}
              </ul>
            </div>
          )}
          {theme.typicalTravelerPersona && (
            <p className="mb-2 text-gray-700"><span className="font-semibold">Typical Traveler Persona:</span> {theme.typicalTravelerPersona}</p>
          )}
          {theme.popularity && (
            <p className="mb-2 text-gray-700"><span className="font-semibold">Popularity:</span> {theme.popularity}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationThemeCard; 