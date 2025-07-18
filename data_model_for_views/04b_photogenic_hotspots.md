# Photogenic Hotspots Tab - Data Model Specification

## 📋 **Overview**

The Photogenic Hotspots Tab provides comprehensive photography location insights for destinations, displaying detailed hotspot cards with photo opportunities, timing conditions, equipment recommendations, and travel logistics. It's part of the Destination Insights page navigation system and uses the PhotogenicHotspotsAgent for data generation.

## 🎯 **Navigation & Location**
- **File**: `/src/components/destinations/PhotogenicHotspotsTab.jsx`
- **Parent**: DestinationInsightsPage (`/destination-insights`)
- **Tab Position**: 3rd tab in Destination Insights navigation
- **Icon**: `📸` (Camera icon)
- **Permissions**: Requires 'read' permission

## 🎯 **View Components**

1. **Search Bar**: Real-time hotspot search functionality
2. **Statistics Dashboard**: Total hotspots, average confidence, photogenic score distribution
3. **Hotspot Cards**: Individual hotspot details with expandable sections
4. **Evidence Modal**: Detailed evidence sources with authority validation
5. **Loading States**: Skeleton loaders during data fetch

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/destinations/{destination_id}/photogenic-hotspots
```

### Response Schema
```typescript
interface PhotogenicHotspotsResponse {
  hotspots: PhotogenicHotspotObject[];
  statistics: HotspotStatistics;
  metadata: HotspotMetadata;
}
```

### Photogenic Hotspot Object Schema
```typescript
interface PhotogenicHotspotObject {
  // Core identifiers
  location_name: {
    primary_name: string;                   // Main location name
    alternative_names?: string[];           // Alternative names/local names
  };
  
  // Photo worthiness assessment
  photo_worthiness: {
    why_instagram_worthy: string;           // Why it's photogenic/Instagram-worthy
    unique_visual_elements: string;         // Unique visual features
    composition_opportunities: string;       // Photo composition tips
    lighting_conditions: string;            // Best lighting information
  };
  
  // Timing and conditions
  timing_conditions: {
    best_times_day: string[];              // Optimal times of day
    seasonal_considerations: string;        // Seasonal variations
    crowd_patterns: string;                // When to avoid crowds
    weather_dependencies: string;          // Weather impact on photos
  };
  
  // Equipment and technical
  equipment_recommendations: {
    recommended_gear: string[];            // Camera equipment suggestions
    technical_settings: string;            // Camera settings advice
    special_equipment: string;             // Tripods, filters, etc.
    mobile_photography_tips: string;       // Smartphone photography advice
  };
  
  // Travel logistics
  travel_logistics: {
    accessibility_info: string;            // How to reach the location
    parking_transportation: string;        // Parking and transport options
    entry_requirements: string;            // Tickets, permissions needed
    duration_recommendations: string;       // How long to spend
  };
  
  // Photography tips and context
  photo_tips: {
    composition_advice: string;            // Composition techniques
    common_mistakes: string;               // What to avoid
    pro_photographer_secrets: string;      // Advanced tips
    post_processing_suggestions: string;   // Editing recommendations
  };
  
  // Local context
  local_context: {
    cultural_significance: string;         // Cultural importance
    historical_background: string;         // Historical context
    local_etiquette: string;              // Photography etiquette
    respect_guidelines: string;           // Respectful photography practices
  };
  
  // Practical information
  practical_info: {
    cost_considerations: string;           // Costs involved
    safety_notes: string;                 // Safety considerations
    alternative_viewpoints: string;        // Other photo angles
    nearby_amenities: string;             // Facilities nearby
  };
  
  // Scoring and validation
  photogenic_score: number;               // 0.0 - 1.0 photogenic rating
  confidence_score: number;               // 0.0 - 1.0 confidence score
  evidence_score: number;                 // 0.0 - 1.0 evidence validation score
  
  // Evidence and validation
  evidence_sources: {
    source_type: 'photography_blog' | 'travel_guide' | 'social_media' | 'local_photographer' | 'official_tourism';
    source_name: string;
    authority_level: 'gold' | 'authoritative' | 'standard';
    content_snippet: string;
    validation_status: 'verified' | 'pending' | 'disputed';
    confidence_score: number;
  }[];
  
