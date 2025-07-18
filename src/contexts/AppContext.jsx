import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocalRecentlyViewed, addLocalRecentlyViewed, clearLocalRecentlyViewed } from '../utils/recentlyViewed';
import { getRecentlyViewed, addRecentlyViewed, mergeRecentlyViewed, getAffinities } from '../services/apiService';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [affinities, setAffinities] = useState([]);

  // Load affinities on mount
  useEffect(() => {
    async function loadAffinities() {
      try {
        // Load all affinities without pagination limits
        const response = await getAffinities({ page: 1, limit: 1000 });
        setAffinities(response.data || []);
        console.log('AppContext - Loaded affinities:', response.data?.length || 0, 'total affinities');
      } catch (error) {
        console.error('Failed to load affinities:', error);
      }
    }
    loadAffinities();
  }, []);

  // Load recently viewed on mount or user change
  useEffect(() => {
    async function loadRecentlyViewed() {
      if (user && user.id) {
        // Hybrid: merge local and server
        const localList = getLocalRecentlyViewed();
        const merged = await mergeRecentlyViewed(user.id, localList);
        setRecentlyViewed(merged);
        clearLocalRecentlyViewed();
      } else {
        setRecentlyViewed(getLocalRecentlyViewed());
      }
    }
    loadRecentlyViewed();
  }, [user]);

  // Add to recently viewed (hybrid)
  const addToRecentlyViewed = async (affinity) => {
    if (user && user.id) {
      await addRecentlyViewed(user.id, affinity);
      const updated = await getRecentlyViewed(user.id);
      setRecentlyViewed(updated);
    } else {
      const updated = addLocalRecentlyViewed(affinity);
      setRecentlyViewed(updated);
    }
  };

  const toggleFavorite = (affinityId) => {
    setFavorites(prev => {
      const id = String(affinityId);
      const exists = prev.includes(id);
      return exists ? prev.filter(fav => fav !== id) : [...prev, id];
    });
  };

  const value = {
    user,
    setUser,
    recentlyViewed,
    addToRecentlyViewed,
    affinities,
    setAffinities,
    favorites,
    toggleFavorite
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
} 