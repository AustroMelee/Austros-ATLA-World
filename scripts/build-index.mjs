import fs from 'fs';
import path from 'path';
import FlexSearch from 'flexsearch';

// --- Configuration ---
const ENRICHED_DATA_PATH = path.join(process.cwd(), 'public', 'enriched-data.json');
const INDEX_OUTPUT_PATH = path.join(process.cwd(), 'public', 'search-index.json');

function lower(str) {
  return typeof str === 'string' ? str.toLowerCase() : str;
}

function lowerArray(arr) {
  return Array.isArray(arr) ? arr.map(lower) : arr;
}

// --- Main Indexing Logic ---
async function buildIndex() {
  console.log('Reading enriched data...');
  if (!fs.existsSync(ENRICHED_DATA_PATH)) {
    console.error(`ERROR: Enriched data not found at ${ENRICHED_DATA_PATH}. Run enrichment script first.`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(ENRICHED_DATA_PATH, 'utf-8'));

  console.log('Building FlexSearch index...');

  const index = new FlexSearch.Document({
    document: {
      id: 'slug',
      index: [
        { field: 'name', tokenize: 'forward' },
        { field: 'description', tokenize: 'forward' },
        { field: 'tags', tokenize: 'forward' },
        { field: 'synonyms', tokenize: 'forward' },
        { field: 'nation', tokenize: 'forward' },
        { field: 'bending', tokenize: 'forward' },
        { field: 'role', tokenize: 'forward' }
      ],
      store: ['slug', 'name', 'description', '__type', 'nation'],
    }
  });

  const recordMap = new Map();
  data.forEach(record => {
    if (record && record.slug) {
      // Lowercase all indexed fields for robust case-insensitive search
      const lowercased = {
        ...record,
        name: lower(record.name),
        description: lower(record.description),
        nation: lower(record.nation),
        bending: lower(record.bending),
        role: lower(record.role),
        tags: lowerArray(record.tags),
        synonyms: lowerArray(record.synonyms)
      };
      index.add(lowercased);
      recordMap.set(record.slug, record); // Store original for display
    }
  });

  console.log('Exporting index and records...');
  const exportedIndex = {};
  await index.export((key, data) => {
    exportedIndex[key] = data;
  });

  const output = {
    index: exportedIndex,
    records: Object.fromEntries(recordMap.entries()),
  };

  fs.writeFileSync(INDEX_OUTPUT_PATH, JSON.stringify(output));
  console.log(`✅ Index built successfully at ${INDEX_OUTPUT_PATH}`);
}

buildIndex().catch(err => {
  console.error('Failed to build search index:', err);
  process.exit(1);
});