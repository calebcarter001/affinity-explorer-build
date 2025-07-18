# Lifecycle Tracker View - Data Model Specification

## 📋 **Overview**

The Lifecycle Tracker monitors and visualizes the complete lifecycle of properties, destinations, and affinity data through various stages of development, validation, and optimization. It provides comprehensive tracking of data quality, processing stages, and system health.

## 🎯 **View Components**

1. **Lifecycle Overview**: High-level status of all tracked entities
2. **Stage Pipeline**: Visual pipeline showing progression through stages
3. **Quality Metrics**: Data quality and validation scores
4. **Processing Queue**: Current and pending processing tasks
5. **Health Monitoring**: System health and performance indicators
6. **Historical Timeline**: Timeline view of lifecycle events
7. **Alerts & Notifications**: Issues and status change notifications

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/lifecycle-tracker/dashboard
```

### Response Schema
```typescript
interface LifecycleTrackerResponse {
  overview: LifecycleOverview;
  entities: TrackedEntity[];
  processing_queue: ProcessingTask[];
  quality_metrics: QualityMetrics;
  system_health: SystemHealth;
  alerts: Alert[];
  historical_events: LifecycleEvent[];
  metadata: LifecycleMetadata;
}

interface LifecycleOverview {
  total_entities: number;
  entities_by_stage: {
    stage: string;
    count: number;
    percentage: number;
  }[];
  
  entities_by_type: {
    type: 'property' | 'destination' | 'affinity' | 'content';
    count: number;
    stages: { [stage: string]: number };
  }[];
  
  processing_summary: {
    active_tasks: number;
    queued_tasks: number;
    completed_today: number;
    failed_tasks: number;
    average_processing_time: number; // minutes
  };
  
  quality_summary: {
    overall_quality_score: number;   // 0.0 - 1.0
    entities_passing_quality: number;
    entities_needing_attention: number;
    critical_issues: number;
  };
}

interface TrackedEntity {
  entity_id: string;
  entity_type: 'property' | 'destination' | 'affinity' | 'content';
  name: string;
  display_name: string;
  
  lifecycle_stage: {
    current_stage: string;
    stage_progress: number;          // 0.0 - 1.0
    next_stage?: string;
    stage_entered_at: string;        // ISO 8601
    estimated_completion?: string;   // ISO 8601
    can_advance: boolean;
    blocking_issues: string[];
  };
  
  stage_history: {
    stage: string;
    entered_at: string;              // ISO 8601
    completed_at?: string;           // ISO 8601
    duration_minutes?: number;
    status: 'completed' | 'failed' | 'skipped';
    notes?: string;
  }[];
  
  quality_metrics: {
    overall_score: number;           // 0.0 - 1.0
    completeness: number;            // 0.0 - 1.0
    accuracy: number;                // 0.0 - 1.0
    consistency: number;             // 0.0 - 1.0
    freshness: number;               // 0.0 - 1.0
    
    quality_checks: {
      check_name: string;
      status: 'passed' | 'failed' | 'warning';
      score: number;                 // 0.0 - 1.0
      details: string;
      last_run: string;              // ISO 8601
    }[];
    
    validation_results: {
      validator: string;
      result: 'valid' | 'invalid' | 'pending';
      confidence: number;            // 0.0 - 1.0
      issues: {
        severity: 'critical' | 'warning' | 'info';
        message: string;
        field?: string;
      }[];
    }[];
  };
  
  processing_info: {
    last_processed: string;          // ISO 8601
    processing_version: string;
    data_sources: {
      source: string;
      last_updated: string;          // ISO 8601
      reliability: number;           // 0.0 - 1.0
    }[];
    
    dependencies: {
      entity_id: string;
      entity_name: string;
      relationship: 'requires' | 'influences' | 'blocks';
      status: 'satisfied' | 'pending' | 'failed';
    }[];
  };
  
  performance_metrics: {
    processing_time: number;         // minutes
    success_rate: number;            // 0.0 - 1.0
    error_rate: number;              // 0.0 - 1.0
    retry_count: number;
    last_error?: {
      error_code: string;
      message: string;
      timestamp: string;             // ISO 8601
    };
  };
  
  metadata: {
    created_at: string;              // ISO 8601
    created_by: string;
    last_modified: string;           // ISO 8601
    tags: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
    owner: string;
  };
}

interface ProcessingTask {
  task_id: string;
  task_type: string;
  entity_id: string;
  entity_name: string;
  
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  timing: {
    created_at: string;              // ISO 8601
    started_at?: string;             // ISO 8601
    completed_at?: string;           // ISO 8601
    estimated_duration?: number;     // minutes
    actual_duration?: number;        // minutes
  };
  
