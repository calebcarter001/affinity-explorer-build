# Affinity Explorer

A modern web application for exploring and analyzing property affinities, built with React, Vite, and TailwindCSS.

## Features

### Core Affinity Analysis
- Interactive dashboard with property insights
- Workbench: advanced analysis and implementation readiness for collections and affinities
- Affinity Combination: combine and analyze multiple affinities
- Lifecycle Tracker: track lifecycle stages of affinities
- Implementation Guide: step-by-step implementation instructions
- Reports & Analytics: generate and view detailed reports
- Agent-based analysis views (Verification, Discovery, Sentiment, Competitive, Bias Detection, Trend)
- Affinity library management
- Affinity Scores
- Lifecycle tracking
- Implementation guides
- Reports and analytics

### Enhanced Destination Themes System
- **Evidence-Backed Insights**: Every data point includes clickable evidence links with source URLs
- **Professional Dashboard**: Real-time statistics showing theme counts, confidence scores, and coverage metrics
- **Interactive Theme Cards**: Clean, modern design with comprehensive paperclip evidence system
- **Intelligence Badges**: Visual indicators (nano, balanced, local, moderate, contemplative) with gradient styling
- **Confidence Color Coding**: High (green), medium (yellow), perfect (blue) confidence levels
- **Comprehensive Evidence Modal**: Detailed validation metrics, source quality scores, and multiple URL evidences per insight
- **Multi-Destination Support**: Paris, New York, Tokyo with real JSON data from external travel sources
- **Search & Filtering**: Real-time theme search across names, categories, and descriptions
- **Text Management**: Smart truncation with expand/collapse for long content
- **Configurable Architecture**: Destination configuration system with data validation
- **Professional Validation Metrics**: Authority scores, quality ratings, relevance scores for all evidence

### System Features
- Settings & Help: user settings and help/support
- Notifications: in-app notification system
- User authentication (login/logout, user context)
- Toast notifications for user feedback
- Error boundaries for robust error handling
- Performance monitoring utilities
- Validation utilities for forms and data
- Caching (in-memory and localStorage)
- Unit and integration tests for components and utilities

## Tech Stack

- React 18
- Vite
- TailwindCSS
- React Router DOM
- Chart.js
- Font Awesome Icons
- React Icons (Feather Icons)
- Heroicons (for destination themes UI)
- React Context API (Auth, Toast, App, AffinityData)
- Custom analytics, validation, formatting, error handling, and performance monitoring utilities
- In-memory and localStorage caching
- Vitest, React Testing Library, Jest-DOM (testing)
- Python (for backend scripts: affinityIndexer.py, affinitySearchAPI.py)
- Custom design system (CSS and JS)

### Destination Themes Architecture
- **Data Sources**: Real JSON files from external travel data sources (~23MB total)
- **Evidence System**: Multi-layered evidence validation with URL sources
- **Configuration System**: Centralized destination management with validation
- **Modular Components**: Reusable cards, modals, and service layers
- **Professional UI**: TailwindCSS with custom gradient badges and confidence indicators

## Getting Started

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

4. **Access Destination Themes**
Navigate to the "Destination Insights" tab to explore the enhanced destination themes system with evidence-backed insights.

5. **Run tests**
```bash
npm test
# or
npx vitest
```

6. **(Optional) Python Backend Scripts**
If you want to use the backend scripts for data processing:
- Ensure you have Python 3.8+ installed.
- See `src/affinityIndexer.py` and `src/affinitySearchAPI.py` for details.

7. **Environment Variables**
- If you need to connect to a real backend, set the appropriate environment variables in a `.env` file (see Vite docs for details).

## Enhanced Destination Themes System

The application includes a sophisticated destination analysis system that provides evidence-backed insights for travel destinations.

### Key Features
- **Real Data Sources**: Uses actual travel data from external JSON files (~23MB total)
- **Evidence-Based**: Every insight includes clickable evidence with source URLs from real travel blogs and sites
- **Professional UI**: Clean, modern design with TailwindCSS styling
- **Interactive Elements**: Expandable cards, evidence modals, search functionality
- **Multi-Destination**: Currently supports Paris, New York, and Tokyo

