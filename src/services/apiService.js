import { cacheService } from './cacheService';

// Mock API service with caching and pagination
export const getDashboardStats = async () => {
  const cacheKey = cacheService.generateKey('dashboard_stats');
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) return cachedData;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  const data = {
    // Basic stats
    totalAffinities: 248,
    quarterlyGrowth: 12,
    avgCoverage: 78,
    yearlyGrowthCoverage: 5,
    implementationRate: 85,
    quarterlyGrowthImplementation: 8,
    reuseRate: 92,
    targetDiffReuse: 7,
    
    // Enhanced Goal tracking data
    goals: {
      travelConcepts: {
        total: 50,
        completed: 35,
        inProgress: 10,
        notStarted: 5,
        breakdown: {
          validated: 25,
          inValidation: 10,
          inDevelopment: 10,
          planned: 5
        },
        quarterlyTarget: 45,
        yearlyTarget: 200,
        progressRate: 70,
        lastUpdated: '2024-03-20'
      },
      
      validation: {
        accuracy: {
          current: 68,
          target: 75,
          trend: [65, 68, 70, 68, 72, 68],
          lastSixMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
        },
        coverage: {
          total: 248,
          validated: 170,
          pending: 78,
          breakdown: {
            humanValidated: 120,
            aiValidated: 50,
            needsReview: 28,
            failed: 50
          }
        },
        confidence: {
          high: 142,
          medium: 68,
          low: 38,
          threshold: 0.85
        }
      },
      
      completeness: {
        overall: {
          complete: 180,
          incomplete: 68,
          total: 248,
          percentage: 73
        },
        subScores: {
          attributes: { complete: 223, incomplete: 25, required: true },
          images: { complete: 233, incomplete: 15, required: true },
          reviews: { complete: 238, incomplete: 10, required: true },
          geo: { complete: 240, incomplete: 8, required: false },
          booking: { complete: 238, incomplete: 10, required: true }
        },
        priority: {
          high: 35,
          medium: 22,
          low: 11
        },
        trend: [68, 70, 71, 72, 73, 73]
      },
      
      alignment: {
        quarterly: {
          target: 85,
          current: 78,
          gap: 7,
          initiatives: [
            { name: 'Increase validation rate', progress: 82 },
            { name: 'Improve coverage', progress: 75 },
            { name: 'Enhance completeness', progress: 77 }
          ]
        },
        yearly: {
          target: 95,
          projected: 88,
          gap: 7,
          riskLevel: 'medium'
        }
      }
    },
    
    // Chart data for coverage and accuracy trends
    trends: {
      coverage: {
        data: [65, 59, 80, 81, 56, 55, 70, 75, 82, 85, 78, 80],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      accuracy: {
        data: [45, 50, 55, 58, 62, 65, 68, 70, 72, 75, 73, 75],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      completeness: {
        data: [60, 62, 65, 68, 70, 71, 72, 72, 73, 73, 73, 73],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
    }
  };
  
  cacheService.set(cacheKey, data);
  return data;
};

// Mock affinity data with pagination
export const getAffinities = async (page = 1, limit = 10) => {
  const cacheKey = cacheService.generateKey('affinities', { page, limit });
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) return cachedData;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  const mockAffinities = [
    {
      id: 1,
      name: "all inclusive",
      type: "Platform Score",
      category: "Amenities",
      scoreAvailable: true,
      applicableEntities: ["Property"],
      avgScore: 0.72,
      highestScore: 0.95,
      lowestScore: 0.48,
      status: "Active",
      coverage: 72,
      definition: "Properties that offer comprehensive all-inclusive packages."
    },
    {
      id: 2,
      name: "budget",
      type: "Concept Score",
      category: "Value",
      scoreAvailable: true,
      applicableEntities: ["Property"],
      avgScore: 0.68,
      highestScore: 0.92,
      lowestScore: 0.35,
      status: "Active",
      coverage: 65,
      definition: "Properties that offer good value for budget-conscious travelers."
    },
    {
      id: 3,
      name: "pet friendly",
      type: "Platform Score",
      category: "Family",
      scoreAvailable: true,
      applicableEntities: ["Property"],
      avgScore: 0.79,
      highestScore: 0.98,
      lowestScore: 0.52,
      status: "Active",
      coverage: 81,
      definition: "Properties that welcome pets with amenities or policies that accommodate animals."
    },
    {
      id: 4,
      name: "beach",
      type: "Location Score",
      category: "Location",
      scoreAvailable: true,
      applicableEntities: ["Property"],
      avgScore: 0.82,
      highestScore: 0.99,
      lowestScore: 0.61,
      status: "Active",
      coverage: 45,
      definition: "Properties located near or with access to beaches."
    },
    {
      id: 5,
      name: "outdoor pool",
      type: "Amenity Score",
      category: "Amenities",
      scoreAvailable: true,
      applicableEntities: ["Property"],
      avgScore: 0.87,
      highestScore: 1.00,
      lowestScore: 0.70,
      status: "Active",
      coverage: 38,
      definition: "Properties featuring outdoor swimming pools."
    },
    {
      id: 6,
      name: "ocean view",
      type: "Feature Score",
      category: "Views",
      scoreAvailable: true,
      applicableEntities: ["Property"],
      avgScore: 0.75,
      highestScore: 0.93,
      lowestScore: 0.55,
      status: "Active",
      coverage: 62,
      definition: "Properties offering views of the ocean."
    },
    {
      id: 7,
      name: "cabin",
      type: "Property Type",
      category: "Accommodation",
      scoreAvailable: true,
      applicableEntities: ["Property"],
      avgScore: 0.78,
      highestScore: 0.96,
      lowestScore: 0.58,
      status: "Active",
      coverage: 41,
      definition: "Properties that are cabins or cabin-style accommodations."
    },
    {
      id: 8,
      name: "family friendly",
      type: "Concept Score",
      category: "Family",
      scoreAvailable: true,
      applicableEntities: ["Property"],
      avgScore: 0.69,
      highestScore: 0.91,
      lowestScore: 0.42,
      status: "Active",
      coverage: 33,
      definition: "Properties suitable for families with children."
    },
    {
      id: 9,
      name: "luxury",
      type: "Concept Score",
      category: "Premium",
      scoreAvailable: true,
      applicableEntities: ["Property"],
      avgScore: 0.82,
      highestScore: 0.99,
      lowestScore: 0.61,
      status: "Active",
      coverage: 45,
      definition: "High-end properties offering premium amenities and services."
    },
    {
      id: 10,
      name: "private vacation homes",
      type: "Property Type",
      category: "Accommodation",
      scoreAvailable: true,
      applicableEntities: ["Property"],
      avgScore: 0.75,
      highestScore: 0.93,
      lowestScore: 0.55,
      status: "Active",
      coverage: 62,
      definition: "Private residential properties available for vacation rentals."
    }
  ];

  // Calculate pagination
  const totalCount = mockAffinities.length;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalCount);
  const paginatedData = mockAffinities.slice(startIndex, endIndex);

  const response = {
    data: paginatedData,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    hasNextPage: endIndex < totalCount,
    hasPreviousPage: page > 1
  };

  cacheService.set(cacheKey, response);
  return response;
};

