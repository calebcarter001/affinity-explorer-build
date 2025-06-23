# Affinity Explorer

A comprehensive web application for exploring, analyzing, and managing property affinities and destination insights. Built with modern React architecture, the application provides advanced analytics, agent-based analysis, and rich destination theme exploration capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/calebcarter001/affinity-explorer-build.git
cd affinity-explorer-build
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

4. **Run tests (optional)**
```bash
npm test
# or for coverage
npm run test:coverage
# or for UI testing
npm run test:ui
```

5. **Build for production**
```bash
npm run build
npm run preview
```

### Data Import Scripts (Optional)
```bash
# Import destination data
npm run import:data

# Clean import (removes existing data first)
npm run import:data:clean
```

## 🏗️ Application Architecture

### Tech Stack
- **Frontend**: React 18, React Router DOM 6
- **Build Tool**: Vite 6.3+
- **Styling**: TailwindCSS 3.4+, PostCSS, Autoprefixer
- **Charts**: Chart.js 4.4+, React-ChartJS-2
- **Icons**: React Icons (Feather), Heroicons, Font Awesome
- **UI Components**: Headless UI, Styled Components
- **Testing**: Vitest, React Testing Library, Jest-DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Utilities**: React-Use hooks library

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin dashboard components
│   ├── affinity/       # Affinity-specific components
│   ├── agent/          # AI agent analysis components
│   ├── auth/           # Authentication components
│   ├── collections/    # Collection management
│   ├── common/         # Shared components
│   ├── destinations/   # Destination theme components
│   ├── goals/          # Goal tracking components
│   ├── navigation/     # Navigation components
│   ├── performance/    # Performance metrics
│   ├── scoring/        # Scoring visualization
│   └── tabs/           # Main application views
├── contexts/           # React Context providers
├── services/           # API and data services
├── utils/             # Utility functions
├── styles/            # CSS and design system
├── pages/             # Page components
└── config/            # Application configuration
```

## 📱 Application Views & Features

### 1. Dashboard (Home)
**Route**: `/` or `/dashboard`
**Purpose**: Central hub providing overview of all affinity data and system health

**Key Features**:
- **Summary Cards**: Total affinities, active collections, system performance metrics
- **Recent Activity**: Recently viewed affinities and collections
- **Performance Metrics**: System health indicators, data quality scores
- **Quick Actions**: Fast access to common tasks
- **Analytics Overview**: High-level charts and trends

**Rich Data Available**:
- Real-time affinity counts and distribution
- Performance benchmarks and system health
- User activity tracking and engagement metrics
- Data quality indicators and validation status

### 2. Affinity Library
**Route**: `/affinities`
**Purpose**: Comprehensive catalog of all available property affinities

**Key Features**:
- **Advanced Search**: Full-text search across affinity names, descriptions, categories
- **Filtering**: Multi-dimensional filtering by category, type, status, coverage
- **Pagination**: Efficient browsing of large affinity datasets
- **Detailed View**: In-depth affinity information with auto-scroll functionality
- **Score Visualization**: Interactive charts showing affinity performance

**Rich Data Available**:
- **Affinity Metadata**: Name, type (Platform/Concept Score), category, definition
- **Performance Metrics**: Average scores, coverage percentages, validation status
- **Usage Statistics**: Application frequency, entity coverage (Property/Destination/POI)
- **Implementation Details**: Technical requirements, scoring algorithms
- **Related Properties**: Properties utilizing each affinity with scores

**Sample Data Structure**:
```javascript
{
  id: "aff1",
  name: "Pet-Friendly",
  type: "Platform Score",
  category: "Family",
  definition: "Properties that welcome pets with amenities...",
  averageScore: 7.2,
  coverage: 72,
  status: "Active",
  applicableEntities: ["Property", "Destination"]
}
```

### 3. Property Affinity Scores
**Route**: `/scoring`
**Purpose**: Detailed scoring analysis and property-affinity relationships

**Key Features**:
- **Score Distribution**: Visual representation of affinity scores across properties
- **Property Comparison**: Side-by-side property analysis
- **Trend Analysis**: Historical scoring patterns and changes
- **Threshold Management**: Configure scoring thresholds and alerts
- **Export Capabilities**: Data export for external analysis

**Rich Data Available**:
- Property-specific affinity scores (0-10 scale)
- Score confidence intervals and validation metrics
- Historical score evolution and trend data
- Comparative analysis across property types and locations
- Performance benchmarking against market segments

### 4. Destination Insights ⭐
**Route**: `/destination-insights`
**Purpose**: Advanced destination theme analysis with evidence-backed insights

**Key Features**:
- **Multi-Destination Support**: 65+ destinations worldwide including Paris, Tokyo, New York, Rome, Bali, and more
- **Evidence-Based Analysis**: Every data point includes clickable evidence (📎) with source URLs
- **Interactive Theme Cards**: Professional design with confidence color-coding
- **Intelligence Badges**: Visual indicators (nano, balanced, local, moderate, contemplative)
- **Search & Filtering**: Real-time theme search across names, categories, descriptions
- **Evidence Modal**: Comprehensive validation metrics and source quality scores
- **Similar Destinations**: AI-powered destination similarity analysis
- **Nuance System**: Three-tier nuance analysis (destination, hotel, vacation rental)

**Rich Data Available**:
- **Destination Themes**: 65+ destinations with comprehensive theme analysis
- **Evidence Sources**: Real URLs from travel blogs, tourism boards, expert reviews
- **Confidence Scores**: AI-validated confidence levels (0.0-1.0)
- **Intelligence Insights**: Sub-themes, nano-themes, emotional profiles
- **Validation Metrics**: Authority scores, quality ratings, relevance scores
- **Seasonal Data**: Time-based insights and seasonal variations
- **Demographic Suitability**: Target audience analysis and recommendations

**Sample Theme Structure**:
```javascript
{
  theme: "Revolutionary Paris History",
  category: "Historical",
  confidence: 0.92,
  intelligence_badges: ["contemplative", "local"],
  sub_themes: ["French Revolution Sites", "Political History"],
  nano_themes: ["Bastille Day", "Revolutionary Museums"],
  best_for: "History enthusiasts, Cultural explorers",
  price_range: "€25-50 per attraction",
  time_commitment: "Half-day to full-day",
  experience_intensity: "Moderate",
  emotional_profile: ["Inspiring", "Educational", "Reflective"],
  comprehensive_attribute_evidence: {
    main_theme: {
      evidence_pieces: [{
        source_url: "https://parismuseum.org/revolution",
        authority_score: 0.95,
        text_content: "Evidence content..."
      }]
    }
  }
}
```

### 5. Content Studio
**Route**: `/content-studio`
**Purpose**: Content creation and management for affinity-based marketing

**Key Features**:
- **Content Templates**: Pre-built templates for different content types
- **Affinity Integration**: Content suggestions based on affinity data
- **Multi-Channel Support**: Content optimization for various platforms
- **Performance Tracking**: Content effectiveness metrics
- **Collaboration Tools**: Team-based content creation workflows

**Rich Data Available**:
- Content performance analytics and engagement metrics
- Affinity-driven content recommendations
- A/B testing results and optimization suggestions
- Multi-channel distribution tracking
- Content lifecycle management data

### 6. Agent View
**Route**: `/agents`
**Purpose**: AI-powered analysis through specialized agent perspectives

**Key Features**:
- **Multiple Agent Types**: 
  - **Verification Agent**: Data validation and accuracy checking
  - **Discovery Agent**: New pattern and trend identification
  - **Sentiment Agent**: Emotional analysis and sentiment tracking
  - **Competitive Agent**: Market comparison and competitive analysis
  - **Bias Detection Agent**: Algorithmic bias identification
  - **Trend Agent**: Market trend analysis and forecasting
- **Agent Insights**: Specialized analysis from each agent perspective
- **Interactive Dashboards**: Agent-specific visualizations and metrics
- **Property Analysis**: Deep-dive property analysis through agent lenses

**Rich Data Available**:
- Agent-specific insights and recommendations
- Validation scores and confidence metrics
- Trend predictions and market analysis
- Bias detection reports and mitigation suggestions
- Competitive positioning data and market share analysis

### 7. Lifecycle Tracker
**Route**: `/lifecycle-tracker`
**Purpose**: Track affinity development and implementation stages

**Key Features**:
- **Stage Management**: Track affinities through development phases
- **Progress Visualization**: Visual progress indicators and timelines
- **Milestone Tracking**: Key deliverable and deadline management
- **Team Collaboration**: Multi-user lifecycle management
- **Automated Workflows**: Stage transition automation

**Rich Data Available**:
- Lifecycle stage definitions and requirements
- Progress metrics and completion percentages
- Timeline data and milestone tracking
- Resource allocation and team assignment data
- Historical lifecycle performance analytics

### 8. Affinity Combination
**Route**: `/combine`
**Purpose**: Analyze combinations of multiple affinities for enhanced insights

**Key Features**:
- **Multi-Affinity Selection**: Choose multiple affinities for combination analysis
- **Compatibility Scoring**: Analyze how well affinities work together
- **Property Matching**: Find properties that match multiple affinity criteria
- **Visualization Tools**: Charts and graphs showing combination effectiveness
- **Export Results**: Save and share combination analysis results

**Rich Data Available**:
- Affinity compatibility matrices and correlation scores
- Multi-dimensional property matching results
- Combination performance metrics and success rates
- Historical combination analysis data
- Recommendation algorithms for optimal affinity combinations

### 9. Workbench
**Route**: `/workbench`
**Purpose**: Advanced analysis workspace with multiple specialized tabs

**Sub-Features**:
- **Performance Tab**: Detailed performance metrics and analysis tools
- **Compare Tab**: Side-by-side comparison of affinities, properties, or destinations
- **Prepare Tab**: Data preparation and preprocessing tools

**Key Features**:
- **Advanced Analytics**: Complex data analysis and visualization tools
- **Custom Queries**: Build custom analysis queries and reports
- **Data Export**: Multiple export formats for external analysis
- **Collaboration**: Share workbench sessions and analysis results
- **Integration**: Connect with external data sources and tools

### 10. Implementation Guide
**Route**: `/implementation`
**Purpose**: Step-by-step guidance for implementing affinity-based solutions

**Key Features**:
- **Implementation Roadmaps**: Detailed step-by-step implementation guides
- **Technical Documentation**: API documentation and integration guides
- **Best Practices**: Industry best practices and recommendations
- **Code Examples**: Sample code and implementation examples
- **Troubleshooting**: Common issues and solutions

### 11. Reports & Analytics
**Route**: `/reports`
**Purpose**: Comprehensive reporting and analytics dashboard

**Key Features**:
- **Pre-built Reports**: Standard reports for common use cases
- **Custom Report Builder**: Create custom reports and dashboards
- **Scheduled Reports**: Automated report generation and distribution
- **Data Visualization**: Advanced charting and visualization options
- **Export Options**: Multiple export formats (PDF, Excel, CSV)

### 12. Settings & Administration
**Route**: `/settings`
**Purpose**: Application configuration and user management

**Key Features**:
- **User Preferences**: Personalized application settings
- **System Configuration**: Application-wide configuration options
- **Data Management**: Data import/export and backup options
- **Integration Settings**: Third-party service configurations
- **Security Settings**: Authentication and authorization management

## 🗄️ Data Architecture

### API Service Layer
All data is managed through `src/services/apiService.js`, which simulates remote API calls and provides:

- **Affinity Management**: CRUD operations for affinity data
- **Property Analysis**: Property-affinity relationship management
- **Collection Management**: Affinity collection organization
- **Destination Data**: Theme and evidence data loading
- **Performance Metrics**: System and data quality metrics
- **Caching**: Intelligent data caching for performance optimization

### Mock Data Structure
The application includes comprehensive mock data for development and testing:

- **Affinities**: 50+ sample affinities across multiple categories
- **Properties**: 100+ sample properties with realistic affinity scores
- **Destinations**: 65+ destinations with rich theme data
- **Collections**: Sample affinity collections and groupings
- **Evidence**: Realistic evidence data with source URLs and validation metrics

### Destination Theme Data
**65+ Destinations Available**:
- Acropolis Greece, Amazon Rainforest Brazil, Amsterdam Netherlands
- Bangkok Thailand, Banff National Park Canada, Bora Bora French Polynesia
- Cape Town South Africa, Dubai UAE, Edinburgh Scotland
- Florence Italy, Grand Canyon USA, Great Barrier Reef Australia
- Istanbul Turkey, Kyoto Japan, Machu Picchu Peru
- New York City USA, Paris France, Rome Italy, Tokyo Japan
- And 45+ more destinations worldwide

**Data Structure**:
```javascript
// Comprehensive destination data
{
  themes: {
    themes_data: {
      affinities: [/* Enhanced themes with sub/nano themes */],
      intelligence_insights: {/* Aggregated analytics */}
    }
  },
  nuances: {
    nuances_data: {
      destination_nuances: [/* Destination-specific insights */],
      hotel_expectations: [/* Hotel nuances */],
      vacation_rental_expectations: [/* Vacation rental nuances */]
    }
  },
  evidence: {
    evidence_data: {
      evidence: [/* Comprehensive evidence pieces with URLs */]
    }
  }
}
```

## 🔧 Development & Configuration

### Environment Variables
Create a `.env` file for custom configuration:
```bash
VITE_API_BASE_URL=http://localhost:9000
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
```

### Feature Flags
Configure features in `src/config/appConfig.js`:
```javascript
const FEATURE_FLAGS = {
  CONTENT_STUDIO_ENABLED: true,
  ADVANCED_SEARCH: true,
  COLLECTIONS: true,
  DESTINATION_INSIGHTS: true
};
```

### Caching System
The application implements multi-layer caching:
- **In-Memory Cache**: Fast access for frequently used data
- **LocalStorage Cache**: Persistent cache across sessions
- **API Response Cache**: Optimized API response caching

### Authentication
- **Development**: Default user authentication for convenience
- **Production**: Configurable authentication system (OAuth, JWT, SSO)
- **Permissions**: Role-based access control (read, write, admin)

## 🧪 Testing

### Test Suite
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and service integration testing
- **E2E Tests**: End-to-end user workflow testing

### Test Commands
```bash
npm test              # Run test suite
npm run test:coverage # Generate coverage report
npm run test:ui       # Interactive test UI
```

### Test Coverage
- Components: 85%+ coverage target
- Services: 90%+ coverage target
- Utilities: 95%+ coverage target

## 🚀 Deployment

### Build Process
```bash
npm run build    # Production build
npm run preview  # Preview production build locally
```

### Production Considerations
- **Environment Variables**: Configure production API endpoints
- **Authentication**: Implement secure authentication system
- **Caching**: Configure appropriate cache expiration policies
- **Monitoring**: Set up application performance monitoring
- **Security**: Implement security headers and HTTPS

### Performance Optimization
- **Code Splitting**: Lazy loading of route components
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Image Optimization**: Optimized image loading and caching
- **API Optimization**: Request batching and intelligent caching

## 📊 Data Sources & Integration

### Primary Data Sources
- **Internal APIs**: Property and affinity management systems
- **External APIs**: Tourism boards, travel data providers
- **Third-Party Services**: Review platforms, booking systems
- **User-Generated Content**: Reviews, ratings, feedback

### Integration Capabilities
- **REST APIs**: Standard HTTP API integration
- **GraphQL**: Advanced query capabilities
- **Webhooks**: Real-time data synchronization
- **File Import**: CSV, JSON, Excel data import
- **Database Integration**: Direct database connections

## 🔒 Security & Privacy

### Security Features
- **Authentication**: Multi-factor authentication support
- **Authorization**: Role-based access control
- **Data Encryption**: At-rest and in-transit encryption
- **Input Validation**: Comprehensive input sanitization
- **CSRF Protection**: Cross-site request forgery protection

### Privacy Compliance
- **GDPR Compliance**: European privacy regulation compliance
- **Data Minimization**: Collect only necessary data
- **User Consent**: Explicit consent management
- **Data Retention**: Configurable data retention policies
- **Audit Logging**: Comprehensive audit trail

## 📈 Analytics & Monitoring

### Built-in Analytics
- **User Behavior**: Page views, user interactions, session tracking
- **Performance Metrics**: Load times, error rates, system health
- **Business Metrics**: Affinity usage, conversion rates, engagement
- **Data Quality**: Validation scores, completeness metrics

### Monitoring Integration
- **Error Tracking**: Comprehensive error monitoring and alerting
- **Performance Monitoring**: Real-time performance tracking
- **Uptime Monitoring**: Service availability monitoring
- **Custom Metrics**: Business-specific metric tracking

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **ESLint**: JavaScript/React code linting
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages
- **Code Review**: Required for all changes

## 📞 Support & Contact

### Documentation
- **API Documentation**: `/docs/api.md`
- **Component Library**: Storybook documentation
- **User Guides**: Comprehensive user documentation
- **FAQ**: Frequently asked questions

### Support Channels
- **Email**: calcarter@expediagroup.com
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive online documentation
- **Community**: Developer community and forums

### Maintenance
- **Regular Updates**: Monthly feature updates
- **Security Patches**: Immediate security updates
- **Performance Optimization**: Quarterly performance reviews
- **Data Updates**: Weekly data refresh cycles

---

## 📄 License

MIT License - see LICENSE file for details.

---

*Last Updated: January 2025*
*Version: 0.1.0*
*Maintained by: Caleb Carter (calcarter@expediagroup.com)*