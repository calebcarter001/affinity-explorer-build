# Affinity Scorecard View - Data Model Specification

## Overview
The Affinity Scorecard view provides a comprehensive performance dashboard for monitoring the health, accuracy, and impact of individual affinity scoring systems. It displays key performance indicators (KPIs) across **7 core dimensions** with **traveler-centric questions** and **unique values per affinity** to ensure varied, realistic performance assessment.

## Component Location
- **File**: `/src/components/tabs/AffinityScorecard.jsx`
- **Route**: `/scorecard`
- **Navigation**: Position 12 in sidebar (after Workbench)
- **Icon**: `FiAward` (Award icon)

## Core Architecture

### 7 Performance Dimensions with Traveler-Centric Questions

#### 1. Coverage (87.2%, target ≥85%)
- **Question**: "Will I see enough options?"
- **Description**: Proportion of eligible properties that receive an affinity tag
- **Metrics**: Current vs target percentage with trend indicator

#### 2. Accuracy (F1: 0.83, target ≥0.80)
- **Question**: "Do these match the promise?"
- **Description**: Precision and recall against human-labeled properties
- **Metrics**: F1 score with performance classification

#### 3. Explainability (98.1%, target 100%)
- **Question**: "Can teams see the why?"
- **Description**: Percentage of scores with visible evidence anchors
- **Metrics**: Transparency score with completeness indicator

#### 4. Freshness (3 days, target ≤14d)
- **Question**: "Is the data current?"
- **Description**: Days since last full score refresh
- **Metrics**: Data age with alert thresholds

#### 5. Engagement (+4.2 bps, target +2 bps)
- **Question**: "Do travelers click?"
- **Description**: CTR lift versus neutral baseline in A/B tests
- **Metrics**: Click-through rate, MSV, and **Impressions** (45.2M format)

#### 6. Conversion (+2.1 bps, target +1 bps)
- **Question**: "Do they book?"
- **Description**: CVR and gross profit lift from affinity-tagged properties
- **Metrics**: Conversion rate improvement in basis points

#### 7. Stability (3.1%, target ≤5%)
- **Question**: "Consistent over time?"
- **Description**: Properties with score change of ±50 points
- **Metrics**: Score drift percentage with stability thresholds

## Data Structure

### Affinity-Specific Scorecard Schema
```javascript
const affinityScorecard = {
  // Dynamic data based on selected affinity
  affinityId: string,
  affinityName: string,
  
  // 7 Core Dimensions
  coverage: {
    current: number,        // Current percentage (e.g., 87.2)
    target: number,         // Target threshold (e.g., 85)
    trend: string,          // Change indicator (e.g., "+3.2%")
    description: string,    // Traveler-centric explanation
    status: string,         // "excellent" | "good" | "warning" | "critical"
    question: "Will I see enough options?"
  },
  
  accuracy: {
    current: number,        // F1 score (e.g., 0.83)
    target: number,         // Target F1 (e.g., 0.80)
    trend: string,          // Performance change
    description: string,    // Accuracy explanation
    status: string,         // Performance classification
    question: "Do these match the promise?"
  },
  
  explainability: {
    current: number,        // Percentage (e.g., 98.1)
    target: number,         // Target percentage (e.g., 100)
    trend: string,          // Trend indicator
    description: string,    // Explainability details
    status: string,         // Transparency status
    question: "Can teams see the why?"
  },
  
  freshness: {
    current: number,        // Days (e.g., 3)
    target: number,         // Target days (e.g., 14)
    trend: string,          // Freshness change
    description: string,    // Data currency details
    status: string,         // Freshness status
    question: "Is the data current?"
  },
  
  engagement: {
    current: number,        // Basis points (e.g., 4.2)
    target: number,         // Target bps (e.g., 2)
    trend: string,          // Engagement trend
    description: string,    // Engagement explanation
    status: string,         // Engagement status
    question: "Do travelers click?",
    
    // Additional engagement metrics
    ctr: {
      current: number,      // Click-through rate %
      trend: string
    },
    msv: {
      current: number,      // MSV percentage
      trend: string
    },
    impressions: {
      current: number,      // Impressions count (e.g., 45.2)
      target: number,       // Target impressions
      trend: string,        // Trend percentage
      unit: "M",           // Always millions for clean display
      description: "Total impressions generated till date"
    }
  },
  
  conversion: {
    current: number,        // Basis points (e.g., 2.1)
    target: number,         // Target bps (e.g., 1)
    trend: string,          // Conversion trend
    description: string,    // Conversion explanation
    status: string,         // Conversion status
    question: "Do they book?"
  },
  
  stability: {
    current: number,        // Percentage (e.g., 3.1)
    target: number,         // Target percentage (e.g., 5)
    trend: string,          // Stability trend
    description: string,    // Stability explanation
    status: string,         // Stability status
    question: "Consistent over time?"
  }
}
```