// Mock property search with pagination
export const searchProperties = async (searchTerm, page = 1, limit = 10) => {
  const cacheKey = cacheService.generateKey('properties_search', { searchTerm, page, limit });
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) return cachedData;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data with pagination
  const mockProperties = [
    {
      id: 'PROP001',
      name: 'Grand Hotel Downtown',
      location: 'New York, NY',
      type: 'Hotel',
      description: 'Luxury hotel in the heart of Manhattan',
      priceRange: '$$$',
      rating: 4.5,
      reviewCount: 1250,
      lastUpdated: '2024-03-15',
      affinityScores: [
        { affinityId: 1, name: 'Business Traveler', score: 0.85 },
        { affinityId: 2, name: 'Family Friendly', score: 0.72 },
        { affinityId: 3, name: 'Luxury Experience', score: 0.91 },
        { affinityId: 4, name: 'Budget Conscious', score: 0.48 },
        { affinityId: 5, name: 'Local Experience', score: 0.69 }
      ],
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Business Center'],
      images: [
        'https://example.com/hotel1.jpg',
        'https://example.com/hotel2.jpg'
      ]
    },
    {
      id: 'PROP002',
      name: 'Seaside Resort',
      location: 'Miami Beach, FL',
      type: 'Resort',
      description: 'Beachfront resort with stunning ocean views',
      priceRange: '$$$$',
      rating: 4.8,
      reviewCount: 980,
      lastUpdated: '2024-03-14',
      affinityScores: [
        { affinityId: 1, name: 'Business Traveler', score: 0.62 },
        { affinityId: 2, name: 'Family Friendly', score: 0.87 },
        { affinityId: 3, name: 'Luxury Experience', score: 0.75 },
        { affinityId: 4, name: 'Budget Conscious', score: 0.59 },
        { affinityId: 5, name: 'Local Experience', score: 0.81 }
      ],
      amenities: ['Beach Access', 'Pool', 'Kids Club', 'Restaurant', 'Bar', 'Water Sports'],
      images: [
        'https://example.com/resort1.jpg',
        'https://example.com/resort2.jpg'
      ]
    },
    {
      id: 'PROP003',
      name: 'Mountain Lodge',
      location: 'Aspen, CO',
      type: 'Lodge',
      description: 'Cozy mountain retreat with ski access',
      priceRange: '$$$',
      rating: 4.6,
      reviewCount: 750,
      lastUpdated: '2024-03-13',
      affinityScores: [
        { affinityId: 1, name: 'Business Traveler', score: 5.8 },
        { affinityId: 2, name: 'Family Friendly', score: 7.9 },
        { affinityId: 3, name: 'Luxury Experience', score: 8.3 },
        { affinityId: 4, name: 'Budget Conscious', score: 6.5 },
        { affinityId: 5, name: 'Local Experience', score: 9.2 }
      ],
      amenities: ['Ski Storage', 'Restaurant', 'Spa', 'Fireplace', 'Bar', 'Ski Shuttle'],
      images: [
        'https://example.com/lodge1.jpg',
        'https://example.com/lodge2.jpg'
      ]
    }
  ];
  
  // Filter properties based on search term
  const filteredProperties = searchTerm === '*' 
    ? mockProperties 
    : mockProperties.filter(property => 
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = {
    data: filteredProperties.slice(startIndex, endIndex),
    total: filteredProperties.length,
    page,
    limit,
    totalPages: Math.ceil(filteredProperties.length / limit)
  };
  
  cacheService.set(cacheKey, paginatedData);
  return paginatedData;
};

// Mock data for the application
const affinityConcepts = [
  {
    id: 1,
    name: "Pet-Friendly",
    type: "Platform Score",
    category: "Family",
    scoreAvailable: true,
    applicableEntities: ["Property", "Destination"],
    avgScore: 7.2,
    status: "Active",
    coverage: 72,
    definition: "Properties that welcome pets with amenities or policies that accommodate animals."
  },
  {
    id: 2,
    name: "Romantic",
    type: "Concept Score",
    category: "Adults",
    scoreAvailable: true,
    applicableEntities: ["Property", "Destination", "POI"],
    avgScore: 6.8,
    status: "Active",
    coverage: 65,
    definition: "Properties suitable for couples seeking a romantic experience."
  },
  {
    id: 3,
    name: "Family-Friendly",
    type: "Platform Score",
    category: "Family",
    scoreAvailable: true,
    applicableEntities: ["Property", "Destination"],
    avgScore: 7.9,
    status: "Active",
    coverage: 81,
    definition: "Properties that cater to families with children offering suitable amenities and activities."
  },
  {
    id: 4,
    name: "Luxury",
    type: "Concept Score",
    category: "Premium",
    scoreAvailable: true,
    applicableEntities: ["Property"],
    avgScore: 8.2,
    status: "Active",
    coverage: 45,
    definition: "High-end properties offering premium amenities, services, and experiences."
  },
  {
    id: 5,
    name: "Beach Access",
    type: "Amenity Score",
    category: "Location",
    scoreAvailable: true,
    applicableEntities: ["Property"],
    avgScore: 8.7,
    status: "Active",
    coverage: 38,
    definition: "Properties with direct or convenient access to beaches."
  }
];

