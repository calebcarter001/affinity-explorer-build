# Dashboard View - Data Model Specification

## 📋 **Overview**

The Dashboard is the main landing page of Affinity Explorer, providing a comprehensive overview of goal tracking, progress metrics, recently viewed affinities, user collections, and system performance. It serves as the central hub for users to monitor progress and access key features.

## 🎯 **View Components**

1. **Header Section**: Dashboard title, last updated timestamp
2. **Goal Progress Cards**: Affinity expansion, accuracy, completeness tracking
3. **Progress Tracker**: Visual progress indicators with trend charts
4. **Accuracy Metrics**: Validation and confidence scoring
5. **Recently Viewed**: Paginated recently viewed affinities
6. **User Collections**: Personal affinity collections with favorites
7. **Quick Actions**: Navigation to key features

## 🗃️ **Complete Data Model**

### Primary API Endpoints
```
GET /api/dashboard/stats
GET /api/dashboard/config
GET /api/user/collections
GET /api/user/recently-viewed
```

### Dashboard Stats Response Schema
```typescript
interface DashboardStatsResponse {
  // Basic statistics
  totalAffinities: number;
  quarterlyGrowth: number;
  avgCoverage: number;
  yearlyGrowthCoverage: number;
  implementationRate: number;
  quarterlyGrowthImplementation: number;
  reuseRate: number;
  targetDiffReuse: number;
  
  // Goal tracking data
  goals: GoalTrackingData;
  
  // Trend data for charts
  trends: TrendData;
}
```

### Goal Tracking Data Schema
```typescript
interface GoalTrackingData {
  travelConcepts: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    breakdown: {
      validated: number;
      inValidation: number;
      inDevelopment: number;
      planned: number;
    };
    quarterlyTarget: number;
    yearlyTarget: number;
    progressRate: number;
    lastUpdated: string;
  };
  
  validation: {
    accuracy: {
      current: number;
      target: number;
      trend: number[];
      lastSixMonths: string[];
    };
    coverage: {
      total: number;
      validated: number;
      pending: number;
      breakdown: {
        humanValidated: number;
        aiValidated: number;
        needsReview: number;
        failed: number;
      };
    };
    confidence: {
      high: number;
      medium: number;
      low: number;
      threshold: number;
    };
  };
  
  completeness: {
    overall: {
      complete: number;
      incomplete: number;
      total: number;
      percentage: number;
    };
    subScores: {
      attributes: { complete: number; incomplete: number; required: boolean };
      images: { complete: number; incomplete: number; required: boolean };
      reviews: { complete: number; incomplete: number; required: boolean };
      geo: { complete: number; incomplete: number; required: boolean };
      booking: { complete: number; incomplete: number; required: boolean };
    };
    priority: {
      high: number;
      medium: number;
      low: number;
    };
    trend: number[];
  };
  
  alignment: {
    quarterly: {
      target: number;
      current: number;
      gap: number;
      initiatives: {
        name: string;
        progress: number;
      }[];
    };
    yearly: {
      target: number;
      projected: number;
      gap: number;
      riskLevel: 'low' | 'medium' | 'high';
    };
  };
}
### Trend Data Schema
```typescript
interface TrendData {
  coverage: {
    data: number[];
    labels: string[];
  };
  accuracy: {
    data: number[];
    labels: string[];
  };
  completeness: {
    data: number[];
    labels: string[];
  };
}
```

### Dashboard Config Response Schema
```typescript
interface DashboardConfigResponse {
  affinityExpansion: {
    current: number;
    target: number;
    lastUpdated: string;
  };
  accuracy: {
    current: number;
    target: number;
  };
  completeness: {
    current: number;
    target: number;
  };
  total: number;
  completed: number;
}
```

### User Collections Schema
```typescript
interface UserCollection {
  id: string;
  name: string;
  description: string;
  affinities: AffinityReference[];
  createdAt: string;                    // ISO 8601
  isFavorite: boolean;
  itemCount?: number;
}

