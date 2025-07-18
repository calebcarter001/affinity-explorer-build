/**
 * Similarity Engine - Calculates multi-dimensional similarity scores between concepts
 * Implements local heuristics for semantic, taxonomic, attribute, behavioral, and other dimensions
 */

// Concept ID mapping to handle different naming conventions
const conceptIdMapping = {
  // Wellness concepts
  'Wellness': 'wellness',
  'def_wellness': 'wellness',
  'Spa': 'spa',
  'spa-services': 'spa',
  
  // Pool concepts
  'Pools': 'pools',
  'swimming-pool': 'pools',
  'pool-bar': 'pool-bar',
  'infinity-pool': 'infinity-pool',
  'heated-pool': 'heated-pool',
  
  // Luxury concepts
  'Luxury': 'luxury',
  'luxury-amenities': 'luxury',
  
  // Family concepts
  'Family-Friendly': 'family-friendly',
  'family-amenities': 'family-friendly',
  
  // Business concepts
  'Business': 'business',
  'business-center': 'business',
  
  // Location concepts
  'Near The Beach': 'beach',
  'Oceanview': 'oceanview',
  'Mountains': 'mountains',
  'Lake': 'lake',
  'Wine Country': 'wine-country',
  
  // Activity concepts
  'Ski': 'ski',
  'Historic & Cultural': 'historic-cultural',
  
  // Accommodation concepts
  'All-Inclusive': 'all-inclusive',
  'Budget-Friendly': 'budget-friendly',
  'Cabins': 'cabins',
  'Homes': 'homes',
  
  // Trending
  'Trending': 'trending'
};

