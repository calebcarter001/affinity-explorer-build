/**
 * Analytics utility
 * Provides functions for tracking user behavior and feature usage
 */

// Analytics event types
export const EventTypes = {
  PAGE_VIEW: 'page_view',
  FEATURE_USE: 'feature_use',
  ERROR: 'error',
  PERFORMANCE: 'performance'
};

// Analytics data store (in-memory for development)
const analyticsData = {
  events: [],
  pageViews: {},
  featureUsage: {},
  errors: [],
  performance: {}
};

// Track page view
export const trackPageView = (pageName) => {
  const timestamp = new Date().toISOString();
  
  analyticsData.pageViews[pageName] = (analyticsData.pageViews[pageName] || 0) + 1;
  
  analyticsData.events.push({
    type: EventTypes.PAGE_VIEW,
    name: pageName,
    timestamp
  });
  
  // In a production environment, this would send data to an analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Page view: ${pageName} at ${timestamp}`);
  }
};

// Track feature usage
export const trackFeatureUse = (featureName, details = {}) => {
  const timestamp = new Date().toISOString();
  
  analyticsData.featureUsage[featureName] = (analyticsData.featureUsage[featureName] || 0) + 1;
  
  analyticsData.events.push({
    type: EventTypes.FEATURE_USE,
    name: featureName,
    details,
    timestamp
  });
  
  // In a production environment, this would send data to an analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Feature use: ${featureName}`, details);
  }
};

// Track error
export const trackError = (error, context = {}) => {
  const timestamp = new Date().toISOString();
  
  analyticsData.errors.push({
    error: error.message || error,
    stack: error.stack,
    context,
    timestamp
  });
  
  analyticsData.events.push({
    type: EventTypes.ERROR,
    name: error.name || 'Error',
    details: {
      message: error.message || error,
      context
    },
    timestamp
  });
  
  // In a production environment, this would send data to an error tracking service
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Analytics] Error: ${error.message || error}`, context);
  }
};

// Track performance metric
export const trackPerformance = (metricName, value, details = {}) => {
  const timestamp = new Date().toISOString();
  
  if (!analyticsData.performance[metricName]) {
    analyticsData.performance[metricName] = [];
  }
  
  analyticsData.performance[metricName].push({
    value,
    details,
    timestamp
  });
  
  analyticsData.events.push({
    type: EventTypes.PERFORMANCE,
    name: metricName,
    details: {
      value,
      ...details
    },
    timestamp
  });
  
  // In a production environment, this would send data to a performance monitoring service
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Performance: ${metricName} = ${value}`, details);
  }
};

// Get analytics data (for development/testing)
export const getAnalyticsData = () => {
  return {
    ...analyticsData,
    summary: {
      totalEvents: analyticsData.events.length,
      totalPageViews: Object.values(analyticsData.pageViews).reduce((sum, count) => sum + count, 0),
      totalFeatureUses: Object.values(analyticsData.featureUsage).reduce((sum, count) => sum + count, 0),
      totalErrors: analyticsData.errors.length
    }
  };
};

// Clear analytics data (for development/testing)
export const clearAnalyticsData = () => {
  analyticsData.events = [];
  analyticsData.pageViews = {};
  analyticsData.featureUsage = {};
  analyticsData.errors = [];
  analyticsData.performance = {};
}; 