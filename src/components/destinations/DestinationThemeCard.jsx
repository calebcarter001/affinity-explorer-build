import React, { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { 
  DocumentTextIcon, 
  LightBulbIcon, 
  CogIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

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

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      active
        ? 'text-indigo-700 border-b-2 border-indigo-500 bg-white'
        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
    }`}
  >
    <Icon className="w-4 h-4 mr-2" />
    {label}
  </button>
);

const DestinationThemeCard = ({ theme, coverageItem, onClick, isExpanded }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!theme) {
    return null;
  }

  const relevance = getRelevanceInfo(theme.score);

  // Popularity styling
  let popularityBadgeColor = 'bg-gray-100 text-gray-700';
  let popularityText = theme.popularity;

  if (theme.popularity === 'High') {
    popularityBadgeColor = 'bg-indigo-100 text-indigo-700';
  } else if (theme.popularity === 'Medium') {
    popularityBadgeColor = 'bg-blue-100 text-blue-700';
  } else if (theme.popularity === 'Low') {
    popularityBadgeColor = 'bg-slate-100 text-slate-600';
  } else if (!theme.popularity) {
    popularityText = 'N/A';
  }

  const handleClick = () => {
    if (onClick) {
      onClick(theme);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: DocumentTextIcon },
    { id: 'useCases', label: 'Theme Use Cases', icon: LightBulbIcon },
    { id: 'implementation', label: 'Implementation', icon: CogIcon },
    { id: 'metrics', label: 'Metrics', icon: ChartBarIcon }
  ];

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg transition-all duration-300 ease-in-out flex flex-col h-full cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 ${
        isExpanded ? 'shadow-2xl' : 'hover:shadow-xl'
      }`}
      onClick={handleClick}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
      tabIndex={0}
    >
      <div className="p-5">
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
              Destination Affinity Score:
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

        {!isExpanded && theme.description && (
          <p className="text-sm text-gray-600 mb-1 italic line-clamp-3" title={theme.description}>
            {theme.description}
          </p>
        )}
      </div>

      <div className="mt-auto px-5 py-3 border-t border-gray-200 flex justify-end items-center">
        <span className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
          {isExpanded ? 'Collapse' : 'View Details'}
          <ChevronRightIcon className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
        </span>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 animate-fade-in">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex">
              {tabs.map(tab => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(tab.id);
                  }}
                  icon={tab.icon}
                  label={tab.label}
                />
              ))}
            </nav>
          </div>

          {/* Scrollable Content Area */}
          <div className="max-h-[500px] overflow-y-auto bg-white">
            {activeTab === 'overview' && (
              <div className="p-5 space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{theme.description}</p>
                </div>

                {theme.keyCharacteristics && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Characteristics</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {theme.keyCharacteristics.map((item, idx) => (
                        <li key={idx} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {theme.primaryDataSources && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Primary Data Sources</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {theme.primaryDataSources.map((src, idx) => (
                        <li key={idx} className="text-gray-700">{src}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'useCases' && (
              <div className="p-5 space-y-6">
                {theme.contentSignals && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Content Signals</h4>
                    <p className="text-gray-700">{theme.contentSignals}</p>
                  </div>
                )}

                {theme.useCases && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Theme Use Cases</h4>
                    <ul className="space-y-3">
                      {theme.useCases.map((useCase, idx) => (
                        <li key={idx} className="flex items-start bg-gray-50 p-3 rounded-lg">
                          <LightBulbIcon className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'implementation' && (
              <div className="p-5 space-y-6">
                {theme.implementationDetails && (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Data Points</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {theme.implementationDetails.dataPoints.map((point, idx) => (
                          <li key={idx} className="flex items-center bg-gray-50 p-3 rounded-lg">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Scoring Factors</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {theme.implementationDetails.scoringFactors.map((factor, idx) => (
                          <li key={idx} className="flex items-center bg-gray-50 p-3 rounded-lg">
                            <ChartBarIcon className="w-5 h-5 text-indigo-500 mr-3" />
                            <span className="text-gray-700">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {theme.implementationDetails.technicalNotes && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Technical Notes</h4>
                        <p className="text-gray-700">{theme.implementationDetails.technicalNotes}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="p-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Destination Affinity Score</h4>
                    <p className={`text-2xl ${relevance.scoreColorClass}`}>
                      {theme.score !== undefined ? theme.score.toFixed(2) : 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Properties Tagged</h4>
                    <p className="text-2xl text-indigo-600">
                      {coverageItem ? coverageItem.coverageCount : 'N/A'}
                    </p>
                  </div>

                  {theme.sampleFitnessAlgorithm && (
                    <div className="col-span-2 bg-indigo-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Destination Affinity Score Algorithm</h4>
                      <p className="text-sm font-mono bg-white p-3 rounded border border-indigo-100">
                        {theme.sampleFitnessAlgorithm}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationThemeCard; 