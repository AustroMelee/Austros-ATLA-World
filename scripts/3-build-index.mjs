import fs from 'fs/promises';
import path from 'path';
import FlexSearch from 'flexsearch';

// --- Configuration ---
const ENRICHED_DATA_PATH = path.join('data', 'enriched-data.json');
const SEARCH_INDEX_PATH = path.join('public', 'search-index.json');

async function main() {
  console.log('Starting search index build...');

  try {
    // Read enriched data
    const enrichedDataRaw = await fs.readFile(ENRICHED_DATA_PATH, 'utf-8');
    const enrichedData = JSON.parse(enrichedDataRaw);

    // Initialize FlexSearch Document index
    const index = new FlexSearch.Document({
      document: { id: 'slug', index: ['name', 'description'], store: true },
      tokenize: 'forward',
    });

    // Add each record to the index
    enrichedData.forEach(record => index.add(record));

    // Export the index
    const exportedIndex = {};
    await index.export((key, data) => {
      exportedIndex[key] = data;
    });

    // Prepare the search artifact
    const searchArtifact = {
      index: exportedIndex,
      records: enrichedData.reduce((acc, rec) => {
        acc[rec.slug] = rec;
        return acc;
      }, {})
    };

    // Write the search artifact to the public directory
    await fs.writeFile(SEARCH_INDEX_PATH, JSON.stringify(searchArtifact));
    console.log(`Search index saved to ${SEARCH_INDEX_PATH}`);
    console.log('Index build complete!');
  } catch (error) {
    console.error('An error occurred during index build:', error);
    process.exit(1);
  }
}

main();
