import fs from 'fs';
import path from 'path';

const INPUT_FILE = path.join(process.cwd(), 'raw-data', 'characters', 'character_data.md');
const OUTPUT_FILE = path.join(process.cwd(), 'raw-data', 'characters.json');

const KEY_MAP = {
  'Name': 'name',
  'Nation': 'nation',
  'Image': 'image',
  'Bending Ability': 'bending',
  'Occupation/Role': 'role',
  'Overview': 'overview',
  'Key Journey Highlights': 'highlights',
  'Personality Traits': 'traits',
  'Notable Quotes': 'quotes',
  'Relationships': 'relationships',
};

const LIST_KEYS = new Set(['Key Journey Highlights', 'Personality Traits', 'Notable Quotes']);
const ALL_KEYS = Object.keys(KEY_MAP);

function parseMarkdown() {
  console.log(`Reading from: ${INPUT_FILE}`);
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`ERROR: Input file not found at ${INPUT_FILE}`);
    process.exit(1);
  }
  const content = fs.readFileSync(INPUT_FILE, 'utf-8');
  const characterBlocks = content.split(/\r?\n(?=#<\d+>)/).filter(block => block.trim().startsWith('#<'));

  if (characterBlocks.length === 0) {
    console.error("ERROR: No character blocks found. Check the delimiter format (e.g., #<1> AANG).");
    process.exit(1);
  }

  const allCharacters = characterBlocks.map(block => {
    const character = {};
    const blockLines = block.split(/\r?\n/);
    for (const [mdKey, jsonKey] of Object.entries(KEY_MAP)) {
      if (LIST_KEYS.has(mdKey)) continue;
      const line = blockLines.find(l => l.trim().startsWith(`${mdKey}:`));
      if (line) {
        character[jsonKey] = line.split(':')[1].trim();
      }
    }
    const cardViewRegex = /Short Template \(Card View\)[\s\S]*?Description:\s*([^\n\r]+)/;
    const descMatch = block.match(cardViewRegex);
    character.description = descMatch ? descMatch[1].trim() : (character.overview || '');
    for (const listKey of LIST_KEYS) {
        const jsonKey = KEY_MAP[listKey];
        character[jsonKey] = [];
        const blockStartIndex = block.indexOf(`${listKey}:`);
        if (blockStartIndex === -1) continue;
        let blockEndIndex = block.length;
        for (const nextKey of ALL_KEYS) {
            if (nextKey === listKey) continue;
            const nextKeyIndex = block.indexOf(`\n${nextKey}:`, blockStartIndex);
            if (nextKeyIndex !== -1 && nextKeyIndex < blockEndIndex) {
                blockEndIndex = nextKeyIndex;
            }
        }
        let contentSlice = block.substring(blockStartIndex + listKey.length + 1, blockEndIndex).trim();
        if (contentSlice) {
            const items = contentSlice.split(/\r?\n\s*\r?\n/).map(item => 
                item.replace(/\r?\n/g, ' ').trim()
            ).filter(Boolean);
            if (jsonKey === 'quotes') {
                character[jsonKey] = items.map(q => q.replace(/^"|"$/g, ''));
            } else {
                character[jsonKey] = items;
            }
        }
    }
    return character;
  });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allCharacters, null, 2));
  console.log(`✅ Successfully parsed ${allCharacters.length} characters to ${OUTPUT_FILE}`);
}

try {
  parseMarkdown();
} catch (error) {
  console.error("A critical error occurred during parsing:", error);
  process.exit(1);
}


