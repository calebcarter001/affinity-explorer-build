import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSearch, FiCheck, FiClock, FiAlertCircle, FiPlus, FiChevronLeft, FiChevronRight, FiLayers, FiBook } from 'react-icons/fi';
import { getAffinities, getAffinityTaggedProperties } from '../../services/apiService';
import EmptyStateStyled from '../common/EmptyStateStyled';
import SkeletonLoader from '../common/SkeletonLoader';
import AffinityCollections from '../collections/AffinityCollections';
import FilterPanel from '../common/FilterPanel';

const AffinityLibrary = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('library');
  const [affinities, setAffinities] = useState([]);
  const [filteredAffinities, setFilteredAffinities] = useState([]);
  const [selectedAffinity, setSelectedAffinity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [taggedPropertiesCount, setTaggedPropertiesCount] = useState(0);
  const [propertiesWithScoreCount, setPropertiesWithScoreCount] = useState(0);

  // Load affinities when component mounts or filters change
  useEffect(() => {
    const loadAffinities = async () => {
      setLoading(true);
      try {
        const response = await getAffinities(currentPage, itemsPerPage);
        setAffinities(response.data);
        setFilteredAffinities(response.data);
        setTotalPages(response.totalPages);

        // If we have a selectedAffinity from navigation state, find and select it
        if (location.state?.selectedAffinity) {
          const affinityToSelect = response.data.find(
            affinity => affinity.name === location.state.selectedAffinity
          );
          if (affinityToSelect) {
            setSelectedAffinity(affinityToSelect);
          }
        }

        // If we have a collections view from navigation state, switch to collections tab
        if (location.state?.view === 'collections') {
          setActiveTab('collections');
        }
      } catch (err) {
        setError('Failed to load affinities');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAffinities();
  }, [currentPage, itemsPerPage, location.state]);

  // Filter affinities when search term, category, or status changes
  useEffect(() => {
    let filtered = [...affinities];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(affinity => 
        affinity.name.toLowerCase().includes(term) || 
        affinity.definition.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(affinity => affinity.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(affinity => affinity.status === statusFilter);
    }

    setFilteredAffinities(filtered);
  }, [affinities, searchTerm, categoryFilter, statusFilter]);

  // Optimistic update function
  const updateAffinityOptimistically = (updatedAffinity) => {
    setAffinities(prevAffinities => 
      prevAffinities.map(affinity => 
        affinity.id === updatedAffinity.id ? updatedAffinity : affinity
      )
    );
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FiChevronLeft />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FiChevronRight />
        </button>
      </div>
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleAffinityClick = async (affinity) => {
    setSelectedAffinity(affinity);
    try {
      const data = await getAffinityTaggedProperties(affinity.name);
      setTaggedPropertiesCount(data.tagged || 0);
      setPropertiesWithScoreCount(data.withScore || 0);
    } catch (error) {
      console.error('Error fetching tagged properties count:', error);
      setTaggedPropertiesCount(0);
      setPropertiesWithScoreCount(0);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Validated':
        return <span className="badge badge-validated flex items-center gap-1"><FiCheck /> Active</span>;
      case 'In Enrichment':
        return <span className="badge badge-enrichment flex items-center gap-1"><FiClock /> In Enrichment</span>;
      case 'Scoring':
        return <span className="badge badge-scoring flex items-center gap-1"><FiAlertCircle /> Scoring</span>;
      case 'Discovery':
        return <span className="badge badge-discovery flex items-center gap-1"><FiAlertCircle /> Discovery</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getScoreClass = (score) => {
    return 'text-gray-900';
  };

  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader type="card" count={6} />;
    }

    if (error) {
      return (
        <EmptyStateStyled
          type="ERROR"
          actionButton={
            <button
              onClick={() => {
                const loadAffinities = async () => {
                  try {
                    const data = await getAffinities();
                    setAffinities(data);
                    setFilteredAffinities(data);
                  } catch (err) {
                    setError('Failed to load affinities');
                    console.error(err);
                  }
                };
                loadAffinities();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          }
          suggestions={[
            'Check your network connection',
            'Verify your API credentials',
            'Contact support if the issue persists'
          ]}
        />
      );
    }

    if (!affinities.length) {
      return (
        <EmptyStateStyled
          type="NO_AFFINITIES"
          actionButton={
            <button
              onClick={() => {
                // Implement the logic to show the create new affinity modal
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create New Affinity
            </button>
          }
          suggestions={[
            'Create your first affinity to get started',
            'Import existing affinities from a file',
            'Use the Discovery Agent to find potential affinities'
          ]}
        />
      );
    }

    if (filteredAffinities.length === 0) {
      return (
        <EmptyStateStyled
          type="FILTERED"
          actionButton={
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Clear Filters
            </button>
          }
          suggestions={[
            'Try using fewer filters',
            'Check for typos in your search',
            'Try different category selections'
          ]}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Affinity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredAffinities.map(affinity => (
            <div 
              key={affinity.id}
              onClick={() => handleAffinityClick(affinity)}
              className={`card p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedAffinity?.id === affinity.id ? 'border-2 border-blue-500' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <h3 className="text-lg font-semibold">{affinity.name}</h3>
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
                  <span className="font-medium">Coverage:</span>
                  <span className="ml-1">{affinity.coverage}%</span>
                </div>
                {affinity.scoreAvailable && (
                  <div>
                    <span className="font-medium">Avg Score:</span>
                    <span className={`ml-1 ${getScoreClass(affinity.avgScore)}`}>
                      {affinity.avgScore}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Selected Affinity Details */}
        {selectedAffinity ? (
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
              <div>
                <h3 className="text-xl font-bold">{selectedAffinity.name}</h3>
                <p className="text-gray-600">{selectedAffinity.definition}</p>
              </div>
              {getStatusBadge(selectedAffinity.status)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="font-semibold mb-2">Metadata</h4>
                <div className="bg-gray-50 p-4 rounded-md h-[156px]">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <div className="font-medium">Category:</div>
                      <div>{selectedAffinity.category}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="font-medium">Type:</div>
                      <div>{selectedAffinity.type}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="font-medium">Applicable Entities:</div>
                      <div>{selectedAffinity.applicableEntities.join(', ')}</div>
                    </div>
                    
                    {selectedAffinity.scoreAvailable && (
                      <div className="flex justify-between">
                        <div className="font-medium">Average Score:</div>
                        <div>
                          {selectedAffinity.avgScore}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="font-semibold mb-2 mt-4">Coverage</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <div className="font-medium">Coverage:</div>
                      <div>{selectedAffinity.coverage}%</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="font-medium">Tagged Properties:</div>
                      <div>{taggedPropertiesCount}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="font-medium">Properties with Score:</div>
                      <div>{propertiesWithScoreCount}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="font-medium">Highest Score:</div>
                      <div className={getScoreClass(selectedAffinity.highestScore)}>
                        {selectedAffinity.highestScore?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="font-medium">Lowest Score:</div>
                      <div className={getScoreClass(selectedAffinity.lowestScore)}>
                        {selectedAffinity.lowestScore?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Usage Guidelines</h4>
                <div className="bg-gray-50 p-4 rounded-md h-[156px]">
                  <p className="text-sm">
                    This affinity can be used to score {selectedAffinity.applicableEntities.join(', ')} entities. 
                    {selectedAffinity.scoreAvailable 
                      ? ' Scores are available and can be used for ranking and filtering.' 
                      : ' Scores are not yet available for this affinity.'}
                  </p>
                </div>
                
                <h4 className="font-semibold mb-2 mt-4">Implementation</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm">
                    To implement this affinity in your application, use the API endpoint:
                  </p>
                  <code className="block bg-gray-100 p-2 rounded mt-2 text-sm font-mono overflow-x-auto">
                    /api/affinities/{selectedAffinity.id}/score
                  </code>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center h-full">
            <EmptyStateStyled 
              icon="inbox"
              title="No Affinity Selected"
              description="Select an affinity from the list to view its details."
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl md:text-2xl font-bold">Affinity Library</h2>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 flex items-center gap-2 ${
                activeTab === 'library'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiBook /> Library
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              className={`px-4 py-2 flex items-center gap-2 ${
                activeTab === 'collections'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiLayers /> Collections
            </button>
          </div>
        </div>
      </div>
      
      {activeTab === 'library' ? (
        <>
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="w-full md:w-auto">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search affinity concepts..." 
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:border-blue-500"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <FiSearch />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <select 
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Family">Family</option>
                  <option value="Adults">Adults</option>
                  <option value="Premium">Premium</option>
                  <option value="Outdoors">Outdoors</option>
                  <option value="Location">Location</option>
                  <option value="Cultural">Cultural</option>
                </select>
                
                <select 
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Validated">Active</option>
                  <option value="In Enrichment">In Enrichment</option>
                  <option value="Scoring">Scoring</option>
                  <option value="Discovery">Discovery</option>
                </select>
              </div>
            </div>
          </div>
          
          {renderContent()}
          {renderPagination()}
        </>
      ) : (
        <AffinityCollections selectedCollectionName={location.state?.selectedCollection} />
      )}
    </div>
  );
};

export default AffinityLibrary;