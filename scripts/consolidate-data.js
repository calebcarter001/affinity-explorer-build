#!/usr/bin/env node

/**
 * Data Consolidation Script
 * 
 * This script consolidates separate JSON data files (themes, nuances, similar destinations, evidence)
 * into a single 'complete' data file for each destination.
 * 
 * This is necessary because the main import script expects a single complete file.
 */

import fs from 'fs/promises';
import path from 'path';

const EXPORTS_SOURCE_DIR = '/Users/calebcarter/PycharmProjects/SmartDestinationThemes/exports';

async function consolidateDestinationData(destinationPath) {
  try {
    const dataDir = path.join(destinationPath, 'data');
    
    // Check if already consolidated
    const entries = await fs.readdir(dataDir);
    if (entries.some(e => e.endsWith('_complete.json'))) {
      console.log(`   ☑️  Already consolidated: ${path.basename(destinationPath)}`);
      return;
    }
    
    // Read separate files
    const themes = JSON.parse(await fs.readFile(path.join(dataDir, 'themes.json'), 'utf8'));
    const nuances = JSON.parse(await fs.readFile(path.join(dataDir, 'nuances.json'), 'utf8'));
    const similar_destinations = JSON.parse(await fs.readFile(path.join(dataDir, 'similar_destinations.json'), 'utf8'));
    const evidence = JSON.parse(await fs.readFile(path.join(dataDir, 'evidence.json'), 'utf8'));
    
    // Consolidate data
    const consolidatedData = {
      destination: themes.destination,
      export_metadata: themes.export_metadata,
      consolidated_data: {
        themes: themes,
        nuances: nuances,
        similar_destinations: similar_destinations,
        evidence: evidence
      }
    };
    
    // Write consolidated file
    const destinationId = path.basename(destinationPath.replace('/export_', '_'));
    const completeFilePath = path.join(dataDir, `${destinationId}_complete.json`);
    await fs.writeFile(completeFilePath, JSON.stringify(consolidatedData, null, 2), 'utf8');
    
    console.log(`   ✅ Consolidated: ${destinationId}`);

  } catch (error) {
    console.log(`   ❌ Error consolidating ${path.basename(destinationPath)}: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Starting Data Consolidation Process...');
  console.log(`📂 Source Directory: ${EXPORTS_SOURCE_DIR}`);
  
  try {
    const destinationDirs = await fs.readdir(EXPORTS_SOURCE_DIR, { withFileTypes: true });
    
    for (const destDir of destinationDirs) {
      if (destDir.isDirectory()) {
        const destPath = path.join(EXPORTS_SOURCE_DIR, destDir.name);
        const exportDirs = await fs.readdir(destPath, { withFileTypes: true });
        
        for (const exportDir of exportDirs) {
          if (exportDir.isDirectory() && exportDir.name.startsWith('export_')) {
            const exportPath = path.join(destPath, exportDir.name);
            await consolidateDestinationData(exportPath);
          }
        }
      }
    }
    
    console.log('\n📊 Consolidation Complete!');
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main(); 