  // Processing metadata
  last_updated: string;                   // ISO 8601 timestamp
  validation_timestamp: string;           // ISO 8601 timestamp
}
```

### Hotspot Statistics Schema
```typescript
interface HotspotStatistics {
  total_hotspots: number;                 // Total number of hotspots
  average_photogenic_score: number;       // Average photogenic score (0.0 - 1.0)
  average_confidence: number;             // Average confidence score (0.0 - 1.0)
  average_evidence_score: number;         // Average evidence score (0.0 - 1.0)
  score_distribution: {
    high_photogenic: number;              // Count with photogenic score > 0.8
    medium_photogenic: number;            // Count with photogenic score 0.6-0.8
    low_photogenic: number;               // Count with photogenic score < 0.6
  };
}
```

### Hotspot Metadata Schema
```typescript
interface HotspotMetadata {
  destination: string;                    // Destination identifier
  total_count: number;                    // Total hotspots available
  data_freshness: string;                 // ISO 8601 timestamp
  processing_info: {
    agent_used: 'PhotogenicHotspotsAgent';
    processing_time: number;              // Processing time in milliseconds
    data_source: 'multi_llm_consensus' | 'cached' | 'real_time';
    llm_models_used: string[];            // Models used for consensus
  };
}
```

## 🔄 **Data Flow**

1. **Component Mount**: Load photogenic hotspots for selected destination
2. **Search Functionality**: Filter hotspots by location name in real-time
3. **Card Interaction**: Expand/collapse hotspot detail sections
4. **Evidence Modal**: Show detailed evidence sources with authority ratings
5. **Statistics Display**: Show aggregated metrics and distributions

## 🎨 **UI Data Binding**

### Search Implementation
```typescript
const filteredHotspots = hotspots.filter(hotspot =>
  hotspot.location_name.primary_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  hotspot.photo_worthiness.why_instagram_worthy.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Statistics Display
```typescript
const stats = {
  totalHotspots: hotspots.length,
  averagePhotogenicScore: (hotspots.reduce((sum, h) => sum + h.photogenic_score, 0) / hotspots.length).toFixed(2),
  averageConfidence: (hotspots.reduce((sum, h) => sum + h.confidence_score, 0) / hotspots.length).toFixed(2),
  averageEvidenceScore: (hotspots.reduce((sum, h) => sum + h.evidence_score, 0) / hotspots.length).toFixed(2)
};
```

### Score Color Coding
```typescript
const getScoreColor = (score) => {
  if (score >= 0.8) return 'text-green-600 bg-green-100';
  if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};
```

## 🔍 **Mock Data Structure**

The current implementation uses mock data with the following structure for testing:

```typescript
const mockHotspots = {
  'paris': [
    {
      location_name: { primary_name: 'Trocadéro Gardens' },
      photo_worthiness: { 
        why_instagram_worthy: 'Perfect Eiffel Tower views with foreground gardens',
        unique_visual_elements: 'Symmetrical gardens leading to iconic tower',
        composition_opportunities: 'Leading lines, foreground/background layers',
        lighting_conditions: 'Golden hour creates warm tower illumination'
      },
      timing_conditions: {
        best_times_day: ['sunrise', 'golden_hour', 'blue_hour'],
        seasonal_considerations: 'Spring flowers add color, winter provides clean lines',
        crowd_patterns: 'Early morning less crowded, avoid sunset crowds',
        weather_dependencies: 'Clear skies essential for tower visibility'
      },
      // ... other attributes
      photogenic_score: 0.92,
      confidence_score: 0.89,
      evidence_score: 0.87
    }
    // ... more hotspots
  ]
};
```

## 🚀 **Implementation Notes**

1. **Performance**: Uses `useMemo` for mock data to prevent regeneration
2. **Expandable Sections**: Each card section can be expanded/collapsed
3. **Color Coding**: Scores are color-coded (green/yellow/red) for quick assessment
4. **Evidence Integration**: Links to evidence modal for detailed source validation
5. **Responsive Design**: Cards adapt to different screen sizes

## 🔗 **Related Components**

- `PhotogenicHotspotCard.jsx` - Individual hotspot card component
- `DestinationInsightsPage.jsx` - Parent page container
- `EvidenceModal.jsx` - Evidence validation modal
- `PhotogenicHotspotsAgent` - Backend agent for data generation
