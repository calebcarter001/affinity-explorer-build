import React, { useState } from 'react';
import DestinationThemeCard from './DestinationThemeCard';
import EmptyStateStyled from '../common/EmptyStateStyled';

const DestinationThemeDetailView = ({
  themeScores,
  themeCoverage,
  onThemeSelect, // Renamed from onCardClick for clarity
  destinationName,
  loadingInsights,
  error,
}) => {
  const [expandedThemeId, setExpandedThemeId] = useState(null);

  if (loadingInsights) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading insights...</p></div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!themeScores || themeScores.length === 0) {
    return (
      <div className="flex justify-center items-center h-full bg-white rounded-lg shadow p-6">
        <EmptyStateStyled
          icon="search" // Or a more appropriate icon like 'database' or 'bar-chart'
          title="No Theme Data Available"
          description={`No theme scores or coverage data found for ${destinationName || 'the selected destination'}.`}
        />
      </div>
    );
  }

  // For now, a simple list. We will enhance this layout.
  // Consider a section for "Top Themes" and then a full list.
  return (
    <div className="h-full overflow-y-auto">
      {/* This title is now managed by DestinationInsightsPage, but keeping it here as a reminder if we need sub-sections */}
      {/* <h2 className="text-xl font-semibold mb-4 text-gray-800 px-4 pt-4 sticky top-0 bg-white z-10 pb-3 border-b">
        Theme Insights for: <span className="text-indigo-600">{destinationName}</span>
      </h2> */}
      
      <div className="p-4 space-y-4">
        {themeScores.map(theme => {
          const coverageItem = themeCoverage.find(c => c.themeId === theme.id);
          const isExpanded = expandedThemeId === theme.id;
          const handleExpand = () => {
            setExpandedThemeId(isExpanded ? null : theme.id);
            if (!isExpanded && onThemeSelect) onThemeSelect(theme);
          };
          return (
            <DestinationThemeCard
              key={theme.id}
              theme={theme}
              coverageItem={coverageItem}
              isExpanded={isExpanded}
              onClick={handleExpand}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DestinationThemeDetailView; 