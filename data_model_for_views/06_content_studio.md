# Content Studio View - Data Model Specification

## 📋 **Overview**

Content Studio is a comprehensive content management and creation interface for generating, editing, and managing destination content, property descriptions, and marketing materials using AI-powered tools and collaborative workflows.

## 🎯 **Navigation & Location**
- **File**: `/src/components/tabs/ContentStudio.jsx`
- **Route**: `/content-studio`
- **Navigation**: Position 7 in sidebar (after Sentiment Insights)
- **Icon**: `FiEdit3` (Edit icon)
- **Permissions**: Requires 'read' permission
- **Feature Flag**: `CONTENT_STUDIO_ENABLED` (conditionally displayed)

## 🎯 **View Components**

1. **Content Library**: Browse and manage all content assets
2. **AI Content Generator**: Create content using LLM assistance
3. **Content Editor**: Rich text editor with collaboration features
4. **Template Manager**: Reusable content templates
5. **Approval Workflow**: Content review and approval process
6. **Publishing Pipeline**: Content distribution and scheduling
7. **Analytics Dashboard**: Content performance metrics

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/content-studio/dashboard
```

### Response Schema
```typescript
interface ContentStudioResponse {
  content_library: ContentItem[];
  templates: ContentTemplate[];
  workflows: WorkflowStatus[];
  analytics: ContentAnalytics;
  user_permissions: UserPermissions;
  ai_tools: AIToolsConfig;
  metadata: ContentStudioMetadata;
}

interface ContentItem {
  content_id: string;
  title: string;
  content_type: 'destination_guide' | 'property_description' | 'marketing_copy' | 'blog_post' | 'social_media';
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  
  content_data: {
    body: string;                    // Rich text content
    excerpt?: string;
    meta_description?: string;
    keywords: string[];
    language: string;
    word_count: number;
  };
  
  target_info: {
    destination?: string;
    property_id?: string;
    audience: 'general' | 'luxury' | 'budget' | 'family' | 'business';
    tone: 'professional' | 'casual' | 'luxury' | 'adventurous';
  };
  
  media_assets: {
    images: {
      asset_id: string;
      url: string;
      alt_text: string;
      caption?: string;
      usage_rights: 'owned' | 'licensed' | 'creative_commons';
    }[];
    videos?: {
      asset_id: string;
      url: string;
      thumbnail_url: string;
      duration_seconds: number;
    }[];
  };
  
  collaboration: {
    author_id: string;
    author_name: string;
    contributors: {
      user_id: string;
      username: string;
      role: 'writer' | 'editor' | 'reviewer' | 'approver';
      last_contribution: string;    // ISO 8601
    }[];
    comments: {
      comment_id: string;
      user_id: string;
      username: string;
      content: string;
      timestamp: string;            // ISO 8601
      resolved: boolean;
    }[];
  };
  
  workflow: {
    current_stage: string;
    assigned_to?: string;
    due_date?: string;              // ISO 8601
    approval_history: {
      stage: string;
      approver_id: string;
      approver_name: string;
      decision: 'approved' | 'rejected' | 'needs_revision';
      feedback?: string;
      timestamp: string;            // ISO 8601
    }[];
  };
  
  publishing: {
    channels: {
      channel: 'website' | 'social_media' | 'email' | 'print';
      status: 'scheduled' | 'published' | 'failed';
      scheduled_date?: string;      // ISO 8601
      published_date?: string;      // ISO 8601
      url?: string;
    }[];
    seo_optimization: {
      title_tag: string;
      meta_description: string;
      canonical_url?: string;
      schema_markup?: object;
    };
  };
  
  analytics: {
    views: number;
    engagement_rate: number;        // 0.0 - 1.0
    conversion_rate: number;        // 0.0 - 1.0
    social_shares: number;
    performance_score: number;      // 0.0 - 1.0
  };
  
  ai_assistance: {
    generated_by_ai: boolean;
    ai_model_used?: string;
    human_edited: boolean;
    ai_suggestions: {
      suggestion_id: string;
      type: 'improvement' | 'seo' | 'tone' | 'structure';
      content: string;
      confidence: number;           // 0.0 - 1.0
      applied: boolean;
    }[];
  };
  
  version_control: {
    version: string;
    created_at: string;             // ISO 8601
    last_modified: string;          // ISO 8601
    revision_history: {
      version: string;
      author_id: string;
      changes_summary: string;
      timestamp: string;            // ISO 8601
    }[];
  };
}

interface ContentTemplate {
  template_id: string;
  name: string;
  description: string;
  content_type: string;
  
  template_structure: {
    sections: {
      section_id: string;
      name: string;
      type: 'text' | 'image' | 'list' | 'table' | 'custom';
      required: boolean;
      placeholder_text?: string;
      formatting_rules?: string[];
    }[];
    variables: {
      variable_name: string;
      type: 'text' | 'number' | 'date' | 'selection';
      options?: string[];           // For selection type
      default_value?: any;
    }[];
  };
  
  usage_stats: {
    times_used: number;
    success_rate: number;           // 0.0 - 1.0
    average_completion_time: number; // minutes
  };
  
  metadata: {
    created_by: string;
    created_at: string;             // ISO 8601
    last_updated: string;           // ISO 8601
    tags: string[];
    category: string;
  };
}

interface WorkflowStatus {
  workflow_id: string;
  name: string;
  description: string;
  
  stages: {
    stage_id: string;
    name: string;
    order: number;
    required_roles: string[];
    auto_advance: boolean;
    sla_hours?: number;
  }[];
  
