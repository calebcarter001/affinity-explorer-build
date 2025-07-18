import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faChartBar, 
  faLayerGroup, 
  faSearch, 
  faEye, 
  faCalendarAlt, 
  faDownload, 
  faMapMarkerAlt, 
  faHome,
  faTimes, 
  faThumbsUp, 
  faThumbsDown, 
  faCopy,
  faDatabase,
  faCode,
  faGlobe,
  faFlag,
  faCog,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { dataLoader } from '../../services/destinationThemeService';
import SearchableDropdown from '../common/SearchableDropdown';

const SentimentInsights = ({ onNavigateToSettings }) => {
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('Winter');
  const [activeLevel, setActiveLevel] = useState('Property Level');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [availableDestinations, setAvailableDestinations] = useState([]);

  // Mock search data for different levels
  const mockSearchData = {
    'Property Level': [
      'Pura Besakih Beachfront Resort', 'Hotel Artemide Rome', 'Hotel de Russie Rome', 'The First Roma Arte',
      'Hotel Splendide Royal Rome', 'Villa San Martino Rome', 'Hotel Artemis Rome',
      'Rome Cavalieri Waldorf Astoria', 'Hotel Eden Rome', 'The St. Regis Rome'
    ],
    'Destination Level': [
      'Rome, Italy', 'Vatican City', 'Trastevere, Rome', 'Spanish Steps Area',
      'Colosseum District', 'Pantheon Area', 'Campo de Fiori', 'Testaccio, Rome',
      'Villa Borghese Area', 'Termini Station Area'
    ],
    'Marketplace Level': [
      'Italy', 'Europe', 'Mediterranean', 'Southern Europe',
      'EU Market', 'Western Europe', 'EMEA Region'
    ]
  };

  // Load available destinations from service on component mount
  useEffect(() => {
    const destinations = dataLoader.getAvailableDestinations();
    setAvailableDestinations(destinations);
  }, []);

  // Mock data for sentiment insights - Property Level
  const mockPropertyData = {
    overallSentiment: {
      index: -0.41,
      target: -0.25,
      change: '+0.12'
    },
    topPositiveConcept: {
      name: 'Room Quality',
      impact: '+0.42',
      trend: 'positive'
    },
    topNegativeConcept: {
      name: 'Wi-Fi Issues',
      impact: '-0.25',
      trend: 'negative'
    },
    reviewCoverage: {
      percentage: 98,
      impact: '> 50%'
    },
    dataFreshness: {
      days: 1,
      alert: '< 3 days'
    },
    propertyLevelConcepts: [
      {
        name: 'EV-charging availability',
        volume: '+500% volume',
        polarity: '+0.38 polarity',
        action: 'Promote to taxonomy',
        type: 'positive'
      },
      {
        name: 'Pet-smell complaints',
        volume: '+60% volume',
        polarity: '-0.62 polarity',
        action: 'Flag for quality',
        type: 'negative'
      },
      {
        name: 'Contactless check-in',
        volume: '+75% volume',
        polarity: '+0.45 polarity',
        action: 'Monitor',
        type: 'positive'
      }
    ],
    conceptLibrary: {
      positive: [
        { name: 'Room cleanliness', volume: 1247, impact: 0.42, change: '+6.38', trend: 'up' },
        { name: 'Staff friendliness', volume: 892, impact: 0.35, change: '+6.45', trend: 'up' }
      ],
      negative: [
        { name: 'Noise levels', volume: 634, impact: -0.28, change: '-0.28', trend: 'down' }
      ],
      neutral: [
        { name: 'Location access', volume: 445, impact: 0.12, change: '+1.2', trend: 'neutral' }
      ],
      new: [
        { name: 'Contactless service', volume: 234, impact: 0.28, change: 'New', trend: 'new' }
      ]
    },
    sentimentPatterns: {
      conceptsPresent: '≥75% of properties',
      colorCodes: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
    },
    sentimentTrends: {
      data: [
        { month: 'Jan', sentiment: 2.1 },
        { month: 'Feb', sentiment: 2.3 },
        { month: 'Mar', sentiment: 2.2 },
        { month: 'Apr', sentiment: 2.4 },
        { month: 'May', sentiment: 2.3 },
        { month: 'Jun', sentiment: 2.5 }
      ]
    },
    propertyAspectBreakdown: [
      { aspect: 'Cleanliness', score: 0.45, impact: 0.42 },
      { aspect: 'Service', score: 0.38, impact: 0.35 },
      { aspect: 'Location', score: 0.35, impact: 0.28 },
      { aspect: 'Value', score: 0.28, impact: 0.25 },
      { aspect: 'Comfort', score: 0.22, impact: 0.18 },
      { aspect: 'Amenities', score: 0.18, impact: 0.15 }
    ],
    explainabilityTraceability: {
      reviewsMapped: 94.2,
      propertyInsight: 'JSON preview available'
    },
    modelCoverage: {
      affinityNLP: {
        categories: 230,
        lastTrain: '2025-06-28',
        precision: 0.043,
        recall: 0.076
      },
      xmDiscover: {
        categories: 180,
        lastTrain: '2025-06-10',
        precision: 0.081,
        recall: 0.075
      }
    }
  };

  // Mock data for Destination Level
  const mockDestinationData = {
    overallSentiment: {
      index: -0.28,
      target: -0.20,
      change: '+0.08'
    },
    destinationLevelConcepts: [
      {
        name: 'Public Transportation Access',
        volume: '+120% volume',
        polarity: '+0.52 polarity',
        type: 'promote',
        action: 'Promote citywide'
      },
      {
        name: 'Language Barriers',
        volume: '+45% volume',
        polarity: '-0.38 polarity',
        type: 'address',
        action: 'Address in training'
      },
      {
        name: 'Cultural Integration',
        volume: '+85% volume',
        polarity: '+0.65 polarity',
        type: 'monitor',
        action: 'Monitor'
      }
    ],
    destinationConceptLibrary: {
      positive: [
        {
          name: 'Cultural experiences',
          volume: '2847',
          impact: '0.58',
          change: '+8.2'
        },
        {
          name: 'Local cuisine quality',
          volume: '1923',
          impact: '0.45',
          change: '+5.7'
        }
      ]
    },
    topPositiveConcept: {
      name: 'Historical Sites',
      impact: '+0.65',
      trend: 'positive'
    },
    topNegativeConcept: {
      name: 'Tourist Crowds',
      impact: '-0.32',
      trend: 'negative'
    },
    reviewCoverage: {
      percentage: 94,
      impact: '> 75%'
    },
    dataFreshness: {
      days: 2,
      alert: '< 3 days'
    },
    propertyLevelConcepts: [
      {
        name: 'Public Transportation Access',
        volume: '+120% volume',
        polarity: '+0.52 polarity',
        action: 'Promote citywide',
        type: 'positive'
      },
      {
        name: 'Language Barriers',
        volume: '+45% volume',
        polarity: '-0.38 polarity',
        action: 'Address in training',
        type: 'negative'
      }
    ],
    conceptLibrary: {
      positive: [
        { name: 'Cultural experiences', volume: 2847, impact: 0.58, change: '+8.2', trend: 'up' },
        { name: 'Local cuisine quality', volume: 1923, impact: 0.45, change: '+5.7', trend: 'up' }
      ],
      negative: [
        { name: 'Overcrowding issues', volume: 1234, impact: -0.42, change: '-2.1', trend: 'down' }
      ]
    },
    propertyAspectBreakdown: [
      { aspect: 'Location Appeal', score: 0.68, impact: 0.62 },
      { aspect: 'Cultural Access', score: 0.55, impact: 0.48 },
      { aspect: 'Transportation', score: 0.42, impact: 0.38 },
      { aspect: 'Safety Perception', score: 0.38, impact: 0.32 },
      { aspect: 'Cost Value', score: 0.28, impact: 0.25 }
    ],
    sentimentPatterns: {
      conceptsPresent: '≥85% of destinations',
      colorCodes: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
    },
    sentimentTrends: {
      data: [
        { month: 'Jan', sentiment: 2.4 },
        { month: 'Feb', sentiment: 2.6 },
        { month: 'Mar', sentiment: 2.5 },
        { month: 'Apr', sentiment: 2.8 },
        { month: 'May', sentiment: 2.7 },
        { month: 'Jun', sentiment: 2.9 }
      ]
    },
    explainabilityTraceability: {
      reviewsMapped: 91.5,
      propertyInsight: 'Destination-level JSON preview available'
    },
    modelCoverage: {
      affinityNLP: {
        categories: 185,
        lastTrain: '2025-06-25',
        precision: 0.052,
        recall: 0.084
      },
      xmDiscover: {
        categories: 145,
        lastTrain: '2025-06-08',
        precision: 0.089,
        recall: 0.078
      }
    }
  };

  // Mock data for Marketplace Level
  const mockMarketplaceData = {
    overallSentiment: {
      index: -0.15,
      target: -0.10,
      change: '+0.05'
    },
    topPositiveConcept: {
      name: 'Regional Diversity',
      impact: '+0.78',
      trend: 'positive'
    },
    topNegativeConcept: {
      name: 'Economic Concerns',
      impact: '-0.28',
      trend: 'negative'
    },
    reviewCoverage: {
      percentage: 89,
      impact: '> 60%'
    },
    dataFreshness: {
      days: 1,
      alert: '< 5 days'
    },
    propertyLevelConcepts: [
      {
        name: 'Cross-border Travel Ease',
        volume: '+200% volume',
        polarity: '+0.68 polarity',
        action: 'Scale regionally',
        type: 'positive'
      },
      {
        name: 'Currency Fluctuations',
        volume: '+80% volume',
        polarity: '-0.45 polarity',
        action: 'Monitor trends',
        type: 'negative'
      }
    ],
    conceptLibrary: {
      positive: [
        { name: 'Regional connectivity', volume: 5847, impact: 0.72, change: '+12.4', trend: 'up' },
        { name: 'Cultural variety', volume: 4123, impact: 0.58, change: '+9.1', trend: 'up' }
      ],
      negative: [
        { name: 'Economic volatility', volume: 2834, impact: -0.35, change: '-1.8', trend: 'down' }
      ]
    },
    propertyAspectBreakdown: [
      { aspect: 'Market Stability', score: 0.58, impact: 0.52 },
      { aspect: 'Regional Appeal', score: 0.48, impact: 0.42 },
      { aspect: 'Economic Value', score: 0.38, impact: 0.35 },
      { aspect: 'Policy Impact', score: 0.32, impact: 0.28 },
      { aspect: 'Competition Level', score: 0.25, impact: 0.22 }
    ],
    sentimentPatterns: {
      conceptsPresent: '≥70% of markets',
      colorCodes: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
    },
    sentimentTrends: {
      data: [
        { month: 'Jan', sentiment: 2.8 },
        { month: 'Feb', sentiment: 3.1 },
        { month: 'Mar', sentiment: 2.9 },
        { month: 'Apr', sentiment: 3.2 },
        { month: 'May', sentiment: 3.0 },
        { month: 'Jun', sentiment: 3.4 }
      ]
    },
    explainabilityTraceability: {
      reviewsMapped: 87.8,
      propertyInsight: 'Market-level JSON preview available'
    },
    modelCoverage: {
      affinityNLP: {
        categories: 125,
        lastTrain: '2025-06-20',
        precision: 0.068,
        recall: 0.092
      },
      xmDiscover: {
        categories: 95,
        lastTrain: '2025-06-05',
        precision: 0.095,
        recall: 0.081
      }
    }
  };

  // Get current data based on active level
  const getCurrentData = () => {
    switch (activeLevel) {
      case 'Property Level':
        return mockPropertyData;
      case 'Destination Level':
        return mockDestinationData;
      case 'Marketplace Level':
        return mockMarketplaceData;
      default:
        return mockPropertyData;
    }
  };

  // Get context-appropriate section titles
  const getSectionTitles = () => {
    switch (activeLevel) {
      case 'Property Level':
        return {
          newConcepts: 'Property-Level New Concepts',
          conceptLibrary: 'Property Concept Library',
          sentimentPatterns: 'Property Sentiment Patterns',
          sentimentTrends: 'Property Sentiment Trends',
          aspectBreakdown: 'Property Aspect Breakdown'
        };
      case 'Destination Level':
        return {
          newConcepts: 'Destination-Level New Concepts',
          conceptLibrary: 'Destination Concept Library',
          sentimentPatterns: 'Destination Sentiment Patterns',
          sentimentTrends: 'Destination Sentiment Trends',
          aspectBreakdown: 'Destination Aspect Breakdown'
        };
      case 'Marketplace Level':
        return {
          newConcepts: 'Market-Level New Concepts',
          conceptLibrary: 'Market Concept Library',
          sentimentPatterns: 'Market Sentiment Patterns',
          sentimentTrends: 'Market Sentiment Trends',
          aspectBreakdown: 'Market Aspect Breakdown'
        };
      default:
        return {
          newConcepts: 'Property-Level New Concepts',
          conceptLibrary: 'Property Concept Library',
          sentimentPatterns: 'Property Sentiment Patterns',
          sentimentTrends: 'Property Sentiment Trends',
          aspectBreakdown: 'Property Aspect Breakdown'
        };
    }
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = mockSearchData[activeLevel].filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const selectSearchResult = (result) => {
    setSearchQuery(result);
    setShowSearchDropdown(false);
    
    // Set the selected property for Property Level
    if (activeLevel === 'Property Level') {
      // Set specific data for Pura Besakih to match the screenshot
      if (result === 'Pura Besakih Beachfront Resort') {
        setSelectedProperty({
          id: '100001',
          name: 'Pura Besakih Beachfront Resort',
          location: 'Seminyak',
          rating: 4.93,
          maxRating: 5.0,
          price: 552.44,
          currency: '$',
          type: 'Resort',
          stars: 4,
          category: 'Beachfront Resort'
        });
      } else {
        // Generic property data for other selections
        setSelectedProperty({
          id: Math.floor(Math.random() * 900000) + 100000,
          name: result,
          location: 'Various Location',
          rating: (Math.random() * 2 + 3).toFixed(2),
          maxRating: 5.0,
          price: (Math.random() * 500 + 200).toFixed(2),
          currency: '$',
          type: 'Hotel',
          stars: Math.floor(Math.random() * 3) + 3,
          category: 'Premium Hotel'
        });
      }
    } else if (activeLevel === 'Destination Level') {
      setSelectedDestination({
        id: 'destination_' + Date.now(),
        name: result
      });
    }
  };

  const handleDestinationChange = (destinationId) => {
    const destination = availableDestinations.find(d => d.id === destinationId);
    if (destination) {
      setSelectedDestination(destination);
    } else {
      setSelectedDestination(null);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Only load data if something is selected (or if it's Marketplace Level)
      const shouldLoadData = 
        activeLevel === 'Marketplace Level' || 
        (activeLevel === 'Property Level' && selectedProperty) ||
        (activeLevel === 'Destination Level' && selectedDestination);
      
      if (shouldLoadData) {
        setSentimentData(getCurrentData());
      } else {
        setSentimentData(null);
      }
      setLoading(false);
    };
    loadData();
  }, [selectedDestination, selectedSeason, activeLevel, selectedProperty]);

  // Clear search when switching tabs
  useEffect(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchDropdown(false);
    // Clear selections when switching levels
    if (activeLevel === 'Property Level') {
      setSelectedProperty(null);
    } else if (activeLevel === 'Destination Level') {
      setSelectedDestination(null);
    }
  }, [activeLevel]);

  // Helper function to check if we should show content
  const shouldShowContent = () => {
    return activeLevel === 'Marketplace Level' || 
           (activeLevel === 'Property Level' && selectedProperty) ||
           (activeLevel === 'Destination Level' && selectedDestination);
  };

  const MetricCard = ({ title, value, subtitle, icon, color = 'text-blue-500', trend }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <FontAwesomeIcon icon={icon} className={`text-lg ${color}`} />}
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
      {trend && (
        <div className={`text-sm ${trend.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </div>
      )}
    </div>
  );

  const ConceptCard = ({ concept, type }) => (
    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-800">{concept.name}</h4>
        <span className={`px-2 py-1 rounded text-xs ${
          type === 'positive' ? 'bg-green-100 text-green-800' : 
          type === 'negative' ? 'bg-red-100 text-red-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {concept.action}
        </span>
      </div>
      <div className="text-sm text-gray-600 mb-1">{concept.volume}</div>
      <div className="text-sm text-gray-600">{concept.polarity}</div>
    </div>
  );

  const PropertyCard = ({ property, onClose }) => (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 mb-4 max-w-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="text-sm">🏖️</span>
            <span className="text-sm">🏛️</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-800 truncate">{property.name}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 text-xs" />
                <span>{property.location}</span>
              </div>
              <span className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-xs">
                {property.type}
              </span>
              <span className="text-orange-500">⭐</span>
              <span className="font-medium">{property.stars}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-xs text-gray-600">Rating: <span className="font-bold text-orange-500">{property.rating}/{property.maxRating}</span></div>
            <div className="flex items-center text-xs">
              <span className="font-bold text-green-600">{property.currency}{property.price}</span>
              <span className="text-gray-600">/night</span>
            </div>
            <div className="text-xs text-gray-500"># ID: {property.id}</div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );

  const DestinationSelector = ({ selectedDestination, onDestinationChange }) => (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {selectedDestination ? availableDestinations.find(d => d.id === selectedDestination)?.name : 'Select Destination'}
            </h2>
            <p className="text-white text-opacity-90">
              Explore sentiment insights for this destination
            </p>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <SearchableDropdown
            options={availableDestinations.map(dest => ({
              value: dest.id,
              label: `${dest.flag} ${dest.name}`,
              destination: dest
            }))}
            value={selectedDestination ? {
              value: selectedDestination,
              label: (() => {
                const dest = availableDestinations.find(d => d.id === selectedDestination);
                return dest ? `${dest.flag} ${dest.name}` : selectedDestination;
              })()
            } : null}
            onChange={(option) => onDestinationChange(option?.value || '')}
            placeholder="Choose destination..."
                         className="w-48"
            noOptionsMessage="No destinations found"
          />
        </div>
      </div>
    </div>
  );

  const AspectBar = ({ aspect, score, impact }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{aspect}</span>
        <span className="text-sm text-gray-600">{score.toFixed(2)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-6">
        <div 
          className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
          style={{ width: `${(score / 0.5) * 100}%` }}
        >
          Impact Score: {impact.toFixed(2)}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Sentiment Insights</h1>
            <p className="text-blue-100">Actionable sentiment intelligence for Product, TextAPI, and CX teams</p>
          </div>
        </div>
      </div>

      {/* Level Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-1">
          {['Property Level', 'Destination Level', 'Marketplace Level'].map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeLevel === level
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        
        {/* Search Input with Typeahead */}
        <div className="relative">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={`Search ${activeLevel === 'Property Level' ? 'properties' : activeLevel === 'Destination Level' ? 'destinations' : 'markets'}...`}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Typeahead Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => selectSearchResult(result)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  {result}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Property Card for Property Level */}
      {activeLevel === 'Property Level' && selectedProperty && (
        <PropertyCard 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}

      {/* Destination Selector for Destination Level */}
      {activeLevel === 'Destination Level' && (
        <DestinationSelector 
          selectedDestination={selectedDestination?.id} 
          onDestinationChange={handleDestinationChange} 
        />
      )}

      {/* Empty State when nothing is selected */}
      {!shouldShowContent() && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-400 mb-4">
            {activeLevel === 'Property Level' ? (
              <FontAwesomeIcon icon={faSearch} className="text-6xl" />
            ) : (
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-6xl" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {activeLevel === 'Property Level' 
              ? 'No Property Selected' 
              : 'No Destination Selected'
            }
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {activeLevel === 'Property Level' 
              ? 'Search for and select a property to view sentiment insights and analytics.' 
              : 'Please select a destination from the dropdown above to view sentiment insights.'
            }
          </p>
        </div>
      )}

      {/* Content sections - only show when something is selected */}
      {shouldShowContent() && (
        <>
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <MetricCard
              title="Overall Sentiment Index"
              value={sentimentData?.overallSentiment?.index || 'N/A'}
              subtitle={`Target: ${sentimentData?.overallSentiment?.target || 'N/A'}`}
              trend={sentimentData?.overallSentiment?.change || 'N/A'}
              icon={faChartLine}
              color="text-green-500"
            />
            <MetricCard
              title="Top Positive Concept"
              value={sentimentData?.topPositiveConcept?.name || 'N/A'}
              subtitle={`Impact: ${sentimentData?.topPositiveConcept?.impact || 'N/A'}`}
              icon={faThumbsUp}
              color="text-green-500"
            />
            <MetricCard
              title="Top Negative Concept"
              value={sentimentData?.topNegativeConcept?.name || 'N/A'}
              subtitle={`Impact: ${sentimentData?.topNegativeConcept?.impact || 'N/A'}`}
              icon={faThumbsDown}
              color="text-red-500"
            />
            <MetricCard
              title="Concept Coverage"
              value={`${sentimentData?.reviewCoverage?.percentage || 0}%`}
              subtitle={`Impact: ${sentimentData?.reviewCoverage?.impact || 'N/A'}`}
              icon={faEye}
              color="text-blue-500"
            />
            <MetricCard
              title="Data Freshness"
              value={`${sentimentData?.dataFreshness?.days || 0} day`}
              subtitle={`Alert: ${sentimentData?.dataFreshness?.alert || 'N/A'}`}
              icon={faCalendarAlt}
              color="text-green-500"
            />
          </div>

          {/* Main Content Grid - Show for all tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Dynamic New Concepts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <FontAwesomeIcon icon={faSearch} className="mr-2 text-blue-500" />
                {getSectionTitles().newConcepts}
              </h3>
              <div className="space-y-4">
                {(activeLevel === 'Destination Level' 
                  ? sentimentData?.destinationLevelConcepts || []
                  : sentimentData?.propertyLevelConcepts || []
                ).map((concept, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{concept.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        concept.type === 'promote' ? 'bg-green-100 text-green-800' :
                        concept.type === 'address' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {concept.action}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{concept.volume}</div>
                    <div className="text-sm text-gray-600">{concept.polarity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Concept Library */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-purple-500" />
                {getSectionTitles().conceptLibrary}
              </h3>
              <div className="flex space-x-2 mb-4">
                {['Positive', 'Negative', 'Neutral', 'New'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-3 py-1 rounded text-sm ${
                      tab === 'Positive' ? 'bg-green-100 text-green-800' :
                      tab === 'Negative' ? 'bg-red-100 text-red-800' :
                      tab === 'Neutral' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {(activeLevel === 'Destination Level' 
                  ? sentimentData?.destinationConceptLibrary?.positive || []
                  : sentimentData?.conceptLibrary?.positive || []
                ).map((concept, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-gray-800">{concept.name}</div>
                      <div className="text-sm text-gray-600">Volume: {concept.volume} • Impact: {concept.impact}</div>
                    </div>
                    <div className="text-green-600 font-medium">{concept.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Property Aspect Breakdown - Show for Property Level and Marketplace Level only */}
          {activeLevel !== 'Destination Level' && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <FontAwesomeIcon icon={faChartBar} className="mr-2 text-orange-500" />
                {getSectionTitles().aspectBreakdown}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(sentimentData?.propertyAspectBreakdown || []).map((aspect, index) => (
                  <AspectBar key={index} {...aspect} />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Info Cards - Show for Property Level and Marketplace Level only */}
          {activeLevel !== 'Destination Level' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <FontAwesomeIcon icon={faSearch} className="mr-2 text-blue-500" />
                  Explainability & Traceability
                </h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {sentimentData?.explainabilityTraceability?.reviewsMapped || 0}%
                </div>
                <div className="text-sm text-gray-600">Reviews mapped to taxonomy anchors</div>
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">{sentimentData?.explainabilityTraceability?.propertyInsight || 'N/A'}</div>
                  <button className="mt-2 text-blue-500 text-sm hover:underline">
                    <FontAwesomeIcon icon={faCopy} className="mr-1" />
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <FontAwesomeIcon icon={faCog} className="mr-2 text-purple-500" />
                  Model Coverage
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-gray-800">Affinity NLP</div>
                    <div className="text-sm text-gray-600">
                      {sentimentData?.modelCoverage?.affinityNLP?.categories || 0} categories • 
                      Last train: {sentimentData?.modelCoverage?.affinityNLP?.lastTrain || 'N/A'}
                    </div>
                    <div className="text-sm text-blue-600">
                      P: {sentimentData?.modelCoverage?.affinityNLP?.precision || 0} - R: {sentimentData?.modelCoverage?.affinityNLP?.recall || 0}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">XM Discover</div>
                    <div className="text-sm text-gray-600">
                      {sentimentData?.modelCoverage?.xmDiscover?.categories || 0} categories • 
                      Last train: {sentimentData?.modelCoverage?.xmDiscover?.lastTrain || 'N/A'}
                    </div>
                    <div className="text-sm text-blue-600">
                      P: {sentimentData?.modelCoverage?.xmDiscover?.precision || 0} - R: {sentimentData?.modelCoverage?.xmDiscover?.recall || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SentimentInsights;
