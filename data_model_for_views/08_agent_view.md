# Agent View - Data Model Specification

## 📋 **Overview**

The Agent View provides comprehensive management and monitoring of multi-LLM agents used throughout Affinity Explorer. It displays agent status, performance metrics, execution history, and allows for agent configuration and manual execution. This view is critical for understanding the AI-powered analysis pipeline.

## 🎯 **View Components**

1. **Agent Overview Cards**: Status, performance, and quick stats for each agent
2. **Agent Details Panel**: Detailed configuration, capabilities, and settings
3. **Execution History**: Recent runs, success rates, and performance trends
4. **Real-time Monitoring**: Live agent status and queue information
5. **Manual Execution**: Trigger agent runs with custom parameters
6. **Performance Analytics**: Success rates, response times, and quality metrics
7. **Configuration Management**: Agent settings and model configurations

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/agents/overview
```

### Response Schema
```typescript
interface AgentViewResponse {
  agents: AgentInfo[];
  system_status: SystemStatus;
  execution_queue: QueueInfo;
  performance_summary: PerformanceSummary;
  recent_executions: ExecutionHistory[];
  configuration: AgentConfiguration;
  metadata: AgentViewMetadata;
}
```

### Agent Info Schema
```typescript
interface AgentInfo {
  agent_id: string;
  name: string;                     // e.g., "LastMileTravelAgent", "DestinationThemeAgent"
  display_name: string;             // User-friendly name
  description: string;
  type: 'analysis' | 'validation' | 'generation' | 'processing';
  category: 'destination' | 'property' | 'evidence' | 'general';
  
  // Current status
  status: 'running' | 'idle' | 'error' | 'maintenance' | 'disabled';
  current_task?: {
    task_id: string;
    description: string;
    started_at: string;             // ISO 8601
    estimated_completion: string;   // ISO 8601
    progress_percentage: number;    // 0-100
  };
  
  // Configuration
  configuration: {
    models: {
      primary_model: string;        // e.g., "gpt-4"
      consensus_models: string[];   // For multi-LLM agents
      fallback_model?: string;
    };
    parameters: {
      temperature: number;          // 0.0 - 1.0
      max_tokens: number;
      timeout_seconds: number;
      retry_attempts: number;
      consensus_threshold: number;  // 0.0 - 1.0
    };
    capabilities: string[];         // What this agent can do
    required_attributes: string[];  // Required data attributes
  };
  
  // Performance metrics
  performance: {
    success_rate_24h: number;       // 0.0 - 1.0
    success_rate_7d: number;        // 0.0 - 1.0
    average_execution_time_seconds: number;
    total_executions: number;
    failed_executions: number;
    last_successful_run: string;    // ISO 8601
    last_failed_run?: string;       // ISO 8601
  };
  
  // Resource usage
  resource_usage: {
    cpu_usage_percentage: number;   // 0-100
    memory_usage_mb: number;
    api_calls_today: number;
    api_cost_today_usd: number;
    queue_size: number;
  };
  
  // Health indicators
  health: {
    overall_health: 'healthy' | 'warning' | 'critical';
    last_health_check: string;      // ISO 8601
    issues: {
      issue_type: 'performance' | 'error_rate' | 'resource' | 'configuration';
      severity: 'low' | 'medium' | 'high';
      description: string;
      first_detected: string;       // ISO 8601
    }[];
  };
  
  // Metadata
  version: string;
  created_at: string;               // ISO 8601
  last_updated: string;             // ISO 8601
  enabled: boolean;
  maintenance_window?: {
    start: string;                  // ISO 8601
    end: string;                    // ISO 8601
    reason: string;
  };
}
```

### System Status Schema
```typescript
interface SystemStatus {
  overall_status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  active_agents: number;
  total_agents: number;
  agents_in_error: number;
  
  // Queue information
  total_queue_size: number;
  average_wait_time_minutes: number;
  processing_capacity: number;      // Tasks per hour
  
  // Resource utilization
  system_resources: {
    cpu_usage_percentage: number;
    memory_usage_percentage: number;
    disk_usage_percentage: number;
    network_throughput_mbps: number;
  };
  
