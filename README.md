# Affinity Explorer

A modern web application for exploring and analyzing property affinities, built with React, Vite, and TailwindCSS.

## Features

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
- React Context API (Auth, Toast, App, AffinityData)
- Custom analytics, validation, formatting, error handling, and performance monitoring utilities
- In-memory and localStorage caching
- Vitest, React Testing Library, Jest-DOM (testing)
- Python (for backend scripts: affinityIndexer.py, affinitySearchAPI.py)
- Custom design system (CSS and JS)

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

4. **Run tests**
```bash
npm test
# or
npx vitest
```

5. **(Optional) Python Backend Scripts**
If you want to use the backend scripts for data processing:
- Ensure you have Python 3.8+ installed.
- See `src/affinityIndexer.py` and `src/affinitySearchAPI.py` for details.

6. **Environment Variables**
- If you need to connect to a real backend, set the appropriate environment variables in a `.env` file (see Vite docs for details).

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