# Last Mile View - Data Model Specification

## 📋 **Overview**

The Last Mile View provides comprehensive transportation and accessibility insights for destinations, focusing on airport-to-accommodation transport options and accessibility features. It uses the LastMileTravelAgent system with multi-LLM consensus and web evidence validation to generate validated insights for travelers.

## 🎯 **Navigation & Location**
- **File**: `/src/components/tabs/LastMileView.jsx`
- **Route**: `/last-mile`
- **Navigation**: Position 5 in sidebar (after Destination Insights)
- **Icon**: `FiNavigation` (Navigation icon)
- **Permissions**: Requires 'read' permission

## 🎯 **View Components**

1. **Hero Section**: Destination selector, seasonal controls, background images (matches Destination Insights design)
2. **Summary Cards**: Total insights, average confidence, transport options count, accessibility features count
3. **Intelligence Insights**: Multi-LLM consensus status, evidence validation, authority sources
4. **Evidence Collection**: Web sources found, official sources verified, quality scores
5. **Transportation Insights Tab**: 8 core transportation insights with confidence scores and tags
6. **Accessibility Insights Tab**: 4 core accessibility insights with confidence scores and tags

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/destinations/{destination_id}/last-mile-insights
```

### Response Schema
```typescript
interface LastMileInsightsResponse {
  destination: string;
  summary: LastMileSummary;
  transportation_insights: TransportationInsight[];
  accessibility_insights: AccessibilityInsight[];
  intelligence_insights: IntelligenceInsights;
  evidence_collection: EvidenceCollection;
  metadata: LastMileMetadata;
}
```

### Last Mile Summary Schema
```typescript
interface LastMileSummary {
  total_insights: number;           // Total number of insights (12: 8 transport + 4 accessibility)
  avg_confidence: number;           // Average confidence across all insights (0.0 - 100.0)
  transport_options: number;        // Number of transportation insights (8)
  accessibility_features: number;   // Number of accessibility insights (4)
  last_updated: string;            // ISO 8601 timestamp
  data_freshness_score: number;    // 0.0 - 1.0 indicating how fresh the data is
}
```

### Transportation Insight Schema
```typescript
interface TransportationInsight {
  id: 'airport_identification' | 'public_transit_international' | 'rideshare_availability' | 
      'taxi_services' | 'airport_comparison' | 'payment_methods' | 'service_timing' | 'luggage_policies';
  title: string;                   // Human-readable title
  description: string;             // Detailed description of the insight
  confidence: number;              // 0-100 confidence percentage
  tags: string[];                  // Relevant tags for categorization and filtering
  
  // Multi-LLM Analysis
  llm_consensus: {
    models_used: string[];         // e.g., ["openai-gpt-4", "anthropic-claude-3", "google-gemini-pro"]
    consensus_score: number;       // 0.0 - 1.0 agreement between models
    disagreement_areas: string[]; // Areas where models disagreed
  };
  
  // Evidence Validation
  evidence_sources: {
    source_type: 'official_airport' | 'transport_authority' | 'travel_guide' | 'review_site' | 'local_knowledge';
    source_name: string;
    authority_level: 'gold' | 'authoritative' | 'standard';
    url?: string;
    content_snippet: string;
    validation_status: 'verified' | 'pending' | 'disputed';
    last_verified: string;         // ISO 8601
  }[];
  
  // Specific insight data based on ID
  insight_data: TransportationInsightData;
  
  // Processing metadata
  processing_metadata: {
    generated_at: string;          // ISO 8601
    validation_method: string;
    quality_score: number;         // 0.0 - 1.0
    last_updated: string;          // ISO 8601
  };
}

// Specific data structures for each transportation insight type
type TransportationInsightData = 
  | AirportIdentificationData 
  | PublicTransitData 
  | RideshareData 
  | TaxiServicesData 
  | AirportComparisonData 
  | PaymentMethodsData 
  | ServiceTimingData 
  | LuggagePoliciesData;