### Unique Values Per Affinity
The scorecard generates **unique values for each of the 25 total affinities** (17 JSON-defined + 8 mock) using:

#### Mock Affinities (8 total) - `/src/services/apiService.js`
- **Romantic**: Mixed performance (73% coverage, 89% accuracy, 18.7% engagement, 142.3M impressions)
- **Business**: High performance (91% coverage, 94% accuracy, 21.3% engagement, 218.5M impressions)
- **All-Inclusive**: Outstanding (79% coverage, 97% accuracy, 24.9% engagement, 186.7M impressions)
- **Oceanview**: Premium (92% coverage, 98% accuracy, 28.4% engagement, 304.8M impressions)
- **Historic & Cultural**: Challenges (64% coverage, 96% accuracy, 16.2% engagement, 89.3M impressions)
- **Adventure & Sports**: High engagement (86% coverage, 92% accuracy, 31.7% engagement, 267.9M impressions)
- **Budget-Friendly**: Popular segment (96% coverage, 82% accuracy, 35.2% engagement, 412.6M impressions)
- **Eco-Friendly**: Growing market (64% coverage, 92% accuracy, 16.8% engagement, 94.7M impressions)

#### JSON-Defined Affinities (17 total) - `/src/services/affinityDefinitionService.js`
Uses hash-based variation system for consistent unique values:
- **Family-Friendly**: High family engagement (91% coverage, 25.8% engagement, 298.5M impressions)
- **Luxury**: Premium performance (85% coverage, 28.9% engagement, 189.7M impressions)
- **Beachfront**: Beach vacation leader (94% coverage, 31.2% engagement, 456.8M impressions)
- **Trending**: Highest engagement (72% coverage, 35.2% engagement, 523.9M impressions)
- Plus 13 other unique configurations

## UI Components

### 1. Header Section
- **Gradient Background**: Blue to purple gradient with professional styling
- **Dynamic Title**: "Affinity Scorecard - [Selected Affinity Name]"
- **Subtitle**: "Performance metrics and quality indicators"
- **Last Updated**: Real-time timestamp display
- **Affinity Selector**: Dropdown to switch between affinities

### 2. Core Metrics Grid (7 Cards)
Responsive grid layout displaying all 7 dimensions:

#### Coverage Card
- **Icon**: `faChartBar` (blue)
- **Question**: "Will I see enough options?"
- **Display**: Large percentage with progress bar
- **Status**: Color-coded performance indicator

#### Accuracy Card
- **Icon**: `faBullseye` (green)
- **Question**: "Do these match the promise?"
- **Display**: F1 score with precision/recall context
- **Threshold**: Visual alert for F1 < 0.8

#### Explainability Card
- **Icon**: `faSearch` (purple)
- **Question**: "Can teams see the why?"
- **Display**: Transparency percentage
- **Feature**: Evidence anchor availability

