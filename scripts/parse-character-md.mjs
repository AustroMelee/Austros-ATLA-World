import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

const INPUT_DIR = 'raw-data/characters';
const OUTPUT_DIR = 'dist/parsed-data/characters';

/**
 * Extracts a single-line value for a given key from a markdown-like list.
 * @param {string} content The block of text to search within.
 * @param {string} key The key to look for (e.g., "Name").
 * @returns {string|null}
 */
function extractValue(content, key) {
  const regex = new RegExp(`-\\s*${key}:\\s*(.*)`);
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Extracts all JSON code blocks from a markdown file.
 * @param {string} content The entire file content.
 * @returns {object[]} An array of parsed JSON objects.
 */
function extractJsonBlocks(content) {
  const regex = /```json\s*([\s\S]*?)\s*```/g;
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    try {
      matches.push(JSON.parse(match[1]));
    } catch (e) {
      console.error(`[Warning] Could not parse a JSON block. Error: ${e.message}`);
    }
  }
  return matches;
}

/**
 * Flattens an array of objects into a single object, merging them.
 * @param {object[]} objects The array of objects to flatten.
 * @returns {object} A single merged object.
 */
function flattenObjects(objects) {
  return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {});
}

async function main() {
  console.log('--- Starting Character Markdown Parsing (SRP-Compliant v3.0) ---');
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const mdFiles = await glob(`${INPUT_DIR}/*.md`);

  for (const file of mdFiles) {
    const fileName = path.basename(file, '.md');
    if (fileName === 'character_template') continue;

    console.log(`[Processing] Parsing ${file}...`);
    const fileContent = await fs.readFile(file, 'utf8');

    // --- SINGLE RESPONSIBILITY: EXTRACT ALL DATA ---

    // 1. Extract basic UI "Card View" data
    const cardViewMatch = fileContent.match(/## [^\n]*UI - CARD VIEW[^`]*```md\s*([\s\S]*?)\s*```/);
    const cardContent = cardViewMatch ? cardViewMatch[1] : '';

    const cardData = {
      name: extractValue(cardContent, 'Name') || 'Unknown',
      nation: extractValue(cardContent, 'Nation') || 'Unknown',
      description: extractValue(cardContent, 'Short Description') || '',
    };
    
    // 1b. Extract UI - EXPANDED VIEW block as markdown string
    const expandedViewMatch = fileContent.match(/## [^\n]*UI - EXPANDED VIEW[^`]*```md\s*([\s\S]*?)\s*```/);
    const expandedView = expandedViewMatch ? expandedViewMatch[1].trim() : '';
    
    // 2. Extract all backend metadata from JSON blocks
    const jsonObjects = extractJsonBlocks(fileContent);
    const backendData = flattenObjects(jsonObjects);
    
    // 3. Combine all data into one rich object
    const characterData = {
      ...backendData, // Backend data is the base
      ...cardData,    // Card view data can override for consistency if needed
      expandedView,   // Add the expanded view markdown
      __type: 'character',
      __source: path.basename(file),
    };

    // --- END OF RESPONSIBILITY ---

    const outputPath = path.join(OUTPUT_DIR, `${fileName}.json`);
    await fs.writeFile(outputPath, JSON.stringify(characterData, null, 2));
    console.log(`[SUCCESS] Saved fully parsed data to ${outputPath}`);
  }

  console.log('--- Character Markdown Parsing Complete ---');
}

main().catch(error => {
  console.error('A fatal error occurred:', error);
  process.exit(1);
});