interface AirportIdentificationData {
  airports: {
    code: string;                  // IATA code (e.g., "FCO", "CIA")
    name: string;
    type: 'international' | 'regional' | 'domestic';
    distance_km: number;           // Distance from city center
    travel_time_minutes: {
      min: number;
      max: number;
      typical: number;
    };
    serves_international: boolean;
  }[];
  primary_airport: string;         // Primary airport code
  secondary_options: string[];     // Alternative airport codes
}

interface PublicTransitData {
  connections: {
    from_airport: string;          // Airport code
    to_city_center: boolean;
    transport_types: ('train' | 'bus' | 'metro' | 'tram')[];
    frequency_minutes: number;
    travel_time_minutes: number;
    cost_range: {
      min_eur: number;
      max_eur: number;
      currency: string;
    };
    accessibility_features: string[];
    operating_hours: {
      start: string;               // HH:MM format
      end: string;
      frequency_off_peak: number;
    };
  }[];
  wheelchair_accessible: boolean;
  real_time_info_available: boolean;
}

interface RideshareData {
  services_available: {
    service_name: string;          // e.g., "Uber", "Lyft", "Bolt"
    availability_rating: number;   // 0.0 - 1.0
    pickup_locations: string[];
    estimated_cost_eur: {
      min: number;
      max: number;
    };
    accessibility_options: boolean;
    advance_booking_required: boolean;
  }[];
  surge_pricing_common: boolean;
  airport_pickup_restrictions: string[];
}

interface TaxiServicesData {
  official_taxi_service: {
    company_name: string;
    flat_rate_available: boolean;
    flat_rate_eur?: number;
    meter_rate_info: string;
    accessibility_vehicles: boolean;
    advance_booking: boolean;
    payment_methods: string[];
  };
  taxi_stands: {
    location: string;
    wait_time_typical_minutes: number;
    availability_24h: boolean;
  }[];
  licensing_info: string;
}

interface AirportComparisonData {
  comparison_factors: {
    factor: 'cost' | 'convenience' | 'time' | 'accessibility' | 'frequency';
    airport_rankings: {
      airport_code: string;
      score: number;               // 0.0 - 1.0
      notes: string;
    }[];
  }[];
  recommendations: {
    traveler_type: string;
    recommended_airport: string;
    reasoning: string;
  }[];
}

interface PaymentMethodsData {
  accepted_methods: {
    method: 'cash' | 'credit_card' | 'debit_card' | 'mobile_payment' | 'contactless' | 'foreign_cards';
    transport_types: string[];     // Which transport types accept this method
    reliability: 'high' | 'medium' | 'low';
    notes: string;
  }[];
  currency_info: {
    local_currency: string;
    foreign_card_fees: boolean;
    cash_only_services: string[];
  };
}

interface ServiceTimingData {
  peak_hours: {
    morning: { start: string; end: string; };
    evening: { start: string; end: string; };
    impact_on_service: string;
  };
  late_night_availability: {
    services_available: string[];
    reduced_frequency: boolean;
    additional_costs: boolean;
  };
  frequency_by_time: {
    time_period: string;
    frequency_minutes: number;
    reliability: 'high' | 'medium' | 'low';
  }[];
}

interface LuggagePoliciesData {
  restrictions: {
    transport_type: string;
    max_pieces: number;
    size_restrictions: string;
    weight_limit_kg?: number;
    additional_fees: boolean;
  }[];
  accessibility_considerations: {
    elevator_access: boolean;
    assistance_available: boolean;
    step_free_routes: string[];
  };
  oversized_luggage: {
    allowed: boolean;
    restrictions: string;
    additional_procedures: string[];
  };
}
```

### Accessibility Insight Schema
```typescript
interface AccessibilityInsight {
  id: 'mobility_accessibility' | 'sensory_accessibility' | 'elevator_accessibility' | 'bathroom_accessibility';
  title: string;
  description: string;
  confidence: number;              // 0-100 confidence percentage
  tags: string[];
  
