# Analytics Dashboard - Data Model Specification

## 📋 **Overview**

The Analytics Dashboard provides comprehensive system analytics, usage statistics, and performance metrics for administrators. It offers insights into user behavior, system performance, data quality, and application usage patterns.

## 🎯 **Navigation & Location**
- **File**: `/src/components/admin/AnalyticsDashboard.jsx`
- **Route**: `/analytics`
- **Navigation**: Admin-only access from sidebar
- **Icon**: `📊` (Chart icon)
- **Permissions**: Requires 'admin' permission

## 🎯 **View Components**

1. **Overview Cards**: Key metrics summary (users, sessions, data processed)
2. **Usage Analytics**: User activity patterns, feature usage, page views
3. **Performance Metrics**: System performance, response times, error rates
4. **Data Quality**: Data freshness, validation scores, processing statistics
5. **User Behavior**: Most used features, user journey analysis
6. **System Health**: Server status, database performance, API metrics

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/admin/analytics/dashboard
```

### Response Schema
```typescript
interface AnalyticsDashboardResponse {
  overview_metrics: OverviewMetrics;
  usage_analytics: UsageAnalytics;
  performance_metrics: PerformanceMetrics;
  data_quality: DataQualityMetrics;
  user_behavior: UserBehaviorMetrics;
  system_health: SystemHealthMetrics;
  metadata: AnalyticsMetadata;
}
```

### Overview Metrics Schema
```typescript
interface OverviewMetrics {
  // User metrics
  total_users: number;
  active_users_today: number;
  active_users_week: number;
  active_users_month: number;
  new_users_today: number;
  user_growth_rate: number;               // Percentage
  
  // Session metrics
  total_sessions_today: number;
  average_session_duration: number;       // Minutes
  bounce_rate: number;                    // Percentage
  
  // Data processing metrics
  total_destinations: number;
  total_themes_processed: number;
  total_affinities: number;
  data_processing_rate: number;           // Items per hour
  
  // System metrics
  uptime_percentage: number;
  api_calls_today: number;
  error_rate: number;                     // Percentage
}
```

### Usage Analytics Schema
```typescript
interface UsageAnalytics {
  // Page views
  page_views: {
    [route: string]: {
      views_today: number;
      views_week: number;
      views_month: number;
      average_time_spent: number;         // Minutes
      bounce_rate: number;                // Percentage
    };
  };
  
  // Feature usage
  feature_usage: {
    [feature: string]: {
      usage_count: number;
      unique_users: number;
      success_rate: number;               // Percentage
      average_completion_time: number;    // Seconds
    };
  };
  
  // User journey
  user_journey: {
    common_paths: {
      path: string[];
      frequency: number;
      conversion_rate: number;            // Percentage
    }[];
    entry_points: {
      [route: string]: number;            // Count
    };
    exit_points: {
      [route: string]: number;            // Count
    };
  };
  
  // Time-based patterns
  usage_patterns: {
    hourly_distribution: number[];        // 24-hour array
    daily_distribution: number[];         // 7-day array
    peak_hours: string[];
    low_activity_periods: string[];
  };
}
```

### Performance Metrics Schema
```typescript
interface PerformanceMetrics {
  // API performance
  api_performance: {
    average_response_time: number;        // Milliseconds
    p95_response_time: number;           // Milliseconds
    p99_response_time: number;           // Milliseconds
    requests_per_second: number;
    error_rate: number;                  // Percentage
    timeout_rate: number;                // Percentage
  };
  
  // Database performance
  database_performance: {
    query_performance: {
      average_query_time: number;        // Milliseconds
      slow_queries_count: number;
      connection_pool_usage: number;     // Percentage
    };
    storage_metrics: {
      total_storage_used: number;        // GB
      storage_growth_rate: number;       // GB per day
      index_efficiency: number;          // Percentage
    };
  };
  
  // Frontend performance
  frontend_performance: {
    page_load_times: {
      [route: string]: {
        average_load_time: number;       // Milliseconds
        p95_load_time: number;          // Milliseconds
        first_contentful_paint: number; // Milliseconds
        largest_contentful_paint: number; // Milliseconds
      };
    };
    javascript_errors: {
      error_count: number;
      unique_errors: number;
      most_common_errors: {
        error_message: string;
        count: number;
        affected_users: number;
      }[];
    };
  };
}
```

### Data Quality Metrics Schema
```typescript
interface DataQualityMetrics {
  // Data freshness
  data_freshness: {
    destinations: {
      [destination: string]: {
        last_updated: string;            // ISO 8601
        staleness_hours: number;
        update_frequency: number;        // Hours
      };
    };
    average_staleness: number;           // Hours
    outdated_data_percentage: number;   // Percentage
  };
  
