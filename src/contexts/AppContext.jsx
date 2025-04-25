import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [affinities, setAffinities] = useState([
    {
      id: "1",
      name: 'Business Traveler',
      description: 'Properties suitable for business travelers',
      score: 4.8,
      status: 'validated'
    },
    {
      id: "2",
      name: 'Family Friendly',
      description: 'Properties ideal for family vacations',
      score: 3.5,
      status: 'enrichment'
    },
    {
      id: "3",
      name: 'Luxury Experience',
      description: 'High-end properties with premium amenities',
      score: 2.1,
      status: 'discovery'
    }
  ]);

  const value = {
    recentlyViewed,
    setRecentlyViewed,
    affinities,
    setAffinities
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 