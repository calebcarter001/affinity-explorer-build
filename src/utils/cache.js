/**
 * Caching utility
 * Provides functions for caching data in memory and localStorage
 */

// Default cache expiration time (5 minutes)
const DEFAULT_EXPIRATION = 5 * 60 * 1000;

// Memory cache store
const memoryCache = new Map();

// Cache entry class
class CacheEntry {
  constructor(value, expiration = null) {
    this.value = value;
    this.expiration = expiration ? Date.now() + expiration : null;
  }

  isExpired() {
    return this.expiration !== null && Date.now() > this.expiration;
  }
}

// Memory cache operations
export const memoryCacheService = {
  set(key, value, expiration = DEFAULT_EXPIRATION) {
    memoryCache.set(key, new CacheEntry(value, expiration));
  },

  get(key) {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    
    if (entry.isExpired()) {
      memoryCache.delete(key);
      return null;
    }
    
    return entry.value;
  },

  delete(key) {
    memoryCache.delete(key);
  },

  clear() {
    memoryCache.clear();
  }
};

// localStorage cache operations
export const localStorageCacheService = {
  set(key, value, expiration = DEFAULT_EXPIRATION) {
    try {
      const entry = new CacheEntry(value, expiration);
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
    }
  },

  get(key) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const entry = JSON.parse(data);
      const cacheEntry = new CacheEntry(entry.value, entry.expiration);
      
      if (cacheEntry.isExpired()) {
        localStorage.removeItem(key);
        return null;
      }
      
      return cacheEntry.value;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  },

  delete(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to delete from localStorage:', error);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
};

// Cache decorator for functions
export const cache = (fn, options = {}) => {
  const {
    key = fn.name,
    expiration = DEFAULT_EXPIRATION,
    useLocalStorage = false
  } = options;

  const cacheService = useLocalStorage ? localStorageCacheService : memoryCacheService;

  return async (...args) => {
    const cacheKey = typeof key === 'function' ? key(...args) : key;
    const cached = cacheService.get(cacheKey);
    
    if (cached !== null) {
      return cached;
    }
    
    const result = await fn(...args);
    cacheService.set(cacheKey, result, expiration);
    return result;
  };
};

// Cache invalidation decorator
export const invalidateCache = (key, useLocalStorage = false) => {
  const cacheService = useLocalStorage ? localStorageCacheService : memoryCacheService;
  cacheService.delete(key);
};

// Batch cache operations
export const batchCache = {
  set(entries, useLocalStorage = false) {
    const cacheService = useLocalStorage ? localStorageCacheService : memoryCacheService;
    entries.forEach(({ key, value, expiration }) => {
      cacheService.set(key, value, expiration);
    });
  },

  get(keys, useLocalStorage = false) {
    const cacheService = useLocalStorage ? localStorageCacheService : memoryCacheService;
    return keys.map(key => cacheService.get(key));
  },

  delete(keys, useLocalStorage = false) {
    const cacheService = useLocalStorage ? localStorageCacheService : memoryCacheService;
    keys.forEach(key => cacheService.delete(key));
  }
}; 