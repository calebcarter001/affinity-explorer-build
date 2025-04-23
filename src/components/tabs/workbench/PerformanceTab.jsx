import React, { useState, useMemo, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiMoreVertical, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AffinityDetailView from '../../common/AffinityDetailView';
import { getAffinities, getAffinityTaggedProperties } from '../../../services/apiService';
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
  const [taggedPropertiesCount, setTaggedPropertiesCount] = useState(0);
  const [propertiesWithScoreCount, setPropertiesWithScoreCount] = useState(0);

  const ITEMS_PER_PAGE = 6;

  // Mock data structure based on the provided spreadsheet
  const performanceData = [
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
    },
    {
      affinityId: 6,
      affinityName: 'ocean view',
      clicks: 783521,
      impressions: 9142716,
      transactions: 5656,
      gpNet: 889168
    },
    {
      affinityId: 7,
      affinityName: 'cabin',
      clicks: 776463,
      impressions: 9855561,
      transactions: 3223,
      gpNet: 495552
    },
    {
      affinityId: 8,
      affinityName: 'family friendly',
      clicks: 697507,
      impressions: 8581996,
      transactions: 2302,
      gpNet: 172081
    },
    {
      affinityId: 9,
      affinityName: 'luxury',
      clicks: 663849,
      impressions: 15107144,
      transactions: 4685,
      gpNet: 310475
    },
    {
      affinityId: 10,
      affinityName: 'private vacation homes',
      clicks: 601389,
      impressions: 23478380,
      transactions: 3151,
      gpNet: 812902
    },
    {
      affinityId: 11,
      affinityName: 'hot tub',
      clicks: 567153,
      impressions: 1989279,
      transactions: 3171,
      gpNet: 120253
    },
    {
      affinityId: 12,
      affinityName: 'spa',
      clicks: 514927,
      impressions: 5594406,
      transactions: 1015,
      gpNet: 47913
    },
    {
      affinityId: 13,
      affinityName: 'apartments',
      clicks: 404886,
      impressions: 10203298,
      transactions: 1198,
      gpNet: 264573
    },
    {
      affinityId: 14,
      affinityName: 'kitchen',
      clicks: 395730,
      impressions: 3357168,
      transactions: 2731,
      gpNet: 222386
    },
    {
      affinityId: 15,
      affinityName: 'adult',
      clicks: 374613,
      impressions: 627987,
      transactions: 643,
      gpNet: 89232
    },
    {
      affinityId: 16,
      affinityName: 'free breakfast',
      clicks: 355306,
      impressions: 4469131,
      transactions: 2791,
      gpNet: 111207
    },
    {
      affinityId: 17,
      affinityName: 'casino',
      clicks: 331673,
      impressions: 2071452,
      transactions: 1392,
      gpNet: 52411
    },
    {
      affinityId: 18,
      affinityName: 'free airport transportation',
      clicks: 288416,
      impressions: 1031076,
      transactions: 8221,
      gpNet: 197189
    },
    {
      affinityId: 19,
      affinityName: 'romantic',
      clicks: 275930,
      impressions: 1160335,
      transactions: 791,
      gpNet: 34019
    },
    {
      affinityId: 20,
      affinityName: 'waterpark',
      clicks: 268288,
      impressions: 1037138,
      transactions: 461,
      gpNet: 26031
    },
    {
      affinityId: 21,
      affinityName: 'villas',
      clicks: 260809,
      impressions: 9090130,
      transactions: 396,
      gpNet: 193476
    },
    {
      affinityId: 22,
      affinityName: 'cottages',
      clicks: 256755,
      impressions: 9637532,
      transactions: 665,
      gpNet: 109539
    },
    {
      affinityId: 23,
      affinityName: 'lgbt welcoming',
      clicks: 247521,
      impressions: 491267,
      transactions: 336,
      gpNet: 17789
    },
    {
      affinityId: 24,
      affinityName: 'parking',
      clicks: 221537,
      impressions: 5289284,
      transactions: 2281,
      gpNet: 80483
    },
    {
      affinityId: 25,
      affinityName: 'lake',
      clicks: 219909,
      impressions: 2490731,
      transactions: 778,
      gpNet: 145087
    },
    {
      affinityId: 26,
      affinityName: 'indoor pool',
      clicks: 187015,
      impressions: 460315,
      transactions: 2906,
      gpNet: 87880
    },
    {
      affinityId: 27,
      affinityName: 'golf',
      clicks: 128955,
      impressions: 415269,
      transactions: 422,
      gpNet: 20861
    },
    {
      affinityId: 28,
      affinityName: 'waterslide',
      clicks: 120347,
      impressions: 149960,
      transactions: 622,
      gpNet: 22911
    },
    {
      affinityId: 29,
      affinityName: 'balcony',
      clicks: 118718,
      impressions: 588227,
      transactions: 1055,
      gpNet: 52000
    },
    {
      affinityId: 30,
      affinityName: 'early check in',
      clicks: 115563,
      impressions: 241595,
      transactions: 1185,
      gpNet: 33206
    }
  ];

  const years = ['2024', '2023', '2022', '2021'];

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
    let filtered = [...performanceData];
    
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
  }, [performanceData, searchTerm, sortConfig]);

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
      const performanceData = filteredAndSortedData[rowIndex];
      console.log('Selected affinity:', performanceData.affinityId);
      
      // Fetch full affinity details using ID
      const response = await getAffinities();
      const affinityDetails = response.data.find(a => a.id === performanceData.affinityId);
      console.log('Found affinity details:', affinityDetails);
      
      // Fetch tagged properties data using ID
      const taggedData = await getAffinityTaggedProperties(performanceData.affinityId);
      console.log('Tagged properties data:', taggedData);
      setTaggedPropertiesCount(taggedData.tagged || 0);
      setPropertiesWithScoreCount(taggedData.withScore || 0);
      
      if (affinityDetails) {
        const details = {
          ...affinityDetails,
          performance: performanceData
        };
        console.log('Setting affinity details:', details);
        setSelectedAffinityDetails(details);
      } else {
        console.error('Affinity details not found:', performanceData.affinityId);
        setSelectedAffinityDetails(null);
      }
    } catch (error) {
      console.error('Error in handleAffinityClick:', error);
      setTaggedPropertiesCount(0);
      setPropertiesWithScoreCount(0);
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
                taggedPropertiesCount={taggedPropertiesCount}
                propertiesWithScoreCount={propertiesWithScoreCount}
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