interface AffinityReference {
  id: string;
  name: string;
  type?: string;
  category?: string;
  scoreAvailable?: boolean;
}
```

### Recently Viewed Schema
```typescript
interface RecentlyViewedItem {
  id: string;
  name: string;
  lastViewed: string;                   // ISO 8601
  type?: string;
  category?: string;
}
```

### Dashboard UI State Schema
```typescript
interface DashboardUIState {
  selectedStat: 'expansion' | 'accuracy' | 'completeness' | 'overall';
  recentlyViewedPage: number;
  collectionsPage: number;
  expandedSection: string | null;
  loading: boolean;
  error: string | null;
}
```

## 🔄 **Data Flow**

1. **Page Load**: Fetch dashboard stats, config, collections, and recently viewed
2. **Goal Tracking**: Display progress cards with real-time metrics
3. **Collections Management**: Add/remove affinities from collections
4. **Recently Viewed**: Track and display user's recent activity
5. **Progress Visualization**: Render charts and progress indicators

## 🎨 **UI Data Binding**

### Progress Calculation
```typescript
const calculateOverallProgress = (dashboardConfig) => {
  const weights = {
    affinityExpansion: 0.4,
    accuracy: 0.3,
    completeness: 0.3
  };
  const progress = {
    affinityExpansion: (dashboardConfig.affinityExpansion.current / dashboardConfig.affinityExpansion.target) * 100,
    accuracy: (dashboardConfig.accuracy.current / dashboardConfig.accuracy.target) * 100,
    completeness: (dashboardConfig.completeness.current / dashboardConfig.completeness.target) * 100
  };
  return Math.round(
    progress.affinityExpansion * weights.affinityExpansion +
    progress.accuracy * weights.accuracy +
    progress.completeness * weights.completeness
  );
};
```

### Recently Viewed Pagination
```typescript
const RECENTLY_VIEWED_PER_PAGE = 4;
const recentlyViewedTotalPages = Math.ceil(effectiveRecentlyViewed.length / RECENTLY_VIEWED_PER_PAGE);
const paginatedRecentlyViewed = effectiveRecentlyViewed.slice(
  (recentlyViewedPage - 1) * RECENTLY_VIEWED_PER_PAGE,
  recentlyViewedPage * RECENTLY_VIEWED_PER_PAGE
);
```

### Collections Pagination
```typescript
const COLLECTIONS_PER_PAGE = 4;
const collectionsPage = Math.ceil(effectiveUserCollections.length / COLLECTIONS_PER_PAGE);
```

## 🔍 **Mock Data Implementation**

The Dashboard uses mock data when real data is unavailable:

```typescript
// Sample collections when user has none
const sampleCollections = [
  {
    id: 'sample-1',
    name: 'Family Travel',
    description: 'Affinities for family vacations',
    affinities: affinities.filter(a => 
      a.name.toLowerCase().includes('family') || 
      a.name.toLowerCase().includes('pet')
    ).slice(0, 3),
    createdAt: new Date().toISOString(),
    isFavorite: true
  }
];

// Sample recently viewed from available affinities
const sampleRecentlyViewed = affinities?.slice(0, 8).map(affinity => ({
  id: affinity.id,
  name: affinity.name,
  lastViewed: new Date().toISOString()
}));
```

## 🚀 **Implementation Notes**

1. **Performance**: Uses `useMemo` and `useCallback` for expensive calculations
2. **Error Handling**: Comprehensive error states and loading indicators
3. **Responsive Design**: Adapts to different screen sizes
4. **Real-time Updates**: Periodic refresh of dashboard metrics
5. **Accessibility**: Proper ARIA labels and keyboard navigation
6. **State Management**: Uses AppContext for shared state

## 🔗 **Related Components**

- `ProgressTracker.jsx` - Goal progress visualization
- `AccuracyMetrics.jsx` - Accuracy and validation metrics
- `AffinityCard.jsx` - Individual affinity display
- `DashboardSummaryCard.jsx` - Summary metric cards
- `SkeletonLoader.jsx` - Loading state components
    total_sessions: number;
    destinations_analyzed: number;
    reports_generated: number;
    last_activity: string;          // ISO 8601
  };
}
```

