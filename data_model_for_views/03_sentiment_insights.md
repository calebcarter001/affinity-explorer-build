# Sentiment Insights View - Data Model Specification

## Overview
The Sentiment Insights view provides comprehensive sentiment analysis and intelligence for Product, TextAPI, and CX teams. It offers actionable insights into customer sentiment patterns, concept tracking, property-level analysis, and model performance metrics across multiple dimensions.

## Component Location
- **File**: `/src/components/tabs/SentimentInsights.jsx`
- **Route**: `/sentiment-insights`
- **Navigation**: Position 6 in sidebar (after Last Mile Insights)
- **Icon**: `FiHeart` (Heart icon representing sentiment)

## Data Structure

### Primary Data Model
```javascript
const sentimentData = {
  overallSentiment: {
    index: number,          // Overall sentiment score (-1 to 1)
    target: number,         // Target sentiment threshold
    change: string          // Change indicator (e.g., "+0.12")
  },
  topPositiveConcept: {
    name: string,           // Name of top positive concept
    impact: string,         // Impact score (e.g., "+0.42")
    trend: string           // Trend direction
  },
  topNegativeConcept: {
    name: string,           // Name of top negative concept
    impact: string,         // Impact score (e.g., "-0.25")
    trend: string           // Trend direction
  },
  reviewCoverage: {
    percentage: number,     // Coverage percentage (0-100)
    impact: string          // Impact description
  },
  dataFreshness: {
    days: number,           // Days since last update
    alert: string           // Alert threshold description
  },
  propertyLevelConcepts: [
    {
      name: string,         // Concept name
      volume: string,       // Volume change description
      polarity: string,     // Polarity score description
      action: string,       // Recommended action
      type: string          // "positive" | "negative" | "neutral"
    }
  ],
  conceptLibrary: {
    positive: [
      {
        name: string,       // Concept name
        volume: number,     // Volume count
        impact: number,     // Impact score
        change: string,     // Change indicator
        trend: string       // Trend direction
      }
    ],
    negative: [...],        // Same structure as positive
    neutral: [...],         // Same structure as positive
    new: [...]              // Same structure as positive
  },
  sentimentPatterns: {
    conceptsPresent: string,    // Coverage description
    colorCodes: [string]        // Array of hex color codes
  },
  sentimentTrends: {
    data: [
      {
        month: string,      // Month abbreviation
        sentiment: number   // Sentiment score for that month
      }
    ]
  },
  propertyAspectBreakdown: [
    {
      aspect: string,       // Aspect name (e.g., "Cleanliness")
      score: number,        // Aspect score (0-1)
      impact: number        // Impact score (0-1)
    }
  ],
  explainabilityTraceability: {
    reviewsMapped: number,      // Percentage of reviews mapped
    propertyInsight: string     // Description of available insights
  },
  modelCoverage: {
    affinityNLP: {
      categories: number,   // Number of categories
      lastTrain: string,    // Last training date
      precision: number,    // Precision score
      recall: number        // Recall score
    },
    xmDiscover: {
      categories: number,   // Number of categories
      lastTrain: string,    // Last training date
      precision: number,    // Precision score
      recall: number        // Recall score
    }
  }
}
```

### Mock Data Implementation
The component uses comprehensive mock data that simulates real sentiment analysis metrics:

```javascript
const mockSentimentData = {
  overallSentiment: {
    index: -0.41,
    target: -0.25,
    change: '+0.12'
  },
  topPositiveConcept: {
    name: 'Room Quality',
    impact: '+0.42',
    trend: 'positive'
  },
  topNegativeConcept: {
    name: 'Wi-Fi Issues',
    impact: '-0.25',
    trend: 'negative'
  },
  // ... additional mock data
};
```

## UI Components

### 1. Header Section
- **Gradient Background**: Blue to purple gradient
- **Title**: "Sentiment Insights"
- **Subtitle**: "Actionable sentiment intelligence for Product, TextAPI, and CX teams"
- **Controls**: Destination selector, Season selector, Export options dropdown

### 2. Level Tabs
Three analysis levels with tab-based navigation:
- **Property Level**: Property-specific sentiment analysis
- **Destination Level**: Destination-wide sentiment patterns
- **Marketplace Level**: Market-wide sentiment intelligence

### 3. Top Metrics Row
Five key performance indicators:

#### Overall Sentiment Index
- **Display**: Large sentiment score with target comparison
- **Trend**: Change indicator with color coding
- **Icon**: Chart line icon

#### Top Positive Concept
- **Display**: Concept name with impact score
- **Color**: Green for positive sentiment
- **Icon**: Thumbs up icon

#### Top Negative Concept
- **Display**: Concept name with impact score
- **Color**: Red for negative sentiment
- **Icon**: Thumbs down icon

#### Review Coverage
- **Display**: Percentage with impact description
- **Color**: Blue for informational
- **Icon**: Eye icon

#### Data Freshness
- **Display**: Days since update with alert threshold
- **Color**: Green for fresh data
- **Icon**: Calendar icon

### 4. Main Content Grid

#### Property-Level New Concepts Card
- **Layout**: Vertical list of concept cards
- **Content**: Concept name, volume change, polarity, recommended action
- **Color Coding**: Border colors based on sentiment type
- **Actions**: Contextual action buttons

