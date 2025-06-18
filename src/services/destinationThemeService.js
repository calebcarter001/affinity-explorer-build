// Data Loader Service
// Handles loading and caching of destination theme and evidence data

import { DESTINATION_CONFIG } from '../config/appConfig.js';

class DataLoader {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = DESTINATION_CONFIG.CACHE_TIMEOUT;
    this.dataPath = DESTINATION_CONFIG.DATA_PATH;
    this.availableDestinations = DESTINATION_CONFIG.AVAILABLE_DESTINATIONS;
    this.validateOnLoad = DESTINATION_CONFIG.VALIDATE_DATA_ON_LOAD;
  }

  /**
   * Load destination data (themes and evidence)
   * @param {string} destinationId - e.g., 'new_york__usa', 'paris__france', 'tokyo__japan'
   * @returns {Promise<{themes: Object, evidence: Object}>}
   */
  async loadDestination(destinationId) {
    // Validate destination is configured
    const destinationConfig = this.getDestinationConfig(destinationId);
    if (!destinationConfig) {
      throw new Error(`Destination '${destinationId}' is not configured. Available destinations: ${this.availableDestinations.map(d => d.id).join(', ')}`);
    }

    const cacheKey = `destination_${destinationId}`;
    
    // Return cached data if available
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`Loading ${destinationId} from cache`);
        return cached.data;
      }
    }

    try {
      // Load enhanced themes data using configured file name
      const enhancedPath = `${this.dataPath}${destinationConfig.dataFiles.enhanced}`;
      const enhancedResponse = await fetch(enhancedPath);
      if (!enhancedResponse.ok) {
        throw new Error(`Failed to load enhanced data from ${enhancedPath}: ${enhancedResponse.status}`);
      }
      const enhancedData = await enhancedResponse.json();

      // Load evidence data using configured file name
      let evidenceData = null;
      try {
        const evidencePath = `${this.dataPath}${destinationConfig.dataFiles.evidence}`;
        const evidenceResponse = await fetch(evidencePath);
        if (evidenceResponse.ok) {
          evidenceData = await evidenceResponse.json();
        } else {
          console.warn(`Evidence data not available at ${evidencePath}: ${evidenceResponse.status}`);
        }
      } catch (error) {
        console.warn(`Evidence data not available for ${destinationId}:`, error);
      }

      // Validate data if configured to do so
      if (this.validateOnLoad) {
        this._validateThemeData(enhancedData);
        if (evidenceData) {
          this._validateEvidenceData(evidenceData);
        }
      }

      // Process and normalize the data
      const processedData = this.processThemeData(enhancedData, evidenceData);

      // Cache the result
      this.cache.set(cacheKey, {
        data: processedData,
        timestamp: Date.now()
      });

      console.log(`Loaded ${processedData.length} themes for ${destinationId} from configuration`);
      return processedData;

    } catch (error) {
      console.error(`Error loading destination data for ${destinationId}:`, error);
      throw error;
    }
  }

  /**
   * Internal method to load destination data from files
   * @private
   */
  async _loadDestinationData(destinationId) {
    try {
      // Load both theme and evidence data in parallel
      const [themesResponse, evidenceResponse] = await Promise.all([
        fetch(`/data/${destinationId}_enhanced.json`),
        fetch(`/data/${destinationId}_evidence.json`)
      ]);

      if (!themesResponse.ok) {
        throw new Error(`Failed to load themes for ${destinationId}: ${themesResponse.statusText}`);
      }

      if (!evidenceResponse.ok) {
        throw new Error(`Failed to load evidence for ${destinationId}: ${evidenceResponse.statusText}`);
      }

      const [themes, evidence] = await Promise.all([
        themesResponse.json(),
        evidenceResponse.json()
      ]);

      // Validate data structure
      this._validateThemeData(themes);
      this._validateEvidenceData(evidence);

      return {
        themes,
        evidence,
        loadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error loading destination data for ${destinationId}:`, error);
      throw new Error(`Failed to load destination data: ${error.message}`);
    }
  }

  /**
   * Get available destinations from configuration
   * @returns {Array<{id: string, name: string, flag: string}>}
   */
  getAvailableDestinations() {
    return this.availableDestinations;
  }

  /**
   * Get configuration for a specific destination
   * @param {string} destinationId 
   * @returns {Object|null}
   */
  getDestinationConfig(destinationId) {
    return this.availableDestinations.find(dest => dest.id === destinationId) || null;
  }

  /**
   * Get default destination from configuration
   * @returns {string}
   */
  getDefaultDestination() {
    return DESTINATION_CONFIG.DEFAULT_DESTINATION;
  }

  /**
   * Validate that all configured destinations have their data files available
   * @returns {Promise<Array<{destination: string, status: string, error?: string}>>}
   */
  async validateAllDestinations() {
    const results = [];
    
    for (const destination of this.availableDestinations) {
      try {
        const enhancedPath = `${this.dataPath}${destination.dataFiles.enhanced}`;
        const evidencePath = `${this.dataPath}${destination.dataFiles.evidence}`;
        
        const [enhancedResponse, evidenceResponse] = await Promise.all([
          fetch(enhancedPath),
          fetch(evidencePath)
        ]);

        const status = {
          destination: destination.id,
          enhanced: enhancedResponse.ok,
          evidence: evidenceResponse.ok,
          status: enhancedResponse.ok && evidenceResponse.ok ? 'available' : 'partial'
        };

        if (!enhancedResponse.ok) {
          status.error = `Enhanced data not found at ${enhancedPath}`;
        } else if (!evidenceResponse.ok) {
          status.error = `Evidence data not found at ${evidencePath}`;
        }

        results.push(status);
      } catch (error) {
        results.push({
          destination: destination.id,
          status: 'error',
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Preload all destinations
   * @returns {Promise<void>}
   */
  async preloadAll() {
    const destinations = this.getAvailableDestinations();
    const loadPromises = destinations.map(dest => 
      this.loadDestination(dest.key).catch(error => {
        console.warn(`Failed to preload ${dest.name}:`, error);
        return null;
      })
    );
    
    await Promise.all(loadPromises);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Validate theme data structure
   * @private
   */
  _validateThemeData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid theme data structure');
    }

    if (!data.destination || !Array.isArray(data.affinities)) {
      throw new Error('Theme data missing required fields (destination, affinities)');
    }

    // Validate at least one theme exists
    if (data.affinities.length === 0) {
      throw new Error('No themes found in data');
    }

    // Validate theme structure
    data.affinities.forEach((theme, index) => {
      if (!theme.theme || !theme.category) {
        throw new Error(`Theme at index ${index} missing required fields`);
      }
    });
  }

  /**
   * Validate evidence data structure
   * @private
   */
  _validateEvidenceData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid evidence data structure');
    }

    if (!data.destination_name || !data.theme_evidence) {
      throw new Error('Evidence data missing required fields');
    }
  }

  /**
   * Get cache statistics
   * @returns {Object}
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Process and normalize theme data from different possible structures
  processThemeData(enhancedData, evidenceData) {
    let themes = [];

    // Handle different possible data structures
    if (enhancedData.affinities) {
      // Structure: { affinities: [...] } - This is the actual structure
      themes = enhancedData.affinities;
    } else if (enhancedData.themes && enhancedData.themes.affinities) {
      // Structure: { themes: { affinities: [...] } }
      themes = enhancedData.themes.affinities;
    } else if (Array.isArray(enhancedData)) {
      // Structure: [theme1, theme2, ...]
      themes = enhancedData;
    } else if (enhancedData.destination_themes) {
      // Structure: { destination_themes: [...] }
      themes = enhancedData.destination_themes;
    } else {
      console.warn('Unknown data structure, attempting to extract themes');
      themes = [];
    }

    console.log(`Found ${themes.length} themes in data structure`);
    
    // Normalize each theme to a consistent structure
    return themes.map((theme, index) => this.normalizeTheme(theme, index, evidenceData));
  }

  // Normalize a theme object to a consistent structure
  normalizeTheme(theme, index, evidenceData) {
    const normalized = {
      id: theme.id || theme.theme || `theme_${index}`,
      name: theme.name || theme.theme || `Theme ${index + 1}`,
      description: theme.description || theme.rationale || '',
      category: theme.category || 'experience',
      confidence: theme.confidence || 0.85,
      
      // Sub-themes and nano themes
      subThemes: theme.subThemes || theme.sub_themes || [],
      nanoThemes: theme.nanoThemes || theme.nano_themes || [],
      
      // Attributes
      bestFor: theme.bestFor || this.extractBestFor(theme),
      timeNeeded: theme.timeNeeded || this.extractTimeNeeded(theme),
      intensity: theme.intensity || this.extractIntensity(theme),
      priceRange: theme.priceRange || theme.price_point || 'Mid',
      emotions: theme.emotions || this.extractEmotions(theme),
      bestSeason: theme.bestSeason || this.extractBestSeason(theme),
      culturalSensitivity: theme.culturalSensitivity || this.extractCulturalSensitivity(theme),
      
      // Advanced metadata
      sourceQuality: theme.sourceQuality || this.generateSourceQuality(),
      emotionalProfile: theme.emotionalProfile || theme.emotional_profile || this.generateEmotionalProfile(theme),
      intelligenceBadges: theme.intelligenceBadges || this.generateIntelligenceBadges(theme),
      
      // Keep original data for evidence system
      originalData: theme,
      evidenceData: evidenceData
    };

    return normalized;
  }

  // Helper methods to extract data from different structures
  extractBestFor(theme) {
    if (theme.contextual_info?.demographic_suitability) {
      return Array.isArray(theme.contextual_info.demographic_suitability) 
        ? theme.contextual_info.demographic_suitability.join(', ')
        : theme.contextual_info.demographic_suitability;
    }
    return 'All travelers';
  }

  extractTimeNeeded(theme) {
    return theme.contextual_info?.time_commitment || 'Flexible';
  }

  extractIntensity(theme) {
    return theme.experience_intensity?.overall_intensity || 'Moderate';
  }

  extractEmotions(theme) {
    if (theme.emotional_profile?.primary_emotions) {
      return theme.emotional_profile.primary_emotions;
    }
    return ['inspiring'];
  }

  extractBestSeason(theme) {
    if (theme.seasonality?.peak) {
      return Array.isArray(theme.seasonality.peak) 
        ? theme.seasonality.peak.join(', ')
        : theme.seasonality.peak;
    }
    return 'Year-round';
  }

  extractCulturalSensitivity(theme) {
    if (theme.cultural_sensitivity?.considerations) {
      return Array.isArray(theme.cultural_sensitivity.considerations)
        ? theme.cultural_sensitivity.considerations.join(', ')
        : theme.cultural_sensitivity.considerations;
    }
    return null;
  }

  // Generate mock data for missing fields
  generateSourceQuality() {
    return {
      authority: 0.8 + Math.random() * 0.2,
      relevance: 0.85 + Math.random() * 0.15,
      recency: 0.7 + Math.random() * 0.3
    };
  }

  generateEmotionalProfile(theme) {
    const emotions = theme.emotional_profile || {};
    const defaultProfile = {
      inspiring: 0.8,
      peaceful: 0.6,
      exciting: 0.7,
      contemplative: 0.5
    };
    
    return Object.keys(emotions).length > 0 ? emotions : defaultProfile;
  }

  generateIntelligenceBadges(theme) {
    const badges = ['📊 nano'];
    
    if (theme.category === 'culture') {
      badges.push('🌟 local influenced');
    } else {
      badges.push('🌟 balanced');
    }
    
    badges.push('⭐ off beaten path');
    
    const emotions = this.extractEmotions(theme);
    if (emotions.length > 0) {
      badges.push(`✨ ${emotions[0]}`);
    }
    
    return badges;
  }
}

// Create singleton instance
export const dataLoader = new DataLoader();

// Export class for testing
export { DataLoader }; 