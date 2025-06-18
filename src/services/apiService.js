import { cacheService } from './cacheService';
import axios from 'axios';
import API_CONFIG from '../config/appConfig';

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

// Mock data for the application
const affinityConcepts = [
  {
    id: "aff1",
    name: "Pet-Friendly",
    type: "travel",
    category: "amenity",
    scoreAvailable: true,
    definition: "Properties that welcome pets and provide pet-friendly amenities",
    status: "active",
    applicableEntities: ["hotel", "resort", "vacation_rental"],
    metrics: {
      accuracy: 0.85,
      coverage: 72,
      completeness: 0.89,
      lastValidated: "2024-03-15"
    },
    averageScore: 0.82,
    highestScore: 0.95,
    lowestScore: 0.65,
    coverage: 72,
    propertiesTagged: 156,
    propertiesWithScore: 142,
    // Brand-specific property tracking
    propertiesTaggedVrbo: 85,
    propertiesTaggedBex: 45,
    propertiesTaggedHcom: 26,
    propertiesScoredVrbo: 82,
    propertiesScoredBex: 42,
    propertiesScoredHcom: 18,
    // Implementation metadata
    implementationStatus: {
      vrbo: {
        status: "completed",
        progress: 96,
        lastUpdated: "2024-03-15",
        owner: "Team Alpha"
      },
      bex: {
        status: "in-progress",
        progress: 93,
        lastUpdated: "2024-03-14",
        owner: "Team Beta"
      },
      hcom: {
        status: "at-risk",
        progress: 69,
        lastUpdated: "2024-03-13",
        owner: "Team Gamma"
      }
    },
    dateCreated: "2024-01-15",
    lastUpdatedDate: "2024-03-15"
  },
  {
    id: "aff2",
    name: "Romantic",
    type: "travel",
    category: "experience",
    scoreAvailable: true,
    definition: "Properties ideal for romantic getaways and couples",
    status: "active",
    applicableEntities: ["hotel", "resort", "boutique"],
    metrics: {
      accuracy: 0.78,
      coverage: 65,
      completeness: 0.82,
      lastValidated: "2024-03-10"
    },
    averageScore: 0.75,
    highestScore: 0.88,
    lowestScore: 0.62,
    coverage: 65,
    propertiesTagged: 142,
    propertiesWithScore: 128,
    // Platform-specific property tracking
    propertiesTaggedVrbo: 78,
    propertiesTaggedBex: 38,
    propertiesTaggedHcom: 26,
    propertiesScoredVrbo: 75,
    propertiesScoredBex: 35,
    propertiesScoredHcom: 18,
    // Implementation metadata
    implementationStatus: {
      vrbo: {
        status: "completed",
        progress: 96,
        lastUpdated: "2024-03-10",
        owner: "Team Alpha"
      },
      bex: {
        status: "in-progress",
        progress: 92,
        lastUpdated: "2024-03-09",
        owner: "Team Beta"
      },
      hcom: {
        status: "at-risk",
        progress: 69,
        lastUpdated: "2024-03-08",
        owner: "Team Gamma"
      }
    },
    dateCreated: "2024-01-16",
    lastUpdatedDate: "2024-03-10"
  },
  {
    id: "aff3",
    name: "Family-Friendly",
    type: "travel",
    category: "amenity",
    scoreAvailable: true,
    definition: "Properties suitable for families with children",
    status: "active",
    applicableEntities: ["hotel", "resort", "vacation_rental"],
    metrics: {
      accuracy: 0.92,
      coverage: 81,
      completeness: 0.95,
      lastValidated: "2024-03-20"
    },
    averageScore: 0.89,
    highestScore: 0.98,
    lowestScore: 0.75,
    coverage: 81,
    propertiesTagged: 178,
    propertiesWithScore: 165,
    // Platform-specific property tracking
    propertiesTaggedVrbo: 95,
    propertiesTaggedBex: 48,
    propertiesTaggedHcom: 35,
    propertiesScoredVrbo: 92,
    propertiesScoredBex: 45,
    propertiesScoredHcom: 28,
    // Implementation metadata
    implementationStatus: {
      vrbo: {
        status: "completed",
        progress: 97,
        lastUpdated: "2024-03-20",
        owner: "Team Alpha"
      },
      bex: {
        status: "completed",
        progress: 94,
        lastUpdated: "2024-03-19",
        owner: "Team Beta"
      },
      hcom: {
        status: "in-progress",
        progress: 80,
        lastUpdated: "2024-03-18",
        owner: "Team Gamma"
      }
    },
    dateCreated: "2024-01-17",
    lastUpdatedDate: "2024-03-20"
  },
  {
    id: "aff4",
    name: "Luxury",
    type: "travel",
    category: "experience",
    scoreAvailable: true,
    definition: "High-end properties offering premium amenities and services",
    status: "active",
    applicableEntities: ["hotel", "resort", "boutique"],
    metrics: {
      accuracy: 0.88,
      coverage: 45,
      completeness: 0.91,
      lastValidated: "2024-03-18"
    },
    averageScore: 0.85,
    highestScore: 0.92,
    lowestScore: 0.78,
    coverage: 45,
    propertiesTagged: 98,
    propertiesWithScore: 92,
    // Adding platform-specific property tracking
    propertiesTaggedVrbo: 45,
    propertiesTaggedBex: 30,
    propertiesTaggedHcom: 23,
    propertiesScoredVrbo: 42,
    propertiesScoredBex: 28,
    propertiesScoredHcom: 22,
    // Adding implementation metadata
    implementationStatus: {
      vrbo: {
        status: "completed",
        progress: 93,
        lastUpdated: "2024-03-18",
        owner: "Team Alpha"
      },
      bex: {
        status: "completed",
        progress: 93,
        lastUpdated: "2024-03-17",
        owner: "Team Beta"
      },
      hcom: {
        status: "in-progress",
        progress: 96,
        lastUpdated: "2024-03-16",
        owner: "Team Gamma"
      }
    },
    dateCreated: "2024-01-18",
    lastUpdatedDate: "2024-03-18"
  },
  {
    id: "aff5",
    name: "Business",
    type: "travel",
    category: "purpose",
    scoreAvailable: true,
    definition: "Properties suitable for business travelers",
    status: "active",
    applicableEntities: ["hotel", "resort"],
    metrics: {
      accuracy: 0.86,
      coverage: 68,
      completeness: 0.88,
      lastValidated: "2024-03-12"
    },
    averageScore: 0.83,
    highestScore: 0.90,
    lowestScore: 0.70,
    coverage: 68,
    propertiesTagged: 148,
    propertiesWithScore: 135,
    // Adding platform-specific property tracking
    propertiesTaggedVrbo: 65,
    propertiesTaggedBex: 48,
    propertiesTaggedHcom: 35,
    propertiesScoredVrbo: 60,
    propertiesScoredBex: 45,
    propertiesScoredHcom: 30,
    // Adding implementation metadata
    implementationStatus: {
      vrbo: {
        status: "completed",
        progress: 92,
        lastUpdated: "2024-03-12",
        owner: "Team Alpha"
      },
      bex: {
        status: "completed",
        progress: 94,
        lastUpdated: "2024-03-11",
        owner: "Team Beta"
      },
      hcom: {
        status: "in-progress",
        progress: 86,
        lastUpdated: "2024-03-10",
        owner: "Team Gamma"
      }
    },
    dateCreated: "2024-01-19",
    lastUpdatedDate: "2024-03-12"
  }
];

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
  
  affinityConcepts.forEach((affinity) => {
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
        
        // Ensure we're using the exact same ID format as in affinityConcepts
        const performanceItem = {
          id: `perf_${affinity.id}_${year}_${quarter}`,
          affinityId: affinity.id, // Use the exact same ID format
          name: affinity.name,
          clicks,
          impressions,
          transactions,
          gpNet,
          dateCreated: date.toISOString(),
          lastUpdatedDate: affinity.metrics?.lastValidated || date.toISOString()
        };
        
        result.push(performanceItem);
      });
    });
  });
  
  return result;
};

