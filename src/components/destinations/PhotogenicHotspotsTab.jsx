import React, { useState, useEffect, useMemo } from 'react';
import PhotogenicHotspotCard from './PhotogenicHotspotCard';
import { MagnifyingGlassIcon, CameraIcon } from '@heroicons/react/24/outline';

const PhotogenicHotspotsTab = ({ selectedDestination, onEvidenceClick }) => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHotspots, setFilteredHotspots] = useState([]);

  // Mock photogenic hotspots data - in real implementation, this would come from PhotogenicHotspotsAgent
  // Memoized for performance to prevent regeneration on every render
  const mockHotspots = useMemo(() => ({
    'paris': [
      {
        rank: 1,
        location_name: {
          primary_name: 'Trocadéro Gardens',
          alternative_names: ['Jardins du Trocadéro']
        },
        location_details: {
          accessibility: 'Metro Line 6 or 9 to Trocadéro station, 2-minute walk',
          entry_requirements: 'Free access, open 24/7'
        },
        photo_worthiness: {
          why_instagram_worthy: 'The most iconic Eiffel Tower view in Paris, perfect for sunrise and sunset shots with the tower as a dramatic backdrop',
          best_photo_opportunities: 'Classic Eiffel Tower shots, couple photos, group selfies, golden hour silhouettes',
          signature_views: 'Full tower view from the esplanade, fountain foreground shots, stairs leading to tower'
        },
        timing_conditions: {
          best_time_of_year: 'April-October for best weather, December for Christmas lights',
          optimal_time_of_day: 'Sunrise (7AM) and golden hour (6-8PM), blue hour for tower lights',
          weather_considerations: 'Clear skies ideal, dramatic clouds can add interest, avoid heavy rain'
        },
        equipment_recommendations: {
          smartphone_tips: 'Use portrait mode for people shots, wide angle for full tower, night mode for evening',
          basic_camera_users: 'Bring tripod for night shots, polarizing filter for day shots',
          helpful_accessories: 'Portable phone tripod, lens cleaning cloth, extra battery',
          what_not_to_bring: 'Heavy professional equipment in crowds'
        },
        travel_logistics: {
          how_easy_to_reach: 'Very easy - major metro station, tourist area',
          time_needed: '1-2 hours for various shots and angles',
          busy_times_to_avoid: '10AM-4PM peak tourist hours, weekends',
          family_friendly: 'Excellent for families, safe area, nearby amenities'
        },
        photo_tips: {
          easy_shooting_tips: 'Use leading lines from fountain, try different heights on stairs, frame tower between trees',
          where_to_stand: 'Center esplanade for classic view, stairs for elevation, fountain area for foreground',
          common_mistakes: 'Shooting only from center, ignoring foreground elements, not checking backgrounds',
          social_media_ready: 'Use #TrocaderoGardens #EiffelTower #ParisViews hashtags'
        },
        local_context: {
          why_visit: 'Most photographed Eiffel Tower viewpoint, historic gardens, cultural significance',
          photo_etiquette: 'Be mindful of other photographers, don\'t block walkways for long periods',
          interacting_with_locals: 'Street performers present, tip if you photograph them'
        },
        practical_info: {
          nearby_conveniences: 'Cafés, restrooms, souvenir shops, Palais de Chaillot museums',
          other_photo_spots: 'Pont de Bir-Hakeim, Champ de Mars, Seine riverbank',
          where_to_stay: 'Hotels in 16th arrondissement for walking distance'
        },
        helpful_resources: {
          tourist_information: 'Paris tourism office, official city website',
          booking_requirements: 'No booking needed for gardens access',
          emergency_contacts: 'Police: 17, Medical: 15, Tourist helpline: +33 1 42 96 70 00'
        },
        photogenic_score: 0.95,
        confidence_score: 0.92,
        evidence_score: 0.88,
        evidence_items: [
          {
            title: 'Best Eiffel Tower Photo Spots - Paris Tourism',
            snippet: 'Trocadéro Gardens offers the most iconic view of the Eiffel Tower, especially beautiful at sunrise and sunset',
            url: 'https://www.parisinfo.com/eiffel-tower-photos',
            relevance: 'web_search_result'
          },
          {
            title: 'Instagram Photography Guide Paris',
            snippet: 'The Trocadéro esplanade is the #1 spot for Eiffel Tower photos, with perfect symmetry and framing',
            url: 'https://www.instagram-paris-guide.com/trocadero',
            relevance: 'web_search_result'
          }
        ],
        verification_query: 'Trocadéro Gardens Eiffel Tower photography best viewpoint',
        source_model: 'gpt-4',
        processing_timestamp: Date.now()
      },
      {
        rank: 2,
        location_name: {
          primary_name: 'Pont Alexandre III',
          alternative_names: ['Alexander III Bridge']
        },
        location_details: {
          accessibility: 'Metro Line 8 to Invalides or Line 1 to Champs-Élysées, 5-minute walk',
          entry_requirements: 'Free access, pedestrian walkways available'
        },
        photo_worthiness: {
          why_instagram_worthy: 'Paris\' most ornate bridge with golden statues, perfect for romantic and architectural photography',
          best_photo_opportunities: 'Bridge architecture shots, Seine reflections, golden statue details, romantic couple photos',
          signature_views: 'Full bridge span from riverbank, statue close-ups, Invalides dome in background'
        },
        timing_conditions: {
          best_time_of_year: 'May-September for best light, autumn for golden colors',
          optimal_time_of_day: 'Golden hour (6-8PM), blue hour for bridge lighting',
          weather_considerations: 'Sunny weather highlights golden details, overcast can create moody atmosphere'
        },
        equipment_recommendations: {
          smartphone_tips: 'Use HDR mode for high contrast scenes, portrait mode for statue details',
          basic_camera_users: 'Wide angle lens for full bridge, telephoto for statue compression',
          helpful_accessories: 'Circular polarizing filter for reflections, sturdy tripod for long exposures',
          what_not_to_bring: 'Avoid bulky equipment on busy bridge walkways'
        },
        travel_logistics: {
          how_easy_to_reach: 'Easy access from multiple metro lines, central location',
          time_needed: '45 minutes to 1 hour for comprehensive shots',
          busy_times_to_avoid: 'Rush hours (8-9AM, 5-7PM), weekend afternoons',
          family_friendly: 'Good for families, wide walkways, interesting architecture for kids'
        },
        photo_tips: {
          easy_shooting_tips: 'Use bridge lines for composition, capture reflections in Seine, try symmetrical shots',
          where_to_stand: 'Center of bridge for symmetry, riverbank for full view, statue bases for details',
          common_mistakes: 'Ignoring the ornate details, not using the Seine for reflections, crowded compositions',
          social_media_ready: 'Use #PontAlexandreIII #ParisArchitecture #SeineRiver hashtags'
        },
        local_context: {
          why_visit: 'Most beautiful bridge in Paris, Belle Époque architecture, connects major landmarks',
          photo_etiquette: 'Don\'t climb on statues, be respectful of other pedestrians',
          interacting_with_locals: 'Popular with Parisians for evening walks, friendly atmosphere'
        },
        practical_info: {
          nearby_conveniences: 'Invalides complex, Grand Palais, riverside cafés',
          other_photo_spots: 'Pont Neuf, Pont des Arts area, Invalides dome',
          where_to_stay: 'Hotels in 7th or 8th arrondissement for easy access'
        },
        helpful_resources: {
          tourist_information: 'Bridge history at Invalides museum, city architecture tours',
          booking_requirements: 'No booking required for bridge access',
          emergency_contacts: 'Police: 17, Medical: 15, Tourist helpline: +33 1 42 96 70 00'
        },
        photogenic_score: 0.89,
        confidence_score: 0.87,
        evidence_score: 0.82,
        evidence_items: [
          {
            title: 'Most Beautiful Bridges in Paris Photography',
            snippet: 'Pont Alexandre III is considered the most photogenic bridge in Paris with its ornate Belle Époque design',
            url: 'https://www.paris-photography.com/bridges',
            relevance: 'web_search_result'
          }
        ],
        verification_query: 'Pont Alexandre III Paris photography beautiful bridge',
        source_model: 'gpt-4',
        processing_timestamp: Date.now()
      },
      {
        rank: 3,
        location_name: {
          primary_name: 'Montmartre Sacré-Cœur Steps',
          alternative_names: ['Sacred Heart Basilica Steps']
        },
        location_details: {
          accessibility: 'Metro Line 12 to Abbesses, funicular or stairs to basilica',
          entry_requirements: 'Free access to steps and exterior areas'
        },
        photo_worthiness: {
          why_instagram_worthy: 'Panoramic Paris views, iconic white basilica, charming Montmartre atmosphere perfect for wide shots and street photography',
          best_photo_opportunities: 'City panorama shots, basilica architecture, street artist scenes, sunset over Paris',
          signature_views: 'Paris skyline from steps, basilica facade, Montmartre village streets'
        },
        timing_conditions: {
          best_time_of_year: 'April-October for clear views, winter for fewer crowds',
          optimal_time_of_day: 'Sunset (7-9PM) for city lights, early morning (8-10AM) for soft light',
          weather_considerations: 'Clear days essential for panoramic views, dramatic clouds add interest'
        },
        equipment_recommendations: {
          smartphone_tips: 'Use panorama mode for city views, portrait mode for basilica details',
          basic_camera_users: 'Wide angle for panoramas, telephoto for city compression',
          helpful_accessories: 'Comfortable shoes for stairs, portable tripod for low light',
          what_not_to_bring: 'Heavy equipment for the climb up'
        },
        travel_logistics: {
          how_easy_to_reach: 'Moderate - requires uphill walk or funicular ride',
          time_needed: '1-2 hours including climb and photography time',
          busy_times_to_avoid: 'Weekend afternoons, summer peak hours 11AM-5PM',
          family_friendly: 'Challenging for small children due to stairs, but rewarding views'
        },
        photo_tips: {
          easy_shooting_tips: 'Use steps as leading lines, capture both basilica and city, try different elevations',
          where_to_stand: 'Various step levels for different perspectives, side areas for basilica shots',
          common_mistakes: 'Only shooting from top, ignoring foreground elements, not exploring different angles',
          social_media_ready: 'Use #Montmartre #SacreCoeur #ParisViews #MontmartreSteps hashtags'
        },
        local_context: {
          why_visit: 'Historic artistic quarter, religious significance, best Paris panorama',
          photo_etiquette: 'Respect religious site, be mindful during services, tip street artists if photographing',
          interacting_with_locals: 'Artists and musicians frequent the area, vibrant creative community'
        },
        practical_info: {
          nearby_conveniences: 'Cafés, artist studios, souvenir shops, restrooms in basilica',
          other_photo_spots: 'Place du Tertre, Moulin Rouge, vineyard of Montmartre',
          where_to_stay: 'Montmartre hotels for authentic experience, or nearby arrondissements'
        },
        helpful_resources: {
          tourist_information: 'Montmartre tourist office, basilica visitor information',
          booking_requirements: 'No booking for exterior areas, dome access requires ticket',
          emergency_contacts: 'Police: 17, Medical: 15, Tourist helpline: +33 1 42 96 70 00'
        },
        photogenic_score: 0.91,
        confidence_score: 0.89,
        evidence_score: 0.85,
        evidence_items: [
          {
            title: 'Best Paris Viewpoints for Photography',
            snippet: 'Sacré-Cœur steps offer one of the best panoramic views of Paris, especially at sunset',
            url: 'https://www.paris-viewpoints.com/sacre-coeur',
            relevance: 'web_search_result'
          }
        ],
        verification_query: 'Sacré-Cœur Montmartre steps Paris photography viewpoint',
        source_model: 'gpt-4',
        processing_timestamp: Date.now()
      },
      {
        rank: 4,
        location_name: {
          primary_name: 'Seine River at Pont Neuf',
          alternative_names: ['New Bridge Area']
        },
        location_details: {
          accessibility: 'Metro Line 7 to Pont Neuf, direct bridge access',
          entry_requirements: 'Free access to bridge and riverbank areas'
        },
        photo_worthiness: {
          why_instagram_worthy: 'Historic bridge with perfect Seine reflections, classic Parisian architecture, and romantic riverside atmosphere',
          best_photo_opportunities: 'Bridge reflections, Seine boat traffic, historic architecture, romantic sunset shots',
          signature_views: 'Bridge arches from riverbank, full Seine perspective, Île de la Cité views'
        },
        timing_conditions: {
          best_time_of_year: 'Spring and summer for best light, autumn for golden reflections',
          optimal_time_of_day: 'Golden hour (6-8PM), blue hour for bridge lights and reflections',
          weather_considerations: 'Calm water ideal for reflections, light breeze creates interesting patterns'
        },
        equipment_recommendations: {
          smartphone_tips: 'Use reflection mode, try long exposure apps for water movement',
          basic_camera_users: 'Polarizing filter for reflections, neutral density for long exposures',
          helpful_accessories: 'Tripod for water shots, lens hood for glare reduction',
          what_not_to_bring: 'Avoid equipment that can\'t handle riverside moisture'
        },
        travel_logistics: {
          how_easy_to_reach: 'Very easy - central location with direct metro access',
          time_needed: '45 minutes to 1 hour for various angles and lighting',
          busy_times_to_avoid: 'Tourist boat peak times 10AM-6PM, weekend crowds',
          family_friendly: 'Excellent for families, safe walkways, interesting boat traffic'
        },
        photo_tips: {
          easy_shooting_tips: 'Use bridge arches for framing, capture boat wakes, try vertical compositions',
          where_to_stand: 'Riverbank for full bridge view, bridge center for Seine perspective',
          common_mistakes: 'Not waiting for good light, ignoring reflections, static compositions',
          social_media_ready: 'Use #PontNeuf #SeineRiver #ParisReflections hashtags'
        },
        local_context: {
          why_visit: 'Oldest bridge in Paris, historic significance, central to many landmarks',
          photo_etiquette: 'Be aware of boat traffic, don\'t block pedestrian flow',
          interacting_with_locals: 'Popular with locals for evening walks, fishing spots nearby'
        },
        practical_info: {
          nearby_conveniences: 'Samaritaine department store, Louvre nearby, riverside cafés',
          other_photo_spots: 'Île de la Cité, Notre-Dame area, Louvre from river',
          where_to_stay: '1st arrondissement for walking distance to multiple bridges'
        },
        helpful_resources: {
          tourist_information: 'Seine boat tour information, bridge history at city museums',
          booking_requirements: 'No booking required for bridge and riverbank access',
          emergency_contacts: 'Police: 17, Medical: 15, Tourist helpline: +33 1 42 96 70 00'
        },
        photogenic_score: 0.84,
        confidence_score: 0.86,
        evidence_score: 0.79,
        evidence_items: [
          {
            title: 'Seine River Photography Guide Paris',
            snippet: 'Pont Neuf offers classic Seine river shots with historic architecture and beautiful reflections',
            url: 'https://www.paris-river-photography.com/pont-neuf',
            relevance: 'web_search_result'
          }
        ],
        verification_query: 'Pont Neuf Seine river Paris photography reflections',
        source_model: 'gpt-4',
        processing_timestamp: Date.now()
      },
      {
        rank: 5,
        location_name: {
          primary_name: 'Louvre Pyramid Courtyard',
          alternative_names: ['Cour Napoléon']
        },
        location_details: {
          accessibility: 'Metro Line 1 or 7 to Palais-Royal, direct courtyard access',
          entry_requirements: 'Free access to courtyard, museum entry requires ticket'
        },
        photo_worthiness: {
          why_instagram_worthy: 'Iconic glass pyramid contrasts with classical architecture, perfect for modern vs. historic photography themes',
          best_photo_opportunities: 'Pyramid reflections, architectural contrast shots, geometric compositions, night illumination',
          signature_views: 'Pyramid from courtyard center, classical facade with pyramid, underground perspective'
        },
        timing_conditions: {
          best_time_of_year: 'Year-round excellent, summer for longer daylight, winter for dramatic skies',
          optimal_time_of_day: 'Blue hour (8-9PM) for pyramid lighting, early morning (8-10AM) for soft shadows',
          weather_considerations: 'Sunny weather creates interesting shadows, overcast good for even lighting'
        },
        equipment_recommendations: {
          smartphone_tips: 'Use grid lines for symmetry, try different angles around pyramid',
          basic_camera_users: 'Wide angle for full scene, telephoto for architectural details',
          helpful_accessories: 'Lens cleaning cloth for glass reflections, tripod for night shots',
          what_not_to_bring: 'Large tripods may be restricted in busy periods'
        },
        travel_logistics: {
          how_easy_to_reach: 'Very easy - major metro connections, central Paris location',
          time_needed: '30-45 minutes for exterior shots, longer if visiting museum',
          busy_times_to_avoid: 'Peak museum hours 10AM-4PM, weekend crowds',
          family_friendly: 'Excellent for families, educational value, safe environment'
        },
        photo_tips: {
          easy_shooting_tips: 'Use pyramid lines for composition, capture reflections in glass, try symmetrical shots',
          where_to_stand: 'Various courtyard positions for different pyramid angles, elevated areas for overview',
          common_mistakes: 'Only shooting from center, ignoring surrounding architecture, not using reflections',
          social_media_ready: 'Use #LouvreMuseum #LouvreP pyramid #ParisArchitecture hashtags'
        },
        local_context: {
          why_visit: 'World\'s most visited museum, architectural icon, cultural significance',
          photo_etiquette: 'Respect museum rules, be mindful of crowds, no flash photography inside',
          interacting_with_locals: 'International tourist destination, multilingual staff available'
        },
        practical_info: {
          nearby_conveniences: 'Museum facilities, Tuileries Garden, underground shopping',
          other_photo_spots: 'Tuileries Garden, Pont des Arts area, Palais Royal',
          where_to_stay: '1st arrondissement for walking distance, luxury hotels nearby'
        },
        helpful_resources: {
          tourist_information: 'Louvre official website, museum visitor services',
          booking_requirements: 'No booking for courtyard, advance tickets recommended for museum',
          emergency_contacts: 'Police: 17, Medical: 15, Tourist helpline: +33 1 42 96 70 00'
        },
        photogenic_score: 0.87,
        confidence_score: 0.90,
        evidence_score: 0.83,
        evidence_items: [
          {
            title: 'Louvre Pyramid Photography Tips',
            snippet: 'The glass pyramid creates stunning architectural photography opportunities with its modern design against classical backdrop',
            url: 'https://www.louvre-photography.com/pyramid-tips',
            relevance: 'web_search_result'
          }
        ],
        verification_query: 'Louvre pyramid courtyard photography architectural shots',
        source_model: 'gpt-4',
        processing_timestamp: Date.now()
      }
    ],
    'tokyo': [
      {
        rank: 1,
        location_name: {
          primary_name: 'Shibuya Crossing',
          alternative_names: ['Shibuya Scramble Crossing']
        },
        photo_worthiness: {
          why_instagram_worthy: 'World\'s busiest pedestrian crossing, perfect for capturing Tokyo\'s energy and urban life',
          best_photo_opportunities: 'Aerial crossing shots, street level crowd scenes, neon reflections, time-lapse potential',
          signature_views: 'Overhead crossing view, street level perspective, surrounding neon signs'
        },
        photogenic_score: 0.93,
        confidence_score: 0.91,
        evidence_score: 0.87,
        evidence_items: [],
        source_model: 'gpt-4',
        processing_timestamp: Date.now()
      },
      {
        rank: 2,
        location_name: {
          primary_name: 'Senso-ji Temple',
          alternative_names: ['Asakusa Temple']
        },
        photo_worthiness: {
          why_instagram_worthy: 'Tokyo\'s oldest temple with traditional architecture, perfect for cultural and spiritual photography',
          best_photo_opportunities: 'Temple architecture, traditional ceremonies, lantern details, garden scenes',
          signature_views: 'Main hall facade, five-story pagoda, Nakamise shopping street approach'
        },
        photogenic_score: 0.88,
        confidence_score: 0.89,
        evidence_score: 0.84,
        evidence_items: [],
        source_model: 'gpt-4',
        processing_timestamp: Date.now()
      }
    ],
    'london': [
      {
        rank: 1,
        location_name: {
          primary_name: 'Tower Bridge',
          alternative_names: ['London Bridge']
        },
        photo_worthiness: {
          why_instagram_worthy: 'Iconic Victorian Gothic bridge, perfect for architectural and Thames river photography',
          best_photo_opportunities: 'Bridge architecture, Thames reflections, sunset silhouettes, bridge opening ceremonies',
          signature_views: 'Full bridge from south bank, Tower of London context, bridge walkway perspective'
        },
        photogenic_score: 0.90,
        confidence_score: 0.88,
        evidence_score: 0.85,
        evidence_items: [],
        source_model: 'gpt-4',
        processing_timestamp: Date.now()
      }
    ]
  }), []); // Empty dependency array since this is static mock data

  // Load hotspots data when destination changes
  useEffect(() => {
    if (selectedDestination) {
      setLoading(true);
      
      // Handle different destination key formats
      const normalizeDestinationKey = (destination) => {
        const key = destination.toLowerCase();
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
      
      const destinationKey = normalizeDestinationKey(selectedDestination);
      const destinationHotspots = mockHotspots[destinationKey] || [];
      
      setHotspots(destinationHotspots);
      setFilteredHotspots(destinationHotspots);
      setLoading(false);
    }
  }, [selectedDestination, mockHotspots]);

  // Filter hotspots based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHotspots(hotspots);
    } else {
      const filtered = hotspots.filter(hotspot => {
        const searchLower = searchTerm.toLowerCase();
        const name = hotspot.location_name?.primary_name || hotspot.location_name || '';
        const description = hotspot.photo_worthiness?.why_instagram_worthy || '';
        const opportunities = hotspot.photo_worthiness?.best_photo_opportunities || '';
        
        return name.toLowerCase().includes(searchLower) ||
               description.toLowerCase().includes(searchLower) ||
               opportunities.toLowerCase().includes(searchLower);
      });
      setFilteredHotspots(filtered);
    }
  }, [searchTerm, hotspots]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Discovering photogenic hotspots...</p>
        </div>
      </div>
    );
  }

  // No destination selected
  if (!selectedDestination) {
    return (
      <div className="text-center py-12">
        <CameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Destination</h3>
        <p className="text-gray-600">Choose a destination to discover its most photogenic hotspots</p>
      </div>
    );
  }

  // No hotspots found
  if (hotspots.length === 0) {
    return (
      <div className="text-center py-12">
        <CameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Photogenic Hotspots Found</h3>
        <p className="text-gray-600">
          No photogenic hotspots available for {selectedDestination}. Try selecting a different destination.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-2 border-l-2 border-cyan-400">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-gray-900">
            Discover the most Instagram-worthy and photogenic locations in {selectedDestination}. Perfect for capturing stunning memories with your smartphone or camera.
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{hotspots.length}</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Top Hotspots</div>
                <div className="text-xs text-gray-500">Available insights</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">
                {hotspots.length > 0 ? (hotspots.reduce((sum, h) => sum + h.photogenic_score, 0) / hotspots.length).toFixed(1) : '0.0'}
              </div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Avg Photogenic Score</div>
                <div className="text-xs text-gray-500">Photography quality</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">
                {hotspots.filter(h => h.evidence_score >= 0.8).length}
              </div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Verified Locations</div>
                <div className="text-xs text-gray-500">Evidence backed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search photogenic hotspots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="text-sm text-gray-600">
          {filteredHotspots.length} of {hotspots.length} hotspots match your search
        </div>
      )}

      {/* Hotspots Grid */}
      {filteredHotspots.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredHotspots.map((hotspot, index) => (
            <PhotogenicHotspotCard
              key={`${hotspot.location_name?.primary_name || hotspot.location_name}-${index}`}
              hotspot={hotspot}
              onEvidenceClick={onEvidenceClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Hotspots</h3>
          <p className="text-gray-600">
            No photogenic hotspots match your search criteria. Try adjusting your search terms.
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotogenicHotspotsTab;
