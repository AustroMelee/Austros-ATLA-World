import fs from 'fs/promises';
import path from 'path';
// If you have a slug utility, import it; otherwise, use the inline function below
// import { generateSlug } from './slug-utils.mjs';

const parsedDataPath = path.join(process.cwd(), 'data/parsed-data.json');
const enrichedDataPath = path.join(process.cwd(), 'public/enriched-data.json');

// --- START: Fields to Promote ---
const UI_FIELDS_TO_PROMOTE = [
  'image',
  'nation',
  'role',
  'gender',
  'species',
  'nationality',
  'ethnicity',
  'affiliation',
  'titles',
  'expandedView',
];
// --- END: Fields to Promote ---

// Inline slug generator if not using external util
const generateSlug = (name) =>
  name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';

async function enrichData() {
  try {
    const data = await fs.readFile(parsedDataPath, 'utf8');
    const records = JSON.parse(data);

    const enrichedRecords = records.map((record) => {
      const id = record.id || generateSlug(record.name);
      const name = record.name || 'Unnamed Record';
      const summary = record.summary || record.shortDescription || '';
      const type = record.type || record.__type || 'character';

      // Extract and combine all possible tags
      const tags = [
        ...(record.tags || []),
        ...(record.tagCategories ? Object.values(record.tagCategories).flat() : []),
      ];
      const uniqueTags = [...new Set(tags)];

      // --- START: Promote UI fields to the top level ---
      const promotedFields = {};
      for (const field of UI_FIELDS_TO_PROMOTE) {
        if (record[field] !== undefined) {
          promotedFields[field] = record[field];
        }
      }
      // --- END: Promote UI fields to the top level ---

      // Create the metadata object containing everything else
      const metadata = { ...record };
      // Clean up metadata by removing fields that are already at the top level
      delete metadata.id;
      delete metadata.name;
      delete metadata.summary;
      delete metadata.type;
      delete metadata.tags;
      for (const field of UI_FIELDS_TO_PROMOTE) {
        delete metadata[field];
      }

      // Construct the final, enriched record
      return {
        id,
        name,
        summary,
        type,
        slug: record.slug || id, // Ensure slug is present
        tags: uniqueTags.length > 0 ? uniqueTags : undefined,
        ...promotedFields, // Spread the promoted fields here
        metadata,
      };
    });

    await fs.writeFile(
      enrichedDataPath,
      JSON.stringify(enrichedRecords, null, 2),
    );
    console.log(
      `✅ Successfully enriched ${enrichedRecords.length} records and saved to ${enrichedDataPath}`,
    );
  } catch (error) {
    console.error('Error during data enrichment:', error);
    process.exit(1);
  }
}

enrichData(); 