### Summary Metrics Schema
```typescript
interface SummaryMetrics {
  destinations: {
    total_available: number;
    recently_updated: number;
    with_complete_data: number;
    pending_analysis: number;
  };
  
  themes: {
    total_themes: number;
    high_confidence_themes: number;  // confidence >= 0.9
    themes_added_today: number;
    average_confidence: number;      // 0.0 - 1.0
  };
  
  properties: {
    total_properties: number;
    properties_with_scores: number;
    average_affinity_score: number;  // 0.0 - 1.0
    properties_analyzed_today: number;
  };
  
  agents: {
    total_agents: number;
    active_agents: number;
    agents_running: number;
    successful_runs_today: number;
    failed_runs_today: number;
  };
  
  evidence: {
    total_evidence_items: number;
    verified_evidence: number;
    pending_verification: number;
    evidence_quality_score: number; // 0.0 - 1.0
  };
  
  last_updated: string;             // ISO 8601
}
```

### Recent Activity Schema
```typescript
interface RecentActivity {
  id: string;
  type: 'destination_analysis' | 'theme_generation' | 'evidence_validation' | 
        'property_scoring' | 'agent_run' | 'user_action' | 'system_update';
  title: string;
  description: string;
  timestamp: string;                // ISO 8601
  user_id?: string;                 // If user-initiated
  status: 'completed' | 'running' | 'failed' | 'pending';
  
  // Type-specific data
  details: ActivityDetails;
  
  // UI metadata
  icon: string;                     // Icon identifier for frontend
  color: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;              // Can user take action on this?
  action_url?: string;              // URL to navigate to for action
}

type ActivityDetails = 
  | DestinationAnalysisDetails 
  | ThemeGenerationDetails 
  | EvidenceValidationDetails 
  | PropertyScoringDetails 
  | AgentRunDetails 
  | UserActionDetails 
  | SystemUpdateDetails;

interface DestinationAnalysisDetails {
  destination_id: string;
  destination_name: string;
  themes_generated: number;
  confidence_score: number;
  processing_time_seconds: number;
}

interface ThemeGenerationDetails {
  destination_id: string;
  themes_added: number;
  themes_updated: number;
  average_confidence: number;
}

interface EvidenceValidationDetails {
  evidence_items_processed: number;
  verified_count: number;
  disputed_count: number;
  validation_method: string;
}

interface PropertyScoringDetails {
  properties_scored: number;
  average_score: number;
  scoring_model_version: string;
}

interface AgentRunDetails {
  agent_name: string;
  agent_type: string;
  duration_seconds: number;
  success_rate: number;
  items_processed: number;
}

interface UserActionDetails {
  action_type: string;
  resource_type: string;
  resource_id: string;
}

interface SystemUpdateDetails {
  update_type: 'data_refresh' | 'model_update' | 'configuration_change';
  affected_components: string[];
  version?: string;
}
```

### Quick Actions Schema
```typescript
interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  category: 'analysis' | 'data' | 'configuration' | 'reports';
  requires_permission?: string;
  enabled: boolean;
  badge_count?: number;             // For notifications/pending items
  estimated_time?: string;          // e.g., "2 minutes"
}
```

### System Health Schema
```typescript
interface SystemHealth {
  overall_status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  
  agents: {
    status: 'healthy' | 'degraded' | 'down';
    active_count: number;
    total_count: number;
    failed_in_last_hour: number;
    average_response_time_ms: number;
    details: {
      agent_name: string;
      status: 'running' | 'idle' | 'error' | 'maintenance';
      last_run: string;             // ISO 8601
      success_rate_24h: number;     // 0.0 - 1.0
      current_queue_size: number;
    }[];
  };
  
  data_freshness: {
    status: 'fresh' | 'stale' | 'very_stale';
    destinations_updated_today: number;
    oldest_data_age_days: number;
    average_data_age_days: number;
    refresh_in_progress: boolean;
  };
  
  api_performance: {
    status: 'optimal' | 'slow' | 'degraded';
    average_response_time_ms: number;
    error_rate_percentage: number;
    requests_per_minute: number;
    cache_hit_rate: number;        // 0.0 - 1.0
  };
  
  storage: {
    status: 'healthy' | 'warning' | 'critical';
    database_size_gb: number;
    cache_size_gb: number;
    available_space_gb: number;
    backup_status: 'current' | 'outdated' | 'failed';
    last_backup: string;           // ISO 8601
  };
  
  last_health_check: string;       // ISO 8601
}
```

