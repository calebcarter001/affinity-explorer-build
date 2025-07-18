# Reports & Analytics View - Data Model Specification

## 📋 **Overview**

The Reports & Analytics view provides comprehensive business intelligence, data visualization, and reporting capabilities for the Affinity Explorer system. It enables users to create custom reports, analyze trends, and gain insights from property affinity data, user behavior, and system performance.

## 🎯 **View Components**

1. **Report Builder**: Drag-and-drop report creation interface
2. **Dashboard Designer**: Custom dashboard creation tools
3. **Data Visualization**: Charts, graphs, and interactive visualizations
4. **Scheduled Reports**: Automated report generation and distribution
5. **Analytics Explorer**: Ad-hoc data analysis and exploration
6. **Performance Metrics**: System and business KPI tracking
7. **Export Tools**: Report export in multiple formats

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/reports-analytics/dashboard
```

### Response Schema
```typescript
interface ReportsAnalyticsResponse {
  reports: Report[];
  dashboards: Dashboard[];
  analytics_data: AnalyticsData;
  scheduled_reports: ScheduledReport[];
  data_sources: DataSource[];
  visualizations: Visualization[];
  kpi_metrics: KPIMetric[];
  metadata: ReportsMetadata;
}

interface Report {
  report_id: string;
  name: string;
  description: string;
  report_type: 'tabular' | 'summary' | 'analytical' | 'operational' | 'executive';
  
  // Report configuration
  configuration: {
    data_sources: {
      source_id: string;
      source_name: string;
      source_type: 'database' | 'api' | 'file' | 'real_time';
      connection_params: object;
      refresh_frequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    }[];
    
    filters: {
      filter_id: string;
      field_name: string;
      operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
      value: any;
      logic: 'and' | 'or';
      user_configurable: boolean;
    }[];
    
    grouping: {
      group_by_fields: string[];
      aggregations: {
        field: string;
        function: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'distinct_count';
        alias: string;
      }[];
    };
    
    sorting: {
      field: string;
      direction: 'asc' | 'desc';
      priority: number;
    }[];
    
    pagination: {
      page_size: number;
      max_rows: number;
      allow_export_all: boolean;
    };
  };
  
  // Report layout and formatting
  layout: {
    columns: {
      field_name: string;
      display_name: string;
      data_type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
      format?: string;
      width?: number;
      alignment: 'left' | 'center' | 'right';
      visible: boolean;
      sortable: boolean;
      filterable: boolean;
    }[];
    
    styling: {
      theme: 'light' | 'dark' | 'custom';
      color_scheme: string[];
      font_family: string;
      font_size: number;
      header_styling: object;
      row_styling: object;
      
      conditional_formatting: {
        condition: string;
        field: string;
        format: {
          background_color?: string;
          text_color?: string;
          font_weight?: 'normal' | 'bold';
          icon?: string;
        };
      }[];
    };
    
    summary_sections: {
      section_type: 'header' | 'footer' | 'group_header' | 'group_footer';
      content: string;
      calculations: {
        field: string;
        function: string;
        format: string;
      }[];
    }[];
  };
  
  // Execution and performance
  execution_info: {
    last_run: string;               // ISO 8601
    execution_time_ms: number;
    row_count: number;
    data_freshness: string;         // ISO 8601
    cache_status: 'hit' | 'miss' | 'expired';
    
    performance_metrics: {
      query_time_ms: number;
      render_time_ms: number;
      memory_usage_mb: number;
      cpu_usage_percent: number;
    };
    
    execution_history: {
      executed_at: string;          // ISO 8601
      execution_time_ms: number;
      row_count: number;
      success: boolean;
      error_message?: string;
    }[];
  };
  
  // Sharing and permissions
  sharing: {
    visibility: 'private' | 'team' | 'organization' | 'public';
    owner_id: string;
    owner_name: string;
    
    permissions: {
      user_id: string;
      username: string;
      permission: 'view' | 'edit' | 'admin';
      granted_at: string;           // ISO 8601
      granted_by: string;
    }[];
    
    sharing_links: {
      link_id: string;
      link_type: 'view_only' | 'interactive' | 'embed';
      expires_at?: string;          // ISO 8601
      password_protected: boolean;
      access_count: number;
      last_accessed?: string;       // ISO 8601
    }[];
  };
  
