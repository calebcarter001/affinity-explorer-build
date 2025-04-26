import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiInfo, FiArrowUp, FiArrowDown, FiPrinter, FiChevronDown, FiChevronRight } from 'react-icons/fi';

const SearchDetailView = ({ searchQuery, searchResults, usingMockData, mockDataReason }) => {
  const [sortConfig, setSortConfig] = React.useState({
    key: 'similarity_score',
    direction: 'asc'
  });
  const [showPrintView, setShowPrintView] = React.useState(false);
  const [openIndex, setOpenIndex] = useState(null);

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

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
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
              <th className="px-4 py-2 text-left font-bold text-gray-800 uppercase tracking-wider">Rank</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResults.map((result, index) => {
              // Find the index of the best match (smallest similarity_score)
              const bestScore = Math.min(...sortedResults.map(r => r.similarity_score));
              const isBest = result.similarity_score === bestScore;
              const rank = sortedResults
                .map(r => r.similarity_score)
                .sort((a, b) => a - b)
                .indexOf(result.similarity_score) + 1;
              return (
                <React.Fragment key={index}>
                  <tr 
                    className={
                      (isBest ? 'bg-yellow-50 ' : '') +
                      'hover:bg-blue-50 transition-colors duration-150 ease-in-out'
                    }
                  >
                    <td className="px-6 py-4 text-sm font-medium text-blue-600 hover:text-blue-800">
                      <span
                        className="inline-flex items-center font-semibold text-blue-700 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                        tabIndex={0}
                        role="button"
                        aria-expanded={openIndex === index}
                        aria-controls={`subscores-row-${index}`}
                        onClick={() => handleToggle(index)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleToggle(index); }}
                      >
                        {openIndex === index ? <FiChevronDown className="mr-1" /> : <FiChevronRight className="mr-1" />}
                        {result.highlight && result.highlight.input_concept ? (
                          <span className="font-bold text-yellow-600 bg-yellow-100 px-1 rounded">
                            {result.input_concept}
                          </span>
                        ) : (
                          result.input_concept
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {result.highlight && result.highlight.category ? (
                        <span className="font-bold text-yellow-600 bg-yellow-100 px-1 rounded">
                          {result.category}
                        </span>
                      ) : result.category || <span className="text-gray-400">(empty)</span>}
                      {/* Highlight related tags if present */}
                      {result.highlight && result.highlight.related_tags && result.highlight.related_tags.length > 0 && (
                        <div className="mt-1 text-xs">
                          {result.highlight.related_tags.map((tag, i) => (
                            <span key={i} className="inline-block font-bold text-yellow-600 bg-yellow-100 px-1 rounded mr-1">{tag}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center align-middle">
                      {isBest ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-yellow-800 bg-green-200 rounded-full" title={`Similarity score: ${result.similarity_score}`}>
                          #1 <span className="ml-1">Best Match</span>
                        </span>
                      ) : (
                        <span className="inline-block text-gray-500 font-semibold">#{rank}</span>
                      )}
                    </td>
                  </tr>
                  {openIndex === index && result.platform_scores && (
                    <tr id={`subscores-row-${index}`}>
                      <td colSpan={2} className="px-8 pb-4 pt-0 bg-blue-50">
                        <div className="text-xs text-gray-700 font-medium mb-1">Subscores used in calculation:</div>
                        <ul className="list-disc list-inside text-sm text-gray-800">
                          {(Array.isArray(result.platform_scores)
                            ? result.platform_scores
                            : typeof result.platform_scores === 'string' && result.platform_scores
                              ? result.platform_scores.split(/[;,]/).map(s => s.trim()).filter(Boolean)
                              : []
                          ).map((score, i) => (
                            <li key={i}>{score}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
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