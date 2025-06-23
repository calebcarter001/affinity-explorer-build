#!/usr/bin/env node

/**
 * Destination Data Import Script
 * 
 * This script automatically imports destination data from the SmartDestinationThemes exports
 * directory and transforms it for use in the Affinity Explorer application.
 * 
 * Features:
 * - Detects new/updated export files
 * - Cleans existing data with --clean flag
 * - Transforms complete export data format
 * - Updates application configuration
 * - Validates data integrity
 * - Provides detailed logging
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Source directory (SmartDestinationThemes exports)
  EXPORTS_SOURCE_DIR: '/Users/calebcarter/PycharmProjects/SmartDestinationThemes/exports',
  
  // Target directory (Affinity Explorer public data)
  TARGET_DATA_DIR: path.join(__dirname, '..', 'public', 'data', 'export'),
  
  // Application config file
  APP_CONFIG_FILE: path.join(__dirname, '..', 'src', 'config', 'appConfig.js'),
  
  // Import tracking file
  IMPORT_TRACKING_FILE: path.join(__dirname, '.import-tracking.json'),
  
  // File patterns
  COMPLETE_DATA_PATTERN: /^(.+)_complete\.json$/,
  MANIFEST_PATTERN: /^EXPORT_MANIFEST\.json$/,
  
  // Validation settings
  MIN_FILE_SIZE: 1024, // 1KB minimum
  REQUIRED_SECTIONS: ['themes', 'nuances', 'similar_destinations']
};

class DestinationDataImporter {
  constructor(options = {}) {
    this.options = options;
    this.importedDestinations = new Set();
    this.skippedDestinations = new Set();
    this.errors = [];
    this.startTime = Date.now();
  }

  async run() {
    console.log('🚀 Starting Destination Data Import Process...');
    console.log(`📂 Source: ${CONFIG.EXPORTS_SOURCE_DIR}`);
    console.log(`🎯 Target: ${CONFIG.TARGET_DATA_DIR}`);
    if (this.options.clean) console.log('🗑️  Clean mode enabled');
    console.log('');

    try {
      if (this.options.clean) {
        await this.cleanTargetDirectory();
      }

      await this.initializeTracking();
      const sourceDestinations = await this.scanSourceDirectory();
      console.log(`📊 Found ${sourceDestinations.length} destination(s) in source directory`);

      for (const destination of sourceDestinations) {
        await this.processDestination(destination);
      }

      await this.updateApplicationConfig();
      await this.updateTracking();
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Import process failed:', error.message);
      process.exit(1);
    }
  }

  async cleanTargetDirectory() {
    console.log('🗑️  Cleaning target directory...');
    try {
      await fs.rm(CONFIG.TARGET_DATA_DIR, { recursive: true, force: true });
      await fs.mkdir(CONFIG.TARGET_DATA_DIR, { recursive: true });
      console.log('   ✅ Target directory cleaned');
    } catch (error) {
      throw new Error(`Failed to clean target directory: ${error.message}`);
    }
  }

  async initializeTracking() {
    if (this.options.clean) {
      this.tracking = { lastImport: null, destinations: {}, version: '1.0.0' };
      return;
    }
    
    try {
      const trackingData = await fs.readFile(CONFIG.IMPORT_TRACKING_FILE, 'utf8');
      this.tracking = JSON.parse(trackingData);
    } catch (error) {
      this.tracking = { lastImport: null, destinations: {}, version: '1.0.0' };
    }
  }

  async scanSourceDirectory() {
    try {
      const entries = await fs.readdir(CONFIG.EXPORTS_SOURCE_DIR, { withFileTypes: true });
      const destinations = [];
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const destinationPath = path.join(CONFIG.EXPORTS_SOURCE_DIR, entry.name);
          const exportDirs = await this.findLatestExportDir(destinationPath);
          if (exportDirs) {
            const originalId = entry.name;
            const sanitizedId = originalId.replace(/'/g, "").replace(/ /g, '_');
            destinations.push({
              id: sanitizedId,
              name: this.formatDestinationName(originalId),
              sourcePath: exportDirs.path,
              lastModified: exportDirs.lastModified
            });
          }
        }
      }
      return destinations;
    } catch (error) {
      throw new Error(`Failed to scan source directory: ${error.message}`);
    }
  }

  async findLatestExportDir(destinationPath) {
    try {
      console.log(`   🔎 Scanning for export directories in: ${destinationPath}`);
      const entries = await fs.readdir(destinationPath, { withFileTypes: true });
      const exportDirs = entries
        .filter(e => e.isDirectory() && e.name.startsWith('export_'))
        .map(e => ({ name: e.name, path: path.join(destinationPath, e.name), time: e.name.replace('export_', '') }))
        .sort((a, b) => b.time.localeCompare(a.time));
      
      if (exportDirs.length > 0) {
        console.log(`      Found ${exportDirs.length} export directories. Latest: ${exportDirs[0].name}`);
        const stats = await fs.stat(exportDirs[0].path);
        return { path: exportDirs[0].path, lastModified: stats.mtime.getTime() };
      }
      
      console.log(`      No export directories found.`);
      return null;
    } catch (error) {
      console.log(`      Error scanning export directories: ${error.message}`);
      return null;
    }
  }

  async processDestination(destination) {
    const { id, name, sourcePath, lastModified } = destination;
    try {
      console.log(`\n📍 Processing: ${name} (${id})`);
      if (!this.options.force && !this.needsUpdate(id, lastModified)) {
        console.log(`   ⏭️  Skipped (up to date)`);
        this.skippedDestinations.add(id);
        return;
      }

      const dataFiles = await this.findDataFiles(sourcePath);
      if (!dataFiles.complete) {
        console.log(`   ⚠️  Skipped (no complete data found)`);
        this.skippedDestinations.add(id);
        return;
      }

      const data = await this.loadAndValidateData(dataFiles.complete);
      if (!data) {
        this.errors.push(`${id}: Data validation failed`);
        return;
      }

      // Transform the data to ensure proper structure
      const transformedData = this.transformExportData(data, id);

      const targetDir = path.join(CONFIG.TARGET_DATA_DIR, id, 'data');
      await fs.mkdir(targetDir, { recursive: true });
      const targetFile = path.join(targetDir, `${id}_complete.json`);
      
      // Write the transformed data instead of copying raw
      await fs.writeFile(targetFile, JSON.stringify(transformedData, null, 2), 'utf8');

      // Save metadata for config generation
      const metadata = {
        name: destination.name,
        flag: this.getDestinationFlag(id)
      };
      const metadataPath = path.join(CONFIG.TARGET_DATA_DIR, id, 'metadata.json');
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`   ✅ Imported successfully`);
      this.importedDestinations.add(id);
      this.tracking.destinations[id] = { lastImported: Date.now(), lastModified };
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      this.errors.push(`${id}: ${error.message}`);
    }
  }

  needsUpdate(id, lastModified) {
    const tracked = this.tracking.destinations[id];
    return !tracked || lastModified > tracked.lastModified;
  }

  async findDataFiles(exportPath) {
    const dataDir = path.join(exportPath, 'data');
    let complete = null;
    try {
      console.log(`      Looking for complete data in: ${dataDir}`);
      const entries = await fs.readdir(dataDir);
      console.log(`      Found ${entries.length} files in data directory: ${entries.join(', ')}`);
      const completeFile = entries.find(e => e.endsWith('_complete.json'));
      if (completeFile) {
        complete = path.join(dataDir, completeFile);
        console.log(`      Found complete data file: ${complete}`);
      } else {
        console.log(`      No complete data file found in data directory.`);
      }
    } catch (error) {
      console.log(`      Error reading data directory: ${error.message}`);
    }
    return { complete };
  }

  async loadAndValidateData(filePath) {
    try {
      const stats = await fs.stat(filePath);
      if (stats.size < CONFIG.MIN_FILE_SIZE) throw new Error('File too small');
      const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
      const consolidated = data.consolidated_data || data;
      for (const section of CONFIG.REQUIRED_SECTIONS) {
        if (!consolidated[section]) throw new Error(`Missing section: ${section}`);
      }
      return data;
    } catch (error) {
      console.log(`      Validation error: ${error.message}`);
      return null;
    }
  }

  /**
   * Transform export data to ensure proper structure for frontend consumption
   * This fixes all the data structure issues once and for all
   */
  transformExportData(data, destinationId) {
    console.log(`      🔄 Transforming data structure for ${destinationId}...`);
    
    const consolidated = data.consolidated_data || data;
    
    // Transform themes data
    const transformedThemes = this.transformThemesData(consolidated.themes);
    
    // Transform nuances data 
    const transformedNuances = this.transformNuancesData(consolidated.nuances);
    
    // Transform similar destinations data
    const transformedSimilarDestinations = this.transformSimilarDestinationsData(consolidated.similar_destinations);
    
    // Transform evidence data
    const transformedEvidence = this.transformEvidenceData(consolidated.evidence);
    
    const transformedData = {
      destination: data.destination,
      export_metadata: data.export_metadata,
      consolidated_data: {
        themes: transformedThemes,
        nuances: transformedNuances,
        similar_destinations: transformedSimilarDestinations,
        evidence: transformedEvidence,
        metadata: consolidated.metadata
      }
    };
    
    console.log(`      ✅ Data transformation complete`);
    return transformedData;
  }

  transformThemesData(themesData) {
    if (!themesData) return null;
    
    // Ensure themes are accessible at the correct path
    const themes = themesData.themes_data || themesData;
    
    return {
      destination: themes.destination || themesData.destination,
      export_metadata: themes.export_metadata || themesData.export_metadata,
      themes_data: {
        affinities: themes.affinities || themes.themes_data?.affinities || [],
        intelligence_insights: themes.intelligence_insights || themes.themes_data?.intelligence_insights || {}
      }
    };
  }

  transformNuancesData(nuancesData) {
    if (!nuancesData) return null;
    
    // Handle nested structure
    const nuances = nuancesData.nuances_data || nuancesData;
    
    // Ensure all three categories are properly structured
    const destinationNuances = nuances.destination_nuances || [];
    const hotelExpectations = nuances.hotel_expectations || [];
    const vacationRentalExpectations = nuances.vacation_rental_expectations || [];
    
    console.log(`         📊 Nuances: ${destinationNuances.length} destination, ${hotelExpectations.length} hotel, ${vacationRentalExpectations.length} vacation rental`);
    
    return {
      destination: nuances.destination || nuancesData.destination,
      export_metadata: nuances.export_metadata || nuancesData.export_metadata,
      nuances_data: {
        destination_nuances: destinationNuances,
        hotel_expectations: hotelExpectations,
        vacation_rental_expectations: vacationRentalExpectations,
        overall_nuance_quality_score: nuances.overall_nuance_quality_score || 0.8
      }
    };
  }

  transformSimilarDestinationsData(similarDestinationsData) {
    if (!similarDestinationsData) return null;
    
    // Handle nested structure
    const similarDests = similarDestinationsData.similar_destinations_data || similarDestinationsData;
    
    const similarDestinations = similarDests.similar_destinations || [];
    
    console.log(`         🗺️  Similar destinations: ${similarDestinations.length} found`);
    
    return {
      destination: similarDests.destination || similarDestinationsData.destination,
      export_metadata: similarDests.export_metadata || similarDestinationsData.export_metadata,
      similar_destinations_data: {
        similar_destinations: similarDestinations,
        quality_score: similarDests.quality_score || 0.6,
        processing_metadata: similarDests.processing_metadata || {},
        statistics: similarDests.statistics || {}
      }
    };
  }

  transformEvidenceData(evidenceData) {
    if (!evidenceData) return null;
    
    // Handle nested structure
    const evidence = evidenceData.evidence_data || evidenceData;
    
    return {
      destination: evidence.destination || evidenceData.destination,
      export_metadata: evidence.export_metadata || evidenceData.export_metadata,
      evidence_data: {
        evidence: evidence.evidence || evidence.evidence_data?.evidence || []
      }
    };
  }

  async updateApplicationConfig() {
    console.log('\n🔧 Updating application configuration...');
    try {
      const configContent = await fs.readFile(CONFIG.APP_CONFIG_FILE, 'utf8');
      const destinations = await this.generateDestinationsConfig();
      const updatedConfig = this.replaceDestinationsInConfig(configContent, destinations);
      await fs.writeFile(CONFIG.APP_CONFIG_FILE, updatedConfig, 'utf8');
      console.log(`   ✅ Updated configuration with ${destinations.length} destinations`);
    } catch (error) {
      console.log(`   ❌ Failed to update config: ${error.message}`);
    }
  }

  async generateDestinationsConfig() {
    const destinations = [];
    try {
      const entries = await fs.readdir(CONFIG.TARGET_DATA_DIR, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const id = entry.name;
          const metadataPath = path.join(CONFIG.TARGET_DATA_DIR, id, 'metadata.json');
          try {
            const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
            destinations.push({
              id,
              name: metadata.name,
              flag: metadata.flag,
              dataFiles: { themes: `export/${id}/themes.json`, nuances: `export/${id}/nuances.json`, evidence: `export/${id}/evidence.json` }
            });
          } catch (e) {
            // Fallback if metadata is missing
            destinations.push({
              id,
              name: this.formatDestinationName(id),
              flag: this.getDestinationFlag(id),
              dataFiles: { themes: `export/${id}/themes.json`, nuances: `export/${id}/nuances.json`, evidence: `export/${id}/evidence.json` }
            });
          }
        }
      }
    } catch {}
    return destinations.sort((a, b) => a.name.localeCompare(b.name));
  }

  replaceDestinationsInConfig(config, destinations) {
    const destString = destinations.map(d => {
      const safeName = d.name.replace(/'/g, "\\'");
      return `    { 
      id: '${d.id}', 
      name: '${safeName}', 
      flag: '${d.flag}',
      dataFiles: { themes: '${d.dataFiles.themes}', nuances: '${d.dataFiles.nuances}', evidence: '${d.dataFiles.evidence}' }
    }`
    }).join(',\n');
    return config.replace(/AVAILABLE_DESTINATIONS:\s*\[[\s\S]*?\]/, `AVAILABLE_DESTINATIONS: [\n${destString}\n  ]`);
  }

  formatDestinationName(id) {
    return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  getDestinationFlag(id) {
    const flags = { 'paris_france': '🇫🇷', 'tokyo_japan': '🇯🇵', 'rome_italy': '🇮🇹' };
    return flags[id] || '🌍';
  }

  async updateTracking() {
    this.tracking.lastImport = Date.now();
    await fs.writeFile(CONFIG.IMPORT_TRACKING_FILE, JSON.stringify(this.tracking, null, 2), 'utf8');
  }

  generateReport() {
    console.log(`\n📊 Import Process Complete! (took ${(Date.now() - this.startTime) / 1000}s)`);
    console.log(`   - Imported: ${this.importedDestinations.size}`);
    console.log(`   - Skipped:  ${this.skippedDestinations.size}`);
    console.log(`   - Errors:   ${this.errors.length}`);
    if (this.errors.length > 0) console.log('   Errors:', this.errors);
    console.log('\n🚀 Ready to restart the development server!');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const options = {
    force: args.includes('--force'),
    clean: args.includes('--clean')
  };

  if (args.includes('--help')) {
    console.log(`
Usage: node scripts/import-destination-data.js [options]
Options:
  --force     Force reimport of all destinations
  --clean     Delete existing data before import
  --help      Show this help message
`);
    return;
  }
  
  const importer = new DestinationDataImporter(options);
  await importer.run();
}

main().catch(console.error); 