const properties = [
  {
    id: "PROP12345",
    name: "Oceanview Resort & Spa",
    location: "Miami Beach, FL",
    propertyType: "Hotel",
    affinityScores: [
      { name: "Pet-Friendly", score: 0.72 },
      { name: "Romantic", score: 0.85 },
      { name: "Luxury", score: 0.91 },
      { name: "Beach Access", score: 0.95 },
      { name: "Privacy", score: 0.82 },
      { name: "Family-Friendly", score: 0.67 }
    ]
  },
  {
    id: "PROP67890",
    name: "Mountain Lodge",
    location: "Aspen, CO",
    propertyType: "Resort",
    affinityScores: [
      { name: "Pet-Friendly", score: 0.87 },
      { name: "Family-Friendly", score: 0.76 },
      { name: "Nature Retreat", score: 0.93 },
      { name: "Privacy", score: 0.88 },
      { name: "Luxury", score: 0.81 }
    ]
  },
  {
    id: "PROP24680",
    name: "City Center Suites",
    location: "New York, NY",
    propertyType: "Hotel",
    affinityScores: [
      { name: "Luxury", score: 0.83 },
      { name: "Pet-Friendly", score: 0.61 },
      { name: "Historical", score: 0.75 },
      { name: "Romantic", score: 0.72 }
    ]
  }
];

// Mock API functions with artificial delay to simulate network requests
export const getProperties = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(properties);
    }, 500);
  });
};

export const getAffinityStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    total: 248,
    completed: 180,
    inProgress: 48,
    pending: 20
  };
};

export const getRecentActivity = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    {
      id: 1,
      type: 'affinity_created',
      timestamp: new Date().toISOString(),
      details: {
        name: 'Pet-Friendly',
        category: 'Family'
      }
    },
    {
      id: 2,
      type: 'affinity_updated',
      timestamp: new Date().toISOString(),
      details: {
        name: 'Romantic',
        category: 'Adults'
      }
    }
  ];
};

export const updateFavorites = async (collectionId, isFavorite) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate API call
  return {
    success: true,
    data: {
      id: collectionId,
      isFavorite
    }
  };
};

export const updateRecentlyViewed = async (affinityId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate API call
  return {
    success: true,
    data: {
      id: affinityId,
      timestamp: new Date().toISOString()
    }
  };
};

export const deleteCollection = async (collectionId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would make an API call to delete the collection
  // For now, we just simulate a successful deletion
  return { success: true };
};

export const getCollections = async () => {
  try {
    const cacheKey = cacheService.generateKey('collections');
    const cachedData = cacheService.get(cacheKey);
    
    if (cachedData) {
      console.log('API: Returning cached collections data');
      return cachedData;
    }

    console.log('API: Fetching fresh collections data');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Define collections with consistent IDs and structure
    const collections = [
      {
        id: 'summer-getaway',
        name: 'Summer Getaway Collection',
        description: 'Perfect for summer vacations and beach getaways',
        affinities: [
          { id: '1', name: 'Beach Access', description: 'Properties with direct or convenient access to beaches' },
          { id: '2', name: 'Family-Friendly', description: 'Properties that cater to families with children' },
          { id: '3', name: 'Pet-Friendly', description: 'Properties that welcome pets' },
          { id: '4', name: 'Luxury', description: 'High-end properties offering premium amenities' },
          { id: '5', name: 'Nature Retreat', description: 'Properties situated in natural surroundings' }
        ],
        isFavorite: true,
        lastUpdated: '2024-03-18'
      },
      {
        id: 'urban-exploration',
        name: 'Urban Exploration Bundle',
        description: 'City-based experiences and accommodations',
        affinities: [
          { id: '6', name: 'Historical', description: 'Properties with historical significance' },
          { id: '4', name: 'Luxury', description: 'High-end properties offering premium amenities' },
          { id: '7', name: 'Romantic', description: 'Properties suitable for couples' }
        ],
        isFavorite: true,
        lastUpdated: '2024-03-18'
      },
      {
        id: 'family-trip',
        name: 'Family Trip Essentials',
        description: 'Family-friendly accommodations and activities',
        affinities: [
          { id: '2', name: 'Family-Friendly', description: 'Properties that cater to families with children' },
          { id: '3', name: 'Pet-Friendly', description: 'Properties that welcome pets' },
          { id: '5', name: 'Nature Retreat', description: 'Properties situated in natural surroundings' },
          { id: '1', name: 'Beach Access', description: 'Properties with direct or convenient access to beaches' }
        ],
        isFavorite: true,
        lastUpdated: '2024-03-18'
      }
    ];
    
    console.log('API: Collections data:', collections.map(c => ({ id: c.id, name: c.name })));
    
    // Cache the data with a 5-minute expiration
    cacheService.set(cacheKey, collections, 5 * 60 * 1000);
    
    return collections;
  } catch (error) {
    console.error('API Error: Failed to fetch collections', error);
    throw new Error('Failed to fetch collections');
  }
};

