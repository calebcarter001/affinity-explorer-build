import React from 'react';
import PropTypes from 'prop-types';
import { FiChevronUp, FiChevronDown, FiMoreVertical } from 'react-icons/fi';
import { performanceDataShape } from '../../types/affinityTypes';
import ModernGrid from '../common/ModernGrid';

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

  // Prepare headers with sort icons
  const headers = [
    <div key="affinityName" className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort('affinityName')}>
      <span>Affinity Name</span>
      {getSortIcon('affinityName')}
    </div>,
    <div key="clicks" className="flex items-center justify-end space-x-1 cursor-pointer" onClick={() => onSort('clicks')}>
      <span>Clicks</span>
      {getSortIcon('clicks')}
    </div>,
    <div key="impressions" className="flex items-center justify-end space-x-1 cursor-pointer" onClick={() => onSort('impressions')}>
      <span>Impressions</span>
      {getSortIcon('impressions')}
    </div>,
    <div key="transactions" className="flex items-center justify-end space-x-1 cursor-pointer" onClick={() => onSort('transactions')}>
      <span>Transactions</span>
      {getSortIcon('transactions')}
    </div>,
    <div key="gpNet" className="flex items-center justify-end space-x-1 cursor-pointer" onClick={() => onSort('gpNet')}>
      <span>GP Net</span>
      {getSortIcon('gpNet')}
    </div>
  ];

  // Prepare rows
  const rows = data.map(item => [
    item.affinityName,
    formatNumber(item.clicks),
    formatNumber(item.impressions),
    formatNumber(item.transactions),
    formatCurrency(item.gpNet)
  ]);

  return (
    <ModernGrid
      headers={headers}
      rows={rows}
      onRowClick={onRowClick}
      selectedRowIndex={selectedRowIndex}
      className="bg-white"
      headerCellClassName="text-gray-700"
      cellClassName="text-gray-700"
      emptyMessage="No performance data available"
    />
  );
};

PerformanceTable.propTypes = {
  data: PropTypes.arrayOf(performanceDataShape),
  sortConfig: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired
  }).isRequired,
  onSort: PropTypes.func.isRequired,
  onRowClick: PropTypes.func,
  selectedRowIndex: PropTypes.number
};

export default PerformanceTable; 