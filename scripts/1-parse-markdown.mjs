import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

// --- Configuration ---
const RAW_DATA_DIR = './raw-data';
const DATA_DIR = './data';
const PARSED_DATA_PATH = path.join(DATA_DIR, 'parsed-data.json');

// --- Helper Functions ---
const createSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function findMarkdownFilesRecursive(startPath) {
  const allFilePaths = [];
  try {
    const dirents = await fs.readdir(startPath, { withFileTypes: true });
    for (const dirent of dirents) {
      const fullPath = path.join(startPath, dirent.name);
      if (dirent.isDirectory()) {
        allFilePaths.push(...(await findMarkdownFilesRecursive(fullPath)));
      } else if (dirent.isFile() && path.extname(fullPath) === '.md') {
        allFilePaths.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`[WALKER_ERROR] Could not read directory: ${startPath}`, error);
  }
  return allFilePaths;
}

async function parseMarkdownFile(filePath) {
  console.log(`\n[ATTEMPT] Now processing: ${filePath}`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const parts = fileContent.split('---');
    console.log(`[DEBUG]   File split into ${parts.length} parts by '---'`);

    if (parts.length < 3) {
      console.log(`[FAIL]    Skipping ${filePath}: Not a valid frontmatter/content structure (expected at least 3 parts, got ${parts.length}).`);
      return null;
    }

    const frontmatterString = parts[1];
    const bodyContent = parts.slice(2).join('---').trim();

    const frontmatter = yaml.load(frontmatterString);
    console.log(`[DEBUG]   Frontmatter parsed:`, frontmatter);

    if (!frontmatter || typeof frontmatter !== 'object' || !frontmatter.type) {
      console.log(`[FAIL]    Skipping ${filePath}: Missing or invalid 'type' in frontmatter.`);
      return null;
    }
    
    if (!['character', 'group', 'food'].includes(frontmatter.type)) {
      console.log(`[INFO]    Skipping ${filePath}: Type is "${frontmatter.type}", not supported.`);
      return null;
    }

    // --- Rich Character Parsing Logic ---
    const cardViewMatch = bodyContent.match(/## [^\n]*UI - CARD VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/);
    const expandedViewMatch = bodyContent.match(/## [^\n]*UI - EXPANDED VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/);
    const jsonMatches = [...bodyContent.matchAll(/```json\r?\n([\s\S]*?)```/g)];

    console.log(`[DEBUG]   Found Card View block: ${!!cardViewMatch}`);
    console.log(`[DEBUG]   Found Expanded View block: ${!!expandedViewMatch}`);
    console.log(`[DEBUG]   Found ${jsonMatches.length} JSON blocks.`);

    const jsonBlocks = [];
    for (const match of jsonMatches) {
      try {
        jsonBlocks.push(JSON.parse(match[1]));
      } catch (jsonErr) {
        console.log(`[FAIL]    JSON parse error in ${filePath}: ${jsonErr.message}`);
        return null; // Skip file on JSON error
      }
    }
    
    if (jsonBlocks.length === 0) {
        console.log(`[FAIL]    Skipping ${filePath}: No valid JSON blocks found.`);
        return null;
    }

    const cardViewData = {};
    if (cardViewMatch) {
      cardViewMatch[1].trim().split('\n').forEach(line => {
        const [key, ...valueParts] = line.replace(/^- /, '').split(':');
        if (key && valueParts.length > 0) {
          cardViewData[key.trim().toLowerCase().replace(' ', '')] = valueParts.join(':').trim();
        }
      });
    }

    const mergedData = Object.assign({}, cardViewData, ...jsonBlocks, {
      expandedView: expandedViewMatch ? expandedViewMatch[1].trim() : '',
      __type: frontmatter.type,
    });

    // --- FIX: FLATTEN NESTED METADATA ---
    // This ensures a consistent, flat structure for all character records.
    // The client-side search hook expects this consistency.
    if (mergedData.metadata && typeof mergedData.metadata === 'object') {
      // Copy all properties from metadata to the top-level object
      Object.assign(mergedData, mergedData.metadata);
      // Remove the now-redundant metadata key
      delete mergedData.metadata;
      console.log(`[INFO]    Flattened nested 'metadata' object for ${mergedData.id || 'record'}.`);
    }
    
    // Also flatten the identity object to ensure all fields are at the top level
    if (mergedData.identity && typeof mergedData.identity === 'object') {
      // Copy all properties from identity to the top-level object
      Object.assign(mergedData, mergedData.identity);
      // Remove the now-redundant identity key
      delete mergedData.identity;
      console.log(`[INFO]    Flattened nested 'identity' object for ${mergedData.id || 'record'}.`);
    }
    // --- END FIX ---
    
    if (mergedData.id && !mergedData.slug) {
      mergedData.slug = createSlug(mergedData.id);
    }
    
    if (!mergedData.id || !mergedData.slug) {
       console.log(`[FAIL]    Skipping ${filePath}: Final merged data is missing required 'id' or 'slug'.`);
       return null;
    }
    console.log(`[SUCCESS] Parsed ${frontmatter.type}: ${mergedData.id} from ${filePath}`);
    return mergedData;

  } catch (error) {
    console.error(`[CRASH] A critical error occurred while processing ${filePath}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('--- Starting Markdown Parser (Debug Mode) ---');
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    const mdFilePaths = (await findMarkdownFilesRecursive(RAW_DATA_DIR))
      // Skip any files in a 'templates' subdirectory
      .filter(p => !/[/\\]templates[/\\]/.test(p));
    console.log(`\n--- File Discovery Phase ---`);
    console.log(`Found ${mdFilePaths.length} markdown files to process:`);
    console.log(mdFilePaths.join('\n'));
    console.log(`-------------------------------------------\n`);

    const allRecords = [];
    for (const filePath of mdFilePaths) {
        const record = await parseMarkdownFile(filePath);
        if (record) { // Only add if parsing was successful
            allRecords.push(record);
        }
    }

    console.log(`\n--- Finalizing ---`);
    // THIS IS THE NEW, CRUCIAL LOGGING STEP
    console.log(`[VERIFY] About to write ${allRecords.length} records. Slugs: ${allRecords.map(r => r.slug).join(', ')}`);
    
    console.log(`Successfully parsed ${allRecords.length} records in total.`);
    await fs.writeFile(PARSED_DATA_PATH, JSON.stringify(allRecords, null, 2));
    console.log(`Parsed data saved to ${PARSED_DATA_PATH}`);
    console.log('--- Markdown Parsing Complete! ---');
  } catch (error) {
    console.error('A critical error occurred during the main process:', error);
    process.exit(1);
  }
}

main(); 