import fs from 'fs/promises';
import path from 'path';
import FlexSearch from 'flexsearch';
import grayMatter from 'gray-matter';

// --- Configuration ---
const RAW_DATA_DIR = './raw-data';
const DIST_DIR = './dist';
const ENRICHED_DATA_PATH = path.join(DIST_DIR, 'enriched-data.json');
const SEARCH_INDEX_PATH = path.join(DIST_DIR, 'search-index.json');

// --- Helper Functions ---
const createSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function parseMarkdownFile(filePath) {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data: frontmatter, content } = grayMatter(fileContent);
  const type = frontmatter.type;

  if (!type) {
    console.warn(`Skipping ${filePath}: Missing 'type' in frontmatter.`);
    return [];
  }

  // Split content by the #<Number> delimiter
  const itemBlocks = content.split(/#\d+/).filter(block => block.trim() !== '');

  const records = itemBlocks.map(block => {
    const lines = block.trim().split('\n');
    const record = {};
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        record[key.trim()] = valueParts.join(':').trim();
      }
    });
    return record;
  });
  
  // Add metadata
  return records.map(record => {
    if (!record.name) return null;
    const slug = createSlug(record.name);
    return {
      ...record,
      id: slug,
      slug: slug,
      __type: type,
    };
  }).filter(Boolean); // Filter out any null records
}

// --- Main Execution ---
async function main() {
  console.log('Starting data processing...');
  
  try {
    // Ensure dist directory exists
    await fs.mkdir(DIST_DIR, { recursive: true });

    const allRecords = [];
    const files = await fs.readdir(RAW_DATA_DIR, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile() && file.name.endsWith('.md')) {
        const filePath = path.join(RAW_DATA_DIR, file.name);
        console.log(`Processing ${filePath}...`);
        const records = await parseMarkdownFile(filePath);
        allRecords.push(...records);
      }
    }

    console.log(`Successfully parsed ${allRecords.length} records.`);

    // --- Create and save enriched data ---
    await fs.writeFile(ENRICHED_DATA_PATH, JSON.stringify(allRecords, null, 2));
    console.log(`Enriched data saved to ${ENRICHED_DATA_PATH}`);

    // --- Build and save search index ---
    const index = new FlexSearch.Document({
      document: { id: 'slug', index: ['name', 'description'], store: true },
      tokenize: 'forward',
    });
    
    allRecords.forEach(record => index.add(record));
    
    const exportedIndex = {};
    await index.export((key, data) => {
        exportedIndex[key] = data;
    });

    const searchArtifact = {
      index: exportedIndex,
      records: allRecords.reduce((acc, rec) => {
        acc[rec.slug] = rec;
        return acc;
      }, {})
    };

    await fs.writeFile(SEARCH_INDEX_PATH, JSON.stringify(searchArtifact));
    console.log(`Search index saved to ${SEARCH_INDEX_PATH}`);

    console.log('Data processing complete!');

  } catch (error) {
    console.error('An error occurred during data processing:', error);
    process.exit(1);
  }
}

main(); 