  // Multi-LLM Analysis (same structure as transportation)
  llm_consensus: {
    models_used: string[];
    consensus_score: number;
    disagreement_areas: string[];
  };
  
  // Evidence Validation (same structure as transportation)
  evidence_sources: {
    source_type: 'official_accessibility' | 'disability_organization' | 'government_standard' | 'user_review' | 'audit_report';
    source_name: string;
    authority_level: 'gold' | 'authoritative' | 'standard';
    url?: string;
    content_snippet: string;
    validation_status: 'verified' | 'pending' | 'disputed';
    last_verified: string;
  }[];
  
  // Specific accessibility data
  accessibility_data: AccessibilityInsightData;
  
  processing_metadata: {
    generated_at: string;
    validation_method: string;
    quality_score: number;
    last_updated: string;
  };
}

type AccessibilityInsightData = 
  | MobilityAccessibilityData 
  | SensoryAccessibilityData 
  | ElevatorAccessibilityData 
  | BathroomAccessibilityData;

interface MobilityAccessibilityData {
  wheelchair_accessibility: {
    fully_accessible_routes: string[];
    partially_accessible_routes: string[];
    accessibility_rating: number;  // 0.0 - 1.0
    ramp_availability: boolean;
    elevator_dependency: boolean;
  };
  mobility_assistance: {
    staff_assistance_available: boolean;
    assistance_request_method: string;
    mobility_device_rental: boolean;
    accessible_vehicle_options: string[];
  };
  pathway_conditions: {
    step_free_routes: string[];
    surface_quality: 'excellent' | 'good' | 'fair' | 'poor';
    width_adequate: boolean;
    rest_areas_available: boolean;
  };
}

interface SensoryAccessibilityData {
  visual_accessibility: {
    braille_signage: boolean;
    high_contrast_signage: boolean;
    audio_announcements: boolean;
    tactile_guidance: boolean;
    guide_dog_friendly: boolean;
  };
  hearing_accessibility: {
    visual_displays: boolean;
    hearing_loop_available: boolean;
    sign_language_services: boolean;
    vibration_alerts: boolean;
  };
  staff_training: {
    disability_awareness_trained: boolean;
    communication_assistance: boolean;
    emergency_procedures_accessible: boolean;
  };
}

interface ElevatorAccessibilityData {
  elevator_availability: {
    total_elevators: number;
    accessible_elevators: number;
    locations: string[];
    reliability_rating: number;     // 0.0 - 1.0
  };
  elevator_features: {
    braille_buttons: boolean;
    audio_announcements: boolean;
    adequate_size_wheelchair: boolean;
    emergency_communication: boolean;
  };
  backup_options: {
    alternative_routes: string[];
    assistance_if_elevator_down: boolean;
    escalator_alternatives: boolean;
  };
}

interface BathroomAccessibilityData {
  accessible_facilities: {
    locations: string[];
    ada_compliant: boolean;
    grab_bars: boolean;
    adequate_space: boolean;
    accessible_sinks: boolean;
  };
  family_facilities: {
    family_restrooms: boolean;
    changing_tables: boolean;
    adult_changing_facilities: boolean;
  };
  maintenance_quality: {
    cleanliness_rating: number;     // 0.0 - 1.0
    equipment_functionality: number; // 0.0 - 1.0
    regular_maintenance: boolean;
  };
}
```

### Intelligence Insights Schema
```typescript
interface IntelligenceInsights {
  multi_llm_consensus: {
    status: 'active' | 'pending' | 'failed';
    models_participating: string[];
    overall_agreement_score: number; // 0.0 - 1.0
    consensus_threshold_met: boolean;
    disagreement_summary: string[];
  };
  
  evidence_validation: {
    status: 'verified' | 'partial' | 'pending';
    total_sources_checked: number;
    verified_sources: number;
    validation_methods: string[];
    last_validation_run: string;    // ISO 8601
  };
  
