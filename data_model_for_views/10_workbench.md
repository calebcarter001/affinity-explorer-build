# Workbench View - Data Model Specification

## 📋 **Overview**

The Workbench is a comprehensive development and experimentation environment for data scientists and analysts to explore data, create custom analyses, run experiments, and prototype new features within the Affinity Explorer ecosystem.

## 🎯 **View Components**

1. **Notebook Interface**: Jupyter-style notebook for data exploration
2. **Data Explorer**: Interactive data browsing and filtering
3. **Query Builder**: Visual and SQL query construction
4. **Visualization Tools**: Chart and graph creation tools
5. **Experiment Tracker**: ML experiment management
6. **Code Editor**: Advanced code editing with syntax highlighting
7. **Results Dashboard**: Experiment results and model performance

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/workbench/dashboard
```

### Response Schema
```typescript
interface WorkbenchResponse {
  notebooks: Notebook[];
  datasets: Dataset[];
  experiments: Experiment[];
  queries: SavedQuery[];
  visualizations: Visualization[];
  compute_resources: ComputeResource[];
  user_workspace: UserWorkspace;
  metadata: WorkbenchMetadata;
}

interface Notebook {
  notebook_id: string;
  name: string;
  description: string;
  
  // Notebook content
  cells: {
    cell_id: string;
    cell_type: 'code' | 'markdown' | 'raw';
    content: string;
    execution_count?: number;
    outputs?: {
      output_type: 'stream' | 'display_data' | 'execute_result' | 'error';
      data: any;
      metadata?: object;
    }[];
    metadata: {
      collapsed?: boolean;
      scrolled?: boolean;
      tags?: string[];
    };
  }[];
  
  // Execution environment
  kernel_info: {
    kernel_name: string;
    language: string;
    version: string;
    status: 'idle' | 'busy' | 'starting' | 'dead';
  };
  
  // Dependencies and environment
  environment: {
    python_version?: string;
    packages: {
      name: string;
      version: string;
      installed: boolean;
    }[];
    environment_variables: { [key: string]: string };
    data_connections: {
      connection_id: string;
      connection_type: 'database' | 'api' | 'file';
      status: 'connected' | 'disconnected' | 'error';
    }[];
  };
  
  // Collaboration
  collaboration: {
    owner_id: string;
    owner_name: string;
    shared_with: {
      user_id: string;
      username: string;
      permission: 'read' | 'write' | 'execute';
    }[];
    comments: {
      comment_id: string;
      cell_id?: string;
      user_id: string;
      username: string;
      content: string;
      timestamp: string;            // ISO 8601
      resolved: boolean;
    }[];
  };
  
  // Version control
  version_info: {
    current_version: string;
    versions: {
      version: string;
      created_at: string;           // ISO 8601
      created_by: string;
      commit_message: string;
      cell_count: number;
    }[];
    git_integration?: {
      repository_url: string;
      branch: string;
      last_commit: string;
      sync_status: 'synced' | 'ahead' | 'behind' | 'conflict';
    };
  };
  
  // Execution history
  execution_history: {
    session_id: string;
    started_at: string;             // ISO 8601
    ended_at?: string;              // ISO 8601
    total_execution_time: number;   // seconds
    cells_executed: number;
    errors_encountered: number;
    resource_usage: {
      peak_memory_mb: number;
      cpu_time_seconds: number;
      gpu_time_seconds?: number;
    };
  }[];
  
  // Metadata
  metadata: {
    created_at: string;             // ISO 8601
    last_modified: string;          // ISO 8601
    last_executed: string;          // ISO 8601
    tags: string[];
    category: string;
    language: string;
    file_size_bytes: number;
  };
}

interface Dataset {
  dataset_id: string;
  name: string;
  description: string;
  
  // Data source information
  source_info: {
    source_type: 'database' | 'file' | 'api' | 'generated';
    connection_string?: string;
    file_path?: string;
    api_endpoint?: string;
    query?: string;
  };
  
