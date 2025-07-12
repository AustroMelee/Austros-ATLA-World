import fs from 'fs/promises';
import path from 'path';

const inputFile = path.resolve(process.cwd(), 'raw-data', 'characters', 'character_data.md');
const outputFile = path.resolve(process.cwd(), 'raw-data', 'characters', 'characters.json');

const keyMapping = {
    'Name': 'name',
    'Nation': 'nation',
    'Image': 'image',
    'Description': 'description',
    'Bending Ability': 'bending',
    'Occupation/Role': 'role',
    'Overview': 'overview',
    'Key Journey Highlights': 'highlights',
    'Personality Traits': 'traits',
    'Notable Quotes': 'quotes',
    'Relationships': 'relationships',
};

async function parseMarkdown() {
  try {
    const content = await fs.readFile(inputFile, 'utf-8');
    const characterBlocks = content.split(/\s*#<\d+>\s*/).filter(block => block.trim());
    
    const characters = [];

    for (const block of characterBlocks) {
      const lines = block.split('\n');
      const character = {};
      let currentKey = null;
      let currentKeyName = null;
      let isList = false;

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            currentKey = null; // Reset on empty lines
            continue;
        }

        const match = trimmedLine.match(/^([a-zA-Z\s]+):\s*(.*)$/);

        if (match) {
          const keyName = match[1].trim();
          const value = match[2].trim();
          currentKey = keyMapping[keyName];
          currentKeyName = keyName;
          isList = !value; // It's a list if there's no value on the same line
          
          if (currentKey) {
            if (isList) {
              character[currentKey] = [];
            } else {
              character[currentKey] = value;
            }
          }
        } else if (currentKey) {
          if (trimmedLine.startsWith('- ')) {
            const item = trimmedLine.substring(2).trim();
            if (Array.isArray(character[currentKey])) {
              character[currentKey].push(item);
            }
          } else if (!isList && typeof character[currentKey] === 'string') {
            character[currentKey] += ' ' + trimmedLine;
          }
        }
      }
      
      // Clean up properties that shouldn't be arrays but were parsed as such
      for(const key in character) {
          if (Array.isArray(character[key]) && character[key].length === 0) {
              delete character[key];
          }
      }

      if (character.name) {
        // Extract shortDescription from Short Template (Card View)
        const shortDescMatch = block.match(/Short Template \(Card View\)[\s\S]*?Description:\s*([\s\S]*?)(?=\n\n|#|Expanded Template|$)/);
        if (shortDescMatch && shortDescMatch[1]) {
          character.shortDescription = shortDescMatch[1].replace(/\n/g, ' ').trim();
        }
        // Extract description from Expanded Template (Detailed View)
        const longDescMatch = block.match(/Expanded Template \(Detailed View\)[\s\S]*?Overview:\s*([\s\S]*?)(?=\n\n|Key Journey Highlights|Personality Traits|Notable Quotes|Relationships|#|$)/);
        if (longDescMatch && longDescMatch[1]) {
          character.description = longDescMatch[1].replace(/\n/g, ' ').trim();
        }
        // Fallback: if only one is present, use it for both
        if (!character.shortDescription && character.description) {
          character.shortDescription = character.description;
        }
        if (!character.description && character.shortDescription) {
          character.description = character.shortDescription;
        }
        character.__type = 'character';
        characters.push(character);
      }
    }

    const finalCharacters = characters.filter(c => c.name && c.description);

    await fs.writeFile(outputFile, JSON.stringify(finalCharacters, null, 2));
    console.log(`Successfully parsed ${finalCharacters.length} characters and wrote to ${outputFile}`);
  } catch (error) {
    console.error('Failed to parse character markdown:', error);
    process.exit(1);
  }
}

parseMarkdown();
