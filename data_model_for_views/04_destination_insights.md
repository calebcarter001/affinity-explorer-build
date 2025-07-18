# Destination Insights View - Data Model Specification

## 📋 **Overview**

The Destination Insights view is the core feature of Affinity Explorer, providing comprehensive destination analysis with themes, nuances, evidence validation, and similar destinations. It uses a sophisticated multi-LLM agent system to generate validated insights.

## 🎯 **View Components**

1. **Hero Section**: Destination selector, seasonal controls, background images
2. **Summary Cards**: Total themes, confidence metrics, evidence counts
3. **Theme Cards**: Individual destination themes with intelligence analysis
4. **Nuances Tabs**: Destination, hotel, and vacation rental expectations
5. **Evidence Modal**: Detailed evidence sources with authority validation
6. **Similar Destinations**: Comparable destinations with similarity scores
7. **Search & Filtering**: Real-time theme search and category filtering

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/destinations/{destination_id}/insights
```

### Response Schema
```typescript
interface DestinationInsightsResponse {
  themes: ThemeObject[];
  nuances: NuancesObject;
  evidence: EvidenceObject[];
  similarDestinations: SimilarDestinationsObject;
  intelligenceInsights: IntelligenceInsightsObject;
  metadata: MetadataObject;
  dataType: 'complete_export' | 'export';
}
```

### Theme Object Schema
```typescript
interface ThemeObject {
  // Core identifiers
  id: string;                    // Unique theme identifier
  name: string;                  // Display name
  theme: string;                 // Theme title
  category: string;              // Theme category (e.g., "Cultural", "Adventure")
  confidence: number;            // 0.0 - 1.0 confidence score
  rationale: string;             // Detailed explanation
  description: string;           // User-friendly description

  // Theme hierarchy
  sub_themes: string[];          // Sub-theme array
  nano_themes: string[];         // Nano-theme array
  subThemes: string[];           // Alias for compatibility
  nanoThemes: string[];          // Alias for compatibility

  // Intelligence analysis (Multi-LLM generated)
  depth_analysis: {
    depth_level: 'surface' | 'moderate' | 'deep' | 'profound';
    analysis_details: {
      cultural_depth: number;     // 0.0 - 1.0
      historical_significance: number;
      local_integration: number;
      authenticity_score: number;
    };
  };

  authenticity_analysis: {
    authenticity_level: 'tourist_focused' | 'balanced' | 'local_influenced' | 'insider_only';
    local_perspective: {
      local_recommendation_ratio: number;  // 0.0 - 1.0
      tourist_trap_risk: 'low' | 'moderate' | 'high';
      insider_knowledge_required: boolean;
    };
  };

  hidden_gem_score: {
    hidden_gem_level: 'mainstream' | 'somewhat_known' | 'off_the_beaten_path' | 'local_favorite' | 'insider_secret';
    accessibility: {
      difficulty_to_find: 'easy' | 'moderate' | 'challenging';
      requires_local_guide: boolean;
      seasonal_accessibility: string[];
    };
  };

  emotional_profile: {
    primary_emotions: string[];   // e.g., ["wonder", "tranquility", "excitement"]
    emotional_intensity: {
      overall_intensity: 'low' | 'moderate' | 'high' | 'overwhelming';
      specific_emotions: {
        [emotion: string]: number; // 0.0 - 1.0 intensity
      };
    };
  };

  experience_intensity: {
    overall_intensity: 'relaxing' | 'moderate' | 'active' | 'intense' | 'extreme';
    physical_intensity: {
      physical_demand: 'minimal' | 'light' | 'moderate' | 'demanding' | 'extreme';
      fitness_required: boolean;
      accessibility_friendly: boolean;
    };
    mental_intensity: {
      cognitive_engagement: 'passive' | 'observational' | 'interactive' | 'immersive';
      cultural_learning_curve: 'minimal' | 'moderate' | 'steep';
    };
  };

  cultural_sensitivity: {
    sensitivity_level: 'low' | 'moderate' | 'high' | 'critical';
    considerations: string[];     // Cultural guidelines and considerations
    local_customs: string[];      // Specific customs to be aware of
    dress_code_requirements: string[];
  };

