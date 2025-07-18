# Known For Attributes Tab - Data Model Specification

## 📋 **Overview**

The Known For Attributes Tab provides comprehensive cultural and historical attributes that destinations are known for, displaying detailed attribute cards with multi-LLM consensus validation, evidence sources, and authority ratings. It's part of the Destination Insights page navigation system and uses the KnownForAgent for data generation.

## 🎯 **Navigation & Location**
- **File**: `/src/components/destinations/KnownForTab.jsx`
- **Parent**: DestinationInsightsPage (`/destination-insights`)
- **Tab Position**: 4th tab in Destination Insights navigation
- **Icon**: `🏆` (Trophy icon)
- **Permissions**: Requires 'read' permission

## 🎯 **View Components**

1. **Search Bar**: Real-time attribute search functionality
2. **Filter Buttons**: Category-based filtering (Cultural, Historical, Culinary, etc.)
3. **Statistics Dashboard**: Total attributes, average confidence, category distribution
4. **Attribute Cards**: Individual attribute details with expandable sections
5. **Evidence Modal**: Detailed evidence sources with authority validation
6. **Loading States**: Skeleton loaders during data fetch

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/destinations/{destination_id}/known-for-attributes
```

### Response Schema
```typescript
interface KnownForAttributesResponse {
  attributes: KnownForAttributeObject[];
  statistics: AttributeStatistics;
  metadata: AttributeMetadata;
}
```

### Known For Attribute Object Schema
```typescript
interface KnownForAttributeObject {
  // Core identifiers
  id: string;                             // Unique attribute identifier
  attribute_name: string;                 // Primary attribute name
  category: 'cultural' | 'historical' | 'culinary' | 'architectural' | 'natural' | 'artistic' | 'social' | 'economic';
  
  // Core content
  description: string;                    // Detailed description of what destination is known for
  significance: string;                   // Why this attribute is significant
  historical_context: string;             // Historical background and development
  cultural_impact: string;                // Cultural significance and influence
  
  // Detailed attributes
  origin_story: string;                   // How this attribute originated
  evolution_timeline: string;             // How it has evolved over time
  current_status: string;                 // Current state and relevance
  global_recognition: string;             // International recognition level
  local_perspective: string;              // How locals view this attribute
  visitor_experience: string;             // How visitors encounter this attribute
  
  // Comparative context
  uniqueness_factor: string;              // What makes this unique to the destination
  similar_destinations: string[];         // Other destinations with similar attributes
  distinguishing_features: string;        // What sets this apart from similar places
  
  // Practical information
  best_experienced: string;               // How/when to best experience this attribute
  accessibility: string;                  // How accessible this is to visitors
  seasonal_variations: string;            // Seasonal changes or considerations
  
  // Validation and scoring
  confidence_score: number;               // 0.0 - 1.0 confidence score
  authority_score: number;                // 0.0 - 1.0 authority validation score
  consensus_score: number;                // 0.0 - 1.0 multi-LLM consensus score
  
  // Evidence and validation
  evidence_sources: {
    source_type: 'academic' | 'official_tourism' | 'cultural_institution' | 'travel_guide' | 'local_expert' | 'historical_record';
    source_name: string;
    authority_level: 'gold' | 'authoritative' | 'standard';
    content_snippet: string;
    validation_status: 'verified' | 'pending' | 'disputed';
    confidence_score: number;
    url?: string;                         // Source URL if available
  }[];
  
  // Multi-LLM consensus data
  llm_consensus: {
    models_used: string[];                // e.g., ["gpt-4", "claude-3", "gemini-pro"]
    consensus_score: number;              // 0.0 - 1.0
    agreement_areas: string[];            // Areas where models agreed
    disagreement_areas: string[];         // Areas of disagreement
    final_resolution: string;             // How disagreements were resolved
  };
  
  // Processing metadata
  last_updated: string;                   // ISO 8601 timestamp
  validation_timestamp: string;           // ISO 8601 timestamp
  processing_time: number;                // Processing time in milliseconds
}
```

### Attribute Statistics Schema
```typescript
interface AttributeStatistics {
  total_attributes: number;               // Total number of attributes
  average_confidence: number;             // Average confidence score (0.0 - 1.0)
  average_authority: number;              // Average authority score (0.0 - 1.0)
  average_consensus: number;              // Average consensus score (0.0 - 1.0)
  
