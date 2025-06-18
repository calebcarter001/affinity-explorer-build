// Evidence Service
// Handles evidence data processing, validation, and retrieval

export class EvidenceService {
  constructor() {
    this.evidenceStore = new Map();
  }

  /**
   * Initialize evidence store with destination evidence data
   * @param {Object} evidenceData - Raw evidence data from JSON
   */
  initializeStore(evidenceData) {
    if (!evidenceData || !evidenceData.theme_evidence) {
      console.warn('No evidence data provided for initialization');
      return;
    }

    // Clear existing store
    this.evidenceStore.clear();

    // Process and store evidence for each theme
    Object.entries(evidenceData.theme_evidence).forEach(([themeName, themeEvidence]) => {
      this._processThemeEvidence(themeName, themeEvidence);
    });

    console.log(`Evidence store initialized with ${this.evidenceStore.size} evidence entries`);
  }

  /**
   * Get evidence for a specific theme
   * @param {string} themeName 
   * @returns {Object|null}
   */
  getThemeEvidence(themeName) {
    const evidenceKey = this._generateEvidenceKey(themeName, 'theme_evidence');
    return this.evidenceStore.get(evidenceKey) || null;
  }

  /**
   * Get evidence for a specific theme attribute
   * @param {string} themeName 
   * @param {string} attributeName 
   * @returns {Object|null}
   */
  getAttributeEvidence(themeName, attributeName) {
    const evidenceKey = this._generateEvidenceKey(themeName, attributeName);
    return this.evidenceStore.get(evidenceKey) || null;
  }

  /**
   * Get evidence by exact evidence ID (for compatibility with HTML files)
   * @param {string} evidenceId 
   * @returns {Object|null}
   */
  getEvidenceById(evidenceId) {
    return this.evidenceStore.get(evidenceId) || null;
  }

  /**
   * Get all evidence for a theme (main + attributes)
   * @param {string} themeName 
   * @returns {Object}
   */
  getAllThemeEvidence(themeName) {
    const evidence = {};
    
    // Get main theme evidence
    const mainEvidence = this.getThemeEvidence(themeName);
    if (mainEvidence) {
      evidence.main = mainEvidence;
    }

    // Get attribute evidence
    const attributeKeys = Array.from(this.evidenceStore.keys()).filter(key => 
      key.includes(themeName) && !key.includes('theme_evidence')
    );

    attributeKeys.forEach(key => {
      const attributeName = this._extractAttributeFromKey(key);
      if (attributeName) {
        evidence[attributeName] = this.evidenceStore.get(key);
      }
    });

    return evidence;
  }

  /**
   * Get evidence statistics
   * @returns {Object}
   */
  getEvidenceStats() {
    const stats = {
      totalEntries: this.evidenceStore.size,
      byType: {},
      qualityDistribution: {},
      sourceTypes: {}
    };

    this.evidenceStore.forEach((evidence, key) => {
      // Count by evidence type
      if (evidence.evidence_pieces) {
        evidence.evidence_pieces.forEach(piece => {
          stats.byType[piece.evidence_type] = (stats.byType[piece.evidence_type] || 0) + 1;
          stats.qualityDistribution[piece.quality_rating] = 
            (stats.qualityDistribution[piece.quality_rating] || 0) + 1;
          stats.sourceTypes[piece.source_type] = 
            (stats.sourceTypes[piece.source_type] || 0) + 1;
        });
      }
    });

    return stats;
  }

  /**
   * Search evidence by text content
   * @param {string} searchTerm 
   * @returns {Array}
   */
  searchEvidence(searchTerm) {
    const results = [];
    const lowerSearchTerm = searchTerm.toLowerCase();

    this.evidenceStore.forEach((evidence, key) => {
      if (evidence.evidence_pieces) {
        evidence.evidence_pieces.forEach(piece => {
          if (piece.text_content && 
              piece.text_content.toLowerCase().includes(lowerSearchTerm)) {
            results.push({
              evidenceKey: key,
              piece,
              relevance: this._calculateRelevance(piece.text_content, searchTerm)
            });
          }
        });
      }
    });

    return results.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Process theme evidence and store it
   * @private
   */
  _processThemeEvidence(themeName, themeEvidence) {
    // Store main theme evidence
    if (themeEvidence.main_theme) {
      const mainKey = this._generateEvidenceKey(themeName, 'theme_evidence');
      this.evidenceStore.set(mainKey, themeEvidence.main_theme);
    }

    // Process attribute evidence
    Object.entries(themeEvidence).forEach(([key, value]) => {
      if (key !== 'main_theme' && key !== 'collection_timestamp' && 
          key !== 'destination' && key !== 'theme_name' && 
          key !== 'total_sources_analyzed' && key !== 'source_urls' &&
          key !== 'evidence_summary') {
        
        const evidenceKey = this._generateEvidenceKey(themeName, key);
        this.evidenceStore.set(evidenceKey, {
          attribute_name: key,
          ...value
        });
      }
    });
  }

  /**
   * Generate evidence key for consistent lookup
   * @private
   */
  _generateEvidenceKey(themeName, attributeName) {
    const sanitizedTheme = themeName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const sanitizedAttribute = attributeName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    
    return `${sanitizedTheme}_${sanitizedAttribute}_${this._generateHash(themeName + attributeName)}`;
  }

  /**
   * Extract attribute name from evidence key
   * @private
   */
  _extractAttributeFromKey(key) {
    const parts = key.split('_');
    if (parts.length >= 2) {
      // Remove theme name and hash, return middle part as attribute
      return parts.slice(1, -1).join('_');
    }
    return null;
  }

  /**
   * Generate simple hash for evidence keys
   * @private
   */
  _generateHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).substring(0, 8);
  }

  /**
   * Calculate text relevance for search
   * @private
   */
  _calculateRelevance(text, searchTerm) {
    const lowerText = text.toLowerCase();
    const lowerTerm = searchTerm.toLowerCase();
    
    // Simple relevance calculation
    const exactMatches = (lowerText.match(new RegExp(lowerTerm, 'g')) || []).length;
    const wordMatches = lowerTerm.split(' ').filter(word => 
      lowerText.includes(word)
    ).length;
    
    return exactMatches * 2 + wordMatches;
  }

  /**
   * Validate evidence piece structure
   * @private
   */
  _validateEvidencePiece(piece) {
    const required = ['text_content', 'source_url', 'relevance_score', 'authority_score'];
    return required.every(field => field in piece);
  }

  /**
   * Clear evidence store
   */
  clearStore() {
    this.evidenceStore.clear();
  }

  /**
   * Export evidence store as JSON (for debugging)
   * @returns {Object}
   */
  exportStore() {
    const exported = {};
    this.evidenceStore.forEach((value, key) => {
      exported[key] = value;
    });
    return exported;
  }
}

// Create singleton instance
export const evidenceService = new EvidenceService(); 