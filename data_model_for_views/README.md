# Data Model Specifications for Affinity Explorer Views

This directory contains comprehensive data model specifications for all views in the Affinity Explorer application. Each specification documents the data structures, API requirements, UI components, and implementation details needed to power the respective views.

## 📋 **Overview**

The data models have been updated to reflect the current implementation state, including:
- **Unique affinity scorecard values** across 25 total affinities (17 JSON-defined + 8 mock)
- **7-dimension scorecard architecture** with traveler-centric questions
- **Comprehensive affinity configuration** with 17 template affinities
- **Updated navigation positions** reflecting the current sidebar order
- **Enhanced data structures** for sentiment analysis, last-mile insights, and content management

## 🗂️ **File Inventory & Navigation Order**

### Core Analytics Views
1. **[Dashboard](./01_dashboard.md)** - `/` - Central performance overview
2. **[Affinity Library](./02_affinity_library.md)** - `/affinities` - Affinity browsing and management
3. **[Property Affinity Scores](./03_property_affinity_scores.md)** - `/scoring` - Property-level scoring
4. **[Destination Insights](./04_destination_insights.md)** - `/destination-insights` - Destination analytics

### Specialized Insight Views
5. **[Last Mile View](./05_last_mile_view.md)** - `/last-mile` - Transportation & accessibility insights
6. **[Sentiment Insights](./03_sentiment_insights.md)** - `/sentiment-insights` - Customer sentiment analysis
7. **[Content Studio](./06_content_studio.md)** - `/content-studio` - Content management & AI generation *(Feature Flag)*

### Operational Views
8. **[Lifecycle Tracker](./07_lifecycle_tracker.md)** - `/lifecycle-tracker` - Implementation lifecycle management
9. **[Agent View](./08_agent_view.md)** - `/agents` - AI agent performance monitoring
10. **[Affinity Combination](./09_affinity_combination.md)** - `/combine` - Multi-affinity analysis
11. **[Workbench](./10_workbench.md)** - `/workbench` - Data preparation and comparison tools

### Configuration & Analysis
12. **[Affinity Scorecard](./02_affinity_scorecard.md)** - `/scorecard` - **UPDATED** Individual affinity performance monitoring
13. **[Implementation Guide](./11_implementation_guide.md)** - `/implementation` - Technical implementation guidance
14. **[Reports & Analytics](./12_reports_analytics.md)** - `/reports` - Comprehensive reporting suite

### Sub-Navigation Views
- **[Affinity Configuration Studio](./04_affinity_configuration_studio.md)** - `/affinity-configuration-studio` - **UPDATED** Visual affinity definition management

## 🔄 **Major Updates & Changes**

### Affinity Scorecard Transformation
**File**: `02_affinity_scorecard.md`
- **Complete Redesign**: 7-dimension architecture with traveler-centric questions
- **Unique Values**: 25 different scorecard configurations (17 JSON-defined + 8 mock)
- **New Dimensions**: Coverage, Accuracy, Explainability, Freshness, Engagement, Conversion, Stability
- **Impressions Metric**: Added to engagement section in "M" format (e.g., 45.2M)
- **Navigation**: Moved from position 2 to position 12 (after Workbench)
- **Traveler Questions**: Each dimension includes user-facing questions like "Will I see enough options?"

### Affinity Configuration Studio Enhancement
**File**: `04_affinity_configuration_studio.md`
- **17 Template Library**: Complete set of pre-configured affinity definitions
- **Dynamic Rules Engine**: Real-time loading from `affinityDefinitionService.js`
- **Template Categories**: Lifestyle, Quality, Location, Property Type, Amenities, Activities, Seasonal, Popular
- **Comprehensive Validation**: Schema, weight distribution, URN format validation
- **Enhanced Workflow**: Draft → Staged → Active pipeline with version control

### Navigation Position Updates
All data models updated with correct navigation positions:
- **Position 5**: Last Mile View (after Destination Insights)
- **Position 6**: Sentiment Insights (after Last Mile)
- **Position 7**: Content Studio (conditional, after Sentiment Insights)
- **Position 12**: Affinity Scorecard (after Workbench)

## 📊 **Data Architecture Overview**

### Affinity Data Sources
1. **Mock Affinities** (`src/services/apiService.js`): 8 affinities with varied performance profiles
2. **JSON-Defined Affinities** (`src/services/affinityDefinitionService.js`): 17 template affinities with full definitions
3. **User-Created Configurations**: Custom affinity definitions based on templates