  // Contextual information
  contextual_info: {
    demographic_suitability: string[];  // e.g., ["families", "solo_travelers", "couples"]
    accessibility_notes: string[];      // Accessibility considerations
    safety_considerations: string[];    // Safety notes
    budget_considerations: string[];    // Cost-related notes
  };

  seasonality: {
    best_seasons: string[];       // e.g., ["spring", "fall"]
    seasonal_variations: {
      [season: string]: {
        availability: boolean;
        experience_quality: number;  // 0.0 - 1.0
        crowd_level: 'low' | 'moderate' | 'high' | 'overwhelming';
        weather_impact: string;
      };
    };
  };

  price_insights: {
    price_range: '$' | '$$' | '$$$' | '$$$$';
    cost_factors: string[];       // Factors affecting cost
    budget_tips: string[];        // Money-saving suggestions
    value_assessment: 'poor' | 'fair' | 'good' | 'excellent';
  };

  traveler_types: string[];      // e.g., ["adventure_seekers", "culture_enthusiasts"]

  // Evidence data
  comprehensive_attribute_evidence: {
    evidence_sources: {
      source_type: 'official' | 'travel_guide' | 'blog' | 'review' | 'local_knowledge';
      source_name: string;
      authority_level: 'gold' | 'authoritative' | 'standard';
      content_snippet: string;
      validation_status: 'verified' | 'pending' | 'disputed';
      confidence_score: number;   // 0.0 - 1.0
    }[];
    validation_status: 'fully_validated' | 'partially_validated' | 'pending_validation';
  };

  // Processing metadata
  processing_metadata: {
    llm_consensus: {
      models_used: string[];      // e.g., ["gpt-4", "claude-3", "gemini-pro"]
      consensus_score: number;    // 0.0 - 1.0
      disagreement_areas: string[];
    };
    confidence_metrics: {
      source_reliability: number;
      cross_validation_score: number;
      temporal_consistency: number;
    };
    validation_timestamp: string; // ISO 8601
    last_updated: string;         // ISO 8601
  };

  // Derived UI fields (computed on backend)
  bestFor: string;              // Computed from demographic_suitability
  timeNeeded: string;           // Computed recommendation
  intensity: string;            // Computed from experience_intensity
  priceRange: string;           // From price_insights.price_range
  emotions: string[];           // From emotional_profile.primary_emotions
  bestSeason: string;           // From seasonality.best_seasons
  intelligenceBadges: string[]; // Computed intelligence badges for UI
}
```

### Nuances Object Schema
```typescript
interface NuancesObject {
  destination_nuances: {
    nuance: string;               // The nuance description
    explanation: string;          // Detailed explanation
    confidence: number;           // 0.0 - 1.0
    category: 'cultural' | 'practical' | 'social' | 'experiential';
    evidence_sources: {
      source: string;
      authority_level: 'gold' | 'authoritative' | 'standard';
      snippet: string;
    }[];
    impact_level: 'minor' | 'moderate' | 'significant' | 'critical';
  }[];

  hotel_expectations: {
    expectation: string;          // What to expect
    rationale: string;            // Why this expectation exists
    confidence: number;           // 0.0 - 1.0
    traveler_segment: string;     // Target traveler type
    price_tier: '$' | '$$' | '$$$' | '$$$$';
    seasonal_variation: boolean;
  }[];

  vacation_rental_expectations: {
    expectation: string;
    rationale: string;
    confidence: number;
    property_type: 'apartment' | 'house' | 'villa' | 'unique';
    location_type: 'city_center' | 'residential' | 'tourist_area' | 'remote';
    booking_considerations: string[];
  }[];