  // Usage analytics
  usage_analytics: {
    view_count: number;
    unique_viewers: number;
    average_view_duration: number;  // seconds
    export_count: number;
    bookmark_count: number;
    
    usage_patterns: {
      hour_of_day: number;
      day_of_week: string;
      usage_count: number;
    }[];
    
    user_feedback: {
      rating: number;               // 1.0 - 5.0
      comment: string;
      user_id: string;
      timestamp: string;            // ISO 8601
    }[];
  };
  
  // Metadata
  metadata: {
    created_at: string;             // ISO 8601
    last_modified: string;          // ISO 8601
    version: string;
    tags: string[];
    category: string;
    business_context: string;
    compliance_requirements: string[];
  };
}

interface Dashboard {
  dashboard_id: string;
  name: string;
  description: string;
  
  // Dashboard layout
  layout: {
    grid_columns: number;
    grid_rows: number;
    responsive: boolean;
    
    widgets: {
      widget_id: string;
      widget_type: 'chart' | 'table' | 'metric' | 'text' | 'image' | 'iframe';
      title: string;
      
      position: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      
      configuration: {
        data_source: string;
        query: string;
        refresh_interval: number;    // seconds
        
        // Widget-specific config
        chart_config?: {
          chart_type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'gauge';
          x_axis: string;
          y_axis: string[];
          color_scheme: string[];
          show_legend: boolean;
          show_grid: boolean;
          animation: boolean;
        };
        
        table_config?: {
          columns: string[];
          pagination: boolean;
          sorting: boolean;
          filtering: boolean;
          row_limit: number;
        };
        
        metric_config?: {
          value_field: string;
          comparison_field?: string;
          target_value?: number;
          format: string;
          trend_indicator: boolean;
        };
      };
      
      styling: {
        background_color: string;
        border_color: string;
        border_width: number;
        border_radius: number;
        padding: number;
        margin: number;
      };
    }[];
  };
  
  // Interactivity
  interactivity: {
    filters: {
      filter_id: string;
      name: string;
      type: 'dropdown' | 'date_range' | 'text_input' | 'multi_select';
      affects_widgets: string[];    // widget_ids
      default_value: any;
      required: boolean;
    }[];
    
    drill_down: {
      widget_id: string;
      drill_down_type: 'page' | 'modal' | 'expand';
      target_report?: string;
      parameters: {
        source_field: string;
        target_parameter: string;
      }[];
    }[];
    
    cross_filtering: {
      enabled: boolean;
      affected_widgets: string[];
      filter_behavior: 'highlight' | 'filter' | 'both';
    };
  };
  
  // Real-time updates
  real_time: {
    enabled: boolean;
    update_frequency: number;       // seconds
    websocket_endpoint?: string;
    
    alerts: {
      alert_id: string;
      condition: string;
      threshold: number;
      notification_method: 'email' | 'sms' | 'push' | 'webhook';
      recipients: string[];
    }[];
  };
  
  // Sharing and embedding
  sharing: {
    public_url?: string;
    embed_code?: string;
    iframe_url?: string;
    
    access_control: {
      require_login: boolean;
      allowed_domains: string[];
      ip_restrictions: string[];
    };
  };
  
  // Usage tracking
  usage_tracking: {
    page_views: number;
    unique_visitors: number;
    average_session_duration: number; // seconds
    bounce_rate: number;            // 0.0 - 1.0
    
    widget_interactions: {
      widget_id: string;
      interaction_type: 'click' | 'hover' | 'filter' | 'drill_down';
      count: number;
    }[];
  };
  
  // Metadata
  metadata: {
    created_at: string;             // ISO 8601
    last_modified: string;          // ISO 8601
    created_by: string;
    tags: string[];
    category: string;
    business_purpose: string;
  };
}

