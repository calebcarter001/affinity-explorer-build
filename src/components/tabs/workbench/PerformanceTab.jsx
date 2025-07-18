import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FiChevronDown, FiChevronUp, FiMoreVertical, FiSearch, FiChevronLeft, FiChevronRight, FiRefreshCw, FiPrinter } from 'react-icons/fi';
import { getAffinities, getAffinityPerformance, getProperties, getMetrics } from '../../../services/apiService';
import SkeletonLoader from '../../common/SkeletonLoader';
import { affinityWithPerformanceShape, performanceDataShape } from '../../../types/affinityTypes';
import PerformanceMetrics from '../../performance/PerformanceMetrics';
import PerformanceTable from '../../performance/PerformanceTable';
import PrintableView from '../workbench/CompareTab/PrintableView';
import { useSearchParams } from 'react-router-dom';
import SearchBar from './PerformanceTabParts/SearchBar';
import Pagination from './PerformanceTabParts/Pagination';
import AffinityDetailsPanel from './PerformanceTabParts/AffinityDetailsPanel';
import { useAppContext } from '../../../contexts/AppContext';
import SearchableDropdown from '../../common/SearchableDropdown';

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
  const searchTimeout = useRef();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToRecentlyViewed } = useAppContext();

  // Memoized years and quarters
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);
  const quarters = [1, 2, 3, 4];

  // Initialize from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    setSearchTerm(urlSearch);
    setCurrentPage(urlPage);
  }, []);

  // Update URL when searchTerm or currentPage changes
  useEffect(() => {
    setSearchParams({
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(currentPage > 1 ? { page: currentPage } : {})
    });
  }, [searchTerm, currentPage, setSearchParams]);

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

  // Debounce searchTerm
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm]);

  // Memoized filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = performanceData;
    if (debouncedSearchTerm) {
      filtered = filtered.filter(item => 
        item.affinityName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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
  }, [performanceData, debouncedSearchTerm, sortConfig]);

  // Memoized paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);

  // Handlers using useCallback for referential stability
  const handleSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleAffinityClick = useCallback((rowIndex) => {
    if (loading) return;
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
      if (missingFields.length > 0) return;
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
      if (!performance || typeof performance !== 'object') return;
      const updatedDetails = {
        affinityName: selectedData.affinityName,
        performance: performance
      };
      if (!updatedDetails.performance || typeof updatedDetails.performance !== 'object') return;
      setSelectedAffinityDetails(updatedDetails);
      if (selectedData.affinity) {
        addToRecentlyViewed(selectedData.affinity);
      }
    }
  }, [loading, paginatedData, selectedYear, selectedQuarter, addToRecentlyViewed]);

  const handlePrint = useCallback(() => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 100);
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg flex flex-col items-center">
        <p className="text-red-700 mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FiRefreshCw className="mr-2" /> Retry
        </button>
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
        <SearchBar value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        {/* Time Period Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <SearchableDropdown
              options={years.map(year => ({ value: year, label: year.toString() }))}
              value={{ value: selectedYear, label: selectedYear.toString() }}
              onChange={(option) => setSelectedYear(option ? Number(option.value) : new Date().getFullYear())}
              placeholder="Select year..."
              className="w-24"
              noOptionsMessage="No years found"
            />
            <SearchableDropdown
              options={quarters.map(quarter => ({ value: quarter, label: `Q${quarter}` }))}
              value={{ value: selectedQuarter, label: `Q${selectedQuarter}` }}
              onChange={(option) => setSelectedQuarter(option ? Number(option.value) : 1)}
              placeholder="Select quarter..."
              className="w-24"
              noOptionsMessage="No quarters found"
            />
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {/* Details Panel */}
      {selectedAffinityDetails && (
        <AffinityDetailsPanel
          selectedAffinityDetails={selectedAffinityDetails}
          loading={loading}
          error={error}
          properties={properties}
          metrics={metrics}
        />
      )}
    </div>
  );
};

export default PerformanceTab;