  // API status
  llm_api_status: {
    provider: string;               // e.g., "openai", "anthropic", "google"
    status: 'operational' | 'degraded' | 'down';
    response_time_ms: number;
    error_rate_percentage: number;
    rate_limit_remaining: number;
  }[];
  
  last_updated: string;             // ISO 8601
}
```

### Queue Info Schema
```typescript
interface QueueInfo {
  queues: {
    queue_name: string;
    agent_type: string;
    pending_tasks: number;
    processing_tasks: number;
    failed_tasks: number;
    average_wait_time_minutes: number;
    priority_levels: {
      high: number;
      medium: number;
      low: number;
    };
  }[];
  
  recent_tasks: {
    task_id: string;
    agent_name: string;
    task_type: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    priority: 'high' | 'medium' | 'low';
    created_at: string;             // ISO 8601
    started_at?: string;            // ISO 8601
    completed_at?: string;          // ISO 8601
    estimated_duration_seconds?: number;
    actual_duration_seconds?: number;
  }[];
}
```

### Performance Summary Schema
```typescript
interface PerformanceSummary {
  time_period: {
    start: string;                  // ISO 8601
    end: string;                    // ISO 8601
    granularity: 'hour' | 'day' | 'week';
  };
  
  overall_metrics: {
    total_executions: number;
    successful_executions: number;
    failed_executions: number;
    success_rate: number;           // 0.0 - 1.0
    average_execution_time_seconds: number;
    total_api_cost_usd: number;
  };
  
  // Performance trends
  trends: {
    timestamp: string;              // ISO 8601
    executions: number;
    success_rate: number;           // 0.0 - 1.0
    average_response_time_ms: number;
    error_count: number;
  }[];
  
  // Agent-specific performance
  agent_performance: {
    agent_id: string;
    agent_name: string;
    executions: number;
    success_rate: number;           // 0.0 - 1.0
    average_execution_time_seconds: number;
    quality_score: number;          // 0.0 - 1.0 (based on output quality)
    cost_per_execution_usd: number;
  }[];
  
  // Error analysis
  error_analysis: {
    error_type: string;
    count: number;
    percentage: number;             // 0.0 - 100.0
    first_occurrence: string;       // ISO 8601
    last_occurrence: string;        // ISO 8601
    affected_agents: string[];
  }[];
}
```

### Execution History Schema
```typescript
interface ExecutionHistory {
  execution_id: string;
  agent_id: string;
  agent_name: string;
  task_type: string;
  
  // Execution details
  status: 'completed' | 'failed' | 'cancelled' | 'timeout';
  started_at: string;               // ISO 8601
  completed_at: string;             // ISO 8601
  duration_seconds: number;
  
  // Input/Output
  input_parameters: {
    [key: string]: any;             // Agent-specific parameters
  };
  output_summary: {
    items_processed: number;
    items_generated: number;
    quality_score?: number;         // 0.0 - 1.0
    confidence_score?: number;      // 0.0 - 1.0
  };
  
  // Performance metrics
  performance_metrics: {
    api_calls_made: number;
    tokens_used: number;
    cost_usd: number;
    memory_peak_mb: number;
    cpu_time_seconds: number;
  };
  
  // Error information (if failed)
  error_info?: {
    error_type: string;
    error_message: string;
    error_code?: string;
    stack_trace?: string;
    retry_attempts: number;
  };
  
  // Quality metrics
  quality_metrics?: {
    consensus_score: number;        // 0.0 - 1.0 (for multi-LLM agents)
    validation_score: number;       // 0.0 - 1.0
    completeness_score: number;     // 0.0 - 1.0
    consistency_score: number;      // 0.0 - 1.0
  };
  
  // User context
  triggered_by: 'user' | 'system' | 'schedule' | 'webhook';
  user_id?: string;
  trigger_context?: string;
}
```

### Agent Configuration Schema
```typescript
interface AgentConfiguration {
  global_settings: {
    default_timeout_seconds: number;
    max_concurrent_executions: number;
    retry_policy: {
      max_attempts: number;
      backoff_strategy: 'linear' | 'exponential';
      base_delay_seconds: number;
    };
    rate_limiting: {
      requests_per_minute: number;
      burst_allowance: number;
    };
  };
  