  active_items: {
    content_id: string;
    title: string;
    current_stage: string;
    assigned_to: string;
    due_date?: string;              // ISO 8601
    overdue: boolean;
  }[];
  
  performance_metrics: {
    average_completion_time: number; // hours
    bottleneck_stages: string[];
    approval_rate: number;          // 0.0 - 1.0
    revision_rate: number;          // 0.0 - 1.0
  };
}

interface ContentAnalytics {
  overview: {
    total_content_items: number;
    published_this_month: number;
    pending_approval: number;
    top_performing_content: string[]; // content_ids
  };
  
  performance_metrics: {
    average_engagement: number;     // 0.0 - 1.0
    conversion_rates: {
      content_type: string;
      rate: number;                 // 0.0 - 1.0
    }[];
    traffic_sources: {
      source: string;
      percentage: number;           // 0.0 - 1.0
    }[];
  };
  
  content_insights: {
    trending_topics: string[];
    optimal_posting_times: {
      day_of_week: string;
      hour: number;
      engagement_multiplier: number;
    }[];
    audience_preferences: {
      content_type: string;
      preference_score: number;     // 0.0 - 1.0
    }[];
  };
}

interface AIToolsConfig {
  available_models: {
    model_id: string;
    name: string;
    description: string;
    capabilities: string[];
    cost_per_request: number;
    response_time_ms: number;
  }[];
  
  content_generation: {
    max_words: number;
    supported_languages: string[];
    tone_options: string[];
    style_presets: {
      preset_id: string;
      name: string;
      description: string;
      parameters: object;
    }[];
  };
  
  optimization_tools: {
    seo_analyzer: boolean;
    readability_checker: boolean;
    plagiarism_detector: boolean;
    sentiment_analyzer: boolean;
    keyword_suggester: boolean;
  };
  
  usage_limits: {
    requests_per_hour: number;
    words_per_day: number;
    current_usage: {
      requests_used: number;
      words_used: number;
      reset_time: string;           // ISO 8601
    };
  };
}
```

## 🔌 **Required API Endpoints**

### 1. Get Content Studio Dashboard
```
GET /api/content-studio/dashboard
Response: ContentStudioResponse
```

### 2. Create Content Item
```
POST /api/content-studio/content
Body: Partial<ContentItem>
Response: ContentItem
```

### 3. Generate AI Content
```
POST /api/content-studio/ai-generate
Body: {
  content_type: string;
  prompt: string;
  target_info: object;
  model_preferences?: object;
}
Response: { generated_content: string; suggestions: string[] }
```

### 4. Update Content
```
PUT /api/content-studio/content/{content_id}
Body: Partial<ContentItem>
Response: ContentItem
```

### 5. Submit for Approval
```
POST /api/content-studio/content/{content_id}/submit
Response: { workflow_status: WorkflowStatus }
```

### 6. Publish Content
```
POST /api/content-studio/content/{content_id}/publish
Body: { channels: string[]; schedule_date?: string }
Response: { publishing_status: object }
```

### 7. Get Content Analytics
```
GET /api/content-studio/analytics?period={period}&content_type={type}
Response: ContentAnalytics
```

### 8. Manage Templates
```
GET /api/content-studio/templates
POST /api/content-studio/templates
PUT /api/content-studio/templates/{template_id}
DELETE /api/content-studio/templates/{template_id}
```

## 📊 **Data Loading Pattern**

```javascript
const ContentStudio = () => {
  const [contentItems, setContentItems] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadContentStudio = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content-studio/dashboard');
      const data = await response.json();
      
      setContentItems(data.content_library);
      setTemplates(data.templates);
      setWorkflows(data.workflows);
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Failed to load content studio:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIContent = async (prompt, contentType, targetInfo) => {
    try {
      const response = await fetch('/api/content-studio/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          content_type: contentType,
          target_info: targetInfo
        })
      });
      return await response.json();
    } catch (error) {
      console.error('AI content generation failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadContentStudio();
  }, []);
};
```

## 🎨 **Formatting Considerations**

### Content Status Colors
```javascript
const getStatusColor = (status) => ({
  'draft': 'bg-gray-100 text-gray-800',
  'review': 'bg-yellow-100 text-yellow-800',
  'approved': 'bg-green-100 text-green-800',
  'published': 'bg-blue-100 text-blue-800',
  'archived': 'bg-red-100 text-red-800'
});
```

### Performance Metrics Display
```javascript
const formatPerformanceScore = (score) => ({
  percentage: Math.round(score * 100),
  grade: score >= 0.9 ? 'A' : score >= 0.8 ? 'B' : score >= 0.7 ? 'C' : 'D',
  color: score >= 0.8 ? 'text-green-600' : score >= 0.6 ? 'text-yellow-600' : 'text-red-600'
});
```

## ⚡ **Performance Considerations**

- **Rich Text Editor**: Optimized for large documents
- **Auto-save**: Save drafts every 30 seconds
- **Image Optimization**: Compress and resize uploaded images
- **Collaborative Editing**: Real-time synchronization via WebSocket
- **AI Request Batching**: Batch multiple AI requests for efficiency

## 🔒 **Security Considerations**

- **Role-based Access**: Content creation, editing, and approval permissions
- **Content Sanitization**: XSS prevention in rich text content
- **Media Upload Security**: File type validation and virus scanning
- **API Rate Limiting**: AI generation limits per user/organization
- **Version Control**: Audit trail for all content changes

This specification enables comprehensive content management with AI assistance, collaborative workflows, and performance analytics.
