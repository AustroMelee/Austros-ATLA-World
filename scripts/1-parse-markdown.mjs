import fs from 'fs/promises';
import path from 'path';
import grayMatter from 'gray-matter';
import yaml from 'js-yaml'; // <-- Import the new library

// --- Configuration ---
const RAW_DATA_DIR = './raw-data';
const DATA_DIR = './data';
const PARSED_DATA_PATH = path.join(DATA_DIR, 'parsed-data.json');

// --- Helper Functions ---
const createSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function parseMarkdownFile(filePath) {
  try {
    console.log(`[DEBUG] Parsing file: ${filePath}`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Step 1: Manually split the file by the '---' delimiter to isolate the frontmatter.
    // This is robust against multiple '---' dividers in the file body.
    const parts = fileContent.split('---');

    if (parts.length < 3) {
      console.log(`[FAIL] Skipping ${filePath}: Not a valid frontmatter/content structure.`);
      return [];
    }

    // The first part is empty, the second is the YAML frontmatter, the rest is content.
    const frontmatterString = parts[1];
    const bodyContent = parts.slice(2).join('---').trim(); // Re-join the rest of the content

    const frontmatter = yaml.load(frontmatterString);

    if (!frontmatter || typeof frontmatter !== 'object' || !frontmatter.type) {
      console.log(`[FAIL] Skipping ${filePath}: Missing or invalid 'type' in frontmatter.`);
      return [];
    }
    
    // --- Rich Character Parsing Logic (from your legacy format) ---
    if (frontmatter.type === 'character') {
      // More robust regex: allow any whitespace or blank lines between heading and code block
      const cardViewMatch = bodyContent.match(/## [^\n]*UI - CARD VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/);
      const expandedViewMatch = bodyContent.match(/## [^\n]*UI - EXPANDED VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/);
      // Extract all JSON code blocks and parse them, with debug logging
      const jsonBlocks = [];
      for (const match of bodyContent.matchAll(/```json\r?\n([\s\S]*?)```/g)) {
        try {
          console.log(`[DEBUG] Attempting to parse JSON block in ${filePath}:`);
          console.log(match[1]);
          jsonBlocks.push(JSON.parse(match[1]));
        } catch (jsonErr) {
          console.log(`[FAIL] JSON parse error in ${filePath}: ${jsonErr.message}`);
          console.log('Raw JSON block:');
          console.log(match[1]);
        }
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

      // Merge all data sources: card view, expanded view, and all flattened JSON blocks
      const mergedData = Object.assign({}, cardViewData, ...jsonBlocks, {
        expandedView: expandedViewMatch ? expandedViewMatch[1].trim() : '',
        __type: 'character',
      });
      
      // If id exists but slug is missing, generate slug from id
      if (mergedData.id && !mergedData.slug) {
        mergedData.slug = createSlug(mergedData.id);
      }
      
      if (!mergedData.id || !mergedData.slug) {
         console.log(`[FAIL] Skipping ${filePath}: Character data is missing required 'id' or 'slug' in a JSON block.`);
         return [];
      }
      console.log(`[SUCCESS] Parsed character: ${mergedData.id} from ${filePath}`);
      return [mergedData]; // Return as an array to match the expected structure
    }

    // --- Add logic for other types here if needed ---
    console.log(`[INFO] Skipping ${filePath}: Type "${frontmatter.type}" does not have a parser defined.`);
    return [];

  } catch (error) {
    console.error(`[CRASH] A critical error occurred while processing ${filePath}: ${error.message}`);
    return [];
  }
}

// A heavily instrumented version to find the root cause
async function findMarkdownFilesRecursive(startPath) {
  console.log(`[WALKER] Entering directory: ${startPath}`);
  const allFilePaths = [];
  
  const dirents = await fs.readdir(startPath, { withFileTypes: true });

  for (const dirent of dirents) {
    const fullPath = path.join(startPath, dirent.name);
    console.log(`[WALKER]  ... considering: ${dirent.name}`);

    if (dirent.isDirectory()) {
      console.log(`[WALKER]  ... DECISION: It's a directory. Recursing.`);
      allFilePaths.push(...(await findMarkdownFilesRecursive(fullPath)));
    } else if (dirent.isFile() && path.extname(fullPath) === '.md') {
      console.log(`[WALKER]  ... DECISION: It's a markdown file. Adding to list.`);
      allFilePaths.push(fullPath);
    } else {
      // This new 'else' block will catch anything unusual.
      console.log(`[WALKER]  ... DECISION: Not a directory or a markdown file. Skipping. (isFile: ${dirent.isFile()})`);
    }
  }
  return allFilePaths;
}

async function main() {
  console.log('Starting markdown parsing...');
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Step 1: Discover all .md file paths first (robust version)
    const mdFilePaths = await findMarkdownFilesRecursive(RAW_DATA_DIR);

    // Step 2: Print the list before doing anything dangerous
    console.log('Found the following markdown files to process:');
    console.log(mdFilePaths);
    console.log('-------------------------------------------');

    // Step 3: Now, process the files from the known-good list
    const allRecords = [];
    for (const filePath of mdFilePaths) {
      try {
        const records = await parseMarkdownFile(filePath);
        allRecords.push(...records);
      } catch (error) {
        console.error(`\n--- ERROR ---`);
        console.error(`Failed to parse file: ${filePath}`);
        console.error(`Reason: ${error.message}`);
        console.error(`--------------\n`);
        // Optionally: process.exit(1); to stop on first error
      }
    }

    console.log(`Successfully parsed ${allRecords.length} records.`);
    await fs.writeFile(PARSED_DATA_PATH, JSON.stringify(allRecords, null, 2));
    console.log(`Parsed data saved to ${PARSED_DATA_PATH}`);
    console.log('Markdown parsing complete!');
  } catch (error) {
    console.error('An error occurred during markdown parsing:', error);
    process.exit(1);
  }
}

main(); 