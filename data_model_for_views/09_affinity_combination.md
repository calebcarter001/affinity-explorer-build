# Affinity Combination View - Data Model Specification

## 📋 **Overview**

The Affinity Combination view enables users to create, test, and optimize complex affinity combinations by blending multiple individual affinities with custom weights, rules, and conditions. This advanced tool helps create sophisticated property matching algorithms and personalized recommendation systems.

## 🎯 **View Components**

1. **Combination Builder**: Drag-and-drop interface for creating affinity combinations
2. **Weight Adjustment**: Sliders and controls for fine-tuning affinity weights
3. **Rule Engine**: Conditional logic and filtering rules
4. **Testing Sandbox**: Real-time testing with sample properties
5. **Performance Metrics**: Combination effectiveness analytics
6. **Saved Combinations**: Library of created and shared combinations
7. **Export Tools**: Export combinations for use in other systems

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/affinity-combinations/dashboard
```

### Response Schema
```typescript
interface AffinityCombinationResponse {
  combinations: AffinityCombination[];
  available_affinities: AvailableAffinity[];
  combination_templates: CombinationTemplate[];
  testing_results: TestingResult[];
  performance_analytics: PerformanceAnalytics;
  user_preferences: UserPreferences;
  metadata: CombinationMetadata;
}

interface AffinityCombination {
  combination_id: string;
  name: string;
  description: string;
  version: string;
  
  // Combination structure
  components: {
    affinity_id: string;
    affinity_name: string;
    weight: number;                  // 0.0 - 1.0
    required: boolean;
    conditions: {
      condition_type: 'minimum_score' | 'maximum_score' | 'range' | 'boolean';
      value: number | boolean | { min: number; max: number };
      operator: 'equals' | 'greater_than' | 'less_than' | 'between' | 'not_equals';
    }[];
  }[];
  
  // Combination logic
  combination_rules: {
    rule_id: string;
    rule_type: 'weighted_sum' | 'minimum_threshold' | 'conditional' | 'custom';
    parameters: {
      [key: string]: any;
    };
    priority: number;
    enabled: boolean;
  }[];
  
  // Scoring configuration
  scoring_config: {
    normalization_method: 'linear' | 'logarithmic' | 'exponential' | 'custom';
    output_range: { min: number; max: number };
    rounding_precision: number;
    boost_factors: {
      affinity_id: string;
      boost_multiplier: number;      // 0.0 - 2.0
      conditions?: object[];
    }[];
  };
  
  // Validation and constraints
  validation_rules: {
    total_weight_constraint: { min: number; max: number };
    required_affinities: string[];
    excluded_affinities: string[];
    mutual_exclusions: {
      group_name: string;
      affinity_ids: string[];
      max_allowed: number;
    }[];
  };
  
  // Performance metrics
  performance: {
    accuracy_score: number;          // 0.0 - 1.0
    precision: number;               // 0.0 - 1.0
    recall: number;                  // 0.0 - 1.0
    f1_score: number;                // 0.0 - 1.0
    execution_time_ms: number;
    memory_usage_mb: number;
    
    test_results: {
      total_tests: number;
      passed_tests: number;
      failed_tests: number;
      average_score_difference: number;
      correlation_coefficient: number; // -1.0 to 1.0
    };
  };
  
  // Usage and analytics
  usage_analytics: {
    times_used: number;
    success_rate: number;            // 0.0 - 1.0
    average_user_rating: number;     // 1.0 - 5.0
    properties_matched: number;
    user_feedback: {
      rating: number;
      comment: string;
      user_id: string;
      timestamp: string;             // ISO 8601
    }[];
  };
  
  // Collaboration and sharing
  collaboration: {
    owner_id: string;
    owner_name: string;
    visibility: 'private' | 'team' | 'public';
    collaborators: {
      user_id: string;
      username: string;
      role: 'viewer' | 'editor' | 'admin';
      permissions: string[];
    }[];
    
    version_history: {
      version: string;
      created_by: string;
      created_at: string;            // ISO 8601
      changes_summary: string;
      performance_delta: number;
    }[];
  };
  
  // Export and integration
  export_formats: {
    format: 'json' | 'yaml' | 'sql' | 'python' | 'javascript';
    available: boolean;
    last_exported?: string;          // ISO 8601
  }[];
  
  // Metadata
  metadata: {
    created_at: string;              // ISO 8601
    last_modified: string;           // ISO 8601
    tags: string[];
    category: string;
    complexity_score: number;        // 0.0 - 1.0
    maintenance_status: 'active' | 'deprecated' | 'archived';
  };
}

