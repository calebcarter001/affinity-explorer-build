# Affinity Library View - Data Model Specification

## 📋 **Overview**

The Affinity Library is a comprehensive browsing and management interface for property affinities. It allows users to explore, search, filter, and manage property affinity data with detailed scoring, categorization, and collection management capabilities.

## 🎯 **View Components**

1. **Search & Filter Bar**: Real-time search with advanced filtering options
2. **Affinity Cards Grid**: Visual cards showing affinity details and scores
3. **Category Navigation**: Browse by affinity categories and types
4. **Collection Management**: Create, manage, and organize affinity collections
5. **Sorting Controls**: Sort by score, date, popularity, relevance
6. **Detail Modal**: Detailed view of individual affinities
7. **Bulk Actions**: Select and perform actions on multiple affinities

## 🗃️ **Complete Data Model**

### Primary API Endpoint
```
GET /api/affinities/library
```

### Response Schema
```typescript
interface AffinityLibraryResponse {
  affinities: AffinityItem[];
  categories: AffinityCategory[];
  collections: AffinityCollection[];
  filters: FilterOptions;
  pagination: PaginationInfo;
  search_metadata: SearchMetadata;
  user_preferences: UserPreferences;
  metadata: LibraryMetadata;
}
```

### Affinity Item Schema
```typescript
interface AffinityItem {
  affinity_id: string;
  name: string;
  display_name: string;
  description: string;
  category: string;
  subcategory?: string;
  
  // Scoring information
  affinity_score: {
    overall_score: number;          // 0.0 - 1.0
    confidence: number;             // 0.0 - 1.0
    quality_rating: 'excellent' | 'good' | 'fair' | 'poor';
    score_breakdown: {
      relevance: number;            // 0.0 - 1.0
      popularity: number;           // 0.0 - 1.0
      uniqueness: number;           // 0.0 - 1.0
      accessibility: number;        // 0.0 - 1.0
    };
  };
  
  // Property associations
  property_associations: {
    total_properties: number;
    high_scoring_properties: number; // Score >= 0.8
    property_types: string[];        // e.g., ["hotel", "resort", "villa"]
    destinations: string[];          // Associated destinations
  };
  
  // Content and media
  content: {
    short_description: string;
    detailed_description: string;
    key_features: string[];
    benefits: string[];
    considerations: string[];
    best_for: string[];             // Target audience
  };
  
  media: {
    thumbnail_url?: string;
    images: {
      url: string;
      alt_text: string;
      caption?: string;
    }[];
    videos?: {
      url: string;
      thumbnail_url: string;
      duration_seconds: number;
    }[];
  };
  
  // Metadata and analytics
  analytics: {
    view_count: number;
    bookmark_count: number;
    usage_in_collections: number;
    popularity_rank: number;
    trending_score: number;         // 0.0 - 1.0
  };
  
  // Tagging and classification
  tags: {
    system_tags: string[];          // Auto-generated tags
    user_tags: string[];            // User-added tags
    semantic_tags: string[];        // AI-generated semantic tags
  };
  
  // Temporal information
  seasonality: {
    best_seasons: string[];
    seasonal_variations: {
      [season: string]: {
        relevance_score: number;    // 0.0 - 1.0
        availability: boolean;
        notes: string;
      };
    };
  };
  
  // User interaction
  user_interaction: {
    is_bookmarked: boolean;
    user_rating?: number;           // 1-5 stars
    user_notes?: string;
    last_viewed?: string;           // ISO 8601
    in_collections: string[];       // Collection IDs
  };
  
  // Processing metadata
  processing_info: {
    created_at: string;             // ISO 8601
    last_updated: string;           // ISO 8601
    data_sources: string[];
    validation_status: 'verified' | 'pending' | 'disputed';
    quality_checks_passed: boolean;
    generated_by: 'ai' | 'human' | 'hybrid';
  };
  
  // Related affinities
  related_affinities: {
    affinity_id: string;
    name: string;
    similarity_score: number;       // 0.0 - 1.0
    relationship_type: 'similar' | 'complementary' | 'alternative';
  }[];
}
```

