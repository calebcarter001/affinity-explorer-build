import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { FiSearch, FiMapPin, FiDownload, FiStar, FiDollarSign, FiCalendar, FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import { searchProperties } from '../../services/apiService';
import { cacheService } from '../../services/cacheService';
import Chart from 'chart.js/auto';
import EmptyStateStyled from '../common/EmptyStateStyled';
import PropertyCard from '../common/PropertyCard';
import { withRetry } from '../../utils/errorHandling';

const ITEMS_PER_PAGE = 10;
const MAX_RETRIES = 3;

const ScoringExplorer = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // Enhanced loadAllProperties with retry logic
  const loadAllProperties = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cacheKey = cacheService.generateKey('properties', { page, limit: ITEMS_PER_PAGE });
      const cachedData = cacheService.get(cacheKey);
      
      if (cachedData) {
        setProperties(cachedData.data);
        setTotalPages(cachedData.totalPages);
        setLoading(false);
        return;
      }

      const loadData = async () => {
        const response = await searchProperties('', page, ITEMS_PER_PAGE);
        setProperties(response.data);
        setTotalPages(response.totalPages);
        
        // Cache the results
        cacheService.set(cacheKey, response);
      };

      await withRetry(loadData, MAX_RETRIES);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced handleSearch with retry logic
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      loadAllProperties(currentPage);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      
      // Check cache first
      const cacheKey = cacheService.generateKey('properties_search', { 
        term: searchTerm, 
        page: currentPage, 
        limit: ITEMS_PER_PAGE 
      });
      const cachedData = cacheService.get(cacheKey);
      
      if (cachedData) {
        setProperties(cachedData.data);
        setTotalPages(cachedData.totalPages);
        setIsSearching(false);
        return;
      }

      const performSearch = async () => {
        const response = await searchProperties(searchTerm, currentPage, ITEMS_PER_PAGE);
        setProperties(response.data);
        setTotalPages(response.totalPages);
        
        // Cache the results
        cacheService.set(cacheKey, response);
      };

      await withRetry(performSearch, MAX_RETRIES);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, currentPage]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, handleSearch]);

  // Initial load
  useEffect(() => {
    loadAllProperties(1);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectProperty = (property) => {
    // Optimistic update
    setSelectedProperty(property);
    
    // Update the property in the list to show it's selected
    setProperties(prevProperties => 
      prevProperties.map(p => ({
        ...p,
        isSelected: p.id === property.id
      }))
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (searchTerm) {
      handleSearch();
    } else {
      loadAllProperties(pageNumber);
    }
  };

  useEffect(() => {
    if (selectedProperty && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Create new chart
      chartInstance.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: selectedProperty.affinityScores.map(score => score.name),
          datasets: [{
            label: 'Affinity Scores',
            data: selectedProperty.affinityScores.map(score => score.score),
            backgroundColor: 'rgba(74, 108, 247, 0.2)',
            borderColor: 'rgba(74, 108, 247, 1)',
            pointBackgroundColor: 'rgba(74, 108, 247, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(74, 108, 247, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 1,
              ticks: {
                stepSize: 0.2
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedProperty]);
  
  const renderPropertyList = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 border rounded-lg animate-pulse bg-white">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-4 bg-gray-200 rounded w-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <EmptyStateStyled
          type="ERROR"
          actionButton={{
            label: 'Try Again',
            onClick: () => {
              if (searchTerm) {
                handleSearch();
              } else {
                loadAllProperties(currentPage);
              }
            }
          }}
          suggestions={[
            'Check your internet connection',
            'Verify that the API service is running',
            'Try refreshing the page'
          ]}
        />
      );
    }

    if (!properties || !properties.length) {
      return (
        <EmptyStateStyled
          type="NO_RESULTS"
          actionButton={{
            label: 'Clear Search',
            onClick: () => {
              setSearchTerm('');
              handleSearch();
            }
          }}
          suggestions={[
            'Try using different search terms',
            'Check for typos in your search',
            'Remove any filters that might be limiting results'
          ]}
        />
      );
    }

    // Calculate pagination
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = properties.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {currentItems.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              onClick={selectProperty}
              showMetrics={false}
            />
          ))}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <div className="mt-2 text-center text-sm text-gray-500">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, properties.length)} of {properties.length} properties
        </div>
      </div>
    );
  };

  const renderPropertyDetails = () => {
    if (loading) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!selectedProperty) {
      return (
        <EmptyStateStyled
          type="NO_DATA"
          title="Select a Property"
          description="Choose a property from the list to view its scoring details"
          suggestions={[
            'Click on a property card to select it',
            'Use the search bar to find specific properties',
            'Try clearing any active filters if you don\'t see expected properties'
          ]}
        />
      );
    }

    const getInterpretation = (score) => {
      if (score >= 0.9) return 'Exceptional match';
      if (score >= 0.8) return 'Strong match';
      if (score >= 0.6) return 'Good match';
      if (score >= 0.4) return 'Moderate match';
      return 'Weak match';
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold">Property Affinity Scores</h3>
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium text-base">Score Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProperty.affinityScores.map(score => (
                <div key={score.name} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{score.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      score.score >= 0.8 ? 'text-green-600' : 
                      score.score >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {score.score.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        score.score >= 0.8 ? 'bg-green-600' : 
                        score.score >= 0.6 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${score.score * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-base">Affinity Sub-Scores</h4>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Affinity Concept
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interpretation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedProperty.affinityScores.map(score => (
                    <tr key={score.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {score.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          score.score >= 0.9 ? 'bg-green-100 text-green-800' :
                          score.score >= 0.8 ? 'bg-blue-100 text-blue-800' :
                          score.score >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {score.score.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getInterpretation(score.score)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ExplorerContainer>
      <ExplorerHeader>
        <h1>Property Affinity Scores</h1>
        <p>Search for properties and explore their affinity scores</p>
      </ExplorerHeader>
      
      <ExplorerGrid>
        <LeftPanel>
          <SearchSection>
            <SearchContainer>
              <SearchInput 
                type="text" 
                placeholder="Search by name, location, type, or amenities..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SearchButton onClick={handleSearch} disabled={loading || isSearching}>
                <FiSearch /> Search
              </SearchButton>
            </SearchContainer>
            
            {(loading || isSearching) && <LoadingMessage>Loading...</LoadingMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            {(!properties || properties.length === 0) && searchTerm && !loading && (
              <NoResults>No properties found matching your search.</NoResults>
            )}
          </SearchSection>
          
          <SearchResults>
            {renderPropertyList()}
          </SearchResults>
        </LeftPanel>
        
        <PropertyDetail>
          {renderPropertyDetails()}
        </PropertyDetail>
      </ExplorerGrid>
    </ExplorerContainer>
  );
};

const ExplorerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ExplorerHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--secondary-color);
  }
`;

const ExplorerGrid = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SearchSection = styled.section`
  background-color: var(--card-bg-light);
  border-radius: 8px;
  padding: 1.5rem;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg-light);
  transition: all 0.3s ease;
  
  .dark & {
    background-color: var(--card-bg-dark);
    border-color: #374151;
    color: var(--light-text);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.1);
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: #3451c4;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SearchResults = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: var(--card-bg-light);
  border-radius: 8px;
  padding: 1.5rem;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--card-bg-light);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }
  
  .dark &::-webkit-scrollbar-track {
    background: var(--card-bg-dark);
  }
`;

const PropertyDetail = styled.div`
  background-color: var(--card-bg-light);
  border-radius: 8px;
  padding: 2rem;
  height: calc(100vh - 200px);
  overflow-y: auto;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--card-bg-light);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }
  
  .dark &::-webkit-scrollbar-track {
    background: var(--card-bg-dark);
  }
`;

const LoadingMessage = styled.div`
  color: var(--secondary-color);
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  margin-top: 1rem;
`;

const NoResults = styled.div`
  color: var(--secondary-color);
  margin-top: 1rem;
  text-align: center;
  padding: 2rem;
`;

const ScoreValue = styled.span`
  font-weight: 600;
`;

export default ScoringExplorer;