  // Schema and structure
  schema: {
    columns: {
      name: string;
      data_type: 'string' | 'integer' | 'float' | 'boolean' | 'datetime' | 'json';
      nullable: boolean;
      unique: boolean;
      primary_key: boolean;
      foreign_key?: {
        table: string;
        column: string;
      };
    }[];
    indexes: {
      name: string;
      columns: string[];
      unique: boolean;
    }[];
    constraints: {
      type: 'check' | 'foreign_key' | 'unique' | 'not_null';
      definition: string;
    }[];
  };
  
  // Data statistics
  statistics: {
    row_count: number;
    column_count: number;
    file_size_bytes: number;
    null_percentage: number;        // 0.0 - 1.0
    duplicate_rows: number;
    
    column_statistics: {
      column_name: string;
      data_type: string;
      null_count: number;
      unique_count: number;
      min_value?: any;
      max_value?: any;
      mean?: number;
      median?: number;
      std_dev?: number;
      distribution?: {
        value: any;
        count: number;
                frequency: number;
      }[];
    }[];
  };
  
  // Data quality
  quality_metrics: {
    overall_quality_score: number;  // 0.0 - 1.0
    completeness: number;           // 0.0 - 1.0
    accuracy: number;               // 0.0 - 1.0
    consistency: number;            // 0.0 - 1.0
    validity: number;               // 0.0 - 1.0
    
    quality_issues: {
      issue_type: 'missing_values' | 'duplicates' | 'outliers' | 'inconsistent_format';
      severity: 'low' | 'medium' | 'high' | 'critical';
      affected_columns: string[];
      count: number;
      description: string;
    }[];
  };
  
  // Access and permissions
  access_info: {
    owner_id: string;
    visibility: 'private' | 'team' | 'public';
    permissions: {
      user_id: string;
      username: string;
      permission: 'read' | 'write' | 'admin';
    }[];
    last_accessed: string;          // ISO 8601
    access_count: number;
  };
  
  // Lineage and relationships
  lineage: {
    upstream_datasets: {
      dataset_id: string;
      dataset_name: string;
      relationship_type: 'derived_from' | 'joined_with' | 'filtered_from';
    }[];
    downstream_datasets: {
      dataset_id: string;
      dataset_name: string;
      relationship_type: 'source_for' | 'joined_in' | 'aggregated_to';
    }[];
    transformations: {
      transformation_id: string;
      transformation_type: string;
      description: string;
      applied_at: string;           // ISO 8601
    }[];
  };
  
  // Metadata
  metadata: {
    created_at: string;             // ISO 8601
    last_updated: string;           // ISO 8601
    update_frequency: 'real-time' | 'hourly' | 'daily' | 'weekly' | 'manual';
    tags: string[];
    category: string;
    business_context: string;
  };
}

interface Experiment {
  experiment_id: string;
  name: string;
  description: string;
  
  // Experiment configuration
  configuration: {
    experiment_type: 'classification' | 'regression' | 'clustering' | 'recommendation' | 'custom';
    objective: string;
    success_metrics: {
      metric_name: string;
      target_value?: number;
      optimization_direction: 'maximize' | 'minimize';
    }[];
    
    parameters: {
      parameter_name: string;
      parameter_type: 'categorical' | 'numerical' | 'boolean';
      value_range?: any[];
      default_value: any;
      current_value: any;
    }[];
  };
  
  // Experiment runs
  runs: {
    run_id: string;
    run_name: string;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    
    // Run configuration
    parameters: { [key: string]: any };
    
    // Results
    metrics: {
      metric_name: string;
      value: number;
      step?: number;
      timestamp: string;            // ISO 8601
    }[];
    
    artifacts: {
      artifact_id: string;
      artifact_type: 'model' | 'plot' | 'data' | 'log';
      file_path: string;
      file_size_bytes: number;
      description: string;
    }[];
    
    // Execution info
    execution_info: {
      started_at: string;           // ISO 8601
      ended_at?: string;            // ISO 8601
      duration_seconds?: number;
      compute_resource_id: string;
      resource_usage: {
        cpu_usage: number;          // 0.0 - 1.0
        memory_usage_mb: number;
        gpu_usage?: number;         // 0.0 - 1.0
        disk_usage_mb: number;
      };
    };
    
    // Logs and debugging
    logs: {
      timestamp: string;            // ISO 8601
      level: 'debug' | 'info' | 'warning' | 'error';
      message: string;
      source: string;
    }[];
  }[];
  
