import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { searchProperties } from '../../services/apiService';
import EmptyState from '../common/EmptyState';

const AgentView = () => {
  const [activeTab, setActiveTab] = useState('verification');
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedPanels, setExpandedPanels] = useState(new Set());

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchProperties(searchTerm || '*');
        setProperties(results);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchProperties();
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchTerm(searchTerm.trim());
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

  const renderPropertyList = () => {
    if (loading) {
      return (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-none w-80 p-4 border rounded-lg animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <EmptyState
          type="ERROR"
          actionButton={{
            label: 'Try Again',
            onClick: () => setSearchTerm('*')
          }}
        />
      );
    }

    if (!properties.length) {
      return (
        <EmptyState
          type="NO_RESULTS"
          actionButton={{
            label: 'Clear Search',
            onClick: () => setSearchTerm('')
          }}
        />
      );
    }

    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {properties.map(property => (
          <div
            key={property.id}
            className={`flex-none w-80 p-4 border rounded-lg cursor-pointer transition-all ${
              selectedProperty?.id === property.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handlePropertySelect(property)}
          >
            <h3 className="text-lg font-semibold">{property.name}</h3>
            <p className="text-gray-600">{property.location}</p>
            <p className="text-sm text-gray-500">ID: {property.id}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderAgentContent = () => {
    if (!selectedProperty) {
      return (
        <EmptyState
          type="NO_DATA"
          title="Select a Property"
          description="Choose a property from the list to view its analysis"
          icon="search"
          className="mt-8"
        />
      );
    }

    switch (activeTab) {
      case 'verification':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{selectedProperty.name}</h3>
              <p className="text-gray-600">This agent confirms affinity scores against ground truth using human-verified data, multiple external sources, and crowdsourced information.</p>
            </div>
            
            <h4 className="font-semibold text-lg mb-3">Verified Affinities</h4>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-semibold">Luxury</h5>
                  <span className="badge score-high">9.1/10 Verified</span>
                </div>
                <div className="evidence-panel">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => togglePanel('luxury-1')}
                  >
                    <p className="text-sm text-gray-700">Five-star rating confirmed</p>
                    <FiChevronDown className={`text-gray-500 transform transition-transform ${expandedPanels.has('luxury-1') ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`collapsible-content ${expandedPanels.has('luxury-1') ? 'block' : 'hidden'}`}>
                    <p className="text-xs text-gray-600 mt-2">Source: Official Hotel Classification Registry (verified)</p>
                  </div>
                </div>
                <div className="evidence-panel mt-2">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => togglePanel('luxury-2')}
                  >
                    <p className="text-sm text-gray-700">Premium amenities detected: spa, butler service, fine dining</p>
                    <FiChevronDown className={`text-gray-500 transform transition-transform ${expandedPanels.has('luxury-2') ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`collapsible-content ${expandedPanels.has('luxury-2') ? 'block' : 'hidden'}`}>
                    <p className="text-xs text-gray-600 mt-2">Source: Property website (verified), Guest reviews (aggregated)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-semibold">Beach Access</h5>
                  <span className="badge score-high">9.5/10 Verified</span>
                </div>
                <div className="evidence-panel">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => togglePanel('beach-1')}
                  >
                    <p className="text-sm text-gray-700">Direct beachfront location confirmed</p>
                    <FiChevronDown className={`text-gray-500 transform transition-transform ${expandedPanels.has('beach-1') ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`collapsible-content ${expandedPanels.has('beach-1') ? 'block' : 'hidden'}`}>
                    <p className="text-xs text-gray-600 mt-2">Source: Geospatial data (verified), On-site inspection (verified)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'discovery':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{selectedProperty.name}</h3>
              <p className="text-gray-600">This agent identifies new attributes and characteristics not currently captured in existing affinities.</p>
            </div>
            
            <h4 className="font-semibold text-lg mb-3">Newly Discovered Attributes</h4>
            <p className="mb-3 text-gray-700">Discovery Agent found 8 new attributes that can enhance existing affinities or suggest new ones.</p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-semibold">Electric Vehicle Charging Stations</h5>
                  <span className="badge score-high">High Confidence (92%)</span>
                </div>
                <p className="text-sm">4 Tesla and 2 universal charging stations available in the parking garage.</p>
                <p className="text-xs text-blue-600 mt-2">Suggests: Eco-Friendly affinity</p>
                <div className="confidence-indicator mt-2">
                  <div className="confidence-fill" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-semibold">Soundproof Rooms</h5>
                  <span className="badge score-high">High Confidence (89%)</span>
                </div>
                <p className="text-sm">Enhanced soundproofing mentioned in 37 recent guest reviews.</p>
                <p className="text-xs text-blue-600 mt-2">Enhances: Privacy, Luxury affinities</p>
                <div className="confidence-indicator mt-2">
                  <div className="confidence-fill" style={{ width: '89%' }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'sentiment':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{selectedProperty.name}</h3>
              <p className="text-gray-600">This agent analyzes reviews and social media to gauge sentiment about property affinities.</p>
            </div>
            
            <h4 className="font-semibold text-lg mb-3">Sentiment Analysis</h4>
            <p className="mb-3 text-gray-700">Sentiment Agent analyzed 736 recent reviews and social media mentions.</p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h5 className="font-semibold mb-2">Luxury Sentiment</h5>
                <div className="mb-3">
                  <h6 className="text-sm font-medium">Key Phrases (736 reviews)</h6>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      "exceptional service" (127 mentions)
                    </span>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      "worth every penny" (98 mentions)
                    </span>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      "5-star experience" (82 mentions)
                    </span>
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      "overpriced" (24 mentions)
                    </span>
                  </div>
                </div>
                <p className="text-sm">Impact: Sentiment confirms high Luxury score (9.1)</p>
              </div>
            </div>
          </div>
        );
      case 'competitive':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{selectedProperty.name}</h3>
              <p className="text-gray-600">This agent benchmarks against competitors to identify relative strengths and gaps.</p>
            </div>
            
            <h4 className="font-semibold text-lg mb-3">Competitive Analysis</h4>
            <p className="mb-3 text-gray-700">Benchmarked against 16 similar resorts on competing booking sites.</p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <h5 className="font-semibold">Luxury Positioning</h5>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Expedia:</span>
                    <span className="font-semibold">9.1/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Competitor A:</span>
                    <span>8.7/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Competitor B:</span>
                    <span>8.9/10</span>
                  </div>
                  <div className="mt-3 text-sm text-green-700">
                    <i className="fas fa-arrow-up mr-1"></i> Competitive Edge: +0.3 points above average
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'bias':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{selectedProperty.name}</h3>
              <p className="text-gray-600">This agent detects and corrects systematic biases in affinity scores.</p>
            </div>
            
            <h4 className="font-semibold text-lg mb-3">Bias Detection</h4>
            <p className="mb-3 text-gray-700">Minor biases detected in review sourcing and seasonal sampling.</p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <h5 className="font-semibold">Review Source Bias</h5>
                </div>
                <p className="mt-3 text-sm">Pet-Friendly scores are disproportionately influenced by reviews from summer travelers (72% of data points).</p>
                <div className="mt-2 px-3 py-2 bg-yellow-50 border-l-4 border-yellow-400">
                  <span className="text-sm font-medium">Bias Severity: Medium (11% score impact)</span>
                </div>
                <div className="mt-3">
                  <h6 className="text-sm font-medium">Correction Applied</h6>
                  <p className="text-sm mt-1">Reweighted seasonal reviews to ensure balanced representation.</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>Original Score: 7.5/10</span>
                    <span>Corrected Score: 7.2/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'trend':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{selectedProperty.name}</h3>
              <p className="text-gray-600">This agent identifies emerging trends relevant to the property.</p>
            </div>
            
            <h4 className="font-semibold text-lg mb-3">Trend Analysis</h4>
            <p className="mb-3 text-gray-700">Trend Agent identified 4 emerging patterns relevant to this property.</p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <h5 className="font-semibold">Wellness Travel</h5>
                  <span className="badge badge-validated">Rising Trend</span>
                </div>
                <div className="mt-2 text-sm">
                  <p>43% increase in searches for wellness amenities and spa facilities in luxury beach resorts over last 90 days.</p>
                  <div className="mt-3">
                    <h6 className="font-medium">Property Alignment</h6>
                    <p className="mt-1">Property has comprehensive spa facilities, meditation classes, and wellness packages.</p>
                    <p className="text-green-700 mt-2">
                      <i className="fas fa-lightbulb mr-1"></i> Opportunity: Create new "Wellness Retreat" affinity and feature property prominently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <EmptyState
            type="NO_DATA"
            description="This agent view is under development"
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Select a Property to Analyze</h2>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter property name (e.g., Oceanview Resort)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSearch}
          >
            Find Property
          </button>
        </div>
        {renderPropertyList()}
      </div>

      {selectedProperty && (
        <div>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
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
                    whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
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
          <div className="mt-6">
            {renderAgentContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentView;