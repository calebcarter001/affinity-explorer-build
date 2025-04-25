import { cacheService } from './cacheService';

// Utility function for creating delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

const mockAffinityDetails = {
  "Pet-Friendly": {
    relatedConcepts: ['Family-Friendly', 'Spacious', 'Outdoor Recreation'],
    metrics: {
      accuracy: 0.85,
      coverage: 72,
      completeness: 0.89,
      lastValidated: '2024-03-15'
    }
  },
  "Romantic": {
    relatedConcepts: ['Privacy', 'Luxury', 'Beach Access'],
    metrics: {
      accuracy: 0.78,
      coverage: 65,
      completeness: 0.82,
      lastValidated: '2024-03-10'
    }
  },
  "Family-Friendly": {
    relatedConcepts: ['Pet-Friendly', 'Spacious', 'Safety'],
    metrics: {
      accuracy: 0.92,
      coverage: 81,
      completeness: 0.95,
      lastValidated: '2024-03-20'
    }
  },
  "Luxury": {
    relatedConcepts: ['Premium', 'Upscale Dining', 'Romantic'],
    metrics: {
      accuracy: 0.88,
      coverage: 45,
      completeness: 0.91,
      lastValidated: '2024-03-18'
    }
  }
};

// Create performance data from affinity details with multiple years and quarters
const generateMockPerformanceData = () => {
  const years = [2023, 2024, 2025];
  const quarters = [1, 2, 3, 4];
  const result = [];
  
  Object.entries(mockAffinityDetails).forEach(([name, data], index) => {
    // Generate data for each year and quarter
    years.forEach(year => {
      quarters.forEach(quarter => {
        // Create a date for the first day of the quarter
        const date = new Date(year, (quarter - 1) * 3, 1);
        
        // Generate realistic, non-zero values with proper ratios
        const impressions = Math.floor(Math.random() * 90000) + 10000; // Min 10,000
        const clicks = Math.floor(impressions * (Math.random() * 0.1 + 0.02)); // 2-12% CTR
        const transactions = Math.floor(clicks * (Math.random() * 0.08 + 0.02)); // 2-10% conversion
        const avgOrderValue = Math.floor(Math.random() * 400) + 100; // $100-500 per transaction
        const gpNet = transactions * avgOrderValue;
        
        result.push({
          id: `perf_${index + 1}_${year}_${quarter}`,
          affinityId: (index + 1).toString(),
          name,
          clicks,
          impressions,
          transactions,
          gpNet,
          dateCreated: date.toISOString(),
          lastUpdatedDate: data.metrics.lastValidated
        });
      });
    });
  });
  
  return result;
};

const mockPerformanceData = generateMockPerformanceData();

// Update getAffinities to use cacheService
export const getAffinities = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const cacheKey = cacheService.generateKey('affinities', { page, limit });
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      console.log('🗄️ Returning cached affinities data');
      return cachedData;
    }

    await delay(300);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
    const paginatedData = affinityConcepts.slice(startIndex, endIndex);

    const response = {
      data: paginatedData,
      total: affinityConcepts.length,
    page,
    limit,
      totalPages: Math.ceil(affinityConcepts.length / limit)
    };

    cacheService.set(cacheKey, response);
    return response;
  } catch (error) {
    throw new Error('Failed to fetch affinities');
  }
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
    averageScore: 7.2,
    highestScore: 9.1,
    lowestScore: 5.4,
    propertiesTagged: 1250,
    propertiesWithScore: 980,
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
    averageScore: 6.8,
    highestScore: 8.9,
    lowestScore: 4.7,
    propertiesTagged: 980,
    propertiesWithScore: 850,
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
    averageScore: 7.9,
    highestScore: 9.5,
    lowestScore: 6.2,
    propertiesTagged: 1500,
    propertiesWithScore: 1280,
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
    averageScore: 8.2,
    highestScore: 9.8,
    lowestScore: 6.5,
    propertiesTagged: 750,
    propertiesWithScore: 620,
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
    averageScore: 8.7,
    highestScore: 9.9,
    lowestScore: 7.1,
    propertiesTagged: 580,
    propertiesWithScore: 450,
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

// Update getCollections to use cacheService
export const getCollections = async () => {
  try {
  const cacheKey = cacheService.generateKey('collections');
  const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      console.log('API: Returning cached collections data');
      return cachedData;
    }

    await delay(300);
    const collections = mockCollections;
  
  cacheService.set(cacheKey, collections);
  return collections;
  } catch (error) {
    throw new Error('Failed to fetch collections');
  }
};

// Update clearCollectionsCache to use cacheService
export const clearCollectionsCache = () => {
  const cacheKey = cacheService.generateKey('collections');
  cacheService.clear(cacheKey);
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

// Update getAffinityPerformance to use cacheService
export const getAffinityPerformance = async (affinityId, year, quarter, { page = 1, limit = 10 } = {}) => {
  console.log('⚡ Entering getAffinityPerformance with params:', { affinityId, year, quarter, page, limit });
  try {
    console.log('📊 Preparing to fetch performance data');
    const cacheKey = cacheService.generateKey('performance', { affinityId, year, quarter, page, limit });
    console.log('🔑 Generated cache key:', cacheKey);
    
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      console.log('🗄️ Returning cached performance data');
      return cachedData;
    }

    console.log('⏳ Adding artificial delay...');
    await delay(300);
    console.log('✅ Delay completed');

    console.log('🔍 Filtering performance data...');
    console.log('📊 Total mock data items:', mockPerformanceData.length);
    
    const filteredData = mockPerformanceData.filter(item => {
      try {
        if (affinityId && item.affinityId !== affinityId) {
          console.log(`⏭️ Skipping item ${item.id} - affinityId mismatch`);
          return false;
        }
        
        console.log(`📅 Processing item ${item.id} with date: ${item.dateCreated}`);
        const itemDate = new Date(item.dateCreated);
        
        if (isNaN(itemDate.getTime())) {
          console.log(`⚠️ Invalid date for item ${item.id}: ${item.dateCreated}`);
          return false;
        }
        
        const itemYear = itemDate.getFullYear();
        const itemQuarter = Math.floor(itemDate.getMonth() / 3) + 1;
        
        console.log(`📊 Item ${item.id} date info:`, { 
          itemYear, 
          itemQuarter, 
          targetYear: year, 
          targetQuarter: quarter 
        });
        
        const matches = itemYear === year && itemQuarter === quarter;
        console.log(`🔍 Item ${item.id} ${matches ? 'matches' : 'does not match'} filter criteria`);
        
        return matches;
      } catch (err) {
        console.log(`❌ Error processing item ${item.id}:`, err);
        return false;
      }
    });
    
    console.log(`✅ Filtered data: ${filteredData.length} items match criteria`);

    // Enrich the filtered data with affinity details
    console.log('🔍 Enriching data with affinity details...');
    const enrichedData = filteredData.map(item => {
      const affinityDetails = mockAffinityDetails[item.name] || {};
      return {
        ...item,
        affinityName: item.name,
        affinityType: "Platform Score", // Default value, can be customized based on your needs
        affinityCategory: "Amenities", // Default value, can be customized based on your needs
        affinityStatus: "Active", // Default value, can be customized based on your needs
        affinityMetrics: affinityDetails.metrics || {},
        relatedConcepts: affinityDetails.relatedConcepts || []
      };
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    console.log(`📊 Pagination: ${startIndex} to ${endIndex}`);
    
    const paginatedData = enrichedData.slice(startIndex, endIndex);
    console.log(`📊 Paginated data: ${paginatedData.length} items`);

    const response = {
      data: paginatedData,
      total: enrichedData.length,
      page,
      limit,
      totalPages: Math.ceil(enrichedData.length / limit)
    };

    console.log('💾 Caching response...');
    cacheService.set(cacheKey, response);
    console.log('📈 Performance data received:', response);
    
    if (!response || !response.data) {
      console.log('❌ Invalid response structure:', response);
      throw new Error('Invalid response structure');
    }
    
    console.log('✅ Returning performance data');
    return response;
  } catch (error) {
    console.log('💥 Error in getAffinityPerformance:', {
      error: error,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Mock data constants
const mockLifecycleData = {
  "Pet-Friendly": {
    stages: {
      "Discovery": { status: "Complete", lastUpdated: "2024-06-15", owner: "Jane Smith" },
      "Relationship Definition": { status: "Complete", lastUpdated: "2024-07-22", owner: "Jane Smith" },
      "Concept Enrichment": { status: "Complete", lastUpdated: "2024-08-10", owner: "Alex Johnson" },
      "Weighting Finalized": { status: "Complete", lastUpdated: "2024-09-05", owner: "Alex Johnson" },
      "Scoring Implemented": { status: "Complete", lastUpdated: "2024-10-01", owner: "Michael Chang" },
      "Validation & Distribution": { status: "Complete", lastUpdated: "2024-10-20", owner: "Sarah Wilson" }
    }
  },
  "Romantic": {
    stages: {
      "Discovery": { status: "Complete", lastUpdated: "2024-05-10", owner: "Sarah Wilson" },
      "Relationship Definition": { status: "Complete", lastUpdated: "2024-06-18", owner: "Alex Johnson" },
      "Concept Enrichment": { status: "Complete", lastUpdated: "2024-07-15", owner: "Jane Smith" },
      "Weighting Finalized": { status: "Complete", lastUpdated: "2024-08-20", owner: "Alex Johnson" },
      "Scoring Implemented": { status: "Complete", lastUpdated: "2024-09-12", owner: "Michael Chang" },
      "Validation & Distribution": { status: "Complete", lastUpdated: "2024-10-05", owner: "Sarah Wilson" }
    }
  },
  "Family-Friendly": {
    stages: {
      "Discovery": { status: "Complete", lastUpdated: "2024-07-05", owner: "Jane Smith" },
      "Relationship Definition": { status: "Complete", lastUpdated: "2024-08-12", owner: "Jane Smith" },
      "Concept Enrichment": { status: "Complete", lastUpdated: "2024-09-08", owner: "Alex Johnson" },
      "Weighting Finalized": { status: "In Progress", lastUpdated: "2024-10-20", owner: "Alex Johnson" },
      "Scoring Implemented": { status: "Not Started", lastUpdated: "", owner: "" },
      "Validation & Distribution": { status: "Not Started", lastUpdated: "", owner: "" }
    }
  },
  "Luxury": {
    stages: {
      "Discovery": { status: "Complete", lastUpdated: "2024-04-10", owner: "Michael Chang" },
      "Relationship Definition": { status: "Complete", lastUpdated: "2024-05-15", owner: "Sarah Wilson" },
      "Concept Enrichment": { status: "Complete", lastUpdated: "2024-06-22", owner: "Alex Johnson" },
      "Weighting Finalized": { status: "Complete", lastUpdated: "2024-07-30", owner: "Alex Johnson" },
      "Scoring Implemented": { status: "Complete", lastUpdated: "2024-08-25", owner: "Michael Chang" },
      "Validation & Distribution": { status: "In Progress", lastUpdated: "2024-10-15", owner: "Sarah Wilson" }
    }
  }
};

// New API functions
export const getLifecycleData = async (affinityName = null) => {
  const cacheKey = cacheService.generateKey('lifecycle_data', { affinityName });
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) return cachedData;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return either specific affinity lifecycle or all lifecycles
  const data = affinityName ? 
    { [affinityName]: mockLifecycleData[affinityName] } : 
    mockLifecycleData;

  cacheService.set(cacheKey, data);
  return data;
};

export const getRelatedConcepts = async (affinityName) => {
  const cacheKey = cacheService.generateKey('related_concepts', { affinityName });
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) return cachedData;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock related concepts based on the affinity
  let relatedConcepts = [];
  switch(affinityName.toLowerCase()) {
    case 'pet-friendly':
      relatedConcepts = ['Family-Friendly', 'Spacious', 'Outdoor Recreation'];
      break;
    case 'romantic':
      relatedConcepts = ['Privacy', 'Luxury', 'Beach Access'];
      break;
    case 'family-friendly':
      relatedConcepts = ['Pet-Friendly', 'Spacious', 'Safety'];
      break;
    case 'luxury':
      relatedConcepts = ['Premium', 'Upscale Dining', 'Romantic'];
      break;
    case 'beach access':
      relatedConcepts = ['Ocean View', 'Luxury', 'Romantic'];
      break;
    default:
      relatedConcepts = ['Example Related Concept 1', 'Example Related Concept 2'];
  }

  const data = {
    affinityName,
    relatedConcepts
  };

  cacheService.set(cacheKey, data);
  return data;
};

// Utility functions
const getStatusClass = (status) => {
  switch(status) {
    case 'Validated': return 'badge-validated';
    case 'In Enrichment': return 'badge-enrichment';
    case 'Scoring': return 'badge-scoring';
    case 'Discovery': return 'badge-discovery';
    default: return '';
  }
};

const getScoreClass = (score) => {
  if (score >= 0.8) return 'text-green-600';
  if (score >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

// Additional mock data
const mockCombinationAnalysis = {
  compatibility: {
    "Pet-Friendly + Family-Friendly": 0.95,
    "Pet-Friendly + Luxury": 0.45,
    "Romantic + Luxury": 0.85,
    "Beach Access + Romantic": 0.80,
    "Family-Friendly + Luxury": 0.55
  },
  coverage: {
    "Pet-Friendly + Family-Friendly": 68,
    "Pet-Friendly + Luxury": 35,
    "Romantic + Luxury": 42,
    "Beach Access + Romantic": 45,
    "Family-Friendly + Luxury": 38
  }
};

// Additional API functions
export const analyzeCombination = async (affinities) => {
  const cacheKey = cacheService.generateKey('combination_analysis', { affinities: affinities.sort().join('+') });
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) return cachedData;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate combination key
  const combinationKey = affinities.sort().join(' + ');

  const data = {
    affinities,
    compatibility: mockCombinationAnalysis.compatibility[combinationKey] || 0.5,
    coverage: mockCombinationAnalysis.coverage[combinationKey] || 30,
    recommendations: [
      "Consider adding related concepts for better coverage",
      "Review compatibility scores with similar combinations",
      "Check for overlapping property characteristics"
    ],
    status: "Valid Combination",
    lastUpdated: new Date().toISOString()
  };

  cacheService.set(cacheKey, data);
  return data;
};

export const getAffinityDetails = async (affinityName) => {
  const cacheKey = cacheService.generateKey('affinity_details', { affinityName });
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) return cachedData;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const details = mockAffinityDetails[affinityName] || {
    relatedConcepts: [],
    metrics: {
      accuracy: 0,
      coverage: 0,
      completeness: 0,
      lastValidated: new Date().toISOString().split('T')[0]
    }
  };

  const data = {
    name: affinityName,
    ...details,
    statusClass: getStatusClass(details.status),
    scoreClass: getScoreClass(details.metrics.accuracy)
  };

  cacheService.set(cacheKey, data);
  return data;
};

// Add getMetrics function
export const getMetrics = async () => {
  console.log('📊 Fetching metrics data');
  try {
    const cacheKey = cacheService.generateKey('metrics');
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      console.log('🗄️ Returning cached metrics data');
      return cachedData;
    }

    await delay(300);

    // Mock metrics data
    const metricsData = [
      { id: 1, name: 'Clicks', description: 'Number of clicks on affinity' },
      { id: 2, name: 'Impressions', description: 'Number of times affinity was shown' },
      { id: 3, name: 'Transactions', description: 'Number of transactions attributed to affinity' },
      { id: 4, name: 'GP Net', description: 'Gross profit net for affinity' }
    ];

    const response = {
      data: metricsData,
      total: metricsData.length
    };

    cacheService.set(cacheKey, response);
    console.log('✅ Metrics data fetched:', response);
    return response;
  } catch (error) {
    console.log('💥 Error in getMetrics:', error);
    throw new Error('Failed to fetch metrics');
  }
}; 