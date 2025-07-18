# Local Insider Tab - Data Model Specification

## 📋 **Overview**

The Local Insider Tab provides authentic local insights and insider knowledge for destinations, displaying detailed insider tips, hidden gems, local customs, and authentic experiences that only locals would know. It's part of the Destination Insights page navigation system and uses the LocalInsiderAgent for data generation.

## 🎯 **Navigation & Location**
- **File**: `/src/components/destinations/LocalInsiderTab.jsx`
- **Parent**: DestinationInsightsPage (`/destination-insights`)
- **Tab Position**: 5th tab in Destination Insights navigation
- **Icon**: `👥` (People icon)
- **Permissions**: Requires 'read' permission

## 🎯 **View Components**

1. **Search Bar**: Real-time insider tip search functionality
2. **Category Filter**: Filter by tip categories (Food, Culture, Transportation, etc.)
3. **Statistics Dashboard**: Total tips, average authenticity score, category distribution
4. **Insider Tip Cards**: Individual tip details with expandable sections
5. **Evidence Modal**: Detailed evidence sources with local validation
6. **Loading States**: Skeleton loaders during data fetch

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/destinations/{destination_id}/local-insider-tips
```

### Response Schema
```typescript
interface LocalInsiderResponse {
  insider_tips: LocalInsiderTipObject[];
  statistics: InsiderStatistics;
  metadata: InsiderMetadata;
}
```

### Local Insider Tip Object Schema
```typescript
interface LocalInsiderTipObject {
  // Core identifiers
  id: string;                             // Unique tip identifier
  tip_title: string;                      // Primary tip title
  category: 'food' | 'culture' | 'transportation' | 'shopping' | 'entertainment' | 'hidden_gems' | 'customs' | 'practical';
  
  // Core content
  tip_description: string;                // Detailed tip description
  insider_knowledge: string;              // What makes this insider knowledge
  local_context: string;                  // Local cultural context
  authenticity_explanation: string;       // Why this is authentic local knowledge
  
  // Detailed attributes
  how_locals_do_it: string;              // How locals actually approach this
  tourist_vs_local: string;              // Difference between tourist and local approach
  timing_considerations: string;          // When to apply this tip
  location_specifics: string;            // Specific locations or areas
  cost_implications: string;             // Cost considerations
  difficulty_level: 'easy' | 'moderate' | 'challenging';
  
  // Practical information
  step_by_step_guide: string;            // How to implement the tip
  common_mistakes: string;               // What tourists typically get wrong
  language_phrases: string;              // Useful local phrases
  etiquette_notes: string;               // Cultural etiquette considerations
  
  // Validation and authenticity
  authenticity_score: number;            // 0.0 - 1.0 authenticity rating
  confidence_score: number;              // 0.0 - 1.0 confidence score
  local_validation_score: number;        // 0.0 - 1.0 local expert validation
  
  // Evidence and validation
  evidence_sources: {
    source_type: 'local_expert' | 'resident_interview' | 'local_blog' | 'community_forum' | 'cultural_guide' | 'expat_knowledge';
    source_name: string;
    authority_level: 'gold' | 'authoritative' | 'standard';
    content_snippet: string;
    validation_status: 'verified' | 'pending' | 'disputed';
    local_credibility: number;            // 0.0 - 1.0 local credibility score
    years_local_experience?: number;      // Years of local experience (if applicable)
  }[];
  
  // Local expert consensus
  local_consensus: {
    experts_consulted: number;            // Number of local experts consulted
    agreement_percentage: number;         // Percentage agreement among locals
    regional_variations: string[];        // Regional differences within destination
    generational_differences: string;     // Differences between age groups
  };
  
  // Seasonal and temporal factors
  seasonality: {
    year_round_applicable: boolean;       // Whether tip applies year-round
    seasonal_variations: {
      [season: string]: {
        applicability: boolean;
        modifications: string;
        effectiveness: number;            // 0.0 - 1.0
      };
    };
    time_sensitive: boolean;              // Whether tip is time-sensitive
  };
  
  // Processing metadata
  last_updated: string;                   // ISO 8601 timestamp
  validation_timestamp: string;           // ISO 8601 timestamp
  local_review_date: string;             // When last reviewed by local expert
}
```

### Insider Statistics Schema
```typescript
interface InsiderStatistics {
  total_tips: number;                     // Total number of insider tips
  average_authenticity: number;           // Average authenticity score (0.0 - 1.0)
  average_confidence: number;             // Average confidence score (0.0 - 1.0)
  average_local_validation: number;       // Average local validation score (0.0 - 1.0)
  
