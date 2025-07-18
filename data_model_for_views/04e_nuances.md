# Nuances Tab - Data Model Specification

## 📋 **Overview**

The Nuances Tab provides detailed destination-specific nuances, hotel expectations, and vacation rental insights that help travelers understand the subtle but important aspects of a destination. It's part of the Destination Insights page navigation system and provides three distinct categories of nuanced information.

## 🎯 **Navigation & Location**
- **File**: `/src/components/destinations/NuancesTab.jsx`
- **Parent**: DestinationInsightsPage (`/destination-insights`)
- **Tab Position**: 6th tab in Destination Insights navigation
- **Icon**: `💡` (Lightbulb icon)
- **Permissions**: Requires 'read' permission

## 🎯 **View Components**

1. **Tab Navigation**: Three sub-tabs (Destination, Hotel, Vacation Rental)
2. **Nuance Cards**: Individual nuance details with expandable sections
3. **Search Functionality**: Filter nuances by content
4. **Evidence Modal**: Detailed evidence sources with authority validation
5. **Statistics Dashboard**: Nuance counts and confidence metrics
6. **Loading States**: Skeleton loaders during data fetch

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/destinations/{destination_id}/nuances
```

### Response Schema
```typescript
interface NuancesResponse {
  destination_nuances: DestinationNuance[];
  hotel_expectations: HotelExpectation[];
  vacation_rental_nuances: VacationRentalNuance[];
  statistics: NuancesStatistics;
  metadata: NuancesMetadata;
}
```

### Destination Nuance Schema
```typescript
interface DestinationNuance {
  // Core identifiers
  id: string;                             // Unique nuance identifier
  nuance: string;                         // The nuance description
  explanation: string;                    // Detailed explanation
  confidence: number;                     // 0.0 - 1.0 confidence score
  
  // Categorization
  category: 'cultural' | 'practical' | 'social' | 'experiential' | 'seasonal' | 'logistical';
  impact_level: 'minor' | 'moderate' | 'significant' | 'critical';
  
  // Detailed context
  why_important: string;                  // Why this nuance matters
  common_misconceptions: string;          // What travelers often get wrong
  local_perspective: string;              // How locals view this aspect
  visitor_impact: string;                 // How this affects visitors
  
  // Practical information
  how_to_navigate: string;                // Practical advice for dealing with this nuance
  timing_considerations: string;          // When this nuance is most relevant
  preparation_tips: string;               // How to prepare for this nuance
  
