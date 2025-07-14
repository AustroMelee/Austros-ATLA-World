import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const SRC = path.join('public', 'enriched-data.json');
const DEST = path.join('dist', 'enriched-data.json');

async function main() {
  try {
    const data = await readFile(SRC, 'utf8');
    // Validate JSON
    JSON.parse(data);
    await writeFile(DEST, data, 'utf8');
    console.log(`Copied ${SRC} → ${DEST}`);
  } catch (err) {
    console.error('Error copying cleaned character data:', err);
    process.exit(1);
  }
}

main(); 