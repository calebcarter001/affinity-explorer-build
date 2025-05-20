import React from 'react';
import PropTypes from 'prop-types';
import ComparisonGrid from './ComparisonGrid';
import SummaryList from './SummaryList';
import CategoryDistributionList from './CategoryDistributionList';

const PrintableView = ({ affinities, periodState }) => {
  // Validate inputs
  if (!Array.isArray(affinities)) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center text-red-500">
        Error: Invalid data format
      </div>
    );
  }

  if (!periodState?.year || !periodState?.mode) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center text-red-500">
        Error: Invalid period configuration
      </div>
    );
  }

  // Filter out invalid affinity objects
  const validAffinities = affinities.filter(affinity => {
    if (!affinity?.id || !affinity?.name) {
      return false;
    }
    return true;
  });

  const formatPeriod = () => {
    try {
      const year = periodState.year;
      if (periodState.mode === 'quarter' && periodState.quarter) {
        return `Q${periodState.quarter} ${year}`;
      }
      return year.toString();
    } catch (error) {
      return 'Invalid Period';
    }
  };

  if (validAffinities.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="text-center text-gray-500">
          <h1 className="text-2xl font-bold mb-4">Affinity Performance Report</h1>
          <p>{formatPeriod()}</p>
          <p className="mt-8">No valid affinities to display in this report.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="print-header">
        <h1 className="text-2xl font-bold mb-2">Affinity Performance Report</h1>
        <p className="text-gray-600">{formatPeriod()}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <p className="text-gray-700">
          This report compares {validAffinities.length} affinity{validAffinities.length !== 1 ? 'ies' : ''} for the period {formatPeriod()}.
        </p>
      </div>

      <div className="mb-8">
        <SummaryList 
          affinities={validAffinities} 
          periodState={periodState} 
        />
      </div>

      <div className="mb-8">
        <CategoryDistributionList 
          affinities={validAffinities} 
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Detailed Comparison</h2>
        <ComparisonGrid 
          affinities={validAffinities} 
          periodState={periodState} 
        />
      </div>

      <div className="mt-8 pt-4 border-t text-sm text-gray-500">
        <p>Generated on {new Date().toLocaleDateString()}</p>
        <p>Data period: {formatPeriod()}</p>
      </div>
    </div>
  );
};

PrintableView.propTypes = {
  affinities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string,
      averageScore: PropTypes.number,
      propertiesTagged: PropTypes.number,
      metrics: PropTypes.shape({
        accuracy: PropTypes.number,
        coverage: PropTypes.number,
        completeness: PropTypes.number
      })
    })
  ).isRequired,
  periodState: PropTypes.shape({
    mode: PropTypes.oneOf(['quarter', 'year']).isRequired,
    year: PropTypes.number.isRequired,
    quarter: PropTypes.number
  }).isRequired
};

export default PrintableView; 