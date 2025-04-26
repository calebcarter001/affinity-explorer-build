import React from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiInfo, FiArrowUp, FiArrowDown, FiPrinter } from 'react-icons/fi';

const SearchDetailView = ({ searchQuery, searchResults, usingMockData, mockDataReason }) => {
  const [sortConfig, setSortConfig] = React.useState({
    key: 'similarity_score',
    direction: 'asc'
  });
  const [showPrintView, setShowPrintView] = React.useState(false);

  // Sort results
  const sortedResults = React.useMemo(() => {
    if (!searchResults) return [];
    
    const sorted = [...searchResults];
    sorted.sort((a, b) => {
      if (sortConfig.key === 'similarity_score') {
        return sortConfig.direction === 'asc' 
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [searchResults, sortConfig]);

  const requestSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: key === 'similarity_score'
        ? (prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc')
        : (prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc')
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <FiArrowUp className="inline" /> : <FiArrowDown className="inline" />;
  };

  const handlePrint = () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 100);
  };

  if (showPrintView) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="print-header mb-8">
          <h1 className="text-2xl font-bold mb-2">Search Results Report</h1>
          <p className="text-gray-600">Query: {searchQuery}</p>
          <p className="text-gray-600">{searchResults?.length || 0} results found</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase">
                  Related Affinities
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedResults.map((result, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {result.input_concept}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {result.category || '(empty)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Search Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <FiSearch className="text-blue-500 mr-2" size={20} />
            <h2 className="text-xl font-semibold">Search Results</h2>
          </div>
          <div className="text-sm text-gray-500">
            {searchResults?.length || 0} results found
          </div>
        </div>
        
        <div className="flex justify-end">
          {searchResults?.length > 0 && (
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-3 py-1 text-sm border rounded-md text-gray-600 hover:bg-gray-50"
            >
              <FiPrinter className="w-4 h-4" />
              <span>Print</span>
            </button>
          )}
        </div>
        
        <div className="mt-2">
          <span className="text-gray-600">Query: </span>
          <span className="font-medium">{searchQuery}</span>
        </div>
        
        {usingMockData && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
            <strong>Note:</strong> {mockDataReason || 'Using mock data for demonstration. The search server is not available.'}
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-b-2 border-gray-200"
                onClick={() => requestSort('input_concept')}
              >
                <div className="flex items-center space-x-1">
                  <span>Related Affinities</span>
                  {getSortIcon('input_concept')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-b-2 border-gray-200"
                onClick={() => requestSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  {getSortIcon('category')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResults.map((result, index) => (
              <tr 
                key={index} 
                className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
              >
                <td className="px-6 py-4 text-sm font-medium text-blue-600 hover:text-blue-800">
                  {result.input_concept}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {result.category || '(empty)'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {(!searchResults || searchResults.length === 0) && (
        <div className="text-center py-8">
          <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search query or filters.
          </p>
        </div>
      )}
    </div>
  );
};

SearchDetailView.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      input_concept: PropTypes.string.isRequired,
      category: PropTypes.string,
      similarity_score: PropTypes.number.isRequired
    })
  ).isRequired,
  usingMockData: PropTypes.bool,
  mockDataReason: PropTypes.string
};

export default SearchDetailView; 