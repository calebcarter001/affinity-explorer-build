import React, { useState, useEffect, useMemo } from 'react';
import DestinationLandmarkCard from './DestinationLandmarkCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const DestinationLandmarksTab = ({ selectedDestination, onEvidenceClick }) => {
  const [landmarks, setLandmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLandmarks, setFilteredLandmarks] = useState([]);

  // Mock landmark data - in real implementation, this would come from an API
  // Memoized for performance to prevent regeneration on every render
  const mockLandmarks = useMemo(() => ({
    'paris': [
      {
        landmark_name: 'Eiffel Tower',
        landmark_description: 'Iron lattice tower, symbol of Paris and architectural marvel',
        landmark_type: 'architectural',
        historical_significance: 'Built in 1889 for the 1889 World\'s Fair, designed by Gustave Eiffel',
        architectural_features: 'Iron lattice construction, 324 meters tall, three observation levels',
        cultural_importance: 'Global symbol of France, romantic icon, most visited paid monument',
        location_context: 'Champ de Mars, 7th arrondissement, near Seine River',
        visitor_experiences: 'Evening illumination shows, dining at restaurants, panoramic city views',
        popularity_reputation: '7 million annual visitors, 4.5 star rating',
        preservation_sustainability: 'Regular maintenance, LED lighting upgrade, crowd management',
        accessibility_practical: 'Limited mobility access to first level, elevators available',
        events_festivals: 'New Year celebrations, Bastille Day fireworks, light shows',
        economic_souvenirs: 'Entry €29.40 for top level, extensive souvenir shops',
        confidence_score: 0.95
      },
      {
        landmark_name: 'Louvre Museum',
        landmark_description: 'World\'s largest art museum, home to Mona Lisa and Venus de Milo',
        landmark_type: 'museum',
        historical_significance: 'Former royal palace, opened as museum in 1793',
        architectural_features: 'Glass pyramid entrance, classical French architecture, modern additions',
        cultural_importance: 'Houses 35,000 artworks, cultural heritage preservation center',
        location_context: 'Right Bank of Seine, 1st arrondissement, Tuileries Garden nearby',
        visitor_experiences: 'Morning visits recommended, audio guides available, special exhibitions',
        popularity_reputation: '10 million annual visitors, 4.7 star rating',
        preservation_sustainability: 'Climate-controlled galleries, conservation laboratories',
        accessibility_practical: 'Full wheelchair access, adapted tours available',
        events_festivals: 'Nuit Blanche, special exhibitions, cultural events',
        economic_souvenirs: 'Entry €17.00, extensive museum shop, online booking',
        confidence_score: 0.92
      },
      {
        landmark_name: 'Notre-Dame Cathedral',
        landmark_description: 'Gothic cathedral masterpiece, currently under restoration',
        landmark_type: 'religious',
        historical_significance: 'Construction began 1163, completed 1345, survived French Revolution',
        architectural_features: 'Gothic architecture, flying buttresses, rose windows, twin towers',
        cultural_importance: 'Religious pilgrimage site, architectural inspiration, literary setting',
        location_context: 'Île de la Cité, heart of Paris, surrounded by Seine River',
        visitor_experiences: 'Morning visits for best light, tower climbing, historical tours',
        popularity_reputation: '14 million annual visitors before fire, 4.6 star rating',
        preservation_sustainability: 'Major restoration after 2019 fire, traditional craftsmanship',
        accessibility_practical: 'Limited access during restoration, ground level viewing',
        events_festivals: 'Christmas Mass, Easter celebrations, cultural ceremonies',
        economic_souvenirs: 'Free entry to cathedral, tower access €11.50',
        confidence_score: 0.88
      },
      {
        landmark_name: 'Arc de Triomphe',
        landmark_description: 'Triumphal arch honoring those who fought for France',
        landmark_type: 'monument',
        historical_significance: 'Commissioned by Napoleon in 1806, completed 1836',
        architectural_features: 'Neoclassical design, 50m high, detailed sculptural reliefs',
        cultural_importance: 'National symbol, Tomb of Unknown Soldier, ceremonial importance',
        location_context: 'Center of Place Charles de Gaulle, Champs-Élysées endpoint',
        visitor_experiences: 'Sunset views recommended, panoramic city vistas, historical exhibits',
        popularity_reputation: '1.5 million annual visitors, 4.5 star rating',
        preservation_sustainability: 'Stone conservation, crowd management, environmental protection',
        accessibility_practical: 'Limited mobility access, underground passage entrance',
        events_festivals: 'Bastille Day parade, New Year celebrations, national ceremonies',
        economic_souvenirs: 'Entry €13.00, rooftop access, gift shop',
        confidence_score: 0.85
      },
      {
        landmark_name: 'Sacré-Cœur Basilica',
        landmark_description: 'White basilica atop Montmartre hill with panoramic views',
        landmark_type: 'religious',
        historical_significance: 'Built 1875-1914, dedicated to Sacred Heart of Jesus',
        architectural_features: 'Romano-Byzantine style, white travertine stone, large dome',
        cultural_importance: 'Pilgrimage site, artistic quarter location, spiritual significance',
        location_context: 'Montmartre hill, 18th arrondissement, artist quarter',
        visitor_experiences: 'Morning visits for fewer crowds, dome climbing, artistic atmosphere',
        popularity_reputation: '10.5 million annual visitors, 4.4 star rating',
        preservation_sustainability: 'Stone cleaning programs, visitor flow management',
        accessibility_practical: 'Partial access, funicular railway available, steep approaches',
        events_festivals: 'Religious ceremonies, Christmas services, cultural events',
        economic_souvenirs: 'Free basilica entry, dome access fee, religious items',
        confidence_score: 0.82
      },
      {
        landmark_name: 'Panthéon',
        landmark_description: 'Mausoleum containing remains of distinguished French citizens',
        landmark_type: 'cultural',
        historical_significance: 'Built 1758-1790, originally church, became mausoleum during Revolution',
        architectural_features: 'Neoclassical architecture, large dome, Corinthian columns',
        cultural_importance: 'Final resting place of Voltaire, Rousseau, Marie Curie, others',
        location_context: 'Latin Quarter, 5th arrondissement, near Sorbonne University',
        visitor_experiences: 'Afternoon visits recommended, crypt tours, historical exhibitions',
        popularity_reputation: '800,000 annual visitors, 4.3 star rating',
        preservation_sustainability: 'Monument preservation, controlled environment, restoration work',
        accessibility_practical: 'Good accessibility, elevator access, adapted facilities',
        events_festivals: 'National commemorations, cultural ceremonies, special exhibitions',
        economic_souvenirs: 'Entry €11.50, educational materials, historical books',
        confidence_score: 0.76
      }
    ],
    'tokyo': [
      {
        landmark_name: 'Tokyo Tower',
        landmark_description: 'Communications tower inspired by Eiffel Tower, symbol of Tokyo',
        landmark_type: 'architectural',
        historical_significance: 'Built in 1958, symbol of Japan\'s post-war rebirth',
        architectural_features: 'Steel lattice construction, 333 meters tall, red and white colors',
        cultural_importance: 'Symbol of Tokyo, featured in many films and media',
        location_context: 'Minato district, central Tokyo location',
        visitor_experiences: 'Observatory decks, city views, special lighting displays',
        popularity_reputation: '3 million annual visitors, 4.2 star rating',
        preservation_sustainability: 'Regular maintenance, earthquake-resistant design',
        accessibility_practical: 'Elevator access, wheelchair accessible',
        events_festivals: 'New Year celebrations, special illuminations',
        economic_souvenirs: 'Entry ¥1200, gift shop, observation deck access',
        confidence_score: 0.88
      }
    ],
    'london': [
      {
        landmark_name: 'Big Ben',
        landmark_description: 'Iconic clock tower, symbol of London and British Parliament',
        landmark_type: 'architectural',
        historical_significance: 'Completed in 1859, part of Palace of Westminster',
        architectural_features: 'Gothic Revival architecture, 96-meter tower, famous clock',
        cultural_importance: 'Symbol of London, British democracy, cultural icon',
        location_context: 'Westminster, central London, Thames riverside',
        visitor_experiences: 'External viewing, Parliament tours, historical significance',
        popularity_reputation: '6 million annual visitors, 4.4 star rating',
        preservation_sustainability: 'Recent restoration, conservation efforts',
        accessibility_practical: 'Limited access during restoration, ground viewing',
        events_festivals: 'New Year chimes, national celebrations',
        economic_souvenirs: 'Parliament tour £28, extensive gift shop',
        confidence_score: 0.91
      }
    ],
    // Add fallback data for common destination formats
    'default': [
      {
        landmark_name: 'Historic Landmark',
        landmark_description: 'A significant cultural and historical landmark',
        landmark_type: 'cultural',
        historical_significance: 'Rich historical background and cultural importance',
        architectural_features: 'Notable architectural elements and design',
        cultural_importance: 'Important cultural significance to the region',
        location_context: 'Central location with easy access',
        visitor_experiences: 'Guided tours and educational experiences available',
        popularity_reputation: '1 million annual visitors, 4.0 star rating',
        preservation_sustainability: 'Ongoing preservation and maintenance efforts',
        accessibility_practical: 'Accessible facilities and accommodations',
        events_festivals: 'Regular cultural events and celebrations',
        economic_souvenirs: 'Entry fee varies, souvenir shop available',
        confidence_score: 0.75
      }
    ]
  }), []); // Empty dependency array since this is static mock data

  // Load landmarks when destination changes
  useEffect(() => {
    const loadLandmarks = async () => {
      setLoading(true);
      try {
        // Removed artificial delay for instant loading
        
        // Debug logging
        console.log('Selected destination:', selectedDestination);
        console.log('Available mock destinations:', Object.keys(mockLandmarks));
        
        // Try different destination key formats
        let destinationKey = selectedDestination;
        let destinationLandmarks = mockLandmarks[destinationKey];
        
        if (!destinationLandmarks) {
          // Try lowercase
          destinationKey = selectedDestination?.toLowerCase();
          destinationLandmarks = mockLandmarks[destinationKey];
        }
        
        if (!destinationLandmarks) {
          // Try removing spaces and special characters
          destinationKey = selectedDestination?.toLowerCase().replace(/[^a-z0-9]/g, '');
          destinationLandmarks = mockLandmarks[destinationKey];
        }
        
        if (!destinationLandmarks) {
          // Check if destination contains known city names
          const knownDestinations = Object.keys(mockLandmarks).filter(key => key !== 'default');
          const matchedDestination = knownDestinations.find(dest => 
            selectedDestination?.toLowerCase().includes(dest) || 
            dest.includes(selectedDestination?.toLowerCase())
          );
          
          if (matchedDestination) {
            destinationKey = matchedDestination;
            destinationLandmarks = mockLandmarks[matchedDestination];
          }
        }
        
        if (!destinationLandmarks) {
          // Use default data as fallback
          destinationKey = 'default';
          destinationLandmarks = mockLandmarks.default;
        }
        
        console.log('Using destination key:', destinationKey);
        console.log('Found landmarks:', destinationLandmarks?.length || 0);
        
        setLandmarks(destinationLandmarks);
        setFilteredLandmarks(destinationLandmarks);
      } catch (error) {
        console.error('Error loading landmarks:', error);
        setLandmarks([]);
        setFilteredLandmarks([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDestination) {
      loadLandmarks();
    } else {
      // If no destination selected, show default landmarks
      const defaultLandmarks = mockLandmarks.paris || mockLandmarks.default || [];
      setLandmarks(defaultLandmarks);
      setFilteredLandmarks(defaultLandmarks);
    }
  }, [selectedDestination]);

  // Filter landmarks based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLandmarks(landmarks);
    } else {
      const filtered = landmarks.filter(landmark =>
        landmark.landmark_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        landmark.landmark_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        landmark.landmark_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        landmark.cultural_importance?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        landmark.historical_significance?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLandmarks(filtered);
    }
  }, [searchTerm, landmarks]);

  // Calculate summary statistics
  const stats = {
    totalLandmarks: filteredLandmarks.length,
    avgScore: filteredLandmarks.length > 0 ? 
      (filteredLandmarks.reduce((sum, landmark) => sum + (landmark.confidence_score || 0), 0) / filteredLandmarks.length * 100).toFixed(1) : 0,
    annualVisitors: filteredLandmarks.reduce((sum, landmark) => {
      const visitors = landmark.popularity_reputation?.match(/(\d+\.?\d*)\s*million/i);
      return sum + (visitors ? parseFloat(visitors[1]) : 0);
    }, 0).toFixed(0) + 'M+',
    unescoSites: filteredLandmarks.filter(landmark => 
      landmark.cultural_importance?.toLowerCase().includes('unesco') ||
      landmark.historical_significance?.toLowerCase().includes('world heritage')
    ).length
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading landmarks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-2 border-l-2 border-cyan-400">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-gray-900">
            Significant landmarks and cultural sites that define this destination's heritage and visitor appeal, based on multi-LLM analysis and evidence validation.
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{stats.totalLandmarks}</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Landmarks Found</div>
                <div className="text-xs text-gray-500">Available insights</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{stats.avgScore}%</div>
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

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search landmarks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>



      {/* Landmarks Grid */}
      {filteredLandmarks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLandmarks.map((landmark, index) => (
            <DestinationLandmarkCard
              key={landmark.landmark_name || index}
              landmark={landmark}
              onEvidenceClick={onEvidenceClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No landmarks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No landmarks available for this destination.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DestinationLandmarksTab;