  category_distribution: {
    [category: string]: number;           // Count by category
  };
  
  confidence_distribution: {
    high: number;                         // Count with confidence > 0.8
    medium: number;                       // Count with confidence 0.6-0.8
    low: number;                          // Count with confidence < 0.6
  };
  
  evidence_quality: {
    gold_sources: number;                 // Count of gold-level sources
    authoritative_sources: number;        // Count of authoritative sources
    standard_sources: number;             // Count of standard sources
  };
}
```

### Attribute Metadata Schema
```typescript
interface AttributeMetadata {
  destination: string;                    // Destination identifier
  total_count: number;                    // Total attributes available
  data_freshness: string;                 // ISO 8601 timestamp
  processing_info: {
    agent_used: 'KnownForAgent';
    processing_time: number;              // Processing time in milliseconds
    data_source: 'multi_llm_consensus' | 'cached' | 'real_time';
    llm_models_used: string[];            // Models used for consensus
    validation_method: 'web_search' | 'knowledge_base' | 'hybrid';
  };
}
```

## 🔄 **Data Flow**

1. **Component Mount**: Load known-for attributes for selected destination
2. **Search Functionality**: Filter attributes by name/description in real-time
3. **Category Filtering**: Filter by attribute categories
4. **Card Interaction**: Expand/collapse attribute detail sections
5. **Evidence Modal**: Show detailed evidence sources with authority ratings
6. **Statistics Display**: Show aggregated metrics and distributions

## 🎨 **UI Data Binding**

### Search Implementation
```typescript
const filteredAttributes = attributes.filter(attr =>
  attr.attribute_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  attr.description.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Category Filtering
```typescript
const categoryFilteredAttributes = selectedCategory === 'all' 
  ? filteredAttributes 
  : filteredAttributes.filter(attr => attr.category === selectedCategory);
```

### Statistics Display
```typescript
const stats = {
  totalAttributes: attributes.length,
  averageConfidence: (attributes.reduce((sum, a) => sum + a.confidence_score, 0) / attributes.length).toFixed(2),
  averageAuthority: (attributes.reduce((sum, a) => sum + a.authority_score, 0) / attributes.length).toFixed(2),
  averageConsensus: (attributes.reduce((sum, a) => sum + a.consensus_score, 0) / attributes.length).toFixed(2)
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
const mockKnownForData = {
  'paris': [
    {
      id: 'paris_romance',
      attribute_name: 'City of Love & Romance',
      category: 'cultural',
      description: 'Paris is globally recognized as the ultimate romantic destination',
      significance: 'Centuries of art, literature, and cinema have cemented Paris as the world\'s romantic capital',
      historical_context: 'Romantic reputation built through 19th-century literature and Belle Époque culture',
      cultural_impact: 'Influences global perceptions of romance and love',
      confidence_score: 0.95,
      authority_score: 0.92,
      consensus_score: 0.94,
      evidence_sources: [
        {
          source_type: 'cultural_institution',
          source_name: 'Paris Tourism Board',
          authority_level: 'gold',
          content_snippet: 'Paris receives over 15 million couples annually...',
          validation_status: 'verified',
          confidence_score: 0.93
        }
      ]
    }
    // ... more attributes
  ]
};
```

## 🚀 **Implementation Notes**

1. **Performance**: Uses `useMemo` for mock data and filtering operations
2. **Multi-LLM Integration**: Displays consensus scores from multiple AI models
3. **Evidence Validation**: Rich evidence modal with authority ratings
4. **Category Icons**: Each category has associated icons for visual clarity
5. **Expandable Cards**: Detailed sections can be expanded/collapsed
6. **Responsive Design**: Cards adapt to different screen sizes

## 🔗 **Related Components**

- `KnownForAttributeCard.jsx` - Individual attribute card component
- `DestinationInsightsPage.jsx` - Parent page container
- `EvidenceModal.jsx` - Evidence validation modal
- `KnownForAgent` - Backend agent for data generation
