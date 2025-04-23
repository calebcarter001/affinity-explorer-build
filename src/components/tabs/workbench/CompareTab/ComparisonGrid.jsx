import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber, formatPercentage } from '../../../../utils/formatters';
import ComparisonGridGroup from './ComparisonGridGroup';

const metrics = [
  { key: 'averageScore', label: 'Average Score', format: 'score' },
  { key: 'highestScore', label: 'Highest Score', format: 'score' },
  { key: 'lowestScore', label: 'Lowest Score', format: 'score' },
  { key: 'totalProperties', label: 'Total Properties', format: 'number' },
  { key: 'activeProperties', label: 'Active Properties', format: 'number' },
  { key: 'inactiveProperties', label: 'Inactive Properties', format: 'number' }
];

const ComparisonGrid = ({ affinities, periodState }) => {
  if (!affinities || affinities.length === 0) {
    return null;
  }

  const formatScore = (score) => {
    return score === undefined || score === null ? 'N/A' : score.toFixed(2);
  };

  const formatPeriod = (periodState) => {
    if (periodState.mode === 'quarter') {
      return `Q${periodState.quarter} ${periodState.year}`;
    }
    return periodState.year;
  };

  const getBasicInfoSummary = (affinity) => {
    return `${affinity.name} (${affinity.status})`;
  };

  const getPropertyMetricsSummary = (affinity) => {
    return `${formatNumber(affinity.totalProperties)} Properties • ${formatPercentage(affinity.coverage)}`;
  };

  const getScoringSummary = (affinity) => {
    return `${formatPercentage(affinity.averageScore)} Avg Score`;
  };

  const getPerformanceMetricsSummary = (affinity) => {
    if (affinity.performance) {
      return `${formatNumber(affinity.performance.clicks)} Clicks • ${formatNumber(affinity.performance.transactions)} Trans`;
    }
    return 'No performance data';
  };

  // Validate and provide defaults for required metrics
  const validatedAffinities = affinities.map(affinity => ({
    ...affinity,
    averageScore: affinity.averageScore ?? null,
    highestScore: affinity.highestScore ?? null,
    lowestScore: affinity.lowestScore ?? null,
    totalProperties: affinity.totalProperties ?? null,
    activeProperties: affinity.activeProperties ?? null,
    inactiveProperties: affinity.inactiveProperties ?? null,
    category: affinity.category || 'Uncategorized',
    status: affinity.status || 'Unknown'
  }));

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Comparison - {formatPeriod(periodState)}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {validatedAffinities.map((affinity, index) => (
          <div key={affinity.id} className="space-y-4">
            <ComparisonGridGroup
              title="Basic Information"
              collapsedSummary={getBasicInfoSummary(affinity)}
            >
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name:</span>
                  <span className="ml-2 text-sm text-gray-900">{affinity.name}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <span className="ml-2 text-sm text-gray-900">{affinity.category}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Type:</span>
                  <span className="ml-2 text-sm text-gray-900">{affinity.type}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className="ml-2 text-sm text-gray-900">{affinity.status}</span>
                </div>
              </div>
            </ComparisonGridGroup>

            <ComparisonGridGroup
              title="Property Metrics"
              collapsedSummary={getPropertyMetricsSummary(affinity)}
            >
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">Total Properties:</span>
                  <span className="ml-2 text-sm text-gray-900">{formatNumber(affinity.totalProperties)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Active Properties:</span>
                  <span className="ml-2 text-sm text-gray-900">{formatNumber(affinity.activeProperties)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Inactive Properties:</span>
                  <span className="ml-2 text-sm text-gray-900">{formatNumber(affinity.inactiveProperties)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Coverage:</span>
                  <span className="ml-2 text-sm text-gray-900">{formatPercentage(affinity.coverage)}</span>
                </div>
              </div>
            </ComparisonGridGroup>

            <ComparisonGridGroup
              title="Scoring"
              collapsedSummary={getScoringSummary(affinity)}
            >
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">Average Score:</span>
                  <span className="ml-2 text-sm text-gray-900">{formatPercentage(affinity.averageScore)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Score Confidence:</span>
                  <span className="ml-2 text-sm text-gray-900">{formatPercentage(affinity.scoreConfidence)}</span>
                </div>
              </div>
            </ComparisonGridGroup>

            {affinity.performance && (
              <ComparisonGridGroup
                title="Performance Metrics"
                collapsedSummary={getPerformanceMetricsSummary(affinity)}
              >
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Clicks:</span>
                    <span className="ml-2 text-sm text-gray-900">{formatNumber(affinity.performance.clicks)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Impressions:</span>
                    <span className="ml-2 text-sm text-gray-900">{formatNumber(affinity.performance.impressions)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Transactions:</span>
                    <span className="ml-2 text-sm text-gray-900">{formatNumber(affinity.performance.transactions)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">GP (Net):</span>
                    <span className="ml-2 text-sm text-gray-900">${formatNumber(affinity.performance.gpNet)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">CTR:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {formatPercentage(affinity.performance.clicks / affinity.performance.impressions)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Conversion Rate:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {formatPercentage(affinity.performance.transactions / affinity.performance.clicks)}
                    </span>
                  </div>
                </div>
              </ComparisonGridGroup>
            )}

            <ComparisonGridGroup
              title="Implementation Details"
              defaultOpen={false}
            >
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">Implementation Method:</span>
                  <span className="ml-2 text-sm text-gray-900">{affinity.implementationMethod || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Data Source:</span>
                  <span className="ml-2 text-sm text-gray-900">{affinity.dataSource || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                  <span className="ml-2 text-sm text-gray-900">{affinity.lastUpdated || 'N/A'}</span>
                </div>
              </div>
            </ComparisonGridGroup>
          </div>
        ))}
      </div>
    </div>
  );
};

ComparisonGrid.propTypes = {
  affinities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string,
      status: PropTypes.string,
      averageScore: PropTypes.number,
      highestScore: PropTypes.number,
      lowestScore: PropTypes.number,
      totalProperties: PropTypes.number,
      activeProperties: PropTypes.number,
      inactiveProperties: PropTypes.number
    })
  ).isRequired,
  periodState: PropTypes.shape({
    mode: PropTypes.oneOf(['quarter', 'year']).isRequired,
    year: PropTypes.number.isRequired,
    quarter: PropTypes.number.isRequired
  }).isRequired
};

export default ComparisonGrid; 