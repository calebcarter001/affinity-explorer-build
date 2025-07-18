# Similar Destinations Tab - Data Model Specification

## 📋 **Overview**

The Similar Destinations Tab provides comprehensive destination similarity analysis, showing destinations that share characteristics, themes, or experiences with the current destination. It uses advanced similarity algorithms and multi-dimensional comparison to help travelers discover alternative destinations.

## 🎯 **Navigation & Location**
- **File**: `/src/components/destinations/SimilarDestinationsTab.jsx`
- **Parent**: DestinationInsightsPage (`/destination-insights`)
- **Tab Position**: 7th tab in Destination Insights navigation
- **Icon**: `🌍` (Globe icon)
- **Permissions**: Requires 'read' permission

## 🎯 **View Components**

1. **Similarity Cards**: Individual destination cards with similarity scores
2. **Comparison Matrix**: Side-by-side feature comparison
3. **Similarity Filters**: Filter by similarity type (cultural, climate, activities, etc.)
4. **Interactive Map**: Geographic visualization of similar destinations
5. **Detailed Comparison**: Deep-dive comparison modal
6. **Statistics Dashboard**: Similarity metrics and distribution

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/destinations/{destination_id}/similar-destinations
```

### Response Schema
```typescript
interface SimilarDestinationsResponse {
  similar_destinations: SimilarDestination[];
  similarity_matrix: SimilarityMatrix;
  comparison_metrics: ComparisonMetrics;
  statistics: SimilarityStatistics;
  metadata: SimilarDestinationsMetadata;
}
```

### Similar Destination Schema
```typescript
interface SimilarDestination {
  // Core identifiers
  destination_id: string;                 // Unique destination identifier
  destination_name: string;               // Destination name
  country: string;                        // Country name
  region: string;                         // Geographic region
  
  // Similarity scoring
  overall_similarity_score: number;       // 0.0 - 1.0 overall similarity
  confidence_score: number;               // 0.0 - 1.0 confidence in similarity
  
  // Dimensional similarity scores
  similarity_dimensions: {
    cultural: number;                     // Cultural similarity (0.0 - 1.0)
    climate: number;                      // Climate similarity (0.0 - 1.0)
    activities: number;                   // Activity similarity (0.0 - 1.0)
    cost_level: number;                   // Cost similarity (0.0 - 1.0)
    infrastructure: number;               // Infrastructure similarity (0.0 - 1.0)
    natural_features: number;             // Natural features similarity (0.0 - 1.0)
    urban_rural_balance: number;          // Urban/rural similarity (0.0 - 1.0)
    tourist_density: number;              // Tourism density similarity (0.0 - 1.0)
  };
  
  // Comparison details
  shared_characteristics: string[];       // Common features/themes
  key_differences: string[];              // Major differences
  why_similar: string;                    // Explanation of similarity
  unique_advantages: string;              // What makes this destination unique
  
  // Practical comparison
  travel_logistics: {
    relative_accessibility: 'easier' | 'similar' | 'harder';
    visa_requirements_comparison: 'easier' | 'similar' | 'harder';
    language_barrier_comparison: 'easier' | 'similar' | 'harder';
    cost_comparison: 'cheaper' | 'similar' | 'more_expensive';
  };
  
  // Seasonal considerations
  best_time_to_visit: {
    optimal_seasons: string[];
    seasonal_similarity: number;          // How similar seasonal patterns are
    weather_comparison: string;
  };
  
  // Target audience alignment
  traveler_type_alignment: {
    [traveler_type: string]: number;      // Alignment score for different traveler types
  };
  
  // Evidence and validation
  similarity_evidence: {
    data_sources: string[];               // Sources used for similarity calculation
    comparison_methodology: string;       // How similarity was calculated
    validation_status: 'verified' | 'pending' | 'disputed';
    expert_validation: boolean;
  };
  
  // Visual and media
  destination_image_url?: string;         // Representative image
  comparison_highlights: string[];        // Key comparison points for UI
  
  // Processing metadata
  last_updated: string;                   // ISO 8601 timestamp
  calculation_timestamp: string;          // When similarity was calculated
}
```

### Similarity Matrix Schema
```typescript
interface SimilarityMatrix {
  base_destination: string;               // The destination being compared against
  
  // Dimensional breakdown
  dimension_weights: {
    cultural: number;                     // Weight given to cultural factors
    climate: number;                      // Weight given to climate factors
    activities: number;                   // Weight given to activity factors
    cost_level: number;                   // Weight given to cost factors
    infrastructure: number;               // Weight given to infrastructure
    natural_features: number;             // Weight given to natural features
    urban_rural_balance: number;          // Weight given to urban/rural balance
    tourist_density: number;              // Weight given to tourism density
  };
  
  // Comparison methodology
  algorithm_used: 'cosine_similarity' | 'euclidean_distance' | 'weighted_composite';
  data_points_considered: number;
  calculation_confidence: number;         // 0.0 - 1.0
  
  // Quality metrics
  data_completeness: number;              // Percentage of data available for comparison
  comparison_reliability: number;         // Reliability of the comparison
}
```

### Comparison Metrics Schema
```typescript
interface ComparisonMetrics {
  // Distribution analysis
  similarity_distribution: {
    very_similar: number;                 // Count with similarity > 0.8
    moderately_similar: number;           // Count with similarity 0.6-0.8
    somewhat_similar: number;             // Count with similarity 0.4-0.6
    less_similar: number;                 // Count with similarity < 0.4
  };
  
  // Top similarities by dimension
  top_cultural_matches: SimilarDestination[];
  top_climate_matches: SimilarDestination[];
  top_activity_matches: SimilarDestination[];
  
  // Geographic distribution
  geographic_spread: {
    same_continent: number;
    different_continent: number;
    same_region: number;
    different_region: number;
  };
  
  // Practical considerations
  accessibility_comparison: {
    easier_to_reach: number;
    similar_accessibility: number;
    harder_to_reach: number;
  };
  
  cost_comparison: {
    cheaper_alternatives: number;
    similar_cost: number;
    more_expensive: number;
  };
}
```

### Similarity Statistics Schema
```typescript
interface SimilarityStatistics {
  total_destinations_compared: number;
  average_similarity_score: number;       // Average across all comparisons
  highest_similarity_score: number;
  lowest_similarity_score: number;
  
  // Confidence metrics
  average_confidence: number;
  high_confidence_matches: number;        // Count with confidence > 0.8
  
  // Data quality
  data_coverage_percentage: number;       // How much data was available
  comparison_completeness: number;        // How complete the comparison is
  
  // Temporal information
  last_calculation_date: string;          // ISO 8601
  calculation_frequency: 'daily' | 'weekly' | 'monthly';
  next_update_scheduled: string;          // ISO 8601
}
```

### Similar Destinations Metadata Schema
```typescript
interface SimilarDestinationsMetadata {
  base_destination: string;               // Destination being compared
  total_count: number;                    // Total similar destinations found
  data_freshness: string;                 // ISO 8601 timestamp
  processing_info: {
    agent_used: 'SimilarDestinationsAgent';
    processing_time: number;              // Processing time in milliseconds
    data_source: 'similarity_algorithm' | 'cached' | 'real_time';
    algorithm_version: string;            // Version of similarity algorithm used
  };
  
  // Quality indicators
  data_quality_score: number;             // 0.0 - 1.0 overall data quality
  comparison_reliability: number;         // 0.0 - 1.0 reliability of comparisons
  coverage_completeness: number;          // 0.0 - 1.0 how complete the coverage is
}
```

## 🔄 **Data Flow**

1. **Component Mount**: Load similar destinations for selected destination
2. **Similarity Calculation**: Process multi-dimensional similarity analysis
3. **Filtering**: Filter by similarity dimensions or thresholds
4. **Comparison Modal**: Detailed side-by-side comparison
5. **Map Integration**: Geographic visualization of similar destinations
6. **Statistics Display**: Show similarity metrics and distributions

## 🎨 **UI Data Binding**

### Similarity Score Display
```typescript
const getSimilarityColor = (score) => {
  if (score >= 0.8) return 'text-green-600 bg-green-100';
  if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
  if (score >= 0.4) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};
```

### Dimensional Comparison
```typescript
const renderDimensionalScores = (dimensions) => {
  return Object.entries(dimensions).map(([dimension, score]) => (
    <div key={dimension} className="dimension-score">
      <span className="dimension-name">{dimension.replace('_', ' ')}</span>
      <div className="score-bar">
        <div 
          className="score-fill" 
          style={{ width: `${score * 100}%` }}
        />
      </div>
      <span className="score-value">{(score * 100).toFixed(0)}%</span>
    </div>
  ));
};
```

### Filtering Implementation
```typescript
const filteredDestinations = similar_destinations.filter(dest => {
  if (selectedDimension === 'all') return true;
  return dest.similarity_dimensions[selectedDimension] >= minimumScore;
});
```

## 🔍 **Mock Data Structure**

```typescript
const mockSimilarDestinationsData = {
  'paris': [
    {
      destination_id: 'rome',
      destination_name: 'Rome',
      country: 'Italy',
      region: 'Southern Europe',
      overall_similarity_score: 0.87,
      confidence_score: 0.92,
      similarity_dimensions: {
        cultural: 0.91,
        climate: 0.78,
        activities: 0.85,
        cost_level: 0.82,
        infrastructure: 0.89,
        natural_features: 0.65,
        urban_rural_balance: 0.88,
        tourist_density: 0.93
      },
      shared_characteristics: [
        'Rich historical heritage',
        'World-class museums',
        'Romantic atmosphere',
        'Excellent cuisine',
        'Walkable city center'
      ],
      key_differences: [
        'Ancient Roman history vs French elegance',
        'Mediterranean climate vs Continental',
        'Italian cuisine focus vs French gastronomy'
      ],
      why_similar: 'Both are European capitals with exceptional cultural heritage, world-renowned cuisine, and romantic atmospheres that attract millions of visitors annually.',
      unique_advantages: 'Rome offers more ancient history and ruins, while maintaining a similar level of cultural sophistication'
    }
  ]
};
```

## 🚀 **Implementation Notes**

1. **Multi-dimensional Analysis**: Comprehensive similarity across 8 key dimensions
2. **Interactive Visualization**: Map and chart integration for similarity exploration
3. **Practical Comparison**: Focus on actionable travel planning information
4. **Evidence-based**: Transparent methodology and data sources
5. **Responsive Design**: Adapts to different screen sizes and devices
6. **Real-time Updates**: Periodic recalculation of similarity scores

## 🔗 **Related Components**

- `SimilarDestinationCard.jsx` - Individual destination similarity card
- `ComparisonModal.jsx` - Detailed destination comparison modal
- `SimilarityMap.jsx` - Geographic visualization component
- `DestinationInsightsPage.jsx` - Parent page container
- `SimilarDestinationsAgent` - Backend agent for similarity calculation
