import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import SkeletonLoader from '../common/SkeletonLoader';
import EmptyState from '../common/EmptyState';

const AgentView = () => {
  const [activeTab, setActiveTab] = useState('verification');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([
    {
      id: 'PROP12345',
      name: 'Oceanview Resort & Spa',
      location: 'Miami Beach, FL',
      selected: true
    },
    {
      id: 'PROP67890',
      name: 'Mountain Lodge',
      location: 'Aspen, CO',
      selected: false
    },
    {
      id: 'PROP24680',
      name: 'City Center Suites',
      location: 'New York, NY',
      selected: false
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});

  const agents = {
    verification: {
      title: 'Verification Agent',
      description: 'This agent confirms affinity scores against ground truth using human-verified data.'
    },
    discovery: {
      title: 'Discovery Agent',
      description: 'This agent identifies potential new affinities based on property characteristics.'
    },
    sentiment: {
      title: 'Sentiment Agent',
      description: 'This agent analyzes customer reviews and feedback to validate affinity scores.'
    },
    competitive: {
      title: 'Competitive Agent',
      description: 'This agent benchmarks against competitors to identify relative strengths and gaps.'
    },
    'bias-detection': {
      title: 'Bias Detection Agent',
      description: 'This agent identifies potential biases in affinity scoring.'
    },
    trend: {
      title: 'Trend Agent',
      description: 'This agent tracks emerging patterns in affinity scores.'
    }
  };

  const selectProperty = (propertyId) => {
    setProperties(properties.map(p => ({
      ...p,
      selected: p.id === propertyId
    })));
    setSelectedProperty(properties.find(p => p.id === propertyId));
  };

  const toggleDetail = (propertyId, itemId) => {
    const key = `${propertyId}-${itemId}`;
    setExpandedDetails(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderVerificationView = (property) => {
    return (
      <div className="space-y-3">
        <p className="text-gray-600">{agents.verification.description}</p>
        
        <h3 className="text-xl font-bold">Verified Affinities</h3>
        
        <div className="space-y-3">
          {property.verifiedAffinities?.map((affinity) => (
            <div key={affinity.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-bold">{affinity.name}</h4>
                <span className="text-green-600">{affinity.score} Verified</span>
              </div>
              <div className="space-y-1.5">
                {affinity.details.map((detail, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1 h-5 bg-blue-700 mt-1"></div>
                    <p className="text-gray-700">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDiscoveryView = (property) => {
    return (
      <div className="space-y-3">
        <p className="text-gray-600">This agent identifies new attributes and characteristics not currently captured in existing affinities.</p>
        
        <h3 className="text-xl font-bold">Newly Discovered Attributes</h3>
        
        <p className="text-gray-600 mb-3">Discovery Agent found 8 new attributes that can enhance existing affinities or suggest new ones.</p>

        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-bold">Electric Vehicle Charging Stations</h4>
              <span className="text-green-600 text-sm">High Confidence (92%)</span>
            </div>

            <p className="text-gray-700 mb-3">
              4 Tesla and 2 universal charging stations available in the parking garage.
            </p>

            <div className="space-y-1.5">
              <p className="text-blue-600">
                <span className="text-sm">Suggests: </span>
                <span className="text-blue-600 hover:underline cursor-pointer">Eco-Friendly affinity</span>
              </p>
              <div className="w-full h-1.5 bg-green-600 rounded"></div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-bold">Soundproof Rooms</h4>
              <span className="text-green-600 text-sm">High Confidence (89%)</span>
            </div>

            <p className="text-gray-700 mb-3">
              Enhanced soundproofing mentioned in 37 recent guest reviews.
            </p>

            <div className="space-y-1.5">
              <p className="text-blue-600">
                <span className="text-sm">Enhances: </span>
                <span className="text-blue-600 hover:underline cursor-pointer">Privacy</span>,
                <span className="text-blue-600 hover:underline cursor-pointer ml-1">Luxury affinities</span>
              </p>
              <div className="w-full h-1.5 bg-green-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSentimentView = (property) => {
    return (
      <div className="space-y-3">
        <p className="text-gray-600">{agents.sentiment.description}</p>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3">Sentiment Analysis</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Review Sentiment:</span>
              <span className="text-purple-700">{property.sentimentAnalysis?.reviewSentiment}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Reviews:</span>
              <span className="text-purple-700">{property.sentimentAnalysis?.totalReviews}</span>
            </div>
            <div>
              <h4 className="font-medium mb-2">Common Positive Keywords:</h4>
              <div className="flex flex-wrap gap-1.5">
                {property.sentimentAnalysis?.positiveKeywords.map((keyword) => (
                  <span key={keyword} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCompetitiveView = (property) => {
    return (
      <div className="space-y-3">
        <p className="text-gray-600">This agent benchmarks against competitors to identify relative strengths and gaps.</p>
        
        <h3 className="text-xl font-bold">Competitive Analysis</h3>
        <p className="text-gray-600 mb-3">Benchmarked against 16 similar resorts on competing booking sites.</p>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-bold">Luxury Positioning</h4>
            <FiChevronDown className="text-gray-600" />
          </div>
        </div>
      </div>
    );
  };

  const renderBiasView = (property) => {
    return (
      <div className="space-y-3">
        <p className="text-gray-600">This agent detects and corrects systematic biases in affinity scores.</p>
        
        <h3 className="text-xl font-bold">Bias Detection</h3>
        
        <p className="text-gray-600 mb-3">Minor biases detected in review sourcing and seasonal sampling.</p>
        
        <div className="bg-red-50/50 p-4">
          <h4 className="text-lg font-bold">Review Source Bias</h4>
        </div>
      </div>
    );
  };

  const renderTrendView = (property) => {
    return (
      <div className="space-y-3">
        <p className="text-gray-600">This agent identifies emerging trends relevant to the property.</p>
        
        <h3 className="text-xl font-bold">Trend Analysis</h3>
        
        <p className="text-gray-600 mb-3">Trend Agent identified 4 emerging patterns relevant to this property.</p>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-bold">Wellness Travel</h4>
            <span className="text-green-600 text-sm">Rising Trend</span>
          </div>

          <p className="text-gray-700 mb-3">
            43% increase in searches for wellness amenities and spa facilities in luxury beach resorts over last 90 days.
          </p>

          <div className="mb-3">
            <h5 className="font-medium mb-1.5">Property Alignment</h5>
            <p className="text-gray-600">
              Property has comprehensive spa facilities, meditation classes, and wellness packages.
            </p>
          </div>

          <div className="flex items-start gap-2 text-green-600">
            <span className="mt-1">🎯</span>
            <p>
              <span className="font-medium">Opportunity:</span> Create new "Wellness Retreat" affinity and feature property prominently.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <EmptyState
        icon="error"
        title="Error Loading Properties"
        description={error}
        actionButton={{
          label: 'Retry',
          onClick: () => {
            // Implement retry logic
          }
        }}
      />
    );
  }

  const renderActiveView = (property) => {
    switch (activeTab) {
      case 'verification':
        return renderVerificationView(property);
      case 'discovery':
        return renderDiscoveryView(property);
      case 'sentiment':
        return renderSentimentView(property);
      case 'competitive':
        return renderCompetitiveView(property);
      case 'bias-detection':
        return renderBiasView(property);
      case 'trend':
        return renderTrendView(property);
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agent View</h1>

      {/* Property Selection Section */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <h2 className="text-xl font-bold mb-3">Select a Property to Analyze</h2>
        
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter property name (e.g., Oceanview Resort)"
              className="w-full px-3 py-1.5 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg">
            Find Property
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className={`p-3 rounded-lg border-2 cursor-pointer ${
                property.selected ? 'border-blue-700' : 'border-gray-200'
              }`}
              onClick={() => selectProperty(property.id)}
            >
              <h3 className="font-bold">{property.name}</h3>
              <p className="text-gray-600 text-sm">{property.location}</p>
              <p className="text-gray-500 text-xs">ID: {property.id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Navigation */}
      <div className="flex gap-4 mb-4 overflow-x-auto border-b">
        {Object.entries(agents).map(([key, agent]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-2 -mb-px whitespace-nowrap ${
              activeTab === key
              ? 'border-b-2 border-blue-700 font-semibold'
              : 'text-gray-600'
            }`}
          >
            {agent.title}
          </button>
        ))}
      </div>

      {/* Agent Content */}
      {loading ? (
        <div className="space-y-3">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="text" count={3} />
        </div>
      ) : error ? (
        <EmptyState
          type="ERROR"
          actionButton={
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                // Simulate loading
                setTimeout(() => setLoading(false), 1000);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          }
        />
      ) : !selectedProperty ? (
        <EmptyState
          type="NO_PROPERTIES"
          actionButton={
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View All Properties
            </button>
          }
          suggestions={[
            'Select a property from the list above',
            'Use the search to find specific properties',
            'Make sure you have properties in the system'
          ]}
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{selectedProperty.name}</h2>
          {renderActiveView(selectedProperty)}
        </div>
      )}
    </div>
  );
};

export default AgentView;