  // Evidence and validation
  evidence_sources: {
    source_type: 'local_expert' | 'travel_guide' | 'cultural_institution' | 'government' | 'tourism_board';
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

### Hotel Expectation Schema
```typescript
interface HotelExpectation {
  // Core identifiers
  id: string;                             // Unique expectation identifier
  expectation: string;                    // What to expect
  explanation: string;                    // Detailed explanation
  confidence: number;                     // 0.0 - 1.0 confidence score
  
  // Categorization
  category: 'service' | 'amenities' | 'cultural' | 'practical' | 'pricing' | 'booking';
  hotel_tier: 'budget' | 'mid_range' | 'luxury' | 'all_tiers';
  
  // Detailed context
  why_different: string;                  // Why this differs from other destinations
  cultural_context: string;               // Cultural reasons behind this expectation
  practical_implications: string;         // Practical impact on stay
  
  // Comparison context
  vs_international_standards: string;     // How this compares to international norms
  regional_variations: string;            // Variations within the destination
  
  // Practical advice
  how_to_prepare: string;                 // How to prepare for this expectation
  what_to_request: string;                // What to ask for or request
  red_flags: string;                      // Warning signs to watch for
  
  // Evidence and validation
  evidence_sources: {
    source_type: 'hotel_industry' | 'travel_review' | 'local_expert' | 'tourism_board';
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

### Vacation Rental Nuance Schema
```typescript
interface VacationRentalNuance {
  // Core identifiers
  id: string;                             // Unique nuance identifier
  nuance: string;                         // The nuance description
  explanation: string;                    // Detailed explanation
  confidence: number;                     // 0.0 - 1.0 confidence score
  
  // Categorization
  category: 'booking' | 'amenities' | 'neighborhood' | 'regulations' | 'cultural' | 'practical';
  rental_type: 'apartment' | 'house' | 'villa' | 'all_types';
  
  // Detailed context
  local_regulations: string;              // Local laws and regulations
  neighborhood_considerations: string;     // Neighborhood-specific factors
  cultural_expectations: string;          // Cultural norms for rentals
  
  // Practical information
  booking_considerations: string;         // What to consider when booking
  check_in_process: string;               // Typical check-in procedures
  amenity_expectations: string;           // What amenities to expect/not expect
  
  // Common issues
  potential_challenges: string;           // Common challenges guests face
  how_to_avoid_problems: string;          // Prevention strategies
  resolution_approaches: string;          // How to resolve issues
  
  // Evidence and validation
  evidence_sources: {
    source_type: 'rental_platform' | 'local_expert' | 'guest_review' | 'property_manager';
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

### Nuances Statistics Schema
```typescript
interface NuancesStatistics {
  total_nuances: {
    destination: number;
    hotel: number;
    vacation_rental: number;
    total: number;
  };
  
  average_confidence: {
    destination: number;
    hotel: number;
    vacation_rental: number;
    overall: number;
  };
  
  category_distribution: {
    destination: { [category: string]: number };
    hotel: { [category: string]: number };
    vacation_rental: { [category: string]: number };
  };
  
  impact_level_distribution: {
    critical: number;
    significant: number;
    moderate: number;
    minor: number;
  };
}
```

### Nuances Metadata Schema
```typescript
interface NuancesMetadata {
  destination: string;                    // Destination identifier
  total_count: number;                    // Total nuances across all categories
  data_freshness: string;                 // ISO 8601 timestamp
  processing_info: {
    agent_used: 'DestinationNuancesAgent';
    processing_time: number;              // Processing time in milliseconds
    data_source: 'multi_expert_consensus' | 'cached' | 'real_time';
    validation_method: 'expert_review' | 'community_validation' | 'hybrid';
  };
}
```

## 🔄 **Data Flow**

1. **Component Mount**: Load nuances for selected destination
2. **Tab Navigation**: Switch between destination, hotel, and vacation rental nuances
3. **Search Functionality**: Filter nuances by content in real-time
4. **Card Interaction**: Expand/collapse nuance detail sections
5. **Evidence Modal**: Show detailed evidence sources with authority ratings
6. **Statistics Display**: Show aggregated metrics across categories

## 🎨 **UI Data Binding**

### Tab Content Switching
```typescript
const getActiveNuances = () => {
  switch (activeSubTab) {
    case 'destination': return destination_nuances;
    case 'hotel': return hotel_expectations;
    case 'vacation_rental': return vacation_rental_nuances;
    default: return destination_nuances;
  }
};
```

### Search Implementation
```typescript
const filteredNuances = getActiveNuances().filter(nuance =>
  nuance.nuance.toLowerCase().includes(searchTerm.toLowerCase()) ||
  nuance.explanation.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Statistics Calculation
```typescript
const calculateStats = () => ({
  totalNuances: destination_nuances.length + hotel_expectations.length + vacation_rental_nuances.length,
  averageConfidence: (
    [...destination_nuances, ...hotel_expectations, ...vacation_rental_nuances]
      .reduce((sum, n) => sum + n.confidence, 0) / totalNuances
  ).toFixed(2)
});
```

## 🔍 **Mock Data Structure**

```typescript
const mockNuancesData = {
  'paris': {
    destination_nuances: [
      {
        id: 'paris_dining_timing',
        nuance: 'Dinner is served much later than in many countries',
        explanation: 'Restaurants typically don\'t serve dinner until 7:30-8:00 PM, with most locals eating around 8:30-9:00 PM',
        confidence: 0.92,
        category: 'cultural',
        impact_level: 'moderate',
        why_important: 'Arriving too early may result in closed restaurants or limited service',
        common_misconceptions: 'Tourists often expect dinner service at 6 PM like in other countries',
        local_perspective: 'Parisians view early dining as rushed and unrefined'
      }
    ],
    hotel_expectations: [
      {
        id: 'paris_hotel_size',
        expectation: 'Hotel rooms are typically smaller than North American standards',
        explanation: 'Due to historic building constraints, Parisian hotel rooms average 15-20% smaller',
        confidence: 0.89,
        category: 'practical',
        hotel_tier: 'all_tiers'
      }
    ],
    vacation_rental_nuances: [
      {
        id: 'paris_rental_regulations',
        nuance: 'Strict regulations on short-term rentals in central Paris',
        explanation: 'Many arrondissements have limits on rental duration and registration requirements',
        confidence: 0.94,
        category: 'regulations',
        rental_type: 'all_types'
      }
    ]
  }
};
```

## 🚀 **Implementation Notes**

1. **Three-Tab Structure**: Destination, Hotel, and Vacation Rental categories
2. **Evidence Integration**: Rich evidence modal with authority validation
3. **Impact Levels**: Visual indicators for nuance importance
4. **Cultural Context**: Emphasis on cultural understanding and local perspective
5. **Practical Advice**: Actionable tips for travelers
6. **Responsive Design**: Adapts to different screen sizes

## 🔗 **Related Components**

- `NuanceCard.jsx` - Individual nuance card component (if exists)
- `DestinationInsightsPage.jsx` - Parent page container
- `EvidenceModal.jsx` - Evidence validation modal
- `DestinationNuancesAgent` - Backend agent for data generation
