import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSearch, FiCheck, FiClock, FiAlertCircle, FiPlus, FiChevronLeft, FiChevronRight, FiLayers, FiBook } from 'react-icons/fi';
import { getAffinities, advancedSearch } from '../../services/apiService';
import EmptyStateStyled from '../common/EmptyStateStyled';
import SkeletonLoader from '../common/SkeletonLoader';
import AffinityCollections from '../collections/AffinityCollections';
import AffinityDetailView from '../common/AffinityDetailView';
import SearchDetailView from '../common/SearchDetailView';

const AffinityLibrary = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.view || 'library');
  const [affinities, setAffinities] = useState([]);
  const [filteredAffinities, setFilteredAffinities] = useState([]);
  const [selectedAffinity, setSelectedAffinity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Advanced search state
  const [advancedQuery, setAdvancedQuery] = useState('');
  const [advancedResults, setAdvancedResults] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [mockDataReason, setMockDataReason] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [advancedContext, setAdvancedContext] = useState('');

  // Load specific affinity if navigated from dashboard
  useEffect(() => {
    const loadSelectedAffinity = async () => {
      if (location.state?.selectedAffinityId && location.state?.source === 'dashboard') {
        setLoading(true);
        try {
          if (location.state.affinity) {
            // Use the passed affinity data immediately
            setSelectedAffinity(location.state.affinity);
            
            // Load the first page of affinities
            const response = await getAffinities(1, itemsPerPage);
            setAffinities(response.data);
            setFilteredAffinities(response.data);
            setTotalPages(Math.ceil(response.totalCount / itemsPerPage));
            
            // If the affinity isn't in the first page, find its page
            const affinityIndex = response.data.findIndex(a => a.id === location.state.affinity.id);
            if (affinityIndex === -1) {
              const allAffinities = await getAffinities(1, 100);
              const targetIndex = allAffinities.data.findIndex(a => a.id === location.state.affinity.id);
              if (targetIndex !== -1) {
                const targetPage = Math.floor(targetIndex / itemsPerPage) + 1;
                setCurrentPage(targetPage);
              }
            }
          } else {
            // Fallback to previous behavior if no affinity data is passed
            const allAffinities = await getAffinities(1, 100);
            const totalCount = allAffinities.data.length;
            setTotalPages(Math.ceil(totalCount / itemsPerPage));
            
            const targetAffinity = allAffinities.data.find(a => a.id === location.state.selectedAffinityId);
            if (targetAffinity) {
              const targetIndex = allAffinities.data.findIndex(a => a.id === location.state.selectedAffinityId);
              const targetPage = Math.floor(targetIndex / itemsPerPage) + 1;
              
              setCurrentPage(targetPage);
              setSelectedAffinity(targetAffinity);
            }
          }
        } catch (err) {
          console.error('Failed to load selected affinity:', err);
          setError('Failed to load selected affinity');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadSelectedAffinity();
  }, [location.state, itemsPerPage]);

  // Load paginated affinities
  useEffect(() => {
    const fetchAffinities = async () => {
      setLoading(true);
      try {
        const response = await getAffinities(currentPage, itemsPerPage);
        setAffinities(response.data);
        setFilteredAffinities(response.data);
        setTotalPages(Math.ceil(response.totalCount / itemsPerPage));
      } catch (err) {
        console.error('Failed to load affinities:', err);
        setError('Failed to load affinities');
      } finally {
        setLoading(false);
      }
    };

    fetchAffinities();
  }, [currentPage, itemsPerPage]);

  // Filter affinities based on search term
  useEffect(() => {
    let filtered = [...affinities];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(affinity => 
        affinity.name.toLowerCase().includes(term) || 
        affinity.definition?.toLowerCase().includes(term) ||
        affinity.category?.toLowerCase().includes(term) ||
        affinity.type?.toLowerCase().includes(term)
      );
    }

    setFilteredAffinities(filtered);
  }, [affinities, searchTerm]);

  const handleAffinityClick = (affinity) => {
    setSelectedAffinity(affinity);
    setIsSearchMode(false);
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><FiCheck className="w-3 h-3" /> Active</span>;
    } else {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><FiAlertCircle className="w-3 h-3" /> Inactive</span>;
    }
  };

  const getScoreClass = (score) => {
    return 'text-gray-900';
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Submit advanced search
  const handleAdvancedSearch = async () => {
    if (!advancedQuery.trim()) return;

    setSearchLoading(true);
    setError(null);
    setUsingMockData(false);
    setMockDataReason('');
    setIsSearchMode(true);

    try {
      const response = await advancedSearch({ query: advancedQuery, context: advancedContext });
      console.log('Search Response Structure:', {
        fullResponse: response,
        type: typeof response,
        hasResults: 'results' in response,
        resultsType: response.results ? typeof response.results : 'N/A',
        isResultsArray: Array.isArray(response.results),
        keys: Object.keys(response),
        firstResult: response.results?.[0]
      });
      
      if (!response.results || !Array.isArray(response.results)) {
        throw new Error('Invalid response format from search server');
      }

      setAdvancedResults(response);
      
      if (response.isMockData) {
        setUsingMockData(true);
        setMockDataReason('The search server is currently unavailable. Showing demonstration data.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching. Please try again.');
      setAdvancedResults({ results: [] });
    } finally {
      setSearchLoading(false);
    }
  };

  // Update the search toggle handler
  const handleSearchToggle = (isAdvanced) => {
    setShowAdvanced(isAdvanced);
    // Only reset search-specific states if there's no existing search in the target mode
    if (isAdvanced && !advancedQuery) {
      setAdvancedQuery('');
      setAdvancedResults([]);
      setUsingMockData(false);
      setMockDataReason('');
    } else if (!isAdvanced && !searchTerm) {
      setSearchTerm('');
    }
    // Don't reset isSearchMode or selectedAffinity to maintain state
  };

  const renderAffinityLibrary = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            {/* Search Toggle */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => handleSearchToggle(false)}
                  className={`px-3 py-1.5 rounded-md ${!showAdvanced ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Basic Search
                </button>
                <button
                  onClick={() => handleSearchToggle(true)}
                  className={`px-3 py-1.5 rounded-md ${showAdvanced ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Advanced Search
                </button>
              </div>
            </div>
            
            {showAdvanced ? (
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="mb-4">
                  <textarea
                    placeholder="Describe the affinity you're looking for"
                    value={advancedQuery}
                    onChange={e => setAdvancedQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={5}
                  />
                  <textarea
                    placeholder="Describe the context for this affinity usage (optional)"
                    value={advancedContext}
                    onChange={e => setAdvancedContext(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <button
                    onClick={handleAdvancedSearch}
                    className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Search
                  </button>
                </div>
                {searchLoading ? (
                  <SkeletonLoader count={1} height={100} />
                ) : advancedResults.length === 0 && isSearchMode ? (
                  <EmptyStateStyled
                    icon="search"
                    title="No Semantic Matches Found"
                    description="Try using different language or a more general description."
                  />
                ) : null}
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search affinities..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                {loading ? (
                  <SkeletonLoader count={3} height={150} />
                ) : filteredAffinities.length === 0 ? (
                  <EmptyStateStyled
                    icon="search"
                    title="No Affinities Found"
                    description="Try adjusting your search to find what you're looking for."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
                    {filteredAffinities.map(affinity => (
                      <div 
                        key={affinity.id}
                        onClick={() => handleAffinityClick(affinity)}
                        className={`card-prominent ${selectedAffinity?.id === affinity.id ? 'border-2 border-blue-500' : ''}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-blue-900">{affinity.name}</h3>
                          {getStatusBadge(affinity.status)}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">{affinity.definition}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Category:</span>
                            <span className="ml-1">{affinity.category}</span>
                          </div>
                          <div>
                            <span className="font-medium">Type:</span>
                            <span className="ml-1">{affinity.type}</span>
                          </div>
                          <div>
                            <span className="font-medium">Properties Tagged:</span>
                            <span className="ml-1">{affinity.propertiesTagged}</span>
                          </div>
                          <div>
                            <span className="font-medium">Properties with Score:</span>
                            <span className="ml-1">{affinity.propertiesWithScore}</span>
                          </div>
                          <div>
                            <span className="font-medium">Coverage:</span>
                            <span className="ml-1">{affinity.coverage}%</span>
                          </div>
                          {affinity.scoreAvailable && (
                            <div>
                              <span className="font-medium">Avg Score:</span>
                              <span className={`ml-1 ${getScoreClass(affinity.averageScore)}`}>
                                {affinity.averageScore}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Pagination - Only show for basic search */}
          {!loading && !showAdvanced && filteredAffinities.length > 0 && (
            <div className="flex justify-center items-center mt-4">
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
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
        </div>
        
        {/* Right side content - either AffinityDetailView or SearchDetailView */}
        <div className="lg:col-span-2">
          {showAdvanced && advancedResults?.results?.length > 0 ? (
            <SearchDetailView 
              searchQuery={advancedQuery}
              searchResults={(advancedResults && advancedResults.results) || []}
              usingMockData={usingMockData}
              mockDataReason={mockDataReason}
            />
          ) : !showAdvanced && selectedAffinity ? (
            loading ? (
              <SkeletonLoader count={1} height={400} />
            ) : (
              <AffinityDetailView
                affinity={selectedAffinity}
                taggedPropertiesCount={selectedAffinity.propertiesTagged}
                propertiesWithScoreCount={selectedAffinity.propertiesWithScore}
                showImplementation={true}
                showUsageGuidelines={true}
              />
            )
          ) : (
            <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center h-full">
              <EmptyStateStyled 
                icon="inbox"
                title="No Affinity Selected"
                description={showAdvanced ? "Enter a search query to find related affinities." : "Select an affinity from the list to view its details."}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('library')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
                activeTab === 'library'
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
            <FiBook className="w-4 h-4" />
            <span>Library</span>
            </button>
          
            <button
              onClick={() => setActiveTab('collections')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
                activeTab === 'collections'
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
            <FiLayers className="w-4 h-4" />
            <span>Collections</span>
            </button>
        </div>
      </div>
      
      {activeTab === 'library' ? renderAffinityLibrary() : (
        <AffinityCollections selectedCollectionId={location.state?.selectedCollectionId} />
      )}
    </div>
  );
};

export default AffinityLibrary;