interface AvailableAffinity {
  affinity_id: string;
  name: string;
  display_name: string;
  category: string;
  description: string;
  
  // Compatibility information
  compatibility: {
    works_well_with: string[];       // Affinity IDs
    conflicts_with: string[];        // Affinity IDs
    recommended_weight_range: { min: number; max: number };
    typical_score_distribution: {
      percentile_25: number;
      percentile_50: number;
      percentile_75: number;
      percentile_90: number;
    };
  };
  
  // Usage statistics
  usage_stats: {
    popularity_score: number;        // 0.0 - 1.0
    success_rate_in_combinations: number; // 0.0 - 1.0
    average_weight_used: number;     // 0.0 - 1.0
    combinations_count: number;
  };
  
  // Data characteristics
  data_characteristics: {
    data_type: 'numeric' | 'boolean' | 'categorical' | 'text';
    value_range?: { min: number; max: number };
    possible_values?: string[];
    null_percentage: number;         // 0.0 - 1.0
    update_frequency: 'real-time' | 'daily' | 'weekly' | 'monthly';
  };
}

interface CombinationTemplate {
  template_id: string;
  name: string;
  description: string;
  use_case: string;
  
  // Template structure
  template_structure: {
    recommended_affinities: {
      affinity_id: string;
      suggested_weight: number;
      rationale: string;
    }[];
    
    default_rules: {
      rule_type: string;
      parameters: object;
      description: string;
    }[];
    
    configuration_presets: {
      preset_name: string;
      scoring_config: object;
      validation_rules: object;
    }[];
  };
  
  // Template metadata
  template_info: {
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    estimated_setup_time: number;   // minutes
    success_rate: number;           // 0.0 - 1.0
    user_rating: number;            // 1.0 - 5.0
    times_used: number;
  };
  
  // Example and documentation
  documentation: {
    setup_guide: string;
    best_practices: string[];
    common_pitfalls: string[];
    example_results: {
      input_description: string;
      expected_output: string;
      actual_performance: number;
    }[];
  };
}

interface TestingResult {
  test_id: string;
  combination_id: string;
  test_name: string;
  
  // Test configuration
  test_config: {
    test_type: 'unit' | 'integration' | 'performance' | 'user_acceptance';
    sample_size: number;
    test_properties: {
      property_id: string;
      expected_score: number;
      actual_score: number;
      score_difference: number;
    }[];
  };
  
  // Test results
  results: {
    overall_status: 'passed' | 'failed' | 'warning';
    accuracy: number;                // 0.0 - 1.0
    precision: number;               // 0.0 - 1.0
    recall: number;                  // 0.0 - 1.0
    execution_time: number;          // ms
    
    detailed_metrics: {
      metric_name: string;
      value: number;
      threshold: number;
      status: 'passed' | 'failed' | 'warning';
    }[];
  };
  
  // Test execution info
  execution_info: {
    executed_at: string;             // ISO 8601
    executed_by: string;
    execution_environment: string;
    test_duration: number;           // seconds
  };
  
  // Recommendations
  recommendations: {
    recommendation_type: 'weight_adjustment' | 'rule_modification' | 'affinity_addition' | 'affinity_removal';
    description: string;
    expected_improvement: number;    // 0.0 - 1.0
    implementation_effort: 'low' | 'medium' | 'high';
  }[];
}

interface PerformanceAnalytics {
  global_metrics: {
    total_combinations: number;
    active_combinations: number;
    average_performance_score: number; // 0.0 - 1.0
    top_performing_combinations: string[]; // combination_ids
  };
  
  performance_trends: {
    date: string;                    // ISO 8601
    average_accuracy: number;
    average_execution_time: number;
    combinations_created: number;
    combinations_tested: number;
  }[];
  
  affinity_usage_patterns: {
    affinity_id: string;
    affinity_name: string;
    usage_frequency: number;
    average_weight: number;
    success_contribution: number;    // 0.0 - 1.0
  }[];
  
