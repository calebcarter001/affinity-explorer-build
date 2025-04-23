import React, { useState, useMemo, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiMoreVertical, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AffinityDetailView from '../../common/AffinityDetailView';
import { getAffinities } from '../../../services/apiService';
import SkeletonLoader from '../../common/SkeletonLoader';

const PerformanceTab = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: 'clicks',
    direction: 'desc'
  });
  const [selectedAffinityDetails, setSelectedAffinityDetails] = useState(null);
  const [loadingAffinityDetails, setLoadingAffinityDetails] = useState(false);

  const ITEMS_PER_PAGE = 6;

  // Create yearly performance data with historical trends
  const yearlyPerformanceData = {
    '2024': [
      {
        affinityId: 1,
        affinityName: 'all inclusive',
        clicks: 3931335,
        impressions: 56890607,
        transactions: 5504,
        gpNet: 926886
      },
      {
        affinityId: 2,
        affinityName: 'budget',
        clicks: 2933713,
        impressions: 86325301,
        transactions: 60882,
        gpNet: 1826208
      },
      {
        affinityId: 3,
        affinityName: 'pet friendly',
        clicks: 1382166,
        impressions: 8560654,
        transactions: 17092,
        gpNet: 1017573
      },
      {
        affinityId: 4,
        affinityName: 'beach',
        clicks: 1375225,
        impressions: 38214417,
        transactions: 5654,
        gpNet: 798911
      },
      {
        affinityId: 5,
        affinityName: 'outdoor pool',
        clicks: 1062738,
        impressions: 18847512,
        transactions: 4310,
        gpNet: 498842
      }
    ],
    '2023': [
      {
        affinityId: 1,
        affinityName: 'all inclusive',
        clicks: 3245782,
        impressions: 48356016,
        transactions: 4623,
        gpNet: 845221
      },
      {
        affinityId: 2,
        affinityName: 'budget',
        clicks: 2456892,
        impressions: 72563421,
        transactions: 52345,
        gpNet: 1623456
      },
      {
        affinityId: 3,
        affinityName: 'pet friendly',
        clicks: 1156234,
        impressions: 7234567,
        transactions: 14567,
        gpNet: 876543
      },
      {
        affinityId: 4,
        affinityName: 'beach',
        clicks: 1234567,
        impressions: 32456789,
        transactions: 4789,
        gpNet: 678234
      },
      {
        affinityId: 5,
        affinityName: 'outdoor pool',
        clicks: 987654,
        impressions: 15678234,
        transactions: 3876,
        gpNet: 423456
      }
    ],
    '2022': [
      {
        affinityId: 1,
        affinityName: 'all inclusive',
        clicks: 2876543,
        impressions: 42345678,
        transactions: 3987,
        gpNet: 756432
      },
      {
        affinityId: 2,
        affinityName: 'budget',
        clicks: 2123456,
        impressions: 65432198,
        transactions: 45678,
        gpNet: 1432198
      },
      {
        affinityId: 3,
        affinityName: 'pet friendly',
        clicks: 987654,
        impressions: 6543219,
        transactions: 12345,
        gpNet: 765432
      },
      {
        affinityId: 4,
        affinityName: 'beach',
        clicks: 1098765,
        impressions: 28765432,
        transactions: 4123,
        gpNet: 587654
      },
      {
        affinityId: 5,
        affinityName: 'outdoor pool',
        clicks: 876543,
        impressions: 13456789,
        transactions: 3234,
        gpNet: 376543
      }
    ]
  };

  const years = ['2024', '2023', '2022'];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const filteredAndSortedData = useMemo(() => {
    // Get data for the selected year
    let filtered = [...yearlyPerformanceData[selectedYear]];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.affinityName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [yearlyPerformanceData, selectedYear, searchTerm, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedRow(null); // Reset selection when changing pages
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FiMoreVertical className="w-4 h-4" />;
    }
    return sortConfig.direction === 'asc' ? (
      <FiChevronUp className="w-4 h-4" />
    ) : (
      <FiChevronDown className="w-4 h-4" />
    );
  };

  const handleAffinityClick = async (rowIndex) => {
    setSelectedRow(rowIndex);
    setLoadingAffinityDetails(true);
    
    try {
      const performanceData = yearlyPerformanceData[selectedYear][rowIndex];
      console.log('Selected affinity:', performanceData.affinityId);
      
      // Fetch full affinity details using ID
      const response = await getAffinities();
      const affinityDetails = response.data.find(a => a.id === performanceData.affinityId);
      console.log('Found affinity details:', affinityDetails);
      
      if (affinityDetails) {
        const details = {
          ...affinityDetails,
          performance: {
            ...performanceData,
            year: selectedYear
          }
        };
        console.log('Setting affinity details:', details);
        setSelectedAffinityDetails(details);
      } else {
        console.error('Affinity details not found:', performanceData.affinityId);
        setSelectedAffinityDetails(null);
      }
    } catch (error) {
      console.error('Error in handleAffinityClick:', error);
      setSelectedAffinityDetails(null);
    } finally {
      setLoadingAffinityDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Row */}
      <div className="flex justify-between items-center">
        {/* Search Input */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search affinities..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Year Selector */}
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Performance Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('affinityName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Affinity Name</span>
                    {getSortIcon('affinityName')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('clicks')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Clicks</span>
                    {getSortIcon('clicks')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('impressions')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Impressions</span>
                    {getSortIcon('impressions')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('transactions')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Transactions</span>
                    {getSortIcon('transactions')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('gpNet')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>GP (Net)</span>
                    {getSortIcon('gpNet')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, index) => (
                <tr
                  key={row.affinityName}
                  className={`hover:bg-gray-50 cursor-pointer ${selectedRow === index ? 'bg-blue-50' : ''}`}
                  onClick={() => handleAffinityClick(index)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.affinityName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {formatNumber(row.clicks)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {formatNumber(row.impressions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {formatNumber(row.transactions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {formatCurrency(row.gpNet)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData.length)}
                </span> of{' '}
                <span className="font-medium">{filteredAndSortedData.length}</span> results
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics and Affinity Details */}
      {selectedRow !== null && (
        <div className="mt-6 grid grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Click-through Rate (CTR)</p>
                <p className="text-lg font-medium">
                  {((filteredAndSortedData[selectedRow].clicks / filteredAndSortedData[selectedRow].impressions) * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-lg font-medium">
                  {((filteredAndSortedData[selectedRow].transactions / filteredAndSortedData[selectedRow].clicks) * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average GP per Transaction</p>
                <p className="text-lg font-medium">
                  {formatCurrency(filteredAndSortedData[selectedRow].gpNet / filteredAndSortedData[selectedRow].transactions)}
                </p>
              </div>
            </div>
          </div>

          {/* Affinity Details */}
          <div className="bg-white rounded-lg shadow">
            {loadingAffinityDetails ? (
              <SkeletonLoader count={1} height={400} />
            ) : selectedAffinityDetails ? (
              <AffinityDetailView
                affinity={selectedAffinityDetails}
                taggedPropertiesCount={selectedAffinityDetails.totalProperties}
                propertiesWithScoreCount={selectedAffinityDetails.activeProperties}
                showImplementation={false}
                showUsageGuidelines={false}
              />
            ) : (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Affinity Details</h3>
                <p className="text-sm text-gray-500">
                  Loading affinity details for {filteredAndSortedData[selectedRow].affinityName}...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceTab; 