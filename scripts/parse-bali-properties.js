import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the markdown file
const markdownPath = path.join(__dirname, '../src/data/bali_properties_mock_varied.md');
const outputPath = path.join(__dirname, '../src/services/mockData/bali_properties.js');

// Parse markdown table into JSON
function parseMarkdownTable(markdown) {
  const lines = markdown.split('\n').filter(line => line.trim());
  const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
  const properties = [];

  // Skip header and separator lines
  for (let i = 2; i < lines.length; i++) {
    const values = lines[i].split('|').map(v => v.trim()).filter(Boolean);
    const property = {};
    
    headers.forEach((header, index) => {
      let value = values[index];
      
      // Convert numeric values
      if (['property_id', 'star_rating'].includes(header)) {
        value = parseInt(value);
      } else if (['price_usd_per_night', 'review_family_score'].includes(header)) {
        value = parseFloat(value);
      } else if (['kids_club', 'kitchenette', 'crib_available', 'pool_fence'].includes(header)) {
        value = value === 'True';
      } else if (header === 'amenities') {
        value = value.split(';').map(a => a.trim());
      } else if (header === 'detailed_amenities') {
        try {
          const parts = value.split('|').map(a => a.trim());
          value = {
            pool: parts[0]?.replace('Pool: ', '') || 'No pool',
            breakfast: parts[1]?.replace('Breakfast: ', '') || 'None',
            internet: parts[2]?.replace('Internet: ', '') || 'None'
          };
        } catch (err) {
          console.warn(`Failed to parse detailed amenities for property ${values[0]}, using defaults`);
          value = {
            pool: 'No pool',
            breakfast: 'None',
            internet: 'None'
          };
        }
      }
      
      property[header] = value;
    });

    // Calculate all affinity scores
    property.affinityScores = calculateAffinityScores(property);

    properties.push(property);
  }

  return properties;
}

function calculateFamilyScore(property) {
  let score = 0;
  
  // Base score from review_family_score (0-5 scale to 0-1 scale)
  score += (property.review_family_score / 5) * 0.4;
  
  // Points for family-friendly amenities
  const familyAmenities = [
    'Kids\' Club',
    'Playground',
    'Water Slide',
    'Pool Fence',
    'Crib',
    'Kitchenette'
  ];
  
  const amenityCount = property.amenities.filter(a => 
    familyAmenities.includes(a)
  ).length;
  
  score += (amenityCount / familyAmenities.length) * 0.4;
  
  // Additional points for specific features
  if (property.kids_club) score += 0.1;
  if (property.pool_fence) score += 0.1;
  
  // Ensure score is between 0 and 1
  return Math.min(Math.max(score, 0), 1);
}

function calculateLuxuryScore(property) {
  let score = 0;
  
  // Base score from star rating (1-5 scale to 0-1 scale)
  score += (property.star_rating / 5) * 0.4;
  
  // Price score (assuming max price is 600 USD)
  const priceScore = Math.min(property.price_usd_per_night / 600, 1);
  score += priceScore * 0.4;
  
  // Points for luxury amenities
  const luxuryAmenities = [
    'Spa',
    'Private Pool',
    'Beachfront',
    'Free Breakfast'
  ];
  
  const amenityCount = property.amenities.filter(a => 
    luxuryAmenities.includes(a)
  ).length;
  
  score += (amenityCount / luxuryAmenities.length) * 0.2;
  
  // Ensure score is between 0 and 1
  return Math.min(Math.max(score, 0), 1);
}

function calculateAffinityScores(property) {
  const scores = [];
  
  // Family-Friendly score (existing)
  const familyScore = calculateFamilyScore(property);
  scores.push({
    name: "Family-Friendly",
    score: familyScore
  });

  // Luxury score (existing)
  const luxuryScore = calculateLuxuryScore(property);
  scores.push({
    name: "Luxury",
    score: luxuryScore
  });

  // All-Inclusive score
  const allInclusiveScore = calculateAllInclusiveScore(property);
  scores.push({
    affinityId: "aff6",
    name: "All-Inclusive",
    score: allInclusiveScore
  });

  // Oceanview score
  const oceanviewScore = calculateOceanviewScore(property);
  scores.push({
    affinityId: "aff7",
    name: "Oceanview",
    score: oceanviewScore
  });

  // Pet-Friendly score
  const petFriendlyScore = calculatePetFriendlyScore(property);
  scores.push({
    name: "Pet-Friendly",
    score: petFriendlyScore
  });

  // Beach score
  const beachScore = calculateBeachScore(property);
  scores.push({
    name: "Beach",
    score: beachScore
  });

  return scores;
}

