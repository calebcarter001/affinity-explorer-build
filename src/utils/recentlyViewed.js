// Utility for localStorage-based recently viewed affinities
const LOCAL_KEY = 'recentlyViewedAffinities';

export function getLocalRecentlyViewed() {
  try {
    const data = localStorage.getItem(LOCAL_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
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