  authority_sources: {
    gold_tier_count: number;
    authoritative_count: number;
    standard_count: number;
    authority_distribution: {
      official_transport: number;
      government_accessibility: number;
      verified_reviews: number;
      expert_analysis: number;
    };
  };
  
  quality_metrics: {
    overall_quality_score: number;  // 0.0 - 1.0
    completeness_score: number;     // 0.0 - 1.0
    freshness_score: number;        // 0.0 - 1.0
    accuracy_score: number;         // 0.0 - 1.0
  };
}
```

### Evidence Collection Schema
```typescript
interface EvidenceCollection {
  web_sources: {
    total_found: number;
    by_type: {
      [source_type: string]: number;
    };
    search_queries_used: string[];
    last_crawl: string;             // ISO 8601
  };
  
  official_sources: {
    verified_count: number;
    pending_verification: number;
    sources: {
      name: string;
      type: 'airport_authority' | 'transport_ministry' | 'accessibility_board' | 'tourism_board';
      verification_status: 'verified' | 'pending' | 'failed';
      last_checked: string;         // ISO 8601
    }[];
  };
  
  quality_scores: {
    overall_score: number;          // 0-100 percentage
    source_reliability: number;     // 0-100
    information_completeness: number; // 0-100
    temporal_relevance: number;     // 0-100
    cross_validation_success: number; // 0-100
  };
  
  validation_metadata: {
    validation_methods: string[];
    automated_checks: number;
    manual_verifications: number;
    last_full_validation: string;   // ISO 8601
  };
}
```

### Last Mile Metadata Schema
```typescript
interface LastMileMetadata {
  destination_id: string;
  destination_name: string;
  generation_metadata: {
    agent_version: string;
    generation_timestamp: string;   // ISO 8601
    processing_duration_seconds: number;
    models_used: {
      primary_llm: string;
      consensus_llms: string[];
      validation_llm: string;
    };
  };
  
  data_sources: {
    primary_sources: string[];
    backup_sources: string[];
    real_time_sources: string[];
    static_sources: string[];
  };
  
  update_schedule: {
    next_scheduled_update: string;  // ISO 8601
    update_frequency_days: number;
    trigger_conditions: string[];   // Conditions that trigger updates
  };
  
  schema_version: string;
  export_format_version: string;
}
```

## 🔌 **Required API Endpoints**

### 1. Get Last Mile Insights
```
GET /api/destinations/{destination_id}/last-mile-insights
Response: LastMileInsightsResponse
```

### 2. Get Transportation Insight Details
```
GET /api/destinations/{destination_id}/transportation/{insight_id}
Response: TransportationInsight
```

### 3. Get Accessibility Insight Details
```
GET /api/destinations/{destination_id}/accessibility/{insight_id}
Response: AccessibilityInsight
```

### 4. Trigger Data Refresh
```
POST /api/destinations/{destination_id}/last-mile-insights/refresh
Response: { 
  refresh_id: string; 
  estimated_completion: string; 
  status: 'queued' | 'processing' | 'completed' | 'failed' 
}
```

### 5. Get Refresh Status
```
GET /api/destinations/{destination_id}/last-mile-insights/refresh/{refresh_id}
Response: {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress_percentage: number;
  current_step: string;
  estimated_completion: string;
  error_message?: string;
}
```

## 📊 **Data Loading Pattern**

### Frontend Implementation
```javascript
// Uses the same dataLoader pattern as Destination Insights
import { dataLoader } from '../services/destinationThemeService';