  progress: {
    current_step: string;
    total_steps: number;
    completed_steps: number;
    progress_percentage: number;     // 0.0 - 1.0
  };
  
  resource_usage: {
    cpu_usage: number;               // 0.0 - 1.0
    memory_usage: number;            // MB
    network_usage: number;           // MB
  };
  
  logs: {
    timestamp: string;               // ISO 8601
    level: 'debug' | 'info' | 'warning' | 'error';
    message: string;
    details?: object;
  }[];
  
  error_info?: {
    error_code: string;
    error_message: string;
    stack_trace?: string;
    retry_count: number;
    max_retries: number;
    next_retry_at?: string;          // ISO 8601
  };
}

interface QualityMetrics {
  global_metrics: {
    overall_quality_score: number;   // 0.0 - 1.0
    data_completeness: number;       // 0.0 - 1.0
    data_accuracy: number;           // 0.0 - 1.0
    data_consistency: number;        // 0.0 - 1.0
    data_freshness: number;          // 0.0 - 1.0
  };
  
  quality_trends: {
    date: string;                    // ISO 8601
    overall_score: number;
    completeness: number;
    accuracy: number;
    consistency: number;
    freshness: number;
  }[];
  
  quality_by_type: {
    entity_type: string;
    metrics: {
      overall_score: number;
      completeness: number;
      accuracy: number;
      consistency: number;
      freshness: number;
    };
    entity_count: number;
  }[];
  
  critical_issues: {
    issue_id: string;
    entity_id: string;
    entity_name: string;
    issue_type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    detected_at: string;             // ISO 8601
    resolved: boolean;
    resolution_time?: number;        // minutes
  }[];
  
  quality_rules: {
    rule_id: string;
    rule_name: string;
    description: string;
    entity_types: string[];
    pass_rate: number;               // 0.0 - 1.0
    failure_count: number;
    last_run: string;                // ISO 8601
  }[];
}

interface SystemHealth {
  overall_health: 'healthy' | 'degraded' | 'critical';
  health_score: number;              // 0.0 - 1.0
  
  component_health: {
    component: string;
    status: 'healthy' | 'degraded' | 'critical' | 'offline';
    response_time: number;           // ms
    error_rate: number;              // 0.0 - 1.0
    last_check: string;              // ISO 8601
  }[];
  
  performance_metrics: {
    throughput: number;              // entities/hour
    average_processing_time: number; // minutes
    queue_depth: number;
    resource_utilization: {
      cpu: number;                   // 0.0 - 1.0
      memory: number;                // 0.0 - 1.0
      disk: number;                  // 0.0 - 1.0
      network: number;               // 0.0 - 1.0
    };
  };
  
  capacity_planning: {
    current_load: number;            // 0.0 - 1.0
    projected_load: number;          // 0.0 - 1.0
    capacity_threshold: number;      // 0.0 - 1.0
    scale_recommendation: 'none' | 'scale_up' | 'scale_out';
  };
}

interface Alert {
  alert_id: string;
  type: 'quality' | 'performance' | 'system' | 'processing';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  
  affected_entities: {
    entity_id: string;
    entity_name: string;
    entity_type: string;
  }[];
  
  timing: {
    created_at: string;              // ISO 8601
    first_occurrence: string;        // ISO 8601
    last_occurrence: string;         // ISO 8601
    occurrence_count: number;
  };
  
  status: 'active' | 'acknowledged' | 'resolved' | 'suppressed';
  assigned_to?: string;
  
  resolution_info?: {
    resolved_at: string;             // ISO 8601
    resolved_by: string;
    resolution_notes: string;
    resolution_time: number;         // minutes
  };
  
  actions: {
    action_id: string;
    action_type: 'manual' | 'automated';
    description: string;
    status: 'pending' | 'completed' | 'failed';
    executed_at?: string;            // ISO 8601
  }[];
}

interface LifecycleEvent {
  event_id: string;
  entity_id: string;
  entity_name: string;
  entity_type: string;
  
  event_type: 'stage_change' | 'quality_change' | 'processing_start' | 'processing_complete' | 'error' | 'alert';
  event_description: string;
  
  timestamp: string;                 // ISO 8601
  user_id?: string;
  
  before_state?: object;
  after_state?: object;
  
