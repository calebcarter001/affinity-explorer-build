import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  FiEdit3, 
  FiTarget, 
  FiCopy, 
  FiDownload, 
  FiInfo, 
  FiTrendingUp,
  FiZap,
  FiEye,
  FiThumbsUp,
  FiThumbsDown,
  FiRefreshCw,
  FiSettings,
  FiSave,
  FiShare2
} from 'react-icons/fi';
import { getAffinities, searchProperties, analyzeCombination } from '../../services/apiService';
import { useAffinityData } from '../../contexts/AffinityDataContext';
import { useToast } from '../../contexts/ToastContext';
import EmptyStateStyled from '../common/EmptyStateStyled';
import SkeletonLoader from '../common/SkeletonLoader';
import SearchableDropdown from '../common/SearchableDropdown';
import ConceptRelationshipInsights from '../crp/ConceptRelationshipPanel';

// Dynamic content generation function
const generateContent = (focalAffinity, relatedConcepts, propertyContext, contentType) => {
  const affinityName = focalAffinity.name.toLowerCase();
  const propertyName = propertyContext.name || 'this exceptional property';
  const propertyType = propertyContext.type || 'resort';
  const propertyLocation = propertyContext.location || 'paradise';

  // Content templates based on content type
  const templates = {
    property_description: {
      primary: [
        `Experience the ultimate in ${affinityName} at ${propertyName}`,
        `Discover ${affinityName} like never before at this ${propertyType} in ${propertyLocation}`,
        `Immerse yourself in ${affinityName} at our ${propertyLocation} ${propertyType}`,
        `${propertyName} offers unparalleled ${affinityName} in the heart of ${propertyLocation}`
      ],
      secondary: {
        'Pet-Friendly': ['Welcome your furry companions with pet amenities', 'Pet-sitting services and dog walking available', 'Designated pet areas and pet-friendly dining'],
        'Romantic': ['Sunset views from your private terrace', 'Couples spa treatments and romantic dining', 'Intimate experiences designed for two'],
        'Family-Friendly': ['Kids club and supervised family activities', 'Spacious accommodations perfect for families', 'Safe play areas and family entertainment'],
        'Luxury': ['Premium amenities and personalized concierge service', '5-star accommodations with meticulous attention to detail', 'Exclusive access to resort facilities and VIP services'],
        'Business': ['High-speed WiFi and business center facilities', 'Meeting rooms and conference capabilities', 'Executive services and corporate packages'],
        'All-Inclusive': ['Everything included for a worry-free stay', 'Unlimited dining and premium beverages', 'Activities and entertainment all covered'],
        'Oceanview': ['Breathtaking ocean vistas from every room', 'Panoramic sea views and coastal beauty', 'Wake up to endless ocean horizons'],
        'Beach': ['Direct beach access with complimentary loungers', 'Water sports and beach activities included', 'Beachfront dining and sunset cocktails'],
        'Spa & Wellness': ['Full-service spa with healing treatments', 'Wellness programs and state-of-the-art fitness', 'Meditation gardens and tranquil relaxation spaces'],
        'Historic & Cultural': ['Rich cultural heritage and historical significance', 'Guided tours and cultural experiences', 'Traditional architecture and local artisan crafts'],
        'Adventure & Sports': ['Thrilling outdoor activities and adventure sports', 'Expert guides and equipment provided', 'Adrenaline-pumping experiences in nature'],
        'Budget-Friendly': ['Exceptional value without compromising quality', 'Affordable luxury and smart pricing', 'Great amenities at budget-conscious rates'],
        'Eco-Friendly': ['Sustainable practices and eco-conscious operations', 'Green initiatives and environmental responsibility', 'Nature conservation and eco-tourism focus']
      },
      tertiary: [
        `Nestled in the beautiful ${propertyLocation}`,
        'Walking distance to local attractions and authentic dining',
        'Concierge services to arrange transportation and excursions',
        'Traditional cultural experiences available nearby',
        'Airport transfers and local transportation provided'
      ]
    },
         marketing_copy: {
       primary: [
         `🌟 UNLOCK THE MAGIC! ${affinityName.toUpperCase()} awaits at ${propertyName} - Your ${propertyLocation} escape starts NOW!`,
         `✨ TRANSFORM YOUR WORLD! Experience ${affinityName.toUpperCase()} at our stunning ${propertyType} - LIMITED TIME!`,
         `🎯 ${propertyName.toUpperCase()}: Where ${affinityName.toUpperCase()} meets PURE LUXURY in ${propertyLocation}!`,
         `🚀 DON'T WAIT! Book TODAY and experience ${affinityName.toUpperCase()} like NEVER BEFORE!`
       ],
      secondary: {
        'Pet-Friendly': ['Bring your best friend along for the adventure!', 'Pet paradise with amenities for every furry family member', 'No need to leave anyone behind - pets welcome!'],
        'Romantic': ['Ignite the spark with unforgettable romantic moments', 'Create memories that will last a lifetime', 'Love is in the air at every turn'],
        'Family-Friendly': ['Fun for the whole family - kids and adults alike!', 'Create magical family memories together', 'Entertainment and excitement for every age'],
        'Luxury': ['Indulge in the finest luxuries money can buy', 'Pamper yourself with world-class service', 'Live like royalty during your stay'],
        'Business': ['Productivity meets paradise for the modern professional', 'Seamlessly blend work and relaxation', 'Your mobile office in paradise'],
        'All-Inclusive': ['Everything you need, all in one amazing package!', 'No hidden fees, no surprises - just pure enjoyment', 'Unlimited fun and relaxation included'],
        'Oceanview': ['Wake up to million-dollar views every morning', 'The ocean is your backyard', 'Endless blue horizons await'],
        'Beach': ['Sun, sand, and serenity at your doorstep', 'Beach bliss without the crowds', 'Your private slice of paradise'],
        'Spa & Wellness': ['Rejuvenate your body, mind, and soul', 'Wellness journey begins here', 'Transform and refresh yourself'],
        'Historic & Cultural': ['Step into history and immerse in culture', 'Discover the stories that shaped this place', 'Cultural richness at every corner'],
        'Adventure & Sports': ['Adrenaline junkies, this is your playground!', 'Push your limits and conquer new challenges', 'Adventure awaits around every corner'],
        'Budget-Friendly': ['Luxury experiences without breaking the bank', 'More value, more memories, less cost', 'Affordable paradise is here'],
        'Eco-Friendly': ['Travel responsibly and make a positive impact', 'Sustainable luxury for conscious travelers', 'Protect paradise while enjoying it']
      },
      tertiary: [
        'Limited time offers available - book today!',
        'Special packages and exclusive deals',
        'Early bird discounts for advance bookings',
        'Group rates and extended stay benefits',
        'Seasonal promotions and holiday specials'
      ]
    },
         seo_content: {
       primary: [
         `Best ${affinityName} ${propertyType} in ${propertyLocation} | ${propertyName} | Top-Rated Accommodations`,
         `${propertyLocation} ${affinityName.charAt(0).toUpperCase() + affinityName.slice(1)} Hotels | ${propertyName} | Book Direct & Save`,
         `${propertyName} - Premium ${affinityName} ${propertyType} ${propertyLocation} | 5-Star Reviews | Best Rates`,
         `${propertyLocation} Luxury ${affinityName.charAt(0).toUpperCase() + affinityName.slice(1)} Resort | ${propertyName} | Award-Winning Service`
       ],
      secondary: {
        'Pet-Friendly': ['Pet-friendly hotels and resorts', 'Dog-friendly accommodations with amenities', 'Travel with pets - welcome policies'],
        'Romantic': ['Romantic getaways and honeymoon suites', 'Couples retreats and intimate experiences', 'Wedding venues and anniversary celebrations'],
        'Family-Friendly': ['Family hotels with kids activities', 'Child-friendly resorts and entertainment', 'Family vacation packages and deals'],
        'Luxury': ['5-star luxury resorts and hotels', 'Premium accommodations and VIP services', 'Luxury travel and exclusive experiences'],
        'Business': ['Business hotels with meeting facilities', 'Corporate retreats and conference venues', 'Executive accommodations and services'],
        'All-Inclusive': ['All-inclusive resort packages', 'Unlimited dining and activities included', 'Worry-free vacation planning'],
        'Oceanview': ['Ocean view hotels and suites', 'Beachfront accommodations with sea views', 'Coastal resorts and waterfront properties'],
        'Beach': ['Beach resorts and seaside hotels', 'Waterfront accommodations and activities', 'Coastal vacation destinations'],
        'Spa & Wellness': ['Spa resorts and wellness retreats', 'Health and wellness vacation packages', 'Relaxation and rejuvenation experiences'],
        'Historic & Cultural': ['Cultural hotels and heritage properties', 'Historic accommodations and cultural tours', 'Traditional architecture and local experiences'],
        'Adventure & Sports': ['Adventure resorts and activity packages', 'Outdoor recreation and sports facilities', 'Thrill-seeking vacation experiences'],
        'Budget-Friendly': ['Affordable hotels and budget accommodations', 'Value resorts and economical stays', 'Budget travel and cost-effective options'],
        'Eco-Friendly': ['Eco-friendly hotels and sustainable resorts', 'Green accommodations and eco-tourism', 'Environmentally responsible travel options']
      },
      tertiary: [
        `Book direct for best rates and exclusive perks`,
        'Free cancellation and flexible booking policies',
        'Guest reviews and testimonials',
        'Award-winning service and recognition',
        'Accessibility features and inclusive accommodations'
      ]
    },
    social_media: {
      primary: [
        `✨ ${affinityName.toUpperCase()} vibes at ${propertyName}! 🌴`,
        `📍 ${propertyLocation} | 💫 ${affinityName} paradise awaits`,
        `🏨 ${propertyName} = ${affinityName} perfection! ✨`,
        `Tag someone who needs this ${affinityName} getaway! 👇`
      ],
      secondary: {
        'Pet-Friendly': ['🐕 Furry friends welcome! #PetFriendly', '🐾 Paws and paradise combined', '🦴 Your pet\'s vacation too!'],
        'Romantic': ['💕 Love is in the air #Romance', '🌹 Couples paradise found', '💑 Perfect for two'],
        'Family-Friendly': ['👨‍👩‍👧‍👦 Family fun guaranteed! #FamilyTime', '🎈 Kids love it here', '👶 All ages welcome'],
        'Luxury': ['💎 Living the luxury life #Luxury', '🥂 5-star everything', '👑 Treat yourself like royalty'],
        'Business': ['💼 Work meets paradise #BusinessTravel', '📱 WiFi and workspace ready', '🤝 Professional meets pleasure'],
        'All-Inclusive': ['🍹 Everything included! #AllInclusive', '🍽️ Unlimited everything', '🎉 No limits, just fun'],
        'Oceanview': ['🌊 Ocean views for days #OceanView', '🏖️ Endless blue horizons', '🌅 Sunrise over the sea'],
        'Beach': ['🏖️ Beach life calling #BeachVibes', '🌊 Sand between your toes', '☀️ Sun, sand, serenity'],
        'Spa & Wellness': ['🧘‍♀️ Wellness warrior mode #SpaLife', '💆‍♀️ Relaxation station', '🌿 Mind, body, soul'],
        'Historic & Cultural': ['🏛️ History comes alive #Culture', '🎭 Cultural immersion', '📚 Stories in every corner'],
        'Adventure & Sports': ['🏃‍♂️ Adventure awaits! #AdventureTime', '⛰️ Thrill seeker approved', '🚀 Adrenaline rush guaranteed'],
        'Budget-Friendly': ['💰 Luxury for less #BudgetTravel', '🎯 Best value guaranteed', '💸 More bang for your buck'],
        'Eco-Friendly': ['🌱 Sustainable paradise #EcoTravel', '♻️ Green and gorgeous', '🌍 Protecting our planet']
      },
      tertiary: [
        '#Vacation #Travel #Paradise',
        'Double tap if you want to be here! 💙',
        'Link in bio to book your getaway',
        'Share your photos with our hashtag!',
        'Follow for more travel inspiration'
      ]
    }
  };

  const contentTemplate = templates[contentType] || templates.property_description;
  
  // Use a seed based on content type and affinity to make generation more predictable
  const seed = `${contentType}-${focalAffinity.id}`.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const seededRandom = (index = 0) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };
  
  return {
    primary: contentTemplate.primary[Math.floor(seededRandom(0) * contentTemplate.primary.length)],
    secondary: relatedConcepts.slice(0, 3).map((concept, index) => {
      const options = contentTemplate.secondary[concept.name] || [`Enhanced ${concept.name.toLowerCase()} experience available`];
      return options[Math.floor(seededRandom(index + 1) * options.length)];
    }),
    tertiary: contentTemplate.tertiary.slice(0, Math.min(3, contentTemplate.tertiary.length))
  };
};

