import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { searchProperties } from '../../services/apiService';
import EmptyStateStyled from '../common/EmptyStateStyled';
import PropertyCard from '../common/PropertyCard';
import Pagination from './AgentViewParts/Pagination';
import {
  VerificationAgent,
  DiscoveryAgent,
  SentimentAgent,
  CompetitiveAgent,
  BiasDetectionAgent,
  TrendAgent
} from './AgentViewParts/agents';

const AgentView = () => {
  const [activeTab, setActiveTab] = useState('verification');
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedPanels, setExpandedPanels] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = properties.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await searchProperties(searchTerm || '*', currentPage, itemsPerPage);
        setProperties(response.data);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchProperties();
  }, [searchTerm, currentPage, itemsPerPage]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchTerm(searchTerm.trim());
      setCurrentPage(1); // Reset to first page when new search results arrive
    }
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  const togglePanel = (panelId) => {
    setExpandedPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(panelId)) {
        newSet.delete(panelId);
      } else {
        newSet.add(panelId);
      }
      return newSet;
    });
  };

  const renderPagination = () => {
    return (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    );
  };

  const renderPropertyList = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <EmptyStateStyled
          type="ERROR"
          description={error}
          actionButton={{
            label: 'Try Again',
            onClick: () => setError(null)
          }}
        />
      );
    }

    if (!properties.length) {
      return (
        <EmptyStateStyled
          type="NO_PROPERTIES"
          description="No properties available. Add properties to get started."
          actionButton={{
            label: 'Add Properties',
            onClick: () => {/* TODO: Implement add properties */} 
          }}
        />
      );
    }

    return (
      <>
        <div className="space-y-4">
          {currentProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              onClick={handlePropertySelect}
              className="w-full"
            />
          ))}
        </div>
        {renderPagination()}
      </>
    );
  };

  const renderAgentContent = () => {
    switch (activeTab) {
      case 'verification':
        return <VerificationAgent property={selectedProperty} />;
      case 'discovery':
        return <DiscoveryAgent property={selectedProperty} />;
      case 'sentiment':
        return <SentimentAgent property={selectedProperty} />;
      case 'competitive':
        return <CompetitiveAgent property={selectedProperty} />;
      case 'bias':
        return <BiasDetectionAgent property={selectedProperty} />;
      case 'trend':
        return <TrendAgent property={selectedProperty} />;
      default:
        return <VerificationAgent property={selectedProperty} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agent View</h1>
        <p className="mt-1 text-sm text-gray-500">Analyze properties using different agent perspectives</p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
        {/* Property Selection Section - Left Side */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">Select a Property to Analyze</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter property name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleSearch}
              >
                Find
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {renderPropertyList()}
          </div>
        </div>

        {/* Agent View Section - Right Side */}
        <div className="col-span-8">
          {selectedProperty ? (
            <div className="bg-white h-full rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
              {/* Property Details Section */}
              <div className="p-4 border-b">
                <h3 className="text-xl font-bold mb-2">{selectedProperty.name}</h3>
                <p className="text-gray-600 mb-1">{selectedProperty.location || 'No address available'}</p>
                <p className="text-sm text-gray-500">ID: {selectedProperty.id}</p>
              </div>

              {/* Agent Tabs */}
              <div className="border-b border-gray-200 px-4">
                <nav className="flex space-x-8">
                  {[
                    { id: 'verification', label: 'Verification Agent' },
                    { id: 'discovery', label: 'Discovery Agent' },
                    { id: 'sentiment', label: 'Sentiment Agent' },
                    { id: 'competitive', label: 'Competitive Agent' },
                    { id: 'bias', label: 'Bias Detection Agent' },
                    { id: 'trend', label: 'Trend Agent' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      className={`
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                        ${activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Agent Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                {renderAgentContent()}
              </div>
            </div>
          ) : (
            <div className="bg-white h-full rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
              <EmptyStateStyled
                type="NO_PROPERTIES"
                title="Select a Property"
                description="Choose a property from the list to view its details and affinities"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentView;