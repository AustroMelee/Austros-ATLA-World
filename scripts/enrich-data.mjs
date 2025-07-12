// enrich-data.mjs
import { promises as fs } from 'fs';
import path from 'path';
import enrichConfig from './enrich-config.mjs';
import { toSlug } from './slug-utils.mjs';

const RAW_DATA_ROOT = path.resolve('raw-data');
const ENRICHED_PATH = path.resolve('dist/enriched-data.json');

// Recursively find all .json files under a directory, excluding /schema/
async function findJsonFilesRecursive(dir) {
  let results = [];
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Exclude any directory named 'schema'
      if (entry.name.toLowerCase() === 'schema') continue;
      results = results.concat(await findJsonFilesRecursive(fullPath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.json') &&
      !fullPath.includes(`${path.sep}schema${path.sep}`)
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

function getIdentifier(record, file) {
  return record.id || record.name || path.basename(file);
}

function appendUnique(arr, values) {
  for (const v of values) {
    if (!arr.includes(v)) arr.push(v);
  }
}

function enrichRecord(record, typeConfig, id, type) {
  const enriched = { ...record };
  if (!typeConfig) return enriched; // No enrichment rules, return as-is
  for (const field of typeConfig.enrichFields || []) {
    if (field === 'synonyms' && typeConfig.synonyms) {
      const syns = typeConfig.synonyms[record.name];
      if (syns) {
        if (!enriched.synonyms) enriched.synonyms = [];
        appendUnique(enriched.synonyms, syns);
      }
    }
    if (field === 'tags' && typeConfig.tags) {
      const tags = typeConfig.tags[record.name];
      if (tags) {
        if (!enriched.tags) enriched.tags = [];
        appendUnique(enriched.tags, tags);
      }
    }
    if (field === 'relations' && typeConfig.relations) {
      const rels = typeConfig.relations[record.name];
      if (rels) {
        if (!enriched.relations) enriched.relations = [];
        appendUnique(enriched.relations, rels);
      }
    }
    // Add default if missing and defined in config
    if (enriched[field] === undefined && typeConfig.defaults && typeConfig.defaults[field] !== undefined) {
      enriched[field] = typeConfig.defaults[field];
    } else if (enriched[field] === undefined) {
      console.warn(`${id}: Missing field '${field}' for type '${type}', no default. Skipping enrichment for this field.`);
    }
  }
  return enriched;
}

function detectType(record, file) {
  // Prefer explicit type field
  if (record && typeof record.type === 'string' && record.type.trim()) {
    return record.type.trim();
  }
  // Else, use immediate parent directory name
  const parentDir = path.basename(path.dirname(file));
  if (parentDir) return parentDir;
  return null;
}

async function main() {
  // Only process raw-data/foods.json and raw-data/characters.json
  const foodFile = path.resolve('raw-data/foods.json');
  const characterFile = path.resolve('raw-data/characters.json');
  const filesToProcess = [foodFile, characterFile];
  let skipped = 0;
  let enrichedFoods = [];
  let enrichedCharacters = [];
  for (const file of filesToProcess) {
    const isFood = file.endsWith(`${path.sep}foods.json`);
    const isCharacter = file.endsWith(`${path.sep}characters.json`);
    let records = [];
    try {
      const content = await fs.readFile(file, 'utf-8');
      const parsed = JSON.parse(content);
      records = Array.isArray(parsed) ? parsed : [parsed];
      if (isFood) {
        console.log('FOODS.JSON LOADED:', Array.isArray(records), records.length, records.slice(0, 2));
      }
    } catch (e) {
      console.warn(`[SKIP] ${file}: Failed to parse JSON: ${e.message}`);
      skipped++;
      continue;
    }
    for (const record of records) {
      // --- SCHEMA PROTECTION ---
      if (
        record &&
        (record.$schema || record.properties || (typeof record.type === 'string' && record.required && record.properties))
      ) {
        console.warn(`[SKIP] ${file}: Detected schema object, skipping.`);
        skipped++;
        continue;
      }
      // --- BEGIN: Schema normalization for food ---
      let normalized = { ...record };
      try {
        if (!normalized.name || !normalized.description) {
          console.warn(`[SKIP] ${file}: Missing required name or description for record.`);
          skipped++;
          continue;
        }
        // Skip region summary records for foods
        if (isFood && typeof normalized.name === 'string' && normalized.name.toLowerCase().includes('food data')) {
          console.warn(`[SKIP] ${file}: Skipping region summary record '${normalized.name}'.`);
          skipped++;
          continue;
        }
        // Auto-generate id (slug of name, collision-safe)
        const targetArr = isFood ? enrichedFoods : isCharacter ? enrichedCharacters : null;
        if (!targetArr) continue;
        if (!normalized.id) {
          const baseSlug = typeof normalized.name === 'string' ? toSlug(normalized.name) : '';
          let slug = baseSlug;
          let n = 2;
          const existingIds = new Set(targetArr.map(r => r.id));
          while (slug && existingIds.has(slug)) {
            slug = `${baseSlug}-${n++}`;
          }
          normalized.id = slug;
          console.log(`[AUTO-FIX] Set id for ${isFood ? 'food' : 'character'} '${normalized.name}': ${slug}`);
        }
        if (!normalized.type) {
          normalized.type = isFood ? 'food' : isCharacter ? 'character' : '';
          console.log(`[AUTO-FIX] Set type for ${isFood ? 'food' : 'character'} '${normalized.name}': ${normalized.type}`);
        }
        // Set __type and remove type
        normalized.__type = normalized.type;
        delete normalized.type;
        if (!normalized.slug) {
          normalized.slug = normalized.id;
          console.log(`[AUTO-FIX] Set slug for ${isFood ? 'food' : 'character'} '${normalized.name}': ${normalized.slug}`);
        }
        // Optional fields (add more as needed)
        if (isFood) {
          if (!Array.isArray(normalized.tags)) normalized.tags = [];
          if (typeof normalized.region !== 'string') normalized.region = null;
          if (typeof normalized.image !== 'string') normalized.image = null;
          if (!Array.isArray(normalized.aliases)) normalized.aliases = [];
          if (!Array.isArray(normalized.sources)) normalized.sources = [];
        }
        if (isCharacter) {
          if (!Array.isArray(normalized.tags)) normalized.tags = [];
          if (typeof normalized.nation !== 'string') normalized.nation = '';
          if (typeof normalized.bending !== 'string') normalized.bending = '';
          if (!Array.isArray(normalized.aliases)) normalized.aliases = [];
          if (!Array.isArray(normalized.sources)) normalized.sources = [];
          // Defensive: Use provided shortDescription, or auto-generate from description if missing/empty
          if (typeof record.shortDescription === 'string' && record.shortDescription.trim()) {
            normalized.shortDescription = record.shortDescription.trim();
          } else if (typeof normalized.description === 'string') {
            // Auto-generate: take first sentence or first 120 chars as summary
            const desc = normalized.description.trim();
            const firstSentence = desc.split('. ')[0];
            normalized.shortDescription = firstSentence.length < 120 ? firstSentence : desc.slice(0, 120) + '...';
          } else {
            normalized.shortDescription = '';
          }
          normalized.expansion = {
            fullBio: normalized.overview || normalized.description,
            notableEpisodes: normalized.highlights ? normalized.highlights.split(/[.;\n]/).map(s => s.trim()).filter(Boolean) : [],
            quotes: normalized.quotes ? normalized.quotes.split(/"/).map(s => s.trim()).filter(q => q.length > 10) : [],
          };
        }
        targetArr.push(normalized);
      } catch (err) {
        console.error(`[ENRICH ERROR] ${file}: ${normalized.name || 'unknown'}: ${err.message}`);
        skipped++;
        continue;
      }
    }
  }
  // Write only enriched foods and characters to /dist/enriched-data.json
  await fs.mkdir(path.dirname(ENRICHED_PATH), { recursive: true });
  const allRecords = [...enrichedFoods, ...enrichedCharacters];
  await fs.writeFile(ENRICHED_PATH, JSON.stringify(allRecords, null, 2));
  // Print summary
  console.log('Enrichment complete. Type summary:');
  console.log(`  food: ${enrichedFoods.length} records`);
  console.log(`  characters: ${enrichedCharacters.length} records`);
  if (skipped) {
    console.log(`Skipped ${skipped} files/records due to errors or missing type.`);
  }
}

main();
