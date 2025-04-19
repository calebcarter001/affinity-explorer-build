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
      name: "Pet-Friendly",
      type: "Platform Score",
      category: "Family",
      scoreAvailable: true,
      applicableEntities: ["Property", "Destination"],
      avgScore: 7.2,
      status: "Validated",
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
      status: "Validated",
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
      status: "Validated",
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
      status: "Validated",
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
      status: "Validated",
      coverage: 38,
      definition: "Properties with direct or convenient access to beaches."
    },
    {
      id: 6,
      name: "Privacy",
      type: "Concept Score",
      category: "Adults",
      scoreAvailable: true,
      applicableEntities: ["Property"],
      avgScore: 7.5,
      status: "In Enrichment",
      coverage: 62,
      definition: "Properties offering secluded or private accommodations away from crowds."
    },
    {
      id: 7,
      name: "Nature Retreat",
      type: "Concept Score",
      category: "Outdoors",
      scoreAvailable: true,
      applicableEntities: ["Property", "Destination"],
      avgScore: 7.8,
      status: "In Enrichment",
      coverage: 41,
      definition: "Properties situated in natural surroundings with minimal urban development."
    },
    {
      id: 8,
      name: "Historical",
      type: "Concept Score",
      category: "Cultural",
      scoreAvailable: true,
      applicableEntities: ["Property", "Destination", "POI"],
      avgScore: 6.9,
      status: "Validated",
      coverage: 33,
      definition: "Properties with historical significance or located in historical areas."
    }
  ];

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = {
    data: mockAffinities.slice(startIndex, endIndex),
    total: mockAffinities.length,
    page,
    limit,
    totalPages: Math.ceil(mockAffinities.length / limit)
  };
  
  cacheService.set(cacheKey, paginatedData);
  return paginatedData;
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
        { affinityId: 1, name: 'Business Traveler', score: 8.5 },
        { affinityId: 2, name: 'Family Friendly', score: 7.2 },
        { affinityId: 3, name: 'Luxury Experience', score: 9.1 },
        { affinityId: 4, name: 'Budget Conscious', score: 4.8 },
        { affinityId: 5, name: 'Local Experience', score: 6.9 }
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
        { affinityId: 1, name: 'Business Traveler', score: 6.2 },
        { affinityId: 2, name: 'Family Friendly', score: 8.7 },
        { affinityId: 3, name: 'Luxury Experience', score: 7.5 },
        { affinityId: 4, name: 'Budget Conscious', score: 5.9 },
        { affinityId: 5, name: 'Local Experience', score: 8.1 }
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
    status: "Validated",
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
    status: "Validated",
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
    status: "Validated",
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
    status: "Validated",
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
    status: "Validated",
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
      { name: "Pet-Friendly", score: 7.2 },
      { name: "Romantic", score: 8.5 },
      { name: "Luxury", score: 9.1 },
      { name: "Beach Access", score: 9.5 },
      { name: "Privacy", score: 8.2 },
      { name: "Family-Friendly", score: 6.7 }
    ]
  },
  {
    id: "PROP67890",
    name: "Mountain Lodge",
    location: "Aspen, CO",
    propertyType: "Resort",
    affinityScores: [
      { name: "Pet-Friendly", score: 8.7 },
      { name: "Family-Friendly", score: 7.6 },
      { name: "Nature Retreat", score: 9.3 },
      { name: "Privacy", score: 8.8 },
      { name: "Luxury", score: 8.1 }
    ]
  },
  {
    id: "PROP24680",
    name: "City Center Suites",
    location: "New York, NY",
    propertyType: "Hotel",
    affinityScores: [
      { name: "Luxury", score: 8.3 },
      { name: "Pet-Friendly", score: 6.1 },
      { name: "Historical", score: 7.5 },
      { name: "Romantic", score: 7.2 }
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

export const updateFavorites = async (collectionName, isFavorite) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate API call
  return {
    success: true,
    data: {
      name: collectionName,
      isFavorite
    }
  };
};

export const updateRecentlyViewed = async (affinityName) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate API call
  return {
    success: true,
    data: {
      name: affinityName,
      timestamp: new Date().toISOString()
    }
  };
};

export const deleteCollection = async (collectionName) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would make an API call to delete the collection
  // For now, we just simulate a successful deletion
  return { success: true };
};

export const getCollections = async () => {
  const cacheKey = cacheService.generateKey('collections');
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) return cachedData;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  const collections = [
    {
      name: 'Summer Getaway Collection',
      description: 'Perfect properties for summer vacations',
      affinities: [
        { name: 'Beach Access', description: 'Properties with direct or convenient access to beaches' },
        { name: 'Family-Friendly', description: 'Properties that cater to families with children' },
        { name: 'Pet-Friendly', description: 'Properties that welcome pets' },
        { name: 'Luxury', description: 'High-end properties offering premium amenities' },
        { name: 'Nature Retreat', description: 'Properties situated in natural surroundings' }
      ],
      isFavorite: true,
      lastUpdated: '2024-03-20'
    },
    {
      name: 'Urban Exploration Bundle',
      description: 'City-focused properties and experiences',
      affinities: [
        { name: 'Historical', description: 'Properties with historical significance' },
        { name: 'Luxury', description: 'High-end properties offering premium amenities' },
        { name: 'Romantic', description: 'Properties suitable for couples' }
      ],
      isFavorite: true,
      lastUpdated: '2024-03-19'
    },
    {
      name: 'Family Trip Essentials',
      description: 'Family-friendly accommodations and activities',
      affinities: [
        { name: 'Family-Friendly', description: 'Properties that cater to families with children' },
        { name: 'Pet-Friendly', description: 'Properties that welcome pets' },
        { name: 'Nature Retreat', description: 'Properties situated in natural surroundings' },
        { name: 'Beach Access', description: 'Properties with direct or convenient access to beaches' }
      ],
      isFavorite: true,
      lastUpdated: '2024-03-18'
    }
  ];
  
  cacheService.set(cacheKey, collections);
  return collections;
};

export const updateCollection = async (collectionName, updates) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get current collections
  const collections = await getCollections();
  const collectionIndex = collections.findIndex(c => c.name === collectionName);
  
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
  
  // Mock data for tagged properties count
  const mockTaggedPropertiesCount = {
    "Pet-Friendly": { tagged: 3, withScore: 3 },
    "Romantic": { tagged: 2, withScore: 2 },
    "Family-Friendly": { tagged: 2, withScore: 2 },
    "Luxury": { tagged: 3, withScore: 3 },
    "Beach Access": { tagged: 1, withScore: 1 },
    "Privacy": { tagged: 2, withScore: 2 },
    "Nature Retreat": { tagged: 1, withScore: 1 },
    "Historical": { tagged: 1, withScore: 1 }
  };

  const data = mockTaggedPropertiesCount[affinityId] || { tagged: 0, withScore: 0 };
  cacheService.set(cacheKey, data);
  return data;
}; 