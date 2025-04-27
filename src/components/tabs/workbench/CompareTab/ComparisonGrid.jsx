import React from 'react';
import PropTypes from 'prop-types';
import MetricRow from './MetricRow';
import ModernGrid from '../../../common/ModernGrid';

const metrics = [
  { key: 'averageScore', label: 'Average Score', format: 'score' },
  { key: 'highestScore', label: 'Highest Score', format: 'score' },
  { key: 'lowestScore', label: 'Lowest Score', format: 'score' },
  { key: 'propertiesTagged', label: 'Total Properties', format: 'number' },
  { key: 'propertiesWithScore', label: 'Active Properties', format: 'number' }
];

const ComparisonGrid = ({ affinities = [], periodState }) => {
  const formatScore = (score) => {
    return score === undefined || score === null ? 'N/A' : score.toFixed(2);
  };

  const formatNumber = (number) => {
    return number === undefined || number === null ? 'N/A' : number.toLocaleString();
  };

  const formatPeriod = () => {
    const year = periodState.year;
    if (periodState.mode === 'quarter') {
      return `Q${periodState.quarter} ${year}`;
    }
    return year.toString();
  };

  // Validate and provide defaults for required metrics
  const validatedAffinities = (affinities || []).map(affinity => ({
    ...affinity,
    averageScore: affinity.averageScore ?? null,
    highestScore: affinity.highestScore ?? null,
    lowestScore: affinity.lowestScore ?? null,
    propertiesTagged: affinity.propertiesTagged ?? null,
    propertiesWithScore: affinity.propertiesWithScore ?? null,
    category: affinity.category || 'Uncategorized',
    status: affinity.status || 'Unknown'
  }));

  if (!validatedAffinities.length) {
    return <div className="p-6 text-center text-gray-500">No affinities to compare.</div>;
  }

  // Prepare headers
  const headers = ['Metric', ...validatedAffinities.map(affinity => affinity.name)];

  // Prepare rows
  const rows = [
    // Category row
    ['Category', ...validatedAffinities.map(affinity => affinity.category)],
    // Status row
    ['Status', ...validatedAffinities.map(affinity => affinity.status)],
    // Time period row
    ['Time Period', ...validatedAffinities.map(() => formatPeriod())],
    // Metrics rows
    ...metrics.map(metric => [
      metric.label,
      ...validatedAffinities.map(affinity => 
        metric.format === 'score' 
          ? formatScore(affinity[metric.key]) 
          : formatNumber(affinity[metric.key])
      )
    ])
  ];

  return (
    <ModernGrid 
      headers={headers}
      rows={rows}
      className="bg-white"
      headerCellClassName="text-gray-700"
      cellClassName="text-gray-700"
      emptyMessage="No affinities to compare."
    />
  );
};

ComparisonGrid.propTypes = {
  affinities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string,
      status: PropTypes.string,
      averageScore: PropTypes.number,
      highestScore: PropTypes.number,
      lowestScore: PropTypes.number,
      propertiesTagged: PropTypes.number,
      propertiesWithScore: PropTypes.number
    })
  ).isRequired,
  periodState: PropTypes.shape({
    mode: PropTypes.oneOf(['quarter', 'year']).isRequired,
    year: PropTypes.number.isRequired,
    quarter: PropTypes.number.isRequired
  }).isRequired
};

export default ComparisonGrid; 