### Data Structure
```javascript
// Destination themes data structure
{
  "destination": "Paris, France",
  "affinities": [
    {
      "theme": "Revolutionary Paris History",
      "category": "Historical",
      "confidence": 0.92,
      "intelligence_badges": ["contemplative", "local"],
      "sub_themes": ["French Revolution Sites", "Political History"],
      "nano_themes": ["Bastille Day", "Revolutionary Museums"],
      "rationale": "Evidence-backed description...",
      // ... additional attributes with evidence
    }
  ]
}
```

### Configuration
Destinations are configured in `src/config/appConfig.js`:
```javascript
AVAILABLE_DESTINATIONS: [
  {
    id: 'paris__france',
    name: 'Paris, France',
    flag: '🇫🇷',
    dataFiles: {
      enhanced: 'paris__france_enhanced.json',
      evidence: 'paris__france_evidence.json'
    }
  }
  // ... additional destinations
]
```

### Components
- **DestinationThemeCard**: Interactive theme cards with evidence paperclips
- **EvidenceModal**: Professional evidence display with validation metrics
- **DestinationInsightsPage**: Main dashboard with stats and destination switching
- **destinationThemeService**: Data loading and processing service

## Development

The project uses:
- Vite for fast development and building
- TailwindCSS for styling
- React Router for navigation
- Chart.js for data visualization
- React Context for state management
- Custom utilities for analytics, validation, error handling, and performance
- Error boundaries for robust UI error handling
- In-memory and localStorage caching for API responses
- Unit and integration testing with Vitest and React Testing Library

## License

MIT

## Data Loading and API Service

All data for the app is loaded through the file `src/services/apiService.js`. This file simulates remote API calls and acts as the main data provider for the application. In a production environment, these functions would be replaced with real API calls to a backend service.

- Each exported function in `apiService.js` should be treated as a remote function call.
- When maintaining or extending the app, **do not refactor these functions into local data access**; always treat them as asynchronous remote calls, even if they return mock data.
- This ensures the app structure is ready for future backend integration and keeps the UI logic decoupled from data source details.

### Example Remote Function Call Comments

Below is an example of how to document each remote function in `apiService.js`:

```js
// <do not refactor anything>
// REMOTE FUNCTION: getAffinities
// Simulates fetching a paginated list of affinities from the backend.
// Accepts optional pagination and search parameters.
export const getAffinities = async ({ page = 1, limit = 10, searchTerm = '' } = {}) => { ... }

// REMOTE FUNCTION: getCollections
// Simulates fetching all collections for a given owner/user from the backend.
export const getCollections = async (ownerId) => { ... }

// REMOTE FUNCTION: enrichAffinityWithBrandData
// Simulates fetching brand-specific property data for a given affinity from the backend.
export async function enrichAffinityWithBrandData(affinityId) { ... }
```

Add similar comments to any new remote function you create in `apiService.js`.

## Caching

The app uses both in-memory and localStorage caching to optimize performance and reduce unnecessary API calls.
- Caching utilities are provided in `src/services/cacheService.js` and `src/utils/cache.js`.
- API responses, recently viewed items, and other data are cached.
- In-memory cache is fast but volatile (cleared on reload); localStorage cache persists across sessions.
- In production, manage cache expiration, invalidation, and storage limits carefully to avoid stale or excessive data.

## Authentication

Authentication is managed via the React Context API in `src/contexts/AuthContext.jsx`.
- In development, a default user is used for convenience.
- In production, replace the login logic in `AuthContext` with a real authentication API call (e.g., OAuth, JWT, SSO, etc.).
- User session data is stored in localStorage and expires after a set timeout (default: 30 minutes).
- The app supports role-based and permission-based route protection.
- To integrate a real auth service:
  - Replace the login function in `AuthContext` to call your backend and handle tokens securely.
  - Store tokens in httpOnly cookies or secure storage (avoid localStorage for sensitive tokens in production).
  - Update logout to clear all sensitive data.

## localStorage Usage & Production Considerations

- localStorage is used for:
  - User session persistence (current user info)
  - Recently viewed affinities
  - Optionally, for caching API responses
- In production:
  - Do not store sensitive tokens or credentials in localStorage; use httpOnly cookies or secure alternatives.
  - Always clear localStorage on logout and when cache entries expire.
  - Monitor storage limits and handle quota errors gracefully.

## Support & Contact

For questions, support, or to report issues, contact:
- Caleb Carter: calcarter@expediagroup.com