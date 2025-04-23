import React from 'react';
import PropTypes from 'prop-types';
import ComparisonGrid from './ComparisonGrid';

const PrintableView = ({ affinities, periodState }) => {
  const formatPeriod = () => {
    const year = periodState.year;
    if (periodState.mode === 'quarter') {
      return `Q${periodState.quarter} ${year}`;
    }
    return year.toString();
  };

  return (
    <div className="print-container p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Affinity Comparison Report</h1>
        <p className="text-gray-600">
          Generated on {new Date().toLocaleDateString()} for {formatPeriod()}
        </p>
        <p className="text-gray-600">
          Comparing {affinities.length} affinities
        </p>
      </div>

      <ComparisonGrid affinities={affinities} periodState={periodState} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Key Findings</h3>
            <ul className="list-disc pl-5 space-y-2">
              {affinities.map(affinity => (
                <li key={affinity.id}>
                  <span className="font-medium">{affinity.name}</span>: Average score of{' '}
                  {affinity.averageScore?.toFixed(2) || 'N/A'} with{' '}
                  {affinity.totalProperties?.toLocaleString() || 'N/A'} total properties
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Categories Distribution</h3>
            <ul className="list-disc pl-5 space-y-2">
              {Array.from(new Set(affinities.map(a => a.category))).map(category => (
                <li key={category}>
                  <span className="font-medium">{category || 'Uncategorized'}</span>:{' '}
                  {affinities.filter(a => a.category === category).length} affinities
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>This report was generated from the Affinity Explorer application.</p>
        <p>For internal use only.</p>
      </div>
    </div>
  );
};

PrintableView.propTypes = {
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

export default PrintableView; 