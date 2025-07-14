import fs from 'fs/promises';
import path from 'path';

// --- Configuration ---
const DATA_DIR = './data';
const PARSED_DATA_PATH = path.join(DATA_DIR, 'parsed-data.json');
const ENRICHED_DATA_PATH = path.join(DATA_DIR, 'enriched-data.json');

// --- Helper Functions ---
const createSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  console.log('Starting data enrichment...');
  try {
    // Read parsed data
    const raw = await fs.readFile(PARSED_DATA_PATH, 'utf-8');
    const records = JSON.parse(raw);
    if (!Array.isArray(records)) throw new Error('Parsed data is not an array');

    // Enrich each record
    const enriched = records.map(record => {
      // Add slug (and any other derived fields here)
      const slug = record.name ? createSlug(record.name) : undefined;
      return {
        ...record,
        ...(slug ? { slug } : {}),
      };
    });

    await fs.writeFile(ENRICHED_DATA_PATH, JSON.stringify(enriched, null, 2));
    console.log(`Enriched data saved to ${ENRICHED_DATA_PATH}`);
    console.log('Data enrichment complete!');
  } catch (error) {
    console.error('An error occurred during data enrichment:', error);
    process.exit(1);
  }
}

main(); 