import React, { useState, useEffect } from 'react';
import { dataLoader } from '../services/destinationThemeService';
import DestinationThemeCard from '../components/destinations/DestinationThemeCard';
import EvidenceModal from '../components/destinations/EvidenceModal';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { DESTINATION_CONFIG } from '../config/appConfig';

const DestinationInsightsPage = () => {
  const [selectedDestination, setSelectedDestination] = useState(DESTINATION_CONFIG.DEFAULT_DESTINATION);
  const [themes, setThemes] = useState([]);
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

  // Load themes when destination changes
  useEffect(() => {
    const loadThemes = async () => {
      if (!selectedDestination) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Loading themes for', selectedDestination);
        const data = await dataLoader.loadDestination(selectedDestination);
        console.log('Loaded theme data:', data);
        console.log('Sample theme:', data[0]); // Log first theme to verify structure
        console.log('Data source: Real JSON files from configuration');
        setThemes(data || []);
      } catch (err) {
        console.error('Error loading themes:', err);
        setError(`Failed to load destination themes: ${err.message}`);
        setThemes([]);
      } finally {
        setLoading(false);
      }
    };

    loadThemes();
  }, [selectedDestination]);

  // Filter themes based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredThemes(themes);
    } else {
      const filtered = themes.filter(theme =>
        theme.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.rationale?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredThemes(filtered);
    }
  }, [themes, searchTerm]);

  const handleDestinationChange = (destinationId) => {
    setSelectedDestination(destinationId);
    setSearchTerm(''); // Clear search when changing destinations
  };

  const handleEvidenceClick = (context) => {
    console.log('Evidence clicked:', context);
    setEvidenceModal({
      isOpen: true,
      context,
      theme: context.theme || themes.find(t => t.name === context.themeId || t.theme === context.themeId)
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

  // Calculate stats
  const stats = {
    totalThemes: themes.length,
    avgScore: themes.length > 0 ? 
      Math.round((themes.reduce((sum, theme) => sum + (theme.confidence || 0), 0) / themes.length) * 100) : 0,
    coverage: Math.round((filteredThemes.length / Math.max(themes.length, 1)) * 100),
    subThemes: themes.reduce((sum, theme) => sum + (theme.sub_themes?.length || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Enhanced Destination Themes</h1>
            <p className="mt-2 text-gray-600">
              Explore evidence-backed destination insights with interactive proof points
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8">
          {/* Destination Selector & Search - Prominent */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              {/* Left side - Destination Selection */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <MapPinIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-1">
                      Choose Your Destination
                    </h3>
                    <p className="text-sm text-blue-700">
                      Start by selecting a destination to explore its themes
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                                  <select
                  id="destination"
                  value={selectedDestination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  className="text-lg font-medium px-4 py-3 bg-white border-2 border-blue-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none min-w-[200px]"
                >
                  {destinations.map(dest => {
                    const validation = dataValidation?.find(v => v.destination === dest.id);
                    const isAvailable = validation?.status === 'available';
                    const hasIssues = validation && validation.status !== 'available';
                    
                    return (
                      <option key={dest.id} value={dest.id} disabled={hasIssues}>
                        {dest.flag} {dest.name} {hasIssues ? '⚠️' : ''}
                      </option>
                    );
                  })}
                </select>
                </div>
              </div>

              {/* Right side - Search */}
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search themes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-blue-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        {selectedDestinationData && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalThemes}</div>
                <div className="ml-2">
                  <div className="text-sm font-medium text-gray-900">Total Themes</div>
                  <div className="text-xs text-gray-500">Available insights</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-green-600">{stats.avgScore}%</div>
                <div className="ml-2">
                  <div className="text-sm font-medium text-gray-900">Avg Score</div>
                  <div className="text-xs text-gray-500">Confidence level</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-purple-600">{stats.coverage}%</div>
                <div className="ml-2">
                  <div className="text-sm font-medium text-gray-900">Coverage</div>
                  <div className="text-xs text-gray-500">Search results</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-orange-600">{stats.subThemes}</div>
                <div className="ml-2">
                  <div className="text-sm font-medium text-gray-900">Sub-themes</div>
                  <div className="text-xs text-gray-500">Detailed insights</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading destination themes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800 font-medium">Error</div>
            <div className="text-red-600 text-sm mt-1">{error}</div>
          </div>
        )}

        {/* Themes Grid */}
        {!loading && !error && (
          <>
            {filteredThemes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredThemes.map((theme, index) => (
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
      </div>

      {/* Evidence Modal */}
      <EvidenceModal
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