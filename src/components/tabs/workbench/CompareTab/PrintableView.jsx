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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="print-header">
        <h1 className="text-2xl font-bold mb-2">Affinity Performance Report</h1>
        <p className="text-gray-600">
          {periodState.mode === 'quarter' 
            ? `Q${periodState.quarter} ${periodState.year}`
            : `${periodState.year}`}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <p className="text-gray-700">
          This report compares {affinities.length} affinities for the period {formatPeriod()}.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Key Findings</h2>
        <ul className="list-disc pl-5 text-gray-700">
          {affinities.map(affinity => (
            <li key={affinity.id}>
              {affinity.name}: Average score of {affinity.averageScore?.toFixed(2) || 'N/A'} with{' '}
              {affinity.propertiesTagged?.toLocaleString() || 'N/A'} total properties
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Categories Distribution</h2>
        <ul className="list-disc pl-5 text-gray-700">
          {Array.from(new Set(affinities.map(a => a.category))).map(category => (
            <li key={category}>
              {category}: {affinities.filter(a => a.category === category).length} affinities
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Detailed Comparison</h2>
        <ComparisonGrid affinities={affinities} periodState={periodState} />
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
      averageScore: PropTypes.number,
      propertiesTagged: PropTypes.number
    })
  ).isRequired,
  periodState: PropTypes.shape({
    mode: PropTypes.oneOf(['quarter', 'year']).isRequired,
    year: PropTypes.number.isRequired,
    quarter: PropTypes.number.isRequired
  }).isRequired
};

export default PrintableView; 