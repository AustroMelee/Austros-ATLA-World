#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const charactersDir = path.resolve('raw-data/characters');
const outputDir = path.resolve('raw-data/characters/json');

function parseMarkdownKeyValueBlock(blockContent) {
    const data = {};
    let currentKey = null;
    let currentValue = [];
    let isList = false;
    const lines = blockContent.split('\n');
    const saveCurrentEntry = () => {
      if (!currentKey) return;
      if (isList) data[currentKey] = currentValue.filter(item => item.trim() !== '');
      else data[currentKey] = currentValue.join(' ').trim();
    };
    for (const line of lines) {
      const keyMatch = line.match(/^\s*-\s*([^:]+):\s*(.*)/);
      const listItemMatch = line.match(/^\s*-\s+(.*)/);
      if (keyMatch) {
        saveCurrentEntry();
        currentKey = keyMatch[1].trim();
        const valueOnLine = keyMatch[2].trim();
        if (valueOnLine) {
          isList = false;
          currentValue = [valueOnLine];
        } else {
          isList = true;
          currentValue = [];
        }
      } else if (currentKey) {
        if (isList && listItemMatch) currentValue.push(listItemMatch[1].trim());
        else if (line.trim()) {
          if (isList) isList = false;
          currentValue.push(line.trim());
        }
      }
    }
    saveCurrentEntry();
    return data;
}

function normalizeAndMerge(cardView, expandedView, backendBlocks) {
    const finalData = backendBlocks.reduce((acc, obj) => ({ ...acc, ...obj }), {});
    finalData.name = expandedView.Name || cardView.Name || finalData.fullName || 'Unnamed Character';
    finalData.nation = expandedView.Nation || cardView.Nation || finalData.nationality;
    finalData.age = expandedView.Age;
    finalData.description = expandedView.Overview || cardView['Short Description'];
    finalData.highlights = expandedView['Narrative Highlights'] || [];
    finalData.traits = expandedView['Personality Traits'] || [];
    finalData.relationships = expandedView.Relationships || [];
    finalData.quotes = (expandedView['Notable Quotes'] || []).map(q => q.replace(/^"|"$/g, '').trim());
    finalData.role = expandedView['Role in the Story'];
    finalData.image = '[SVG embedded image link]';
    return finalData;
}

function parseLaxJson(laxJsonString) {
  try {
    return new Function(`return ${laxJsonString.trim()}`)();
  } catch (e) {
    console.error(`--> Lax JSON Parse Error: ${e.message}`);
    return null;
  }
}

// --- NEW HELPER FUNCTIONS FOR ROBUST PARSING ---
/**
 * Extracts content between two boundary strings.
 * @param {string} content Full file content.
 * @param {string} startBoundary The string that marks the beginning.
 * @param {string} endBoundary The string that marks the end.
 * @returns {string|null} The content between boundaries, or null if not found.
 */
function getContentBetween(content, startBoundary, endBoundary) {
    const startIndex = content.indexOf(startBoundary);
    if (startIndex === -1) return null;

    const endIndex = content.indexOf(endBoundary, startIndex);
    if (endIndex === -1) return null;

    return content.substring(startIndex + startBoundary.length, endIndex).trim();
}

/**
 * Extracts content from within the first markdown code block (e.g., ```md ... ```).
 * @param {string} sectionContent The content of a whole section.
 * @returns {string|null} The inner content of the code block, or null.
 */
function extractMarkdownCodeBlock(sectionContent) {
    if (!sectionContent) return null;
    const match = sectionContent.match(/```md\s*([\s\S]*?)\s*```/);
    return match ? match[1].trim() : null;
}

/**
 * Extracts all JSON code blocks from the backend section.
 * @param {string} backendContent The entire backend metadata section.
 * @returns {object[]} An array of parsed JSON objects.
 */
function parseBackendJson(backendContent) {
    if (!backendContent) return [];
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
    const objects = [];
    let match;
    while ((match = jsonRegex.exec(backendContent)) !== null) {
      const parsedObj = parseLaxJson(match[1]);
      if (parsedObj) {
        objects.push(parsedObj);
      }
    }
    return objects;
}
// --- (End of new helper functions) ---


async function processCharacterFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n--- Processing: ${fileName} ---`);

  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // =======================================================================
    // == FIXED LOGIC: Robust section extraction using header anchors       ==
    // =======================================================================
    const cardViewHeader = '## 🖼️ UI - CARD VIEW';
    const expandedViewHeader = '## 📖 UI - EXPANDED VIEW';
    const backendHeader = '## ⚙️ BACKEND METADATA';

    const cardViewBlock = getContentBetween(content, cardViewHeader, expandedViewHeader);
    const expandedViewBlock = getContentBetween(content, expandedViewHeader, backendHeader);
    const backendBlock = content.substring(content.indexOf(backendHeader));
    
    const cardViewContent = extractMarkdownCodeBlock(cardViewBlock);
    const expandedViewContent = extractMarkdownCodeBlock(expandedViewBlock);

    if (!cardViewContent || !expandedViewContent || !backendBlock) {
        console.error(`[ERROR] Failed to find or extract one or more main sections in ${fileName}. Skipping.`);
        return;
    }
    
    const cardViewData = parseMarkdownKeyValueBlock(cardViewContent);
    const expandedViewData = parseMarkdownKeyValueBlock(expandedViewContent);
    const backendJsonBlocks = parseBackendJson(backendBlock);
    // =======================================================================


    let hasError = false;
    if (Object.keys(cardViewData).length === 0) {
        console.error(`[ERROR] Failed to parse key-value pairs from [UI - CARD VIEW] in ${fileName}.`);
        hasError = true;
    }
    if (Object.keys(expandedViewData).length === 0) {
        console.error(`[ERROR] Failed to parse key-value pairs from [UI - EXPANDED VIEW] in ${fileName}.`);
        hasError = true;
    }
    if (backendJsonBlocks.length === 0) {
        console.error(`[ERROR] Failed to parse any [BACKEND METADATA] JSON blocks in ${fileName}.`);
        hasError = true;
    }

    if (hasError) {
        console.log(`[INFO] Skipping write for ${fileName} due to parsing errors.`);
        return;
    }

    const finalCharacterData = normalizeAndMerge(cardViewData, expandedViewData, backendJsonBlocks);
    finalCharacterData.__source = fileName;

    const outputFileName = `${path.basename(fileName, '.md')}.json`;
    const outputPath = path.join(outputDir, outputFileName);
    await fs.writeFile(outputPath, JSON.stringify(finalCharacterData, null, 2));
    console.log(`[SUCCESS] Successfully parsed and wrote ${outputFileName}`);

  } catch (err) {
    console.error(`[FATAL] Error processing ${fileName}:`, err);
  }
}

async function main() {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    const files = await fs.readdir(charactersDir);
    const mdFiles = files.filter(file => file.endsWith('.md') && file !== 'character_template.md');

    for (const file of mdFiles) {
      await processCharacterFile(path.join(charactersDir, file));
    }
    console.log('\n✅ Character parsing complete.');
  } catch (err) {
    console.error('Error in main execution:', err);
  }
}

main();