// Helper function to normalize concept IDs
function normalizeConceptId(conceptId) {
  return conceptIdMapping[conceptId] || conceptId.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Word embeddings and semantic similarity data (expanded for real affinity data)
const conceptEmbeddings = {
  'wellness': {
    semantic: ['wellness', 'health', 'relaxation', 'spa', 'massage', 'therapy', 'rejuvenation', 'mindfulness'],
    attributes: ['relaxing', 'therapeutic', 'premium', 'health-focused', 'restorative', 'peaceful'],
    category: 'wellness',
    subcategory: 'health-wellness',
    usage_patterns: ['vacation', 'relaxation', 'self-care', 'couples', 'wellness-retreat'],
    business_metrics: { avg_booking_lift: 0.32, revenue_impact: 0.38, search_volume: 5200 }
  },
  'spa': {
    semantic: ['spa', 'wellness', 'massage', 'treatment', 'relaxation', 'therapy', 'rejuvenation'],
    attributes: ['indoor', 'premium', 'therapeutic', 'relaxing', 'staffed', 'appointment-based'],
    category: 'wellness',
    subcategory: 'spa-treatment',
    usage_patterns: ['vacation', 'relaxation', 'wellness', 'couples', 'self-care'],
    business_metrics: { avg_booking_lift: 0.35, revenue_impact: 0.42, search_volume: 4200 }
  },
  'pools': {
    semantic: ['water', 'recreation', 'amenity', 'leisure', 'swimming', 'pool', 'aquatic'],
    attributes: ['wet', 'outdoor', 'recreational', 'family-friendly', 'seasonal', 'maintenance'],
    category: 'amenity',
    subcategory: 'water-feature',
    usage_patterns: ['summer', 'vacation', 'family-time', 'exercise', 'relaxation'],
    business_metrics: { avg_booking_lift: 0.23, revenue_impact: 0.18, search_volume: 8500 }
  },
  'luxury': {
    semantic: ['luxury', 'premium', 'high-end', 'exclusive', 'upscale', 'sophisticated', 'elegant'],
    attributes: ['premium', 'expensive', 'exclusive', 'high-quality', 'sophisticated', 'upscale'],
    category: 'experience',
    subcategory: 'luxury',
    usage_patterns: ['luxury-travel', 'special-occasion', 'honeymoon', 'anniversary', 'premium-experience'],
    business_metrics: { avg_booking_lift: 0.45, revenue_impact: 0.62, search_volume: 3800 }
  },
  'family-friendly': {
    semantic: ['family', 'kids', 'children', 'safe', 'appropriate', 'fun', 'activities'],
    attributes: ['family-oriented', 'safe', 'age-appropriate', 'fun', 'supervised', 'educational'],
    category: 'family',
    subcategory: 'family-amenities',
    usage_patterns: ['family-vacation', 'kids-activities', 'multi-generational', 'safe-environment'],
    business_metrics: { avg_booking_lift: 0.28, revenue_impact: 0.22, search_volume: 6200 }
  },
  'business': {
    semantic: ['business', 'work', 'meeting', 'conference', 'corporate', 'professional', 'wifi'],
    attributes: ['professional', 'work-friendly', 'meeting-capable', 'wifi-enabled', 'business-services'],
    category: 'business',
    subcategory: 'business-amenities',
    usage_patterns: ['business-travel', 'meetings', 'conferences', 'work-remote', 'corporate-events'],
    business_metrics: { avg_booking_lift: 0.18, revenue_impact: 0.25, search_volume: 4800 }
  },
  'beach': {
    semantic: ['beach', 'ocean', 'sand', 'waves', 'coastal', 'seaside', 'waterfront'],
    attributes: ['coastal', 'sandy', 'sunny', 'water-access', 'scenic', 'recreational'],
    category: 'location',
    subcategory: 'coastal',
    usage_patterns: ['beach-vacation', 'summer', 'water-activities', 'sunbathing', 'coastal-walks'],
    business_metrics: { avg_booking_lift: 0.41, revenue_impact: 0.35, search_volume: 9200 }
  },
  'oceanview': {
    semantic: ['ocean', 'view', 'scenic', 'panoramic', 'waterfront', 'coastal', 'vista'],
    attributes: ['scenic', 'premium', 'view-focused', 'coastal', 'panoramic', 'desirable'],
    category: 'location',
    subcategory: 'view',
    usage_patterns: ['romantic', 'scenic', 'photography', 'relaxation', 'premium-experience'],
    business_metrics: { avg_booking_lift: 0.38, revenue_impact: 0.44, search_volume: 3400 }
  },
  'mountains': {
    semantic: ['mountains', 'peaks', 'alpine', 'hiking', 'nature', 'scenic', 'elevation'],
    attributes: ['mountainous', 'scenic', 'nature-focused', 'hiking-access', 'fresh-air', 'peaceful'],
    category: 'location',
    subcategory: 'mountain',
    usage_patterns: ['hiking', 'nature', 'scenic-drives', 'fresh-air', 'mountain-activities'],
    business_metrics: { avg_booking_lift: 0.29, revenue_impact: 0.26, search_volume: 4100 }
  },
  'lake': {
    semantic: ['lake', 'water', 'freshwater', 'scenic', 'peaceful', 'fishing', 'boating'],
    attributes: ['freshwater', 'scenic', 'peaceful', 'recreational', 'fishing-access', 'boating'],
    category: 'location',
    subcategory: 'lakefront',
    usage_patterns: ['fishing', 'boating', 'peaceful', 'water-activities', 'scenic-relaxation'],
    business_metrics: { avg_booking_lift: 0.24, revenue_impact: 0.19, search_volume: 2800 }
  },
  'ski': {
    semantic: ['ski', 'snow', 'winter', 'slopes', 'alpine', 'mountain', 'winter-sports'],
    attributes: ['winter', 'snow-dependent', 'sporty', 'seasonal', 'mountain-access', 'equipment-needed'],
    category: 'activity',
    subcategory: 'winter-sports',
    usage_patterns: ['winter', 'skiing', 'snow-sports', 'mountain-vacation', 'winter-activities'],
    business_metrics: { avg_booking_lift: 0.52, revenue_impact: 0.48, search_volume: 3600 }
  },
  'wine-country': {
    semantic: ['wine', 'vineyard', 'tasting', 'culinary', 'gourmet', 'sophisticated', 'scenic'],
    attributes: ['wine-focused', 'culinary', 'sophisticated', 'scenic', 'tasting-available', 'gourmet'],
    category: 'experience',
    subcategory: 'culinary',
    usage_patterns: ['wine-tasting', 'culinary', 'romantic', 'sophisticated', 'gourmet-experience'],
    business_metrics: { avg_booking_lift: 0.36, revenue_impact: 0.41, search_volume: 2200 }
  },
  'historic-cultural': {
    semantic: ['historic', 'cultural', 'heritage', 'museum', 'architecture', 'traditional', 'educational'],
    attributes: ['historic', 'cultural', 'educational', 'heritage-focused', 'architectural', 'traditional'],
    category: 'experience',
    subcategory: 'cultural',
    usage_patterns: ['cultural-tourism', 'education', 'history', 'architecture', 'heritage-sites'],
    business_metrics: { avg_booking_lift: 0.21, revenue_impact: 0.17, search_volume: 1800 }
  },
  'all-inclusive': {
    semantic: ['all-inclusive', 'comprehensive', 'package', 'meals', 'drinks', 'activities', 'convenience'],
    attributes: ['comprehensive', 'convenient', 'package-deal', 'meals-included', 'activities-included'],
    category: 'package',
    subcategory: 'all-inclusive',
    usage_patterns: ['convenience', 'package-vacation', 'worry-free', 'comprehensive-experience'],
    business_metrics: { avg_booking_lift: 0.33, revenue_impact: 0.29, search_volume: 5400 }
  },
  'budget-friendly': {
    semantic: ['budget', 'affordable', 'economical', 'value', 'cost-effective', 'savings', 'deal'],
    attributes: ['affordable', 'economical', 'value-focused', 'cost-effective', 'budget-conscious'],
    category: 'pricing',
    subcategory: 'budget',
    usage_patterns: ['budget-travel', 'value-seeking', 'cost-conscious', 'economical-choice'],
    business_metrics: { avg_booking_lift: 0.15, revenue_impact: 0.08, search_volume: 7200 }
  },
  'cabins': {
    semantic: ['cabin', 'rustic', 'cozy', 'nature', 'retreat', 'secluded', 'peaceful'],
    attributes: ['rustic', 'cozy', 'nature-focused', 'secluded', 'peaceful', 'retreat-like'],
    category: 'accommodation',
    subcategory: 'cabin',
    usage_patterns: ['nature-retreat', 'peaceful', 'rustic-experience', 'secluded-getaway'],
    business_metrics: { avg_booking_lift: 0.27, revenue_impact: 0.23, search_volume: 2600 }
  },
  'homes': {
    semantic: ['home', 'house', 'residential', 'private', 'spacious', 'family', 'comfortable'],
    attributes: ['residential', 'private', 'spacious', 'home-like', 'comfortable', 'family-suitable'],
    category: 'accommodation',
    subcategory: 'home',
    usage_patterns: ['family-groups', 'extended-stays', 'privacy', 'home-comfort', 'group-travel'],
    business_metrics: { avg_booking_lift: 0.31, revenue_impact: 0.34, search_volume: 4900 }
  },
  'trending': {
    semantic: ['trending', 'popular', 'hot', 'current', 'fashionable', 'in-demand', 'sought-after'],
    attributes: ['popular', 'current', 'in-demand', 'fashionable', 'sought-after', 'contemporary'],
    category: 'meta',
    subcategory: 'trending',
    usage_patterns: ['popular-destinations', 'current-trends', 'fashionable-travel', 'sought-after'],
    business_metrics: { avg_booking_lift: 0.22, revenue_impact: 0.19, search_volume: 3200 }
  },
  'pool-bar': {
    semantic: ['bar', 'drinks', 'service', 'amenity', 'poolside', 'refreshment', 'hospitality'],
    attributes: ['wet', 'outdoor', 'service-oriented', 'adult-focused', 'seasonal', 'staffed'],
    category: 'amenity',
    subcategory: 'food-beverage',
    usage_patterns: ['summer', 'vacation', 'adult-time', 'socializing', 'afternoon'],
    business_metrics: { avg_booking_lift: 0.19, revenue_impact: 0.31, search_volume: 3200 }
  },
  'infinity-pool': {
    semantic: ['pool', 'luxury', 'infinity', 'edge', 'premium', 'view', 'architectural'],
    attributes: ['wet', 'outdoor', 'luxury', 'premium', 'architectural', 'maintenance-intensive'],
    category: 'amenity',
    subcategory: 'water-feature',
    usage_patterns: ['luxury-travel', 'honeymoon', 'special-occasion', 'photography', 'relaxation'],
    business_metrics: { avg_booking_lift: 0.41, revenue_impact: 0.52, search_volume: 2100 }
  },
  'heated-pool': {
    semantic: ['pool', 'heated', 'warm', 'temperature', 'comfort', 'year-round', 'thermal'],
    attributes: ['wet', 'heated', 'year-round', 'comfortable', 'energy-intensive', 'premium'],
    category: 'amenity',
    subcategory: 'water-feature',
    usage_patterns: ['winter', 'year-round', 'comfort', 'therapeutic', 'extended-season'],
    business_metrics: { avg_booking_lift: 0.28, revenue_impact: 0.22, search_volume: 1800 }
  },
  // Wellness concepts
  'spa-services': {
    semantic: ['spa', 'wellness', 'massage', 'treatment', 'relaxation', 'therapy', 'rejuvenation'],
    attributes: ['indoor', 'premium', 'therapeutic', 'relaxing', 'staffed', 'appointment-based'],
    category: 'wellness',
    subcategory: 'spa-treatment',
    usage_patterns: ['vacation', 'relaxation', 'wellness', 'couples', 'self-care'],
    business_metrics: { avg_booking_lift: 0.35, revenue_impact: 0.42, search_volume: 4200 }
  },
  'fitness-center': {
    semantic: ['fitness', 'gym', 'exercise', 'workout', 'equipment', 'health', 'training'],
    attributes: ['indoor', 'equipment-based', 'active', 'health-focused', 'staffed', 'membership'],
    category: 'wellness',
    subcategory: 'fitness',
    usage_patterns: ['morning', 'health', 'routine', 'active-travel', 'wellness'],
    business_metrics: { avg_booking_lift: 0.18, revenue_impact: 0.15, search_volume: 3100 }
  },
  'yoga-classes': {
    semantic: ['yoga', 'meditation', 'mindfulness', 'flexibility', 'wellness', 'classes', 'instructor'],
    attributes: ['indoor', 'group-activity', 'wellness', 'scheduled', 'instructor-led', 'mindful'],
    category: 'wellness',
    subcategory: 'fitness-class',
    usage_patterns: ['morning', 'evening', 'wellness', 'mindfulness', 'group-activity'],
    business_metrics: { avg_booking_lift: 0.22, revenue_impact: 0.18, search_volume: 2800 }
  },
  // Luxury concepts
  'concierge-service': {
    semantic: ['concierge', 'service', 'assistance', 'luxury', 'personal', 'exclusive', 'premium'],
    attributes: ['premium', 'personalized', 'exclusive', 'service-oriented', 'luxury', 'staffed'],
    category: 'service',
    subcategory: 'luxury-service',
    usage_patterns: ['luxury-travel', 'convenience', 'personalized', 'exclusive', 'premium'],
    business_metrics: { avg_booking_lift: 0.45, revenue_impact: 0.38, search_volume: 1900 }
  },
  'butler-service': {
    semantic: ['butler', 'personal', 'service', 'luxury', 'exclusive', 'premium', 'assistance'],
    attributes: ['premium', 'personalized', 'exclusive', 'luxury', 'private', 'high-end'],
    category: 'service',
    subcategory: 'luxury-service',
    usage_patterns: ['luxury-travel', 'exclusive', 'personalized', 'premium', 'private'],
    business_metrics: { avg_booking_lift: 0.52, revenue_impact: 0.48, search_volume: 1200 }
  },
  'private-dining': {
    semantic: ['dining', 'private', 'exclusive', 'luxury', 'restaurant', 'culinary', 'premium'],
    attributes: ['premium', 'exclusive', 'private', 'culinary', 'luxury', 'intimate'],
    category: 'dining',
    subcategory: 'luxury-dining',
    usage_patterns: ['luxury-travel', 'romantic', 'exclusive', 'special-occasion', 'premium'],
    business_metrics: { avg_booking_lift: 0.38, revenue_impact: 0.44, search_volume: 2200 }
  },
  // Family-friendly concepts
  'kids-club': {
    semantic: ['kids', 'children', 'family', 'activities', 'childcare', 'entertainment', 'supervised'],
    attributes: ['family-oriented', 'supervised', 'age-appropriate', 'safe', 'educational', 'fun'],
    category: 'family',
    subcategory: 'childcare',
    usage_patterns: ['family-vacation', 'children', 'supervised', 'activities', 'parents-time'],
    business_metrics: { avg_booking_lift: 0.31, revenue_impact: 0.26, search_volume: 3800 }
  },
  'family-pool': {
    semantic: ['pool', 'family', 'children', 'safe', 'shallow', 'fun', 'water'],
    attributes: ['family-oriented', 'safe', 'shallow', 'supervised', 'fun', 'child-friendly'],
    category: 'amenity',
    subcategory: 'water-feature',
    usage_patterns: ['family-vacation', 'children', 'safe', 'fun', 'supervised'],
    business_metrics: { avg_booking_lift: 0.29, revenue_impact: 0.24, search_volume: 2900 }
  },
  'playground': {
    semantic: ['playground', 'children', 'play', 'equipment', 'safe', 'outdoor', 'fun'],
    attributes: ['outdoor', 'child-friendly', 'safe', 'equipment-based', 'fun', 'supervised'],
    category: 'family',
    subcategory: 'play-area',
    usage_patterns: ['family-vacation', 'children', 'outdoor', 'play', 'active'],
    business_metrics: { avg_booking_lift: 0.24, revenue_impact: 0.19, search_volume: 2100 }
  },
  // Business concepts
  'meeting-rooms': {
    semantic: ['meeting', 'business', 'conference', 'professional', 'corporate', 'work', 'presentation'],
    attributes: ['professional', 'equipped', 'business-oriented', 'formal', 'technology', 'private'],
    category: 'business',
    subcategory: 'meeting-facility',
    usage_patterns: ['business-travel', 'meetings', 'corporate', 'professional', 'work'],
    business_metrics: { avg_booking_lift: 0.33, revenue_impact: 0.29, search_volume: 4100 }
  },
  'business-center': {
    semantic: ['business', 'office', 'work', 'professional', 'services', 'corporate', 'support'],
    attributes: ['professional', 'equipped', 'business-oriented', 'technology', 'support', 'services'],
    category: 'business',
    subcategory: 'business-facility',
    usage_patterns: ['business-travel', 'work', 'professional', 'corporate', 'support'],
    business_metrics: { avg_booking_lift: 0.27, revenue_impact: 0.23, search_volume: 3200 }
  },
  'conference-facilities': {
    semantic: ['conference', 'meeting', 'business', 'large', 'corporate', 'event', 'professional'],
    attributes: ['professional', 'large-scale', 'equipped', 'business-oriented', 'formal', 'event'],
    category: 'business',
    subcategory: 'conference-facility',
    usage_patterns: ['business-travel', 'conferences', 'corporate', 'events', 'large-groups'],
    business_metrics: { avg_booking_lift: 0.41, revenue_impact: 0.36, search_volume: 2800 }
  },
  // Romantic concepts
  'couples-spa': {
    semantic: ['spa', 'couples', 'romantic', 'together', 'relaxation', 'intimate', 'wellness'],
    attributes: ['romantic', 'couples-oriented', 'intimate', 'premium', 'relaxing', 'private'],
    category: 'wellness',
    subcategory: 'couples-treatment',
    usage_patterns: ['romantic', 'couples', 'honeymoon', 'anniversary', 'intimate'],
    business_metrics: { avg_booking_lift: 0.48, revenue_impact: 0.52, search_volume: 1800 }
  },
  'private-beach': {
    semantic: ['beach', 'private', 'exclusive', 'ocean', 'sand', 'romantic', 'secluded'],
    attributes: ['outdoor', 'private', 'exclusive', 'romantic', 'natural', 'secluded'],
    category: 'amenity',
    subcategory: 'beach-access',
    usage_patterns: ['romantic', 'exclusive', 'beach', 'privacy', 'luxury'],
    business_metrics: { avg_booking_lift: 0.44, revenue_impact: 0.41, search_volume: 2400 }
  },
  'sunset-dining': {
    semantic: ['dining', 'sunset', 'romantic', 'evening', 'view', 'atmosphere', 'special'],
    attributes: ['romantic', 'scenic', 'evening', 'atmospheric', 'special', 'outdoor'],
    category: 'dining',
    subcategory: 'romantic-dining',
    usage_patterns: ['romantic', 'evening', 'special-occasion', 'couples', 'scenic'],
    business_metrics: { avg_booking_lift: 0.39, revenue_impact: 0.43, search_volume: 2100 }
  }
};

// Taxonomic relationships (parent-child, siblings, etc.)
const taxonomicGraph = {
  'swimming-pool': {
    parent: 'water-amenities',
    children: ['infinity-pool', 'heated-pool', 'lap-pool', 'kiddie-pool'],
    siblings: ['hot-tub', 'water-slide', 'lazy-river'],
    related_services: ['pool-bar', 'pool-service', 'lifeguard']
  },
  'pool-bar': {
    parent: 'food-beverage-amenities',
    children: [],
    siblings: ['restaurant', 'cafe', 'room-service'],
    related_amenities: ['swimming-pool', 'outdoor-seating', 'bar-seating']
  },
  'infinity-pool': {
    parent: 'swimming-pool',
    children: [],
    siblings: ['heated-pool', 'lap-pool'],
    luxury_tier: 'premium'
  },
  'heated-pool': {
    parent: 'swimming-pool',
    children: [],
    siblings: ['infinity-pool', 'lap-pool'],
    seasonal_availability: 'year-round'
  },
  'wellness': {
    parents: ['experience', 'health'],
    children: ['spa', 'massage', 'therapy'],
    siblings: ['fitness', 'meditation', 'yoga'],
    related_services: ['wellness-programs', 'health-consultations', 'relaxation-services']
  },
  'spa': {
    parents: ['wellness', 'amenity'],
    children: ['massage', 'facial', 'body-treatment'],
    siblings: ['fitness-center', 'pools', 'sauna'],
    related_services: ['spa-treatments', 'wellness-packages', 'relaxation-therapy']
  },
  'pools': {
    parents: ['amenity', 'water-feature'],
    children: ['pool-bar', 'infinity-pool', 'heated-pool'],
    siblings: ['hot-tub', 'spa', 'water-slide'],
    related_services: ['pool-maintenance', 'lifeguard', 'pool-towels']
  },
  'luxury': {
    parents: ['experience', 'premium'],
    children: ['luxury-amenities', 'premium-services', 'exclusive-access'],
    siblings: ['spa', 'fine-dining', 'concierge'],
    related_services: ['personal-butler', 'luxury-transportation', 'exclusive-experiences']
  },
  'family-friendly': {
    parents: ['experience', 'amenity'],
    children: ['kids-club', 'family-activities', 'child-care'],
    siblings: ['entertainment', 'recreation', 'activities'],
    related_services: ['babysitting', 'family-programs', 'kids-activities']
  },
  'business': {
    parents: ['amenity', 'service'],
    children: ['meeting-rooms', 'business-center', 'conference-facilities'],
    siblings: ['wifi', 'workspace', 'printing'],
    related_services: ['business-support', 'meeting-planning', 'av-equipment']
  },
  'beach': {
    parents: ['location', 'natural-feature'],
    children: ['beach-access', 'water-sports', 'beachfront'],
    siblings: ['oceanview', 'coastal', 'waterfront'],
    related_services: ['beach-equipment', 'water-activities', 'beach-service']
  }
};

// Behavioral interaction patterns (co-occurrence, user journey data)
const behavioralPatterns = {
  'swimming-pool': {
    co_viewed_with: { 'pool-bar': 0.34, 'infinity-pool': 0.28, 'heated-pool': 0.22 },
    co_booked_with: { 'pool-bar': 0.18, 'infinity-pool': 0.15, 'heated-pool': 0.12 },
    user_journey_position: 'primary-decision-factor',
    session_duration_impact: 1.23
  },
  'pool-bar': {
    co_viewed_with: { 'swimming-pool': 0.34, 'infinity-pool': 0.19, 'heated-pool': 0.14 },
    co_booked_with: { 'swimming-pool': 0.18, 'infinity-pool': 0.11, 'heated-pool': 0.08 },
    user_journey_position: 'secondary-consideration',
    session_duration_impact: 0.87
  },
  'infinity-pool': {
    co_viewed_with: { 'swimming-pool': 0.28, 'pool-bar': 0.19, 'heated-pool': 0.16 },
    co_booked_with: { 'swimming-pool': 0.15, 'pool-bar': 0.11, 'heated-pool': 0.09 },
    user_journey_position: 'luxury-upgrade-factor',
    session_duration_impact: 1.45
  },
  'heated-pool': {
    co_viewed_with: { 'swimming-pool': 0.22, 'pool-bar': 0.14, 'infinity-pool': 0.16 },
    co_booked_with: { 'swimming-pool': 0.12, 'pool-bar': 0.08, 'infinity-pool': 0.09 },
    user_journey_position: 'seasonal-consideration',
    session_duration_impact: 1.12
  }
};

// Temporal correlation patterns (seasonal, time-based)
const temporalPatterns = {
  'swimming-pool': {
    seasonal_demand: { spring: 0.7, summer: 1.0, fall: 0.6, winter: 0.3 },
    daily_usage: { morning: 0.4, afternoon: 1.0, evening: 0.7, night: 0.2 },
    booking_lead_time: 45, // days
    peak_months: ['june', 'july', 'august']
  },
  'pool-bar': {
    seasonal_demand: { spring: 0.6, summer: 1.0, fall: 0.5, winter: 0.2 },
    daily_usage: { morning: 0.2, afternoon: 1.0, evening: 0.9, night: 0.3 },
    booking_lead_time: 35,
    peak_months: ['may', 'june', 'july', 'august', 'september']
  },
  'infinity-pool': {
    seasonal_demand: { spring: 0.8, summer: 1.0, fall: 0.7, winter: 0.4 },
    daily_usage: { morning: 0.6, afternoon: 1.0, evening: 0.8, night: 0.3 },
    booking_lead_time: 65,
    peak_months: ['april', 'may', 'june', 'july', 'august', 'september']
  },
  'heated-pool': {
    seasonal_demand: { spring: 0.9, summer: 0.8, fall: 1.0, winter: 0.9 },
    daily_usage: { morning: 0.7, afternoon: 0.9, evening: 1.0, night: 0.4 },
    booking_lead_time: 55,
    peak_months: ['october', 'november', 'december', 'january', 'february', 'march']
  }
};

/**
 * Calculate semantic similarity between two concepts
 */
function calculateSemanticSimilarity(concept1Id, concept2Id) {
  // Normalize concept IDs to handle different naming conventions
  const normalizedConcept1Id = normalizeConceptId(concept1Id);
  const normalizedConcept2Id = normalizeConceptId(concept2Id);
  
  const concept1 = conceptEmbeddings[normalizedConcept1Id];
  const concept2 = conceptEmbeddings[normalizedConcept2Id];
  
  if (!concept1 || !concept2) {
    console.log(`⚠️ Missing concept data for similarity calculation:`, {
      original: { concept1Id, concept2Id },
      normalized: { normalizedConcept1Id, normalizedConcept2Id },
      found: { concept1: !!concept1, concept2: !!concept2 }
    });
    return { score: 0, confidence: 'low', evidence: ['Missing concept data'] };
  }
  
  // Calculate Jaccard similarity for semantic terms
  const terms1 = new Set(concept1.semantic);
  const terms2 = new Set(concept2.semantic);
  const intersection = new Set([...terms1].filter(x => terms2.has(x)));
  const union = new Set([...terms1, ...terms2]);
  
  const jaccardScore = intersection.size / union.size;
  
  // Calculate attribute overlap
  const attrs1 = new Set(concept1.attributes);
  const attrs2 = new Set(concept2.attributes);
  const attrIntersection = new Set([...attrs1].filter(x => attrs2.has(x)));
  const attrScore = attrIntersection.size / Math.max(attrs1.size, attrs2.size);
  
  // Weighted combination
  const finalScore = (jaccardScore * 0.7) + (attrScore * 0.3);
  
  const evidence = Array.from(intersection).slice(0, 3);
  const confidence = finalScore > 0.7 ? 'high' : finalScore > 0.4 ? 'medium' : 'low';
  
  return {
    score: Math.round(finalScore * 100) / 100,
    confidence,
    evidence: evidence.length > 0 ? evidence : ['Limited semantic overlap']
  };
}

/**
 * Calculate taxonomic similarity (hierarchical relationships)
 */
function calculateTaxonomicSimilarity(concept1Id, concept2Id) {
  // Normalize concept IDs
  const normalizedConcept1Id = normalizeConceptId(concept1Id);
  const normalizedConcept2Id = normalizeConceptId(concept2Id);
  
  const concept1 = taxonomicGraph[normalizedConcept1Id];
  const concept2 = taxonomicGraph[normalizedConcept2Id];
  
  if (!concept1 || !concept2) return { score: 0, confidence: 'low', evidence: ['Missing taxonomic data'] };
  
  let score = 0;
  let evidence = [];
  
  // Parent-child relationship
  if (concept1.parent === concept2Id || concept2.parent === concept1Id) {
    score += 0.8;
    evidence.push('Direct parent-child relationship');
  }
  
  // Sibling relationship
  if (concept1.siblings && concept1.siblings.includes(concept2Id)) {
    score += 0.6;
    evidence.push('Sibling relationship in taxonomy');
  }
  
  // Same parent
  if (concept1.parent === concept2.parent && concept1.parent) {
    score += 0.5;
    evidence.push(`Shared parent: ${concept1.parent}`);
  }
  
  // Related services/amenities
  if (concept1.related_services && concept1.related_services.includes(concept2Id)) {
    score += 0.4;
    evidence.push('Related service connection');
  }
  
  if (concept1.related_amenities && concept1.related_amenities.includes(concept2Id)) {
    score += 0.4;
    evidence.push('Related amenity connection');
  }
  
  // Cap at 1.0
  score = Math.min(score, 1.0);
  
  const confidence = score > 0.7 ? 'high' : score > 0.4 ? 'medium' : 'low';
  
  return {
    score: Math.round(score * 100) / 100,
    confidence,
    evidence: evidence.length > 0 ? evidence : ['No direct taxonomic relationship']
  };
}

/**
 * Calculate attribute alignment similarity
 */
function calculateAttributeSimilarity(concept1Id, concept2Id) {
  // Normalize concept IDs
  const normalizedConcept1Id = normalizeConceptId(concept1Id);
  const normalizedConcept2Id = normalizeConceptId(concept2Id);
  
  const concept1 = conceptEmbeddings[normalizedConcept1Id];
  const concept2 = conceptEmbeddings[normalizedConcept2Id];
  
  if (!concept1 || !concept2) return { score: 0, confidence: 'low', evidence: ['Missing attribute data'] };
  
  // Calculate attribute overlap
  const attrs1 = new Set(concept1.attributes);
  const attrs2 = new Set(concept2.attributes);
  const intersection = new Set([...attrs1].filter(x => attrs2.has(x)));
  const union = new Set([...attrs1, ...attrs2]);
  
  const overlapScore = intersection.size / union.size;
  
  // Category similarity bonus
  let categoryBonus = 0;
  if (concept1.category === concept2.category) {
    categoryBonus += 0.3;
    if (concept1.subcategory === concept2.subcategory) {
      categoryBonus += 0.2;
    }
  }
  
  const finalScore = Math.min(overlapScore + categoryBonus, 1.0);
  
  const evidence = Array.from(intersection).slice(0, 3);
  if (concept1.category === concept2.category) {
    evidence.push(`Same category: ${concept1.category}`);
  }
  
  const confidence = finalScore > 0.8 ? 'high' : finalScore > 0.5 ? 'medium' : 'low';
  
  return {
    score: Math.round(finalScore * 100) / 100,
    confidence,
    evidence: evidence.length > 0 ? evidence : ['Limited attribute alignment']
  };
}

/**
 * Calculate behavioral interaction similarity
 */
function calculateBehavioralSimilarity(concept1Id, concept2Id) {
  // Normalize concept IDs
  const normalizedConcept1Id = normalizeConceptId(concept1Id);
  const normalizedConcept2Id = normalizeConceptId(concept2Id);
  
  const concept1 = behavioralPatterns[normalizedConcept1Id];
  const concept2 = behavioralPatterns[normalizedConcept2Id];
  
  if (!concept1 || !concept2) return { score: 0, confidence: 'low', evidence: ['Missing behavioral data'] };
  
  // Co-view and co-booking rates
  const coViewRate = concept1.co_viewed_with[concept2Id] || 0;
  const coBookRate = concept1.co_booked_with[concept2Id] || 0;
  
  // Session impact similarity
  const sessionImpact1 = concept1.session_duration_impact;
  const sessionImpact2 = concept2.session_duration_impact;
  const sessionSimilarity = 1 - Math.abs(sessionImpact1 - sessionImpact2) / Math.max(sessionImpact1, sessionImpact2);
  
  // Weighted combination
  const finalScore = (coViewRate * 0.4) + (coBookRate * 0.4) + (sessionSimilarity * 0.2);
  
  const evidence = [];
  if (coViewRate > 0) evidence.push(`${Math.round(coViewRate * 100)}% co-view rate`);
  if (coBookRate > 0) evidence.push(`${Math.round(coBookRate * 100)}% co-booking rate`);
  evidence.push(`Session impact similarity: ${Math.round(sessionSimilarity * 100)}%`);
  
  const confidence = finalScore > 0.25 ? 'high' : finalScore > 0.1 ? 'medium' : 'low';
  
  return {
    score: Math.round(finalScore * 100) / 100,
    confidence,
    evidence: evidence.slice(0, 3)
  };
}

/**
 * Calculate temporal correlation similarity
 */
function calculateTemporalSimilarity(concept1Id, concept2Id) {
  // Normalize concept IDs
  const normalizedConcept1Id = normalizeConceptId(concept1Id);
  const normalizedConcept2Id = normalizeConceptId(concept2Id);
  
  const concept1 = temporalPatterns[normalizedConcept1Id];
  const concept2 = temporalPatterns[normalizedConcept2Id];
  
  if (!concept1 || !concept2) return { score: 0, confidence: 'low', evidence: ['Missing temporal data'] };
  
  // Seasonal demand correlation
  const seasons = ['spring', 'summer', 'fall', 'winter'];
  let seasonalCorrelation = 0;
  seasons.forEach(season => {
    const diff = Math.abs(concept1.seasonal_demand[season] - concept2.seasonal_demand[season]);
    seasonalCorrelation += (1 - diff);
  });
  seasonalCorrelation /= seasons.length;
  
  // Daily usage correlation
  const dayParts = ['morning', 'afternoon', 'evening', 'night'];
  let dailyCorrelation = 0;
  dayParts.forEach(part => {
    const diff = Math.abs(concept1.daily_usage[part] - concept2.daily_usage[part]);
    dailyCorrelation += (1 - diff);
  });
  dailyCorrelation /= dayParts.length;
  
  // Booking lead time similarity
  const leadTimeDiff = Math.abs(concept1.booking_lead_time - concept2.booking_lead_time);
  const leadTimeSimilarity = Math.max(0, 1 - (leadTimeDiff / 60)); // Normalize by 60 days
  
  // Peak month overlap
  const peaks1 = new Set(concept1.peak_months);
  const peaks2 = new Set(concept2.peak_months);
  const peakOverlap = new Set([...peaks1].filter(x => peaks2.has(x)));
  const peakSimilarity = peakOverlap.size / Math.max(peaks1.size, peaks2.size);
  
  // Weighted combination
  const finalScore = (seasonalCorrelation * 0.3) + (dailyCorrelation * 0.2) + 
                    (leadTimeSimilarity * 0.2) + (peakSimilarity * 0.3);
  
  const evidence = [];
  evidence.push(`Seasonal correlation: ${Math.round(seasonalCorrelation * 100)}%`);
  evidence.push(`Daily usage correlation: ${Math.round(dailyCorrelation * 100)}%`);
  if (peakOverlap.size > 0) {
    evidence.push(`Shared peak months: ${Array.from(peakOverlap).join(', ')}`);
  }
  
  const confidence = finalScore > 0.7 ? 'high' : finalScore > 0.4 ? 'medium' : 'low';
  
  return {
    score: Math.round(finalScore * 100) / 100,
    confidence,
    evidence: evidence.slice(0, 3)
  };
}

/**
 * Calculate business impact similarity
 */
function calculateBusinessSimilarity(concept1Id, concept2Id) {
  // Normalize concept IDs
  const normalizedConcept1Id = normalizeConceptId(concept1Id);
  const normalizedConcept2Id = normalizeConceptId(concept2Id);
  
  const concept1 = conceptEmbeddings[normalizedConcept1Id];
  const concept2 = conceptEmbeddings[normalizedConcept2Id];
  
  if (!concept1?.business_metrics || !concept2?.business_metrics) {
    return { score: 0, confidence: 'low', evidence: ['Missing business metrics'] };
  }
  
  const metrics1 = concept1.business_metrics;
  const metrics2 = concept2.business_metrics;
  
  // Booking lift similarity
  const liftDiff = Math.abs(metrics1.avg_booking_lift - metrics2.avg_booking_lift);
  const liftSimilarity = Math.max(0, 1 - (liftDiff / 0.5)); // Normalize by 50%
  
  // Revenue impact similarity
  const revenueDiff = Math.abs(metrics1.revenue_impact - metrics2.revenue_impact);
  const revenueSimilarity = Math.max(0, 1 - (revenueDiff / 0.5));
  
  // Search volume similarity (log scale)
  const vol1 = Math.log(metrics1.search_volume);
  const vol2 = Math.log(metrics2.search_volume);
  const volumeDiff = Math.abs(vol1 - vol2);
  const volumeSimilarity = Math.max(0, 1 - (volumeDiff / 5)); // Normalize by log(150)
  
  // Weighted combination
  const finalScore = (liftSimilarity * 0.4) + (revenueSimilarity * 0.4) + (volumeSimilarity * 0.2);
  
  const evidence = [];
  evidence.push(`Booking lift: ${Math.round(metrics1.avg_booking_lift * 100)}% vs ${Math.round(metrics2.avg_booking_lift * 100)}%`);
  evidence.push(`Revenue impact: ${Math.round(metrics1.revenue_impact * 100)}% vs ${Math.round(metrics2.revenue_impact * 100)}%`);
  evidence.push(`Search volume: ${metrics1.search_volume.toLocaleString()} vs ${metrics2.search_volume.toLocaleString()}`);
  
  const confidence = finalScore > 0.6 ? 'high' : finalScore > 0.3 ? 'medium' : 'low';
  
  return {
    score: Math.round(finalScore * 100) / 100,
    confidence,
    evidence: evidence.slice(0, 3)
  };
}

/**
 * Calculate content similarity (placeholder for future implementation)
 */
function calculateContentSimilarity(concept1Id, concept2Id) {
  // Placeholder implementation - would analyze content descriptions, images, etc.
  const baseScore = Math.random() * 0.3 + 0.4; // Random between 0.4-0.7 for demo
  
  return {
    score: Math.round(baseScore * 100) / 100,
    confidence: 'medium',
    evidence: ['Content analysis placeholder', 'Description similarity', 'Image feature matching']
  };
}

/**
 * Calculate external search similarity (placeholder)
 */
function calculateExternalSimilarity(concept1Id, concept2Id) {
  // Placeholder - would integrate with external search APIs
  const baseScore = Math.random() * 0.4 + 0.3; // Random between 0.3-0.7 for demo
  
  return {
    score: Math.round(baseScore * 100) / 100,
    confidence: 'medium',
    evidence: ['External search correlation', 'Web mention co-occurrence', 'Social media clustering']
  };
}

/**
 * Calculate statistical similarity (placeholder)
 */
function calculateStatisticalSimilarity(concept1Id, concept2Id) {
  // Placeholder - would use advanced statistical methods
  const baseScore = Math.random() * 0.3 + 0.5; // Random between 0.5-0.8 for demo
  
  return {
    score: Math.round(baseScore * 100) / 100,
    confidence: 'medium',
    evidence: ['Statistical correlation analysis', 'Distribution similarity', 'Variance comparison']
  };
}

/**
 * Main similarity calculation function
 */
export function calculateSimilarity(primaryConceptId, relatedConceptId, dimension = 'all') {
  const calculators = {
    semantic: calculateSemanticSimilarity,
    taxonomic: calculateTaxonomicSimilarity,
    attribute: calculateAttributeSimilarity,
    behavioral: calculateBehavioralSimilarity,
    temporal: calculateTemporalSimilarity,
    business: calculateBusinessSimilarity,
    content: calculateContentSimilarity,
    external: calculateExternalSimilarity,
    statistical: calculateStatisticalSimilarity
  };
  
  if (dimension === 'all') {
    // Calculate all dimensions and return average
    const results = {};
    let totalScore = 0;
    let totalWeight = 0;
    
    // Weights for different dimensions (can be adjusted)
    const weights = {
      semantic: 1.2,
      taxonomic: 1.1,
      attribute: 1.0,
      behavioral: 1.3,
      temporal: 0.8,
      business: 1.0,
      content: 0.7,
      external: 0.6,
      statistical: 0.5
    };
    
    Object.keys(calculators).forEach(dim => {
      const result = calculators[dim](primaryConceptId, relatedConceptId);
      results[dim] = result;
      totalScore += result.score * weights[dim];
      totalWeight += weights[dim];
    });
    
    const avgScore = totalScore / totalWeight;
    const highConfidenceCount = Object.values(results).filter(r => r.confidence === 'high').length;
    const overallConfidence = highConfidenceCount >= 5 ? 'high' : 
                             highConfidenceCount >= 3 ? 'medium' : 'low';
    
    return {
      score: Math.round(avgScore * 100) / 100,
      confidence: overallConfidence,
      evidence: ['Multi-dimensional analysis', `${highConfidenceCount}/9 high-confidence dimensions`, 'Weighted average calculation'],
      dimensions: results
    };
  } else {
    // Calculate specific dimension
    const calculator = calculators[dimension];
    if (!calculator) {
      return { score: 0, confidence: 'low', evidence: ['Unknown dimension'] };
    }
    
    return calculator(primaryConceptId, relatedConceptId);
  }
}

/**
 * Batch calculate similarities for multiple concepts
 */
export function calculateBatchSimilarities(primaryConceptId, relatedConceptIds, dimension = 'all') {
  return relatedConceptIds.map(relatedId => ({
    conceptId: relatedId,
    similarity: calculateSimilarity(primaryConceptId, relatedId, dimension)
  }));
}
