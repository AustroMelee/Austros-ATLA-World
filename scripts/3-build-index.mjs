// scripts/3-build-index.mjs

import fs from 'fs/promises';
import path from 'path';
import FlexSearch from 'flexsearch';

// This script reads from the CORRECT, fully enriched file.
const enrichedDataPath = path.join(process.cwd(), 'public/enriched-data.json');
const searchIndexPath = path.join(process.cwd(), 'public/search-index.json');

/**
 * Creates a single, massive, searchable string from all relevant text fields
 * in a record. This is the key to comprehensive global search.
 * @param {object} record - The enriched record.
 * @returns {string} - A space-separated string of all searchable text.
 */
function createSearchBlob(record) {
  const textParts = [
    record.name,
    record.summary,
    record.role, // <-- ADDED
    record.nation, // <-- ADDED
    record.gender, // <-- ADDED
    ...(record.titles || []), // <-- ADDED
    ...(record.searchableKeywords || []), // <-- ADDED
    ...(record.fuzzySynonyms || []), // <-- ADDED
    ...(record.tags || []),
    ...(record.affiliation || []), // <-- ADDED
  ];

  // Flatten the nested tagCategories object
  if (record.tagCategories && typeof record.tagCategories === 'object') {
    for (const category of Object.values(record.tagCategories)) {
      if (Array.isArray(category)) {
        textParts.push(...category);
      }
    }
  }

  // Join, normalize, and remove duplicates for efficiency
  const uniqueParts = [...new Set(textParts.filter(Boolean).map(String))];
  return uniqueParts.join(' ').toLowerCase();
}

async function buildSearchIndex() {
  console.log('🚀 Starting true search index build...');

  let enrichedRecords;
  try {
    const fileContent = await fs.readFile(enrichedDataPath, 'utf-8');
    enrichedRecords = JSON.parse(fileContent);
    if (!Array.isArray(enrichedRecords)) {
      throw new Error('Enriched data is not an array.');
    }
    console.log(`- Read ${enrichedRecords.length} enriched records.`);
  } catch (error) {
    console.error(`❌ Error reading or parsing ${enrichedDataPath}:`, error);
    process.exit(1);
  }

  const index = new FlexSearch.Document({
    document: {
      id: 'id',
      index: ['name', 'searchBlob'],
    },
    tokenize: 'forward',
  });

  const recordMap = {};

  // 3. Process and add all records to the index
  for (const record of enrichedRecords) {
    if (!record.id) continue;
    const searchBlob = createSearchBlob(record);
    index.add({ id: record.id, name: record.name, searchBlob });
    recordMap[record.id] = record;
    
    // --- START: ADD THIS DEBUGGING BLOCK ---
    if (record.id === 'azula') {
      console.log('\n--- DEBUG: AZULA\'S SEARCH BLOB ---');
      console.log(searchBlob);
      console.log('---> Does it contain "princess"?', searchBlob.includes('princess'));
      console.log('--- END DEBUG ---\n');
    }
    // --- END: ADD THIS DEBUGGING BLOCK ---
  }
  console.log('- All records processed and added to FlexSearch index.');

  const exportedIndexData = {};
  index.export((key, data) => {
    exportedIndexData[key] = data;
  });
  console.log('- FlexSearch index exported.');

  const finalOutput = {
    index: exportedIndexData,
    records: recordMap,
  };

  await fs.writeFile(searchIndexPath, JSON.stringify(finalOutput));
  console.log(
    `✅ Successfully wrote pre-compiled index and ${
      Object.keys(recordMap).length
    } records to ${searchIndexPath}`,
  );

  console.log('Search index build complete.');
}

buildSearchIndex();
