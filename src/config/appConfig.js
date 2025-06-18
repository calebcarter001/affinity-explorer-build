// API endpoints configuration
const API_CONFIG = {
  // Base URLs
  // Read from environment variable, fallback for safety (though should be set)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:9000',
  
  // Endpoints
  ENDPOINTS: {
    SEARCH: '/v1/search',
    // Add other endpoints as needed
  }
};

// Destination Theme Configuration
const DESTINATION_CONFIG = {
  // Available destinations with their data file mappings
  // Each destination must have corresponding _enhanced.json and _evidence.json files in /public/data/
  AVAILABLE_DESTINATIONS: [
    { 
      id: 'paris__france', 
      name: 'Paris, France', 
      flag: '🇫🇷',
      dataFiles: {
        enhanced: 'paris__france_enhanced.json',
        evidence: 'paris__france_evidence.json'
      }
    },
    { 
      id: 'new_york__usa', 
      name: 'New York, USA', 
      flag: '🇺🇸',
      dataFiles: {
        enhanced: 'new_york__usa_enhanced.json',
        evidence: 'new_york__usa_evidence.json'
      }
    },
    { 
      id: 'tokyo__japan', 
      name: 'Tokyo, Japan', 
      flag: '🇯🇵',
      dataFiles: {
        enhanced: 'tokyo__japan_enhanced.json',
        evidence: 'tokyo__japan_evidence.json'
      }
    }
  ],
  
  // Default destination (must be one of the available destinations)
  DEFAULT_DESTINATION: 'paris__france',
  
  // Data directory path (relative to public/)
  DATA_PATH: '/data/',
  
  // Cache settings
  CACHE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
  
  // Validation settings
  VALIDATE_DATA_ON_LOAD: true
};

// Application Configuration
const APP_CONFIG = {
  API: API_CONFIG,
  DESTINATIONS: DESTINATION_CONFIG
};

export default APP_CONFIG;
export { API_CONFIG, DESTINATION_CONFIG }; 