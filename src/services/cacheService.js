// Cache service for client-side caching
const CACHE_PREFIX = 'affinity_explorer_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  // Generate a cache key from the endpoint and params
  generateKey(endpoint, params = {}) {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return `${CACHE_PREFIX}${endpoint}${paramString ? `?${paramString}` : ''}`;
  }

  // Get data from cache
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const { data, timestamp } = cached;
    const now = Date.now();

    // Check if cache has expired
    if (now - timestamp > DEFAULT_TTL) {
      this.cache.delete(key);
      return null;
    }

    return data;
  }

  // Set data in cache
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Clear specific cache entry
  clear(key) {
    this.cache.delete(key);
  }

  // Clear all cache entries
  clearAll() {
    this.cache.clear();
  }

  // Clear expired cache entries
  clearExpired() {
    const now = Date.now();
    for (const [key, { timestamp }] of this.cache.entries()) {
      if (now - timestamp > DEFAULT_TTL) {
        this.cache.delete(key);
      }
    }
  }

  // Clear all cache entries with a given prefix
  clearByPrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(CACHE_PREFIX + prefix)) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheService = new CacheService(); 