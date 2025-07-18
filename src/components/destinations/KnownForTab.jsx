import React, { useState, useEffect, useMemo } from 'react';
import KnownForAttributeCard from './KnownForAttributeCard';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const KnownForTab = ({ selectedDestination, onEvidenceClick }) => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAttributes, setFilteredAttributes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock known-for data - in real implementation, this would come from the Known For Agent
  // Memoized for performance to prevent regeneration on every render
  const mockKnownForData = useMemo(() => ({
    'paris': [
      {
        attribute_name: 'Culinary Excellence',
        attribute_description: 'Paris is globally recognized for its exceptional culinary scene, from Michelin-starred restaurants to charming bistros and world-class patisseries.',
        cultural_historical_significance: 'French cuisine has shaped global culinary standards for centuries, with Paris serving as the epicenter of gastronomic innovation and tradition.',
        confidence_score: 0.95,
        authority_score: 0.92,
        uniqueness_score: 0.88,
        contributing_models: ['openai', 'anthropic', 'gemini'],
        evidence_sources: [
          'https://guide.michelin.com/en/paris',
          'https://www.timeout.com/paris/restaurants',
          'https://www.cntraveler.com/paris-restaurants'
        ],
        validation_metadata: {
          consensus_count: 3,
          evidence_sources: 15,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      },
      {
        attribute_name: 'Art & Museums',
        attribute_description: 'Home to world-renowned museums like the Louvre, Musée d\'Orsay, and Centre Pompidou, Paris is a global capital of art and culture.',
        cultural_historical_significance: 'Paris has been a center of artistic innovation for centuries, hosting legendary artists and movements that shaped Western art history.',
        confidence_score: 0.93,
        authority_score: 0.94,
        uniqueness_score: 0.91,
        contributing_models: ['openai', 'anthropic', 'gemini'],
        evidence_sources: [
          'https://www.louvre.fr',
          'https://www.musee-orsay.fr',
          'https://www.centrepompidou.fr'
        ],
        validation_metadata: {
          consensus_count: 3,
          evidence_sources: 12,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      },
      {
        attribute_name: 'Fashion Capital',
        attribute_description: 'Paris is one of the "Big Four" fashion capitals, hosting Paris Fashion Week and home to luxury fashion houses like Chanel, Dior, and Louis Vuitton.',
        cultural_historical_significance: 'Since the 17th century, Paris has been synonymous with haute couture and luxury fashion, setting global trends and standards.',
        confidence_score: 0.91,
        authority_score: 0.89,
        uniqueness_score: 0.85,
        contributing_models: ['openai', 'anthropic', 'gemini'],
        evidence_sources: [
          'https://www.vogue.com/fashion-week/paris',
          'https://www.chanel.com',
          'https://www.dior.com'
        ],
        validation_metadata: {
          consensus_count: 3,
          evidence_sources: 18,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      },
      {
        attribute_name: 'Romantic Atmosphere',
        attribute_description: 'Known as the "City of Love," Paris is famous for its romantic ambiance, scenic bridges, charming cafés, and intimate settings.',
        cultural_historical_significance: 'Paris\'s romantic reputation has been cultivated through literature, cinema, and urban design, making it a global symbol of romance.',
        confidence_score: 0.87,
        authority_score: 0.82,
        uniqueness_score: 0.90,
        contributing_models: ['openai', 'anthropic'],
        evidence_sources: [
          'https://www.timeout.com/paris/things-to-do/most-romantic-places-in-paris',
          'https://www.lonelyplanet.com/paris/romantic-paris'
        ],
        validation_metadata: {
          consensus_count: 2,
          evidence_sources: 8,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      },
      {
        attribute_name: 'Architectural Heritage',
        attribute_description: 'Paris showcases centuries of architectural evolution, from Gothic Notre-Dame to Haussmanian boulevards and modern landmarks like the Eiffel Tower.',
        cultural_historical_significance: 'Parisian architecture represents key periods in European history and has influenced urban planning worldwide.',
        confidence_score: 0.92,
        authority_score: 0.91,
        uniqueness_score: 0.87,
        contributing_models: ['openai', 'anthropic', 'gemini'],
        evidence_sources: [
          'https://www.paris.fr/patrimoine',
          'https://whc.unesco.org/en/list/600/',
          'https://www.architecturaldigest.com/paris-architecture'
        ],
        validation_metadata: {
          consensus_count: 3,
          evidence_sources: 14,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      },
      {
        attribute_name: 'Literary Heritage',
        attribute_description: 'Paris has been home to countless writers and literary movements, from Hemingway and Fitzgerald to contemporary authors, with iconic bookshops like Shakespeare and Company.',
        cultural_historical_significance: 'The city has been a literary hub for centuries, inspiring works that shaped world literature and hosting influential literary salons.',
        confidence_score: 0.85,
        authority_score: 0.88,
        uniqueness_score: 0.83,
        contributing_models: ['openai', 'anthropic'],
        evidence_sources: [
          'https://shakespeareandcompany.com',
          'https://www.timeout.com/paris/books/literary-paris'
        ],
        validation_metadata: {
          consensus_count: 2,
          evidence_sources: 10,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      },
      {
        attribute_name: 'Café Culture',
        attribute_description: 'Parisian café culture is legendary, with sidewalk cafés serving as social hubs where people gather to socialize, work, and people-watch.',
        cultural_historical_significance: 'Café culture has been integral to Parisian social life since the 17th century, fostering intellectual discourse and community.',
        confidence_score: 0.89,
        authority_score: 0.84,
        uniqueness_score: 0.86,
        contributing_models: ['openai', 'gemini'],
        evidence_sources: [
          'https://www.timeout.com/paris/restaurants/best-cafes-in-paris',
          'https://www.frenchtoday.com/blog/french-culture/french-cafe-culture'
        ],
        validation_metadata: {
          consensus_count: 2,
          evidence_sources: 7,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      },
      {
        attribute_name: 'Luxury Shopping',
        attribute_description: 'Paris offers world-class luxury shopping along the Champs-Élysées, Rue Saint-Honoré, and in department stores like Galeries Lafayette and Le Bon Marché.',
        cultural_historical_significance: 'Paris established the concept of the modern department store and luxury retail experience in the 19th century.',
        confidence_score: 0.88,
        authority_score: 0.86,
        uniqueness_score: 0.82,
        contributing_models: ['openai', 'anthropic', 'gemini'],
        evidence_sources: [
          'https://www.galerieslafayette.com',
          'https://www.lebonmarche.com',
          'https://www.timeout.com/paris/shopping'
        ],
        validation_metadata: {
          consensus_count: 3,
          evidence_sources: 11,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      }
    ],
    'tokyo': [
      {
        attribute_name: 'Technological Innovation',
        attribute_description: 'Tokyo is at the forefront of technological advancement, from robotics and AI to cutting-edge electronics and digital entertainment.',
        cultural_historical_significance: 'Japan\'s post-war technological revolution transformed Tokyo into a global tech hub, influencing worldwide innovation.',
        confidence_score: 0.94,
        authority_score: 0.91,
        uniqueness_score: 0.93,
        contributing_models: ['openai', 'anthropic', 'gemini'],
        evidence_sources: [
          'https://www.japan.go.jp/technology/',
          'https://www.timeout.com/tokyo/things-to-do/tokyo-tech-attractions'
        ],
        validation_metadata: {
          consensus_count: 3,
          evidence_sources: 16,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      },
      {
        attribute_name: 'Anime & Manga Culture',
        attribute_description: 'Tokyo is the global center of anime and manga culture, with districts like Akihabara and Harajuku celebrating this unique Japanese art form.',
        cultural_historical_significance: 'Anime and manga originated in Japan and have become major cultural exports, with Tokyo as the creative epicenter.',
        confidence_score: 0.92,
        authority_score: 0.89,
        uniqueness_score: 0.95,
        contributing_models: ['openai', 'anthropic'],
        evidence_sources: [
          'https://www.japan-guide.com/e/e3003.html',
          'https://www.timeout.com/tokyo/things-to-do/anime-and-manga-in-tokyo'
        ],
        validation_metadata: {
          consensus_count: 2,
          evidence_sources: 12,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      }
    ],
    'london': [
      {
        attribute_name: 'Royal Heritage',
        attribute_description: 'London is the seat of the British monarchy, home to Buckingham Palace, the Tower of London, and centuries of royal history.',
        cultural_historical_significance: 'The British Royal Family and their London residences represent over 1,000 years of continuous monarchical tradition.',
        confidence_score: 0.96,
        authority_score: 0.95,
        uniqueness_score: 0.92,
        contributing_models: ['openai', 'anthropic', 'gemini'],
        evidence_sources: [
          'https://www.royal.uk/',
          'https://www.hrp.org.uk/tower-of-london/',
          'https://www.rct.uk/visit/buckingham-palace'
        ],
        validation_metadata: {
          consensus_count: 3,
          evidence_sources: 20,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      }
    ],
    'default': [
      {
        attribute_name: 'Cultural Heritage',
        attribute_description: 'This destination is known for its rich cultural heritage and historical significance.',
        cultural_historical_significance: 'The cultural heritage represents centuries of tradition and historical development.',
        confidence_score: 0.75,
        authority_score: 0.70,
        uniqueness_score: 0.72,
        contributing_models: ['openai'],
        evidence_sources: ['https://example.com/heritage'],
        validation_metadata: {
          consensus_count: 1,
          evidence_sources: 5,
          validation_timestamp: '2024-01-15T10:30:00Z'
        }
      }
    ]
  }), []); // Empty dependency array since this is static mock data

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories', icon: '🌟' },
    { value: 'culture', label: 'Culture & Arts', icon: '🎨' },
    { value: 'food', label: 'Food & Cuisine', icon: '🍽️' },
    { value: 'history', label: 'History & Heritage', icon: '🏛️' },
    { value: 'nature', label: 'Nature & Landscapes', icon: '🌿' },
    { value: 'architecture', label: 'Architecture', icon: '🏗️' },
    { value: 'lifestyle', label: 'Lifestyle & Social', icon: '☕' }
  ];

  // Load attributes when destination changes
  useEffect(() => {
    const loadAttributes = async () => {
      setLoading(true);
      try {
        // Removed artificial delay for instant loading
        
        console.log('Loading known-for attributes for:', selectedDestination);
        
        // Try different destination key formats
        let destinationKey = selectedDestination;
        let destinationAttributes = mockKnownForData[destinationKey];
        
        if (!destinationAttributes) {
          destinationKey = selectedDestination?.toLowerCase();
          destinationAttributes = mockKnownForData[destinationKey];
        }
        
        if (!destinationAttributes) {
          destinationKey = selectedDestination?.toLowerCase().replace(/[^a-z0-9]/g, '');
          destinationAttributes = mockKnownForData[destinationKey];
        }
        
        if (!destinationAttributes) {
          const knownDestinations = Object.keys(mockKnownForData).filter(key => key !== 'default');
          const matchedDestination = knownDestinations.find(dest => 
            selectedDestination?.toLowerCase().includes(dest) || 
            dest.includes(selectedDestination?.toLowerCase())
          );
          
          if (matchedDestination) {
            destinationKey = matchedDestination;
            destinationAttributes = mockKnownForData[matchedDestination];
          }
        }
        
        if (!destinationAttributes) {
          destinationKey = 'default';
          destinationAttributes = mockKnownForData.default;
        }
        
        console.log('Using destination key:', destinationKey);
        console.log('Found attributes:', destinationAttributes?.length || 0);
        
        setAttributes(destinationAttributes || []);
        setFilteredAttributes(destinationAttributes || []);
      } catch (error) {
        console.error('Error loading known-for attributes:', error);
        setAttributes([]);
        setFilteredAttributes([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDestination) {
      loadAttributes();
    } else {
      const defaultAttributes = mockKnownForData.paris || mockKnownForData.default || [];
      setAttributes(defaultAttributes);
      setFilteredAttributes(defaultAttributes);
    }
  }, [selectedDestination]);

  // Filter attributes based on search term and category
  useEffect(() => {
    let filtered = attributes;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(attr =>
        attr.attribute_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attr.attribute_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attr.cultural_historical_significance?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(attr => {
        const text = (attr.attribute_name + ' ' + attr.attribute_description).toLowerCase();
        switch (selectedCategory) {
          case 'culture':
            return text.includes('art') || text.includes('culture') || text.includes('music') || text.includes('literary');
          case 'food':
            return text.includes('food') || text.includes('cuisine') || text.includes('culinary') || text.includes('café');
          case 'history':
            return text.includes('history') || text.includes('historical') || text.includes('heritage') || text.includes('royal');
          case 'nature':
            return text.includes('nature') || text.includes('landscape') || text.includes('natural') || text.includes('park');
          case 'architecture':
            return text.includes('architecture') || text.includes('building') || text.includes('architectural');
          case 'lifestyle':
            return text.includes('lifestyle') || text.includes('social') || text.includes('romantic') || text.includes('shopping');
          default:
            return true;
        }
      });
    }

    setFilteredAttributes(filtered);
  }, [searchTerm, selectedCategory, attributes]);

  // Calculate summary statistics
  const stats = {
    totalAttributes: filteredAttributes.length,
    avgConfidence: filteredAttributes.length > 0 ? 
      (filteredAttributes.reduce((sum, attr) => sum + (attr.confidence_score || 0), 0) / filteredAttributes.length * 100).toFixed(1) : 0,
    avgAuthority: filteredAttributes.length > 0 ? 
      (filteredAttributes.reduce((sum, attr) => sum + (attr.authority_score || 0), 0) / filteredAttributes.length * 100).toFixed(1) : 0,
    evidenceSources: filteredAttributes.reduce((sum, attr) => sum + (attr.evidence_sources?.length || 0), 0)
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading known-for attributes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-2 border-l-2 border-cyan-400">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-gray-900">
            Cultural and historical attributes that define what this destination is uniquely known for, based on multi-LLM analysis and evidence validation.
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{stats.totalAttributes}</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Known For Attributes</div>
                <div className="text-xs text-gray-500">Available insights</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{stats.avgConfidence}%</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Overall Quality Score</div>
                <div className="text-xs text-gray-500">Analysis confidence</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">N/A</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Processing Time</div>
                <div className="text-xs text-gray-500">Computation work</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">3</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Models Used</div>
                <div className="text-xs text-gray-500">LLM contributors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search attributes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>



      {/* Attributes Grid */}
      {filteredAttributes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAttributes.map((attribute, index) => (
            <KnownForAttributeCard
              key={attribute.attribute_name || index}
              attribute={attribute}
              onEvidenceClick={onEvidenceClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No attributes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your search or filter.' : 'No known-for attributes available for this destination.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default KnownForTab;
