// Utility for localStorage-based recently viewed affinities
const LOCAL_KEY = 'recentlyViewedAffinities';

export function getLocalRecentlyViewed() {
  try {
    const data = localStorage.getItem(LOCAL_KEY);
    const parsed = data ? JSON.parse(data) : [];
    
    // If local storage is empty, return some default recently viewed items
    if (parsed.length === 0) {
      return [
        {
          id: 'def_family-friendly',
          name: 'Family-Friendly',
          lastViewed: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        },
        {
          id: 'def_pet-friendly', 
          name: 'Pet-Friendly',
          lastViewed: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        },
        {
          id: 'def_luxury',
          name: 'Luxury',
          lastViewed: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        },
        {
          id: 'def_wellness',
          name: 'Wellness',
          lastViewed: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        }
      ];
    }
    
    return parsed;
  } catch {
    // If there's an error, return default items
    return [
      {
        id: 'def_family-friendly',
        name: 'Family-Friendly',
        lastViewed: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'def_pet-friendly', 
        name: 'Pet-Friendly',
        lastViewed: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      }
    ];
  }
}

export function addLocalRecentlyViewed(affinity) {
  let list = getLocalRecentlyViewed();
  
  // Ensure consistent ID format
  const normalizedAffinity = {
    ...affinity,
    id: affinity.id.startsWith('aff') ? affinity.id : `aff${affinity.id}`
  };
  
  list = list.filter(a => a.id !== normalizedAffinity.id);
  list.unshift(normalizedAffinity);
  list = list.slice(0, 10);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  return list;
}

export function clearLocalRecentlyViewed() {
  localStorage.removeItem(LOCAL_KEY);
} 