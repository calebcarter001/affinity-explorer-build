// Mock API service
export const getDashboardStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
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
};

// Mock affinity data
export const getAffinities = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
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
};

// Mock property search
export const searchProperties = async (searchTerm) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
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
  
  // If search term is a wildcard, return all properties
  if (searchTerm === '*') {
    return mockProperties;
  }
  
  // Filter properties based on search term
  const searchTermLower = searchTerm.toLowerCase();
  return mockProperties.filter(property => 
    property.name.toLowerCase().includes(searchTermLower) ||
    property.location.toLowerCase().includes(searchTermLower) ||
    property.id.toLowerCase().includes(searchTermLower) ||
    property.type.toLowerCase().includes(searchTermLower) ||
    property.description.toLowerCase().includes(searchTermLower) ||
    property.amenities.some(amenity => amenity.toLowerCase().includes(searchTermLower))
  );
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