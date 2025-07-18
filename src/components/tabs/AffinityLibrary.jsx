import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { FiSearch, FiCheck, FiClock, FiAlertCircle, FiPlus, FiChevronLeft, FiChevronRight, FiLayers, FiBook, FiRefreshCw } from 'react-icons/fi';
import { getAffinities, advancedSearch, getCollections, updateCollection, clearCollectionsCache } from '../../services/apiService';
import EmptyStateStyled from '../common/EmptyStateStyled';
import SkeletonLoader from '../common/SkeletonLoader';
import AffinityCollections from '../collections/AffinityCollections';
import AffinityDetailView from '../common/AffinityDetailView';
import SearchDetailView from '../common/SearchDetailView';
import { useAffinityData } from '../../contexts/AffinityDataContext';
import SearchBar from './AffinityLibraryParts/SearchBar';
import AffinityList from './AffinityLibraryParts/AffinityList';
import Pagination from './AffinityLibraryParts/Pagination';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useAppContext } from '../../contexts/AppContext';
import affinityDefinitionService from '../../services/affinityDefinitionService';

const AffinityLibrary = () => {
  const location = useLocation();
  const { user } = useAuth();
  const showToast = useToast();
  const [userCollections, setUserCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionsError, setCollectionsError] = useState(null);
  const [activeTab, setActiveTab] = useState(location.state?.view || 'library');
  const [filteredAffinities, setFilteredAffinities] = useState([]);
  const [selectedAffinity, setSelectedAffinity] = useState(null);
  const [selectedAffinityIdFromNav, setSelectedAffinityIdFromNav] = useState(location.state?.selectedAffinityId || null);
  const [searchTerm, setSearchTerm] = useState('');
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
  const [advancedError, setAdvancedError] = useState('');

  // Use global affinities state
  const {
    affinities,
    affinitiesLoading: loading,
    affinitiesError: error,
    fetchAffinities
  } = useAffinityData();

  const searchTimeout = useRef();
  const detailViewRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToRecentlyViewed } = useAppContext();

  const [selectedCollectionId, setSelectedCollectionId] = useState(location.state?.selectedCollectionId ? String(location.state.selectedCollectionId) : null);

  // Initialize from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    setSearchTerm(urlSearch);
    setCurrentPage(urlPage);
  }, []);

  // Update URL when searchTerm or currentPage changes
  useEffect(() => {
    setSearchParams({
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(currentPage > 1 ? { page: currentPage } : {})
    });
  }, [searchTerm, currentPage, setSearchParams]);

  // Load affinities and definition service on mount
  useEffect(() => {
    fetchAffinities();
    // Pre-load affinity definitions for faster sorting
    affinityDefinitionService.loadDefinitions().catch(console.error);
  }, [fetchAffinities]);

  // Fetch user collections
  useEffect(() => {
    const fetchUserCollections = async () => {
      if (!user?.email) return;
      setCollectionsLoading(true);
      setCollectionsError(null);
      try {
        const collections = await getCollections(user.email);
        setUserCollections(collections);
      } catch (err) {
        setCollectionsError('Failed to load collections');
        showToast.error('Failed to load collections');
      } finally {
        setCollectionsLoading(false);
      }
    };
    fetchUserCollections();
  }, [user, showToast]);

  // Debounced search effect (sorting is now handled at API level)
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      let filtered = [...affinities];
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
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [affinities, searchTerm]);

  // Handle selectedAffinityIdFromNav
  useEffect(() => {
    if (selectedAffinityIdFromNav) {
      if (loading) {
        // If still loading, wait for affinities to load
        return;
      }
      
      if (affinities.length === 0) {
        // If no affinities loaded yet, fetch them
        fetchAffinities();
        return;
      }

      // Try to find the affinity
      const found = affinities.find(a => String(a.id) === String(selectedAffinityIdFromNav));
      if (found) {
        setSelectedAffinity(found);
        setIsSearchMode(false);
        setSelectedAffinityIdFromNav(null); // Clear after use
      } else {
        // If affinity not found, show error
        showToast.error('Affinity not found');
        setSelectedAffinityIdFromNav(null); // Clear to prevent infinite loop
      }
    }
  }, [selectedAffinityIdFromNav, affinities, loading, fetchAffinities, showToast]);

  useEffect(() => {
    if (selectedAffinity && detailViewRef.current) {
      detailViewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedAffinity]);

  // Update selectedCollectionId if navigation state changes
  useEffect(() => {
    if (location.state?.selectedCollectionId) {
      setSelectedCollectionId(String(location.state.selectedCollectionId));
    }
  }, [location.state?.selectedCollectionId]);

  // When switching to collections tab, do not clear selectedCollectionId
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    // Do not clear selectedCollectionId on tab switch
  };

  const handleAffinityClick = (affinity) => {
    addToRecentlyViewed(affinity);
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
    setAdvancedError(null);
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
      setAdvancedError('An error occurred while searching. Please try again.');
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

  // Handler for adding affinity to a collection
  const handleAddToCollection = async (collection, affinity) => {
    // Optimistic UI: update local state
    setUserCollections(prev => prev.map(c =>
      c.id === collection.id && !c.affinities.some(a => a.id === affinity.id)
        ? { ...c, affinities: [...c.affinities, affinity] }
        : c
    ));
    try {
      const updatedAffinityIds = [...collection.affinities.map(a => a.id), affinity.id];
      await updateCollection(collection.id, { affinityIds: updatedAffinityIds }, user.email);
      showToast.success(`Added to collection: ${collection.name}`);
      clearCollectionsCache();
    } catch (err) {
      // Revert on error
      setUserCollections(prev => prev.map(c =>
        c.id === collection.id
          ? { ...c, affinities: c.affinities.filter(a => a.id !== affinity.id) }
          : c
      ));
      showToast.error('Failed to add to collection');
    }
  };

  const renderAffinityLibrary = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            {/* Search Toggle */}
            <div className="flex justify-center items-center mb-4 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleSearchToggle(false)}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${!showAdvanced ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  Basic Search
                </button>
                <button
                  onClick={() => handleSearchToggle(true)}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${showAdvanced ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  Advanced Search
                </button>
            </div>
            
            {showAdvanced ? (
              <div className="p-1">
                <div className="mb-4">
                  <textarea
                    placeholder="Describe the affinity you're looking for..."
                    value={advancedQuery}
                    onChange={e => setAdvancedQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    rows={5}
                  />
                  <textarea
                    placeholder="Add context for this affinity (optional)..."
                    value={advancedContext}
                    onChange={e => setAdvancedContext(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    rows={2}
                  />
                  <button
                    onClick={handleAdvancedSearch}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                    disabled={searchLoading}
                  >
                    {searchLoading ? 'Searching...' : 'Search'}
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
                  <SearchBar value={searchTerm} onChange={handleSearch} />
                </div>
                {loading ? (
                  <SkeletonLoader count={3} height={150} />
                ) : error ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <EmptyStateStyled
                      type="ERROR"
                      title="Failed to load affinities"
                      description={error}
                      actionButton={
                        <button
                          onClick={() => fetchAffinities(true)}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                          <FiRefreshCw className="mr-2" /> Retry
                        </button>
                      }
                    />
                  </div>
                ) : filteredAffinities.length === 0 ? (
                  <EmptyStateStyled
                    icon="search"
                    title="No Affinities Found"
                    description="Try adjusting your search to find what you're looking for."
                  />
                ) : (
                  <AffinityList
                    affinities={filteredAffinities}
                    selectedAffinity={selectedAffinity}
                    onSelect={handleAffinityClick}
                    userCollections={userCollections}
                    onAddToCollection={handleAddToCollection}
                  />
                )}
              </>
            )}
          </div>
          {/* Pagination - Only show for basic search */}
          {!loading && !showAdvanced && filteredAffinities.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        
        {/* Right side content - either AffinityDetailView or SearchDetailView */}
        <div className="lg:col-span-2" ref={detailViewRef}>
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-full">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Affinity Library</h1>
            <p className="mt-2 text-gray-600">
              Explore, search, and manage your organization's affinities.
            </p>
            <div className="mt-3 flex items-center space-x-2 text-sm">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center space-x-1">
                <span>⚙️</span>
                <span>Configured</span>
              </span>
              <span className="text-gray-500">
                {affinities.filter(a => a.hasConfiguration).length} JSON-configured affinities appear first, followed by {affinities.filter(a => !a.hasConfiguration).length} synthetic-configured affinities
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <nav className="flex space-x-1" aria-label="Tabs">
              <button
                onClick={() => handleTabSwitch('library')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'library'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiBook className="w-4 h-4" />
                <span>Library</span>
              </button>
              <button
                onClick={() => handleTabSwitch('collections')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'collections'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiLayers className="w-4 h-4" />
                <span>Collections</span>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'library' ? renderAffinityLibrary() : (
          <AffinityCollections selectedCollectionId={selectedCollectionId} />
        )}
      </div>
    </div>
  );
};

export default AffinityLibrary;