### Analytics Overview Schema
```typescript
interface AnalyticsOverview {
  usage_trends: {
    daily_active_users: number;
    weekly_active_users: number;
    monthly_active_users: number;
    popular_destinations: {
      destination_id: string;
      destination_name: string;
      view_count: number;
      unique_users: number;
    }[];
    popular_features: {
      feature_name: string;
      usage_count: number;
      unique_users: number;
    }[];
  };
  
  performance_metrics: {
    average_page_load_time_ms: number;
    bounce_rate_percentage: number;
    user_satisfaction_score: number; // 0.0 - 1.0
    feature_adoption_rates: {
      [feature_name: string]: number; // 0.0 - 1.0
    };
  };
  
  data_quality_trends: {
    average_confidence_trend: {
      date: string;                 // YYYY-MM-DD
      value: number;                // 0.0 - 1.0
    }[];
    evidence_validation_trend: {
      date: string;
      verified_percentage: number;  // 0.0 - 100.0
    }[];
    theme_generation_trend: {
      date: string;
      themes_generated: number;
    }[];
  };
  
  period: {
    start_date: string;             // ISO 8601
    end_date: string;               // ISO 8601
    timezone: string;
  };
}
```

### Notification Schema
```typescript
interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'maintenance';
  title: string;
  message: string;
  timestamp: string;                // ISO 8601
  read: boolean;
  dismissible: boolean;
  
  // Action buttons
  actions?: {
    label: string;
    action: 'navigate' | 'api_call' | 'dismiss' | 'external_link';
    target: string;                 // URL or API endpoint
    style: 'primary' | 'secondary' | 'danger';
  }[];
  
  // Expiration
  expires_at?: string;              // ISO 8601
  
  // Targeting
  target_users?: string[];          // Specific user IDs
  target_roles?: string[];          // User roles
  
  // Metadata
  source: 'system' | 'admin' | 'agent' | 'external';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'data' | 'user' | 'feature' | 'maintenance';
}
```

### Dashboard Metadata Schema
```typescript
interface DashboardMetadata {
  generated_at: string;             // ISO 8601
  cache_status: 'hit' | 'miss' | 'partial';
  data_sources: {
    source_name: string;
    last_updated: string;           // ISO 8601
    status: 'current' | 'stale' | 'error';
  }[];
  refresh_interval_seconds: number;
  next_auto_refresh: string;        // ISO 8601
  user_timezone: string;
  locale: string;
}
```

## 🔌 **Required API Endpoints**

### 1. Get Dashboard Overview
```
GET /api/dashboard/overview
Response: DashboardOverviewResponse
```

### 2. Get Recent Activity (Paginated)
```
GET /api/dashboard/activity?page={page}&limit={limit}&type={type}
Response: {
  activities: RecentActivity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    has_next: boolean;
  };
}
```

### 3. Get System Health Details
```
GET /api/dashboard/health
Response: SystemHealth
```

### 4. Execute Quick Action
```
POST /api/dashboard/actions/{action_id}
Response: {
  success: boolean;
  message: string;
  redirect_url?: string;
}
```

### 5. Mark Notification as Read
```
PUT /api/dashboard/notifications/{notification_id}/read
Response: { success: boolean }
```

### 6. Dismiss Notification
```
DELETE /api/dashboard/notifications/{notification_id}
Response: { success: boolean }
```

### 7. Get Analytics Data
```
GET /api/dashboard/analytics?period={period}&granularity={granularity}
Response: AnalyticsOverview
```

## 📊 **Data Loading Pattern**