  overall_nuance_quality_score: number; // 0.0 - 1.0
}
```

### Evidence Object Schema
```typescript
interface EvidenceObject {
  id: string;
  theme: string;                // Associated theme ID
  evidence_type: 'official_source' | 'travel_guide' | 'review' | 'blog' | 'local_knowledge' | 'media';
  source: string;               // Source name/URL
  content: string;              // Evidence content
  confidence: number;           // 0.0 - 1.0
  authority_level: 'gold' | 'authoritative' | 'standard';
  validation_status: 'verified' | 'pending' | 'disputed' | 'rejected';
  timestamp: string;            // ISO 8601
  language: string;             // Source language
  metadata: {
    author?: string;
    publication_date?: string;
    last_verified?: string;
    verification_method?: string;
  };
}
```

### Similar Destinations Object Schema
```typescript
interface SimilarDestinationsObject {
  similarDestinations: {
    destination: string;          // Destination name
    destination_id: string;       // For linking
    similarity_score: number;     // 0.0 - 1.0
    shared_themes: string[];      // Common themes
    key_differences: string[];    // What makes it different
    recommendation_reason: string; // Why it's recommended
    distance_km?: number;         // Physical distance
    cultural_similarity: number;  // 0.0 - 1.0
    experience_similarity: number; // 0.0 - 1.0
  }[];

  analysis_metadata: {
    comparison_method: 'theme_overlap' | 'embedding_similarity' | 'hybrid';
    confidence_threshold: number;
    total_destinations_analyzed: number;
    last_updated: string;         // ISO 8601
  };
}
```

### Intelligence Insights Object Schema
```typescript
interface IntelligenceInsightsObject {
  overall_confidence: number;           // 0.0 - 1.0
  theme_diversity_score: number;       // 0.0 - 1.0
  evidence_quality_score: number;      // 0.0 - 1.0
  local_perspective_ratio: number;     // 0.0 - 1.0
  hidden_gems_count: number;
  authenticity_distribution: {
    tourist_focused: number;
    balanced: number;
    local_influenced: number;
    insider_only: number;
  };
  seasonal_coverage: {
    spring: number;   // 0.0 - 1.0 coverage
    summer: number;
    autumn: number;
    winter: number;
  };
  traveler_type_coverage: string[];
  data_freshness: {
    average_age_days: number;
    oldest_source_days: number;
    validation_coverage: number; // 0.0 - 1.0
  };
}
```

### Metadata Object Schema
```typescript
interface MetadataObject {
  destination: string;
  destination_id: string;
  exportVersion: string;
  schemaVersion: string;
  processingMetadata: {
    generation_timestamp: string;       // ISO 8601
    llm_models_used: string[];
    validation_methods: string[];
    data_sources: string[];
    quality_metrics: {
      completeness_score: number;      // 0.0 - 1.0
      consistency_score: number;       // 0.0 - 1.0
      accuracy_score: number;          // 0.0 - 1.0
      freshness_score: number;         // 0.0 - 1.0
    };
    processing_duration_seconds: number;
    agent_versions: {
      [agent_name: string]: string;    // Agent version info
    };
  };
}
```

## 🔌 **Required API Endpoints**

### 1. Get Destination Insights
```
GET /api/destinations/{destination_id}/insights
Response: DestinationInsightsResponse
```

### 2. Get Available Destinations
```
GET /api/destinations
Response: {
  destinations: {
    id: string;
    name: string;
    flag: string;
    country: string;
    region: string;
    data_available: boolean;
    last_updated: string;
  }[];
}
```

### 3. Search Themes
```
GET /api/destinations/{destination_id}/themes/search?q={query}&category={category}
Response: {
  themes: ThemeObject[];
  total: number;
  query: string;
  filters_applied: string[];
}
```

### 4. Get Evidence Details
```
GET /api/destinations/{destination_id}/evidence/{evidence_id}
Response: EvidenceObject
```

### 5. Validate Evidence
```
POST /api/destinations/{destination_id}/evidence/{evidence_id}/validate
Body: { validation_status: 'verified' | 'disputed' | 'rejected', notes?: string }
Response: { success: boolean; updated_evidence: EvidenceObject }
```

## 📊 **Data Loading Pattern**

### Frontend Implementation
```javascript
// Service layer
import { dataLoader } from '../services/destinationThemeService';

