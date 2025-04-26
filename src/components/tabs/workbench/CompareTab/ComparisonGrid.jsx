import React from 'react';
import PropTypes from 'prop-types';

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Metric
            </th>
            {validatedAffinities.map(affinity => (
              <th
                key={affinity.id}
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {affinity.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Category Row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Category
            </td>
            {validatedAffinities.map(affinity => (
              <td key={affinity.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {affinity.category}
              </td>
            ))}
          </tr>

          {/* Status Row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Status
            </td>
            {validatedAffinities.map(affinity => (
              <td key={affinity.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {affinity.status}
              </td>
            ))}
          </tr>

          {/* Time Period Row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Time Period
            </td>
            {validatedAffinities.map(affinity => (
              <td key={affinity.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatPeriod()}
              </td>
            ))}
          </tr>

          {/* Metrics Rows */}
          {metrics.map(metric => (
            <tr key={metric.key}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {metric.label}
              </td>
              {validatedAffinities.map(affinity => (
                <td key={affinity.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {metric.format === 'score'
                    ? formatScore(affinity[metric.key])
                    : formatNumber(affinity[metric.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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