interface AnalyticsData {
  business_metrics: {
    total_properties: number;
    active_users: number;
    total_affinities: number;
    system_uptime: number;          // percentage
    
    trends: {
      metric_name: string;
      current_value: number;
      previous_value: number;
      change_percentage: number;
      trend_direction: 'up' | 'down' | 'stable';
      time_period: string;
    }[];
  };
  
  user_analytics: {
    user_engagement: {
      daily_active_users: number;
      weekly_active_users: number;
      monthly_active_users: number;
      average_session_duration: number; // minutes
      page_views_per_session: number;
    };
    
    user_behavior: {
      most_viewed_pages: {
        page: string;
        views: number;
        unique_visitors: number;
      }[];
      
      user_journey: {
        step: string;
        users: number;
        conversion_rate: number;    // 0.0 - 1.0
      }[];
      
      feature_usage: {
        feature: string;
        usage_count: number;
        user_count: number;
        adoption_rate: number;      // 0.0 - 1.0
      }[];
    };
  };
  
  system_analytics: {
    performance_metrics: {
      response_time_p95: number;    // milliseconds
      error_rate: number;           // 0.0 - 1.0
      throughput: number;           // requests/second
      availability: number;         // 0.0 - 1.0
    };
    
    resource_utilization: {
      cpu_usage: number;            // 0.0 - 1.0
      memory_usage: number;         // 0.0 - 1.0
      disk_usage: number;           // 0.0 - 1.0
      network_usage: number;        // 0.0 - 1.0
    };
    
    data_quality: {
      completeness: number;         // 0.0 - 1.0
      accuracy: number;             // 0.0 - 1.0
      consistency: number;          // 0.0 - 1.0
      timeliness: number;           // 0.0 - 1.0
    };
  };
  
  business_intelligence: {
    affinity_insights: {
      top_performing_affinities: {
        affinity_id: string;
        affinity_name: string;
        performance_score: number;
        usage_frequency: number;
      }[];
      
      affinity_correlations: {
        affinity_1: string;
        affinity_2: string;
        correlation_coefficient: number; // -1.0 to 1.0
        significance: number;       // 0.0 - 1.0
      }[];
    };
    
    property_insights: {
      property_performance: {
        property_id: string;
        property_name: string;
        overall_score: number;
        booking_rate: number;
        user_satisfaction: number;
      }[];
      
      market_trends: {
        destination: string;
        trend_type: 'demand' | 'pricing' | 'satisfaction';
        trend_value: number;
        change_percentage: number;
        time_period: string;
      }[];
    };
  };
}

interface ScheduledReport {
  schedule_id: string;
  report_id: string;
  report_name: string;
  
  // Schedule configuration
  schedule: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    time_of_day: string;            // HH:MM format
    day_of_week?: string;           // For weekly schedules
    day_of_month?: number;          // For monthly schedules
    timezone: string;
    
    start_date: string;             // ISO 8601
    end_date?: string;              // ISO 8601
    
    custom_cron?: string;           // For complex schedules
  };
  
  // Delivery configuration
  delivery: {
    method: 'email' | 'ftp' | 'sftp' | 's3' | 'webhook' | 'shared_folder';
    
    email_config?: {
      recipients: {
        email: string;
        name: string;
        type: 'to' | 'cc' | 'bcc';
      }[];
      subject_template: string;
      body_template: string;
      include_attachment: boolean;
      attachment_format: 'pdf' | 'excel' | 'csv' | 'json';
    };
    
    file_config?: {
      destination_path: string;
      file_name_template: string;
      file_format: 'pdf' | 'excel' | 'csv' | 'json';
      compression: 'none' | 'zip' | 'gzip';
    };
    
    webhook_config?: {
      url: string;
      method: 'POST' | 'PUT';
      headers: { [key: string]: string };
      authentication: {
        type: 'none' | 'basic' | 'bearer' | 'api_key';
        credentials: object;
      };
    };
  };
  
  // Execution tracking
  execution_log: {
    execution_id: string;
    scheduled_time: string;         // ISO 8601
    actual_start_time: string;      // ISO 8601
    completion_time?: string;       // ISO 8601
    status: 'scheduled' | 'running' | 'completed' | 'failed' | 'cancelled';
    
    execution_details: {
      rows_processed: number;
      file_size_bytes: number;
      delivery_status: 'pending' | 'delivered' | 'failed';
      error_message?: string;
    };
    
    retry_info?: {
      retry_count: number;
      max_retries: number;
      next_retry_time?: string;     // ISO 8601
    };
  }[];
  
  // Configuration
  configuration: {
    enabled: boolean;
    max_retries: number;
    retry_delay_minutes: number;
    timeout_minutes: number;
    
    failure_handling: {
      notify_on_failure: boolean;
      notification_recipients: string[];
      auto_disable_after_failures: number;
    };
    
    data_filters: {
      filter_name: string;
      filter_value: any;
      dynamic: boolean;             // Use current date/time
    }[];
  };
  
  // Metadata
  metadata: {
    created_at: string;             // ISO 8601
    created_by: string;
    last_modified: string;          // ISO 8601
    last_successful_run?: string;   // ISO 8601
    total_executions: number;
    success_rate: number;           // 0.0 - 1.0
  };
}

