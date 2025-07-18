import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  FiSettings, 
  FiCopy, 
  FiEdit, 
  FiMessageSquare, 
  FiZap, 
  FiSave, 
  FiShare2, 
  FiSend,
  FiCheck,
  FiAlertCircle,
  FiEye,
  FiBarChart2,
  FiTarget,
  FiGlobe,
  FiUser,
  FiMessageCircle,
  FiCheckCircle,
  FiX,
  FiChevronDown,
  FiSearch,
  FiMapPin,
  FiActivity,
  FiLayers,
  FiTrendingUp,
  FiCpu,
  FiImage,
  FiDollarSign,
  FiClock,
  FiFilter,
  FiInfo,
  FiChevronUp,
  FiRefreshCw,
  FiPlus,
  FiArrowUp,
  FiLink,
  FiUsers,
  FiEdit3,
  FiHeart,
  FiHome,
  FiKey,
  FiStar,
  FiCamera,
  FiFlag,
  FiTag,
  FiTruck,
  FiThumbsUp,
  FiBookmark
} from 'react-icons/fi';
import SearchableDropdown from '../common/SearchableDropdown';
import { useAppContext } from '../../contexts/AppContext';
import { searchProperties } from '../../services/apiService';
import { calculateSimilarity } from './similarity-engine';
import { snippetGenerator } from '../../services/snippet-generator';
import PropertyCard from '../common/PropertyCard';