### Affinity Category Schema
```typescript
interface AffinityCategory {
  category_id: string;
  name: string;
  display_name: string;
  description: string;
  icon: string;                     // Icon identifier
  color: string;                    // Hex color code
  
  // Hierarchy
  parent_category?: string;
  subcategories: {
    subcategory_id: string;
    name: string;
    affinity_count: number;
  }[];
  
  // Statistics
  stats: {
    total_affinities: number;
    average_score: number;          // 0.0 - 1.0
    popular_affinities: string[];   // Top affinity IDs
    trending_affinities: string[];  // Currently trending
  };
  
  // Filtering and sorting
  default_sort: 'score' | 'popularity' | 'alphabetical' | 'recent';
  available_filters: string[];      // Available filter types for this category
  
  // Display preferences
  display_options: {
    default_view: 'grid' | 'list' | 'compact';
    cards_per_row: number;
    show_scores: boolean;
    show_thumbnails: boolean;
  };
}
```

### Affinity Collection Schema
```typescript
interface AffinityCollection {
  collection_id: string;
  name: string;
  description: string;
  
  // Ownership and sharing
  owner_id: string;
  visibility: 'private' | 'shared' | 'public';
  collaborators: {
    user_id: string;
    username: string;
    permission: 'view' | 'edit' | 'admin';
  }[];
  
  // Collection content
  affinities: {
    affinity_id: string;
    added_at: string;               // ISO 8601
    added_by: string;               // User ID
    notes?: string;
    custom_order?: number;
  }[];
  
  // Collection metadata
  metadata: {
    created_at: string;             // ISO 8601
    last_modified: string;          // ISO 8601
    total_items: number;
    average_score: number;          // 0.0 - 1.0
    categories_represented: string[];
    tags: string[];
  };
  
  // Analytics
  analytics: {
    view_count: number;
    fork_count: number;             // How many times copied
    like_count: number;
    usage_frequency: number;        // How often accessed
  };
  
  // Display settings
  display_settings: {
    sort_order: 'custom' | 'score' | 'alphabetical' | 'date_added';
    view_mode: 'grid' | 'list';
    show_scores: boolean;
    show_descriptions: boolean;
  };
}
```

### Filter Options Schema
```typescript
interface FilterOptions {
  categories: {
    category_id: string;
    name: string;
    count: number;                  // Number of affinities in this category
  }[];
  
  score_ranges: {
    range_id: string;
    label: string;                  // e.g., "Excellent (90-100%)"
    min_score: number;              // 0.0 - 1.0
    max_score: number;              // 0.0 - 1.0
    count: number;
  }[];
  
  property_types: {
    type: string;
    label: string;
    count: number;
  }[];
  
  destinations: {
    destination_id: string;
    name: string;
    count: number;
  }[];
  
  tags: {
    tag: string;
    count: number;
    type: 'system' | 'user' | 'semantic';
  }[];
  
  seasons: {
    season: string;
    count: number;
  }[];
  
  validation_status: {
    status: 'verified' | 'pending' | 'disputed';
    count: number;
  }[];
  
  date_ranges: {
    range_id: string;
    label: string;                  // e.g., "Last 30 days"
    start_date: string;             // ISO 8601
    end_date: string;               // ISO 8601
    count: number;
  }[];
}
```

### Search Metadata Schema
```typescript
interface SearchMetadata {
  query: string;
  total_results: number;
  search_time_ms: number;
  applied_filters: {
    filter_type: string;
    filter_values: string[];
  }[];
  
  // Search suggestions
  suggestions: {
    type: 'spelling' | 'alternative' | 'related';
    suggestion: string;
    confidence: number;             // 0.0 - 1.0
  }[];
  
  // Search analytics
  search_analytics: {
    popular_searches: string[];
    related_searches: string[];
    trending_searches: string[];
  };
  
  // Faceted search results
  facets: {
    facet_name: string;
    values: {
      value: string;
      count: number;
      selected: boolean;
    }[];
  }[];
}
```