  // Best run tracking
  best_run: {
    run_id: string;
    metric_values: { [metric: string]: number };
    achieved_at: string;            // ISO 8601
  };
  
  // Collaboration
  collaboration: {
    owner_id: string;
    team_members: {
      user_id: string;
      username: string;
      role: 'owner' | 'collaborator' | 'viewer';
    }[];
    shared_artifacts: string[];     // artifact_ids
  };
  
  // Metadata
  metadata: {
    created_at: string;             // ISO 8601
    last_run: string;               // ISO 8601
    total_runs: number;
    tags: string[];
    category: string;
    framework: string;              // 'scikit-learn', 'tensorflow', 'pytorch', etc.
  };
}

interface SavedQuery {
  query_id: string;
  name: string;
  description: string;
  
  // Query definition
  query_definition: {
    query_type: 'sql' | 'visual' | 'api';
    query_content: string;
    parameters: {
      parameter_name: string;
      parameter_type: string;
      default_value: any;
      required: boolean;
    }[];
    
    // Visual query builder (if applicable)
    visual_config?: {
      tables: {
        table_name: string;
        alias?: string;
        joins: {
          target_table: string;
          join_type: 'inner' | 'left' | 'right' | 'full';
          conditions: string[];
        }[];
      }[];
      
      columns: {
        table: string;
        column: string;
        alias?: string;
        aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
      }[];
      
      filters: {
        column: string;
        operator: string;
        value: any;
        logic: 'and' | 'or';
      }[];
      
      grouping: string[];
      ordering: {
        column: string;
        direction: 'asc' | 'desc';
      }[];
    };
  };
  
  // Execution history
  execution_history: {
    execution_id: string;
    executed_at: string;            // ISO 8601
    execution_time_ms: number;
    rows_returned: number;
    success: boolean;
    error_message?: string;
    
    parameters_used: { [key: string]: any };
    
    performance_metrics: {
      cpu_time_ms: number;
      memory_usage_mb: number;
      io_operations: number;
    };
  }[];
  
  // Results caching
  cache_info: {
    cached: boolean;
    cache_key: string;
    cached_at?: string;             // ISO 8601
    cache_expiry?: string;          // ISO 8601
    cache_size_bytes?: number;
  };
  
  // Scheduling
  schedule?: {
    enabled: boolean;
    cron_expression: string;
    next_run: string;               // ISO 8601
    last_run?: string;              // ISO 8601
    notification_settings: {
      on_success: boolean;
      on_failure: boolean;
      recipients: string[];
    };
  };
  
  // Metadata
  metadata: {
    created_at: string;             // ISO 8601
    last_modified: string;          // ISO 8601
    last_executed: string;          // ISO 8601
    created_by: string;
    tags: string[];
    category: string;
    complexity_score: number;       // 0.0 - 1.0
  };
}

interface ComputeResource {
  resource_id: string;
  name: string;
  resource_type: 'cpu' | 'gpu' | 'cluster' | 'cloud';
  
  // Resource specifications
  specifications: {
    cpu_cores: number;
    memory_gb: number;
    gpu_count?: number;
    gpu_type?: string;
    storage_gb: number;
    network_bandwidth_gbps: number;
  };
  
  // Current status
  status: {
    availability: 'available' | 'busy' | 'maintenance' | 'offline';
    current_usage: {
      cpu_usage: number;            // 0.0 - 1.0
      memory_usage: number;         // 0.0 - 1.0
      gpu_usage?: number;           // 0.0 - 1.0
      storage_usage: number;        // 0.0 - 1.0
    };
    
    active_jobs: {
      job_id: string;
      job_type: string;
      user_id: string;
      started_at: string;           // ISO 8601
      estimated_completion?: string; // ISO 8601
    }[];
  };
  
  // Usage history
  usage_history: {
    date: string;                   // ISO 8601
    average_cpu_usage: number;
    average_memory_usage: number;
    average_gpu_usage?: number;
    jobs_completed: number;
    total_compute_hours: number;
  }[];
  
