import { promises as fs } from 'fs';
import path from 'path';

// Helper to create a URL-safe slug from a name
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const VERBOSE = process.argv.includes('--verbose');

async function getAllJsonFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter(e => e.isFile() && e.name.endsWith('.json'))
    .map(e => path.join(dir, e.name));
}

async function enrichData() {
  console.log('🚀 Starting character data enrichment process...');

  const charJsonDir = 'raw-data/characters/json/';
  let files = [];
  try {
    files = await getAllJsonFiles(charJsonDir);
  } catch (err) {
    console.error(`❌ ERROR: Could not read directory ${charJsonDir}.`, err);
    process.exit(1);
  }
  if (files.length === 0) {
    console.warn(`⚠️  No character .json files found in ${charJsonDir}`);
    process.exit(1);
  }

  const allEnrichedRecords = [];
  for (const file of files) {
    try {
      const fileContent = await fs.readFile(file, 'utf-8');
      const record = JSON.parse(fileContent);
      if (!record || !record.name) {
        console.warn(`⚠️  Skipping malformed or nameless record in ${file}`);
        continue;
      }
      if (VERBOSE) console.log(`  -> Enriching: ${record.name}`);
      const slug = slugify(record.name);
      const baseRecord = {
        id: slug,
        slug: slug,
        name: record.name,
        description: record.description || '',
        __type: 'character',
        tags: record.tags || [],
        aliases: record.aliases || [],
        sources: record.sources || [],
        image: record.image || null,
      };
      // Handle character-specific fields with type-checking
      const charRecord = {
        ...baseRecord,
        nation: record.nation || 'Unknown',
        bending: record.bending || 'Unknown',
        role: record.role || '',
        overview: record.overview || '',
        relationships: record.relationships || '',
        highlights: Array.isArray(record.highlights) ? record.highlights : (record.highlights?.split('. ') || []),
        traits: Array.isArray(record.traits) ? record.traits : (record.traits?.split('. ') || []),
        quotes: Array.isArray(record.quotes) ? record.quotes : (record.quotes?.split('" "') || []),
      };
      charRecord.quotes = charRecord.quotes.map(q => q.replace(/"/g, '').trim()).filter(Boolean);
      allEnrichedRecords.push(charRecord);
    } catch (err) {
      console.error(`❌ ERROR: Could not process ${file}:`, err.message);
    }
  }
  console.log(`  ✅ Finished processing ${files.length} character files. ${allEnrichedRecords.length} valid records.`);

  const outputPath = path.resolve(process.cwd(), 'public/enriched-data.json');
  await fs.writeFile(outputPath, JSON.stringify(allEnrichedRecords, null, 2));

  console.log(`\n✨ Enrichment complete! ${allEnrichedRecords.length} total character records written to ${outputPath}.`);
}

enrichData().catch(error => {
  console.error('\n❌ A fatal error occurred during the enrichment process:', error);
  process.exit(1);
});
