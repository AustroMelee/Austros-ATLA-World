import { promises as fs } from 'fs';
import path from 'path';

const mdPath = path.resolve(process.cwd(), 'raw-data/characters/character_data.md');
const jsonPath = path.resolve(process.cwd(), 'raw-data/characters.json');

const FIELD_MAP = {
  bending_ability: 'bending',
  occupationrole: 'role',
  key_journey_highlights: 'highlights',
  notable_quotes: 'quotes',
  personality_traits: 'traits',
};

function normalizeFields(char) {
  const normalized = {};
  for (const key in char) {
    if (FIELD_MAP[key]) {
      normalized[FIELD_MAP[key]] = char[key];
    } else {
      normalized[key] = char[key];
    }
  }
  return normalized;
}

function parseCharacterSection(section) {
  const lines = section.split('\n').map(l => l.trim());
  const char = {};
  let currentKey = null;
  let buffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^(Short Template|Expanded Template)/i.test(line)) continue;
    const match = line.match(/^([A-Za-z\s\/\(\)']+):\s*(.*)$/);
    if (match) {
      if (currentKey && buffer.length) {
        char[currentKey] = buffer.join(' ').trim();
        buffer = [];
      }
      currentKey = match[1].trim().toLowerCase().replace(/\s+/g, '_').replace(/\W/g, '');
      if (match[2]) {
        buffer.push(match[2].trim());
      }
    } else if (currentKey) {
      buffer.push(line);
    }
  }
  if (currentKey && buffer.length) {
    char[currentKey] = buffer.join(' ').trim();
  }

  ['key_journey_highlights', 'personality_traits', 'notable_quotes', 'relationships'].forEach(field => {
    if (char[field]) {
      char[field] = char[field]
        .split(/\n|\.|\r/)
        .map(s => s.trim())
        .filter(Boolean);
    }
  });

  char.__type = 'character';
  if (char.description) char.shortDescription = char.description;
  return normalizeFields(char);
}

async function parseMarkdown() {
  console.log('Reading character markdown data...');
  const fileContent = await fs.readFile(mdPath, 'utf8');
  const sections = fileContent.split(/#<\d+>\s+/).slice(1);
  const characters = sections.map(parseCharacterSection).filter(c => c.name && c.description);
  await fs.writeFile(jsonPath, JSON.stringify(characters, null, 2));
  console.log(`✅ Successfully parsed ${characters.length} characters to ${jsonPath}`);
}

parseMarkdown().catch(e => {
  console.error('❌ Failed to parse character markdown:', e);
  process.exit(1);
});

