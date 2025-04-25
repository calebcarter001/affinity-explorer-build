import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiPrinter, FiX } from 'react-icons/fi';
import AffinitySelector from './AffinitySelector';
import ComparisonGrid from './ComparisonGrid';
import PrintableView from './PrintableView';
import { getAffinityPerformance } from '../../../../services/apiService';
import PerformanceMetrics from '../../../performance/PerformanceMetrics';

const CompareTab = ({ affinities, loading: affinitiesLoading, error: affinitiesError, periodState, onPeriodChange }) => {
  const [selectedAffinities, setSelectedAffinities] = useState([]);
  const [showPrintView, setShowPrintView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState({});
  const [comparisonData, setComparisonData] = useState({});

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (selectedAffinities.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const promises = selectedAffinities.map(affinity =>
          getAffinityPerformance(affinity.id, periodState.year, periodState.quarter)
        );

        const responses = await Promise.all(promises);
        const newPerformanceData = {};

        responses.forEach((response, index) => {
          const affinity = selectedAffinities[index];
          newPerformanceData[affinity.id] = {
            ...response.data,
            affinityName: affinity.name,
            year: periodState.year,
            quarter: periodState.quarter
          };
        });

        setPerformanceData(newPerformanceData);
      } catch (err) {
        console.error('Error fetching performance data:', err);
        setError('Failed to fetch performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [selectedAffinities, periodState]);

  const handleAffinitySelect = (affinity) => {
    setSelectedAffinities(prev => {
      const isSelected = prev.some(a => a.id === affinity.id);
      if (isSelected) {
        return prev.filter(a => a.id !== affinity.id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, affinity];
    });
  };

  const handlePrint = () => {
    setShowPrintView(true);
  };

  const handleClosePrint = () => {
    setShowPrintView(false);
  };

  if (showPrintView) {
    return (
      <div className="relative">
        <button
          onClick={handleClosePrint}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <FiX className="w-5 h-5" />
        </button>
        <PrintableView
          affinities={selectedAffinities.map(affinity => ({
            ...affinity,
            ...performanceData[affinity.id]
          }))}
          periodState={periodState}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Compare Affinities</h2>
        {selectedAffinities.length > 0 && (
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FiPrinter className="w-5 h-5" />
            <span>Print Report</span>
          </button>
        )}
      </div>

      <AffinitySelector
        affinities={affinities}
        selectedAffinities={selectedAffinities}
        onSelect={handleAffinitySelect}
        loading={affinitiesLoading}
        error={affinitiesError}
      />

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading performance data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : selectedAffinities.length > 0 ? (
        <ComparisonGrid
          affinities={selectedAffinities.map(affinity => ({
            ...affinity,
            ...performanceData[affinity.id]
          }))}
          periodState={periodState}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Select affinities to compare</p>
        </div>
      )}
    </div>
  );
};

CompareTab.propTypes = {
  affinities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string
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