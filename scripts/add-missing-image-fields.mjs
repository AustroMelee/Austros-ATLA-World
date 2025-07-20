#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// List of food items missing image fields
const missingImageFoods = [
  'cabbage-noodles',
  'cactus-juice',
  'candied-jackfruit-pie',
  'crab-urchin-stir-fry',
  'dragon-dumplings',
  'dried-fish',
  'dumpling-weed-soup',
  'fertilized-turtle-duck-egg',
  'fire-cakes',
  'fire-gummies',
  'fish-cakes',
  'five-flavor-soup',
  'foggy-swamp-chicken',
  'fruit-pie',
  'fruit-tart',
  'hippo-ox-tail-skewers',
  'hotcakes',
  'jook',
  'komodo-jerky',
  'lychee-juice',
  'macaroon',
  'mochi',
  'moon-peach',
  'mudfish-stew',
  'mung-bean-tofu-curry',
  'noodle-soup',
  'noodles',
  'nuts',
  'onion-banana-juice',
  'pickled-fish',
  'puffin-seal-sausages',
  'rice-ball',
  'roast-duck',
  'roasted-seaweed',
  'salmon-jerky',
  'sea-soup',
  'sea-squid-soup',
  'seaweed-bread',
  'seaweed-noodles',
  'seaweed-stew',
  'sizzle-crisps',
  'sky-bison-biscuits',
  'smoked-arctic-hen',
  'spiral-shaped-noodles',
  'spirit-oasis-tea',
  'steamed-dumplings',
  'steamed-tofu',
  'steamed-vegetables',
  'superspicy-souffle',
  'sweet-buns',
  'sweet-red-bean-cake',
  'sweet-rice',
  'tart-pie',
  'tofu-and-bean-sprouts',
  'tofu-curry',
  'tsampa',
  'two-headed-fish-soup',
  'wine'
];

function addImageField(foodId) {
  const filePath = `raw-data/foods/${foodId}.md`;
  
  if (!fs.existsSync(filePath)) {
    console.log(`[ERROR] File not found: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if image field already exists
  if (content.includes('"image":')) {
    console.log(`[SKIP] ${foodId} already has image field`);
    return false;
  }
  
  // Check if image file exists
  const imagePath = `public/assets/images/${foodId}.jpg`;
  if (!fs.existsSync(imagePath)) {
    console.log(`[ERROR] Image file not found: ${imagePath}`);
    return false;
  }
  
  // Find the JSON block and add image field
  const jsonBlockRegex = /```json\s*\{[\s\S]*?"id":\s*"[^"]*",\s*"name":\s*"[^"]*",\s*"type":\s*"food"[\s\S]*?\}/;
  const match = content.match(jsonBlockRegex);
  
  if (!match) {
    console.log(`[ERROR] Could not find JSON block for ${foodId}`);
    return false;
  }
  
  const jsonBlock = match[0];
  const updatedJsonBlock = jsonBlock.replace(
    /("type":\s*"food")/,
    '$1,\n  "image": "' + foodId + '.jpg"'
  );
  
  const updatedContent = content.replace(jsonBlock, updatedJsonBlock);
  
  fs.writeFileSync(filePath, updatedContent);
  console.log(`[SUCCESS] Added image field to ${foodId}`);
  return true;
}

console.log('Adding missing image fields to food items...\n');

let successCount = 0;
let errorCount = 0;

for (const foodId of missingImageFoods) {
  try {
    const success = addImageField(foodId);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  } catch (error) {
    console.log(`[ERROR] Failed to process ${foodId}: ${error.message}`);
    errorCount++;
  }
}

console.log(`\nSummary:`);
console.log(`- Successfully updated: ${successCount} files`);
console.log(`- Errors/Skips: ${errorCount} files`);
console.log(`- Total processed: ${missingImageFoods.length} files`); 