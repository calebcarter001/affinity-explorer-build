import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAffinities, getCollections } from '../services/apiService';

const AffinityDataContext = createContext();

export const useAffinityData = () => {
  const context = useContext(AffinityDataContext);
  if (!context) {
    throw new Error('useAffinityData must be used within an AffinityDataProvider');
  }
  return context;
};

export const AffinityDataProvider = ({ children }) => {
  // Affinities
  const [affinities, setAffinities] = useState([]);
  const [affinitiesLoading, setAffinitiesLoading] = useState(false);
  const [affinitiesError, setAffinitiesError] = useState(null);
  const [affinitiesLoaded, setAffinitiesLoaded] = useState(false);

  // Collections
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionsError, setCollectionsError] = useState(null);
  const [collectionsLoaded, setCollectionsLoaded] = useState(false);

  // Fetch affinities (with caching)
  const fetchAffinities = useCallback(async (force = false) => {
    if (affinitiesLoaded && !force) return;
    setAffinitiesLoading(true);
    setAffinitiesError(null);
    try {
      const response = await getAffinities();
      setAffinities(response.data);
      setAffinitiesLoaded(true);
    } catch (err) {
      setAffinitiesError('Failed to load affinities');
    } finally {
      setAffinitiesLoading(false);
    }
  }, [affinitiesLoaded]);

  // Fetch collections (with caching)
  const fetchCollections = useCallback(async (userId, force = false) => {
    if (collectionsLoaded && !force) return;
    setCollectionsLoading(true);
    setCollectionsError(null);
    try {
      const data = await getCollections(userId);
      setCollections(data);
      setCollectionsLoaded(true);
    } catch (err) {
      setCollectionsError('Failed to load collections');
    } finally {
      setCollectionsLoading(false);
    }
  }, [collectionsLoaded]);

  // Expose state and actions
  const value = {
    affinities,
    affinitiesLoading,
    affinitiesError,
    fetchAffinities,
    setAffinities,
    collections,
    collectionsLoading,
    collectionsError,
    fetchCollections,
    setCollections,
  };

  return (
    <AffinityDataContext.Provider value={value}>
      {children}
    </AffinityDataContext.Provider>
  );
}; 