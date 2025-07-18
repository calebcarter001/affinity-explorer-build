import sentimentConceptsData from '../data/sentiment-concepts.json';

class SentimentConceptsService {
  constructor() {
    this.concepts = sentimentConceptsData.concepts;
    this.categories = sentimentConceptsData.categories;
    this.totalConcepts = sentimentConceptsData.totalConcepts;
  }

  /**
   * Get all sentiment concepts
   * @returns {Array} Array of all sentiment concepts
   */
  getAllConcepts() {
    return this.concepts;
  }

  /**
   * Get sentiment concepts by category
   * @param {string} category - The category to filter by
   * @returns {Array} Array of concepts in the specified category
   */
  getConceptsByCategory(category) {
    return this.concepts.filter(concept => concept.category === category);
  }

  /**
   * Get all available categories
   * @returns {Array} Array of category names
   */
  getCategories() {
    return this.categories;
  }

  /**
   * Get concepts grouped by category
   * @returns {Object} Object with categories as keys and concept arrays as values
   */
  getConceptsGroupedByCategory() {
    const grouped = {};
    
    this.categories.forEach(category => {
      grouped[category] = this.getConceptsByCategory(category);
    });
    
    return grouped;
  }

  /**
   * Search concepts by label or definition
   * @param {string} query - Search query
   * @returns {Array} Array of matching concepts
   */
  searchConcepts(query) {
    const lowercaseQuery = query.toLowerCase();
    
    return this.concepts.filter(concept => 
      concept.label.toLowerCase().includes(lowercaseQuery) ||
      concept.id.toLowerCase().includes(lowercaseQuery) ||
      (concept.definition && concept.definition.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Get concept by ID
   * @param {string} id - Concept ID
   * @returns {Object|null} Concept object or null if not found
   */
  getConceptById(id) {
    return this.concepts.find(concept => concept.id === id) || null;
  }

  /**
   * Get concepts formatted for UI components (with icon mapping)
   * @returns {Array} Array of concepts with UI-friendly format
   */
  getConceptsForUI() {
    return this.concepts.map(concept => ({
      id: concept.id,
      label: concept.label,
      category: concept.category,
      definition: concept.definition,
      icon: this.getCategoryIcon(concept.category)
    }));
  }

  /**
   * Get icon for a category
   * @param {string} category - Category name
   * @returns {string} Emoji icon for the category
   */
  getCategoryIcon(category) {
    const categoryIcons = {
      'Positive': '👍',
      'Negative': '👎',
      'L1 Concepts': '🏷️',
      'L2 Concepts': '🏷️',
      'L3 Concepts': '🏷️',
      'General': '📋',
      'Location': '📍',
      'Pool': '🏊',
      'Beach': '🏖️',
      'Views': '🌅',
      'Restaurant': '🍽️',
      'Bar': '🍹',
      'Fitness': '💪',
      'Parking': '🅿️',
      'WiFi': '📶',
      'Room Cleanliness': '🧹',
      'Staff & Services': '👥',
      'Family Friendly': '👨‍👩‍👧‍👦',
      'Business Friendly': '💼'
    };
    
    return categoryIcons[category] || '📋';
  }

  /**
   * Get popular concepts (most commonly used categories)
   * @param {number} limit - Number of concepts to return
   * @returns {Array} Array of popular concepts
   */
  getPopularConcepts(limit = 20) {
    // Get concepts from the most populated categories
    const popularCategories = ['Negative', 'Positive', 'Location', 'Pool', 'Views'];
    const popularConcepts = [];
    
    popularCategories.forEach(category => {
      const categoryConcepts = this.getConceptsByCategory(category);
      popularConcepts.push(...categoryConcepts.slice(0, Math.ceil(limit / popularCategories.length)));
    });
    
    return popularConcepts.slice(0, limit);
  }

  /**
   * Get common sentiment concepts for UI display (curated set)
   * @returns {Array} Array of 8 most common/useful sentiment concepts
   */
  getCommonConcepts() {
    // Curated list of 8 most useful sentiment concepts for quick selection
    const commonConceptIds = [
      'slow-service',         // Service quality
      'clean-room',          // Room cleanliness  
      'parking-available',   // Parking convenience
      'beautiful-view',      // Views
      'quiet-location',      // Location quality
      'modern-appliances',   // Amenities
      'friendly-staff',      // Staff quality
      'dirty-room'           // Negative room condition
    ];
    
    // Find these concepts in our data, with fallbacks if not found
    const commonConcepts = [];
    
    commonConceptIds.forEach(id => {
      let concept = this.getConceptById(id);
      
      // If exact ID not found, try to find by similar label
      if (!concept) {
        concept = this.concepts.find(c => 
          c.label.toLowerCase().includes(id.replace(/-/g, ' ').toLowerCase()) ||
          c.id.toLowerCase().includes(id.toLowerCase())
        );
      }
      
      if (concept) {
        commonConcepts.push(concept);
      }
    });
    
    // If we don't have enough common concepts, fill with popular ones
    if (commonConcepts.length < 8) {
      const needed = 8 - commonConcepts.length;
      const popularConcepts = this.getPopularConcepts(20);
      const additionalConcepts = popularConcepts.filter(p => 
        !commonConcepts.some(c => c.id === p.id)
      ).slice(0, needed);
      
      commonConcepts.push(...additionalConcepts);
    }
    
    return commonConcepts.slice(0, 8);
  }

  /**
   * Get remaining concepts (not in common concepts)
   * @returns {Array} Array of remaining sentiment concepts for dropdown
   */
  getRemainingConcepts() {
    const commonConcepts = this.getCommonConcepts();
    const commonIds = commonConcepts.map(c => c.id);
    
    return this.concepts.filter(concept => !commonIds.includes(concept.id));
  }

  /**
   * Get summary statistics
   * @returns {Object} Statistics about the sentiment concepts
   */
  getStatistics() {
    const categoryStats = {};
    
    this.categories.forEach(category => {
      categoryStats[category] = this.getConceptsByCategory(category).length;
    });
    
    return {
      totalConcepts: this.totalConcepts,
      totalCategories: this.categories.length,
      categoryBreakdown: categoryStats,
      mostPopularCategory: Object.entries(categoryStats).reduce((a, b) => 
        categoryStats[a[0]] > categoryStats[b[0]] ? a : b
      )[0]
    };
  }
}

// Create and export a singleton instance
const sentimentConceptsService = new SentimentConceptsService();
export default sentimentConceptsService; 