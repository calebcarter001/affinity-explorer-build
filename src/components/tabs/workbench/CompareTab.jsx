import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiPrinter } from 'react-icons/fi';
import AffinitySelector from './CompareTab/AffinitySelector';
import ComparisonGrid from './CompareTab/ComparisonGrid';
import PrintableView from './CompareTab/PrintableView';
import { getAffinityPerformance } from '../../../services/apiService';
import PerformanceMetrics from '../../performance/PerformanceMetrics';
import { performanceDataShape } from '../../../types/affinityTypes';

const CompareTab = ({ affinities, loading: affinitiesLoading, error: affinitiesError, periodState, onPeriodChange }) => {
  const [selectedAffinities, setSelectedAffinities] = useState([]);
  const [isPrintView, setIsPrintView] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAffinityDetails, setSelectedAffinityDetails] = useState(null);

  // Fetch comparison data when period or selections change
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (selectedAffinities.length === 0) return;
      
      console.log('🔄 Fetching comparison data for:', {
        selectedAffinities: selectedAffinities.map(a => a.name),
        year: periodState.year,
        quarter: periodState.quarter
      });
      
      setLoading(true);
      setError(null);
      
      try {
        const promises = selectedAffinities.map(affinity =>
          getAffinityPerformance(
            affinity.id,
            periodState.year,
            periodState.quarter
          )
        );
        
        const results = await Promise.all(promises);
        console.log('📊 Received performance data:', results);
        
        const enrichedData = results.map((result, index) => ({
          ...selectedAffinities[index],
          ...result.data?.[0], // Get first item since we're querying by specific ID
          year: periodState.year,
          quarter: periodState.quarter
        }));
        
        console.log('✨ Enriched comparison data:', enrichedData);
        setComparisonData(enrichedData);
      } catch (err) {
        console.error('❌ Error fetching comparison data:', err);
        setError('Failed to fetch comparison data');
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [selectedAffinities, periodState.year, periodState.quarter]);

  const handleAffinityClick = (affinity) => {
    console.log('👆 Affinity clicked:', affinity);
    
    // Ensure all required fields are present with correct types
    const formattedPerformance = {
      id: String(affinity.id),
      affinityId: String(affinity.id),
      year: periodState.year,
      quarter: periodState.quarter,
      clicks: Number(affinity.clicks) || 0,
      impressions: Number(affinity.impressions) || 0,
      transactions: Number(affinity.transactions) || 0,
      gpNet: Number(affinity.gpNet) || 0,
      dateCreated: affinity.dateCreated || new Date().toISOString(),
      lastUpdatedDate: affinity.lastUpdatedDate || new Date().toISOString(),
      affinityName: affinity.name || 'Unknown Affinity'
    };

    // Validate the data before setting state
    const isValid = validatePerformanceData(formattedPerformance);
    if (!isValid) {
      console.error('❌ Invalid performance data:', formattedPerformance);
      return;
    }

    setSelectedAffinityDetails({
      affinityName: affinity.name,
      performance: formattedPerformance
    });
  };

  // Add validation helper function
  const validatePerformanceData = (data) => {
    const requiredFields = [
      'id', 'affinityId', 'year', 'clicks', 'impressions',
      'transactions', 'gpNet', 'dateCreated', 'lastUpdatedDate', 'affinityName'
    ];
    
    // Check for required fields
    const hasAllFields = requiredFields.every(field => {
      const hasField = field in data;
      if (!hasField) {
        console.error(`Missing required field: ${field}`);
      }
      return hasField;
    });

    // Validate data types
    const typeValidations = {
      id: typeof data.id === 'string',
      affinityId: typeof data.affinityId === 'string',
      year: typeof data.year === 'number',
      clicks: typeof data.clicks === 'number',
      impressions: typeof data.impressions === 'number',
      transactions: typeof data.transactions === 'number',
      gpNet: typeof data.gpNet === 'number',
      dateCreated: typeof data.dateCreated === 'string',
      lastUpdatedDate: typeof data.lastUpdatedDate === 'string',
      affinityName: typeof data.affinityName === 'string'
    };

    const hasValidTypes = Object.entries(typeValidations).every(([field, isValid]) => {
      if (!isValid) {
        console.error(`Invalid type for field ${field}: expected ${typeof data[field]}`);
      }
      return isValid;
    });

    return hasAllFields && hasValidTypes;
  };

  // Add data transformation helper
  const transformPerformanceData = (data) => {
    return {
      ...data,
      id: String(data.id),
      affinityId: String(data.affinityId),
      year: Number(data.year),
      quarter: Number(data.quarter) || null,
      clicks: Number(data.clicks) || 0,
      impressions: Number(data.impressions) || 0,
      transactions: Number(data.transactions) || 0,
      gpNet: Number(data.gpNet) || 0,
      dateCreated: data.dateCreated || new Date().toISOString(),
      lastUpdatedDate: data.lastUpdatedDate || new Date().toISOString(),
      affinityName: data.affinityName || 'Unknown Affinity'
    };
  };

  const handlePrintView = () => {
    setIsPrintView(true);
    setTimeout(() => {
      window.print();
      setIsPrintView(false);
    }, 100);
  };

  const handleModeChange = (mode) => {
    console.log('🔄 Mode changed to:', mode);
    onPeriodChange({ ...periodState, mode });
  };

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value);
    console.log('📅 Year changed to:', year);
    onPeriodChange({ ...periodState, year });
  };

  const handleQuarterChange = (event) => {
    const quarter = parseInt(event.target.value);
    console.log('🔢 Quarter changed to:', quarter);
    onPeriodChange({ ...periodState, quarter });
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (isPrintView) {
    return (
      <PrintableView
        affinities={comparisonData}
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
        <button
          onClick={handlePrintView}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPrinter className="mr-2" />
          Print
        </button>
      </div>

      {/* Affinity Selection */}
      <AffinitySelector
        affinities={affinities}
        selectedAffinities={selectedAffinities}
        onSelectionChange={setSelectedAffinities}
        loading={affinitiesLoading}
        error={affinitiesError}
      />

      {/* Comparison Grid */}
      <ComparisonGrid
        data={comparisonData}
        loading={loading}
        error={error}
        onRowClick={handleAffinityClick}
      />

      {/* Performance Metrics */}
      {selectedAffinityDetails && (
        <div className="mt-8">
          <PerformanceMetrics
            performance={selectedAffinityDetails.performance}
            comparisonPerformance={null}
            properties={{}}
            metrics={{}}
          />
        </div>
      )}
    </div>
  );
};

CompareTab.propTypes = {
  affinities: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  periodState: PropTypes.shape({
    mode: PropTypes.oneOf(['quarter', 'year']).isRequired,
    year: PropTypes.number.isRequired,
    quarter: PropTypes.number
  }).isRequired,
  onPeriodChange: PropTypes.func.isRequired
};

export default CompareTab; 