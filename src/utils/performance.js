/**
 * Performance monitoring utility
 * Provides functions for tracking application performance metrics
 */

import { trackPerformance } from './analytics';

// Performance metric types
export const MetricTypes = {
  API_RESPONSE_TIME: 'api_response_time',
  RENDER_TIME: 'render_time',
  INTERACTION_TIME: 'interaction_time',
  RESOURCE_LOAD_TIME: 'resource_load_time'
};

// Performance data store (in-memory for development)
const performanceData = {
  metrics: {},
  marks: {},
  measures: {}
};

// Start a performance measurement
export const startMeasure = (name) => {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`start_${name}`);
    performanceData.marks[`start_${name}`] = Date.now();
  }
};

// End a performance measurement and record the result
export const endMeasure = (name, details = {}) => {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`end_${name}`);
    performanceData.marks[`end_${name}`] = Date.now();
    
    try {
      performance.measure(name, `start_${name}`, `end_${name}`);
      const entries = performance.getEntriesByName(name);
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        const duration = lastEntry.duration;
        
        // Store the measurement
        if (!performanceData.measures[name]) {
          performanceData.measures[name] = [];
        }
        
        performanceData.measures[name].push({
          duration,
          timestamp: Date.now(),
          details
        });
        
        // Track the performance metric
        trackPerformance(name, duration, details);
        
        return duration;
      }
    } catch (error) {
      console.error(`Error measuring performance for ${name}:`, error);
    }
  } else {
    // Fallback for environments without Performance API
    const startTime = performanceData.marks[`start_${name}`];
    if (startTime) {
      const duration = Date.now() - startTime;
      
      // Store the measurement
      if (!performanceData.measures[name]) {
        performanceData.measures[name] = [];
      }
      
      performanceData.measures[name].push({
        duration,
        timestamp: Date.now(),
        details
      });
      
      // Track the performance metric
      trackPerformance(name, duration, details);
      
      return duration;
    }
  }
  
  return null;
};

// Measure API response time
export const measureApiResponseTime = async (apiCall, name, details = {}) => {
  startMeasure(name);
  try {
    const result = await apiCall();
    endMeasure(name, { ...details, success: true });
    return result;
  } catch (error) {
    endMeasure(name, { ...details, success: false, error: error.message });
    throw error;
  }
};

// Measure component render time
export const measureRenderTime = (componentName) => {
  return {
    onRenderStart: () => startMeasure(`render_${componentName}`),
    onRenderEnd: (details = {}) => endMeasure(`render_${componentName}`, details)
  };
};

// Measure user interaction time
export const measureInteractionTime = (interactionName) => {
  return {
    onInteractionStart: () => startMeasure(`interaction_${interactionName}`),
    onInteractionEnd: (details = {}) => endMeasure(`interaction_${interactionName}`, details)
  };
};

// Get performance data (for development/testing)
export const getPerformanceData = () => {
  return {
    ...performanceData,
    summary: Object.keys(performanceData.measures).reduce((summary, name) => {
      const measures = performanceData.measures[name];
      if (measures.length > 0) {
        const total = measures.reduce((sum, measure) => sum + measure.duration, 0);
        const avg = total / measures.length;
        const min = Math.min(...measures.map(m => m.duration));
        const max = Math.max(...measures.map(m => m.duration));
        
        summary[name] = {
          count: measures.length,
          avg,
          min,
          max,
          total
        };
      }
      return summary;
    }, {})
  };
};

// Clear performance data (for development/testing)
export const clearPerformanceData = () => {
  performanceData.metrics = {};
  performanceData.marks = {};
  performanceData.measures = {};
  
  if (typeof performance !== 'undefined' && performance.clearMarks && performance.clearMeasures) {
    performance.clearMarks();
    performance.clearMeasures();
  }
}; 