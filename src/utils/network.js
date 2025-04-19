/**
 * Network request utility
 * Combines error handling and caching for API requests
 */

import { withErrorHandling, withRetry } from './errorHandling';
import { cache } from './cache';

// Default request options
const DEFAULT_OPTIONS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000,
  retryCount: 3,
  useCache: true,
  cacheExpiration: 5 * 60 * 1000 // 5 minutes
};

// Request timeout promise
const timeout = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
};

// Fetch with timeout
const fetchWithTimeout = async (url, options) => {
  const { timeout: timeoutMs, ...fetchOptions } = options;
  return Promise.race([
    fetch(url, fetchOptions),
    timeout(timeoutMs)
  ]);
};

// Process response
const processResponse = async (response) => {
  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
};

// Create request function with caching
const createRequest = (options = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  const request = async (url, requestOptions = {}) => {
    const finalOptions = {
      ...config,
      ...requestOptions,
      headers: {
        ...config.headers,
        ...requestOptions.headers
      }
    };
    
    const response = await fetchWithTimeout(url, finalOptions);
    return processResponse(response);
  };
  
  // Add retry and error handling
  const requestWithRetry = withRetry(request, {
    maxRetries: config.retryCount
  });
  
  const requestWithErrorHandling = withErrorHandling(requestWithRetry);
  
  // Add caching if enabled
  if (config.useCache) {
    return cache(requestWithErrorHandling, {
      expiration: config.cacheExpiration
    });
  }
  
  return requestWithErrorHandling;
};

// HTTP method helpers
export const http = {
  get: (url, options = {}) => createRequest({ ...options, method: 'GET' })(url),
  
  post: (url, data, options = {}) => createRequest({
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  })(url),
  
  put: (url, data, options = {}) => createRequest({
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  })(url),
  
  patch: (url, data, options = {}) => createRequest({
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data)
  })(url),
  
  delete: (url, options = {}) => createRequest({
    ...options,
    method: 'DELETE'
  })(url)
};

// Request builder for complex requests
export const requestBuilder = {
  create: (baseOptions = {}) => {
    const options = { ...DEFAULT_OPTIONS, ...baseOptions };
    
    return {
      get: (url, requestOptions = {}) => http.get(url, { ...options, ...requestOptions }),
      post: (url, data, requestOptions = {}) => http.post(url, data, { ...options, ...requestOptions }),
      put: (url, data, requestOptions = {}) => http.put(url, data, { ...options, ...requestOptions }),
      patch: (url, data, requestOptions = {}) => http.patch(url, data, { ...options, ...requestOptions }),
      delete: (url, requestOptions = {}) => http.delete(url, { ...options, ...requestOptions })
    };
  }
}; 