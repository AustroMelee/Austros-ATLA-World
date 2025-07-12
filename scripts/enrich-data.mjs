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

async function enrichData() {
  console.log('🚀 Starting data enrichment process...');

  const dataSources = [
    { type: 'character', path: 'raw-data/characters.json' },
    { type: 'food', path: 'raw-data/foods.json' },
    // Add other data sources here in the future
  ];

  const allEnrichedRecords = [];

  for (const source of dataSources) {
    console.log(`\nProcessing source: ${source.path}`);
    let records;
    try {
      const fileContent = await fs.readFile(source.path, 'utf-8');
      records = JSON.parse(fileContent);
    } catch (error) {
      console.error(`❌ ERROR: Could not read or parse ${source.path}. Skipping.`, error);
      continue;
    }
    
    if (!Array.isArray(records)) {
      console.error(`❌ ERROR: Data in ${source.path} is not an array. Skipping.`);
      continue;
    }

    const enriched = records
      .filter(record => record && record.name) // Ensure record is not null and has a name
      .map(record => {
        console.log(`  -> Enriching: ${record.name}`);
        const slug = slugify(record.name);

        const baseRecord = {
          id: slug,
          slug: slug,
          name: record.name,
          description: record.description || '',
          __type: source.type,
          tags: record.tags || [],
          aliases: record.aliases || [],
          sources: record.sources || [],
          image: record.image || null,
        };

        // Handle character-specific fields with type-checking
        if (source.type === 'character') {
          const charRecord = {
            ...baseRecord,
            nation: record.nation || 'Unknown',
            bending: record.bending || 'Unknown',
            role: record.role || '',
            overview: record.overview || '',
            relationships: record.relationships || '',
            // Safely handle fields that might be arrays or strings
            highlights: Array.isArray(record.highlights) ? record.highlights : (record.highlights?.split('. ') || []),
            traits: Array.isArray(record.traits) ? record.traits : (record.traits?.split('. ') || []),
            quotes: Array.isArray(record.quotes) ? record.quotes : (record.quotes?.split('" "') || []),
          };
          // Clean up quote formatting
          charRecord.quotes = charRecord.quotes.map(q => q.replace(/"/g, '').trim()).filter(Boolean);
          return charRecord;
        }

        // Handle food-specific fields
        if (source.type === 'food') {
          return {
            ...baseRecord,
            region: record.region || 'Unknown'
          };
        }

        return baseRecord;
      });
      
    allEnrichedRecords.push(...enriched);
    console.log(`  ✅ Finished processing ${source.path}. Found ${enriched.length} valid records.`);
  }

  const outputPath = path.resolve(process.cwd(), 'public/enriched-data.json');
  await fs.writeFile(outputPath, JSON.stringify(allEnrichedRecords, null, 2));

  console.log(`\n✨ Enrichment complete! ${allEnrichedRecords.length} total records written to ${outputPath}.`);
}

enrichData().catch(error => {
  console.error('\n❌ A fatal error occurred during the enrichment process:', error);
  process.exit(1);
});