interface KPIMetric {
  kpi_id: string;
  name: string;
  description: string;
  category: string;
  
  // Metric definition
  definition: {
    calculation_method: 'sum' | 'average' | 'count' | 'percentage' | 'ratio' | 'custom';
    data_source: string;
    query: string;
    
    numerator?: string;
    denominator?: string;           // For ratios and percentages
    
    filters: {
      field: string;
      operator: string;
      value: any;
    }[];
    
    time_dimension: {
      field: string;
      granularity: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
      rolling_window?: number;      // For moving averages
    };
  };
  
  // Current values
  current_values: {
    value: number;
    formatted_value: string;
    calculation_time: string;       // ISO 8601
    
    comparison: {
      previous_period_value: number;
      change_absolute: number;
      change_percentage: number;
      trend: 'up' | 'down' | 'stable';
    };
    
    target?: {
      target_value: number;
      target_type: 'minimum' | 'maximum' | 'exact';
      achievement_percentage: number; // 0.0 - 1.0
      status: 'on_track' | 'at_risk' | 'off_track';
    };
  };
  
  // Historical data
  historical_data: {
    date: string;                   // ISO 8601
    value: number;
    data_quality: number;           // 0.0 - 1.0
  }[];
  
  // Alerting
  alerts: {
    alert_type: 'threshold' | 'trend' | 'anomaly';
    condition: string;
    threshold_value?: number;
    enabled: boolean;
    
    notification: {
      recipients: string[];
      channels: ('email' | 'sms' | 'slack' | 'webhook')[];
      frequency: 'immediate' | 'daily' | 'weekly';
    };
    
    alert_history: {
      triggered_at: string;         // ISO 8601
      alert_value: number;
      resolved_at?: string;         // ISO 8601
      acknowledged_by?: string;
    }[];
  };
  