  category_distribution: {
    [category: string]: number;           // Count by category
  };
  
  difficulty_distribution: {
    easy: number;                         // Count of easy tips
    moderate: number;                     // Count of moderate tips
    challenging: number;                  // Count of challenging tips
  };
  
  authenticity_distribution: {
    high: number;                         // Count with authenticity > 0.8
    medium: number;                       // Count with authenticity 0.6-0.8
    low: number;                          // Count with authenticity < 0.6
  };
}
```

### Insider Metadata Schema
```typescript
interface InsiderMetadata {
  destination: string;                    // Destination identifier
  total_count: number;                    // Total tips available
  data_freshness: string;                 // ISO 8601 timestamp
  processing_info: {
    agent_used: 'LocalInsiderAgent';
    processing_time: number;              // Processing time in milliseconds
    data_source: 'local_expert_network' | 'community_validation' | 'hybrid';
    local_experts_consulted: number;      // Number of local experts involved
    validation_method: 'expert_review' | 'community_consensus' | 'hybrid';
  };
}
```

## 🔄 **Data Flow**

1. **Component Mount**: Load local insider tips for selected destination
2. **Search Functionality**: Filter tips by title/description in real-time
3. **Category Filtering**: Filter by tip categories
4. **Card Interaction**: Expand/collapse tip detail sections
5. **Evidence Modal**: Show detailed evidence sources with local validation
6. **Statistics Display**: Show aggregated metrics and distributions

## 🎨 **UI Data Binding**

### Search Implementation
```typescript
const filteredTips = tips.filter(tip =>
  tip.tip_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  tip.tip_description.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Category Filtering
```typescript
const categoryFilteredTips = selectedCategory === 'all' 
  ? filteredTips 
  : filteredTips.filter(tip => tip.category === selectedCategory);
```

### Statistics Display
```typescript
const stats = {
  totalTips: tips.length,
  averageAuthenticity: (tips.reduce((sum, t) => sum + t.authenticity_score, 0) / tips.length).toFixed(2),
  averageConfidence: (tips.reduce((sum, t) => sum + t.confidence_score, 0) / tips.length).toFixed(2),
  averageLocalValidation: (tips.reduce((sum, t) => sum + t.local_validation_score, 0) / tips.length).toFixed(2)
};
```

### Difficulty Badge Styling
```typescript
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'moderate': return 'bg-yellow-100 text-yellow-800';
    case 'challenging': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
```

## 🔍 **Mock Data Structure**

The current implementation uses mock data with the following structure for testing:

```typescript
const mockLocalInsiderData = {
  'paris': [
    {
      id: 'paris_bakery_timing',
      tip_title: 'Best Time to Visit Local Bakeries',
      category: 'food',
      tip_description: 'Visit neighborhood bakeries between 7-8 AM for the freshest croissants and pain au chocolat',
      insider_knowledge: 'Locals know that the best pastries are gone by 9 AM, and afternoon batches are never as good',
      local_context: 'French breakfast culture revolves around fresh morning pastries',
      authenticity_explanation: 'This timing is based on traditional French baking schedules that tourists rarely know about',
      how_locals_do_it: 'Parisians stop by their neighborhood boulangerie on their way to work',
      tourist_vs_local: 'Tourists visit bakeries throughout the day, locals know the prime morning window',
      timing_considerations: 'Weekdays are best, avoid Sundays when many bakeries are closed',
      location_specifics: 'Neighborhood bakeries in residential areas, not tourist-focused patisseries',
      authenticity_score: 0.92,
      confidence_score: 0.89,
      local_validation_score: 0.94,
      difficulty_level: 'easy'
    }
    // ... more tips
  ]
};
```

## 🚀 **Implementation Notes**

1. **Performance**: Uses `useMemo` for mock data and filtering operations
2. **Local Validation**: Emphasizes local expert validation and authenticity
3. **Difficulty Levels**: Visual indicators for tip difficulty/complexity
4. **Cultural Context**: Rich cultural context and etiquette information
5. **Practical Focus**: Step-by-step guides and common mistake warnings
6. **Responsive Design**: Cards adapt to different screen sizes

## 🔗 **Related Components**

- `LocalInsiderCard.jsx` - Individual insider tip card component (if exists)
- `DestinationInsightsPage.jsx` - Parent page container
- `EvidenceModal.jsx` - Evidence validation modal
- `LocalInsiderAgent` - Backend agent for data generation