  metadata: {
    source: string;
    correlation_id?: string;
    additional_data?: object;
  };
}
```

## 🔌 **Required API Endpoints**

### 1. Get Lifecycle Dashboard
```
GET /api/lifecycle-tracker/dashboard
Response: LifecycleTrackerResponse
```

### 2. Get Entity Details
```
GET /api/lifecycle-tracker/entities/{entity_id}
Response: TrackedEntity
```

### 3. Advance Entity Stage
```
POST /api/lifecycle-tracker/entities/{entity_id}/advance
Body: { target_stage?: string; force?: boolean }
Response: { success: boolean; new_stage: string }
```

### 4. Get Processing Queue
```
GET /api/lifecycle-tracker/processing-queue?status={status}&priority={priority}
Response: { tasks: ProcessingTask[]; total: number }
```

### 5. Retry Failed Task
```
POST /api/lifecycle-tracker/tasks/{task_id}/retry
Response: { success: boolean; new_task_id: string }
```

### 6. Get Quality Report
```
GET /api/lifecycle-tracker/quality-report?entity_type={type}&period={period}
Response: QualityMetrics
```

### 7. Acknowledge Alert
```
POST /api/lifecycle-tracker/alerts/{alert_id}/acknowledge
Body: { notes?: string }
Response: { success: boolean }
```

### 8. Get Lifecycle Events
```
GET /api/lifecycle-tracker/events?entity_id={id}&event_type={type}&limit={limit}
Response: { events: LifecycleEvent[]; total: number }
```

## 📊 **Data Loading Pattern**

```javascript
const LifecycleTracker = () => {
  const [overview, setOverview] = useState(null);
  const [entities, setEntities] = useState([]);
  const [processingQueue, setProcessingQueue] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLifecycleData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/lifecycle-tracker/dashboard');
      const data = await response.json();
      
      setOverview(data.overview);
      setEntities(data.entities);
      setProcessingQueue(data.processing_queue);
      setAlerts(data.alerts);
    } catch (error) {
      console.error('Failed to load lifecycle data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates via WebSocket
  useEffect(() => {
    const ws = new WebSocket('/ws/lifecycle-tracker');
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      switch (update.type) {
        case 'entity_stage_change':
          setEntities(prev => prev.map(entity => 
            entity.entity_id === update.entity_id 
              ? { ...entity, lifecycle_stage: update.new_stage }
              : entity
          ));
          break;
        case 'new_alert':
          setAlerts(prev => [update.alert, ...prev]);
          break;
        case 'task_status_change':
          setProcessingQueue(prev => prev.map(task =>
            task.task_id === update.task_id
              ? { ...task, status: update.new_status }
              : task
          ));
          break;
      }
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    loadLifecycleData();
    const interval = setInterval(loadLifecycleData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);
};
```

## 🎨 **Formatting Considerations**

### Stage Status Colors
```javascript
const getStageColor = (stage) => ({
  'initialization': 'bg-gray-100 text-gray-800',
  'data_collection': 'bg-blue-100 text-blue-800',
  'processing': 'bg-yellow-100 text-yellow-800',
  'validation': 'bg-orange-100 text-orange-800',
  'quality_check': 'bg-purple-100 text-purple-800',
  'approved': 'bg-green-100 text-green-800',
  'published': 'bg-emerald-100 text-emerald-800',
  'archived': 'bg-red-100 text-red-800'
});
```

### Quality Score Display
```javascript
const formatQualityScore = (score) => ({
  percentage: Math.round(score * 100),
  grade: score >= 0.9 ? 'A' : score >= 0.8 ? 'B' : score >= 0.7 ? 'C' : 'D',
  color: score >= 0.8 ? 'text-green-600' : score >= 0.6 ? 'text-yellow-600' : 'text-red-600'
});
```

### Alert Severity Icons
```javascript
const getAlertIcon = (severity) => ({
  'critical': '🚨',
  'high': '⚠️',
  'medium': '⚡',
  'low': 'ℹ️'
});
```

## ⚡ **Performance Considerations**

- **Real-time Updates**: WebSocket connections for live status updates
- **Pagination**: Large entity lists with virtual scrolling
- **Caching**: 1-minute cache for dashboard data
- **Background Processing**: Async quality checks and validations
- **Database Optimization**: Indexed queries for lifecycle stages and timestamps

## 🔒 **Security Considerations**

- **Role-based Access**: Different permissions for viewing vs. managing lifecycle
- **Audit Logging**: All stage changes and manual interventions logged
- **Data Privacy**: Sensitive entity data filtered based on user permissions
- **Rate Limiting**: API endpoints limited to prevent system overload

This specification provides comprehensive lifecycle tracking with real-time monitoring, quality assurance, and system health visibility.