  llm_providers: {
    provider_id: string;            // e.g., "openai", "anthropic"
    provider_name: string;
    api_endpoint: string;
    models_available: {
      model_id: string;
      model_name: string;
      context_length: number;
      cost_per_token_usd: number;
      capabilities: string[];
    }[];
    rate_limits: {
      requests_per_minute: number;
      tokens_per_minute: number;
    };
    status: 'active' | 'inactive' | 'error';
  }[];
  
  agent_templates: {
    template_id: string;
    template_name: string;
    description: string;
    default_parameters: {
      [key: string]: any;
    };
    required_capabilities: string[];
    estimated_cost_per_execution_usd: number;
  }[];
}
```

### Agent View Metadata Schema
```typescript
interface AgentViewMetadata {
  generated_at: string;             // ISO 8601
  refresh_interval_seconds: number;
  auto_refresh_enabled: boolean;
  user_permissions: {
    can_execute_agents: boolean;
    can_modify_configuration: boolean;
    can_view_detailed_logs: boolean;
    can_manage_agents: boolean;
  };
  view_preferences: {
    default_time_range: string;     // e.g., "24h", "7d", "30d"
    default_sort_order: string;
    show_system_agents: boolean;
    show_performance_charts: boolean;
  };
}
```

## 🔌 **Required API Endpoints**

### 1. Get Agent Overview
```
GET /api/agents/overview
Response: AgentViewResponse
```

### 2. Get Agent Details
```
GET /api/agents/{agent_id}
Response: AgentInfo
```

### 3. Execute Agent
```
POST /api/agents/{agent_id}/execute
Body: {
  parameters: { [key: string]: any };
  priority: 'high' | 'medium' | 'low';
  callback_url?: string;
}
Response: {
  execution_id: string;
  status: 'queued' | 'started';
  estimated_completion: string;
}
```

### 4. Get Execution Status
```
GET /api/agents/executions/{execution_id}
Response: ExecutionHistory
```

### 5. Get Execution History
```
GET /api/agents/{agent_id}/history?page={page}&limit={limit}&status={status}
Response: {
  executions: ExecutionHistory[];
  pagination: PaginationInfo;
}
```

### 6. Update Agent Configuration
```
PUT /api/agents/{agent_id}/configuration
Body: Partial<AgentInfo['configuration']>
Response: { success: boolean; updated_config: AgentInfo['configuration'] }
```

### 7. Enable/Disable Agent
```
PUT /api/agents/{agent_id}/status
Body: { enabled: boolean; reason?: string }
Response: { success: boolean; new_status: string }
```

### 8. Get Performance Metrics
```
GET /api/agents/performance?period={period}&granularity={granularity}
Response: PerformanceSummary
```

### 9. Cancel Execution
```
DELETE /api/agents/executions/{execution_id}
Response: { success: boolean; message: string }
```

## 📊 **Data Loading Pattern**

### Frontend Implementation
```javascript
import { useState, useEffect } from 'react';

const AgentView = () => {
  const [agentData, setAgentData] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadAgentData = async () => {
      try {
        const response = await fetch('/api/agents/overview');
        const data = await response.json();
        setAgentData(data);
      } catch (error) {
        console.error('Failed to load agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAgentData();
  }, []);

  // Real-time updates via WebSocket
  useEffect(() => {
    const ws = new WebSocket('/ws/agents');
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      switch (update.type) {
        case 'agent_status_change':
          updateAgentStatus(update.agent_id, update.status);
          break;
        case 'execution_update':
          updateExecutionStatus(update.execution_id, update.status);
          break;
        case 'queue_update':
          updateQueueInfo(update.queue_info);
          break;
      }
    };

    return () => ws.close();
  }, []);

  // Execute agent
  const executeAgent = async (agentId, parameters) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameters, priority: 'medium' })
      });
      
      const result = await response.json();
      // Show execution started notification
      showNotification(`Agent execution started: ${result.execution_id}`);
      
      return result;
    } catch (error) {
      console.error('Failed to execute agent:', error);
      throw error;
    }
  };
};
```

### Backend Agent Management
```python
async def get_agent_overview() -> AgentViewResponse:
    # Get all registered agents
    agents = await get_all_agents()
    
    # Collect real-time status for each agent
    agent_infos = []
    for agent in agents:
        status = await get_agent_status(agent.id)
        performance = await get_agent_performance(agent.id, period='24h')
        health = await check_agent_health(agent.id)
        
        agent_info = AgentInfo(
            agent_id=agent.id,
            name=agent.name,
            status=status,
            performance=performance,
            health=health,
            # ... other fields
        )
        agent_infos.append(agent_info)
    
    # Get system-wide information
    system_status = await get_system_status()
    queue_info = await get_queue_information()
    performance_summary = await calculate_performance_summary()
    recent_executions = await get_recent_executions(limit=50)
    
    return AgentViewResponse(
        agents=agent_infos,
        system_status=system_status,
        execution_queue=queue_info,
        performance_summary=performance_summary,
        recent_executions=recent_executions,
        configuration=await get_agent_configuration(),
        metadata=generate_metadata()
    )
