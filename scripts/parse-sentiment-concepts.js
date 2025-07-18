import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple XML parser to extract sentiment concepts from RDF file
function parseSentimentConcepts(rdfContent) {
  const concepts = [];
  
  // Regular expression to match rdf:Description blocks with ReviewSentiment type
  const descriptionRegex = /<rdf:Description[^>]*>(.*?)<\/rdf:Description>/gs;
  
  let match;
  while ((match = descriptionRegex.exec(rdfContent)) !== null) {
    const descriptionContent = match[1];
    
    // Check if this is a ReviewSentiment
    if (descriptionContent.includes('urn:expe:onto:review-sentiments-onto:ReviewSentiment')) {
      
      // Extract the about URI
      const aboutMatch = match[0].match(/rdf:about="([^"]+)"/);
      const uri = aboutMatch ? aboutMatch[1] : null;
      
      // Extract the preferred label
      const labelMatch = descriptionContent.match(/<skos:prefLabel>([^<]+)<\/skos:prefLabel>/);
      const label = labelMatch ? labelMatch[1] : null;
      
      // Extract definition if available
      const definitionMatch = descriptionContent.match(/<skos:definition[^>]*>([^<]+)<\/skos:definition>/);
      const definition = definitionMatch ? definitionMatch[1] : null;
      
      // Extract broader concepts (hierarchy)
      const broaderMatches = descriptionContent.match(/<skos:broader rdf:resource="([^"]+)"/g);
      const broaderConcepts = broaderMatches ? 
        broaderMatches.map(match => match.match(/rdf:resource="([^"]+)"/)[1]) : [];
      
      // Extract data supplier
      const supplierMatch = descriptionContent.match(/<j\.2:dataSupplier>([^<]+)<\/j\.2:dataSupplier>/);
      const dataSupplier = supplierMatch ? supplierMatch[1] : null;
      
      // Extract ID from URI
      const id = uri ? uri.split(':').pop() : null;
      
      if (label && id) {
        concepts.push({
          id,
          label,
          uri,
          definition,
          broaderConcepts,
          dataSupplier,
          // Determine category based on broader concepts
          category: getCategoryFromBroader(broaderConcepts)
        });
      }
    }
  }
  
  return concepts;
}

// Helper function to determine category from broader concepts
function getCategoryFromBroader(broaderConcepts) {
  const categories = {
    'positive-sentiment': 'Positive',
    'negative-sentiment': 'Negative',
    'L1-concepts': 'L1 Concepts',
    'L2Concepts': 'L2 Concepts', 
    'L3Concepts': 'L3 Concepts',
    'staff-and-services': 'Staff & Services',
    'room-cleanliness': 'Room Cleanliness',
    'location-sentiment': 'Location',
    'pool-sentiment': 'Pool',
    'beach-sentiment': 'Beach',
    'restaurant-sentiment': 'Restaurant',
    'bar-sentiment': 'Bar',
    'fitness-facilities': 'Fitness',
    'wifi-sentiment': 'WiFi',
    'parking-sentiment': 'Parking',
    'views-sentiment': 'Views',
    'family-friendly': 'Family Friendly',
    'business-friendly': 'Business Friendly'
  };
  
  for (const broader of broaderConcepts) {
    for (const [key, value] of Object.entries(categories)) {
      if (broader.includes(key)) {
        return value;
      }
    }
  }
  
  return 'General';
}

// Group concepts by category
function groupConceptsByCategory(concepts) {
  const grouped = {};
  
  concepts.forEach(concept => {
    const category = concept.category || 'General';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(concept);
  });
  
  return grouped;
}

// Main execution
function main() {
  try {
    console.log('🔍 Parsing RDF file for sentiment concepts...\n');
    
    // Read the RDF file
    const rdfPath = path.join(__dirname, '../datasource/review_sentiments (1).rdf');
    const rdfContent = fs.readFileSync(rdfPath, 'utf8');
    
    console.log(`📁 File size: ${(rdfContent.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📄 Total lines: ${rdfContent.split('\n').length}\n`);
    
    // Parse sentiment concepts
    const concepts = parseSentimentConcepts(rdfContent);
    
    console.log(`✅ Successfully parsed ${concepts.length} sentiment concepts\n`);
    
    // Group by category
    const groupedConcepts = groupConceptsByCategory(concepts);
    
    console.log('📊 CONCEPT CATEGORIES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    Object.entries(groupedConcepts)
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([category, concepts]) => {
        console.log(`${category.padEnd(20)} : ${concepts.length.toString().padStart(4)} concepts`);
      });
    
    console.log('\n🎯 SAMPLE CONCEPTS BY CATEGORY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Show sample concepts for each category
    Object.entries(groupedConcepts)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10) // Show top 10 categories
      .forEach(([category, concepts]) => {
        console.log(`\n${category.toUpperCase()}:`);
        concepts.slice(0, 5).forEach(concept => {
          console.log(`  • ${concept.label}`);
          if (concept.definition) {
            console.log(`    └─ ${concept.definition.substring(0, 100)}...`);
          }
        });
        if (concepts.length > 5) {
          console.log(`  ... and ${concepts.length - 5} more`);
        }
      });
    
    // Find concepts with specific keywords
    console.log('\n🔍 INTERESTING CONCEPTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const keywords = ['pool', 'beach', 'food', 'service', 'clean', 'location', 'wifi', 'staff'];
    keywords.forEach(keyword => {
      const matching = concepts.filter(c => 
        c.label.toLowerCase().includes(keyword.toLowerCase()) ||
        c.id.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (matching.length > 0) {
        console.log(`\n${keyword.toUpperCase()} related (${matching.length} concepts):`);
        matching.slice(0, 8).forEach(concept => {
          console.log(`  • ${concept.label}`);
        });
        if (matching.length > 8) {
          console.log(`  ... and ${matching.length - 8} more`);
        }
      }
    });
    
    // Export data structure for app usage
    console.log('\n💾 EXPORT DATA STRUCTURE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const exportData = {
      totalConcepts: concepts.length,
      categories: Object.keys(groupedConcepts),
      concepts: concepts.map(c => ({
        id: c.id,
        label: c.label,
        category: c.category,
        definition: c.definition
      }))
    };
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save to JSON file for app usage
    const outputPath = path.join(dataDir, 'sentiment-concepts.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
    
    console.log(`📁 Data exported to: ${outputPath}`);
    console.log(`📊 Structure: ${concepts.length} concepts across ${Object.keys(groupedConcepts).length} categories`);
    
    // Show data structure sample
    console.log('\n📋 SAMPLE DATA STRUCTURE:');
    console.log(JSON.stringify(exportData.concepts.slice(0, 3), null, 2));
    
    console.log('\n🎉 Analysis complete! Ready to integrate into the app.');
    
  } catch (error) {
    console.error('❌ Error parsing RDF file:', error.message);
    process.exit(1);
  }
}

// Run the script
main(); 