#### Property Concept Library Card
- **Tabs**: Positive, Negative, Neutral, New
- **Content**: Concept details with volume and impact metrics
- **Trends**: Visual trend indicators
- **Filtering**: Tab-based concept categorization

### 5. Secondary Content Grid

#### Property Sentiment Patterns
- **Visualization**: Color-coded pattern indicators
- **Coverage**: Percentage of properties with concepts
- **Colors**: Semantic color palette for different sentiment types

#### Property Sentiment Trends
- **Chart**: Bar chart showing sentiment over time
- **Timeline**: Monthly sentiment progression
- **Visualization**: Height-based sentiment representation

#### Export Options Panel
- **CSV Export**: Download structured data
- **JSON Export**: Download JSON format
- **cURL Command**: Copy API command
- **Styling**: Action buttons with distinct colors

### 6. Property Aspect Breakdown
- **Layout**: Horizontal bar charts
- **Aspects**: Cleanliness, Service, Location, Value, Comfort, Amenities
- **Metrics**: Score and impact values
- **Visualization**: Gradient progress bars with embedded impact scores

### 7. Bottom Information Cards

#### Explainability & Traceability
- **Metric**: Percentage of reviews mapped to taxonomy
- **Preview**: JSON structure preview
- **Action**: Copy functionality for data access

#### Model Coverage
- **Models**: Affinity NLP and XM Discover
- **Metrics**: Categories, last training date, precision, recall
- **Performance**: Model comparison and performance indicators

## Visual Design System

### Color Palette
- **Primary Blue**: `#3B82F6` - Main interface elements
- **Purple**: `#8B5CF6` - Secondary actions and advanced features
- **Green**: `#10B981` - Positive sentiment and success states
- **Red**: `#EF4444` - Negative sentiment and alerts
- **Yellow**: `#F59E0B` - Warnings and neutral states
- **Gray**: `#6B7280` - Text and secondary elements

### Typography
- **Headers**: Bold, large text for section titles
- **Metrics**: Extra-large, bold numbers for key values
- **Labels**: Medium weight for data labels
- **Descriptions**: Regular weight for explanatory text

### Layout System
- **Responsive Grid**: CSS Grid with breakpoint-aware columns
- **Card Design**: Consistent white backgrounds with subtle shadows
- **Spacing**: 6-unit gap system for consistent spacing
- **Borders**: Subtle borders and rounded corners

## State Management

### Loading States
- **Initial Load**: Centered spinner with 1-second delay
- **Data Refresh**: Maintains UI structure during updates
- **Error Handling**: Graceful fallback for data loading failures

### Interactive States
- **Tab Selection**: Active state management for level tabs
- **Dropdown Controls**: Destination and season selection
- **Export Actions**: Button states for download operations

### Data Filtering
- **Destination Filter**: Dynamic data loading based on selection
- **Season Filter**: Seasonal sentiment analysis
- **Level Filter**: Property/Destination/Marketplace view switching

## Integration Points

### Navigation
- **Sidebar Position**: After Last Mile Insights
- **Route**: `/sentiment-insights`
- **Permissions**: Requires 'read' permission
- **Icon**: Heart icon representing sentiment analysis

### Data Sources
- **Current**: Comprehensive mock data implementation
- **Future**: Integration with sentiment analysis APIs
- **Caching**: Component-level state management with refresh capability

### Export Functionality
- **CSV Export**: Structured data download
- **JSON Export**: Raw data format
- **API Integration**: cURL command generation
- **Webhook Support**: Real-time sentiment alerts

## Performance Considerations

### Optimization
- **Lazy Loading**: Component is lazy-loaded for better performance
- **Data Virtualization**: Efficient rendering of large concept lists
- **Memoization**: Optimized re-rendering for complex calculations

### Accessibility
- **Color Contrast**: WCAG AA compliant color combinations
- **Screen Readers**: Semantic HTML with proper ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility support

## Testing Strategy

### Unit Tests
- **Component Rendering**: Snapshot testing for UI consistency
- **Data Processing**: Sentiment calculation and aggregation functions
- **State Management**: Loading, error, and interaction states

### Integration Tests
- **Navigation**: Route accessibility and permission handling
- **Data Flow**: Mock data integration and state updates
- **Export Functions**: Download and copy operations

### Performance Tests
- **Load Time**: Component initialization and data loading
- **Memory Usage**: Efficient state management
- **Bundle Size**: Code splitting and lazy loading effectiveness

## Future Enhancements

### Real-time Features
- **Live Updates**: WebSocket integration for real-time sentiment changes
- **Streaming Data**: Continuous sentiment monitoring
- **Alerts**: Threshold-based notifications for sentiment changes

### Advanced Analytics
- **Predictive Insights**: Sentiment trend forecasting
- **Comparative Analysis**: Period-over-period sentiment comparison
- **Drill-down Capabilities**: Detailed concept and property analysis

### Machine Learning Integration
- **Model Performance**: Real-time model accuracy monitoring
- **A/B Testing**: Sentiment model comparison and optimization
- **Automated Insights**: AI-generated sentiment recommendations

### Export Enhancements
- **Scheduled Reports**: Automated sentiment report generation
- **Custom Formats**: Additional export formats (PDF, Excel)
- **API Integration**: Direct integration with external analytics platforms

This comprehensive sentiment insights view provides teams with deep visibility into customer sentiment patterns, enabling data-driven decision making for product improvements, content optimization, and customer experience enhancement.
