import fs from 'fs/promises';
import path from 'path';
import FlexSearch from 'flexsearch';

// --- CONFIGURATION ---
const SOURCE_FILE = 'public/enriched-characters.json';
const OUTPUT_DIR = 'public';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'search-index.json');

// --- MAIN EXECUTION ---
(async () => {
  console.log('--- Starting Search Index Build ---');
  try {
    // 1. Read the fully enriched data
    const enrichedData = JSON.parse(await fs.readFile(SOURCE_FILE, 'utf-8'));

    // 2. Configure the search index
    const index = new FlexSearch.Document({
      document: {
        id: 'slug',
        index: [
          { field: 'name', tokenize: 'forward' },
          { field: 'description', tokenize: 'forward' },
          { field: 'aliases', tokenize: 'forward' },
          { field: 'nation', tokenize: 'forward' },
          { field: 'archetype', tokenize: 'forward' },
          { field: 'thematicKeywords', tokenize: 'forward' },
          'tags',
        ],
        store: true, // Store the full document in the index result
      },
      charset: 'latin:advanced',
      language: 'en',
    });

    // 3. Create the record map and add documents to the index
    const recordMap = new Map();
    for (const record of enrichedData) {
      if (!record.slug) {
        console.warn(`- Skipping record with no slug: ${record.name || 'Unnamed'}`);
        continue;
      }
      // Add the full record to the index
      index.add(record);
      // Store the full record in our map for direct lookup
      recordMap.set(record.slug, record);
    }

    // 4. Prepare the final JSON object for export
    const exportedData = {
      index: {},
      records: Object.fromEntries(recordMap.entries()),
    };

    index.export((key, data) => {
      exportedData.index[key] = data;
    });

    // 5. Write the file
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(exportedData));

    console.log(`\n✅ Successfully built search index for ${recordMap.size} records.`);
    console.log(`   Output written to: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('\n❌ Fatal error during index build:');
    console.error(error);
    process.exit(1);
  } finally {
    console.log('--- Search Index Build Finished ---');
  }
})();
