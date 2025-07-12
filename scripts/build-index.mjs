// scripts/build-index.mjs

import fs from 'fs/promises';
import path from 'path';
import FlexSearch from 'flexsearch';

const ENRICHED_DATA_PATH = path.resolve('public/enriched-data.json');
const SEARCH_INDEX_PATH = path.resolve('public/search-index.json');
const DIST_INDEX_PATH = path.resolve('dist/search-index.json');

async function buildSearchIndex() {
  console.log('Starting search index build...');

  try {
    const data = await fs.readFile(ENRICHED_DATA_PATH, 'utf-8');
    const enrichedData = JSON.parse(data);

    // Create a new FlexSearch document index
    // Note: The generic type here is for documentation; FlexSearch itself is not strongly typed this way.
    const index = new FlexSearch.Document({
      document: {
        id: 'slug', // Use slug as the unique ID
        index: ['name', 'description', 'tags', 'synonyms', 'relations'],
      },
      tokenize: 'forward',
    });

    const recordMap = new Map();
    let totalRecords = 0;

    // Flatten all records and add them to the index and map
    for (const domain in enrichedData) {
      if (Array.isArray(enrichedData[domain])) {
        enrichedData[domain].forEach(record => {
          if (record && record.slug) {
            index.add(record);
            recordMap.set(record.slug, record);
            totalRecords++;
          } else {
            console.warn(`Skipping record without a slug in domain "${domain}":`, record.name || 'Unknown');
          }
        });
      }
    }
    
    console.log(`Indexed ${totalRecords} records across ${Object.keys(enrichedData).length} domains.`);

    // The FlexSearch export gives an object where each key is an index part
    const exportedIndex = {};
    index.export((key, data) => {
      exportedIndex[key] = data;
    });

    const finalOutput = {
      index: exportedIndex,
      records: Object.fromEntries(recordMap.entries()), // A map of slug -> full record for hydration
    };

    // Ensure dist directory exists
    await fs.mkdir(path.dirname(DIST_INDEX_PATH), { recursive: true });
    
    // Write to /dist/
    await fs.writeFile(DIST_INDEX_PATH, JSON.stringify(finalOutput, null, 2));
    
    // Also write to /public/ for immediate client access
    await fs.writeFile(SEARCH_INDEX_PATH, JSON.stringify(finalOutput, null, 2));

    console.log(`✅ Search index built successfully at ${DIST_INDEX_PATH} and copied to ${SEARCH_INDEX_PATH}`);

  } catch (error) {
    console.error('❌ Failed to build search index:', error);
    process.exit(1);
  }
}

buildSearchIndex();