const mockPerformanceData = generateMockPerformanceData();

// Update getAffinities to use cacheService
export const getAffinities = async ({ page = 1, limit = 10, searchTerm = '' } = {}) => {
  try {
    const cacheKey = cacheService.generateKey('affinities', { page, limit, searchTerm });
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    await delay(300);

    // Filter affinities if searchTerm is provided
    let filteredAffinities = affinityConcepts;
    if (searchTerm) {
      filteredAffinities = affinityConcepts.filter(affinity => 
        affinity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affinity.definition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affinity.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affinity.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ensure consistent ID format (with 'aff' prefix)
    filteredAffinities = filteredAffinities.map(affinity => ({
      ...affinity,
      id: affinity.id.startsWith('aff') ? affinity.id : `aff${affinity.id}`
    }));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredAffinities.slice(startIndex, endIndex);

    const response = {
      data: paginatedData,
      total: filteredAffinities.length,
      page,
      limit,
      totalPages: Math.ceil(filteredAffinities.length / limit)
    };

    cacheService.set(cacheKey, response);
    return response;
  } catch (error) {
    return { data: [], total: 0, page, limit, totalPages: 0 };
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
        { affinityId: "aff1", name: 'Business Traveler', score: 0.85 },
        { affinityId: "aff2", name: 'Family Friendly', score: 0.72 },
        { affinityId: "aff3", name: 'Luxury Experience', score: 0.91 },
        { affinityId: "aff4", name: 'Budget Conscious', score: 0.48 },
        { affinityId: "aff5", name: 'Local Experience', score: 0.69 }
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
        { affinityId: "aff1", name: 'Business Traveler', score: 0.62 },
        { affinityId: "aff2", name: 'Family Friendly', score: 0.87 },
        { affinityId: "aff3", name: 'Luxury Experience', score: 0.75 },
        { affinityId: "aff4", name: 'Budget Conscious', score: 0.59 },
        { affinityId: "aff5", name: 'Local Experience', score: 0.81 }
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
        { affinityId: "aff1", name: 'Business Traveler', score: 5.8 },
        { affinityId: "aff2", name: 'Family Friendly', score: 7.9 },
        { affinityId: "aff3", name: 'Luxury Experience', score: 8.3 },
        { affinityId: "aff4", name: 'Budget Conscious', score: 6.5 },
        { affinityId: "aff5", name: 'Local Experience', score: 9.2 }
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

// Mock properties data
const properties = [
  {
    id: "PROP12345",
    name: "Oceanview Resort & Spa",
    location: "Miami Beach, FL",
    propertyType: "Resort",
    affinityScores: [
      { affinityId: "aff1", score: 0.72 },  // Pet-Friendly
      { affinityId: "aff2", score: 0.85 },  // Romantic
      { affinityId: "aff4", score: 0.91 },  // Luxury
      { affinityId: "aff3", score: 0.67 }   // Family-Friendly
    ]
  },
  {
    id: "PROP67890",
    name: "Mountain Lodge",
    location: "Aspen, CO",
    propertyType: "Resort",
    affinityScores: [
      { affinityId: "aff1", score: 0.87 },  // Pet-Friendly
      { affinityId: "aff3", score: 0.76 },  // Family-Friendly
      { affinityId: "aff4", score: 0.81 }   // Luxury
    ]
  },
  {
    id: "PROP24680",
    name: "City Center Suites",
    location: "New York, NY",
    propertyType: "Hotel",
    affinityScores: [
      { affinityId: "aff2", score: 0.79 },  // Romantic
      { affinityId: "aff4", score: 0.88 }   // Luxury
    ]
  },
  {
    id: "PROP13579",
    name: "Beachfront Paradise",
    location: "Maui, HI",
    propertyType: "Resort",
    affinityScores: [
      { affinityId: "aff2", score: 0.95 },  // Romantic
      { affinityId: "aff4", score: 0.93 },  // Luxury
      { affinityId: "aff3", score: 0.65 }   // Family-Friendly
    ]
  },
  {
    id: "PROP11111",
    name: "Family Fun Resort",
    location: "Orlando, FL",
    propertyType: "Resort",
    affinityScores: [
      { affinityId: "aff3", score: 0.94 },  // Family-Friendly
      { affinityId: "aff1", score: 0.82 },  // Pet-Friendly
      { affinityId: "aff4", score: 0.75 }   // Luxury
    ]
  },
  {
    id: "PROP22222",
    name: "Cozy Mountain Cabin",
    location: "Park City, UT",
    propertyType: "Vacation Rental",
    affinityScores: [
      { affinityId: "aff1", score: 0.89 },  // Pet-Friendly
      { affinityId: "aff2", score: 0.78 },  // Romantic
      { affinityId: "aff3", score: 0.85 }   // Family-Friendly
    ]
  },
  {
    id: "PROP33333",
    name: "Urban Luxury Hotel",
    location: "Chicago, IL",
    propertyType: "Hotel",
    affinityScores: [
      { affinityId: "aff4", score: 0.96 },  // Luxury
      { affinityId: "aff2", score: 0.88 }   // Romantic
    ]
  },
  {
    id: "PROP44444",
    name: "Pet Paradise Inn",
    location: "Portland, OR",
    propertyType: "Hotel",
    affinityScores: [
      { affinityId: "aff1", score: 0.98 },  // Pet-Friendly
      { affinityId: "aff3", score: 0.72 }   // Family-Friendly
    ]
  },
  {
    id: "PROP55555",
    name: "Romantic Vineyard Estate",
    location: "Napa Valley, CA",
    propertyType: "Boutique",
    affinityScores: [
      { affinityId: "aff2", score: 0.97 },  // Romantic
      { affinityId: "aff4", score: 0.89 }   // Luxury
    ]
  },
  {
    id: "PROP66666",
    name: "Adventure Lodge",
    location: "Boulder, CO",
    propertyType: "Lodge",
    affinityScores: [
      { affinityId: "aff1", score: 0.85 },  // Pet-Friendly
      { affinityId: "aff3", score: 0.88 },  // Family-Friendly
      { affinityId: "aff4", score: 0.76 }   // Luxury
    ]
  },
  {
    id: "PROP77777",
    name: "Seaside Family Resort",
    location: "San Diego, CA",
    propertyType: "Resort",
    affinityScores: [
      { affinityId: "aff3", score: 0.92 },  // Family-Friendly
      { affinityId: "aff1", score: 0.75 },  // Pet-Friendly
      { affinityId: "aff2", score: 0.68 }   // Romantic
    ]
  },
  {
    id: "PROP88888",
    name: "Luxury Beach Villa",
    location: "Palm Beach, FL",
    propertyType: "Villa",
    affinityScores: [
      { affinityId: "aff4", score: 0.95 },  // Luxury
      { affinityId: "aff2", score: 0.92 },  // Romantic
      { affinityId: "aff1", score: 0.65 }   // Pet-Friendly
    ]
  },
  {
    id: "PROP99999",
    name: "Mountain View Resort",
    location: "Vail, CO",
    propertyType: "Resort",
    affinityScores: [
      { affinityId: "aff4", score: 0.87 },  // Luxury
      { affinityId: "aff3", score: 0.83 },  // Family-Friendly
      { affinityId: "aff2", score: 0.81 }   // Romantic
    ]
  },
  {
    id: "PROP10101",
    name: "Downtown Boutique Hotel",
    location: "Seattle, WA",
    propertyType: "Boutique",
    affinityScores: [
      { affinityId: "aff2", score: 0.86 },  // Romantic
      { affinityId: "aff4", score: 0.84 }   // Luxury
    ]
  },
  {
    id: "PROP20202",
    name: "Family Beach Resort",
    location: "Myrtle Beach, SC",
    propertyType: "Resort",
    affinityScores: [
      { affinityId: "aff3", score: 0.89 },  // Family-Friendly
      { affinityId: "aff1", score: 0.77 },  // Pet-Friendly
      { affinityId: "aff2", score: 0.71 }   // Romantic
    ]
  },
  {
    id: "PROP30303",
    name: "Historic Luxury Inn",
    location: "Charleston, SC",
    propertyType: "Boutique",
    affinityScores: [
      { affinityId: "aff4", score: 0.92 },  // Luxury
      { affinityId: "aff2", score: 0.90 }   // Romantic
    ]
  },
  {
    id: "PROP40404",
    name: "Lake View Lodge",
    location: "Lake Tahoe, CA",
    propertyType: "Lodge",
    affinityScores: [
      { affinityId: "aff3", score: 0.86 },  // Family-Friendly
      { affinityId: "aff1", score: 0.83 },  // Pet-Friendly
      { affinityId: "aff4", score: 0.79 }   // Luxury
    ]
  },
  {
    id: "PROP50505",
    name: "Desert Oasis Resort",
    location: "Scottsdale, AZ",
    propertyType: "Resort",
    affinityScores: [
      { affinityId: "aff4", score: 0.94 },  // Luxury
      { affinityId: "aff2", score: 0.87 },  // Romantic
      { affinityId: "aff3", score: 0.75 }   // Family-Friendly
    ]
  },
  {
    id: "PROP60606",
    name: "Coastal Pet Resort",
    location: "Newport, RI",
    propertyType: "Resort",
    affinityScores: [
      { affinityId: "aff1", score: 0.93 },  // Pet-Friendly
      { affinityId: "aff3", score: 0.82 },  // Family-Friendly
      { affinityId: "aff2", score: 0.74 }   // Romantic
    ]
  },
  {
    id: "PROP70707",
    name: "Mountain Luxury Chalet",
    location: "Telluride, CO",
    propertyType: "Chalet",
    affinityScores: [
      { affinityId: "aff4", score: 0.96 },  // Luxury
      { affinityId: "aff2", score: 0.93 },  // Romantic
      { affinityId: "aff1", score: 0.68 }   // Pet-Friendly
    ]
  }
];

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

export const deleteCollection = async (collectionId, ownerId) => {
  try {
    // Simulate API delay
    await delay(1000);
    
    // Find the collection index
    const collections = await getCollections(ownerId);
    const collectionIndex = collections.findIndex(c => String(c.id) === String(collectionId));
    
    if (collectionIndex === -1) {
      throw new Error('Collection not found or not owned by user');
    }
    
    // Remove the collection from mockCollections
    const mockIndex = mockCollections.findIndex(c => String(c.id) === String(collectionId));
    if (mockIndex !== -1) {
      mockCollections.splice(mockIndex, 1);
    }
    
    // Clear the cache to ensure fresh data
    clearCollectionsCache();
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Mock collections data with consistent structure
const mockCollections = [
  {
    id: "col1",
    name: "My First Collection",
    description: "A collection of my favorite properties",
    isFavorite: true,
    affinityIds: ["aff1", "aff2"].map(id => String(id)),  // Store normalized IDs
    createdAt: "2024-01-15",
    lastUpdated: "2024-03-15",
    ownerId: "demo@example.com"
  },
  {
    id: "col2",
    name: "Market Research",
    description: "Properties for market analysis",
    isFavorite: false,
    affinityIds: ["aff4", "aff5"].map(id => String(id)),
    createdAt: "2024-01-16",
    lastUpdated: "2024-03-16",
    ownerId: "demo@example.com"
  },
  {
    id: "col3",
    name: "Luxury Escapes",
    description: "High-end properties",
    isFavorite: false,
    affinityIds: ["aff4", "aff2"].map(id => String(id)),
    createdAt: "2024-01-17",
    lastUpdated: "2024-03-17",
    ownerId: "demo@example.com"
  },
  {
    id: "col4",
    name: "Family Adventures",
    description: "Family-friendly destinations",
    isFavorite: true,
    affinityIds: ["aff3", "aff1"].map(id => String(id)),
    createdAt: "2024-01-18",
    lastUpdated: "2024-03-18",
    ownerId: "demo@example.com"
  }
];

// Constants for validation
const COLLECTION_CONSTRAINTS = {
  MAX_AFFINITIES: 50,
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500
};

// Validation helper
const validateCollection = (data, collections, isUpdate = false) => {
  const errors = [];
  
  // Required fields
  if (!data.name?.trim()) {
    errors.push('Collection name is required');
  } else {
    // Name length
    if (data.name.length < COLLECTION_CONSTRAINTS.MIN_NAME_LENGTH) {
      errors.push(`Name must be at least ${COLLECTION_CONSTRAINTS.MIN_NAME_LENGTH} characters`);
    }
    if (data.name.length > COLLECTION_CONSTRAINTS.MAX_NAME_LENGTH) {
      errors.push(`Name cannot exceed ${COLLECTION_CONSTRAINTS.MAX_NAME_LENGTH} characters`);
    }
    
    // Duplicate name check (skip for updates)
    if (!isUpdate && collections.some(c => c.name.toLowerCase() === data.name.toLowerCase())) {
      errors.push('Collection name must be unique');
    }
  }
  
  // Description length
  if (data.description && data.description.length > COLLECTION_CONSTRAINTS.MAX_DESCRIPTION_LENGTH) {
    errors.push(`Description cannot exceed ${COLLECTION_CONSTRAINTS.MAX_DESCRIPTION_LENGTH} characters`);
  }
  
  // Affinity count
  if (data.affinityIds && data.affinityIds.length > COLLECTION_CONSTRAINTS.MAX_AFFINITIES) {
    errors.push(`Cannot exceed ${COLLECTION_CONSTRAINTS.MAX_AFFINITIES} affinities per collection`);
  }
  
  // Owner ID
  if (!data.ownerId) {
    errors.push('Owner ID is required');
  }
  
  return errors;
};

export const createCollection = async (collectionData) => {
  try {
    await delay(1000);
    
    // Validate collection data
    const validationErrors = validateCollection(collectionData, mockCollections);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    // Get fresh affinities data
    const response = await getAffinities();
    const allAffinities = response.data;
    
    // Normalize and validate affinity IDs
    const normalizedAffinityIds = (collectionData.affinityIds || [])
      .map(id => String(id))
      .filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates
    
    // Validate affinities exist
    const invalidIds = normalizedAffinityIds.filter(id => 
      !allAffinities.some(a => String(a.id) === id)
    );
    if (invalidIds.length > 0) {
      throw new Error(`Invalid affinity IDs: ${invalidIds.join(', ')}`);
    }
    
    // Create new collection
    const newCollection = {
      ...collectionData,
      id: `col${mockCollections.length + 1}`,
      affinityIds: normalizedAffinityIds,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    mockCollections.push(newCollection);
    clearCollectionsCache();
    
    // Return the collection with full affinity objects
    const collectionWithAffinities = {
      ...newCollection,
      affinities: allAffinities.filter(a => 
        normalizedAffinityIds.includes(String(a.id))
      )
    };
    
    return collectionWithAffinities;
  } catch (error) {
    throw error;
  }
};

export const updateCollection = async (collectionId, updates, ownerId) => {
  try {
    await delay(1000);
    
    // Get current collections
    const collections = await getCollections(ownerId);
    const collectionIndex = collections.findIndex(c => String(c.id) === String(collectionId));
    
    if (collectionIndex === -1) {
      throw new Error('Collection not found or not owned by user');
    }
    
    // Validate updates
    const validationErrors = validateCollection(
      { ...collections[collectionIndex], ...updates },
      collections.filter(c => c.id !== collectionId),
      true
    );
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    // Normalize affinity IDs if provided
    let normalizedAffinityIds = collections[collectionIndex].affinityIds;
    if (updates.affinityIds) {
      normalizedAffinityIds = updates.affinityIds
        .map(id => String(id))
        .filter((id, index, self) => self.indexOf(id) === index);
        
      // Validate affinities exist
      const response = await getAffinities();
      const allAffinities = response.data;
      const invalidIds = normalizedAffinityIds.filter(id => 
        !allAffinities.some(a => String(a.id) === id)
      );
      if (invalidIds.length > 0) {
        throw new Error(`Invalid affinity IDs: ${invalidIds.join(', ')}`);
      }
      
      // Map IDs to full affinity objects for response
      const updatedAffinities = allAffinities.filter(a => 
        normalizedAffinityIds.includes(String(a.id))
      );
      
      // Update mock data
      const mockIndex = mockCollections.findIndex(c => String(c.id) === String(collectionId));
      if (mockIndex !== -1) {
        mockCollections[mockIndex] = {
          ...mockCollections[mockIndex],
          ...updates,
          affinityIds: normalizedAffinityIds,
          lastUpdated: new Date().toISOString()
        };
      }
      
      // Return updated collection with full affinity objects
      const updatedCollection = {
        ...collections[collectionIndex],
        ...updates,
        affinities: updatedAffinities,
        lastUpdated: new Date().toISOString()
      };
      
      clearCollectionsCache();
      return updatedCollection;
    }
  } catch (error) {
    throw error;
  }
};

export const getCollections = async (ownerId) => {
  try {
    const cacheKey = cacheService.generateKey('collections', { ownerId });
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    await delay(300);
    
    // Get all affinities
    const affinitiesResponse = await getAffinities();
    const allAffinities = affinitiesResponse.data;
    
    // Map collections and convert affinity IDs to full objects
    const collections = mockCollections
      .filter(collection => collection.ownerId === ownerId)
      .map(collection => ({
        ...collection,
        affinities: (collection.affinityIds || [])
          .map(id => {
            const affinity = allAffinities.find(a => String(a.id) === String(id));
            if (!affinity) {
              return null;
            }
            return affinity;
          })
          .filter(Boolean)
      }));

    cacheService.set(cacheKey, collections);
    return collections;
  } catch (error) {
    throw new Error('Failed to fetch collections');
  }
};

// Update clearCollectionsCache to use cacheService
export const clearCollectionsCache = () => {
  cacheService.clearByPrefix('collections');
};

// Update getAffinityPerformance to use cacheService
export const getAffinityPerformance = async (affinityId, year, quarter, { page = 1, limit = 10 } = {}) => {
  try {
    const cacheKey = cacheService.generateKey('performance', { affinityId, year, quarter, page, limit });
    
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    await delay(300);
    
    const filteredData = mockPerformanceData.filter(item => {
      try {
        // Ensure consistent string comparison
        const itemAffinityId = String(item.affinityId);
        const searchAffinityId = String(affinityId);
        
        if (affinityId && itemAffinityId !== searchAffinityId) {
          return false;
        }
        
        const itemDate = new Date(item.dateCreated);
        
        if (isNaN(itemDate.getTime())) {
          return false;
        }
        
        const itemYear = itemDate.getFullYear();
        const itemQuarter = Math.floor(itemDate.getMonth() / 3) + 1;
        
        const matches = itemYear === year && itemQuarter === quarter;
        
        return matches;
      } catch (err) {
        return false;
      }
    });
    
    // Enrich the filtered data with affinity details
    const enrichedData = filteredData.map(item => {
      // Find the matching affinity from affinityConcepts
      const affinity = affinityConcepts.find(a => a.id === item.affinityId);
      
      if (!affinity) {
        return item;
      }
      
      return {
        ...item,
        affinityName: affinity.name,
        affinityType: affinity.type,
        affinityCategory: affinity.category,
        affinityStatus: affinity.status,
        affinityMetrics: affinity.metrics || {},
        relatedConcepts: affinity.applicableEntities || []
      };
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedData = enrichedData.slice(startIndex, endIndex);

    const response = {
      data: paginatedData,
      total: enrichedData.length,
      page,
      limit,
      totalPages: Math.ceil(enrichedData.length / limit)
    };

    cacheService.set(cacheKey, response);
    
    if (!response || !response.data) {
      throw new Error('Invalid response structure');
    }
    
    return response;
  } catch (error) {
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
  },
  "Business": {
    stages: {
      "Discovery": { status: "Complete", lastUpdated: "2024-05-20", owner: "Michael Chang" },
      "Relationship Definition": { status: "Complete", lastUpdated: "2024-06-25", owner: "Sarah Wilson" },
      "Concept Enrichment": { status: "Complete", lastUpdated: "2024-07-30", owner: "Alex Johnson" },
      "Weighting Finalized": { status: "Complete", lastUpdated: "2024-08-15", owner: "Alex Johnson" },
      "Scoring Implemented": { status: "Complete", lastUpdated: "2024-09-20", owner: "Michael Chang" },
      "Validation & Distribution": { status: "Complete", lastUpdated: "2024-10-10", owner: "Sarah Wilson" }
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
    "Family-Friendly + Luxury": 0.55,
    "Business + Luxury": 0.88,
    "Business + Pet-Friendly": 0.45,
    "Business + Family-Friendly": 0.52,
    "Business + Romantic": 0.65
  },
  coverage: {
    "Pet-Friendly + Family-Friendly": 68,
    "Pet-Friendly + Luxury": 35,
    "Romantic + Luxury": 42,
    "Beach Access + Romantic": 45,
    "Family-Friendly + Luxury": 38,
    "Business + Luxury": 48,
    "Business + Pet-Friendly": 32,
    "Business + Family-Friendly": 35,
    "Business + Romantic": 40
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
  try {
    const cacheKey = cacheService.generateKey('metrics');
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
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
    return response;
  } catch (error) {
    throw new Error('Failed to fetch metrics');
  }
};

/**
 * Performs an advanced semantic search for affinities
 * @param {string} query - The search query
 * @param {Object} filters - Optional filters for the search
 * @returns {Promise<Object>} - The search results
 */
export async function advancedSearch({ query, context }) {
  if (typeof query !== 'string') throw new Error('Query must be a string');
  if (query.trim().toLowerCase() === 'test') {
    // Mock affinities with platform_scores and all required metadata
    return {
      results: [
        {
          input_concept: 'Family Friendly',
          category: 'Lifestyle',
          platform_scores: 'location_score,amenities_score,review_score',
          similarity_score: 0.12,
        },
        {
          input_concept: 'Romantic',
          category: 'Experience',
          platform_scores: 'ambience_score,privacy_score,service_score',
          similarity_score: 0.18,
        },
        {
          input_concept: 'Pet Friendly',
          category: 'Lifestyle',
          platform_scores: 'pet_policy_score,cleanliness_score,noise_score',
          similarity_score: 0.22,
        },
        {
          input_concept: 'Business Ready',
          category: 'Business',
          platform_scores: 'wifi_score,workspace_score,location_score',
          similarity_score: 0.27,
        },
      ],
      isMockData: true,
    };
  }
  try {
    const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH}`, 
      { query, context },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Add CORS configuration
        withCredentials: false
      }
    );

    return response.data;
  } catch (error) {
    // Return mock data with a delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockSearchResults(query);
  }
}

/**
 * Generates mock search results for development
 * @param {string} query - The search query
 * @returns {Object} - Mock search results
 */
const generateMockSearchResults = (query) => {
  // Create a delay to simulate network request
  const delay = Math.random() * 500 + 500; // 500-1000ms
  
  // Generate mock results based on the query
  const mockResults = [
    {
      input_concept: query,
      category: 'Travel',
      definition: `A concept related to "${query}" for travel properties`,
      similarity_score: 0.92
    },
    {
      input_concept: `${query} Experience`,
      category: 'Experience',
      definition: `An enhanced ${query} experience for travelers`,
      similarity_score: 0.85
    },
    {
      input_concept: `${query} Friendly`,
      category: 'Amenity',
      definition: `Properties that are ${query} friendly`,
      similarity_score: 0.78
    },
    {
      input_concept: `${query} Focused`,
      category: 'Target Audience',
      definition: `Properties targeting ${query} enthusiasts`,
      similarity_score: 0.72
    },
    {
      input_concept: `${query} Destination`,
      category: 'Location',
      definition: `Destinations known for ${query}`,
      similarity_score: 0.65
    }
  ];
  
  // Return a promise that resolves after the delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        results: mockResults,
        total: mockResults.length,
        query: query,
      });
    }, delay);
  });
};

// Dashboard configuration and mock data for UI (centralized)
export const getDashboardConfig = async () => {
  // Simulate API delay
  await delay(100);
  // All dashboard stats and progress values in one place
  const config = {
    affinityExpansion: {
      current: 10,
      target: 50,
      status: 'in_progress',
      lastUpdated: '2024-03-20'
    },
    accuracy: {
      current: 20,
      target: 95,
      status: 'needs_improvement',
      lastUpdated: '2024-03-20',
      validationStrategies: [
        { name: 'Automated Validation', contribution: 8 },
        { name: 'Manual Review', contribution: 7 },
        { name: 'User Feedback', contribution: 5 }
      ]
    },
    completeness: {
      current: 45,
      target: 100,
      status: 'in_progress',
      lastUpdated: '2024-03-20',
      subScores: [
        { name: 'Data Quality', score: 40 },
        { name: 'Coverage', score: 50 },
        { name: 'Consistency', score: 45 }
      ]
    },
    // Additional dashboard stats
    quarterlyGrowth: 12,
    avgCoverage: 78,
    yearlyGrowthCoverage: 5,
    implementationRate: 85,
    quarterlyGrowthImplementation: 8,
    reuseRate: 92,
    targetDiffReuse: 7,
    // Trends and chart data
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
    },
    // Config for progress bars and pie chart (can be extended as needed)
    progressBar: {
      color: 'purple',
      height: 2
    },
    accuracyPieChart: {
      colors: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)'
      ],
      borderColors: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)'
      ]
    }
  };
  // Type and error checking
  if (typeof config.affinityExpansion.current !== 'number' || typeof config.affinityExpansion.target !== 'number') {
    throw new Error('Invalid affinityExpansion values');
  }
  if (typeof config.accuracy.current !== 'number' || typeof config.accuracy.target !== 'number') {
    throw new Error('Invalid accuracy values');
  }
  if (typeof config.completeness.current !== 'number' || typeof config.completeness.target !== 'number') {
    throw new Error('Invalid completeness values');
  }
  if (!Array.isArray(config.trends.coverage.data) || !Array.isArray(config.trends.coverage.labels)) {
    throw new Error('Invalid trends data');
  }
  return config;
};

// Mock recently viewed storage (in-memory for demo)
let mockRecentlyViewed = {
  // userId: [affinity, ...]
};

export const getRecentlyViewed = async (userId) => {
  await delay(100);
  return mockRecentlyViewed[userId] || [];
};

export const addRecentlyViewed = async (userId, affinity) => {
  await delay(50);
  if (!mockRecentlyViewed[userId]) mockRecentlyViewed[userId] = [];
  
  // Ensure consistent ID format
  const normalizedAffinity = {
    ...affinity,
    id: affinity.id.startsWith('aff') ? affinity.id : `aff${affinity.id}`
  };
  
  // Remove if already exists
  mockRecentlyViewed[userId] = mockRecentlyViewed[userId].filter(a => a.id !== normalizedAffinity.id);
  // Add to front
  mockRecentlyViewed[userId].unshift(normalizedAffinity);
  // Keep max 10
  mockRecentlyViewed[userId] = mockRecentlyViewed[userId].slice(0, 10);
  return mockRecentlyViewed[userId];
};

export const mergeRecentlyViewed = async (userId, localList) => {
  await delay(100);
  const serverList = mockRecentlyViewed[userId] || [];
  
  // Normalize IDs in local list
  const normalizedLocalList = localList.map(item => ({
    ...item,
    id: item.id.startsWith('aff') ? item.id : `aff${item.id}`
  }));
  
  // Merge, dedupe by id, keep most recent first
  const merged = [...normalizedLocalList, ...serverList].reduce((acc, item) => {
    if (!acc.find(a => a.id === item.id)) acc.push(item);
    return acc;
  }, []);
  mockRecentlyViewed[userId] = merged.slice(0, 10);
  return mockRecentlyViewed[userId];
};

// Get implementation readiness data for a specific affinity
const getImplementationReadiness = async (affinityId) => {
  await delay(300);
  const affinity = affinityConcepts.find(a => a.id === affinityId);
  if (!affinity) {
    throw new Error('Affinity not found');
  }
  return affinity.implementationStatus;
};

// Get platform-specific property counts for an affinity
const getPlatformPropertyCounts = async (affinityId) => {
  await delay(300);
  const affinity = affinityConcepts.find(a => a.id === affinityId);
  if (!affinity) {
    throw new Error('Affinity not found');
  }
  return {
    vrbo: {
      tagged: affinity.propertiesTaggedVrbo,
      scored: affinity.propertiesScoredVrbo
    },
    bex: {
      tagged: affinity.propertiesTaggedBex,
      scored: affinity.propertiesScoredBex
    },
    hcom: {
      tagged: affinity.propertiesTaggedHcom,
      scored: affinity.propertiesScoredHcom
    }
  };
};

// Get implementation readiness summary for a collection
const getCollectionImplementationReadiness = async (collectionId) => {
  await delay(300);
  const collection = mockCollections.find(c => c.id === collectionId);
  if (!collection) {
    throw new Error('Collection not found');
  }

  // Get all affinities in the collection
  const collectionAffinities = collection.affinityIds.map(id => 
    affinityConcepts.find(a => a.id === id)
  ).filter(Boolean);

  // Calculate aggregate metrics
  const summary = {
    vrbo: {
      status: "in-progress",
      progress: 0,
      lastUpdated: null,
      owner: null,
      totalTagged: 0,
      totalScored: 0
    },
    bex: {
      status: "in-progress",
      progress: 0,
      lastUpdated: null,
      owner: null,
      totalTagged: 0,
      totalScored: 0
    },
    hcom: {
      status: "in-progress",
      progress: 0,
      lastUpdated: null,
      owner: null,
      totalTagged: 0,
      totalScored: 0
    }
  };

  // Aggregate metrics across all affinities
  collectionAffinities.forEach(affinity => {
    ['vrbo', 'bex', 'hcom'].forEach(platform => {
      const platformData = affinity.implementationStatus[platform];
      const platformProps = {
        tagged: affinity[`propertiesTagged${platform.charAt(0).toUpperCase() + platform.slice(1)}`],
        scored: affinity[`propertiesScored${platform.charAt(0).toUpperCase() + platform.slice(1)}`]
      };

      summary[platform].totalTagged += platformProps.tagged;
      summary[platform].totalScored += platformProps.scored;

      // Update status based on most recent update
      if (!summary[platform].lastUpdated || 
          new Date(platformData.lastUpdated) > new Date(summary[platform].lastUpdated)) {
        summary[platform].lastUpdated = platformData.lastUpdated;
        summary[platform].owner = platformData.owner;
      }

      // Calculate overall progress
      summary[platform].progress = Math.round(
        (summary[platform].totalScored / summary[platform].totalTagged) * 100
      );

      // Determine overall status
      if (summary[platform].progress >= 95) {
        summary[platform].status = "completed";
      } else if (summary[platform].progress < 70) {
        summary[platform].status = "at-risk";
      } else {
        summary[platform].status = "in-progress";
      }
    });
  });

  return summary;
};

/**
 * Simulates fetching brand-specific property data for an affinity.
 * Returns an object with propertiesTaggedVrbo, propertiesTaggedBex, propertiesTaggedHcom,
 * propertiesScoredVrbo, propertiesScoredBex, propertiesScoredHcom.
 */
export async function enrichAffinityWithBrandData(affinityId) {
  try {
    await delay(300 + Math.random() * 300); // Simulate network delay
    const affinity = affinityConcepts.find(a => a.id === affinityId);
    if (!affinity) throw new Error('Affinity not found');
    // Use existing data if present, otherwise generate mock values
    return {
      propertiesTaggedVrbo: affinity.propertiesTaggedVrbo ?? Math.floor(Math.random() * 100) + 20,
      propertiesTaggedBex: affinity.propertiesTaggedBex ?? Math.floor(Math.random() * 100) + 20,
      propertiesTaggedHcom: affinity.propertiesTaggedHcom ?? Math.floor(Math.random() * 100) + 20,
      propertiesScoredVrbo: affinity.propertiesScoredVrbo ?? Math.floor(Math.random() * 90) + 10,
      propertiesScoredBex: affinity.propertiesScoredBex ?? Math.floor(Math.random() * 90) + 10,
      propertiesScoredHcom: affinity.propertiesScoredHcom ?? Math.floor(Math.random() * 90) + 10,
    };
  } catch (error) {
    // Return null or throw, depending on how you want to handle errors
    return { error: error.message };
  }
}

// Export the new functions
export {
  // ... existing exports ...
  getImplementationReadiness,
  getPlatformPropertyCounts,
  getCollectionImplementationReadiness
}; 