// Cache service for client-side caching
const CACHE_PREFIX = 'affinity_explorer_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_CACHE_SIZE = 1000; // Maximum number of cache entries

class CacheService {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      clears: 0
    };

    // Periodically clean expired entries
    setInterval(() => this.clearExpired(), DEFAULT_TTL);
  }

  // Generate a cache key from the endpoint and params
  generateKey(endpoint, params = {}) {
    if (!endpoint) {
      throw new Error('Cache key endpoint is required');
    }

    try {
      const paramString = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => {
          const stringValue = typeof value === 'object' 
            ? JSON.stringify(value) 
            : String(value);
          return `${encodeURIComponent(key)}=${encodeURIComponent(stringValue)}`;
        })
        .join('&');

      return `${CACHE_PREFIX}${endpoint}${paramString ? `?${paramString}` : ''}`;
    } catch (error) {
      console.error('Error generating cache key:', error);
      throw new Error('Failed to generate cache key');
    }
  }

  // Get data from cache
  get(key) {
    try {
      const cached = this.cache.get(key);
      if (!cached) {
        this.stats.misses++;
        return null;
      }

      const { data, timestamp, ttl = DEFAULT_TTL } = cached;
      const now = Date.now();

      // Check if cache has expired
      if (now - timestamp > ttl) {
        this.cache.delete(key);
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      return data;
    } catch (error) {
      console.error('Error retrieving from cache:', error);
      return null;
    }
  }

  // Set data in cache with optional TTL
  set(key, data, ttl = DEFAULT_TTL) {
    try {
      // Check cache size limit
      if (this.cache.size >= MAX_CACHE_SIZE) {
        // Remove oldest entry
        const oldestKey = Array.from(this.cache.entries())
          .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
        this.cache.delete(oldestKey);
      }

      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });
      this.stats.sets++;
    } catch (error) {
      console.error('Error setting cache:', error);
      throw new Error('Failed to set cache entry');
    }
  }

  // Clear specific cache entry
  clear(key) {
    try {
      const deleted = this.cache.delete(key);
      if (deleted) {
        this.stats.clears++;
      }
      return deleted;
    } catch (error) {
      console.error('Error clearing cache entry:', error);
      return false;
    }
  }

  // Clear all cache entries
  clearAll() {
    try {
      const size = this.cache.size;
      this.cache.clear();
      this.stats.clears += size;
    } catch (error) {
      console.error('Error clearing all cache entries:', error);
      throw new Error('Failed to clear cache');
    }
  }

  // Clear expired cache entries
  clearExpired() {
    try {
      const now = Date.now();
      let cleared = 0;
      for (const [key, { timestamp, ttl = DEFAULT_TTL }] of this.cache.entries()) {
        if (now - timestamp > ttl) {
          this.cache.delete(key);
          cleared++;
        }
      }
      if (cleared > 0) {
        this.stats.clears += cleared;
      }
      return cleared;
    } catch (error) {
      console.error('Error clearing expired cache entries:', error);
      return 0;
    }
  }

  // Clear all cache entries with a given prefix
  clearByPrefix(prefix) {
    try {
      const fullPrefix = CACHE_PREFIX + prefix;
      let cleared = 0;
      for (const key of this.cache.keys()) {
        if (key.startsWith(fullPrefix)) {
          this.cache.delete(key);
          cleared++;
        }
      }
      if (cleared > 0) {
        this.stats.clears += cleared;
      }
      return cleared;
    } catch (error) {
      console.error('Error clearing cache by prefix:', error);
      return 0;
    }
  }

  // Get cache statistics
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }
}

export const cacheService = new CacheService(); 