function calculateAllInclusiveScore(property) {
  let score = 0;
  
  // Check for free breakfast
  if (property.amenities.includes('Free Breakfast')) {
    score += 0.3;
  }
  
  // Check breakfast type from detailed amenities
  if (property.detailed_amenities.breakfast === 'Included buffet') {
    score += 0.2;
  } else if (property.detailed_amenities.breakfast === 'Cooked‑to‑order') {
    score += 0.1;
  }
  
  // Higher star ratings more likely to be all-inclusive
  score += (property.star_rating / 5) * 0.3;
  
  // Price factor - all-inclusive tends to be more expensive
  const priceScore = Math.min(property.price_usd_per_night / 500, 1) * 0.2;
  score += priceScore;

  return Math.min(Math.max(score, 0), 1);
}

function calculateOceanviewScore(property) {
  let score = 0;
  
  // Direct beachfront properties most likely to have ocean views
  if (property.amenities.includes('Beachfront')) {
    score += 0.6;
  }
  
  // Areas known for ocean views
  if (['Jimbaran', 'Nusa Dua', 'Seminyak'].includes(property.area)) {
    score += 0.3;
  }
  
  // Luxury properties more likely to have premium views
  score += (property.star_rating / 5) * 0.1;

  return Math.min(Math.max(score, 0), 1);
}

function calculatePetFriendlyScore(property) {
  let score = 0;
  
  // Base score for properties with kitchenette (more suitable for pets)
  if (property.kitchenette) {
    score += 0.3;
  }
  
  // Lower star ratings tend to be more pet-friendly
  score += ((6 - property.star_rating) / 5) * 0.2;
  
  // Areas known to be more pet-friendly
  if (['Ubud', 'Seminyak'].includes(property.area)) {
    score += 0.2;
  }
  
  // Properties with private spaces more suitable for pets
  if (property.amenities.includes('Private Pool')) {
    score += 0.3;
  }

  return Math.min(Math.max(score, 0), 1);
}

function calculateBeachScore(property) {
  let score = 0;
  
  // Direct beachfront access
  if (property.amenities.includes('Beachfront')) {
    score += 0.6;
  }
  
  // Beach areas
  const beachAreas = {
    'Nusa Dua': 0.4,
    'Jimbaran': 0.4,
    'Seminyak': 0.3,
    'Kuta': 0.3
  };
  score += beachAreas[property.area] || 0;
  
  // Additional amenities that suggest beach focus
  if (property.detailed_amenities.pool === 'Infinity pool') {
    score += 0.1;
  }

  return Math.min(Math.max(score, 0), 1);
}

// Generate the JavaScript file content
function generateJavaScriptFile(properties) {
  return `// Mock property data for Bali properties with expanded attributes
export const baliProperties = ${JSON.stringify(properties, null, 2)};

// Helper function to get all unique amenities
export const getUniqueAmenities = () => {
  const amenitiesSet = new Set();
  baliProperties.forEach(property => {
    property.amenities.forEach(amenity => {
      amenitiesSet.add(amenity);
    });
  });
  return Array.from(amenitiesSet).sort();
};

// Helper function to get all unique areas
export const getUniqueAreas = () => {
  return Array.from(new Set(baliProperties.map(p => p.area))).sort();
};

// Helper function to get price range
export const getPriceRange = () => {
  const prices = baliProperties.map(p => p.price_usd_per_night);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((a, b) => a + b, 0) / prices.length
  };
};

export default baliProperties;
`;
}

// Main execution
try {
  const markdown = fs.readFileSync(markdownPath, 'utf8');
  const properties = parseMarkdownTable(markdown);
  const jsContent = generateJavaScriptFile(properties);
  fs.writeFileSync(outputPath, jsContent);
  console.log('Successfully parsed properties and generated JavaScript file!');
} catch (error) {
  console.error('Error:', error);
} 