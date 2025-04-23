import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiPrinter } from 'react-icons/fi';
import AffinitySelector from './AffinitySelector';
import ComparisonGrid from './ComparisonGrid';
import PrintableView from './PrintableView';

const CompareTab = ({ affinities, loading, error, periodState, onPeriodChange }) => {
  const [selectedAffinities, setSelectedAffinities] = useState([]);
  const [isPrintView, setIsPrintView] = useState(false);

  const handleAffinitySelect = (affinity) => {
    setSelectedAffinities(prev => {
      const isSelected = prev.some(a => a.id === affinity.id);
      if (isSelected) {
        return prev.filter(a => a.id !== affinity.id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      // Ensure all required fields are present
      const enrichedAffinity = {
        ...affinity,
        averageScore: affinity.averageScore ?? null,
        highestScore: affinity.highestScore ?? null,
        lowestScore: affinity.lowestScore ?? null,
        totalProperties: affinity.totalProperties ?? null,
        activeProperties: affinity.activeProperties ?? null,
        inactiveProperties: affinity.inactiveProperties ?? null,
        status: affinity.status || 'Unknown',
        category: affinity.category || 'Uncategorized'
      };
      return [...prev, enrichedAffinity];
    });
  };

  const handlePrintView = () => {
    setIsPrintView(true);
    // Allow time for state update before printing
    setTimeout(() => {
      window.print();
      setIsPrintView(false);
    }, 100);
  };

  const handleModeChange = (mode) => {
    onPeriodChange({ ...periodState, mode });
  };

  const handleYearChange = (event) => {
    onPeriodChange({ ...periodState, year: parseInt(event.target.value) });
  };

  const handleQuarterChange = (event) => {
    onPeriodChange({ ...periodState, quarter: parseInt(event.target.value) });
  };

  // Generate array of recent years
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (isPrintView) {
    return (
      <PrintableView
        affinities={selectedAffinities}
        periodState={periodState}
      />
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Time Period Selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Mode Selection */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Compare by:</label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleModeChange('quarter')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  periodState.mode === 'quarter'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Quarter
              </button>
              <button
                onClick={() => handleModeChange('year')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  periodState.mode === 'year'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Year
              </button>
            </div>
          </div>

          {/* Year Selection */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Year:</label>
            <select
              value={periodState.year}
              onChange={handleYearChange}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Quarter Selection - Only visible in quarter mode */}
          {periodState.mode === 'quarter' && (
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Quarter:</label>
              <select
                value={periodState.quarter}
                onChange={handleQuarterChange}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Q1</option>
                <option value={2}>Q2</option>
                <option value={3}>Q3</option>
                <option value={4}>Q4</option>
              </select>
            </div>
          )}
        </div>

        {/* Print Button */}
        {selectedAffinities.length >= 2 && (
          <button
            onClick={handlePrintView}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPrinter className="w-4 h-4 mr-2" />
            Print Comparison
          </button>
        )}
      </div>

      {/* Affinity Selection */}
      <AffinitySelector
        affinities={affinities}
        selectedAffinities={selectedAffinities}
        onSelect={handleAffinitySelect}
        loading={loading}
        error={error}
      />

      {/* Comparison Grid */}
      {selectedAffinities.length >= 2 && (
        loading ? (
          <div className="animate-pulse bg-white rounded-lg p-6">
            <div className="h-8 bg-gray-200 w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200"></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            <p className="text-center">{error}</p>
          </div>
        ) : (
          <ComparisonGrid
            affinities={selectedAffinities}
            periodState={periodState}
          />
        )
      )}
    </div>
  );
};

CompareTab.propTypes = {
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
      inactiveProperties: PropTypes.number,
      scoreAvailable: PropTypes.bool
    })
  ).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  periodState: PropTypes.shape({
    mode: PropTypes.oneOf(['quarter', 'year']).isRequired,
    year: PropTypes.number.isRequired,
    quarter: PropTypes.number.isRequired
  }).isRequired,
  onPeriodChange: PropTypes.func.isRequired
};

export default CompareTab; 