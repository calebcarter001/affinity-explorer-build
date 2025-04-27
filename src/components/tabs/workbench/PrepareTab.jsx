import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiClock, FiSettings, FiBarChart2, FiTrendingUp, FiDatabase, FiChevronRight, FiChevronDown, FiSearch, FiCheck } from 'react-icons/fi';
import { getAffinities, getDashboardStats, getCollections } from '../../../services/apiService';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAffinities, setExpandedAffinities] = useState({});
  const { user } = useAppContext();
  
  // Mock data for demonstration
  const [coverageData, setCoverageData] = useState({
    bex: { tagged: 0, scored: 0, total: 0 },
    vrbo: { tagged: 0, scored: 0, total: 0 },
    hcom: { tagged: 0, scored: 0, total: 0 }
  });

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
          
          // Mock coverage data based on the selected collection
          // In a real app, this would come from an API
          const collectionId = collectionsResponse[0].id;
          setCoverageData({
            bex: { 
              tagged: Math.floor(Math.random() * 1000) + 500, 
              scored: Math.floor(Math.random() * 800) + 400, 
              total: 1500 
            },
            vrbo: { 
              tagged: Math.floor(Math.random() * 2000) + 1000, 
              scored: Math.floor(Math.random() * 1500) + 1000, 
              total: 2500 
            },
            hcom: { 
              tagged: Math.floor(Math.random() * 3000) + 2000, 
              scored: Math.floor(Math.random() * 2500) + 2000, 
              total: 4000 
            }
          });
        }
      } catch (err) {
        setError('Failed to load collections. Please try again later.');
        console.error('Error loading collections:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Update coverage data when selected collection changes
  useEffect(() => {
    if (selectedCollection) {
      // In a real app, this would fetch data for the specific collection
      // For now, we'll just update the mock data
      setCoverageData({
        bex: { 
          tagged: Math.floor(Math.random() * 1000) + 500, 
          scored: Math.floor(Math.random() * 800) + 400, 
          total: 1500 
        },
        vrbo: { 
          tagged: Math.floor(Math.random() * 2000) + 1000, 
          scored: Math.floor(Math.random() * 1500) + 1000, 
          total: 2500 
        },
        hcom: { 
          tagged: Math.floor(Math.random() * 3000) + 2000, 
          scored: Math.floor(Math.random() * 2500) + 2000, 
          total: 4000 
        }
      });
    }
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
  const CollectionSelector = ({ collections, selectedCollection, setSelectedCollection }) => (
    <div className="w-full max-w-md mx-auto mb-6">
      <Listbox value={selectedCollection} onChange={setSelectedCollection}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-3 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
              <span className="block truncate">
                {selectedCollection ? selectedCollection.name : 'Select a collection...'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <FiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <Listbox.Option value={null} disabled className="px-4 py-2 text-gray-400 cursor-default">
                  Select a collection...
                </Listbox.Option>
                {collections.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">No collections found</div>
                ) : (
                  collections.map((collection) => (
                    <Listbox.Option
                      key={collection.id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                      value={collection}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{collection.name}</span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <FiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                          <span className="block text-xs text-gray-500">{collection.affinities?.length || 0} affinities • Last updated {new Date(collection.lastUpdated).toLocaleDateString()}</span>
                        </>
                      )}
                    </Listbox.Option>
                  ))
                )}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );

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

      {/* Modern Collection Selector */}
      <CollectionSelector
        collections={filteredCollections}
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
      />

      {selectedCollection && (
        <>
          {/* Collection Header */}
          <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{selectedCollection.name}</h3>
                <p className="text-gray-600">{selectedCollection.description || 'No description provided'}</p>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date(selectedCollection.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Coverage Analysis Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Coverage Analysis</h3>
            
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
            <h3 className="text-lg font-semibold mb-4">Implementation Readiness</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* BEX Implementation Status */}
              <ImplementationStatus
                title="BEX Implementation"
                status={calculateReadiness('bex').status}
                progress={calculateReadiness('bex').progress}
                lastUpdated="2024-03-20"
                owner="Team Alpha"
                metrics={[
                  { label: 'Properties Tagged', value: coverageData.bex.tagged.toLocaleString() },
                  { label: 'Properties Scored', value: coverageData.bex.scored.toLocaleString() },
                  { label: 'Coverage', value: `${Math.round((coverageData.bex.scored / coverageData.bex.total) * 100)}%` }
                ]}
              />
              
              {/* Vrbo Implementation Status */}
              <ImplementationStatus
                title="Vrbo Implementation"
                status={calculateReadiness('vrbo').status}
                progress={calculateReadiness('vrbo').progress}
                lastUpdated="2024-03-20"
                owner="Team Beta"
                metrics={[
                  { label: 'Properties Tagged', value: coverageData.vrbo.tagged.toLocaleString() },
                  { label: 'Properties Scored', value: coverageData.vrbo.scored.toLocaleString() },
                  { label: 'Coverage', value: `${Math.round((coverageData.vrbo.scored / coverageData.vrbo.total) * 100)}%` }
                ]}
              />
              
              {/* HCom Implementation Status */}
              <ImplementationStatus
                title="HCom Implementation"
                status={calculateReadiness('hcom').status}
                progress={calculateReadiness('hcom').progress}
                lastUpdated="2024-03-20"
                owner="Team Gamma"
                metrics={[
                  { label: 'Properties Tagged', value: coverageData.hcom.tagged.toLocaleString() },
                  { label: 'Properties Scored', value: coverageData.hcom.scored.toLocaleString() },
                  { label: 'Coverage', value: `${Math.round((coverageData.hcom.scored / coverageData.hcom.total) * 100)}%` }
                ]}
              />
            </div>
          </div>

          {/* Affinity-Level Implementation Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Affinity-Level Implementation</h3>
            <p className="text-gray-600 mb-4">View implementation status for each affinity in this collection</p>
            
            <div className="border rounded-lg overflow-hidden">
              {selectedCollection.affinities && selectedCollection.affinities.length > 0 ? (
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
                      
                      {expandedAffinities[affinity.id] && (
                        <div className="p-4 bg-gray-50 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* BEX Implementation Status for this affinity */}
                            <ImplementationStatus
                              title="BEX Implementation"
                              status={calculateReadiness('bex').status}
                              progress={Math.floor(Math.random() * 30) + 70}
                              lastUpdated="2024-03-20"
                              owner="Team Alpha"
                              metrics={[
                                { label: 'Properties Tagged', value: Math.floor(Math.random() * 100).toLocaleString() },
                                { label: 'Properties Scored', value: Math.floor(Math.random() * 80).toLocaleString() },
                                { label: 'Coverage', value: `${Math.floor(Math.random() * 30) + 70}%` }
                              ]}
                            />
                            
                            {/* Vrbo Implementation Status for this affinity */}
                            <ImplementationStatus
                              title="Vrbo Implementation"
                              status={calculateReadiness('vrbo').status}
                              progress={Math.floor(Math.random() * 30) + 70}
                              lastUpdated="2024-03-20"
                              owner="Team Beta"
                              metrics={[
                                { label: 'Properties Tagged', value: Math.floor(Math.random() * 100).toLocaleString() },
                                { label: 'Properties Scored', value: Math.floor(Math.random() * 80).toLocaleString() },
                                { label: 'Coverage', value: `${Math.floor(Math.random() * 30) + 70}%` }
                              ]}
                            />
                            
                            {/* HCom Implementation Status for this affinity */}
                            <ImplementationStatus
                              title="HCom Implementation"
                              status={calculateReadiness('hcom').status}
                              progress={Math.floor(Math.random() * 30) + 70}
                              lastUpdated="2024-03-20"
                              owner="Team Gamma"
                              metrics={[
                                { label: 'Properties Tagged', value: Math.floor(Math.random() * 100).toLocaleString() },
                                { label: 'Properties Scored', value: Math.floor(Math.random() * 80).toLocaleString() },
                                { label: 'Coverage', value: `${Math.floor(Math.random() * 30) + 70}%` }
                              ]}
                            />
                          </div>
                        </div>
                      )}
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
        </>
      )}
    </div>
  );
};

export default PrepareTab; 