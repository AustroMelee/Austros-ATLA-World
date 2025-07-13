import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

const INPUT_DIR = 'raw-data/characters';
const OUTPUT_DIR = 'raw-data/characters/json';

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
 * Extracts a multi-line list for a given key.
 * @param {string} content The block of text to search within.
 * @param {string} key The key for the list (e.g., "Narrative Highlights").
 * @returns {string[]}
 */
function extractList(content, key) {
  const regex = new RegExp(`-\\s*${key}:\\s*([\\s\\S]*?)(?=\\n-\\s*\\w|$)`);
  const match = content.match(regex);
  if (!match) return [];
  return match[1]
    .trim()
    .split('\n')
    .map(s => s.replace(/-\\s*/, '').trim())
    .filter(Boolean);
}

async function main() {
  console.log('--- Starting Character Markdown Parsing (Final Version) ---');
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const mdFiles = await glob(`${INPUT_DIR}/*.md`);

  for (const file of mdFiles) {
    const fileName = path.basename(file, '.md');
    if (fileName === 'character_template') continue;

    console.log(`[Processing] Parsing ${file}...`);
    const fileContent = await fs.readFile(file, 'utf8');

    const cardViewMatch = fileContent.match(/## [^\n]*UI - CARD VIEW[^`]*```md\s*([\s\S]*?)\s*```/);
    const expandedViewMatch = fileContent.match(/## [^\n]*UI - EXPANDED VIEW[^`]*```md\s*([\s\S]*?)\s*```/);
    
    const cardContent = cardViewMatch ? cardViewMatch[1] : '';
    const expandedContent = expandedViewMatch ? expandedViewMatch[1] : '';

    // Create the final JSON object by parsing both sections
    const characterData = {
      id: fileName, // Use filename as the base ID
      name: extractValue(cardContent, 'Name') || 'Unknown',
      nation: extractValue(cardContent, 'Nation') || 'Unknown',
      description: extractValue(cardContent, 'Short Description') || '',
      
      // Extract from Expanded View
      overview: extractValue(expandedContent, 'Overview') || '',
      role: extractValue(expandedContent, 'Role in the Story') || '',
      relationships: extractValue(expandedContent, 'Relationships') || '',
      highlights: extractList(expandedContent, 'Narrative Highlights'),
      traits: extractList(expandedContent, 'Personality Traits'),
      quotes: extractList(expandedContent, 'Notable Quotes'),
      
      __type: 'character',
      __source: path.basename(file),
    };

    const outputPath = path.join(OUTPUT_DIR, `${fileName}.json`);
    await fs.writeFile(outputPath, JSON.stringify(characterData, null, 2));
    console.log(`[SUCCESS] Saved processed data to ${outputPath}`);
  }

  console.log('--- Character Markdown Parsing Complete ---');
}

main().catch(error => {
  console.error('A fatal error occurred:', error);
  process.exit(1);
});
