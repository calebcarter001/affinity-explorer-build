import React, { useState, useEffect, Fragment } from 'react';
import { FiCheckCircle, FiAlertCircle, FiClock, FiSettings, FiBarChart2, FiTrendingUp, FiDatabase, FiChevronRight, FiChevronDown, FiSearch, FiCheck } from 'react-icons/fi';
import { getAffinities, getDashboardStats, getCollections, getCollectionImplementationReadiness, enrichAffinityWithBrandData } from '../../../services/apiService';
import SkeletonLoader from '../../common/SkeletonLoader';
import EmptyStateStyled from '../../common/EmptyStateStyled';
import ModernGrid from '../../common/ModernGrid';
import ImplementationStatus from '../../common/ImplementationStatus';
import { useAppContext } from '../../../contexts/AppContext';
import { Listbox, Transition } from '@headlessui/react';

const PrepareTab = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedAffinity, setSelectedAffinity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAffinities, setExpandedAffinities] = useState({});
  const { user } = useAppContext();
  
  // Mock data for demonstration
  const [coverageData, setCoverageData] = useState({
    bex: { tagged: 0, scored: 0, total: 0 },
    vrbo: { tagged: 0, scored: 0, total: 0 },
    hcom: { tagged: 0, scored: 0, total: 0 }
  });

  const [affinityEnrichment, setAffinityEnrichment] = useState({});
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);
  const [enrichmentError, setEnrichmentError] = useState(null);

  // Fetch collections on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch collections
        // For local testing, hardcode the ownerId to 'demo@example.com'. Replace with user?.email in production.
        const collectionsResponse = await getCollections('demo@example.com');
        setCollections(collectionsResponse || []);
        
        // If there are collections, select the first one by default
        if (collectionsResponse && collectionsResponse.length > 0) {
          setSelectedCollection(collectionsResponse[0]);
          
          // Get implementation readiness data for the first collection
          const readinessData = await getCollectionImplementationReadiness(collectionsResponse[0].id);
          
          // Transform the data into the expected format
          setCoverageData({
            bex: {
              tagged: readinessData.bex.totalTagged,
              scored: readinessData.bex.totalScored,
              total: readinessData.bex.totalTagged
            },
            vrbo: {
              tagged: readinessData.vrbo.totalTagged,
              scored: readinessData.vrbo.totalScored,
              total: readinessData.vrbo.totalTagged
            },
            hcom: {
              tagged: readinessData.hcom.totalTagged,
              scored: readinessData.hcom.totalScored,
              total: readinessData.hcom.totalTagged
            }
          });
        }
      } catch (err) {
        setError('Failed to load collections. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Update coverage data when selected collection or affinity changes
  useEffect(() => {
    const fetchCoverageData = async () => {
      if (selectedCollection) {
        try {
          // Get implementation readiness data for the collection
          const readinessData = await getCollectionImplementationReadiness(selectedCollection.id);
          
          // Transform the data into the expected format
          setCoverageData({
            bex: {
              tagged: readinessData.bex.totalTagged,
              scored: readinessData.bex.totalScored,
              total: readinessData.bex.totalTagged
            },
            vrbo: {
              tagged: readinessData.vrbo.totalTagged,
              scored: readinessData.vrbo.totalScored,
              total: readinessData.vrbo.totalTagged
            },
            hcom: {
              tagged: readinessData.hcom.totalTagged,
              scored: readinessData.hcom.totalScored,
              total: readinessData.hcom.totalTagged
            }
          });
        } catch (error) {
          // Fallback to empty data if API call fails
          setCoverageData({
            bex: { tagged: 0, scored: 0, total: 0 },
            vrbo: { tagged: 0, scored: 0, total: 0 },
            hcom: { tagged: 0, scored: 0, total: 0 }
          });
        }
      }
    };

    fetchCoverageData();
  }, [selectedCollection, selectedAffinity]);

  // Enrich affinities in the selected collection when it changes
  useEffect(() => {
    const enrichAffinities = async () => {
      if (!selectedCollection || !selectedCollection.affinities) return;
      setEnrichmentLoading(true);
      setEnrichmentError(null);
      const enrichmentResults = {};
      await Promise.all(selectedCollection.affinities.map(async (affinity) => {
        try {
          // Use cached enrichment if available
          if (affinityEnrichment[affinity.id]) {
            enrichmentResults[affinity.id] = affinityEnrichment[affinity.id];
            return;
          }
          const enrichment = await enrichAffinityWithBrandData(affinity.id);
          enrichmentResults[affinity.id] = enrichment;
        } catch (err) {
          enrichmentResults[affinity.id] = { error: err.message };
        }
      }));
      setAffinityEnrichment(prev => ({ ...prev, ...enrichmentResults }));
      setEnrichmentLoading(false);
      // If any errors, set error state
      if (Object.values(enrichmentResults).some(e => e && e.error)) {
        setEnrichmentError('Some affinity data could not be loaded.');
      }
    };
    enrichAffinities();
  }, [selectedCollection]);

  // Calculate implementation readiness based on coverage and other metrics
  const calculateReadiness = (brand) => {
    const data = coverageData[brand];
    if (!data) return { status: 'unknown', progress: 0 };
    
    // Calculate progress as percentage of properties with scores
    const progress = Math.round((data.scored / data.total) * 100);
    
    // Determine status based on progress
    let status = 'behind';
    if (progress >= 90) status = 'completed';
    else if (progress >= 70) status = 'in-progress';
    else if (progress >= 50) status = 'at-risk';
    
    return { status, progress };
  };

  // Format coverage data for the grid
  const formatCoverageData = () => {
    const brands = ['bex', 'vrbo', 'hcom'];
    
    // Headers for the grid
    const headers = ['Metric', ...brands.map(brand => brand.toUpperCase())];
    
    // Rows for the grid
    const rows = [
      // Coverage by brand (properties tagged)
      ['Properties Tagged', ...brands.map(brand => coverageData[brand]?.tagged.toLocaleString() || '0')],
      // Coverage by property count (properties scored)
      ['Properties Scored', ...brands.map(brand => coverageData[brand]?.scored.toLocaleString() || '0')],
      // Coverage by affinity scores (percentage)
      ['Coverage %', ...brands.map(brand => {
        const data = coverageData[brand];
        if (!data || data.total === 0) return '0%';
        return `${Math.round((data.scored / data.total) * 100)}%`;
      })]
    ];
    
    return { headers, rows };
  };

  // Toggle expanded state for an affinity
  const toggleAffinityExpanded = (affinityId) => {
    setExpandedAffinities(prev => ({
      ...prev,
      [affinityId]: !prev[affinityId]
    }));
  };

  // Filter collections based on search term
  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modern Collection Selector Dropdown
  const CollectionSelector = ({ collections, selectedCollection, setSelectedCollection }) => {
    // Initialize selectedItem based on the current selection
    const [selectedItem, setSelectedItem] = useState(selectedAffinity || selectedCollection);

    // Update selectedItem when selectedAffinity or selectedCollection changes
    useEffect(() => {
      const newSelectedItem = selectedAffinity || selectedCollection;
      setSelectedItem(newSelectedItem);
    }, [selectedAffinity, selectedCollection]);

    // Handle selection of either a collection or an affinity
    const handleSelect = (item) => {
      if (!item) return;

      // Update local state first
      setSelectedItem(item);
      
      // Check if the item is a collection or an affinity
      const isCollection = item.affinities !== undefined;
      
      if (isCollection) {
        // If it's a collection, update the selectedCollection state
        setSelectedCollection(item);
        setSelectedAffinity(null);
      } else {
        // If it's an affinity, find its parent collection and update both states
        const parentCollection = collections.find(c => 
          c.affinities.some(a => a.id === item.id)
        );
        if (parentCollection) {
          setSelectedCollection(parentCollection);
          setSelectedAffinity(item);
        }
      }
    };

    return (
      <div className="w-full max-w-md mx-auto mb-6">
        <Listbox value={selectedItem} onChange={handleSelect}>
          {({ open }) => (
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-3 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <span className="block truncate">
                  {selectedItem ? (
                    selectedItem.affinities ? 
                      selectedItem.name : 
                      `${selectedItem.name} (${collections.find(c => 
                        c.affinities.some(a => a.id === selectedItem.id)
                      )?.name || 'Unknown Collection'})`
                  ) : 'Select a collection or affinity...'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <FiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {collections.map((collection) => (
                    <Fragment key={collection.id}>
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-4 pr-9 ${
                            active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                          }`
                        }
                        value={collection}
                      >
                        {({ selected }) => (
                          <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                            {collection.name}
                          </span>
                        )}
                      </Listbox.Option>
                      {collection.affinities.map((affinity) => (
                        <Listbox.Option
                          key={affinity.id}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-8 pr-9 ${
                              active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                            }`
                          }
                          value={affinity}
                        >
                          {({ selected }) => (
                            <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                              {affinity.name}
                            </span>
                          )}
                        </Listbox.Option>
                      ))}
                    </Fragment>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>
    );
  };

  if (loading) {
    return <SkeletonLoader count={3} height={100} />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg flex flex-col items-center">
        <p className="text-red-700 mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FiSettings className="mr-2" /> Retry
        </button>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <EmptyStateStyled
          type="EMPTY"
          title="No Collections Found"
          description="Create a collection to prepare for implementation"
          actionButton={
            <button
              onClick={() => window.location.href = '/collections/new'}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FiDatabase className="mr-2" /> Create Collection
            </button>
          }
        />
      </div>
    );
  }

  const { headers, rows } = formatCoverageData();

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Collection Preparation</h2>
        <p className="text-gray-600">Evaluate your collection's readiness for production and launch</p>
      </div>

      {/* Modern Collection Selector + Description Side by Side */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="w-full md:w-auto">
          <CollectionSelector
            collections={filteredCollections}
            selectedCollection={selectedCollection}
            setSelectedCollection={(item) => {
              // Check if the item is a collection or an affinity
              const isCollection = item.affinities !== undefined;
              if (isCollection) {
                setSelectedCollection(item);
                setSelectedAffinity(null);
              } else {
                setSelectedAffinity(item);
                // Find and set the parent collection
                const parentCollection = collections.find(c => 
                  c.affinities.some(a => a.id === item.id)
                );
                if (parentCollection) {
                  setSelectedCollection(parentCollection);
                }
              }
            }}
          />
        </div>
        {(selectedCollection || selectedAffinity) && (
          <div className="max-w-md w-full">
            {/* Collection/Affinity Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedAffinity ? selectedAffinity.name : selectedCollection.name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedAffinity ? 
                      selectedAffinity.definition || 'No definition provided' : 
                      selectedCollection.description || 'No description provided'
                    }
                  </p>
                  {selectedAffinity && (
                    <p className="text-sm text-gray-500 mt-1">
                      From collection: {selectedCollection.name}
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(selectedAffinity ? selectedAffinity.lastUpdatedDate : selectedCollection.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coverage Analysis Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Coverage Analysis <span className="mx-2">&#8594;</span>
          {selectedAffinity ? (
            <span className="text-blue-600 font-normal">{selectedAffinity.name}</span>
          ) : (
            <span className="text-blue-600 font-normal">{selectedCollection.name}</span>
          )}
        </h3>
        
        <ModernGrid 
          headers={headers}
          rows={rows}
          className="bg-white"
          headerCellClassName="text-gray-700 font-medium"
          cellClassName="text-gray-700"
        />
      </div>

      {/* Implementation Readiness Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Implementation Readiness <span className="mx-2">&#8594;</span>
          {selectedAffinity ? (
            <span className="text-blue-600 font-normal">{selectedAffinity.name}</span>
          ) : (
            <span className="text-blue-600 font-normal">{selectedCollection.name}</span>
          )}
        </h3>
        <div className="border rounded-lg overflow-hidden">
          {selectedAffinity ? (
            // Show single affinity details
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{selectedAffinity.name}</h4>
                  <p className="text-sm text-gray-500">{selectedAffinity.category || 'Uncategorized'}</p>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedAffinity.metrics?.completeness >= 0.9 ? 'bg-green-100 text-green-800' :
                    selectedAffinity.metrics?.completeness >= 0.7 ? 'bg-blue-100 text-blue-800' :
                    selectedAffinity.metrics?.completeness >= 0.5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {Math.round((selectedAffinity.metrics?.completeness || 0) * 100)}% Complete
                  </span>
                </div>
              </div>
            </div>
          ) : selectedCollection.affinities && selectedCollection.affinities.length > 0 ? (
            // Show collection affinities list
            <ul className="divide-y">
              {selectedCollection.affinities.map((affinity) => (
                <li key={affinity.id} className="bg-white">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                    onClick={() => toggleAffinityExpanded(affinity.id)}
                  >
                    <div className="flex items-center">
                      {expandedAffinities[affinity.id] ? (
                        <FiChevronDown className="mr-2 text-gray-500" />
                      ) : (
                        <FiChevronRight className="mr-2 text-gray-500" />
                      )}
                      <div>
                        <h4 className="font-medium">{affinity.name}</h4>
                        <p className="text-sm text-gray-500">{affinity.category || 'Uncategorized'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        affinity.metrics?.completeness >= 0.9 ? 'bg-green-100 text-green-800' :
                        affinity.metrics?.completeness >= 0.7 ? 'bg-blue-100 text-blue-800' :
                        affinity.metrics?.completeness >= 0.5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Math.round((affinity.metrics?.completeness || 0) * 100)}% Complete
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No affinities in this collection</div>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
        <div className="space-y-4">
          {Object.entries(coverageData).map(([brand, data]) => {
            const readiness = calculateReadiness(brand);
            const coveragePercentage = Math.round((data.scored / data.total) * 100);
            
            return (
              <div key={brand} className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-medium text-lg">{brand.toUpperCase()}</h4>
                <p className="text-gray-600">
                  {readiness.status === 'completed' 
                    ? `Ready for production with ${coveragePercentage}% coverage.` 
                    : readiness.status === 'in-progress'
                    ? `Making good progress with ${coveragePercentage}% coverage. Continue current implementation plan.`
                    : readiness.status === 'at-risk'
                    ? `At risk with only ${coveragePercentage}% coverage. Consider accelerating implementation.`
                    : `Behind schedule with only ${coveragePercentage}% coverage. Immediate action required.`}
                </p>
                {readiness.status !== 'completed' && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                    <li>Increase tagging efforts for {brand.toUpperCase()} properties</li>
                    <li>Prioritize scoring implementation for tagged properties</li>
                    <li>Review implementation blockers and address them promptly</li>
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrepareTab; 