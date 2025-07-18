// Data Loader Service
// Handles loading and caching of destination theme and evidence data

import { DESTINATION_CONFIG } from '../config/appConfig';

class DataLoader {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = DESTINATION_CONFIG.CACHE_TIMEOUT;
    this.dataPath = DESTINATION_CONFIG.DATA_PATH;
    this.availableDestinations = DESTINATION_CONFIG.AVAILABLE_DESTINATIONS;
    this.validateOnLoad = DESTINATION_CONFIG.VALIDATE_DATA_ON_LOAD;
    this.exportConfig = DESTINATION_CONFIG.EXPORT_DATA_CONFIG;
  }

  /**
   * Enhanced destination loading with export data only
   * @param {string} destinationId 
   * @returns {Promise<Object>}
   */
  async loadDestination(destinationId) {
    const cacheKey = `destination_${destinationId}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`Using cached data for ${destinationId}`);
        return cached.data;
      }
    }

    try {
      // Load export data (only format we support now)
      const exportData = await this.loadExportData(destinationId);
      if (exportData) {
        const transformedData = this.transformExportData(exportData);
      this.cache.set(cacheKey, {
          data: transformedData,
        timestamp: Date.now()
      });
        console.log(`Loaded export data for ${destinationId}`);
        return transformedData;
      }
      
      throw new Error(`No export data available for destination: ${destinationId}`);
      
    } catch (err) {
      console.error('Error loading destination data:', err);
      throw new Error(`Failed to load destination data: ${err.message}`);
    }
  }

  /**
   * Load export data from the new format
   * @param {string} destinationId 
   * @returns {Promise<Object|null>}
   */
  async loadExportData(destinationId) {
    const destinationConfig = this.getDestinationConfig(destinationId);
    if (!destinationConfig) {
      console.error(`[Debug] No config found for destinationId: ${destinationId}`);
      return null;
    }

    const completeDataPath = `export/${destinationId}/data/${destinationId}_complete.json`;
    console.log(`[Debug] Attempting to load complete data from: ${this.dataPath}${completeDataPath}`);
    
    try {
      const completeResponse = await fetch(`${this.dataPath}${completeDataPath}`);
      console.log(`[Debug] Fetch response status for ${completeDataPath}: ${completeResponse.status}`);
      
      if (completeResponse.ok) {
        const completeData = await completeResponse.json();
        console.log('[Debug] Successfully parsed complete data JSON.');
        console.log('[Debug] Complete data structure keys:', Object.keys(completeData));
        console.log('[Debug] Consolidated data keys:', Object.keys(completeData.consolidated_data || {}));
        
        const exportData = {
          themes: completeData.consolidated_data?.themes,
          nuances: completeData.consolidated_data?.nuances,
          evidence: completeData.consolidated_data?.evidence,
          similarDestinations: completeData.consolidated_data?.similar_destinations,
          metadata: completeData.consolidated_data?.metadata,
          dataType: 'complete_export'
        };
        
        console.log('[Debug] Export data structure:', {
          hasThemes: !!exportData.themes,
          hasNuances: !!exportData.nuances,
          hasEvidence: !!exportData.evidence,
          hasSimilarDestinations: !!exportData.similarDestinations,
          hasMetadata: !!exportData.metadata
        });

        return exportData;
      }
    } catch (error) {
      console.error(`[Debug] Error loading or parsing complete data for ${destinationId}:`, error);
    }

    // Fallback to separate files (this part should not be hit if complete data exists)
    console.log(`[Debug] Falling back to separate files for ${destinationId}`);
    const { themes: themesPath, nuances: nuancesPath, evidence: evidencePath } = destinationConfig.dataFiles;
    
    try {
      // Load all three files in parallel with better error handling
      const [themesResponse, nuancesResponse, evidenceResponse] = await Promise.all([
        fetch(`${this.dataPath}${themesPath}`).catch(err => ({ ok: false, status: 404, error: err })),
        fetch(`${this.dataPath}${nuancesPath}`).catch(err => ({ ok: false, status: 404, error: err })),
        fetch(`${this.dataPath}${evidencePath}`).catch(err => ({ ok: false, status: 404, error: err }))
      ]);

      // Check if any responses failed
      if (!themesResponse.ok || !nuancesResponse.ok || !evidenceResponse.ok) {
        const failedFiles = [];
        if (!themesResponse.ok) failedFiles.push(`themes (${themesResponse.status})`);
        if (!nuancesResponse.ok) failedFiles.push(`nuances (${nuancesResponse.status})`);
        if (!evidenceResponse.ok) failedFiles.push(`evidence (${evidenceResponse.status})`);
        throw new Error(`Missing files: ${failedFiles.join(', ')}`);
      }

      // Parse JSON with better error handling
      const [themesData, nuancesData, evidenceData] = await Promise.all([
        themesResponse.json().catch(err => {
          console.error(`Failed to parse themes.json for ${destinationId}:`, err);
          throw new Error(`Invalid themes JSON: ${err.message}`);
        }),
        nuancesResponse.json().catch(err => {
          console.error(`Failed to parse nuances.json for ${destinationId}:`, err);
          throw new Error(`Invalid nuances JSON: ${err.message}`);
        }),
        evidenceResponse.json().catch(err => {
          console.error(`Failed to parse evidence.json for ${destinationId}:`, err);
          throw new Error(`Invalid evidence JSON: ${err.message}`);
        })
      ]);

      return {
        themes: themesData,
        nuances: nuancesData,
        evidence: evidenceData,
        similarDestinations: null, // Not available in separate files format
        dataType: 'export'
      };
    } catch (error) {
      console.warn(`Failed to load export data for ${destinationId}:`, error.message);
      return null;
    }
  }

  /**
   * Transform export data to application format
   * @param {Object} exportData 
   * @returns {Object}
   */
  transformExportData(exportData) {
    console.log('[Debug] transformExportData received:', exportData);
    const { themes, nuances, evidence, similarDestinations, metadata, dataType } = exportData;
    
    // Since the import script now properly structures the data, we can access it directly
    const themeData = themes || {};
    const nuanceData = nuances || {};
    const evidenceData = evidence || {};
    const similarDestData = similarDestinations || {};
    
    console.log('[Debug] Data structure keys:', {
      themes: Object.keys(themeData),
      nuances: Object.keys(nuanceData),
      similarDest: Object.keys(similarDestData)
    });

    // Extract themes from the properly structured data
    const themesArray = themeData.themes_data?.affinities || [];
    console.log('[Debug] Themes array found:', themesArray.length, 'themes');

    const transformed = {
      themes: this.transformExportThemes(themesArray),
      nuances: this.transformExportNuances(nuanceData),
      evidence: evidenceData.evidence_data?.evidence || [],
      similarDestinations: this.transformSimilarDestinations(similarDestData),
      intelligenceInsights: themeData.themes_data?.intelligence_insights || {},
      dataType: dataType,
      metadata: {
        destination: metadata?.destination || themeData?.destination,
        exportVersion: metadata?.enhanced_metadata?.export_version || themes?.export_metadata?.export_version,
        schemaVersion: metadata?.enhanced_metadata?.schema_version || themes?.export_metadata?.schema_version,
        processingMetadata: metadata
      }
    };
    
    const totalNuances = (transformed.nuances?.destination_nuances?.length || 0) + 
                        (transformed.nuances?.hotel_expectations?.length || 0) + 
                        (transformed.nuances?.vacation_rental_expectations?.length || 0);
    
    console.log('[Debug] Data after transformation:', {
      themesCount: transformed.themes?.length || 0,
      nuancesCount: totalNuances,
      nuancesBreakdown: {
        destination: transformed.nuances?.destination_nuances?.length || 0,
        hotel: transformed.nuances?.hotel_expectations?.length || 0,
        vacation_rental: transformed.nuances?.vacation_rental_expectations?.length || 0
      },
      evidenceCount: transformed.evidence?.length || 0,
      similarDestinationsCount: transformed.similarDestinations?.similarDestinations?.length || 0
    });
    return transformed;
  }

  /**
   * Transform export themes to application format
   * @param {Array} exportThemes 
   * @returns {Array}
   */
  transformExportThemes(exportThemes) {
    return exportThemes.map(theme => ({
      // Preserve existing structure for backward compatibility
      id: theme.theme || `theme_${Math.random().toString(36).substr(2, 9)}`,
      name: theme.theme,
      theme: theme.theme,
      category: theme.category,
      confidence: theme.confidence || 0.5,
      rationale: theme.rationale,
      description: theme.rationale,
      
      // Enhanced data from export
      sub_themes: theme.sub_themes || [],
      nano_themes: theme.nano_themes || [],
      subThemes: theme.sub_themes || [],
      nanoThemes: theme.nano_themes || [],
      
      // Intelligence analysis
      depth_analysis: theme.depth_analysis || {},
      authenticity_analysis: theme.authenticity_analysis || {},
      hidden_gem_score: theme.hidden_gem_score || {},
      emotional_profile: theme.emotional_profile || {},
      experience_intensity: theme.experience_intensity || {},
      cultural_sensitivity: theme.cultural_sensitivity || {},
      
      // Contextual information
      contextual_info: theme.contextual_info || {},
      seasonality: theme.seasonality || {},
      price_insights: theme.price_insights || {},
      traveler_types: theme.traveler_types || [],
      
      // Evidence data
      comprehensive_attribute_evidence: theme.comprehensive_attribute_evidence || {},
      
      // Processing metadata
      processing_metadata: theme.processing_metadata || {},
      
      // Derived fields for UI
      bestFor: this.extractBestFor(theme),
      timeNeeded: this.extractTimeNeeded(theme),
      intensity: this.extractIntensity(theme),
      priceRange: this.extractPriceRange(theme),
      emotions: this.extractEmotions(theme),
      bestSeason: this.extractBestSeason(theme),
      intelligenceBadges: this.generateIntelligenceBadges(theme)
    }));
  }

  /**
   * Transform export nuances to application format
   * @param {Object} nuancesData 
   * @returns {Object}
   */
  transformExportNuances(nuancesData) {
    console.log('[Debug] transformExportNuances received:', nuancesData);
    
    // Import script ensures proper structure, so we can access directly
    const nuances = nuancesData.nuances_data || {};
    
    const destinationNuances = nuances.destination_nuances || [];
    const hotelNuances = nuances.hotel_expectations || [];
    const vacationRentalNuances = nuances.vacation_rental_expectations || [];
    
    console.log('[Debug] Nuance counts from structured data:', {
      destination: destinationNuances.length,
      hotel: hotelNuances.length,
      vacation_rental: vacationRentalNuances.length
    });
    
    return {
      destination_nuances: destinationNuances,
      hotel_expectations: hotelNuances,
      vacation_rental_expectations: vacationRentalNuances,
      overall_nuance_quality_score: nuances.overall_nuance_quality_score || 0.8
    };
  }

  /**
   * Generate intelligence badges from theme data
   * @param {Object} theme 
   * @returns {Array}
   */
  generateIntelligenceBadges(theme) {
    const badges = [];
    
    // Depth badge
    if (theme.depth_analysis?.depth_level) {
      badges.push(`📊 ${theme.depth_analysis.depth_level}`);
    }
    
    // Authenticity badge
    if (theme.authenticity_analysis?.authenticity_level) {
      const level = theme.authenticity_analysis.authenticity_level;
      if (level === 'local_influenced') {
        badges.push('🌟 local influenced');
      } else {
        badges.push('⚖️ balanced');
      }
    }
    
    // Hidden gem badge
    if (theme.hidden_gem_score?.hidden_gem_level) {
      const level = theme.hidden_gem_score.hidden_gem_level;
      if (level === 'local favorite') {
        badges.push('⭐ local favorite');
      } else if (level === 'off the beaten path') {
        badges.push('🗺️ off beaten path');
      }
    }
    
    // Intensity badge
    if (theme.experience_intensity?.overall_intensity) {
      badges.push(`⚡ ${theme.experience_intensity.overall_intensity}`);
  }

    // Emotion badges
    if (theme.emotional_profile?.primary_emotions) {
      theme.emotional_profile.primary_emotions.forEach(emotion => {
        badges.push(`✨ ${emotion}`);
      });
    }
    
    return badges;
  }

  /**
   * Extract best for information
   * @param {Object} theme 
   * @returns {string}
   */
  extractBestFor(theme) {
    if (theme.contextual_info?.demographic_suitability) {
      return theme.contextual_info.demographic_suitability.join(', ');
    }
    return 'All travelers';
  }

  /**
   * Extract time needed information
   * @param {Object} theme 
   * @returns {string}
   */
  extractTimeNeeded(theme) {
    if (theme.contextual_info?.time_commitment) {
      return theme.contextual_info.time_commitment;
    }
    return 'Flexible';
  }

  /**
   * Extract intensity information
   * @param {Object} theme 
   * @returns {string}
   */
  extractIntensity(theme) {
    if (theme.experience_intensity?.overall_intensity) {
      return theme.experience_intensity.overall_intensity;
    }
    return 'Moderate';
  }

  /**
   * Extract price range information
   * @param {Object} theme 
   * @returns {string}
   */
  extractPriceRange(theme) {
    if (theme.price_insights?.price_category) {
      return theme.price_insights.price_category;
    }
    if (theme.price_point) {
      return theme.price_point;
    }
    return 'Mid';
  }

  /**
   * Extract emotions information
   * @param {Object} theme 
   * @returns {Array}
   */
  extractEmotions(theme) {
    if (theme.emotional_profile?.primary_emotions) {
      return theme.emotional_profile.primary_emotions;
    }
    return ['contemplative'];
  }

  /**
   * Extract best season information
   * @param {Object} theme 
   * @returns {string}
   */
  extractBestSeason(theme) {
    if (theme.seasonality?.peak) {
      return theme.seasonality.peak.join(', ');
    }
    return 'Year-round';
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
   * Validate data availability for a destination
   * @param {string} destinationId 
   * @returns {Promise<Object>}
   */
  async validateDestination(destinationId) {
    try {
      await this.loadDestination(destinationId);
      return {
        destination: destinationId,
        status: 'available',
        dataType: 'export'
      };
    } catch (error) {
    return {
        destination: destinationId,
        status: 'error',
        error: error.message
    };
  }
  }

  /**
   * Validate all destinations
   * @returns {Promise<Array>}
   */
  async validateAllDestinations() {
    const destinations = this.getAvailableDestinations();
    const validationPromises = destinations.map(dest => 
      this.validateDestination(dest.id).catch(error => ({
        destination: dest.id,
        status: 'error',
        error: error.message
      }))
    );
    
    return await Promise.all(validationPromises);
  }

  /**
   * Clear cache for a specific destination or all destinations
   * @param {string} destinationId - Optional, clears all if not provided
   */
  clearCache(destinationId = null) {
    if (destinationId) {
      this.cache.delete(`destination_${destinationId}`);
      console.log(`Cache cleared for ${destinationId}`);
    } else {
      this.cache.clear();
      console.log('All cache cleared');
    }
  }

  /**
   * Preload all destinations
   * @returns {Promise<void>}
   */
  async preloadAll() {
    const destinations = this.getAvailableDestinations();
    const loadPromises = destinations.map(dest => 
      this.loadDestination(dest.id).catch(error => {
        console.warn(`Failed to preload ${dest.name}:`, error);
        return null;
      })
    );
    
    await Promise.all(loadPromises);
    console.log('Preloading completed');
  }

  /**
   * Transform similar destinations data to application format
   * @param {Object} similarDestinationsData 
   * @returns {Object|null}
   */
  transformSimilarDestinations(similarDestinationsData) {
    console.log('[Debug] transformSimilarDestinations called with:', similarDestinationsData);
    
    if (!similarDestinationsData) {
      console.log('[Debug] No similar destinations data provided');
      return null;
    }
    
    // Import script ensures proper structure
    const data = similarDestinationsData.similar_destinations_data || {};
    
    if (!data.similar_destinations) {
      console.log('[Debug] No similar_destinations array found');
      return null;
    }

    console.log('[Debug] Found similar destinations:', data.similar_destinations.length);

    return {
      similarDestinations: data.similar_destinations.map(dest => ({
        destination: dest.destination,
        similarityScore: dest.similarity_score,
        confidence: dest.confidence,
        similarityReasons: dest.similarity_reasons || [],
        geographicProximity: dest.geographic_proximity || 0,
        culturalSimilarity: dest.cultural_similarity || 0,
        experienceSimilarity: dest.experience_similarity || 0,
        contributingModels: dest.contributing_models || [],
        sourceUrls: dest.source_urls || [],
        validationData: dest.validation_data || {}
      })),
      qualityScore: data.quality_score || 0,
      processingMetadata: data.processing_metadata || {},
      statistics: data.statistics || {}
    };
  }
}

// Create and export a singleton instance
export const dataLoader = new DataLoader();
export default dataLoader; 