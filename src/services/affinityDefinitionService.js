/**
 * Affinity Definition Service
 * Manages parsing and access to affinity definitions from JSON files
 */
class AffinityDefinitionService {
  constructor() {
    this.definitions = new Map();
    this.loadPromise = null;
    this.isLoaded = false;
  }

  /**
   * Load all affinity definitions asynchronously
   */
  async loadDefinitions() {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this._loadAllDefinitions();
    return this.loadPromise;
  }

  /**
   * Internal method to load all definitions
   */
  async _loadAllDefinitions() {
    const definitionFiles = [
      'family-friendly.json',
      'pet-friendly.json', 
      'wellness.json',
      'luxury.json',
      'beachfront.json',
      'near-the-beach.json',
      'cabins.json',
      'homes.json',
      'mountains.json',
      'lake.json',
      'national-parks.json',
      'pools.json',
      'ski.json',
      'snow-season.json',
      'spa.json',
      'trending.json',
      'wine-country.json'
    ];

    const loadPromises = definitionFiles.map(async (filename) => {
      try {
        const response = await fetch(`/definitions/${filename}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const key = filename.replace('.json', '');
        const parsedDefinition = this.parseDefinition(data);
        this.definitions.set(key, parsedDefinition);
        console.log(`Loaded definition for: ${key}`);
        return { key, success: true };
      } catch (error) {
        console.error(`Failed to load definition for ${filename}:`, error);
        return { key: filename.replace('.json', ''), success: false, error };
      }
    });

    await Promise.all(loadPromises);
    this.isLoaded = true;
    console.log(`Loaded ${this.definitions.size} affinity definitions`);
  }

  /**
   * Ensure definitions are loaded before use
   */
  async ensureLoaded() {
    if (!this.isLoaded) {
      await this.loadDefinitions();
    }
  }

  /**
   * Parse a single affinity definition
   */
  parseDefinition(rawData) {
    if (!rawData || !rawData.definitions || !Array.isArray(rawData.definitions)) {
      throw new Error('Invalid definition structure');
    }

    const definition = rawData.definitions[0]; // Use first definition
    
    return {
      urn: rawData.urn,
      label: rawData.label,
      definitions: [{
        context: definition.context || {
          entityType: 'property',
          brand: 'all',
          lodgingType: 'Any',
          version: '1'
        },
        subScores: this.parseSubScores(definition.subScores || []),
        formula: definition.formula || { type: 'VariableNode', name: 'WEIGHTED_AVERAGE_SCORE' },
        status: definition.status || 'STAGED'
      }]
    };
  }

  /**
   * Parse sub-scores from definition
   */
  parseSubScores(subScores) {
    return subScores.map(subScore => ({
      formula: subScore.formula || { type: 'VariableNode', name: 'WEIGHTED_AVERAGE_SCORE' },
      urn: subScore.urn,
      weight: subScore.weight || 0,
      rules: this.parseRules(subScore.rules || []),
      metadata: subScore.metadata || {},
      categoryUrn: subScore.categoryUrn
    }));
  }

  /**
   * Parse rules from sub-score
   */
  parseRules(rules) {
    return rules.map(rule => ({
      type: rule.type || 'OPTIONAL',
      description: rule.description || '',
      logicalOperator: rule.logicalOperator || 'OR',
      conditions: this.parseConditions(rule.conditions || []),
      rules: rule.rules || []
    }));
  }

  /**
   * Parse conditions from rule
   */
  parseConditions(conditions) {
    return conditions.map(condition => ({
      lhs: {
        urn: condition.lhs?.urn || '',
        source: condition.lhs?.source || '',
        label: condition.lhs?.label || ''
      },
      operator: condition.operator || 'EXISTS',
      rhs: condition.rhs,
      weight: condition.weight || 0,
      penalty: condition.penalty || 0,
      metadata: condition.metadata || {}
    }));
  }

  /**
   * Get definition by affinity name (normalized)
   */
  async getDefinition(affinityName) {
    await this.ensureLoaded();
    const normalizedName = this.normalizeAffinityName(affinityName);
    return this.definitions.get(normalizedName);
  }

  /**
   * Get all loaded definitions
   */
  async getAllDefinitions() {
    await this.ensureLoaded();
    return Object.fromEntries(this.definitions);
  }

  /**
   * Normalize affinity name for lookup
   */
  normalizeAffinityName(name) {
    if (!name) return '';
    
    // Handle common name variations
    const normalized = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .trim();

    // Handle specific mappings
    const nameMap = {
      'family-friendly': 'family-friendly',
      'pet-friendly': 'pet-friendly',
      'wellness': 'wellness',
      'luxury': 'luxury',
      'beachfront': 'beachfront',
      'near-the-beach': 'near-the-beach',
      'beach': 'near-the-beach',
      'cabins': 'cabins',
      'homes': 'homes',
      'mountains': 'mountains',
      'lake': 'lake',
      'national-parks': 'national-parks',
      'pools': 'pools',
      'ski': 'ski',
      'snow-season': 'snow-season',
      'spa': 'spa',
      'trending': 'trending',
      'wine-country': 'wine-country'
    };

    return nameMap[normalized] || normalized;
  }

  /**
   * Get enriched affinity data for a given affinity object
   */
  async enrichAffinityData(affinity) {
    // Check if affinity already has definitions (from Configuration Studio)
    if (affinity?.definitions) {
      return affinity;
    }

    await this.ensureLoaded();

    // Try to find definition based on affinity name
    const normalizedName = this.normalizeAffinityName(affinity?.name);
    const definition = this.definitions.get(normalizedName);

    if (definition) {
      return {
        ...affinity,
        urn: definition.urn,
        label: affinity.name,
        definitions: definition.definitions
      };
    }

    // Return original affinity if no definition found
    return {
      ...affinity,
      urn: `urn:expe:taxo:insights:${normalizedName}`,
      label: affinity?.name || affinity?.label,
      definitions: []
    };
  }

  /**
   * Get summary statistics for a definition
   */
  getDefinitionSummary(definition) {
    if (!definition || !definition.definitions || definition.definitions.length === 0) {
      return {
        subScores: 0,
        totalRules: 0,
        totalConditions: 0,
        mustHaveRules: 0,
        optionalRules: 0,
        weightDistribution: {}
      };
    }

    const subScores = definition.definitions[0].subScores || [];
    let totalRules = 0;
    let totalConditions = 0;
    let mustHaveRules = 0;
    let optionalRules = 0;
    const weightDistribution = {};

    subScores.forEach(subScore => {
      // Add to weight distribution
      const label = this.getSubScoreLabel(subScore.urn);
      weightDistribution[label] = Math.round(subScore.weight * 100);

      // Count rules and conditions
      if (subScore.rules) {
        totalRules += subScore.rules.length;
        subScore.rules.forEach(rule => {
          if (rule.conditions) {
            totalConditions += rule.conditions.length;
          }
          if (rule.type === 'MUST_HAVE') {
            mustHaveRules++;
          } else if (rule.type === 'OPTIONAL') {
            optionalRules++;
          }
        });
      }
    });

    return {
      subScores: subScores.length,
      totalRules,
      totalConditions,
      mustHaveRules,
      optionalRules,
      weightDistribution
    };
  }

  /**
   * Get friendly label for sub-score URN
   */
  getSubScoreLabel(urn) {
    if (!urn) return 'Unknown';
    
    if (urn.includes('review-sentiments')) return 'Review Sentiments';
    if (urn.includes('attribute')) return 'Attributes';
    if (urn.includes('geo')) return 'Geo Location';
    if (urn.includes('images')) return 'Images';
    return 'Unknown';
  }

  /**
   * Check if definition exists for affinity name
   */
  async hasDefinition(affinityName) {
    await this.ensureLoaded();
    const normalizedName = this.normalizeAffinityName(affinityName);
    return this.definitions.has(normalizedName);
  }

  /**
   * Get available affinity keys
   */
  async getAvailableAffinities() {
    await this.ensureLoaded();
    return Array.from(this.definitions.keys());
  }

  /**
   * Convert all JSON definitions to affinity objects
   */
  async getDefinitionsAsAffinities() {
    await this.ensureLoaded();
    const affinities = [];
    
    for (const [key, definition] of this.definitions) {
      const summary = this.getDefinitionSummary(definition);
      
      // Create affinity object that matches the expected format
      const affinity = {
        id: `def_${key}`, // Use 'def_' prefix to distinguish from mock data
        name: this.formatAffinityName(key),
        type: "travel",
        category: this.getCategoryFromDefinition(definition),
        scoreAvailable: true,
        definition: `${this.formatAffinityName(key)} with complete JSON configuration`,
        status: "active",
        applicableEntities: ["hotel", "resort", "vacation_rental"],
        metrics: {
          accuracy: 0.95, // High accuracy for configured affinities
          coverage: 85,
          completeness: 1.0, // 100% complete since they have full definitions
          lastValidated: "2024-03-25"
        },
        averageScore: 0.88,
        highestScore: 0.98,
        lowestScore: 0.72,
        coverage: 85,
        propertiesTagged: 200,
        propertiesWithScore: 190,
        // Platform-specific property tracking
        propertiesTaggedVrbo: 110,
        propertiesTaggedBex: 55,
        propertiesTaggedHcom: 35,
        propertiesScoredVrbo: 105,
        propertiesScoredBex: 52,
        propertiesScoredHcom: 33,
        // Implementation metadata
        implementationStatus: {
          vrbo: {
            status: "completed",
            progress: 98,
            lastUpdated: "2024-03-25",
            owner: "ML Team"
          },
          bex: {
            status: "completed", 
            progress: 95,
            lastUpdated: "2024-03-24",
            owner: "ML Team"
          },
          hcom: {
            status: "completed",
            progress: 94,
            lastUpdated: "2024-03-23",
            owner: "ML Team"
          }
        },
        scorecard: this.generateScorecardForAffinity(key),
        dateCreated: "2024-01-01",
        lastUpdatedDate: "2024-03-25",
        // Mark as having configuration
        hasConfiguration: true,
        // Include the actual definition data
        definitions: definition.definitions,
        urn: definition.urn,
        label: definition.label,
        subScores: summary.subScores,
        totalRules: summary.totalRules,
        conditions: summary.totalConditions,
        weightDistribution: summary.weightDistribution
      };
      
      affinities.push(affinity);
    }
    
    return affinities;
  }

  /**
   * Format affinity name for display
   */
  formatAffinityName(key) {
    const nameMap = {
      'family-friendly': 'Family-Friendly',
      'pet-friendly': 'Pet-Friendly',
      'wellness': 'Wellness',
      'luxury': 'Luxury',
      'beachfront': 'Beachfront',
      'near-the-beach': 'Near The Beach',
      'cabins': 'Cabins',
      'homes': 'Homes',
      'mountains': 'Mountains',
      'lake': 'Lake',
      'national-parks': 'National Parks',
      'pools': 'Pools',
      'ski': 'Ski',
      'snow-season': 'Snow Season',
      'spa': 'Spa',
      'trending': 'Trending',
      'wine-country': 'Wine Country'
    };
    
    return nameMap[key] || key.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Get category from definition
   */
  getCategoryFromDefinition(definition) {
    const urn = definition.urn || '';
    const label = definition.label || '';
    
    // Categorize based on URN or label content
    if (urn.includes('family') || label.includes('Family')) return 'lifestyle';
    if (urn.includes('pet') || label.includes('Pet')) return 'lifestyle';
    if (urn.includes('wellness') || urn.includes('spa')) return 'amenity';
    if (urn.includes('luxury')) return 'quality';
    if (urn.includes('beach')) return 'location';
    if (urn.includes('cabin') || urn.includes('home')) return 'property_type';
    if (urn.includes('mountain') || urn.includes('lake')) return 'location';
    if (urn.includes('national-park')) return 'location';
    if (urn.includes('pool')) return 'amenity';
    if (urn.includes('ski') || urn.includes('snow')) return 'activities';
    if (urn.includes('trending')) return 'popular';
    if (urn.includes('wine')) return 'location';
    
    return 'experience'; // Default category
  }

  /**
   * Generate scorecard data for JSON-defined affinities
   */
  generateScorecardForAffinity(affinityKey) {
    // Generate varied base values for each affinity to ensure diversity
    const affinityHash = this.hashAffinityKey(affinityKey);
    const baseVariation = affinityHash % 20; // 0-19 range for variation
    
    // Base scorecard template with varied performance for JSON-configured affinities
    const baseScorecard = {
      coverage: {
        current: 83 + baseVariation, // 83-102 range
        target: 90 + (baseVariation % 10), // 90-99 range
        trend: `+${(1.0 + (baseVariation * 0.3)).toFixed(1)}%`,
        description: "JSON-configured properties with complete definition coverage",
        status: this.getStatusFromValue(83 + baseVariation, 90)
      },
      accuracy: {
        current: 89 + (baseVariation % 12), // 89-100 range
        target: 93 + (baseVariation % 7), // 93-99 range
        trend: `+${(0.3 + (baseVariation * 0.25)).toFixed(1)}%`,
        description: "High precision from comprehensive JSON rule definitions",
        status: this.getStatusFromValue(89 + (baseVariation % 12), 93)
      },
      explainability: {
        current: 92 + (baseVariation % 8), // 92-99 range
        target: 95 + (baseVariation % 5), // 95-99 range
        trend: `+${(0.1 + (baseVariation * 0.15)).toFixed(1)}%`,
        description: "Complete traceability through structured JSON definitions",
        status: this.getStatusFromValue(92 + (baseVariation % 8), 95)
      },
      freshness: {
        current: 1 + (baseVariation > 15 ? 1 : 0), // 1-2 range
        target: 1,
        trend: baseVariation > 15 ? "+1 day" : "stable",
        description: "Real-time updates through automated JSON processing",
        status: baseVariation > 15 ? "warning" : "excellent"
      },
      engagement: {
        current: (15.0 + (baseVariation * 1.2)).toFixed(1),
        target: 20 + (baseVariation % 10),
        trend: `+${(1.5 + (baseVariation * 0.4)).toFixed(1)}%`,
        description: "High engagement from precisely targeted configurations",
        status: this.getStatusFromValue(15.0 + (baseVariation * 1.2), 20),
        impressions: {
          current: (120 + (baseVariation * 15)).toFixed(1),
          target: 150 + (baseVariation % 50),
          trend: `+${(3.2 + (baseVariation * 0.8)).toFixed(1)}%`,
          unit: "M",
          description: "Total impressions generated till date"
        }
      },
      conversion: {
        current: (10.5 + (baseVariation * 0.8)).toFixed(1),
        target: 15 + (baseVariation % 8),
        trend: `+${(1.0 + (baseVariation * 0.3)).toFixed(1)}%`,
        description: "Strong conversion rates from accurate affinity matching",
        status: this.getStatusFromValue(10.5 + (baseVariation * 0.8), 15)
      },
      stability: {
        current: 90 + (baseVariation % 10), // 90-99 range
        target: 94 + (baseVariation % 6), // 94-99 range
        trend: `+${(0.1 + (baseVariation * 0.1)).toFixed(1)}%`,
        description: "Highly stable scoring from consistent JSON definitions",
        status: this.getStatusFromValue(90 + (baseVariation % 10), 94)
      }
    };

    // Customize scorecard based on specific affinity characteristics
    const customizations = this.getAffinitySpecificCustomizations(affinityKey);
    
    // Apply customizations to base scorecard
    Object.keys(customizations).forEach(dimension => {
      if (baseScorecard[dimension]) {
        baseScorecard[dimension] = { ...baseScorecard[dimension], ...customizations[dimension] };
      }
    });

    return baseScorecard;
  }

  /**
   * Get affinity-specific scorecard customizations
   */
  getAffinitySpecificCustomizations(affinityKey) {
    const customizations = {
      'family-friendly': {
        coverage: { current: 91, description: "Family properties with verified child-friendly amenities" },
        engagement: { 
          current: 25.8, 
          description: "High family traveler engagement with targeted filters",
          impressions: { current: 298.5, target: 250, trend: "+19.4%", unit: "M" }
        },
        conversion: { current: 18.4, description: "Strong family booking conversion rates" }
      },
      'pet-friendly': {
        coverage: { current: 76, target: 82, description: "Pet-welcoming properties with verified policies" },
        engagement: { current: 22.3, description: "Growing pet owner travel segment engagement" },
        conversion: { current: 16.7, description: "Pet owner booking conversion and extended stays" }
      },
      'luxury': {
        coverage: { current: 85, description: "Verified luxury properties with premium amenities" },
        engagement: { 
          current: 28.9, 
          description: "High-value traveler engagement with luxury filters",
          impressions: { current: 189.7, target: 180, trend: "+5.4%", unit: "M" }
        },
        conversion: { current: 21.5, description: "Premium luxury booking conversion rates" },
        stability: { current: 98, description: "Highly stable luxury property identification" }
      },
      'wellness': {
        coverage: { current: 82, description: "Wellness properties with verified spa and health amenities" },
        engagement: { current: 24.1, description: "Health-conscious traveler engagement growth" },
        conversion: { current: 17.8, description: "Wellness package and retreat booking rates" }
      },
      'beachfront': {
        coverage: { current: 94, description: "Verified beachfront access and oceanfront properties" },
        engagement: { 
          current: 31.2, 
          description: "High beach vacation search engagement",
          impressions: { current: 456.8, target: 400, trend: "+14.2%", unit: "M" }
        },
        conversion: { current: 22.7, description: "Strong beachfront property booking rates" }
      },
      'near-the-beach': {
        coverage: { current: 89, description: "Beach-proximity properties with verified access" },
        engagement: { current: 26.4, description: "Beach-adjacent property search popularity" },
        conversion: { current: 19.1, description: "Near-beach booking conversion rates" }
      },
      'cabins': {
        coverage: { current: 83, description: "Authentic cabin properties with rustic amenities" },
        engagement: { current: 21.7, description: "Nature retreat and cabin vacation engagement" },
        conversion: { current: 16.2, description: "Cabin and lodge booking conversion rates" }
      },
      'mountains': {
        coverage: { current: 87, description: "Mountain location properties with scenic access" },
        engagement: { current: 23.5, description: "Mountain vacation and hiking enthusiast engagement" },
        conversion: { current: 17.3, description: "Mountain retreat booking conversion rates" }
      },
      'ski': {
        coverage: { current: 79, target: 85, description: "Ski resort and winter sports properties" },
        engagement: { current: 27.8, description: "High winter sports traveler engagement" },
        conversion: { current: 20.4, description: "Ski vacation package booking rates" },
        freshness: { current: 1, description: "Real-time ski conditions and slope access updates" }
      },
      'trending': {
        coverage: { current: 72, target: 80, description: "Currently popular and trending destinations" },
        engagement: { 
          current: 35.2, 
          description: "Highest engagement from trend-seeking travelers",
          impressions: { current: 523.9, target: 450, trend: "+16.4%", unit: "M" }
        },
        conversion: { current: 24.8, description: "Strong conversion for trending destination bookings" },
        freshness: { current: 1, description: "Real-time trending analysis and popularity updates" }
      }
    };

    return customizations[affinityKey] || {};
  }

  /**
   * Generate a hash value for affinity key to ensure consistent variation
   */
  hashAffinityKey(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get status based on current value vs target
   */
  getStatusFromValue(current, target) {
    const ratio = current / target;
    if (ratio >= 1.0) return "excellent";
    if (ratio >= 0.85) return "good";
    return "warning";
  }
}

// Create singleton instance
const affinityDefinitionService = new AffinityDefinitionService();

export default affinityDefinitionService; 