import React from 'react';
import PropTypes from 'prop-types';
import { FiChevronUp, FiChevronDown, FiMoreVertical } from 'react-icons/fi';
import { affinityShape } from '../../types/affinityTypes';
import ModernGrid from '../common/ModernGrid';

const AffinityTable = ({
  affinities,
  sortConfig,
  onSort,
  onRowClick,
  selectedRowIndex
}) => {
  if (!affinities || affinities.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No affinities available</p>
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
    <div key="name" className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort('name')}>
      <span>Name</span>
      {getSortIcon('name')}
    </div>,
    <div key="description" className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort('description')}>
      <span>Description</span>
      {getSortIcon('description')}
    </div>,
    <div key="status" className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort('status')}>
      <span>Status</span>
      {getSortIcon('status')}
    </div>,
    <div key="dateCreated" className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort('dateCreated')}>
      <span>Created</span>
      {getSortIcon('dateCreated')}
    </div>
  ];

  // Prepare rows
  const rows = affinities.map(affinity => [
    affinity.name,
    affinity.description,
    <span key={affinity.id} className={`px-2 py-1 text-xs font-medium rounded-full ${
      affinity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      {affinity.status}
    </span>,
    new Date(affinity.dateCreated).toLocaleDateString()
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
      emptyMessage="No affinities available"
    />
  );
};

AffinityTable.propTypes = {
  affinities: PropTypes.arrayOf(affinityShape),
  sortConfig: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired
  }).isRequired,
  onSort: PropTypes.func.isRequired,
  onRowClick: PropTypes.func,
  selectedRowIndex: PropTypes.number
};

export default AffinityTable; 