  user_behavior_insights: {
    most_common_combinations: {
      affinity_pattern: string[];
      frequency: number;
      average_performance: number;
    }[];
    
    optimization_patterns: {
      pattern_type: string;
      description: string;
      success_rate: number;
      adoption_rate: number;
    }[];
  };
}
```

## 🔌 **Required API Endpoints**

### 1. Get Combinations Dashboard
```
GET /api/affinity-combinations/dashboard
Response: AffinityCombinationResponse
```

### 2. Create Combination
```
POST /api/affinity-combinations
Body: Partial<AffinityCombination>
Response: AffinityCombination
```

### 3. Test Combination
```
POST /api/affinity-combinations/{combination_id}/test
Body: {
  test_properties: string[];
  test_type: string;
  sample_size?: number;
}
Response: TestingResult
```

### 4. Calculate Combination Score
```
POST /api/affinity-combinations/{combination_id}/calculate
Body: {
  property_id: string;
  property_data?: object;
}
Response: {
  final_score: number;
  component_scores: { [affinity_id: string]: number };
  execution_time: number;
}
```

### 5. Optimize Combination
```
POST /api/affinity-combinations/{combination_id}/optimize
Body: {
  optimization_goal: 'accuracy' | 'performance' | 'simplicity';
  constraints?: object;
}
Response: {
  optimized_combination: AffinityCombination;
  improvement_metrics: object;
}
```

### 6. Export Combination
```
GET /api/affinity-combinations/{combination_id}/export?format={format}
Response: File download or code string
```

### 7. Clone Combination
```
POST /api/affinity-combinations/{combination_id}/clone
Body: { name: string; modifications?: object }
Response: AffinityCombination
```

### 8. Get Performance Analytics
```
GET /api/affinity-combinations/analytics?period={period}&metric={metric}
Response: PerformanceAnalytics
```

## 📊 **Data Loading Pattern**

```javascript
const AffinityCombination = () => {
  const [combinations, setCombinations] = useState([]);
  const [availableAffinities, setAvailableAffinities] = useState([]);
  const [currentCombination, setCurrentCombination] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCombinationData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/affinity-combinations/dashboard');
      const data = await response.json();
      
      setCombinations(data.combinations);
      setAvailableAffinities(data.available_affinities);
      setTestResults(data.testing_results);
    } catch (error) {
      console.error('Failed to load combination data:', error);
    } finally {
      setLoading(false);
    }
  };

  const testCombination = async (combinationId, testConfig) => {
    try {
      const response = await fetch(`/api/affinity-combinations/${combinationId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testConfig)
      });
      const result = await response.json();
      setTestResults(prev => [result, ...prev]);
      return result;
    } catch (error) {
      console.error('Combination testing failed:', error);
      throw error;
    }
  };

  const calculateScore = async (combinationId, propertyId) => {
    try {
      const response = await fetch(`/api/affinity-combinations/${combinationId}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: propertyId })
      });
      return await response.json();
    } catch (error) {
      console.error('Score calculation failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadCombinationData();
  }, []);
};
```

## 🎨 **Formatting Considerations**

### Performance Score Display
```javascript
const formatPerformanceScore = (score) => ({
  percentage: Math.round(score * 100),
  grade: score >= 0.9 ? 'A+' : score >= 0.8 ? 'A' : score >= 0.7 ? 'B' : score >= 0.6 ? 'C' : 'D',
  color: score >= 0.8 ? 'text-green-600' : score >= 0.6 ? 'text-yellow-600' : 'text-red-600'
});
```

### Weight Visualization
```javascript
const WeightSlider = ({ weight, onChange, affinity }) => (
  <div className="flex items-center space-x-4">
    <span className="w-32 text-sm">{affinity.name}</span>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={weight}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="flex-1"
    />
    <span className="w-12 text-sm font-mono">{(weight * 100).toFixed(0)}%</span>
  </div>
);
```

### Combination Complexity Indicator
```javascript
const getComplexityColor = (score) => ({
  color: score <= 0.3 ? 'text-green-600' : score <= 0.7 ? 'text-yellow-600' : 'text-red-600',
  label: score <= 0.3 ? 'Simple' : score <= 0.7 ? 'Moderate' : 'Complex'
});
```

## ⚡ **Performance Considerations**

- **Real-time Calculation**: Optimized algorithms for instant score updates
- **Caching**: Combination results cached for 5 minutes
- **Batch Processing**: Multiple property scoring in parallel
- **Memory Management**: Efficient handling of large affinity datasets
- **Background Optimization**: Automated combination tuning

## 🔒 **Security Considerations**

- **Combination Ownership**: Users can only modify their own combinations
- **Export Controls**: Sensitive combinations require additional permissions
- **Rate Limiting**: Testing and calculation endpoints limited to prevent abuse
- **Data Privacy**: Property data anonymized in shared combinations
- **Audit Trail**: All combination changes and tests logged

This specification enables sophisticated affinity combination creation with comprehensive testing, optimization, and performance analytics capabilities.