// Custom styles for clean slider appearance
const sliderStyles = `
  .slider-thumb::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }
  
  .slider-thumb::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .slider-thumb::-moz-range-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .slider-thumb::-moz-range-track {
    background: transparent;
    border: none;
  }
  
  .slider-thumb:focus {
    outline: none;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sliderStyles;
  document.head.appendChild(styleSheet);
}

// Destination Insights Configuration
const destinationInsightsConfig = {
  destinationNuances: {
    label: 'Destination Nuances',
    icon: FiMapPin,
    options: [
      { id: 'cultural-heritage', label: 'Cultural Heritage', description: 'Rich historical and cultural significance' },
      { id: 'natural-beauty', label: 'Natural Beauty', description: 'Stunning landscapes and natural attractions' },
      { id: 'local-cuisine', label: 'Local Cuisine', description: 'Distinctive regional food and dining experiences' },
      { id: 'seasonal-appeal', label: 'Seasonal Appeal', description: 'Best times to visit and seasonal highlights' },
      { id: 'hidden-gems', label: 'Hidden Gems', description: 'Lesser-known but remarkable local spots' }
    ]
  },
  hotelNuances: {
    label: 'Hotel Nuances',
    icon: FiHome,
    options: [
      { id: 'luxury-amenities', label: 'Luxury Amenities', description: 'Premium facilities and services' },
      { id: 'boutique-charm', label: 'Boutique Charm', description: 'Unique character and personalized service' },
      { id: 'family-friendly', label: 'Family-Friendly', description: 'Amenities and services for families' },
      { id: 'business-facilities', label: 'Business Facilities', description: 'Meeting rooms and business services' },
      { id: 'wellness-focus', label: 'Wellness Focus', description: 'Spa, fitness, and wellness offerings' }
    ]
  },
  vacationRentalNuances: {
    label: 'Vacation Rental Nuances',
    icon: FiKey,
    options: [
      { id: 'home-like-comfort', label: 'Home-like Comfort', description: 'Spacious and comfortable living spaces' },
      { id: 'local-neighborhood', label: 'Local Neighborhood', description: 'Authentic local living experience' },
      { id: 'privacy-independence', label: 'Privacy & Independence', description: 'Private space and self-catering options' },
      { id: 'group-accommodation', label: 'Group Accommodation', description: 'Perfect for larger groups and families' },
      { id: 'unique-properties', label: 'Unique Properties', description: 'Distinctive and memorable accommodations' }
    ]
  },
  knownFor: {
    label: 'Known For',
    icon: FiStar,
    options: [
      { id: 'adventure-sports', label: 'Adventure Sports', description: 'Thrilling outdoor activities' },
      { id: 'romantic-getaways', label: 'Romantic Getaways', description: 'Perfect for couples and romance' },
      { id: 'nightlife-entertainment', label: 'Nightlife & Entertainment', description: 'Vibrant evening and night scene' },
      { id: 'shopping-districts', label: 'Shopping Districts', description: 'Excellent shopping opportunities' },
      { id: 'art-culture', label: 'Art & Culture', description: 'Museums, galleries, and cultural sites' }
    ]
  },
  photogenicSpots: {
    label: 'Photogenic Spots',
    icon: FiCamera,
    options: [
      { id: 'scenic-viewpoints', label: 'Scenic Viewpoints', description: 'Breathtaking panoramic views' },
      { id: 'architectural-marvels', label: 'Architectural Marvels', description: 'Stunning buildings and structures' },
      { id: 'sunset-sunrise', label: 'Sunset/Sunrise Spots', description: 'Perfect lighting for photography' },
      { id: 'instagram-worthy', label: 'Instagram-Worthy', description: 'Social media perfect locations' },
      { id: 'unique-backdrops', label: 'Unique Backdrops', description: 'Distinctive photo opportunities' }
    ]
  },
  landmarks: {
    label: 'Landmarks',
    icon: FiFlag,
    options: [
      { id: 'historical-monuments', label: 'Historical Monuments', description: 'Significant historical sites' },
      { id: 'natural-landmarks', label: 'Natural Landmarks', description: 'Notable natural formations' },
      { id: 'modern-attractions', label: 'Modern Attractions', description: 'Contemporary points of interest' },
      { id: 'religious-sites', label: 'Religious Sites', description: 'Sacred and spiritual locations' },
      { id: 'unesco-sites', label: 'UNESCO Sites', description: 'World Heritage locations' }
    ]
  },
  themes: {
    label: 'Themes',
    icon: FiTag,
    options: [
      { id: 'relaxation-wellness', label: 'Relaxation & Wellness', description: 'Peaceful and rejuvenating experiences' },
      { id: 'adventure-exploration', label: 'Adventure & Exploration', description: 'Active and exciting activities' },
      { id: 'luxury-indulgence', label: 'Luxury & Indulgence', description: 'Premium and upscale experiences' },
      { id: 'family-fun', label: 'Family Fun', description: 'Activities for all ages' },
      { id: 'romantic-escape', label: 'Romantic Escape', description: 'Intimate and romantic settings' }
    ]
  },
  localInsiderTips: {
    label: 'Local Insider Tips',
    icon: FiInfo,
    options: [
      { id: 'best-kept-secrets', label: 'Best Kept Secrets', description: 'Local favorites and hidden spots' },
      { id: 'seasonal-recommendations', label: 'Seasonal Recommendations', description: 'Time-specific local advice' },
      { id: 'local-etiquette', label: 'Local Etiquette', description: 'Cultural norms and customs' },
      { id: 'transportation-tips', label: 'Transportation Tips', description: 'Getting around like a local' },
      { id: 'money-saving-tips', label: 'Money-Saving Tips', description: 'Budget-friendly local advice' }
    ]
  },
  accessibility: {
    label: 'Accessibility',
    icon: FiHeart,
    options: [
      { id: 'wheelchair-accessible', label: 'Wheelchair Accessible', description: 'Full wheelchair accessibility' },
      { id: 'visual-impairment', label: 'Visual Impairment Support', description: 'Services for visually impaired guests' },
      { id: 'hearing-impairment', label: 'Hearing Impairment Support', description: 'Services for hearing impaired guests' },
      { id: 'mobility-assistance', label: 'Mobility Assistance', description: 'Support for mobility challenges' },
      { id: 'service-animals', label: 'Service Animals Welcome', description: 'Accommodations for service animals' }
    ]
  },
  transportation: {
    label: 'Transportation',
    icon: FiTruck,
    options: [
      { id: 'airport-shuttle', label: 'Airport Shuttle', description: 'Convenient airport transportation' },
      { id: 'public-transport', label: 'Public Transport Access', description: 'Easy access to public transportation' },
      { id: 'car-rental', label: 'Car Rental Services', description: 'Vehicle rental options' },
      { id: 'walking-distance', label: 'Walking Distance', description: 'Key attractions within walking distance' },
      { id: 'parking-facilities', label: 'Parking Facilities', description: 'Convenient parking options' }
    ]
  }
};

// Similarity dimensions configuration
const similarityDimensions = {
  all: { label: 'All Dimensions', icon: FiLayers, color: '#6366f1' },
  semantic: { label: 'Semantic & Linguistic', icon: FiCpu, color: '#3b82f6' },
  taxonomic: { label: 'Taxonomic / Graph', icon: FiTarget, color: '#10b981' },
  attribute: { label: 'Attribute Alignment', icon: FiCheckCircle, color: '#f59e0b' },
  behavioral: { label: 'Behavioral Interaction', icon: FiActivity, color: '#8b5cf6' },
  content: { label: 'Content & Media', icon: FiImage, color: '#ec4899' },
  external: { label: 'External Search Data', icon: FiTrendingUp, color: '#14b8a6' },
  temporal: { label: 'Spatio-Temporal', icon: FiClock, color: '#f97316' },
  statistical: { label: 'Statistical / Matrix', icon: FiBarChart2, color: '#84cc16' },
  business: { label: 'Business / GP Impact', icon: FiDollarSign, color: '#ef4444' }
};

// WeightSlider Component
const WeightSlider = ({ label, value, color, onChange }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-medium text-gray-900">{value}%</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
          }}
        />
      </div>
    </div>
  );
};

// Similarity Strategy Selector Component
const SimilarityStrategySelector = ({ selectedStrategy, onStrategyChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const strategies = Object.entries(similarityDimensions).map(([key, config]) => ({
    value: key,
    label: config.label,
    icon: config.icon,
    color: config.color
  }));

  const selectedConfig = similarityDimensions[selectedStrategy];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <selectedConfig.icon className="w-4 h-4" style={{ color: selectedConfig.color }} />
        <span className="text-sm font-medium text-gray-700">{selectedConfig.label}</span>
        <FiChevronDown className={`w-4 h-4 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 right-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">Select Similarity Dimension</div>
            {strategies.map((strategy) => {
              const Icon = strategy.icon;
              return (
                <button
                  key={strategy.value}
                  onClick={() => {
                    onStrategyChange(strategy.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors ${
                    selectedStrategy === strategy.value ? 'bg-blue-50' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" style={{ color: strategy.color }} />
                  <span className="text-sm">{strategy.label}</span>
                  {selectedStrategy === strategy.value && (
                    <FiCheck className="w-4 h-4 text-blue-600 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Similarity Heat Dots Component
const SimilarityHeatDots = ({ concept }) => {
  return (
    <div className="flex items-center space-x-1">
      {Object.entries(concept.similarity_scores || {}).map(([dimension, data]) => {
        const config = similarityDimensions[dimension];
        if (!config) return null;
        
        const Icon = config.icon;
        const intensity = data.score;
        const confidence = data.confidence;
        
        return (
          <div key={dimension} className="group relative">
            <div
              className="w-3 h-3 rounded-full flex items-center justify-center cursor-help transition-transform hover:scale-110"
              style={{
                backgroundColor: config.color,
                opacity: confidence === 'high' ? 0.9 : confidence === 'medium' ? 0.6 : 0.3
              }}
            >
              <Icon className="w-2 h-2 text-white" />
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {config.label}: {(intensity * 100).toFixed(1)}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Enhanced RelatedConceptCard with similarity visualization and weight control
const RelatedConceptCard = ({ concept, selectedSimilarityStrategy, weight, onWeightChange }) => {
  // Helper to get the concept type - checking both conceptType (dynamic) and type (static)
  const getConceptType = (concept) => {
    return concept.conceptType || concept.type || 'related';
  };
  
  const conceptType = getConceptType(concept);
  
  const getColorByType = (type) => {
    switch (type) {
      case 'primary': return '#3b82f6';
      case 'secondary': return '#10b981';
      case 'tertiary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getCTRLift = (percentage) => {
    if (percentage >= 80) return '+12%';
    if (percentage >= 60) return '+8%';
    if (percentage >= 40) return '+5%';
    return '+2%';
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getScoreForDimension = (dimension) => {
    if (!concept.similarity_scores) {
      return { score: 0, confidence: 'low', evidence: [] };
    }
    
    if (dimension === 'all') {
      // Calculate average score across all dimensions
      const scores = Object.values(concept.similarity_scores);
      const avgScore = scores.reduce((sum, score) => sum + score.score, 0) / scores.length;
      return {
        score: avgScore,
        confidence: 'high',
        evidence: ['Multiple dimensions']
      };
    }
    return concept.similarity_scores[dimension] || { score: 0, confidence: 'low', evidence: [] };
  };

  const selectedScore = getScoreForDimension(selectedSimilarityStrategy);

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: getColorByType(conceptType) }}
          />
          <h4 className="font-medium text-gray-900">{concept.name}</h4>
          {/* Secondary/Tertiary Tag */}
          {(conceptType === 'secondary' || conceptType === 'tertiary') && (
            <span 
              className="ml-2 text-xs px-2 py-1 rounded-full font-medium"
              style={{
                backgroundColor: conceptType === 'secondary' ? '#dcfce7' : '#fef3c7',
                color: conceptType === 'secondary' ? '#166534' : '#92400e'
              }}
            >
              {conceptType === 'secondary' ? 'Secondary' : 'Tertiary'}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
            {getCTRLift(concept.relevance_percentage)}
          </span>
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getConfidenceColor(selectedScore.confidence) }}
            title={`${selectedScore.confidence} confidence`}
          />
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Similarity Score</span>
          <span>{(selectedScore.score * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: `${selectedScore.score * 100}%`,
              backgroundColor: similarityDimensions[selectedSimilarityStrategy]?.color || '#6b7280'
            }}
          />
        </div>
      </div>
      
      {/* Enhanced Heat Dots Row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 capitalize">{concept.relationship}</span>
        <SimilarityHeatDots concept={concept} />
      </div>
      
      {/* Evidence Pills */}
      <div className="flex flex-wrap gap-1 mt-2">
        {selectedScore.evidence.slice(0, 3).map((evidence, index) => (
          <span key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
            {evidence}
          </span>
        ))}
      </div>
      
      {/* Weight Slider for Related Concept */}
      {weight !== undefined && onWeightChange && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Content Influence</label>
            <span className="text-sm font-bold" style={{ color: getColorByType(concept.type) }}>{weight}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="40"
            value={weight}
            onChange={(e) => onWeightChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${getColorByType(concept.type)} 0%, ${getColorByType(concept.type)} ${(weight/40)*100}%, #e5e7eb ${(weight/40)*100}%, #e5e7eb 100%)`
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            Controls how much this {concept.type} concept influences generated content
          </p>
        </div>
      )}
    </div>
  );
};

// Toast Notification Component
const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;
  
  const getToastColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };
  
  return (
    <div className={`fixed bottom-4 left-4 ${getToastColor(toast.type)} text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50`}>
      <span className="text-sm">{toast.message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

const ConceptRelationshipInsights = () => {
  const { affinities } = useAppContext();
  const [selectedPrimaryConcept, setSelectedPrimaryConcept] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propertySearchTerm, setPropertySearchTerm] = useState('');
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [weights, setWeights] = useState({
    primary: 50,
    secondary: 30,
    tertiary: 20
  });
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedVariant, setSelectedVariant] = useState('A');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showAccessibilityChecklist, setShowAccessibilityChecklist] = useState(false);
  const [showCommentPin, setShowCommentPin] = useState(false);
  const [commentPinPosition, setCommentPinPosition] = useState({ x: 0, y: 0 });
  const [readabilityScore, setReadabilityScore] = useState(9.2);
  const [selectedSimilarityStrategy, setSelectedSimilarityStrategy] = useState('all');
  const [configuration, setConfiguration] = useState({
    surfaceType: 'property-detail-page',
    language: 'english-us',
    toneStyle: 'family-friendly',
    primaryConcept: ''
  });
  const [accessibilityChecks, setAccessibilityChecks] = useState({
    altText: true,
    adjectiveBalance: false,
    inclusiveLanguage: true,
    readingLevel: false
  });
  const [activeVariant, setActiveVariant] = useState('A');
  const [showPrimaryDetails, setShowPrimaryDetails] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(true);
  const [generatedVariants, setGeneratedVariants] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [autoRegenerate, setAutoRegenerate] = useState(true);
  
  // Accordion and Destination Insights State
  const [activeAccordionView, setActiveAccordionView] = useState('related-concepts');
  const [selectedDestinationInsights, setSelectedDestinationInsights] = useState({
    destinationNuances: [],
    hotelNuances: [],
    vacationRentalNuances: [],
    knownFor: [],
    photogenicSpots: [],
    landmarks: [],
    themes: [],
    localInsiderTips: [],
    accessibility: [],
    transportation: []
  });
  const snippetRef = useRef(null);
  
  // Property search functionality
  const loadProperties = useCallback(async (searchTerm = '') => {
    try {
      setPropertyLoading(true);
      const response = await searchProperties(searchTerm, 1, 10);
      setProperties(response.data || []);
    } catch (error) {
      console.error('Failed to load properties:', error);
      setProperties([]);
    } finally {
      setPropertyLoading(false);
    }
  }, []);
  
  const handlePropertySearch = useCallback((searchTerm) => {
    setPropertySearchTerm(searchTerm);
    loadProperties(searchTerm);
  }, [loadProperties]);
  
  const handlePropertySelect = useCallback((property) => {
    setSelectedProperty(property);
    setPropertySearchTerm('');
    setProperties([]);
  }, []);
  
  // Load initial properties on mount
  useEffect(() => {
    loadProperties();
  }, [loadProperties]);
  
  // Evidence types for heat dots
  const evidenceTypes = {
    queryLogs: { color: '#3b82f6', count: 847 },
    ctr: { color: '#10b981', count: 234 },
    competitor: { color: '#f59e0b', count: 156 },
    nlp: { color: '#8b5cf6', count: 423 }
  };
  
  // Convert affinities to dropdown options
  const affinityOptions = affinities?.map(affinity => ({
    value: affinity.id,
    label: affinity.name
  })) || [];
  
  // Utility functions
  const getColorByType = (type) => {
    switch (type) {
      case 'primary': return '#3b82f6';
      case 'secondary': return '#10b981';
      case 'tertiary': return '#f59e0b';
      default: return '#6b7280';
    }
  };
  
  const getCTRLift = (percentage) => {
    if (percentage >= 80) return '+12%';
    if (percentage >= 60) return '+8%';
    if (percentage >= 40) return '+5%';
    return '+2%';
  };
  
  const calculateReadability = (text) => {
    // Simple readability calculation (mock)
    const words = text.split(' ').length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    return Math.min(12, Math.max(6, avgWordsPerSentence * 0.8));
  };
  
  const showToastMessage = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Helper function to get display value (handles both string and object values)
  const getDisplayValue = (value) => {
    if (typeof value === 'object' && value !== null && value.label) {
      return value.label;
    }
    return value || '';
  };
  
  // Helper function to get raw value for comparison (handles both string and object values)
  const getRawValue = (value) => {
    if (typeof value === 'object' && value !== null && value.value) {
      return value.value;
    }
    return value || '';
  };

  // Get primary concept based on selected affinity
  const getPrimaryConcept = (affinityId) => {
    // Find the selected affinity from the actual affinities data
    const selectedAffinity = affinities?.find(affinity => affinity.id === affinityId);
    
    if (selectedAffinity) {
      // Use the actual affinity data to create the primary concept
      return {
        id: selectedAffinity.id,
        name: selectedAffinity.name,
        relevance_percentage: Math.round(selectedAffinity.confidence_score * 100) || 85,
        type: 'primary',
        description: selectedAffinity.description || `Primary concept for ${selectedAffinity.name}`,
        category: selectedAffinity.category || 'amenity'
      };
    }
    
    // Fallback to default swimming pool concept if no affinity found
    return {
      id: 'swimming-pool',
      name: 'Swimming Pool',
      relevance_percentage: 80,
      type: 'primary',
      description: 'Standard pool amenity concept',
      category: 'amenity'
    };
  };

  // Generate related concepts dynamically based on primary concept
  const generateRelatedConcepts = (primaryConceptId) => {
    // If no primary concept is selected, return empty array
    if (!primaryConceptId || primaryConceptId === 'none') {
      return [];
    }
    
    // Find the primary concept in the affinities data
    const primaryConcept = affinities?.find(affinity => affinity.id === primaryConceptId);
    
    if (!primaryConcept) {
      console.log('⚠️ Primary concept not found in affinities data:', primaryConceptId);
      return [];
    }
    
    // Get other affinities that could be related to the primary concept
    const otherAffinities = affinities?.filter(affinity => affinity.id !== primaryConceptId) || [];
    
    if (otherAffinities.length === 0) {
      console.log('⚠️ No other affinities found to generate related concepts');
      return [];
    }
    
    // Generate related concepts based on category similarity, confidence, and other factors
    const relatedConcepts = otherAffinities
      .map(affinity => {
        // Calculate relationship strength based on various factors
        let relationshipScore = 0;
        let relationshipType = 'tertiary';
        
        // Category similarity bonus
        if (affinity.category === primaryConcept.category) {
          relationshipScore += 0.3;
        }
        
        // Confidence score factor
        relationshipScore += (affinity.confidence_score || 0.5) * 0.4;
        
        // Name/description similarity (simple keyword matching)
        const primaryKeywords = (primaryConcept.name + ' ' + (primaryConcept.description || '')).toLowerCase().split(/\s+/);
        const affinityKeywords = (affinity.name + ' ' + (affinity.description || '')).toLowerCase().split(/\s+/);
        const commonKeywords = primaryKeywords.filter(word => affinityKeywords.includes(word) && word.length > 2);
        relationshipScore += commonKeywords.length * 0.1;
        
        // Random factor to add some variety
        relationshipScore += Math.random() * 0.2;
        
        // Determine relationship type based on score
        if (relationshipScore > 0.7) {
          relationshipType = 'secondary';
        } else if (relationshipScore > 0.5) {
          relationshipType = 'tertiary';
        } else {
          relationshipType = 'tertiary';
        }
        
        return {
          id: affinity.id,
          name: affinity.name,
          relationship_type: relationshipType,
          relevance_weight: Math.round(relationshipScore * 100),
          evidence_score: Math.round((affinity.confidence_score || 0.5) * 100),
          type: relationshipType,
          relationship: 'related',
          relevance_percentage: Math.round(relationshipScore * 100),
          relationshipScore // Keep for sorting
        };
      })
      .sort((a, b) => b.relationshipScore - a.relationshipScore) // Sort by relationship strength
      .slice(0, 6) // Limit to top 6 related concepts
      .map(concept => {
        // Remove the sorting score from the final object
        const { relationshipScore, ...cleanConcept } = concept;
        return cleanConcept;
      });
    
    console.log('🎯 Generated', relatedConcepts.length, 'related concepts for', primaryConcept.name, ':', relatedConcepts.map(c => c.name));
    
    return relatedConcepts;
  };
  
  // Get current primary concept based on configuration
  const primary_concept = getPrimaryConcept(configuration.primaryConcept);
  
  // Generate base related concepts for the primary concept (memoized to prevent infinite re-renders)
  const baseRelatedConcepts = useMemo(() => {
    if (!configuration.primaryConcept) return [];
    const concepts = generateRelatedConcepts(configuration.primaryConcept);
    console.log('🎯 Generated related concepts for', configuration.primaryConcept, ':', concepts.map(c => c.name));
    return concepts;
  }, [configuration.primaryConcept]);
  
  // Memoize similarity calculations to avoid recalculating on every render
  const relatedConcepts = useMemo(() => {
    if (!configuration.primaryConcept || !baseRelatedConcepts.length) return [];
    const primaryConceptId = configuration.primaryConcept;
    
    console.log('🔄 Calculating similarities for primary concept:', primaryConceptId);
    
    return baseRelatedConcepts.map(concept => {
      // Calculate similarities for all dimensions
      const calculatedSimilarities = {};
      const dimensions = ['semantic', 'taxonomic', 'attribute', 'behavioral', 'content', 'external', 'temporal', 'statistical', 'business'];
      
      dimensions.forEach(dimension => {
        const similarity = calculateSimilarity(primaryConceptId, concept.id, dimension);
        calculatedSimilarities[dimension] = {
          score: similarity.score,
          confidence: similarity.confidence,
          evidence: similarity.evidence
        };
      });
      
      // Calculate overall similarity (all dimensions)
      const overallSimilarity = calculateSimilarity(primaryConceptId, concept.id, 'all');
      calculatedSimilarities.all = {
        score: overallSimilarity.score,
        confidence: overallSimilarity.confidence,
        evidence: overallSimilarity.evidence
      };
      
      console.log(`✅ Calculated similarities for ${concept.name}:`, {
        semantic: calculatedSimilarities.semantic.score,
        behavioral: calculatedSimilarities.behavioral.score,
        overall: calculatedSimilarities.all.score
      });
      
      return {
        ...concept,
        similarity_scores: calculatedSimilarities
      };
    });
  }, [configuration.primaryConcept, baseRelatedConcepts]);
  
  // Dynamic secondary/tertiary assignment based on selected similarity algorithm
  const { secondaryConcept, tertiaryConcept, sortedRelatedConcepts } = useMemo(() => {
    if (!relatedConcepts.length) return { secondaryConcept: null, tertiaryConcept: null, sortedRelatedConcepts: [] };
    
    // Sort concepts by the selected similarity dimension score (highest first)
    const sorted = [...relatedConcepts].sort((a, b) => {
      const scoreA = a.similarity_scores[selectedSimilarityStrategy]?.score || 0;
      const scoreB = b.similarity_scores[selectedSimilarityStrategy]?.score || 0;
      return scoreB - scoreA;
    });
    
    // Assign secondary (highest score) and tertiary (second highest)
    const secondary = sorted[0] ? { ...sorted[0], conceptType: 'secondary' } : null;
    const tertiary = sorted[1] ? { ...sorted[1], conceptType: 'tertiary' } : null;
    
    // Mark all concepts with their dynamic types for the related concepts list
    const sortedWithTypes = sorted.map((concept, index) => ({
      ...concept,
      conceptType: index === 0 ? 'secondary' : index === 1 ? 'tertiary' : 'related'
    }));
    
    console.log('🎯 Dynamic assignment based on', selectedSimilarityStrategy, 'similarity:', {
      secondary: secondary?.name,
      tertiary: tertiary?.name,
      scores: sorted.map(c => ({ name: c.name, score: c.similarity_scores[selectedSimilarityStrategy]?.score }))
    });
    
    return {
      secondaryConcept: secondary,
      tertiaryConcept: tertiary,
      sortedRelatedConcepts: sortedWithTypes
    };
  }, [relatedConcepts, selectedSimilarityStrategy]);
  
  // Debug: Log affinities data
  console.log('CRI - Affinities loaded:', affinities?.length || 0, 'affinities');
  console.log('CRI - Affinity options:', affinityOptions.length, 'options');
  if (affinities?.length > 0) {
    console.log('CRI - First few affinities:', affinities.slice(0, 5));
  }
  
  // Sample generated content with tone adaptation
  const getGeneratedSnippet = (tone) => {
    const snippets = {
      'Luxury': "Experience the ultimate in luxury relaxation at our rooftop infinity pool with panoramic city views. Unwind at our world-class spa featuring rejuvenating treatments, then enjoy cocktails at our exclusive swim-up bar while soaking in the sun terrace ambiance.",
      'Family': "Create unforgettable family memories at our kid-friendly pool area with shallow sections and water features. Parents can relax while children play safely in our supervised splash zone, complete with poolside snacks and family-friendly activities.",
      'Value': "Enjoy our well-maintained pool facilities without breaking the bank. Take advantage of complimentary poolside amenities, free towel service, and budget-friendly refreshments available throughout your stay.",
      'Business': "Maximize your productivity with our business-friendly pool environment. Network with fellow professionals in our quiet poolside work areas, complete with WiFi access and meeting spaces for informal discussions."
    };
    return snippets[tone] || snippets['Family'];
  };
  
  const qualityScore = 92;
  
  // Handle weight changes
  const handleWeightChange = (type, value) => {
    const newWeights = { ...weights, [type]: parseInt(value) };
    
    // Ensure weights add up to 100%
    const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
    if (total <= 100) {
      setWeights(newWeights);
    }
  };
  
  // Handle tone change with snippet update
  const handleToneChange = (newTone) => {
    setConfiguration(prev => ({ ...prev, toneStyle: newTone }));
    const newSnippet = getGeneratedSnippet(newTone);
    const newReadability = calculateReadability(newSnippet);
    setReadabilityScore(newReadability);
    
    // Update accessibility checks
    setAccessibilityChecks(prev => ({
      ...prev,
      readingLevel: newReadability <= 10
    }));
    
    showToastMessage('Tone updated successfully', 'success');
  };
  
  // Auto-save functionality (debounced to prevent excessive saves)
  useEffect(() => {
    if (Object.keys(generatedVariants).length === 0) return; // Don't auto-save empty variants
    
    const autoSave = setTimeout(() => {
      showToastMessage('Auto-saved', 'info');
    }, 10000); // Increased delay to reduce frequency
    
    return () => clearTimeout(autoSave);
  }, [generatedVariants]);

  // Generate content variants based on selected concepts and destination insights
  const generateContentVariants = (primaryConcept, secondaryConcept, tertiaryConcept, weights, destinationInsights = {}) => {
    if (!primaryConcept) return {};
    
    const primaryConceptData = getPrimaryConcept(primaryConcept);
    const variants = {};
    
    // Helper function to get selected insights text
    const getInsightsText = (category, insights) => {
      if (!insights || insights.length === 0) return '';
      const config = destinationInsightsConfig[category];
      if (!config) return '';
      
      return insights.map(insightId => {
        const option = config.options.find(opt => opt.id === insightId);
        return option ? option.label : '';
      }).filter(Boolean);
    };
    
    // Collect all selected insights for content enhancement
    const allSelectedInsights = [];
    Object.entries(destinationInsights).forEach(([category, insights]) => {
      const insightTexts = getInsightsText(category, insights);
      allSelectedInsights.push(...insightTexts);
    });
    
    // Generate 3 different variants with different emphasis
    const variantConfigs = [
      { id: 'A', focus: 'primary', style: 'descriptive' },
      { id: 'B', focus: 'balanced', style: 'persuasive' },
      { id: 'C', focus: 'benefits', style: 'concise' }
    ];
    
    variantConfigs.forEach(config => {
      let content = '';
      let evidence = [];
      
      // Generate base content based on variant focus
      if (config.focus === 'primary') {
        content = `Experience the luxury of our ${primaryConceptData.name.toLowerCase()}. ${primaryConceptData.description} This premium amenity offers unparalleled relaxation and enjoyment for guests of all ages.`;
        if (secondaryConcept) {
          content += ` Enhance your stay with our ${secondaryConcept.name.toLowerCase()} and other complementary features.`;
        }
        
        // Add destination insights for descriptive variant
        if (destinationInsights.destinationNuances?.length > 0) {
          const nuances = getInsightsText('destinationNuances', destinationInsights.destinationNuances);
          if (nuances.length > 0) {
            content += ` Located in an area renowned for its ${nuances.slice(0, 2).join(' and ').toLowerCase()}.`;
          }
        }
        
      } else if (config.focus === 'balanced') {
        content = `Discover the perfect blend of luxury and comfort with our ${primaryConceptData.name.toLowerCase()}. `;
        if (secondaryConcept) {
          content += `Enjoy ${secondaryConcept.name.toLowerCase()} while taking advantage of our ${primaryConceptData.name.toLowerCase()}. `;
        }
        if (tertiaryConcept) {
          content += `Additional amenities like ${tertiaryConcept.name.toLowerCase()} complete your perfect getaway.`;
        }
        
        // Add known for insights for balanced variant
        if (destinationInsights.knownFor?.length > 0) {
          const knownFor = getInsightsText('knownFor', destinationInsights.knownFor);
          if (knownFor.length > 0) {
            content += ` This destination is celebrated for ${knownFor.slice(0, 2).join(' and ').toLowerCase()}.`;
          }
        }
        
      } else {
        content = `Premium ${primaryConceptData.name.toLowerCase()} available. `;
        const relatedConcepts = [secondaryConcept, tertiaryConcept].filter(Boolean);
        if (relatedConcepts.length > 0) {
          content += `Includes ${relatedConcepts.slice(0, 2).map(c => c.name.toLowerCase()).join(' and ')}.`;
        }
        
        // Add accessibility/transportation for concise variant
        const accessibilityFeatures = getInsightsText('accessibility', destinationInsights.accessibility || []);
        const transportationFeatures = getInsightsText('transportation', destinationInsights.transportation || []);
        
        if (accessibilityFeatures.length > 0 || transportationFeatures.length > 0) {
          const features = [...accessibilityFeatures.slice(0, 1), ...transportationFeatures.slice(0, 1)];
          if (features.length > 0) {
            content += ` Features ${features.join(' and ').toLowerCase()}.`;
          }
        }
        
        content += ` Book now for the ultimate experience.`;
      }
      
      // Generate evidence based on concepts and destination insights
      evidence = [
        { type: 'Primary Concept', description: `${primaryConceptData.name} relevance: ${primaryConceptData.relevance_percentage}%` }
      ];
      
      if (secondaryConcept) {
        evidence.push({
          type: 'Secondary', 
          description: `${secondaryConcept.name} similarity: ${Math.round(secondaryConcept.similarity_scores?.[selectedSimilarityStrategy]?.score * 100 || 0)}%`
        });
      }
      
      if (tertiaryConcept) {
        evidence.push({
          type: 'Tertiary', 
          description: `${tertiaryConcept.name} similarity: ${Math.round(tertiaryConcept.similarity_scores?.[selectedSimilarityStrategy]?.score * 100 || 0)}%`
        });
      }
      
      // Add destination insights to evidence
      if (allSelectedInsights.length > 0) {
        evidence.push({
          type: 'Destination Insights',
          description: `${allSelectedInsights.length} insights selected: ${allSelectedInsights.slice(0, 3).join(', ')}${allSelectedInsights.length > 3 ? '...' : ''}`
        });
      }
      
      // Generate quality scores based on content, weights, and destination insights
      const primaryWeight = weights.primary / 100;
      const secondaryWeight = weights.secondary / 100;
      const tertiaryWeight = weights.tertiary / 100;
      
      // Factor in destination insights for quality boost
      const insightsBonus = Math.min(10, allSelectedInsights.length * 1.5); // Up to 10 point bonus
      const baseQuality = 75 + (primaryWeight * 15) + (secondaryWeight * 8) + (tertiaryWeight * 2) + insightsBonus;
      
      variants[config.id] = {
        content,
        evidence,
        quality: {
          overall: Math.min(95, Math.round(baseQuality + Math.random() * 5)),
          readability: Math.round(80 + Math.random() * 15),
          keywordDensity: Math.round(70 + Math.random() * 20),
          lengthScore: Math.round(75 + Math.random() * 20),
          complianceScore: Math.round(85 + Math.random() * 10)
        },
        tokens: [
          { placeholder: '{PROPERTY_NAME}', value: 'Luxury Resort' },
          { placeholder: '{SEASON}', value: 'Summer' },
          { placeholder: '{BOOKING_URL}', value: '/book-now' }
        ]
      };
    });
    
    return variants;
  };
  
  // Auto-generate content variants when concepts, weights, or insights change (stabilized dependencies)
  useEffect(() => {
    if (configuration.primaryConcept && (secondaryConcept || tertiaryConcept)) {
      console.log('🔄 Auto-generating content variants for:', configuration.primaryConcept, {
        secondary: secondaryConcept?.name,
        tertiary: tertiaryConcept?.name,
        selectedSimilarityStrategy,
        totalInsights: getTotalSelectedInsights()
      });
      const newVariants = generateContentVariants(configuration.primaryConcept, secondaryConcept, tertiaryConcept, weights, selectedDestinationInsights);
      setGeneratedVariants(newVariants);
    } else {
      // Clear variants if no primary concept selected
      setGeneratedVariants({});
    }
  }, [configuration.primaryConcept, secondaryConcept?.id, tertiaryConcept?.id, weights.primary, weights.secondary, weights.tertiary, selectedSimilarityStrategy, selectedDestinationInsights]);
  
  // Handle destination insights selection
  const handleDestinationInsightToggle = (category, insightId) => {
    setSelectedDestinationInsights(prev => {
      const currentInsights = prev[category] || [];
      const isSelected = currentInsights.includes(insightId);
      
      return {
        ...prev,
        [category]: isSelected 
          ? currentInsights.filter(id => id !== insightId)
          : [...currentInsights, insightId]
      };
    });
  };
  
  // Get selected insights count for a category
  const getSelectedInsightsCount = (category) => {
    return selectedDestinationInsights[category]?.length || 0;
  };
  
  // Get total selected insights count
  const getTotalSelectedInsights = () => {
    return Object.values(selectedDestinationInsights).reduce((total, insights) => total + insights.length, 0);
  };

  // Handle primary concept selection
  const handlePrimaryConceptChange = (selectedOption) => {
    console.log('🎯 Primary concept changed to:', selectedOption);
    setSelectedPrimaryConcept(selectedOption.value);
    setConfiguration(prev => ({
      ...prev,
      primaryConcept: selectedOption.value
    }));
    showToastMessage('Primary concept updated', 'success');
  };

  // Handle View Details button click
  const handleViewDetails = () => {
    setShowPrimaryDetails(!showPrimaryDetails);
  };

  // Update readability when generated variants change (not on every tone change)
  useEffect(() => {
    if (Object.keys(generatedVariants).length > 0) {
      const snippet = getGeneratedSnippet(configuration.toneStyle);
      const score = calculateReadability(snippet);
      setReadabilityScore(score);
    }
  }, [generatedVariants, configuration.toneStyle]);

  // Destination Insights Accordion Component
  const DestinationInsightsAccordion = () => {
    // State for accordion sections (multiple can be expanded)
    const [expandedSections, setExpandedSections] = useState({
      'related-concepts': true, // Start with Related Concepts expanded
      'destination-insights': false,
      'last-mile-insights': false
    });
    
    // State for individual category expansion within sections
    const [expandedCategories, setExpandedCategories] = useState({
      // Start with first category of each type expanded
      'destinationNuances': true,
      'hotelNuances': false,
      'vacationRentalNuances': false,
      'knownFor': false,
      'photogenicSpots': false,
      'landmarks': false,
      'themes': false,
      'localInsiderTips': false,
      'accessibility': true,
      'transportation': false
    });
    
    const toggleSection = (sectionId) => {
      setExpandedSections(prev => ({
        ...prev,
        [sectionId]: !prev[sectionId]
      }));
    };
    
    const toggleCategory = (categoryKey) => {
      setExpandedCategories(prev => ({
        ...prev,
        [categoryKey]: !prev[categoryKey]
      }));
    };
    
    const destinationCategories = [
      'destinationNuances', 'hotelNuances', 'vacationRentalNuances', 
      'knownFor', 'photogenicSpots', 'landmarks', 'themes', 'localInsiderTips'
    ];
    
    const lastMileCategories = ['accessibility', 'transportation'];
    
    const renderInsightCheckbox = (category, option) => {
      const isSelected = selectedDestinationInsights[category]?.includes(option.id);
      
      return (
        <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            id={`${category}-${option.id}`}
            checked={isSelected}
            onChange={() => handleDestinationInsightToggle(category, option.id)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            <label 
              htmlFor={`${category}-${option.id}`}
              className="block text-sm font-medium text-gray-900 cursor-pointer"
            >
              {option.label}
            </label>
            <p className="text-xs text-gray-500 mt-1">{option.description}</p>
          </div>
        </div>
      );
    };
    
    const renderInsightCategory = (categoryKey) => {
      const category = destinationInsightsConfig[categoryKey];
      const selectedCount = getSelectedInsightsCount(categoryKey);
      const Icon = category.icon;
      
      return (
        <div key={categoryKey} className="border border-gray-200 rounded-lg mb-4">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">{category.label}</h4>
              </div>
              {selectedCount > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {selectedCount} selected
                </span>
              )}
            </div>
          </div>
          <div className="p-2">
            {category.options.map(option => renderInsightCheckbox(categoryKey, option))}
          </div>
        </div>
      );
    };
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Accordion Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Context & Insights</h3>
            {getTotalSelectedInsights() > 0 && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {getTotalSelectedInsights()} insights selected
              </span>
            )}
          </div>
        </div>
        
        {/* Accordion Sections */}
        <div className="divide-y divide-gray-200">
          {/* Related Concepts Section */}
          <div>
            <button
              onClick={() => toggleSection('related-concepts')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FiLink className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Related Concepts</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {sortedRelatedConcepts.length} concepts
                </span>
                {expandedSections['related-concepts'] ? (
                  <FiChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>
            
            {expandedSections['related-concepts'] && (
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col items-end">
                    <div className="text-xs text-black italic mb-1">Insight Dimensions</div>
                    <SimilarityStrategySelector 
                      selectedStrategy={selectedSimilarityStrategy}
                      onStrategyChange={setSelectedSimilarityStrategy}
                    />
                  </div>
                </div>
                
                {/* Similarity Dimension Info */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    {React.createElement(similarityDimensions[selectedSimilarityStrategy].icon, {
                      className: "w-4 h-4",
                      style: { color: similarityDimensions[selectedSimilarityStrategy].color }
                    })}
                    <span className="text-sm font-medium text-gray-700">
                      {similarityDimensions[selectedSimilarityStrategy].label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {selectedSimilarityStrategy === 'all' 
                      ? 'Showing average similarity across all dimensions'
                      : `Filtering by ${similarityDimensions[selectedSimilarityStrategy].label.toLowerCase()} similarity`
                    }
                  </p>
                </div>
                
                <div className="space-y-3 overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2">
                  {configuration.primaryConcept ? (
                    sortedRelatedConcepts.map((concept, index) => {
                      const getConceptWeight = () => {
                        if (concept.conceptType === 'secondary') return weights.secondary;
                        if (concept.conceptType === 'tertiary') return weights.tertiary;
                        return weights.tertiary;
                      };
                      
                      const getWeightHandler = () => {
                        if (concept.conceptType === 'secondary') {
                          return (value) => handleWeightChange('secondary', value);
                        }
                        if (concept.conceptType === 'tertiary') {
                          return (value) => handleWeightChange('tertiary', value);
                        }
                        return (value) => handleWeightChange('tertiary', value);
                      };
                      
                      return (
                        <RelatedConceptCard 
                          key={concept.id} 
                          concept={concept} 
                          selectedSimilarityStrategy={selectedSimilarityStrategy}
                          weight={getConceptWeight()}
                          onWeightChange={getWeightHandler()}
                        />
                      );
                    })
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiLink className="w-6 h-6 text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">No Related Concepts Available</h4>
                      <p className="text-sm text-gray-500">
                        Related concepts will appear here once you select a primary concept.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Destination Insights Section */}
          <div>
            <button
              onClick={() => toggleSection('destination-insights')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FiMapPin className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Destination Insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {destinationCategories.reduce((total, cat) => total + getSelectedInsightsCount(cat), 0)} selected
                </span>
                {expandedSections['destination-insights'] ? (
                  <FiChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>
            
            {expandedSections['destination-insights'] && (
              <div className="px-4 pb-4">
                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                  {destinationCategories.map(categoryKey => renderInsightCategory(categoryKey))}
                </div>
              </div>
            )}
          </div>
          
          {/* Last Mile Insights Section */}
          <div>
            <button
              onClick={() => toggleSection('last-mile-insights')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FiTruck className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Last Mile Insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {lastMileCategories.reduce((total, cat) => total + getSelectedInsightsCount(cat), 0)} selected
                </span>
                {expandedSections['last-mile-insights'] ? (
                  <FiChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>
            
            {expandedSections['last-mile-insights'] && (
              <div className="px-4 pb-4">
                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                  {lastMileCategories.map(categoryKey => renderInsightCategory(categoryKey))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  const ContextualBanner = () => {
    const isNonDefault = getRawValue(configuration.surfaceType) !== 'Search Results Page' || 
                        getRawValue(configuration.language) !== 'English (US)' || 
                        getRawValue(configuration.toneStyle) !== 'Family';
    
    return (
      <div className={`w-full px-6 py-3 border-b transition-colors ${
        isNonDefault ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <FiTarget className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Surface:</span>
              <span className="text-sm text-gray-900">{getDisplayValue(configuration.surfaceType)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiGlobe className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Language:</span>
              <span className="text-sm text-gray-900">{getDisplayValue(configuration.language)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiUser className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tone:</span>
              <span className="text-sm text-gray-900">{getDisplayValue(configuration.toneStyle)}</span>
            </div>
          </div>
          {isNonDefault && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-blue-600 font-medium">Custom Configuration</span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Enhanced Variant Display Component with Edit Mode
  const VariantDisplay = ({ variant, variantId }) => {
    const [editMode, setEditMode] = useState(null); // 'evidence', 'tokens', or null
    const [localEvidence, setLocalEvidence] = useState([]);
    const [localTokens, setLocalTokens] = useState([]);
    const [isRegenerating, setIsRegenerating] = useState(false);
    
    // Initialize local state when variant changes
    useEffect(() => {
      if (variant) {
        setLocalEvidence(variant.evidence || []);
        setLocalTokens(variant.tokens || []);
      }
    }, [variant]);
    
    if (!variant) {
      // Only show spinner if primary concept is selected and generation is in progress
      if (configuration.primaryConcept && isGenerating) {
        return (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <FiRefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p className="text-sm">Generating content...</p>
            </div>
          </div>
        );
      }
      
      // Show placeholder when no primary concept is selected
      return (
        <div className="flex items-center justify-center h-32 text-gray-400">
          <div className="text-center">
            <FiEdit3 className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Select a primary concept to generate content</p>
          </div>
        </div>
      );
    }

    // Handler functions for edit mode
    const handleEvidenceAdd = () => {
      const newEvidence = {
        id: `E${localEvidence.length + 1}`,
        sentence: 'New evidence source',
        source: 'manual',
        confidence: 'medium'
      };
      setLocalEvidence([...localEvidence, newEvidence]);
    };
    
    const handleEvidenceRemove = (index) => {
      setLocalEvidence(localEvidence.filter((_, i) => i !== index));
    };
    
    const handleTokenUpdate = (index, newValue) => {
      const updatedTokens = [...localTokens];
      updatedTokens[index] = { ...updatedTokens[index], value: newValue };
      setLocalTokens(updatedTokens);
    };
    
    const handleRegenerate = async () => {
      setIsRegenerating(true);
      // Simulate regeneration delay
      setTimeout(() => {
        setIsRegenerating(false);
        showToastNotification('Content regenerated successfully', 'success');
      }, 2000);
    };
    
    const handleCopy = () => {
      navigator.clipboard.writeText(variant.content);
      showToastNotification('Content copied to clipboard', 'success');
    };
    
    const handleUseThis = () => {
      showToastNotification('Content saved for use', 'success');
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        {/* Header with Surface Type and Generation Time */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{variant.surface_type || 'Property Detail Page'} • Generated {new Date().toLocaleTimeString()}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditMode(editMode === 'evidence' ? null : 'evidence')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                editMode === 'evidence' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📊 Evidence
            </button>
            <button
              onClick={() => setEditMode(editMode === 'tokens' ? null : 'tokens')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                editMode === 'tokens' 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🏷️ Tokens
            </button>
          </div>
        </div>
        
        {/* Quality Metrics Row */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center space-x-6 text-sm">
            <div>
              <span className="text-gray-600">Readability:</span>
              <span className="ml-2 font-medium text-gray-400">
                {variant.quality?.readability ? `${variant.quality.readability}%` : '--'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Evidence:</span>
              <span className="ml-2 font-medium text-gray-400">
                {variant.evidence && variant.evidence.length > 0 ? `(${variant.evidence.length})` : '--'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Keywords:</span>
              <span className="ml-2 font-medium text-gray-400">
                {variant.tokens && variant.tokens.length > 0 ? `(${variant.tokens.length})` : '--'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Content Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm leading-relaxed text-gray-800">
            {variant.content || 'Generated content will appear here...'}
          </div>
        </div>
        
        {/* Edit Mode Content */}
        {editMode === 'evidence' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-blue-700">Evidence Sources</h4>
              <span className="text-xs text-blue-600">{localEvidence.length} pieces of evidence</span>
            </div>
            
            <div className="space-y-2">
              {localEvidence.map((evidence, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          E{index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          "{evidence.sentence || evidence.description || (typeof evidence === 'string' ? evidence : 'Evidence source')}"
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Source: {evidence.source || 'similarity_analysis'} • Confidence: {evidence.confidence || 'high'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEvidenceRemove(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleEvidenceAdd}
              className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
            >
              + Add Evidence Source
            </button>
          </div>
        )}
        
        {editMode === 'tokens' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-purple-700">Editable Tokens</h4>
              <span className="text-xs text-purple-600">{localTokens.length} editable</span>
            </div>
            
            <div className="space-y-2">
              {localTokens.map((token, index) => (
                <div key={index} className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-600 font-mono text-sm min-w-0 flex-shrink-0">
                      {token.placeholder}
                    </span>
                    <input
                      type="text"
                      value={token.value}
                      onChange={(e) => handleTokenUpdate(index, e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={!token.editable}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiCopy className="w-4 h-4" />
            <span className="text-sm">Copy</span>
          </button>
          
          <button
            onClick={handleUseThis}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiCheck className="w-4 h-4" />
            <span className="text-sm">Use This</span>
          </button>
          
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span className="text-sm">Regenerate</span>
          </button>
        </div>
      </div>
    );
  };

  // Content Generation Handler
  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      // Prepare concepts array with primary + related concepts
      const concepts = [
        primary_concept,
        ...relatedConcepts.slice(0, 3) // Limit to top 3 related concepts
      ];
      
      // Extract evidence from similarity analysis
      const evidence = relatedConcepts.flatMap(concept => {
        const similarityData = concept.similarity_scores?.[selectedSimilarityStrategy];
        return similarityData?.evidence?.map(item => ({
          id: `${concept.id}-${item.type}`,
          type: item.type,
          description: item.description,
          confidence: similarityData.confidence,
          conceptId: concept.id
        })) || [];
      });
      
      // Generate snippets using the service
      const result = await snippetGenerator.generateSnippets({
        concepts,
        tone: getDisplayValue(configuration.toneStyle),
        surface: getDisplayValue(configuration.surfaceType),
        weights,
        evidence
      });
      
      if (result.success) {
        // Update generated variants state
        const variantMap = {};
        result.variants.forEach(variant => {
          variantMap[variant.id] = variant;
        });
        setGeneratedVariants(variantMap);
        
        // Show success toast
        setShowToast(true);
        setToastMessage('Content generated successfully!');
        setToastType('success');
        setTimeout(() => setShowToast(false), 3000);
        
        console.log('Generated content variants:', result.variants);
      } else {
        throw new Error(result.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Content generation error:', error);
      setGenerationError(error.message);
      setToastMessage(`Generation failed: ${error.message}`);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper function to show toast notifications
  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Main component return statement
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header with Contextual Banner */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <ContextualBanner />
        
        {/* Main Header */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiTarget className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Concept Relationship Panel</h1>
                  <p className="text-sm text-gray-500">Advanced similarity analytics & content strategy</p>
                </div>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowConfigPanel(!showConfigPanel)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showConfigPanel 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiSettings className="w-4 h-4 mr-2 inline" />
                Setup
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                <FiSave className="w-4 h-4 mr-2 inline" />
                Save State
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Main Content Area - Full Width */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <div className="grid grid-cols-12 gap-6 h-full">
              
              {/* Setup Configuration Section */}
              {showConfigPanel && (
                <div className="col-span-12 mb-6">
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Setup Configuration</h3>
                      <button 
                        onClick={() => setShowConfigPanel(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Primary Concept - FIRST STEP */}
                      <div className="relative">
                        <div className="absolute -left-3 top-3 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div className="ml-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Concept</label>
                          <SearchableDropdown
                            options={affinityOptions}
                            value={configuration.primaryConcept}
                            onChange={handlePrimaryConceptChange}
                            placeholder="Select primary concept"
                          />
                        </div>
                      </div>
                      
                      {/* Surface Type */}
                      <div className="relative">
                        <div className="absolute -left-3 top-3 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div className="ml-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Surface Type</label>
                          <SearchableDropdown
                            options={[
                              { value: 'property-detail-page', label: 'Property Detail Page' },
                              { value: 'search-results-page', label: 'Search Results Page' },
                              { value: 'email-subject', label: 'Email Subject' },
                              { value: 'social-media', label: 'Social Media' },
                              { value: 'meta-description', label: 'Meta Description' }
                            ]}
                            value={configuration.surfaceType}
                            onChange={(value) => setConfiguration(prev => ({ ...prev, surfaceType: value }))}
                            placeholder="Select surface type"
                          />
                        </div>
                      </div>
                      
                      {/* Language */}
                      <div className="relative">
                        <div className="absolute -left-3 top-3 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div className="ml-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                          <SearchableDropdown
                            options={[
                              { value: 'english-us', label: 'English (US)' },
                              { value: 'english-uk', label: 'English (UK)' },
                              { value: 'spanish', label: 'Spanish' },
                              { value: 'french', label: 'French' },
                              { value: 'german', label: 'German' }
                            ]}
                            value={configuration.language}
                            onChange={(value) => setConfiguration(prev => ({ ...prev, language: value }))}
                            placeholder="Select language"
                          />
                        </div>
                      </div>
                      
                      {/* Property Selector */}
                      <div className="relative">
                        <div className="absolute -left-3 top-3 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <div className="ml-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Focal Property</label>
                          <div className="relative">
                            <div className="relative">
                              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                value={propertySearchTerm}
                                onChange={(e) => handlePropertySearch(e.target.value)}
                                placeholder="Search properties..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            {propertySearchTerm && properties.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {properties.map((property) => (
                                  <div
                                    key={property.id}
                                    onClick={() => handlePropertySelect(property)}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="text-lg">{property.icon || '🏨'}</div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{property.name}</div>
                                        <div className="text-xs text-gray-500 truncate flex items-center">
                                          <FiMapPin className="h-3 w-3 mr-1" />
                                          {property.location || property.address}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {selectedProperty && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center space-x-3">
                                <div className="text-lg">{selectedProperty.icon || '🏨'}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-blue-900">{selectedProperty.name}</div>
                                  <div className="text-xs text-blue-600 flex items-center">
                                    <FiMapPin className="h-3 w-3 mr-1" />
                                    {selectedProperty.location || selectedProperty.address}
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSelectedProperty(null)}
                                  className="text-blue-400 hover:text-blue-600"
                                >
                                  <FiX className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Primary Concept */}
              <div className="col-span-12 lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Primary Concept</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-red-400">•</span>
                      <span className="text-yellow-400">•</span>
                      <span className="text-green-400">•</span>
                      <span className="text-blue-400">•</span>
                    </div>
                  </div>
                  
                  {configuration.primaryConcept ? (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-sm text-white font-bold">{getCTRLift(primary_concept.relevance_percentage)}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg">{primary_concept.name}</h4>
                          <p className="text-sm text-gray-600">{primary_concept.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">{primary_concept.relevance_percentage}%</div>
                              <div className="text-xs text-gray-500">Relevance</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Primary Concept Weight Slider */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Content Influence</label>
                            <span className="text-sm font-bold text-blue-600">{weights.primary}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="80"
                            value={weights.primary}
                            onChange={(e) => handleWeightChange('primary', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Controls how much this concept influences generated content variants
                          </p>
                        </div>
                        <button 
                          onClick={handleViewDetails}
                          className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors border border-blue-200"
                        >
                          {showPrimaryDetails ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiTarget className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">No Primary Concept Selected</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Choose a primary concept from the Setup Configuration above to get started.
                      </p>
                      <div className="inline-flex items-center text-sm text-blue-600">
                        <FiArrowUp className="w-4 h-4 mr-1" />
                        <span>Select Primary Concept in Step 1</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Primary Concept Details Panel */}
                {showPrimaryDetails && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Primary Concept Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Concept ID:</span>
                        <span className="text-blue-900">{primary_concept?.id || configuration.primaryConcept}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Category:</span>
                        <span className="text-blue-900">{primary_concept?.category || 'Amenity'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Dominance Weight:</span>
                        <span className="text-blue-900">{weights.primary}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Similarity Strategy:</span>
                        <span className="text-blue-900">{selectedSimilarityStrategy === 'all' ? 'All Dimensions' : selectedSimilarityStrategy}</span>
                      </div>
                      <div className="mt-3">
                        <span className="text-blue-700">Description:</span>
                        <p className="text-blue-900 mt-1">{primary_concept?.description || 'Standard pool amenity concept for property listings and content generation.'}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Fixed Secondary/Tertiary Concepts - Dynamic Assignment */}
                {configuration.primaryConcept && (secondaryConcept || tertiaryConcept) && (
                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Key Related Concepts</h4>
                    
                    {/* Secondary Concept */}
                    {secondaryConcept && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">Secondary</span>
                            <h5 className="font-semibold text-gray-900">{secondaryConcept.name}</h5>
                          </div>
                          <div className="text-sm font-bold text-green-600">
                            {Math.round(secondaryConcept.similarity_scores[selectedSimilarityStrategy]?.score * 100 || 0)}%
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{secondaryConcept.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Based on {similarityDimensions[selectedSimilarityStrategy]?.label || 'All Dimensions'}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Weight: {weights.secondary}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Tertiary Concept */}
                    {tertiaryConcept && (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">Tertiary</span>
                            <h5 className="font-semibold text-gray-900">{tertiaryConcept.name}</h5>
                          </div>
                          <div className="text-sm font-bold text-orange-600">
                            {Math.round(tertiaryConcept.similarity_scores[selectedSimilarityStrategy]?.score * 100 || 0)}%
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{tertiaryConcept.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Based on {similarityDimensions[selectedSimilarityStrategy]?.label || 'All Dimensions'}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Weight: {weights.tertiary}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Context & Insights Accordion - Expanded */}
              <div className="col-span-12 lg:col-span-3">
                <DestinationInsightsAccordion />
              </div>

              {/* Content Variants - Compact */}
              <div className="col-span-12 lg:col-span-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Content Generation</h3>
                  </div>
                  
                  {/* Generation Controls */}
                  <div className="mb-4 space-y-3">
                    {/* Auto-regenerate Checkbox */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="auto-regenerate"
                        checked={autoRegenerate}
                        onChange={(e) => setAutoRegenerate(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="auto-regenerate" className="text-sm text-gray-700">
                        Auto-regenerate when concepts change
                      </label>
                    </div>
                    
                    {/* Generate Button */}
                    <button
                      onClick={handleGenerateContent}
                      disabled={!configuration.primaryConcept || isGenerating}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isGenerating ? (
                        <>
                          <FiRefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating Evidence-Backed Content...</span>
                        </>
                      ) : (
                        <>
                          <FiZap className="w-4 h-4" />
                          <span>Generate Evidence-Backed Content</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex space-x-2 mb-4">
                    {['A', 'B', 'C'].map((variant) => (
                      <button
                        key={variant}
                        onClick={() => setActiveVariant(variant)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all text-center ${
                          activeVariant === variant 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <span>Variant {variant}</span>
                          {activeVariant === variant && <FiCheck className="w-4 h-4" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Variant Content */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-y-auto" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
                    {activeVariant === 'A' && <VariantDisplay variant={generatedVariants['A']} variantId="A" />}
                    {activeVariant === 'B' && <VariantDisplay variant={generatedVariants['B']} variantId="B" />}
                    {activeVariant === 'C' && <VariantDisplay variant={generatedVariants['C']} variantId="C" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {showToast && (
        <ToastNotification 
          toast={{ type: toastType, message: toastMessage }} 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
};

export default ConceptRelationshipInsights;