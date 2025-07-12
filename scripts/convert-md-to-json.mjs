#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';

const RAW_DATA_ROOT = path.resolve('raw-data');
const VERBOSE = process.argv.includes('--verbose');

// Optionally, a canonical list of known character names (add more as needed)
const KNOWN_CHARACTERS = [
  'Avatar Aang', 'Katara', 'Sokka', 'Toph Beifong', 'Zuko', 'Avatar Korra', 'Mako', 'Bolin', 'Asami Sato', 'Tenzin',
  'Appa', 'Momo', 'Suki', 'Uncle Iroh', 'Azula', 'Fire Lord Ozai', 'Lin Beifong', 'Jinora', 'Naga', 'Pabu',
  'Chief Hakoda', 'Tonraq', 'Unalaq', 'Eska and Desna', 'Fire Lord Izumi', 'Ursa', 'Fire Lord Azulon', 'Prince Lu Ten',
  'The Great Sage', 'Shyu', 'Ran and Shaw', 'Combustion Man', 'Yon Rha', 'Kiyi', 'Princess Yue', 'Bato', 'Chief Arnook',
  'Kanna', 'Yagoda', 'Hahn', 'Hama'
];

function isRealCharacterName(name) {
  if (!name) return false;
  const lower = name.toLowerCase();
  if (lower.match(/character|list|overview|note|data/)) return false;
  if (name.trim().split(/\s+/).length > 3) return false;
  if (KNOWN_CHARACTERS.length > 0 && !KNOWN_CHARACTERS.includes(name.trim())) return false;
  return true;
}

function parseCharacterList(md) {
  const lines = md.split(/\r?\n/);
  const characterEntries = [];
  let current = null;
  for (let line of lines) {
    const match = line.match(/^([A-Za-z .'-]+):\s*(.+)$/);
    if (match) {
      if (current) characterEntries.push(current);
      current = { name: match[1].trim(), description: match[2].trim() };
    } else if (current && line.trim() && !/^\s*[-*#]/.test(line)) {
      current.description += ' ' + line.trim();
    }
  }
  if (current) characterEntries.push(current);
  // Stricter filter: only real character names
  return characterEntries.filter(c => isRealCharacterName(c.name));
}

async function processCharacterMdFile(mdPath, outPath) {
  let status = 'OK';
  let error = null;
  let output = [];
  try {
    const raw = await fs.readFile(mdPath, 'utf-8');
    output = parseCharacterList(raw);
    await fs.writeFile(outPath, JSON.stringify(output, null, 2));
  } catch (e) {
    status = 'ERROR';
    error = e.message;
  }
  let msg = `[${status}] ${mdPath} -> ${outPath}`;
  if (error) msg += ` | Error: ${error}`;
  if (VERBOSE && status === 'OK') {
    console.log(JSON.stringify(output, null, 2));
  }
  console.log(msg);
}

async function main() {
  const charMd = path.join(RAW_DATA_ROOT, 'characters', 'character data 1.md');
  const charJson = path.join(RAW_DATA_ROOT, 'characters', 'characters.json');
  await processCharacterMdFile(charMd, charJson);
}

main();
