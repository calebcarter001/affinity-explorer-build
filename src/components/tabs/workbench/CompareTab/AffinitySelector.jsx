import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiX, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import debounce from 'lodash/debounce';

const AffinitySelector = ({
  affinities,
  selectedAffinities,
  onSelect,
  loading,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Debounced search results
  const filteredAffinities = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return affinities
      .filter(affinity => 
        affinity.name.toLowerCase().includes(term) ||
        affinity.category?.toLowerCase().includes(term)
      )
      .slice(0, 10); // Limit to 10 results
  }, [affinities, searchTerm]);

  const isSelected = (affinity) => selectedAffinities.some(a => a.id === affinity.id);
  const canSelect = selectedAffinities.length < 4;

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isSearchFocused) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < filteredAffinities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredAffinities[activeIndex]) {
          onSelect(filteredAffinities[activeIndex]);
          setSearchTerm('');
          setActiveIndex(0);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSearchTerm('');
        setActiveIndex(0);
        searchRef.current?.blur();
        break;
    }
  };

  // Clear search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with Selected Affinities */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Select Affinities to Compare</h3>
          <span className="text-sm text-gray-500">
            {selectedAffinities.length} of 4 selected
          </span>
        </div>

        {/* Selected Affinities Strip */}
        {selectedAffinities.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {selectedAffinities.map((affinity, index) => (
              <div
                key={affinity.id}
                className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 min-w-fit"
              >
                <span className="text-xs text-blue-500 mr-2">#{index + 1}</span>
                <span className="text-sm font-medium">{affinity.name}</span>
                <button
                  onClick={() => onSelect(affinity)}
                  className="ml-2 text-blue-400 hover:text-blue-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
            {selectedAffinities.length < 4 && (
              <div className="text-sm text-gray-500 flex items-center px-3 py-2">
                + {4 - selectedAffinities.length} more available
              </div>
            )}
          </div>
        )}
        
        {/* Enhanced Search */}
        <div className="relative" ref={resultsRef}>
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search affinities by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Search Results Dropdown */}
          {isSearchFocused && searchTerm && (
            <div className="absolute z-10 left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-gray-500 text-sm">Searching...</div>
              ) : error ? (
                <div className="p-3 text-red-500 text-sm">{error}</div>
              ) : filteredAffinities.length === 0 ? (
                <div className="p-3 text-gray-500 text-sm">No affinities found</div>
              ) : (
                <div className="py-1">
                  {filteredAffinities.map((affinity, index) => {
                    const selected = isSelected(affinity);
                    return (
                      <button
                        key={affinity.id}
                        onClick={() => {
                          if (selected || canSelect) {
                            onSelect(affinity);
                            setSearchTerm('');
                            setActiveIndex(0);
                          }
                        }}
                        className={`
                          w-full px-4 py-2 text-left flex items-center justify-between
                          ${activeIndex === index ? 'bg-gray-50' : 'hover:bg-gray-50'}
                          ${selected ? 'text-blue-600' : 'text-gray-700'}
                          ${!selected && !canSelect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                        disabled={!selected && !canSelect}
                      >
                        <div>
                          <div className="font-medium">{affinity.name}</div>
                          <div className="text-xs text-gray-500">
                            {affinity.category || 'Uncategorized'}
                          </div>
                        </div>
                        {selected && <FiCheck className="w-4 h-4 text-blue-500" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selection Guidance */}
      <div className="p-4 bg-gray-50 text-sm text-gray-600">
        {selectedAffinities.length === 0 ? (
          "Search and select at least 2 affinities to compare"
        ) : selectedAffinities.length === 1 ? (
          "Select 1 more affinity to enable comparison"
        ) : (
          `You can select ${4 - selectedAffinities.length} more ${4 - selectedAffinities.length === 1 ? 'affinity' : 'affinities'}`
        )}
      </div>
    </div>
  );
};

AffinitySelector.propTypes = {
  affinities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string,
      scoreAvailable: PropTypes.bool
    })
  ).isRequired,
  selectedAffinities: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string
};

export default AffinitySelector; 