// Component usage
useEffect(() => {
  const loadDestinationData = async () => {
    setLoading(true);
    try {
      const data = await dataLoader.loadDestination(selectedDestination);
      setDestinationData(data);
      setThemes(data?.themes || []);
      setNuances(data?.nuances || null);
      setSimilarDestinations(data?.similarDestinations || null);
      setIntelligenceInsights(data?.intelligenceInsights || null);
    } catch (err) {
      setError(`Failed to load destination data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  loadDestinationData();
}, [selectedDestination]);
```

### Backend Data Loading
```python
# Example Python implementation
async def get_destination_insights(destination_id: str) -> DestinationInsightsResponse:
    # Load from cache first
    cached_data = await cache.get(f"destination_insights:{destination_id}")
    if cached_data and not is_stale(cached_data):
        return cached_data
    
    # Load from database
    themes = await db.get_destination_themes(destination_id)
    nuances = await db.get_destination_nuances(destination_id)
    evidence = await db.get_destination_evidence(destination_id)
    similar_destinations = await db.get_similar_destinations(destination_id)
    
    # Transform and enrich data
    enriched_data = await enrich_destination_data({
        'themes': themes,
        'nuances': nuances,
        'evidence': evidence,
        'similar_destinations': similar_destinations
    })
    
    # Cache for future requests
    await cache.set(f"destination_insights:{destination_id}", enriched_data, ttl=3600)
    
    return enriched_data
```

## 🎨 **Formatting Considerations**

### 1. Theme Intelligence Badges
```javascript
// Frontend badge generation
const generateIntelligenceBadges = (theme) => {
  const badges = [];
  
  if (theme.depth_analysis?.depth_level) {
    badges.push(`📊 ${theme.depth_analysis.depth_level}`);
  }
  
  if (theme.authenticity_analysis?.authenticity_level === 'local_influenced') {
    badges.push('🌟 local influenced');
  }
  
  if (theme.hidden_gem_score?.hidden_gem_level === 'local_favorite') {
    badges.push('⭐ local favorite');
  }
  
  return badges;
};
```

### 2. Confidence Color Coding
```javascript
const getConfidenceColor = (confidence) => {
  if (confidence >= 0.9) return 'text-green-600 bg-green-100';
  if (confidence >= 0.8) return 'text-blue-600 bg-blue-100';
  if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};
```

### 3. Season Background Images
```javascript
const getDestinationImage = (destination, season) => {
  return `/images/destinations/${destination.toLowerCase().replace(/\s+/g, '_')}/${season}.jpg`;
};
```

## ⚡ **Performance Considerations**

### 1. Caching Strategy
- **Redis Cache**: 1-hour TTL for destination insights
- **CDN**: Static images and assets
- **Browser Cache**: Theme search results (5 minutes)

### 2. Lazy Loading
- **Theme Cards**: Virtualized scrolling for 50+ themes
- **Evidence Modal**: Load evidence on-demand
- **Images**: Lazy load destination background images

### 3. Search Optimization
- **Elasticsearch**: Full-text search on themes and descriptions
- **Debounced Search**: 300ms delay for search input
- **Cached Results**: Cache search results by query

### 4. Real-time Updates
- **WebSocket**: Live updates for evidence validation
- **Polling**: Check for new themes every 5 minutes
- **Optimistic Updates**: Immediate UI updates with rollback on failure

## 🔒 **Security Considerations**

### 1. Data Validation
- Validate all confidence scores (0.0 - 1.0 range)
- Sanitize all text content for XSS prevention
- Validate destination IDs against allowed list

### 2. Rate Limiting
- Search API: 100 requests/minute per user
- Evidence validation: 10 requests/minute per user
- Data loading: 60 requests/minute per user

### 3. Authentication
- JWT tokens for API access
- Role-based permissions for evidence validation
- Admin-only access for data management endpoints

## 🧪 **Testing Requirements**

### 1. Unit Tests
- Theme transformation logic
- Confidence score calculations
- Badge generation algorithms

### 2. Integration Tests
- API endpoint responses
- Data loading error handling
- Cache invalidation

### 3. Performance Tests
- Load testing with 100+ themes
- Search response times < 200ms
- Image loading optimization

This specification provides complete guidance for implementing the Destination Insights view backend infrastructure, ensuring seamless integration with the existing frontend implementation.