### Frontend Implementation
```javascript
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/overview');
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    
    // Set up auto-refresh
    const interval = setInterval(loadDashboardData, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Real-time updates via WebSocket
  useEffect(() => {
    const ws = new WebSocket('/ws/dashboard');
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      // Update specific dashboard sections based on update type
      updateDashboardSection(update);
    };
    return () => ws.close();
  }, []);
};
```

### Backend Data Aggregation
```python
async def get_dashboard_overview(user_id: str) -> DashboardOverviewResponse:
    # Parallel data loading for performance
    user_info, summary_metrics, recent_activity, system_health = await asyncio.gather(
        get_user_info(user_id),
        calculate_summary_metrics(),
        get_recent_activity(limit=20),
        check_system_health()
    )
    
    # Load additional data based on user permissions
    analytics = await get_analytics_overview() if user_has_permission(user_id, 'view_analytics') else None
    notifications = await get_user_notifications(user_id)
    quick_actions = await get_available_quick_actions(user_id)
    
    return DashboardOverviewResponse(
        user_info=user_info,
        summary_metrics=summary_metrics,
        recent_activity=recent_activity,
        quick_actions=quick_actions,
        system_health=system_health,
        analytics_overview=analytics,
        notifications=notifications,
        metadata=generate_metadata()
    )
```

## 🎨 **Formatting Considerations**

### 1. Status Color Coding
```javascript
const getStatusColor = (status) => {
  const colors = {
    'healthy': 'text-green-600 bg-green-100',
    'warning': 'text-yellow-600 bg-yellow-100',
    'critical': 'text-red-600 bg-red-100',
    'maintenance': 'text-blue-600 bg-blue-100'
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};
```

### 2. Metric Formatting
```javascript
const formatMetric = (value, type) => {
  switch (type) {
    case 'percentage':
      return `${(value * 100).toFixed(1)}%`;
    case 'duration':
      return value < 60 ? `${value}s` : `${Math.floor(value / 60)}m ${value % 60}s`;
    case 'count':
      return value.toLocaleString();
    case 'confidence':
      return `${(value * 100).toFixed(0)}%`;
    default:
      return value.toString();
  }
};
```

### 3. Time Formatting
```javascript
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return `${Math.floor(diffMins / 1440)}d ago`;
};
```

## ⚡ **Performance Considerations**

### 1. Caching Strategy
- **Dashboard Overview**: 30-second cache with real-time updates
- **Summary Metrics**: 5-minute cache, invalidated on data changes
- **Recent Activity**: 1-minute cache with WebSocket updates
- **System Health**: 15-second cache

### 2. Real-time Updates
- **WebSocket Connection**: Live updates for critical metrics
- **Selective Updates**: Only update changed sections
- **Fallback Polling**: 30-second polling if WebSocket fails

### 3. Progressive Loading
- **Critical First**: Load summary metrics first
- **Lazy Loading**: Load analytics and detailed health on demand
- **Skeleton Loading**: Show placeholders while loading

### 4. Data Optimization
- **Aggregated Queries**: Pre-calculate summary metrics
- **Indexed Queries**: Optimize database queries for dashboard
- **Compressed Responses**: Gzip compression for large datasets

## 🔒 **Security Considerations**

### 1. Permission-Based Data
- Filter data based on user permissions
- Hide sensitive metrics from non-admin users
- Audit log access to dashboard data

### 2. Rate Limiting
- Dashboard API: 120 requests/minute per user
- Real-time updates: Connection limits per user
- Quick actions: 30 requests/minute per user

### 3. Data Privacy
- Anonymize user activity in shared views
- Secure WebSocket connections
- Encrypt sensitive configuration data

## 🧪 **Testing Requirements**

### 1. Performance Testing
- Load testing with 100+ concurrent users
- Dashboard load time < 2 seconds
- Real-time update latency < 500ms

### 2. Data Accuracy Testing
- Verify metric calculations
- Test cache invalidation
- Validate real-time update accuracy

### 3. User Experience Testing
- Test with different permission levels
- Verify responsive design
- Test error handling and fallbacks

This comprehensive specification ensures the Dashboard provides a powerful, real-time overview of the entire Affinity Explorer system while maintaining excellent performance and user experience.