// Add a function to clear the collections cache
export const clearCollectionsCache = () => {
  const cacheKey = cacheService.generateKey('collections');
  cacheService.remove(cacheKey);
  console.log('API: Collections cache cleared');
};

export const updateCollection = async (collectionId, updates) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get current collections
  const collections = await getCollections();
  const collectionIndex = collections.findIndex(c => c.id === collectionId);
  
  if (collectionIndex === -1) {
    throw new Error('Collection not found');
  }
  
  // Update the collection
  const updatedCollection = {
    ...collections[collectionIndex],
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  
  // In a real implementation, this would be an API call
  // For now, we'll just return the updated collection
  return updatedCollection;
};

export const createCollection = async (collectionData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a new collection with default values
  const newCollection = {
    ...collectionData,
    affinities: [],
    isFavorite: false,
    lastUpdated: new Date().toISOString()
  };
  
  // In a real implementation, this would be an API call
  // For now, we'll just return the new collection
  return newCollection;
};

// Get tagged properties count for an affinity
export const getAffinityTaggedProperties = async (affinityId) => {
  const cacheKey = cacheService.generateKey('affinity_tagged_properties', { affinityId });
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) return cachedData;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data for tagged properties count by ID
  const mockTaggedPropertiesCount = {
    // IDs corresponding to performance data
    1: { tagged: 4, withScore: 4 },  // all inclusive
    2: { tagged: 5, withScore: 5 },  // budget
    3: { tagged: 3, withScore: 3 },  // pet friendly
    4: { tagged: 4, withScore: 4 },  // beach
    5: { tagged: 2, withScore: 2 },  // outdoor pool
    6: { tagged: 3, withScore: 3 },  // ocean view
    7: { tagged: 2, withScore: 2 },  // cabin
    8: { tagged: 4, withScore: 4 },  // family friendly
    9: { tagged: 5, withScore: 5 },  // luxury
    10: { tagged: 2, withScore: 2 }, // private vacation homes
    11: { tagged: 3, withScore: 3 }, // hot tub
    12: { tagged: 4, withScore: 4 }, // spa
    13: { tagged: 3, withScore: 3 }, // apartments
    14: { tagged: 5, withScore: 5 }, // kitchen
    15: { tagged: 2, withScore: 2 }, // adult
    16: { tagged: 4, withScore: 4 }, // free breakfast
    17: { tagged: 2, withScore: 2 }, // casino
    18: { tagged: 3, withScore: 3 }, // free airport transportation
    19: { tagged: 4, withScore: 4 }, // romantic
    20: { tagged: 2, withScore: 2 }, // waterpark
    21: { tagged: 3, withScore: 3 }, // villas
    22: { tagged: 2, withScore: 2 }, // cottages
    23: { tagged: 3, withScore: 3 }, // lgbt welcoming
    24: { tagged: 5, withScore: 5 }, // parking
    25: { tagged: 2, withScore: 2 }, // lake
    26: { tagged: 3, withScore: 3 }, // indoor pool
    27: { tagged: 2, withScore: 2 }, // golf
    28: { tagged: 2, withScore: 2 }, // waterslide
    29: { tagged: 4, withScore: 4 }, // balcony
    30: { tagged: 3, withScore: 3 }  // early check in
  };

  const data = mockTaggedPropertiesCount[affinityId] || { tagged: 0, withScore: 0 };
  cacheService.set(cacheKey, data);
  return data;
}; 