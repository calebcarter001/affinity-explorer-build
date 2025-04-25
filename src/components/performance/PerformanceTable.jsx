import React from 'react';
import PropTypes from 'prop-types';
import { FiChevronUp, FiChevronDown, FiMoreVertical } from 'react-icons/fi';
import { performanceDataShape } from '../../types/affinityTypes';

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

const PerformanceTable = ({
  data,
  sortConfig,
  onSort,
  onRowClick,
  selectedRowIndex
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('affinityName')}
            >
              <div className="flex items-center space-x-1">
                <span>Affinity Name</span>
                {getSortIcon('affinityName')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('clicks')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Clicks</span>
                {getSortIcon('clicks')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('impressions')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Impressions</span>
                {getSortIcon('impressions')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('transactions')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Transactions</span>
                {getSortIcon('transactions')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('gpNet')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>GP (Net)</span>
                {getSortIcon('gpNet')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr
              key={row.id}
              className={`hover:bg-gray-50 cursor-pointer ${selectedRowIndex === index ? 'bg-blue-50' : ''}`}
              onClick={() => onRowClick(index)}
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
  );
};

PerformanceTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      affinityId: PropTypes.string.isRequired,
      affinityName: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      clicks: PropTypes.number.isRequired,
      impressions: PropTypes.number.isRequired,
      transactions: PropTypes.number.isRequired,
      gpNet: PropTypes.number.isRequired,
      dateCreated: PropTypes.string.isRequired,
      lastUpdatedDate: PropTypes.string.isRequired
    })
  ).isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.oneOf(['affinityName', 'clicks', 'impressions', 'transactions', 'gpNet']).isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired
  }).isRequired,
  onSort: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  selectedRowIndex: PropTypes.number
};

export default PerformanceTable; 