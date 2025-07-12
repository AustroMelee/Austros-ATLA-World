import { promises as fs } from 'fs';
import path from 'path';
import FlexSearch from 'flexsearch';

const enrichedDataPath = path.resolve(process.cwd(), 'public/enriched-data.json');
const searchIndexPath = path.resolve(process.cwd(), 'public/search-index.json');
const distIndexPath = path.resolve(process.cwd(), 'dist/search-index.json'); // Also save to dist

async function buildIndex() {
  console.log('Reading enriched data...');
  const enrichedDataFile = await fs.readFile(enrichedDataPath, 'utf-8');
  const records = JSON.parse(enrichedDataFile);

  if (!Array.isArray(records)) {
    throw new Error('Enriched data is not an array.');
  }
  
  console.log(`Found ${records.length} records to index.`);

  const index = new FlexSearch.Document({
    document: {
      id: 'slug',
      index: ['name', 'description', 'tags', 'synonyms', 'nation', 'bending', 'role'],
      store: ['name', 'slug', '__type', 'description', 'nation', 'icon'],
    },
    tokenize: 'forward',
  });

  records.forEach(record => {
    index.add(record);
  });

  console.log('FlexSearch index created. Exporting...');

  const exportedIndex = {};
  await new Promise(resolve => {
    index.export((key, data) => {
      // @ts-ignore
      exportedIndex[key] = data;
      if (Object.keys(exportedIndex).length === 7) { // Wait for all parts to be exported
         resolve(undefined);
      }
    });
  });
  
  const recordMap = records.reduce((acc, record) => {
    acc[record.slug] = record;
    return acc;
  }, {});

  const finalOutput = {
    index: exportedIndex,
    records: recordMap,
  };

  await fs.mkdir(path.dirname(searchIndexPath), { recursive: true });
  await fs.writeFile(searchIndexPath, JSON.stringify(finalOutput));
  await fs.mkdir(path.dirname(distIndexPath), { recursive: true });
  await fs.writeFile(distIndexPath, JSON.stringify(finalOutput)); // Also write to dist for good measure

  console.log(`✅ Search index built successfully at ${searchIndexPath} and ${distIndexPath}`);
}

buildIndex().catch(err => {
  console.error('❌ Failed to build search index:', err);
  process.exit(1);
});