#### Freshness Card
- **Icon**: `faClock` (gray)
- **Question**: "Is the data current?"
- **Display**: Days since update with inverted progress
- **Alert**: Visual warning for >14 days

#### Engagement Card
- **Icon**: `faMousePointer` (blue)
- **Question**: "Do travelers click?"
- **Display**: CTR, MSV, and **Impressions metrics**
- **Format**: Impressions in "M" format (e.g., 45.2M)
- **Trends**: Directional arrows with percentages

#### Conversion Card
- **Icon**: `faShoppingCart` (green)
- **Question**: "Do they book?"
- **Display**: Basis points improvement
- **Context**: Above/below baseline indicators

#### Stability Card
- **Icon**: `faBalanceScale` (purple)
- **Question**: "Consistent over time?"
- **Display**: Score drift percentage
- **Target**: Visual indication of stability thresholds

## Visual Design System

### Color-Coded Performance
- **Excellent**: Green (`#10B981`) - Exceeds targets significantly
- **Good**: Light green - Meets or slightly exceeds targets
- **Warning**: Yellow (`#F59E0B`) - Approaching thresholds
- **Critical**: Red (`#EF4444`) - Below thresholds or failing

### Progress Indicators
- **Dynamic Bars**: Width reflects actual vs target performance
- **Inverted Logic**: Freshness bar decreases as days increase
- **Gradient Effects**: Smooth color transitions for visual appeal

### Trend Indicators
- **Up Arrow**: Positive trends (green)
- **Down Arrow**: Negative trends (red)
- **Percentage Labels**: Quantified trend changes

## State Management

### Affinity Selection
- **Dynamic Loading**: Scorecard data changes based on selected affinity
- **Unique Values**: Each affinity shows distinct performance metrics
- **Smooth Transitions**: Loading states during affinity switching

### Data Sources Integration
```javascript
// Current data sources
const scorecardData = await Promise.all([
  // Mock affinities from apiService.js
  getMockAffinityScorecard(affinityId),
  
  // JSON-defined affinities from affinityDefinitionService.js
  getJSONDefinedScorecard(affinityId)
]);
```

### Performance Considerations
- **Lazy Loading**: Scorecard data loaded on-demand per affinity
- **Caching**: Previously viewed scorecards cached for quick switching
- **Optimized Rendering**: React.memo for stable metric cards

## Integration Points

### Navigation Updates
- **Position**: Moved from position 2 to position 12 (after Workbench)
- **Context**: Provides performance validation after workbench analysis
- **Permissions**: Requires 'read' permission for scorecard access

### Data Flow
1. **Affinity Selection**: User selects affinity from dropdown
2. **Data Loading**: System fetches unique scorecard data
3. **Metric Display**: 7 dimensions rendered with traveler questions
4. **Status Evaluation**: Color coding based on thresholds
5. **Trend Analysis**: Historical comparison with trend indicators

## API Endpoints

### Get Affinity Scorecard
```
GET /api/affinities/{affinity_id}/scorecard
Response: AffinityScorecard
```

### Get Available Affinities for Scorecard
```
GET /api/affinities/scorecard-enabled
Response: AffinityOption[]
```

## Future Enhancements

### Real-time Updates
- **Live Metrics**: WebSocket integration for real-time performance monitoring
- **Alert System**: Threshold-based notifications for performance degradation
- **Historical Trends**: Time-series visualization of dimension performance

### Interactive Features
- **Drill-down**: Detailed analysis for each dimension
- **Comparative View**: Side-by-side scorecard comparison
- **Export Options**: PDF reports with performance summaries

### Advanced Analytics
- **Predictive Insights**: Trend forecasting for performance metrics
- **Benchmarking**: Cross-affinity performance comparison
- **Optimization Recommendations**: AI-driven improvement suggestions

This comprehensive scorecard provides stakeholders with immediate visibility into individual affinity performance, enabling data-driven optimization and quality assurance through traveler-focused metrics and unique, realistic performance indicators.