### User Preferences Schema
```typescript
interface UserPreferences {
  view_preferences: {
    default_view: 'grid' | 'list' | 'compact';
    items_per_page: number;
    default_sort: 'relevance' | 'score' | 'popularity' | 'alphabetical' | 'recent';
    show_scores: boolean;
    show_thumbnails: boolean;
    show_descriptions: boolean;
  };
  
  filter_preferences: {
    saved_filters: {
      filter_id: string;
      name: string;
      filters: { [key: string]: any };
      is_default: boolean;
    }[];
    auto_apply_filters: boolean;
    remember_last_filters: boolean;
  };
  
  notification_preferences: {
    new_affinities: boolean;
    score_updates: boolean;
    collection_updates: boolean;
    trending_alerts: boolean;
  };
  
  privacy_preferences: {
    show_activity: boolean;
    allow_collection_sharing: boolean;
    data_usage_consent: boolean;
  };
}
```

### Library Metadata Schema
```typescript
interface LibraryMetadata {
  generated_at: string;             // ISO 8601
  cache_status: 'hit' | 'miss' | 'partial';
  total_affinities_in_system: number;
  last_data_update: string;         // ISO 8601
  
  // Performance metrics
  query_performance: {
    database_query_time_ms: number;
    search_index_time_ms: number;
    total_response_time_ms: number;
  };
  
  // Data freshness
  data_freshness: {
    newest_affinity: string;        // ISO 8601
    oldest_affinity: string;        // ISO 8601
    average_age_days: number;
    stale_data_count: number;
  };
  
  // User context
  user_context: {
    user_id: string;
    session_id: string;
    request_id: string;
    user_timezone: string;
    user_locale: string;
  };
}
```

## 🔌 **Required API Endpoints**

### 1. Get Affinity Library
```
GET /api/affinities/library?page={page}&limit={limit}&category={category}&sort={sort}&q={query}
Response: AffinityLibraryResponse
```

### 2. Search Affinities
```
GET /api/affinities/search?q={query}&filters={filters}&facets={facets}
Response: {
  results: AffinityItem[];
  metadata: SearchMetadata;
  pagination: PaginationInfo;
}
```

### 3. Get Affinity Details
```
GET /api/affinities/{affinity_id}
Response: AffinityItem
```

### 4. Create Collection
```
POST /api/affinities/collections
Body: {
  name: string;
  description: string;
  visibility: 'private' | 'shared' | 'public';
  affinity_ids?: string[];
}
Response: AffinityCollection
```

### 5. Add to Collection
```
POST /api/affinities/collections/{collection_id}/items
Body: {
  affinity_ids: string[];
  notes?: string;
}
Response: { success: boolean; added_count: number }
```

### 6. Update User Preferences
```
PUT /api/affinities/preferences
Body: Partial<UserPreferences>
Response: { success: boolean; updated_preferences: UserPreferences }
```

### 7. Bookmark Affinity
```
POST /api/affinities/{affinity_id}/bookmark
Response: { success: boolean; is_bookmarked: boolean }
```

### 8. Rate Affinity
```
POST /api/affinities/{affinity_id}/rating
Body: { rating: number; review?: string }
Response: { success: boolean; average_rating: number }
```

## 📊 **Data Loading Pattern**

### Frontend Implementation
```javascript
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

const AffinityLibrary = () => {
  const [affinities, setAffinities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 24 });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query, currentFilters) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          ...currentFilters
        });
        
        const response = await fetch(`/api/affinities/library?${params}`);
        const data = await response.json();
        
        setAffinities(data.affinities);
        setCategories(data.categories);
        setCollections(data.collections);
      } catch (error) {
        console.error('Failed to load affinities:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [pagination]
  );

  // Load data when search or filters change
  useEffect(() => {
    debouncedSearch(searchQuery, filters);
  }, [searchQuery, filters, debouncedSearch]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
};
```