```

## 🎨 **Formatting Considerations**

### 1. Agent Status Colors
```javascript
const getAgentStatusColor = (status) => {
  const colors = {
    'running': 'text-green-600 bg-green-100',
    'idle': 'text-blue-600 bg-blue-100',
    'error': 'text-red-600 bg-red-100',
    'maintenance': 'text-yellow-600 bg-yellow-100',
    'disabled': 'text-gray-600 bg-gray-100'
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};
```

### 2. Performance Metrics Formatting
```javascript
const formatPerformanceMetric = (value, type) => {
  switch (type) {
    case 'success_rate':
      return `${(value * 100).toFixed(1)}%`;
    case 'execution_time':
      return value < 60 ? `${value.toFixed(1)}s` : `${(value / 60).toFixed(1)}m`;
    case 'cost':
      return `$${value.toFixed(4)}`;
    case 'api_calls':
      return value.toLocaleString();
    default:
      return value.toString();
  }
};
```

### 3. Queue Priority Indicators
```javascript
const getPriorityIcon = (priority) => {
  const icons = {
    'high': '🔴',
    'medium': '🟡',
    'low': '🟢'
  };
  return icons[priority] || '⚪';
};
```

## ⚡ **Performance Considerations**

### 1. Real-time Updates
- **WebSocket Connection**: Live agent status and execution updates
- **Selective Updates**: Only update changed agent information
- **Connection Management**: Automatic reconnection on failure

### 2. Caching Strategy
- **Agent Status**: 10-second cache with real-time invalidation
- **Performance Metrics**: 1-minute cache
- **Execution History**: 30-second cache with pagination
- **Configuration**: 5-minute cache, invalidated on changes

### 3. Data Optimization
- **Pagination**: Limit execution history to 50 items per page
- **Lazy Loading**: Load detailed agent info on demand
- **Compression**: Gzip large performance datasets

### 4. Background Processing
- **Health Checks**: Automated agent health monitoring
- **Metric Collection**: Background aggregation of performance data
- **Queue Management**: Intelligent task prioritization and load balancing

## 🔒 **Security Considerations**

### 1. Permission-Based Access
- **Agent Execution**: Require specific permissions
- **Configuration Changes**: Admin-only access
- **Sensitive Data**: Hide API keys and internal configurations

### 2. Rate Limiting
- **Agent Execution**: 10 executions/hour per user
- **Configuration Changes**: 5 changes/hour per user
- **Status Queries**: 120 requests/minute per user

### 3. Audit Logging
- Log all agent executions and configuration changes
- Track user actions and system events
- Secure storage of execution logs and sensitive data

## 🧪 **Testing Requirements**

### 1. Agent Testing
- Unit tests for each agent type
- Integration tests for multi-LLM consensus
- Performance tests under load

### 2. Real-time Testing
- WebSocket connection reliability
- Real-time update accuracy
- Failover and recovery testing

### 3. Security Testing
- Permission enforcement testing
- Rate limiting validation
- Data privacy and access control testing

This comprehensive specification ensures the Agent View provides complete visibility and control over the multi-LLM agent system that powers Affinity Explorer's intelligent analysis capabilities.
