import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const INPUT_PATH = path.join('public', 'enriched-data.json');
const OUTPUT_PATH = path.join('public', 'enriched-characters.json');

async function main() {
  try {
    const raw = await readFile(INPUT_PATH, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      throw new Error('Input JSON is not an array');
    }
    const filtered = data.filter(
      (item) =>
        item.__type === 'character' &&
        typeof item.name === 'string' && item.name.trim() &&
        typeof item.nation === 'string' && item.nation.trim() &&
        typeof item.description === 'string' && item.description.trim()
    );
    await writeFile(OUTPUT_PATH, JSON.stringify(filtered, null, 2), 'utf8');
    console.log(
      `Filtered ${data.length} → ${filtered.length} character records. Output: ${OUTPUT_PATH}`
    );
  } catch (err) {
    console.error('Error filtering character data:', err);
    process.exit(1);
  }
}

main(); 