  // Cost information
  cost_info: {
    cost_per_hour: number;
    currency: string;
    billing_model: 'on_demand' | 'reserved' | 'spot';
    estimated_monthly_cost: number;
  };
  
  // Access control
  access_control: {
    allowed_users: string[];
    allowed_groups: string[];
    resource_limits: {
      max_concurrent_jobs: number;
      max_job_duration_hours: number;
      max_memory_per_job_gb: number;
    };
  };
}
```

## 🔌 **Required API Endpoints**

### 1. Get Workbench Dashboard
```
GET /api/workbench/dashboard
Response: WorkbenchResponse
```

### 2. Notebook Management
```
GET /api/workbench/notebooks
POST /api/workbench/notebooks
PUT /api/workbench/notebooks/{notebook_id}
DELETE /api/workbench/notebooks/{notebook_id}
```

### 3. Execute Notebook Cell
```
POST /api/workbench/notebooks/{notebook_id}/execute
Body: { cell_id: string; code: string }
Response: { outputs: any[]; execution_count: number }
```

### 4. Dataset Operations
```
GET /api/workbench/datasets
POST /api/workbench/datasets/upload
GET /api/workbench/datasets/{dataset_id}/preview
GET /api/workbench/datasets/{dataset_id}/statistics
```

### 5. Query Execution
```
POST /api/workbench/queries/execute
Body: { query: string; parameters?: object }
Response: { results: any[]; execution_time: number }
```

### 6. Experiment Tracking
```
POST /api/workbench/experiments
POST /api/workbench/experiments/{experiment_id}/runs
GET /api/workbench/experiments/{experiment_id}/runs/{run_id}/metrics
```

### 7. Compute Resource Management
```
GET /api/workbench/compute-resources
POST /api/workbench/compute-resources/{resource_id}/allocate
POST /api/workbench/compute-resources/{resource_id}/release
```

## 📊 **Data Loading Pattern**

```javascript
const Workbench = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [computeResources, setComputeResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWorkbenchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/workbench/dashboard');
      const data = await response.json();
      
      setNotebooks(data.notebooks);
      setDatasets(data.datasets);
      setExperiments(data.experiments);
      setComputeResources(data.compute_resources);
    } catch (error) {
      console.error('Failed to load workbench data:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeNotebookCell = async (notebookId, cellId, code) => {
    try {
      const response = await fetch(`/api/workbench/notebooks/${notebookId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cell_id: cellId, code })
      });
      return await response.json();
    } catch (error) {
      console.error('Cell execution failed:', error);
      throw error;
    }
  };

  const runQuery = async (query, parameters = {}) => {
    try {
      const response = await fetch('/api/workbench/queries/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, parameters })
      });
      return await response.json();
    } catch (error) {
      console.error('Query execution failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadWorkbenchData();
  }, []);
};
```

## 🎨 **Formatting Considerations**

### Resource Usage Display
```javascript
const formatResourceUsage = (usage) => ({
  percentage: Math.round(usage * 100),
  color: usage >= 0.9 ? 'text-red-600' : usage >= 0.7 ? 'text-yellow-600' : 'text-green-600',
  status: usage >= 0.9 ? 'High' : usage >= 0.7 ? 'Medium' : 'Low'
});
```

### Execution Time Formatting
```javascript
const formatExecutionTime = (milliseconds) => {
  if (milliseconds < 1000) return `${milliseconds}ms`;
  if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
  return `${(milliseconds / 60000).toFixed(1)}m`;
};
```

## ⚡ **Performance Considerations**

- **Code Execution**: Sandboxed environments for secure code execution
- **Large Dataset Handling**: Streaming and pagination for large datasets
- **Real-time Collaboration**: WebSocket for collaborative editing
- **Resource Monitoring**: Real-time compute resource usage tracking
- **Caching**: Query result caching with intelligent invalidation

## 🔒 **Security Considerations**

- **Code Sandboxing**: Secure execution environments for user code
- **Resource Limits**: Per-user compute and storage quotas
- **Data Access Control**: Fine-grained permissions for datasets
- **Audit Logging**: All code executions and data access logged
- **Network Isolation**: Isolated network access for compute resources

This specification provides a comprehensive development environment for data exploration, experimentation, and prototyping within Affinity Explorer.
