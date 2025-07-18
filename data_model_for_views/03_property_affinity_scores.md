# Property Affinity Scores View - Data Model Specification

## 📋 **Overview**

The Property Affinity Scores view provides detailed scoring analysis for individual properties, showing how well they align with various affinities, user preferences, and market segments. This view enables property managers and analysts to understand performance metrics and optimization opportunities.

## 🎯 **View Components**

1. **Property Selector**: Search and select properties for analysis
2. **Score Overview Cards**: High-level affinity score metrics
3. **Detailed Score Breakdown**: Category-wise affinity analysis
4. **Comparison Charts**: Visual score comparisons
5. **Recommendations Panel**: Improvement suggestions
6. **Historical Trends**: Score evolution over time
7. **Benchmark Comparisons**: Against similar properties

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/properties/{property_id}/affinity-scores
```

### Response Schema
```typescript
interface PropertyAffinityScoresResponse {
  property_info: PropertyInfo;
  overall_scores: OverallScores;
  category_scores: CategoryScore[];
  detailed_breakdown: DetailedBreakdown;
  historical_data: HistoricalData;
  benchmarks: BenchmarkData;
  recommendations: Recommendation[];
  metadata: ScoreMetadata;
}

interface PropertyInfo {
  property_id: string;
  name: string;
  type: 'hotel' | 'resort' | 'villa' | 'apartment' | 'boutique';
  location: {
    destination: string;
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  basic_info: {
    star_rating?: number;
    room_count: number;
    price_range: 'budget' | 'mid-range' | 'luxury' | 'ultra-luxury';
    brand?: string;
  };
}

interface OverallScores {
  total_affinity_score: number;        // 0.0 - 1.0
  confidence_level: number;            // 0.0 - 1.0
  market_position: 'leader' | 'strong' | 'average' | 'below_average';
  score_trend: 'improving' | 'stable' | 'declining';
  last_updated: string;                // ISO 8601
}

interface CategoryScore {
  category: string;
  display_name: string;
  score: number;                       // 0.0 - 1.0
  weight: number;                      // Category importance weight
  weighted_score: number;              // score * weight
  confidence: number;                  // 0.0 - 1.0
  trend: 'up' | 'down' | 'stable';
  subcategories: {
    name: string;
    score: number;
    impact: 'high' | 'medium' | 'low';
  }[];
}

interface DetailedBreakdown {
  amenity_scores: {
    amenity: string;
    score: number;
    availability: boolean;
    quality_rating: number;            // 1-5
    guest_satisfaction: number;        // 0.0 - 1.0
  }[];
  
  service_scores: {
    service_type: string;
    score: number;
    performance_metrics: {
      response_time: number;           // minutes
      satisfaction_rating: number;     // 1-5
      consistency_score: number;       // 0.0 - 1.0
    };
  }[];
  
  location_scores: {
    aspect: string;                    // 'accessibility', 'attractions', 'transport'
    score: number;
    factors: {
      factor: string;
      impact: number;                  // -1.0 to 1.0
      description: string;
    }[];
  }[];
}

interface HistoricalData {
  time_series: {
    date: string;                      // ISO 8601
    overall_score: number;
    category_scores: { [category: string]: number };
  }[];
  
  significant_changes: {
    date: string;
    change_type: 'improvement' | 'decline' | 'volatility';
    affected_categories: string[];
    impact_magnitude: number;          // 0.0 - 1.0
    reason?: string;
  }[];
}

interface BenchmarkData {
  peer_comparison: {
    peer_property_id: string;
    peer_name: string;
    score_difference: number;          // -1.0 to 1.0
    better_categories: string[];
    worse_categories: string[];
  }[];
  
  market_percentile: number;           // 0-100
  destination_ranking: number;
  category_rankings: {
    category: string;
    rank: number;
    total_properties: number;
    percentile: number;
  }[];
}

interface Recommendation {
  recommendation_id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  potential_impact: number;            // 0.0 - 1.0
  implementation_effort: 'low' | 'medium' | 'high';
  estimated_timeline: string;
  cost_estimate?: {
    min: number;
    max: number;
    currency: string;
  };
}
```

## 🔌 **Required API Endpoints**

### 1. Get Property Affinity Scores
```
GET /api/properties/{property_id}/affinity-scores
Response: PropertyAffinityScoresResponse
```

### 2. Search Properties
```
GET /api/properties/search?q={query}&destination={destination}&type={type}
Response: { properties: PropertyInfo[]; total: number }
```

### 3. Compare Properties
```
POST /api/properties/compare
Body: { property_ids: string[] }
Response: { comparisons: PropertyComparison[] }
```

### 4. Get Score History
```
GET /api/properties/{property_id}/score-history?period={period}
Response: { historical_data: HistoricalData }
```

### 5. Get Recommendations
```
GET /api/properties/{property_id}/recommendations
Response: { recommendations: Recommendation[] }
```

## 📊 **Data Loading Pattern**

```javascript
const PropertyAffinityScores = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const loadPropertyScores = async (propertyId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/properties/${propertyId}/affinity-scores`);
      const data = await response.json();
      setPropertyData(data);
    } catch (error) {
      console.error('Failed to load property scores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProperty) {
      loadPropertyScores(selectedProperty.property_id);
    }
  }, [selectedProperty]);
};
```

## 🎨 **Formatting Considerations**

### Score Display
```javascript
const formatScore = (score) => ({
  percentage: Math.round(score * 100),
  color: score >= 0.8 ? 'text-green-600' : 
         score >= 0.6 ? 'text-blue-600' : 
         score >= 0.4 ? 'text-yellow-600' : 'text-red-600'
});
```

### Trend Indicators
```javascript
const getTrendIcon = (trend) => ({
  'up': '↗️',
  'down': '↘️', 
  'stable': '→'
});
```

## ⚡ **Performance Considerations**

- **Caching**: 15-minute cache for score data
- **Lazy Loading**: Load detailed breakdowns on demand
- **Chart Optimization**: Use canvas for large datasets
- **Real-time Updates**: WebSocket for live score changes

## 🔒 **Security Considerations**

- Property access based on user permissions
- Sensitive benchmark data filtering
- Rate limiting: 30 requests/minute per user

This specification ensures comprehensive property affinity analysis with detailed scoring, benchmarking, and actionable recommendations.
