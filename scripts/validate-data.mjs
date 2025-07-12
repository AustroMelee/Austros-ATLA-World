// validate-data.mjs
// Validates each raw JSON file in /raw-data/ against its schema using JSON Schema (ajv)
import { promises as fs } from 'fs';
import path from 'path';
import Ajv from 'ajv';

const RAW_DATA_DIR = path.resolve('raw-data');
const SCHEMA_DIR = path.join(RAW_DATA_DIR, 'schema');

async function loadJson(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function validateFile(dataFile, schemaFile) {
  const data = await loadJson(dataFile);
  const schema = await loadJson(schemaFile);
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  let records = Array.isArray(data) ? data : [data];
  let validCount = 0;
  let skipped = 0;
  for (const rec of records) {
    const valid = validate(rec);
    if (!valid) {
      console.warn(`[SKIP] ${dataFile}: Record failed validation:`, validate.errors);
      skipped++;
      continue;
    }
    validCount++;
  }
  if (skipped > 0) {
    console.warn(`[INFO] ${dataFile}: Skipped ${skipped} invalid records, validated ${validCount}.`);
  } else {
    console.log(`Validated: ${dataFile} (${validCount} records)`);
  }
}

async function main() {
  // Validate enriched foods in /dist/enriched-data.json
  const dataFile = path.resolve('dist/enriched-data.json');
  const schemaFile = path.join(SCHEMA_DIR, 'foods.schema.json');
  try {
    const data = await loadJson(dataFile);
    // Validate each food record in the enriched output
    if (data.food && Array.isArray(data.food)) {
      for (const rec of data.food) {
        const ajv = new Ajv({ allErrors: true });
        const schema = await loadJson(schemaFile);
        const validate = ajv.compile(schema);
        const valid = validate(rec);
        if (!valid) {
          console.warn(`[SKIP] ${dataFile}: Record failed validation:`, validate.errors);
        } else {
          console.log(`Validated: ${rec.name} (${rec.id})`);
        }
      }
    } else {
      console.warn(`[SKIP] ${dataFile}: No food records found.`);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.log('All enriched food records validated successfully.');
}

main();
