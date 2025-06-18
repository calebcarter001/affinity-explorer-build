export const mockCollections = [
  // ... existing collections ...
  {
    id: "col2",
    name: "Market Research",
    description: "Collection of affinities used for market analysis and business intelligence",
    type: "research",
    status: "active",
    owner: "Market Research Team",
    dateCreated: "2024-01-15",
    lastModified: "2024-03-15",
    affinities: ["aff4", "aff5"], // Luxury and Business affinities
    metrics: {
      averageAccuracy: 0.87,
      averageCoverage: 72,
      totalProperties: 283,
      scoredProperties: 245,
      implementationProgress: 91
    },
    relationships: {
      parentCollection: null,
      childCollections: ["col4", "col5"],
      relatedCollections: ["col1", "col3"]
    },
    validationStatus: {
      lastValidated: "2024-03-10",
      validatedBy: "Data Quality Team",
      score: 0.92,
      issues: []
    },
    implementation: {
      status: "completed",
      progress: 100,
      startDate: "2024-01-20",
      completionDate: "2024-03-01",
      platforms: ["vrbo", "bex", "hcom"],
      notes: "Successfully implemented across all platforms"
    },
    usage: {
      activeUsers: 45,
      lastUsed: "2024-03-15",
      usageTrend: "increasing",
      popularPlatforms: ["vrbo", "bex"]
    },
    tags: ["market-analysis", "business-intelligence", "luxury-segment", "corporate-travel"],
    permissions: {
      view: ["market-team", "analytics-team", "product-team"],
      edit: ["market-team-lead", "analytics-lead"],
      admin: ["collection-admin"]
    },
    ownerId: "demo@example.com",
    isFavorite: false,
    affinityIds: ["aff4", "aff5"]
  }
  // ... rest of collections
]; 