import fs from 'fs/promises';
import path from 'path';
import enrichRecord from './lib/enrichRecord.mjs';

const parsedDataPath = path.join(process.cwd(), 'data/parsed-data.json');
const enrichedDataPath = path.join(process.cwd(), 'public/enriched-data.json');
const tagDictionaryPath = path.join(process.cwd(), 'src/data/tag_dictionary.json');

async function enrichData() {
  try {
    const data = await fs.readFile(parsedDataPath, 'utf8');
    const records = JSON.parse(data);
    const tagDictData = await fs.readFile(tagDictionaryPath, 'utf8');
    const tagDictionary = JSON.parse(tagDictData);

    const enrichedRecords = records.map(r => enrichRecord(r, tagDictionary));

    await fs.writeFile(
      enrichedDataPath,
      JSON.stringify(enrichedRecords, null, 2),
    );
    console.log(
      `✅ Successfully enriched ${enrichedRecords.length} records and saved to ${enrichedDataPath}`,
    );
  } catch (error) {
    console.error('Error during data enrichment:', error);
    process.exit(1);
  }
}

enrichData();