### Key Data Structures

#### Affinity Scorecard Schema
```javascript
const affinityScorecard = {
  // 7 Core Dimensions with traveler-centric questions
  coverage: { current: 87.2, target: 85, question: "Will I see enough options?" },
  accuracy: { current: 0.83, target: 0.80, question: "Do these match the promise?" },
  explainability: { current: 98.1, target: 100, question: "Can teams see the why?" },
  freshness: { current: 3, target: 14, question: "Is the data current?" },
  engagement: { 
    current: 4.2, 
    target: 2, 
    question: "Do travelers click?",
    impressions: { current: 45.2, unit: "M" }
  },
  conversion: { current: 2.1, target: 1, question: "Do they book?" },
  stability: { current: 3.1, target: 5, question: "Consistent over time?" }
}
```

#### Template Affinity Structure
```javascript
const affinityTemplate = {
  id: 'family-friendly',
  label: 'Family Friendly',
  urn: 'urn:expe:taxo:insights:family-friendly',
  icon: '👨‍👩‍👧‍👦',
  category: 'Lifestyle',
  definitions: [/* Full JSON definition structure */]
}
```

## 🛠️ **Implementation Status**

### Fully Implemented & Updated
- ✅ **Affinity Scorecard**: Complete 7-dimension implementation with unique values
- ✅ **Affinity Configuration Studio**: Full template library and dynamic rules
- ✅ **Last Mile View**: Comprehensive transportation/accessibility insights
- ✅ **Sentiment Insights**: Multi-level sentiment analysis with concept tracking
- ✅ **Content Studio**: AI-powered content management (feature-flagged)

### Standard Implementation
- ✅ **Dashboard**: Core performance overview
- ✅ **Affinity Library**: Browsing and filtering interface
- ✅ **Property Affinity Scores**: Property-level analysis
- ✅ **Destination Insights**: Destination-focused analytics
- ✅ **Workbench**: Data preparation and comparison tools
- ✅ **Affinity Combination**: Multi-affinity analysis

### Enhanced Features
- **Unique Scorecard Values**: Each affinity has distinct performance characteristics
- **Traveler-Centric Design**: Questions focus on traveler value proposition
- **Template-Based Configuration**: 17 pre-built affinity templates
- **Real-time Validation**: Comprehensive validation across all configuration aspects
- **Performance Monitoring**: Individual affinity performance tracking

## 🔧 **Technical Integration**

### API Endpoints
All views specify required API endpoints with request/response schemas:
- RESTful endpoints for data retrieval and manipulation
- Real-time validation endpoints for configuration
- Performance metrics endpoints for monitoring
- Template management endpoints for configuration studio

### State Management
- Component-level state for view-specific data
- Context providers for shared application state
- Optimistic updates for better user experience
- Caching strategies for improved performance

### Performance Considerations
- Lazy loading for large datasets
- Memoization for expensive calculations
- Code splitting for optimized bundle sizes
- Progressive enhancement for accessibility

## 📈 **Analytics & Monitoring**

### Performance Metrics
- **Load Times**: Component initialization and data loading
- **User Interactions**: Click-through rates and engagement metrics
- **Data Quality**: Accuracy and completeness measurements
- **System Health**: Real-time monitoring of all components

### Quality Assurance
- **Unique Value Verification**: Ensuring all 25 affinities have distinct scorecard values
- **Template Completeness**: All 17 templates properly configured and validated
- **Navigation Consistency**: All positions correctly documented and implemented
- **Data Model Accuracy**: Specifications match actual implementation

## 🚀 **Future Enhancements**

### Planned Improvements
- **Real-time Data Streaming**: WebSocket integration for live updates
- **Advanced Analytics**: Predictive insights and trend forecasting
- **Enhanced Collaboration**: Multi-user editing and approval workflows
- **Extended Templates**: Additional affinity templates and categories
- **Performance Optimization**: Further caching and optimization strategies

### Integration Opportunities
- **Machine Learning Pipeline**: Direct integration with ML model training
- **External Data Sources**: Additional data source integrations
- **API Expansion**: Extended API capabilities for third-party integrations
- **Advanced Visualizations**: Enhanced charting and data visualization

This comprehensive data model specification ensures consistent, high-quality implementation across all Affinity Explorer views while providing the flexibility for future enhancements and integrations.
