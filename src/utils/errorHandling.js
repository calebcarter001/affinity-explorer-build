/**
 * Network error handling utility
 * Provides functions for handling API errors, retries, and error logging
 */

// Maximum number of retry attempts
const MAX_RETRIES = 3;

// Base delay between retries (in milliseconds)
const BASE_DELAY = 1000;

// Error types for better error handling
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error class for API errors
export class APIError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, status = 500, data = null) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.status = status;
    this.data = data;
  }
}

// Determine error type based on status code
export const getErrorType = (status) => {
  switch (status) {
    case 400:
      return ErrorTypes.VALIDATION;
    case 401:
      return ErrorTypes.AUTHENTICATION;
    case 403:
      return ErrorTypes.AUTHORIZATION;
    case 404:
      return ErrorTypes.NOT_FOUND;
    case 500:
      return ErrorTypes.SERVER;
    default:
      return ErrorTypes.UNKNOWN;
  }
};

// Calculate delay for exponential backoff
const calculateDelay = (attempt) => {
  return Math.min(BASE_DELAY * Math.pow(2, attempt), 10000);
};

// Retry function with exponential backoff
export const withRetry = async (fn, maxRetries = MAX_RETRIES) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's not a network error or server error
      if (error.type !== ErrorTypes.NETWORK && error.type !== ErrorTypes.SERVER) {
        throw error;
      }
      
      // If we've reached max retries, throw the last error
      if (attempt === maxRetries - 1) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, calculateDelay(attempt)));
    }
  }
  
  throw lastError;
};

// Error logging function
export const logError = (error, context = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      type: error.type,
      status: error.status,
      data: error.data,
      stack: error.stack
    },
    context
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', errorLog);
  }
  
  // TODO: Send to error tracking service (e.g., Sentry)
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: context });
  // }
};

// Error handler for API calls
export const handleAPIError = (error) => {
  // Convert to APIError if it's not already
  const apiError = error instanceof APIError ? error : new APIError(
    error.message || 'An unexpected error occurred',
    error.type || ErrorTypes.UNKNOWN,
    error.status || 500,
    error.data
  );
  
  // Log the error
  logError(apiError);
  
  return apiError;
};

// Network error handler
export const handleNetworkError = (error) => {
  const networkError = new APIError(
    'Network error occurred. Please check your connection.',
    ErrorTypes.NETWORK,
    0
  );
  
  logError(networkError, { originalError: error });
  
  return networkError;
};

// Timeout error handler
export const handleTimeoutError = (timeout = 5000) => {
  return new APIError(
    `Request timed out after ${timeout}ms`,
    ErrorTypes.TIMEOUT,
    0
  );
};

// Wrap API calls with error handling
export const withErrorHandling = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw handleNetworkError(error);
    }
    throw handleAPIError(error);
  }
}; 