  // Metadata
  metadata: {
    owner: string;
    business_importance: 'low' | 'medium' | 'high' | 'critical';
    update_frequency: string;
    data_freshness_sla: number;     // minutes
    created_at: string;             // ISO 8601
    last_updated: string;           // ISO 8601
  };
}
```

## 🔌 **Required API Endpoints**

### 1. Get Reports & Analytics Dashboard
```
GET /api/reports-analytics/dashboard
Response: ReportsAnalyticsResponse
```

### 2. Report Management
```
GET /api/reports-analytics/reports
POST /api/reports-analytics/reports
PUT /api/reports-analytics/reports/{report_id}
DELETE /api/reports-analytics/reports/{report_id}
```

### 3. Execute Report
```
POST /api/reports-analytics/reports/{report_id}/execute
Body: { filters?: object; format?: string }
Response: { data: any[]; metadata: object }
```

### 4. Dashboard Management
```
GET /api/reports-analytics/dashboards
POST /api/reports-analytics/dashboards
PUT /api/reports-analytics/dashboards/{dashboard_id}
DELETE /api/reports-analytics/dashboards/{dashboard_id}
```

### 5. Schedule Report
```
POST /api/reports-analytics/schedules
PUT /api/reports-analytics/schedules/{schedule_id}
DELETE /api/reports-analytics/schedules/{schedule_id}
```

### 6. Get Analytics Data
```
GET /api/reports-analytics/analytics?metric={metric}&period={period}&granularity={granularity}
Response: AnalyticsData
```

### 7. Export Report
```
GET /api/reports-analytics/reports/{report_id}/export?format={format}
Response: File download
```

### 8. Get KPI Metrics
```
GET /api/reports-analytics/kpis
POST /api/reports-analytics/kpis/{kpi_id}/calculate
Response: { current_value: number; historical_data: any[] }
```

## 📊 **Data Loading Pattern**

```javascript
const ReportsAnalytics = () => {
  const [reports, setReports] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [kpiMetrics, setKpiMetrics] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReportsData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports-analytics/dashboard');
      const data = await response.json();
      
      setReports(data.reports);
      setDashboards(data.dashboards);
      setAnalyticsData(data.analytics_data);
      setKpiMetrics(data.kpi_metrics);
    } catch (error) {
      console.error('Failed to load reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeReport = async (reportId, filters = {}, format = 'json') => {
    try {
      const response = await fetch(`/api/reports-analytics/reports/${reportId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters, format })
      });
      return await response.json();
    } catch (error) {
      console.error('Report execution failed:', error);
      throw error;
    }
  };

  const exportReport = async (reportId, format) => {
    try {
      const response = await fetch(`/api/reports-analytics/reports/${reportId}/export?format=${format}`);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${reportId}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Report export failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadReportsData();
    
    // Set up real-time updates for KPIs
    const ws = new WebSocket('/ws/reports-analytics');
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.type === 'kpi_update') {
        setKpiMetrics(prev => prev.map(kpi => 
          kpi.kpi_id === update.kpi_id 
            ? { ...kpi, current_values: update.values }
            : kpi
        ));
      }
    };

    return () => ws.close();
  }, []);
};
```

## 🎨 **Formatting Considerations**

### KPI Display
```javascript
const KPICard = ({ kpi }) => {
  const { value, change_percentage, trend } = kpi.current_values;
  const trendColor = trend === 'up' ? 'text-green-600' : 
                    trend === 'down' ? 'text-red-600' : 'text-gray-600';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold">{kpi.name}</h3>
      <div className="text-3xl font-bold mt-2">{kpi.current_values.formatted_value}</div>
      <div className={`text-sm mt-1 ${trendColor}`}>
        {change_percentage > 0 ? '+' : ''}{change_percentage.toFixed(1)}% vs last period
      </div>
    </div>
  );
};
```

### Chart Configuration
```javascript
const ChartWidget = ({ widget }) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: widget.configuration.chart_config.show_legend
      }
    },
    scales: {
      x: {
        grid: {
          display: widget.configuration.chart_config.show_grid
        }
      },
      y: {
        grid: {
          display: widget.configuration.chart_config.show_grid
        }
      }
    }
  };
  
  return (
    <div className="widget-container">
      <h4>{widget.title}</h4>
      <Chart type={widget.configuration.chart_config.chart_type} options={chartOptions} />
    </div>
  );
};
```

## ⚡ **Performance Considerations**

- **Data Caching**: Report results cached based on data freshness requirements
- **Lazy Loading**: Large reports loaded progressively
- **Real-time Updates**: WebSocket connections for live dashboards
- **Query Optimization**: Optimized database queries with proper indexing
- **Export Streaming**: Large exports streamed to prevent memory issues

## 🔒 **Security Considerations**

- **Data Access Control**: Row-level security based on user permissions
- **Report Sharing**: Secure sharing with expiration and access controls
- **Audit Logging**: All report access and modifications logged
- **Data Masking**: Sensitive data masked based on user roles
- **Export Controls**: Restrictions on data export based on compliance requirements

This specification provides comprehensive reporting and analytics capabilities with advanced visualization, scheduling, and business intelligence features.
