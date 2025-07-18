import React, { useState, useEffect } from 'react';
import { dataLoader } from '../services/destinationThemeService';
import DestinationThemeCard from '../components/destinations/DestinationThemeCard';
import NuancesTab from '../components/destinations/NuancesTab';
import SimilarDestinationsTab from '../components/destinations/SimilarDestinationsTab';
import DestinationLandmarksTab from '../components/destinations/DestinationLandmarksTab';
import PhotogenicHotspotsTab from '../components/destinations/PhotogenicHotspotsTab';
import KnownForTab from '../components/destinations/KnownForTab';
import LocalInsiderTab from '../components/destinations/LocalInsiderTab';
import EvidenceModal from '../components/destinations/EvidenceModal';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { DESTINATION_CONFIG } from '../config/appConfig';
import SearchableDropdown from '../components/common/SearchableDropdown';

const DestinationInsightsPage = () => {
  const [selectedDestination, setSelectedDestination] = useState(DESTINATION_CONFIG.DEFAULT_DESTINATION);
  const [activeTab, setActiveTab] = useState('themes');
  const [destinationData, setDestinationData] = useState(null);
  const [themes, setThemes] = useState([]);
  const [nuances, setNuances] = useState(null);
  const [similarDestinations, setSimilarDestinations] = useState(null);
  const [intelligenceInsights, setIntelligenceInsights] = useState(null);
  const [landmarks, setLandmarks] = useState([]);
  const [photogenicHotspots, setPhotogenicHotspots] = useState([]);
  const [knownFor, setKnownFor] = useState([]);
  const [localInsider, setLocalInsider] = useState([]);
  const [filteredThemes, setFilteredThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [evidenceModal, setEvidenceModal] = useState({
    isOpen: false,
    context: null,
    theme: null
  });
  const [destinations, setDestinations] = useState([]);
  const [dataValidation, setDataValidation] = useState(null);
  
  // Collapsible sections state
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Image carousel state
  const [currentSeason, setCurrentSeason] = useState('winter');

  // Ensure themes is always an array
  const safeThemes = Array.isArray(themes) ? themes : [];
  const safeFilteredThemes = Array.isArray(filteredThemes) ? filteredThemes : [];

  // Load destinations from configuration on mount
  useEffect(() => {
    const initializeDestinations = async () => {
      try {
        // Get available destinations from configuration
        const availableDestinations = dataLoader.getAvailableDestinations();
        setDestinations(availableDestinations);

        // Validate data availability if configured to do so
        if (DESTINATION_CONFIG.VALIDATE_DATA_ON_LOAD) {
          console.log('Validating destination data availability...');
          const validation = await dataLoader.validateAllDestinations();
          setDataValidation(validation);
          
          // Log validation results
          validation.forEach(result => {
            if (result.status === 'available') {
              console.log(`✅ ${result.destination}: Data available`);
            } else {
              console.warn(`⚠️ ${result.destination}: ${result.error || 'Partial data'}`);
            }
          });
        }
      } catch (err) {
        console.error('Error initializing destinations:', err);
        setError('Failed to initialize destination configuration.');
      }
    };

    initializeDestinations();
  }, []);

  // Load mock data for all tabs to prevent component remounting
  const loadMockDataForTabs = (destination) => {
    const normalizeDestinationKey = (dest) => {
      const key = dest.toLowerCase();
      const keyMappings = {
        'paris_france': 'paris',
        'paris, france': 'paris',
        'tokyo_japan': 'tokyo',
        'tokyo, japan': 'tokyo',
        'london_uk': 'london',
        'london, uk': 'london'
      };
      return keyMappings[key] || key.split('_')[0].split(',')[0].trim();
    };

    const destinationKey = normalizeDestinationKey(destination);

    // Mock landmarks data
    const mockLandmarks = {
      'paris': [
        {
          landmark_name: 'Eiffel Tower',
          landmark_description: 'Iron lattice tower, symbol of Paris and architectural marvel',
          landmark_type: 'architectural',
          confidence_score: 0.95
        },
        {
          landmark_name: 'Louvre Museum',
          landmark_description: 'World\'s largest art museum and historic monument',
          landmark_type: 'museum',
          confidence_score: 0.92
        }
      ],
      'tokyo': [
        {
          landmark_name: 'Tokyo Tower',
          landmark_description: 'Communications tower inspired by Eiffel Tower',
          landmark_type: 'architectural',
          confidence_score: 0.88
        }
      ],
      'london': [
        {
          landmark_name: 'Big Ben',
          landmark_description: 'Iconic clock tower at Palace of Westminster',
          landmark_type: 'architectural',
          confidence_score: 0.94
        }
      ]
    };

    // Mock photogenic hotspots data
    const mockHotspots = {
      'paris': [
        {
          location_name: { primary_name: 'Trocadéro Gardens' },
          photo_worthiness: { why_instagram_worthy: 'Perfect Eiffel Tower views' },
          confidence_score: 0.92
        },
        {
          location_name: { primary_name: 'Pont Alexandre III' },
          photo_worthiness: { why_instagram_worthy: 'Ornate bridge with golden details' },
          confidence_score: 0.89
        }
      ],
      'tokyo': [
        {
          location_name: { primary_name: 'Shibuya Crossing' },
          photo_worthiness: { why_instagram_worthy: 'Iconic urban intersection' },
          confidence_score: 0.91
        }
      ],
      'london': [
        {
          location_name: { primary_name: 'Tower Bridge' },
          photo_worthiness: { why_instagram_worthy: 'Victorian Gothic architecture' },
          confidence_score: 0.93
        }
      ]
    };

    // Mock known for data
    const mockKnownFor = {
      'paris': [
        {
          attribute_name: 'Culinary Excellence',
          attribute_description: 'World-renowned cuisine and dining culture',
          confidence_score: 0.95
        },
        {
          attribute_name: 'Romantic Atmosphere',
          attribute_description: 'City of love and romance',
          confidence_score: 0.92
        }
      ],
      'tokyo': [
        {
          attribute_name: 'Technology Innovation',
          attribute_description: 'Cutting-edge technology and innovation',
          confidence_score: 0.94
        }
      ],
      'london': [
        {
          attribute_name: 'Royal Heritage',
          attribute_description: 'Rich royal history and traditions',
          confidence_score: 0.91
        }
      ]
    };

    // Mock local insider data
    const mockLocalInsider = {
      'paris': [
        {
          id: 'greeting-shops',
          category: 'Social Rules',
          insight_title: 'Greeting Shopkeepers',
          description: 'Always say "Bonjour" when entering shops',
          confidence_level: 'High',
          consensus_score: 0.95
        },
        {
          id: 'cafe-etiquette',
          category: 'Food Culture',
          insight_title: 'Café Standing vs Sitting',
          description: 'Different prices for bar vs table service',
          confidence_level: 'High',
          consensus_score: 0.89
        }
      ],
      'tokyo': [
        {
          id: 'bowing-etiquette',
          category: 'Social Rules',
          insight_title: 'Proper Bowing',
          description: 'Quick shallow nods for casual interactions',
          confidence_level: 'High',
          consensus_score: 0.88
        }
      ],
      'london': [
        {
          id: 'tube-etiquette',
          category: 'Transportation',
          insight_title: 'Escalator Rules',
          description: 'Stand right, walk left on escalators',
          confidence_level: 'High',
          consensus_score: 0.96
        }
      ]
    };

    // Set the data in parent state
    setLandmarks(mockLandmarks[destinationKey] || []);
    setPhotogenicHotspots(mockHotspots[destinationKey] || []);
    setKnownFor(mockKnownFor[destinationKey] || []);
    setLocalInsider(mockLocalInsider[destinationKey] || []);
  };

  // Load destination data when destination changes
  useEffect(() => {
    const loadDestinationData = async () => {
      if (!selectedDestination) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('[Debug-Page] Loading destination data for', selectedDestination);
        const data = await dataLoader.loadDestination(selectedDestination);
        console.log('[Debug-Page] Loaded data from service:', data);
        
        setDestinationData(data);
        setThemes(data?.themes || []);
        setNuances(data?.nuances || null);
        setSimilarDestinations(data?.similarDestinations || null);
        setIntelligenceInsights(data?.intelligenceInsights || null);
        
        // Load mock data for other tabs to prevent component remounting
        loadMockDataForTabs(selectedDestination);
        
        console.log('[Debug-Page] State after setting data:', {
          themesCount: data?.themes?.length || 0,
          nuancesCount: data?.nuances?.destination_nuances?.length || 0,
          similarDestinationsCount: data?.similarDestinations?.similarDestinations?.length || 0,
          hasThemes: !!data?.themes,
          hasNuances: !!data?.nuances,
          hasSimilarDestinations: !!data?.similarDestinations
        });

      } catch (err) {
        console.error('[Debug-Page] Error loading destination data:', err);
        setError(`Failed to load destination data: ${err.message}`);
        setDestinationData(null);
        setThemes([]);
        setNuances(null);
        setSimilarDestinations(null);
        setIntelligenceInsights(null);
      } finally {
        setLoading(false);
      }
    };

    loadDestinationData();
  }, [selectedDestination]);

  // Filter themes based on search
  useEffect(() => {
    if (!Array.isArray(themes)) {
      setFilteredThemes([]);
      return;
    }
    
    if (!searchTerm.trim()) {
      setFilteredThemes(themes);
    } else {
      const filtered = themes.filter(theme =>
        theme.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.rationale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredThemes(filtered);
    }
  }, [themes, searchTerm]);

  const handleDestinationChange = (destinationId) => {
    setSelectedDestination(destinationId);
    setSearchTerm(''); // Clear search when changing destinations
    setActiveTab('themes'); // Reset to themes tab
  };

  const handleToggleSection = (section) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  const handleEvidenceClick = (context) => {
    console.log('Evidence clicked:', context);
    setEvidenceModal({
      isOpen: true,
      context,
      theme: context.theme || safeThemes.find(t => t.name === context.themeId || t.theme === context.themeId)
    });
  };

  const handleCloseEvidence = () => {
    setEvidenceModal({
      isOpen: false,
      context: null,
      theme: null
    });
  };

  const selectedDestinationData = destinations.find(d => d.id === selectedDestination);

  // Get destination images based on location and season
  const getDestinationImage = (destinationId, season) => {
    // Use local images from the public/images/destinations folder
    return `/images/destinations/${destinationId}/${season}.jpg`;
  };

  // Get season information
  const getSeasonInfo = (season) => {
    const seasonMap = {
      spring: { name: 'Spring', icon: '🌸' },
      summer: { name: 'Summer', icon: '⭐' },
      autumn: { name: 'Autumn', icon: '🍂' },
      winter: { name: 'Winter', icon: '❄️' }
    };
    return seasonMap[season] || seasonMap.winter;
  };

  // Calculate enhanced stats
  const stats = {
    // Basic stats (preserved for backward compatibility)
    totalThemes: safeThemes.length,
    avgScore: safeThemes.length > 0 ? 
      Math.round((safeThemes.reduce((sum, theme) => sum + (theme.confidence || 0), 0) / safeThemes.length) * 100) : 0,
    coverage: Math.round((safeFilteredThemes.length / Math.max(safeThemes.length, 1)) * 100),
    subThemes: safeThemes.reduce((sum, theme) => sum + ((theme.sub_themes || theme.subThemes)?.length || 0), 0),
    
    // Enhanced stats from export data
    hiddenGems: safeThemes.filter(t => 
      t.hidden_gem_score?.hidden_gem_level === 'hidden gem' || 
      t.hidden_gem_score?.hidden_gem_level === 'local favorite'
    ).length,
    avgAuthenticity: intelligenceInsights?.average_authenticity_score ? 
      Math.round(intelligenceInsights.average_authenticity_score * 100) : 
      (safeThemes.length > 0 ? 
        Math.round(safeThemes.reduce((sum, theme) => sum + (theme.authenticity_analysis?.authenticity_score || 0.5), 0) / safeThemes.length * 100) : 0),
    nuancesCount: nuances ? 
      (nuances.destination_nuances?.length || 0) + 
      (nuances.hotel_expectations?.length || 0) + 
      (nuances.vacation_rental_expectations?.length || 0) : 0,
    emotionTypes: intelligenceInsights?.emotional_variety?.emotions_covered?.length || 
      [...new Set(safeThemes.flatMap(t => t.emotions || t.emotional_profile?.primary_emotions || []))].length,
    qualityScore: intelligenceInsights?.quality_assessment?.overall_score ? 
      Math.round(intelligenceInsights.quality_assessment.overall_score * 100) : null
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Destination Insights</h1>
            <p className="mt-2 text-gray-600">
              Explore evidence-backed destination insights with interactive proof points
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Destination Hero Section with Background Image */}
        <div className="mb-8">
          <div className="relative rounded-xl overflow-hidden h-64 bg-gradient-to-r from-blue-600 to-purple-700">
            {/* Background Image */}
            {selectedDestinationData && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
                style={{
                  backgroundImage: `url('${getDestinationImage(selectedDestination, currentSeason)}')`,
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
            )}
            
            {/* Content Overlay */}
            <div className="relative z-10 h-full flex items-center p-8">
              {/* Destination Info & Selector */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full">
                    <MapPinIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedDestinationData?.name || 'Choose Your Destination'}
                    </h2>
                    <p className="text-white text-opacity-90">
                      Explore themes and insights for this destination
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <SearchableDropdown
                    options={destinations.map(dest => {
                      const validation = dataValidation?.find(v => v.destination === dest.id);
                      const hasIssues = validation && validation.status !== 'available';
                      
                      return {
                        value: dest.id,
                        label: `${dest.flag} ${dest.name}${hasIssues ? ' ⚠️' : ''}`,
                        destination: dest,
                        isDisabled: hasIssues
                      };
                    })}
                    value={selectedDestination ? {
                      value: selectedDestination,
                      label: (() => {
                        const dest = destinations.find(d => d.id === selectedDestination);
                        const validation = dataValidation?.find(v => v.destination === selectedDestination);
                        const hasIssues = validation && validation.status !== 'available';
                        return dest ? `${dest.flag} ${dest.name}${hasIssues ? ' ⚠️' : ''}` : selectedDestination;
                      })()
                    } : null}
                    onChange={(option) => handleDestinationChange(option?.value || '')}
                    placeholder="Choose destination..."
                    className="w-48"
                    noOptionsMessage="No destinations found"
                  />
                </div>
              </div>
            </div>

            {/* Season Badge */}
            {selectedDestinationData && (
              <div className="absolute bottom-4 left-8">
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white text-sm">{getSeasonInfo(currentSeason).icon}</span>
                  <span className="text-white text-sm font-medium">{getSeasonInfo(currentSeason).name}</span>
                </div>
              </div>
            )}

            {/* Season Navigation Buttons */}
            <div className="absolute bottom-4 right-8 z-20">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Spring clicked!');
                    setCurrentSeason('spring');
                  }}
                  className={`p-3 backdrop-blur-sm rounded-full transition-all cursor-pointer ${
                    currentSeason === 'spring' 
                      ? 'bg-white bg-opacity-40 ring-2 ring-white ring-opacity-60' 
                      : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                  title="Spring - Click to view spring images"
                  type="button"
                >
                  <span className="text-white text-base pointer-events-none">🌸</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Summer clicked!');
                    setCurrentSeason('summer');
                  }}
                  className={`p-3 backdrop-blur-sm rounded-full transition-all cursor-pointer ${
                    currentSeason === 'summer' 
                      ? 'bg-white bg-opacity-40 ring-2 ring-white ring-opacity-60' 
                      : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                  title="Summer - Click to view summer images"
                  type="button"
                >
                  <span className="text-white text-base pointer-events-none">⭐</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Autumn clicked!');
                    setCurrentSeason('autumn');
                  }}
                  className={`p-3 backdrop-blur-sm rounded-full transition-all cursor-pointer ${
                    currentSeason === 'autumn' 
                      ? 'bg-white bg-opacity-40 ring-2 ring-white ring-opacity-60' 
                      : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                  title="Autumn - Click to view autumn images"
                  type="button"
                >
                  <span className="text-white text-base pointer-events-none">🍂</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Winter clicked!');
                    setCurrentSeason('winter');
                  }}
                  className={`p-3 backdrop-blur-sm rounded-full transition-all cursor-pointer ${
                    currentSeason === 'winter' 
                      ? 'bg-white bg-opacity-40 ring-2 ring-white ring-opacity-60' 
                      : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                  title="Winter - Click to view winter images"
                  type="button"
                >
                  <span className="text-white text-base pointer-events-none">❄️</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`mb-6 ${expandedSection ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}`}>
          {/* Destination Insight Summary */}
          {selectedDestinationData && (!expandedSection || expandedSection === 'summary') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              <button
                onClick={() => handleToggleSection('summary')}
                className="flex items-center justify-between w-full hover:bg-gray-50 -m-1 p-1 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-blue-100 rounded-full mr-2">
                    <span className="text-blue-600 text-xs">📊</span>
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Destination Insight Summary</h2>
                </div>
                <div className="flex items-center text-gray-500">
                  <span className="text-xs mr-1">
                    {expandedSection === 'summary' ? 'Hide' : 'Show'}
                  </span>
                  <span className="text-xs">
                    {expandedSection === 'summary' ? '−' : '+'}
                  </span>
                </div>
              </button>

              {expandedSection === 'summary' && (
                <div className="animate-fade-in mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalThemes}</div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">Enhanced Themes</div>
                          <div className="text-xs text-gray-500">Available insights</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-green-600">{stats.avgScore}%</div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">Avg Confidence</div>
                          <div className="text-xs text-gray-500">Theme quality</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.hiddenGems}</div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">Hidden Gems</div>
                          <div className="text-xs text-gray-500">Local favorites</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.nuancesCount}</div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">Nuances</div>
                          <div className="text-xs text-gray-500">Detailed insights</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-indigo-600">{stats.avgAuthenticity}%</div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">Authenticity</div>
                          <div className="text-xs text-gray-500">Local influence</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-pink-600">{stats.emotionTypes}</div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">Emotions</div>
                          <div className="text-xs text-gray-500">Variety types</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Intelligence Insights Section */}
          {selectedDestinationData && intelligenceInsights && (!expandedSection || expandedSection === 'intelligence') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              <button
                onClick={() => handleToggleSection('intelligence')}
                className="flex items-center justify-between w-full hover:bg-gray-50 -m-1 p-1 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-purple-100 rounded-full mr-2">
                    <span className="text-purple-600 text-xs">🧠</span>
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Intelligence Insights</h2>
                </div>
                <div className="flex items-center text-gray-500">
                    <span className="text-xs mr-1">
                    {expandedSection === 'intelligence' ? 'Hide' : 'Show'}
                  </span>
                  <span className="text-xs">
                    {expandedSection === 'intelligence' ? '−' : '+'}
                  </span>
                </div>
              </button>

              {expandedSection === 'intelligence' && (
                <div className="animate-fade-in mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Hidden Gems */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <span className="text-3xl mr-2">💎</span>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{stats.hiddenGems} gems ({Math.round((stats.hiddenGems / stats.totalThemes) * 100)}%)</div>
                          <div className="text-sm text-gray-600">Hidden Gems</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Unique experiences off the beaten path</p>
                    </div>

                    {/* Authenticity */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <span className="text-3xl mr-2">🏆</span>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">{(stats.avgAuthenticity / 100).toFixed(2)} (Moderate)</div>
                          <div className="text-sm text-gray-600">Authenticity</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Focus on local and authentic experiences</p>
                    </div>

                    {/* Theme Depth */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <span className="text-3xl mr-2">📊</span>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">1.00 (Nano-level)</div>
                          <div className="text-sm text-gray-600">Theme Depth</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Detailed, specific experience granularity</p>
                    </div>

                    {/* Emotional Range */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <span className="text-3xl mr-2">✨</span>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{stats.emotionTypes} emotion types</div>
                          <div className="text-sm text-gray-600">Emotional Range</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">exhilarating, peaceful, solitary, inspiring, contemplative, comforting, social</p>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200">
                    {/* Hotel Features */}
                    <div>
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">🏨</span>
                        <div>
                          <div className="text-xl font-bold text-blue-600">{stats.nuancesCount} features</div>
                          <div className="text-sm text-gray-600">Hotel Features Discovered</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Categories: destination, hotel, vacation_rental</p>
                      <p className="text-xs text-gray-500">Destination-specific hotel amenities and services</p>
                    </div>

                    {/* Feature Quality Score */}
                    <div>
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">📊</span>
                        <div>
                          <div className="text-xl font-bold text-green-600">0.800</div>
                          <div className="text-sm text-gray-600">Feature Quality Score</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        <span className="text-green-600 font-medium">Excellent:</span> {stats.nuancesCount} | 
                        <span className="text-blue-600 font-medium"> Good:</span> 0 | 
                        <span className="text-orange-600 font-medium"> Needs Work:</span> 0
                      </div>
                      <p className="text-xs text-gray-500">Good hotel feature quality</p>
                    </div>

                    {/* Generation Mode */}
                    <div>
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">⚡</span>
                        <div>
                          <div className="text-xl font-bold text-purple-600">Fallback</div>
                          <div className="text-sm text-gray-600">Generation Mode</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Models Used: 0 attempted</p>
                      <p className="text-xs text-gray-500">Multi-LLM consensus scoring</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Evidence Collection Section */}
          {selectedDestinationData && (!expandedSection || expandedSection === 'evidence') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              <button
                onClick={() => handleToggleSection('evidence')}
                className="flex items-center justify-between w-full hover:bg-gray-50 -m-1 p-1 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-gray-100 rounded-full mr-2">
                    <span className="text-gray-600 text-xs">🗃️</span>
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Evidence Collection</h2>
                </div>
                <div className="flex items-center text-gray-500">
                  <span className="text-xs mr-1">
                    {expandedSection === 'evidence' ? 'Hide' : 'Show'}
                  </span>
                  <span className="text-xs">
                    {expandedSection === 'evidence' ? '−' : '+'}
                  </span>
                </div>
              </button>

              {expandedSection === 'evidence' && (
                <div className="animate-fade-in mt-4">
                  {/* Top Stats */}
                  <div className="grid grid-cols-3 gap-8 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">95</div>
                      <div className="text-sm text-gray-600">Total Evidence Pieces</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">0</div>
                      <div className="text-sm text-gray-600">Unique Sources</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">1</div>
                      <div className="text-sm text-gray-600">Evidence Types</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Search Validation Evidence */}
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center mb-3">
                        <span className="text-green-600 mr-2">🔍</span>
                        <h3 className="font-semibold text-gray-900">Search Validation Evidence</h3>
                        <span className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">✓ 95</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Avg Uniqueness: <span className="font-medium">1.0x</span> <span className="text-red-500">—</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📊</span>
                          <span className="italic">0 total search hits collected</span>
                        </div>
                        <div className="flex items-center text-sm text-blue-600 mt-1">
                          <span className="mr-2">🌐</span>
                          <span>Real search engine validation</span>
                        </div>
                      </div>
                      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                        View Search Evidence
                      </button>
                    </div>

                    {/* Nuance Details */}
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center mb-3">
                        <span className="text-red-500 mr-2">🎯</span>
                        <h3 className="font-semibold text-gray-900">Nuance Details</h3>
                        <span className="ml-auto bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">📋 95</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Coverage: <span className="font-medium text-blue-600">100.0%</span> <span className="text-blue-500">—</span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        {/* Sample nuance items */}
                        <div className="flex items-center text-sm">
                          <span className="mr-2">🔍</span>
                          <span className="text-gray-700">"onsen relaxation culture"</span>
                          <span className="ml-auto text-xs text-gray-500">5 hits</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="mr-2">🔍</span>
                          <span className="text-gray-700">"onsen relaxation culture"</span>
                          <span className="ml-auto text-xs text-gray-500">5 hits</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="mr-2">🔍</span>
                          <span className="text-gray-700">"onsen relaxation culture"</span>
                          <span className="ml-auto text-xs text-gray-500">5 hits</span>
                        </div>
                      </div>
                      
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        View All Nuances
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <nav className="flex space-x-1" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('themes')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'themes'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                🌟 Enhanced Themes ({stats.totalThemes})
              </button>
              <button
                onClick={() => setActiveTab('nuances')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'nuances'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                🎯 Destination Nuances ({stats.nuancesCount})
              </button>
              <button
                onClick={() => setActiveTab('similar')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'similar'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                🗺️ Similar Destinations ({similarDestinations?.similarDestinations?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('landmarks')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'landmarks'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                🏛️ Destination Landmarks (12)
              </button>
              <button
                onClick={() => setActiveTab('photogenic')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'photogenic'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                📸 Photogenic Hotspots (5)
              </button>
              <button
                onClick={() => setActiveTab('known_for')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'known_for'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                ✨ Known For (8)
              </button>
              <button
                onClick={() => setActiveTab('local_insider')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'local_insider'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                🎯 Local Insider (8)
              </button>
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading destination data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800 font-medium">Error</div>
            <div className="text-red-600 text-sm mt-1">{error}</div>
          </div>
        )}

        {/* Tab Content */}
        {!loading && !error && (
          <>
            {/* Themes Tab */}
            {activeTab === 'themes' && (
              <>
                {safeFilteredThemes.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {safeFilteredThemes.map((theme, index) => (
                      <DestinationThemeCard
                        key={theme.name || theme.theme || index}
                        theme={theme}
                        onEvidenceClick={handleEvidenceClick}
                        selectedDestination={selectedDestination}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No themes found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try adjusting your search terms.' : 'No themes available for this destination.'}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Nuances Tab */}
            {activeTab === 'nuances' && (
              <NuancesTab 
                nuances={nuances}
                selectedDestination={selectedDestination}
                onEvidenceClick={handleEvidenceClick}
              />
            )}

            {/* Similar Destinations Tab */}
            {activeTab === 'similar' && (
              <SimilarDestinationsTab 
                similarDestinations={similarDestinations}
                onEvidenceClick={handleEvidenceClick}
              />
            )}

            {/* Destination Landmarks Tab */}
            {activeTab === 'landmarks' && (
              <DestinationLandmarksTab 
                landmarks={landmarks}
                selectedDestination={selectedDestination}
                onEvidenceClick={handleEvidenceClick}
              />
            )}

            {/* Photogenic Hotspots Tab */}
            {activeTab === 'photogenic' && (
              <PhotogenicHotspotsTab 
                hotspots={photogenicHotspots}
                selectedDestination={selectedDestination}
                onEvidenceClick={handleEvidenceClick}
              />
            )}

            {/* Known For Tab */}
            {activeTab === 'known_for' && (
              <KnownForTab 
                attributes={knownFor}
                selectedDestination={selectedDestination}
                onEvidenceClick={handleEvidenceClick}
              />
            )}

            {/* Local Insider Tab */}
            {activeTab === 'local_insider' && (
              <LocalInsiderTab 
                insights={localInsider}
                selectedDestination={selectedDestination}
                onEvidenceClick={handleEvidenceClick}
              />
            )}
          </>
        )}
      </div>

      {/* Evidence Modal */}
      <EvidenceModal
        key={`${evidenceModal.context?.type}-${evidenceModal.context?.field}-${evidenceModal.context?.themeId}`}
        isOpen={evidenceModal.isOpen}
        onClose={handleCloseEvidence}
        context={evidenceModal.context}
        theme={evidenceModal.theme}
        selectedDestination={selectedDestination}
      />
    </div>
  );
};

export default DestinationInsightsPage; 