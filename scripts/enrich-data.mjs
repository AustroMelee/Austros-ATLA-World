import fs from 'fs/promises';
import path from 'path';

// --- CONFIGURATION ---
// Maps a data type to its source directory.
const SOURCE_DIRS_MAP = {
  character: 'dist/parsed-data/characters',
  bending: 'raw-data/bending',
  food: 'raw-data/fauna',
};
const OUTPUT_FILE_DIST = 'dist/enriched-data.json';
const OUTPUT_FILE_PUBLIC = 'public/enriched-data.json';

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// --- MAIN EXECUTION ---
(async () => {
  console.log('--- Starting Data Enrichment (v3 - Robust) ---');
  try {
    let allRecords = [];

    // Process all configured data domains
    for (const [type, dirPath] of Object.entries(SOURCE_DIRS_MAP)) {
      console.log(`- Processing domain: '${type}' from '${dirPath}'`);
      try {
        const files = await fs.readdir(dirPath);
        for (const file of files.filter(f => f.endsWith('.json'))) {
          const content = await fs.readFile(path.join(dirPath, file), 'utf-8');
          const data = JSON.parse(content);

          // Handle both single objects and arrays of objects in files
          const records = Array.isArray(data) ? data : [data];
          records.forEach(record => {
            allRecords.push({ ...record, __type: type });
          });
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.warn(`  - Directory not found, skipping: ${dirPath}`);
        } else {
          console.error(`  - Error processing directory ${dirPath}:`, error);
        }
      }
    }
    
    // Enrich every record with a guaranteed slug and ID
    const enrichedRecords = allRecords.map(record => {
      const name = record.fullName || record.name || '';
      const slug = record.slug || slugify(name);
      return {
        ...record,
        id: record.id || slug,
        slug: slug,
      };
    });

    if (enrichedRecords.length === 0) {
      throw new Error("No records were processed. Check SOURCE_DIRS_MAP and raw data paths.");
    }

    // Write to both dist and public
    await fs.mkdir(path.dirname(OUTPUT_FILE_DIST), { recursive: true });
    await fs.writeFile(OUTPUT_FILE_DIST, JSON.stringify(enrichedRecords, null, 2));
    await fs.mkdir(path.dirname(OUTPUT_FILE_PUBLIC), { recursive: true });
    await fs.writeFile(OUTPUT_FILE_PUBLIC, JSON.stringify(enrichedRecords, null, 2));

    console.log(`\n✅ Successfully enriched ${enrichedRecords.length} records.`);
    console.log(`   Output written to: ${OUTPUT_FILE_DIST} and ${OUTPUT_FILE_PUBLIC}`);
  } catch (error) {
    console.error('\n❌ Fatal error during data enrichment:');
    console.error(error);
    process.exit(1);
  } finally {
    console.log('--- Data Enrichment Finished ---');
  }
})();