  // Validation scores
  validation_scores: {
    average_confidence: number;          // 0.0 - 1.0
    evidence_validation_rate: number;   // Percentage
    source_authority_distribution: {
      gold: number;
      authoritative: number;
      standard: number;
    };
    validation_failure_rate: number;    // Percentage
  };
  
  // Processing statistics
  processing_statistics: {
    total_items_processed: number;
    processing_success_rate: number;     // Percentage
    average_processing_time: number;     // Seconds
    queue_length: number;
    failed_processing_count: number;
  };
}
```

### User Behavior Metrics Schema
```typescript
interface UserBehaviorMetrics {
  // Feature adoption
  feature_adoption: {
    [feature: string]: {
      adoption_rate: number;             // Percentage of users who used feature
      retention_rate: number;            // Percentage who used it again
      time_to_adoption: number;          // Days from registration
    };
  };
  
  // User segments
  user_segments: {
    by_role: {
      [role: string]: {
        count: number;
        activity_level: 'high' | 'medium' | 'low';
        most_used_features: string[];
      };
    };
    by_activity: {
      power_users: number;
      regular_users: number;
      occasional_users: number;
      inactive_users: number;
    };
  };
  
  // Engagement metrics
  engagement_metrics: {
    daily_active_users: number;
    weekly_active_users: number;
    monthly_active_users: number;
    user_retention_rates: {
      day_1: number;                     // Percentage
      day_7: number;                     // Percentage
      day_30: number;                    // Percentage
    };
  };
}
```

### System Health Metrics Schema
```typescript
interface SystemHealthMetrics {
  // Server health
  server_health: {
    cpu_usage: number;                   // Percentage
    memory_usage: number;                // Percentage
    disk_usage: number;                  // Percentage
    network_io: number;                  // MB/s
    uptime: number;                      // Hours
  };
  
  // Service status
  service_status: {
    [service: string]: {
      status: 'healthy' | 'degraded' | 'down';
      response_time: number;             // Milliseconds
      last_check: string;                // ISO 8601
      uptime_percentage: number;
    };
  };
  
  // Alert summary
  alert_summary: {
    active_alerts: number;
    resolved_alerts_today: number;
    critical_alerts: number;
    warning_alerts: number;
    recent_alerts: {
      alert_type: string;
      severity: 'critical' | 'warning' | 'info';
      message: string;
      timestamp: string;                 // ISO 8601
    }[];
  };
}
```

### Analytics Metadata Schema
```typescript
interface AnalyticsMetadata {
  report_generated: string;              // ISO 8601
  data_range: {
    start_date: string;                  // ISO 8601
    end_date: string;                    // ISO 8601
  };
  refresh_rate: number;                  // Minutes
  next_refresh: string;                  // ISO 8601
  data_sources: string[];
  computation_time: number;              // Milliseconds
}
```

## 🔄 **Data Flow**

1. **Dashboard Load**: Fetch comprehensive analytics data
2. **Real-time Updates**: Periodic refresh of key metrics
3. **Drill-down**: Detailed views for specific metrics
4. **Export**: Data export functionality for reports
5. **Alerts**: Real-time alert notifications

## 🎨 **UI Data Binding**

### Metric Cards
```typescript
const MetricCard = ({ title, value, change, trend }) => (
  <div className="metric-card">
    <h3>{title}</h3>
    <div className="metric-value">{value}</div>
    <div className={`metric-change ${trend}`}>
      {change > 0 ? '+' : ''}{change}%
    </div>
  </div>
);
```

### Chart Data Transformation
```typescript
const transformChartData = (rawData) => {
  return {
    labels: rawData.map(item => item.date),
    datasets: [{
      label: 'Active Users',
      data: rawData.map(item => item.active_users),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)'
    }]
  };
};
```

## 🚀 **Implementation Notes**

1. **Real-time Updates**: WebSocket connections for live metrics
2. **Performance**: Efficient data aggregation and caching
3. **Visualization**: Rich charts and graphs using Chart.js
4. **Export**: CSV/PDF export functionality
5. **Responsive**: Mobile-friendly dashboard layout
6. **Security**: Admin-only access with audit logging

## 🔗 **Related Components**

- `MetricCard.jsx` - Individual metric display component
- `AnalyticsChart.jsx` - Chart visualization component
- `AlertsPanel.jsx` - System alerts display
- `ExportButton.jsx` - Data export functionality