// Confidence indicator component
const ConfidenceBar = ({ score, size = 'md' }) => {
  const getColor = (score) => {
    if (score >= 0.9) return 'bg-green-500';
    if (score >= 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const height = size === 'sm' ? 'h-1' : 'h-2';
  
  return (
    <div className={`w-full bg-gray-200 rounded-full ${height}`}>
      <div 
        className={`${height} rounded-full ${getColor(score)}`}
        style={{ width: `${score * 100}%` }}
      />
    </div>
  );
};

// Concept suggestion card component
const ConceptCard = ({ concept, score, onSelect, selected, onFeedback }) => {
  const primaryIcon = concept.name.includes('Pet') ? '🐕' : 
                     concept.name.includes('Romantic') ? '💕' :
                     concept.name.includes('Family') ? '👨‍👩‍👧‍👦' :
                     concept.name.includes('Luxury') ? '✨' :
                     concept.name.includes('Business') ? '💼' :
                     concept.name.includes('Beach') ? '🏖️' :
                     concept.name.includes('Spa') ? '🧘‍♀️' :
                     concept.name.includes('Historic') ? '🏛️' :
                     concept.name.includes('Adventure') ? '🏃‍♂️' :
                     concept.name.includes('Budget') ? '💰' :
                     concept.name.includes('Eco') ? '🌱' : '🏨';

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(concept)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{primaryIcon}</span>
          <h4 className="font-semibold text-gray-900">{concept.name}</h4>
        </div>
        <span className="text-xs font-medium text-gray-500">
          {Math.round(score * 100)}%
        </span>
      </div>
      
      <ConfidenceBar score={score} size="sm" />
      
      <div className="mt-3">
        <p className="text-sm text-gray-600 mb-2">
          {concept.definition || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 capitalize">
            {concept.category} • Score: {concept.averageScore?.toFixed(2) || 'N/A'}
          </span>
          <div className="flex items-center space-x-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onFeedback(concept.id, 'up'); }}
              className="p-1 text-gray-400 hover:text-green-500"
            >
              <FiThumbsUp size={12} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onFeedback(concept.id, 'down'); }}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <FiThumbsDown size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Content block component
const ContentBlock = ({ title, content, type = 'text', onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-gray-400 hover:text-blue-500"
          >
            <FiEdit3 size={14} />
          </button>
          <button 
            onClick={() => navigator.clipboard.writeText(editedContent)}
            className="p-1 text-gray-400 hover:text-green-500"
          >
            <FiCopy size={14} />
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded resize-none"
            rows={type === 'primary' ? 2 : type === 'secondary' ? 3 : 4}
          />
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button 
              onClick={() => { setEditedContent(content); setIsEditing(false); }}
              className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-700">
          {Array.isArray(editedContent) ? (
            <ul className="list-disc list-inside space-y-1">
              {editedContent.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{editedContent}</p>
          )}
        </div>
      )}
    </div>
  );
};

const ContentStudio = () => {
  const [activeTab, setActiveTab] = useState('content-generator'); // Tab state
  const { affinities, loading: affinitiesLoading, fetchAffinities } = useAffinityData();
  const showToast = useToast();
  
  // State management
  const [selectedFocalAffinity, setSelectedFocalAffinity] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [contentType, setContentType] = useState('property_description');
  const [contentTone, setContentTone] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentGeneratedAt, setContentGeneratedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    fetchAffinities();
    
    const fetchProperties = async () => {
      setPropertiesLoading(true);
      try {
        const response = await searchProperties('*', 1, 20);
        setProperties(response.data || []);
      } catch (error) {
        showToast.error('Failed to load properties');
      } finally {
        setPropertiesLoading(false);
      }
    };
    fetchProperties();
  }, [fetchAffinities, showToast]);

  // Generate recommendations when focal affinity changes
  useEffect(() => {
    if (selectedFocalAffinity && affinities) {
      generateRecommendations();
    }
  }, [selectedFocalAffinity, affinities]);

  // Remove auto-regeneration to prevent glitching - content will only update when manually generated

  // Memoize options to prevent re-renders
  const affinityOptions = useMemo(() => {
    return (affinities || []).map(affinity => (
      <option key={affinity.id} value={affinity.id}>
        {affinity.name} ({affinity.category})
      </option>
    ));
  }, [affinities]);

  const propertyOptions = useMemo(() => {
    return properties.map(property => (
      <option key={property.id} value={property.id}>
        {property.name} - {property.location}
      </option>
    ));
  }, [properties]);

  const generateRecommendations = async () => {
    if (!selectedFocalAffinity) return;
    
    setRecommendationsLoading(true);
    try {
      // Simple recommendation logic based on category similarity and co-occurrence
      const related = affinities
        .filter(a => a.id !== selectedFocalAffinity.id)
        .map(affinity => {
          let score = 0;
          
          // Category bonus
          if (affinity.category === selectedFocalAffinity.category) {
            score += 0.3;
          }
          
          // Performance-based scoring
          score += (affinity.averageScore || 0) * 0.4;
          
          // Coverage bonus
          score += (affinity.coverage || 0) / 100 * 0.2;
          
          // Random factor for variety
          score += Math.random() * 0.1;
          
          return { affinity, score: Math.min(score, 1) };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      
      setRecommendations(related);
    } catch (error) {
      showToast.error('Failed to generate recommendations');
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const handleConceptSelect = (concept) => {
    setSelectedConcepts(prev => {
      const exists = prev.find(c => c.id === concept.id);
      if (exists) {
        return prev.filter(c => c.id !== concept.id);
      } else {
        return [...prev, concept];
      }
    });
  };

  const handleGenerateContent = useCallback(() => {
    if (!selectedFocalAffinity) {
      showToast.error('Please select a focal affinity first');
      return;
    }

    const propertyContext = selectedProperty || {
      name: 'Sample Property',
      type: 'Resort',
      location: 'Tropical Paradise'
    };

    const content = generateContent(selectedFocalAffinity, selectedConcepts, propertyContext, contentType);
    setGeneratedContent(content);
    setContentGeneratedAt(new Date());
    showToast.success('Content generated successfully!');
  }, [selectedFocalAffinity, selectedProperty, selectedConcepts, contentType, showToast]);

  const handleFeedback = (conceptId, type) => {
    // Mock feedback tracking
    console.log(`Feedback: ${type} for concept ${conceptId}`);
    showToast.success(`Feedback recorded: ${type === 'up' ? 'Helpful' : 'Not helpful'}`);
  };

  const handleContentEdit = (newContent) => {
    // Handle content editing
    console.log('Content edited:', newContent);
  };

  const exportContent = (format) => {
    if (!generatedContent) return;
    
    const content = {
      focalAffinity: selectedFocalAffinity?.name,
      property: selectedProperty?.name || 'Sample Property',
      generatedAt: new Date().toISOString(),
      content: generatedContent
    };
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'content-studio-export.json';
      a.click();
    } else if (format === 'clipboard') {
      const text = `${generatedContent.primary}\n\n${generatedContent.secondary.join('\n')}\n\n${generatedContent.tertiary.join('\n')}`;
      navigator.clipboard.writeText(text);
      showToast.success('Content copied to clipboard!');
    }
  };



  if (affinitiesLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-8">
          <SkeletonLoader count={3} height={200} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
              <div className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                      <FiEdit3 className="mr-3 text-blue-600" />
                      Content Studio
                    </h1>
                    <p className="mt-2 text-gray-600">
                      AI-powered content generation based on affinity relationships
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => exportContent('clipboard')}
                      disabled={!generatedContent}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FiCopy className="mr-2" size={16} />
                      Copy
                    </button>
                    <button
                      onClick={() => exportContent('json')}
                      disabled={!generatedContent}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FiDownload className="mr-2" size={16} />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('content-generator')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'content-generator'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Content Generator
                </button>
                <button
                  onClick={() => setActiveTab('concept-relationship-panel')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'concept-relationship-panel'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Concept Relationship Panel
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-8">
            {activeTab === 'content-generator' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1: Input Controls */}
              <div className="space-y-6">
                {/* Focal Concept Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Focus Concept</h3>
                  <SearchableDropdown
                    options={(affinities || []).map(affinity => ({
                      value: affinity.id,
                      label: `${affinity.name} (${affinity.category})`,
                      affinity: affinity
                    }))}
                    value={selectedFocalAffinity ? {
                      value: selectedFocalAffinity.id,
                      label: `${selectedFocalAffinity.name} (${selectedFocalAffinity.category})`
                    } : null}
                    onChange={(option) => setSelectedFocalAffinity(option?.affinity || null)}
                    placeholder="Select an affinity..."
                    className="w-48"
                    noOptionsMessage="No affinities found"
                  />
                </div>

                {/* Property Context */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Context</h3>
                  {propertiesLoading ? (
                    <SkeletonLoader count={1} height={80} />
                  ) : (
                    <SearchableDropdown
                      options={properties.map(property => ({
                        value: property.id,
                        label: `${property.name} - ${property.location}`,
                        property: property
                      }))}
                      value={selectedProperty ? {
                        value: selectedProperty.id,
                        label: `${selectedProperty.name} - ${selectedProperty.location}`
                      } : null}
                      onChange={(option) => setSelectedProperty(option?.property || null)}
                      placeholder="Select a property..."
                      className="w-48"
                      noOptionsMessage="No properties found"
                    />
                  )}
                </div>

                {/* Content Type */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Type</h3>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                  >
                    <option value="property_description">📝 Property Description</option>
                    <option value="marketing_copy">🎯 Marketing Copy</option>
                    <option value="seo_content">🔍 SEO Content</option>
                    <option value="social_media">📱 Social Media</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-2">
                    {contentType === 'property_description' && 'Detailed property descriptions for websites'}
                    {contentType === 'marketing_copy' && 'Persuasive copy for advertisements and promotions'}
                    {contentType === 'seo_content' && 'Search-optimized content for better rankings'}
                    {contentType === 'social_media' && 'Engaging posts for social media platforms'}
                  </p>
                </div>

                {/* Content Tone */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Tone</h3>
                  <select
                    value={contentTone}
                    onChange={(e) => setContentTone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                  >
                    <option value="">Select a tone...</option>
                    <option value="expedia">🌍 Expedia</option>
                    <option value="vrbo">🏠 Vrbo</option>
                    <option value="hcom">🏨 HCom</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-2">
                    {contentTone === 'expedia' && 'Travel-focused tone with adventure and discovery emphasis'}
                    {contentTone === 'vrbo' && 'Home-away-from-home tone with comfort and family focus'}
                    {contentTone === 'hcom' && 'Professional hospitality tone with service excellence'}
                    {!contentTone && 'Choose a tone to match your brand voice'}
                  </p>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateContent}
                  disabled={!selectedFocalAffinity || !selectedProperty || !contentType || !contentTone || loading}
                  className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <FiRefreshCw className="mr-2 animate-spin" size={16} />
                  ) : (
                    <FiZap className="mr-2" size={16} />
                  )}
                  {generatedContent ? 'Update Content' : 'Generate Content'}
                </button>
                {generatedContent && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Content will update when you click the button above
                  </p>
                )}
              </div>

              {/* Column 2: Concept Suggestions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Related Concepts</h3>
                  {selectedFocalAffinity && (
                    <span className="text-sm text-gray-500">
                      Based on "{selectedFocalAffinity.name}"
                    </span>
                  )}
                </div>
                {/* Add concept suggestions content here */}
              </div>
              </div>
            )}
            
            {activeTab === 'concept-relationship-panel' && (
              <ConceptRelationshipInsights />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentStudio; 