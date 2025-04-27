import React from 'react';
import PropTypes from 'prop-types';

const ModernGrid = ({ 
  headers, 
  rows, 
  className = '', 
  headerClassName = '', 
  rowClassName = '', 
  cellClassName = '',
  headerCellClassName = '',
  emptyMessage = 'No data available',
  onRowClick,
  selectedRowIndex
}) => {
  if (!rows || rows.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-lg shadow-sm ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ${headerCellClassName} ${headerClassName}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(rowIndex)}
              className={`
                ${onRowClick ? 'cursor-pointer hover:bg-blue-50' : ''}
                ${selectedRowIndex === rowIndex ? 'bg-blue-100' : ''}
                ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                ${rowClassName}
              `}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${cellClassName}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ModernGrid.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.node).isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)).isRequired,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  cellClassName: PropTypes.string,
  headerCellClassName: PropTypes.string,
  emptyMessage: PropTypes.string,
  onRowClick: PropTypes.func,
  selectedRowIndex: PropTypes.number
};

export default ModernGrid; 