### Backend Data Processing
```python
async def get_affinity_library(
    page: int = 1,
    limit: int = 24,
    category: str = None,
    sort: str = 'relevance',
    query: str = None,
    filters: dict = None,
    user_id: str = None
) -> AffinityLibraryResponse:
    
    # Build search query
    search_params = {
        'page': page,
        'limit': limit,
        'sort': sort
    }
    
    if query:
        search_params['q'] = query
    if category:
        search_params['category'] = category
    if filters:
        search_params.update(filters)
    
    # Execute search with user context
    search_results = await search_affinities(search_params, user_id)
    
    # Load additional data in parallel
    categories, collections, user_prefs = await asyncio.gather(
        get_affinity_categories(),
        get_user_collections(user_id) if user_id else [],
        get_user_preferences(user_id) if user_id else get_default_preferences()
    )
    
    # Generate filter options based on current results
    filter_options = await generate_filter_options(search_results, user_id)
    
    return AffinityLibraryResponse(
        affinities=search_results.items,
        categories=categories,
        collections=collections,
        filters=filter_options,
        pagination=search_results.pagination,
        search_metadata=search_results.metadata,
        user_preferences=user_prefs,
        metadata=generate_library_metadata()
    )
```

## 🎨 **Formatting Considerations**

### 1. Score Display
```javascript
const formatAffinityScore = (score) => {
  const percentage = Math.round(score * 100);
  const color = percentage >= 90 ? 'text-green-600' :
                percentage >= 80 ? 'text-blue-600' :
                percentage >= 70 ? 'text-yellow-600' : 'text-red-600';
  
  return { percentage, color };
};
```

### 2. Category Colors
```javascript
const getCategoryColor = (category) => {
  const colors = {
    'cultural': 'bg-purple-100 text-purple-800',
    'adventure': 'bg-green-100 text-green-800',
    'relaxation': 'bg-blue-100 text-blue-800',
    'culinary': 'bg-orange-100 text-orange-800',
    'nature': 'bg-emerald-100 text-emerald-800',
    'urban': 'bg-gray-100 text-gray-800'
  };
  return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
};
```

### 3. Responsive Grid Layout
```css
.affinity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .affinity-grid {
    grid-template-columns: 1fr;
  }
}
```

## ⚡ **Performance Considerations**

### 1. Search Optimization
- **Elasticsearch**: Full-text search with faceted filtering
- **Debounced Search**: 300ms delay to reduce API calls
- **Search Suggestions**: Autocomplete with caching
- **Index Optimization**: Optimized search indices for common queries

### 2. Caching Strategy
- **Search Results**: 5-minute cache for popular queries
- **Categories**: 30-minute cache with invalidation
- **User Preferences**: Session-based caching
- **Images**: CDN caching with lazy loading

### 3. Pagination and Loading
- **Virtual Scrolling**: For large result sets
- **Infinite Scroll**: Optional progressive loading
- **Skeleton Loading**: Placeholder cards while loading
- **Image Lazy Loading**: Load images as they enter viewport

### 4. Data Optimization
- **Selective Loading**: Load only required fields for list view
- **Batch Operations**: Bulk bookmark/collection operations
- **Compressed Responses**: Gzip compression for large datasets

## 🔒 **Security Considerations**

### 1. Data Privacy
- Filter sensitive affinities based on user permissions
- Anonymize user activity data in analytics
- Secure collection sharing with proper access controls

### 2. Rate Limiting
- Search API: 60 requests/minute per user
- Collection operations: 30 requests/minute per user
- Bookmark operations: 120 requests/minute per user

### 3. Input Validation
- Sanitize search queries for XSS prevention
- Validate filter parameters
- Limit collection sizes and names

## 🧪 **Testing Requirements**

### 1. Search Testing
- Test search accuracy and relevance
- Validate filter combinations
- Test performance with large datasets

### 2. User Experience Testing
- Test responsive design across devices
- Validate accessibility compliance
- Test collection management workflows

### 3. Performance Testing
- Load testing with 1000+ concurrent searches
- Search response time < 200ms
- Image loading optimization testing

This comprehensive specification ensures the Affinity Library provides a powerful, user-friendly interface for browsing and managing the extensive affinity data in Affinity Explorer.