useEffect(() => {
  const loadLastMileData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await dataLoader.loadDestination(selectedDestination);
      // Extract last mile insights from destination data
      const lastMileInsights = extractLastMileData(data);
      setLastMileData(lastMileInsights);
    } catch (err) {
      setError(`Failed to load last mile data: ${err.message}`);
      // Fallback to mock data
      setLastMileData(getMockLastMileData());
    } finally {
      setLoading(false);
    }
  };

  loadLastMileData();
}, [selectedDestination]);
```

### Backend Data Processing
```python
# LastMileTravelAgent processing pipeline
async def generate_last_mile_insights(destination_id: str) -> LastMileInsightsResponse:
    # Step 1: Multi-LLM Analysis
    llm_results = await run_multi_llm_analysis(destination_id, [
        "openai-gpt-4",
        "anthropic-claude-3", 
        "google-gemini-pro"
    ])
    
    # Step 2: Evidence Collection
    evidence = await collect_web_evidence(destination_id, llm_results)
    
    # Step 3: Authority Validation
    validated_evidence = await validate_evidence_sources(evidence)
    
    # Step 4: Consensus Building
    consensus_insights = await build_llm_consensus(llm_results, validated_evidence)
    
    # Step 5: Quality Scoring
    quality_scores = await calculate_quality_metrics(consensus_insights, validated_evidence)
    
    # Step 6: Format Response
    return format_last_mile_response(consensus_insights, validated_evidence, quality_scores)
```

## 🎨 **Formatting Considerations**

### 1. Confidence Score Display
```javascript
const getConfidenceColor = (confidence) => {
  if (confidence >= 90) return 'bg-green-100 text-green-800';
  if (confidence >= 80) return 'bg-blue-100 text-blue-800';
  return 'bg-yellow-100 text-yellow-800';
};
```

### 2. Tag Color Coding
```javascript
const getTagColor = (tag) => {
  const tagColors = {
    'FCO': 'bg-orange-100 text-orange-800',
    'CIA': 'bg-orange-100 text-orange-800',
    'Express': 'bg-green-100 text-green-800',
    'Wheelchair': 'bg-blue-100 text-blue-800',
    'Official': 'bg-blue-100 text-blue-800',
    'Cash': 'bg-green-100 text-green-800',
    'Credit': 'bg-green-100 text-green-800',
    // ... more tag mappings
  };
  return tagColors[tag] || 'bg-gray-100 text-gray-800';
};
```

### 3. Seasonal Background Images
```javascript
const getDestinationImage = (destination, season) => {
  const destinationKey = destination.toLowerCase().replace(/\s+/g, '_');
  return `/images/destinations/${destinationKey}/${season}.jpg`;
};
```

## ⚡ **Performance Considerations**

### 1. Caching Strategy
- **Redis Cache**: 2-hour TTL for last mile insights (shorter than destination insights due to real-time transport data)
- **Edge Cache**: Static images and destination data
- **Browser Cache**: Insight cards (10 minutes)

### 2. Real-time Data Integration
- **Transport APIs**: Live departure times and service disruptions
- **Accessibility Updates**: Real-time elevator/escalator status
- **WebSocket Updates**: Live status updates for evidence validation

### 3. Background Processing
- **Queue System**: Process insight generation in background
- **Incremental Updates**: Update individual insights without regenerating all
- **Scheduled Refresh**: Daily updates for high-traffic destinations

## 🔒 **Security & Compliance**

### 1. Data Privacy
- Anonymize user location data in evidence collection
- GDPR compliance for EU destination data
- Secure storage of API keys for transport services

### 2. Accessibility Standards
- WCAG 2.1 AA compliance for all UI elements
- Screen reader compatibility
- Keyboard navigation support

### 3. Data Validation
- Validate all confidence scores (0-100 range)
- Sanitize all evidence content
- Rate limiting on refresh endpoints

## 🧪 **Testing Requirements**

### 1. Multi-LLM Testing
- Test consensus building with disagreeing models
- Validate confidence score calculations
- Test fallback when models are unavailable

### 2. Evidence Validation Testing
- Test authority level classification
- Validate web scraping accuracy
- Test evidence freshness detection

### 3. Integration Testing
- Test with Destination Insights data loading
- Validate seasonal image loading
- Test error handling and fallback scenarios

This comprehensive specification ensures the Last Mile View can be fully powered by backend data while maintaining the sophisticated multi-LLM analysis and evidence validation capabilities that make it unique in the travel industry.
