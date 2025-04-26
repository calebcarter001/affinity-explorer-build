import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FiChevronDown, FiChevronUp, FiMoreVertical, FiSearch, FiChevronLeft, FiChevronRight, FiRefreshCw, FiPrinter } from 'react-icons/fi';
import { getAffinities, getAffinityPerformance, getProperties, getMetrics } from '../../../services/apiService';
import SkeletonLoader from '../../common/SkeletonLoader';
import { affinityWithPerformanceShape, performanceDataShape } from '../../../types/affinityTypes';
import PerformanceMetrics from '../../performance/PerformanceMetrics';
import PerformanceTable from '../../performance/PerformanceTable';
import PrintableView from '../workbench/CompareTab/PrintableView';

const ITEMS_PER_PAGE = 10;

const PerformanceTab = () => {
  const [selectedAffinity, setSelectedAffinity] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(Math.floor((new Date().getMonth() / 3)) + 1);
  const [performanceData, setPerformanceData] = useState([]);
  const [properties, setProperties] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'affinityName', direction: 'asc' });
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedAffinityDetails, setSelectedAffinityDetails] = useState(null);
  const [showPrintView, setShowPrintView] = useState(false);

  // Generate years array (current year and 4 years back)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);

  // Quarters array
  const quarters = [1, 2, 3, 4];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const affinitiesResponse = await getAffinities();
        const affinities = affinitiesResponse.data || [];
        
        const performanceResponse = await getAffinityPerformance(null, selectedYear, selectedQuarter);
        const performance = performanceResponse.data || [];
        
        const enrichedData = performance.map(perf => {
          const affinityId = String(perf.affinityId);
          const affinity = affinities.find(a => String(a.id) === affinityId);
          return {
            ...perf,
            affinityName: affinity ? affinity.name : perf.name || 'Unknown Affinity',
            affinity: affinity || null,
            year: selectedYear,
            quarter: selectedQuarter
          };
        });
        
        setPerformanceData(enrichedData);
        
        const propsResponse = await getProperties();
        const props = propsResponse.data || [];
        setProperties(props);
        
        const metricsResponse = await getMetrics();
        const mets = metricsResponse.data || [];
        setMetrics(mets);
        
      } catch (err) {
        setError('Failed to load performance data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedAffinity, selectedYear, selectedQuarter]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = performanceData;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.affinityName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [performanceData, searchTerm, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAffinityClick = (rowIndex) => {
    if (loading) {
      return;
    }
    
    setSelectedRowIndex(rowIndex);
    const selectedData = paginatedData[rowIndex];
    
    if (selectedData) {
      const requiredFields = [
        'id', 'affinityId', 'clicks', 'impressions', 
        'transactions', 'gpNet', 'dateCreated', 'lastUpdatedDate'
      ];
      
      const missingFields = requiredFields.filter(field => 
        selectedData[field] === undefined || selectedData[field] === null
      );
      
      if (missingFields.length > 0) {
        return;
      }
      
      const performance = {
        id: selectedData.id,
        affinityId: selectedData.affinityId,
        year: selectedYear,
        quarter: selectedQuarter,
        clicks: selectedData.clicks,
        impressions: selectedData.impressions,
        transactions: selectedData.transactions,
        gpNet: selectedData.gpNet,
        dateCreated: selectedData.dateCreated,
        lastUpdatedDate: selectedData.lastUpdatedDate,
        affinityName: selectedData.affinityName
      };
      
      if (!performance || typeof performance !== 'object') {
        return;
      }
      
      const updatedDetails = {
        affinityName: selectedData.affinityName,
        performance: performance
      };
      
      if (!updatedDetails.performance || typeof updatedDetails.performance !== 'object') {
        return;
      }
      
      setSelectedAffinityDetails(updatedDetails);
    }
  };

  const handlePrint = () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 100);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (loading) {
    return <SkeletonLoader count={3} height={100} />;
  }

  if (showPrintView) {
    return (
      <PrintableView
        affinities={performanceData.map(item => ({
          ...item,
          year: selectedYear,
          quarter: selectedQuarter
        }))}
        periodState={{
          mode: 'quarter',
          year: selectedYear,
          quarter: selectedQuarter
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Controls Row */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search affinities..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Time Period Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(Number(e.target.value));
              }}
              className="border rounded px-3 py-1"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={selectedQuarter}
              onChange={(e) => {
                setSelectedQuarter(Number(e.target.value));
              }}
              className="border rounded px-3 py-1"
            >
              {quarters.map((quarter) => (
                <option key={quarter} value={quarter}>
                  Q{quarter}
                </option>
              ))}
            </select>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-50"
          >
            <FiPrinter className="mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Grid Section */}
      <div>
        <PerformanceTable
          data={paginatedData}
          sortConfig={sortConfig}
          onSort={handleSort}
          onRowClick={handleAffinityClick}
          selectedRowIndex={selectedRowIndex}
        />
      </div>

      {/* Metrics Section */}
      <div className="mt-8">
        {!loading && selectedAffinityDetails && 
         selectedAffinityDetails.performance && 
         typeof selectedAffinityDetails.performance === 'object' && 
         Object.keys(selectedAffinityDetails.performance).length > 0 ? (
          <PerformanceMetrics
            performance={selectedAffinityDetails.performance}
            properties={properties}
            metrics={metrics}
          />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Select an affinity to view detailed metrics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTab;