# Destination Landmarks Tab - Data Model Specification

## 📋 **Overview**

The Destination Landmarks Tab provides comprehensive landmark information for destinations, displaying detailed landmark cards with historical significance, architectural features, cultural importance, and visitor experiences. It's part of the Destination Insights page navigation system.

## 🎯 **Navigation & Location**
- **File**: `/src/components/destinations/DestinationLandmarksTab.jsx`
- **Parent**: DestinationInsightsPage (`/destination-insights`)
- **Tab Position**: 2nd tab in Destination Insights navigation
- **Icon**: `🏛️` (Landmarks icon)
- **Permissions**: Requires 'read' permission

## 🎯 **View Components**

1. **Search Bar**: Real-time landmark search functionality
2. **Statistics Dashboard**: Total landmarks, average confidence, type distribution
3. **Landmark Cards**: Individual landmark details with expandable sections
4. **Loading States**: Skeleton loaders during data fetch
5. **Error Handling**: Error states for failed data loads

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/destinations/{destination_id}/landmarks
```

### Response Schema
```typescript
interface DestinationLandmarksResponse {
  landmarks: LandmarkObject[];
  statistics: LandmarkStatistics;
  metadata: LandmarkMetadata;
}
```

### Landmark Object Schema
```typescript
interface LandmarkObject {
  // Core identifiers
  landmark_name: string;                    // Primary landmark name
  landmark_description: string;             // Brief description
  landmark_type: 'architectural' | 'museum' | 'religious' | 'natural' | 'cultural' | 'historical';
  
  // Detailed attributes (13 core attributes)
  historical_significance: string;          // Historical background and importance
  architectural_features: string;           // Architectural details and design elements
  cultural_importance: string;              // Cultural significance and impact
  location_context: string;                 // Geographic and neighborhood context
  visitor_experiences: string;              // What visitors can expect and do
  popularity_reputation: string;            // Visitor numbers, ratings, reputation
  preservation_sustainability: string;      // Conservation efforts and sustainability
  accessibility_practical: string;          // Accessibility features and limitations
  events_festivals: string;                 // Special events and festivals hosted
  economic_souvenirs: string;              // Pricing, tickets, shopping opportunities
  
  // Confidence and validation
  confidence_score: number;                 // 0.0 - 1.0 confidence score
  
  // Evidence and validation (optional for detailed view)
  evidence_sources?: {
    source_type: 'official' | 'travel_guide' | 'review' | 'local_knowledge';
    source_name: string;
    authority_level: 'gold' | 'authoritative' | 'standard';
    content_snippet: string;
    validation_status: 'verified' | 'pending' | 'disputed';
  }[];
  
  // Processing metadata
  last_updated?: string;                    // ISO 8601 timestamp
  validation_timestamp?: string;            // ISO 8601 timestamp
}
```

### Landmark Statistics Schema
```typescript
interface LandmarkStatistics {
  total_landmarks: number;                  // Total number of landmarks
  average_confidence: number;               // Average confidence score (0.0 - 1.0)
  type_distribution: {
    [type: string]: number;                 // Count by landmark type
  };
  confidence_distribution: {
    high: number;                          // Count with confidence > 0.8
    medium: number;                        // Count with confidence 0.6-0.8
    low: number;                           // Count with confidence < 0.6
  };
}
```

### Landmark Metadata Schema
```typescript
interface LandmarkMetadata {
  destination: string;                      // Destination identifier
  total_count: number;                      // Total landmarks available
  data_freshness: string;                   // ISO 8601 timestamp
  processing_info: {
    agent_used: 'DestinationLandmarksAgent';
    processing_time: number;                // Processing time in milliseconds
    data_source: 'multi_llm_consensus' | 'cached' | 'real_time';
  };
}
```

## 🔄 **Data Flow**

1. **Component Mount**: Load landmarks for selected destination
2. **Search Functionality**: Filter landmarks by name/description in real-time
3. **Card Interaction**: Expand/collapse landmark details
4. **Evidence Modal**: Show detailed evidence sources (if available)

## 🎨 **UI Data Binding**

### Search Implementation
```typescript
const filteredLandmarks = landmarks.filter(landmark =>
  landmark.landmark_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  landmark.landmark_description.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Statistics Display
```typescript
const stats = {
  totalLandmarks: landmarks.length,
  averageConfidence: (landmarks.reduce((sum, l) => sum + l.confidence_score, 0) / landmarks.length).toFixed(2),
  typeDistribution: landmarks.reduce((acc, l) => {
    acc[l.landmark_type] = (acc[l.landmark_type] || 0) + 1;
    return acc;
  }, {})
};
```

## 🔍 **Mock Data Structure**

The current implementation uses mock data with the following structure for testing:

```typescript
const mockLandmarks = {
  'paris': [
    {
      landmark_name: 'Eiffel Tower',
      landmark_description: 'Iron lattice tower, symbol of Paris and architectural marvel',
      landmark_type: 'architectural',
      historical_significance: 'Built in 1889 for the 1889 World\'s Fair, designed by Gustave Eiffel',
      architectural_features: 'Iron lattice construction, 324 meters tall, three observation levels',
      cultural_importance: 'Global symbol of France, romantic icon, most visited paid monument',
      location_context: 'Champ de Mars, 7th arrondissement, near Seine River',
      visitor_experiences: 'Evening illumination shows, dining at restaurants, panoramic city views',
      popularity_reputation: '7 million annual visitors, 4.5 star rating',
      preservation_sustainability: 'Regular maintenance, LED lighting upgrade, crowd management',
      accessibility_practical: 'Limited mobility access to first level, elevators available',
      events_festivals: 'New Year celebrations, Bastille Day fireworks, light shows',
      economic_souvenirs: 'Entry €29.40 for top level, extensive souvenir shops',
      confidence_score: 0.95
    }
    // ... more landmarks
  ]
};
```

## 🚀 **Implementation Notes**

1. **Performance**: Uses `useMemo` for mock data to prevent regeneration
2. **Search**: Real-time filtering with debounced search input
3. **Responsive**: Cards adapt to different screen sizes
4. **Accessibility**: Proper ARIA labels and keyboard navigation
5. **Error Handling**: Graceful fallbacks for missing data

## 🔗 **Related Components**

- `DestinationLandmarkCard.jsx` - Individual landmark card component
- `DestinationInsightsPage.jsx` - Parent page container
- `EvidenceModal.jsx` - Evidence validation modal (if implemented)
