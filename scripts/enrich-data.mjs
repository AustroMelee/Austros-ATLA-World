import fs from 'fs/promises';
import path from 'path';

// --- CONFIGURATION ---
// Maps a data type to its source file (patched to use parsed-data.json)
const SOURCE_FILES_MAP = {
  character: 'data/parsed-data.json'
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
  console.log('--- Starting Data Enrichment (v3 - Robust, PATCHED) ---');
  try {
    let allRecords = [];

    // Process all configured data domains
    for (const [type, filePath] of Object.entries(SOURCE_FILES_MAP)) {
      console.log(`- Processing domain: '${type}' from '${filePath}'`);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const records = JSON.parse(content);
        records.forEach(record => {
          // --- NORMALIZATION & REPAIR ---
          record.name = record.name || record.fullName || (record.identity && (record.identity.name || record.identity.fullName)) || '?';
          record.nation = record.nation || record.nationality || (record.identity && (record.identity.nation || record.identity.nationality)) || 'Unknown';
          record.id = record.id || record.slug || (record.name ? record.name.toLowerCase().replace(/\s+/g, '-') : '?');
          record.slug = record.slug || (record.name ? record.name.toLowerCase().replace(/\s+/g, '-') : '?');
          record.description = record.description || record.shortDescription || '';
          record.expandedView = record.expandedView || '';
          // PATCH: Support badge field as role if present
          record.role = record.role || record.badge || (record.titles && record.titles[0]) || '';
          allRecords.push({ ...record, __type: type });
        });
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.warn(`  - File not found, skipping: ${filePath}`);
        } else {
          console.error(`  - Error processing file ${filePath}:`, error);
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
