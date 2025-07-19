export const UI_FIELDS_TO_PROMOTE = [
  'image',
  'nation',
  'role',
  'gender',
  'species',
  'nationality',
  'ethnicity',
  'affiliation',
  'titles',
  'searchAliases',
  'expandedView',
];

const generateSlug = (name) =>
  name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';

// Helper function to extract simple, common tags from complex tags
function extractSimpleTags(complexTag) {
  const simpleTags = [];
  const words = complexTag.toLowerCase().split(/[_\s]+/);
  
  // Common simple tags to extract
  const commonTags = [
    'friend', 'family', 'father', 'mother', 'son', 'daughter', 'brother', 'sister',
    'king', 'queen', 'prince', 'princess', 'lord', 'lady', 'general', 'captain',
    'bender', 'fire', 'water', 'earth', 'air', 'avatar', 'warrior', 'soldier',
    'teacher', 'student', 'master', 'apprentice', 'leader', 'follower',
    'good', 'evil', 'neutral', 'hero', 'villain', 'ally', 'enemy',
    'young', 'old', 'wise', 'brave', 'strong', 'weak', 'smart', 'clever',
    'kind', 'cruel', 'gentle', 'fierce', 'calm', 'angry', 'happy', 'sad',
    'noble', 'common', 'royal', 'elite', 'poor', 'rich', 'famous', 'unknown',
    'alive', 'dead', 'missing', 'found', 'lost', 'saved', 'rescued',
    'human', 'animal', 'spirit', 'ghost', 'legend', 'myth',
    'fire_nation', 'earth_kingdom', 'water_tribe', 'air_nomads',
    'republic_city', 'ba_sing_se', 'omashu', 'kyoshi_island'
  ];
  
  for (const word of words) {
    if (commonTags.includes(word) && !simpleTags.includes(word)) {
      simpleTags.push(word);
    }
  }
  
  return simpleTags;
}

export default function enrichRecord(record, tagDictionary = {}) {
  const id = record.id || generateSlug(record.name);
  const name = record.name || 'Unnamed Record';
  const summary = record.summary || record.shortDescription || '';
  const type = record.type || record.__type || 'character';

  // Remove any accidental inclusion of 'category' as a tag, but include food category tags
  const tags = [
    ...(record.tags || []),
    ...(record.tagCategories ? Object.values(record.tagCategories).flat() : []),
  ].filter(t => t !== 'category' && t !== 'beverage');
  
  // Add food category tags from category field
  if (record.category && record.type === 'food') {
    tags.push(record.category);
  }
  // Remove any existing gender tags (case-insensitive, with or without prefix)
  let filteredTags = tags.filter(
    t => !/^male$|^female$/i.test(t.trim().toLowerCase()) && !/\bmale\b|\bfemale\b/i.test(t.trim().toLowerCase())
  );

  // Add normalized gender tag if present
  if (record.gender) {
    const gender = record.gender.trim().toLowerCase();
    if (gender === 'male' || gender === 'female') {
      filteredTags.push(gender);
    }
  }

  // Normalize all tags: replace spaces and slashes with underscores, remove non-word chars, and lowercase
  const normalizedTags = filteredTags
    .map(t => t.trim().toLowerCase().replace(/[\s\/]+/g, '_').replace(/[^a-z0-9_]/g, ''))
    .filter(t => t.length > 0 && !t.includes('__') && !t.startsWith('_') && !t.endsWith('_'));

  // Only keep single-word tags (no underscores at start/end, no double underscores)
  const singleWordTags = normalizedTags.filter(t => /^[a-z0-9_]+$/.test(t) && !t.includes(' '));
  const uniqueTags = [...new Set(singleWordTags)];

  // Validate tags against the dictionary and resolve aliases, with fallback to simple tags
  const finalTags = new Set();
  for (const tag of uniqueTags) {
    if (tagDictionary[tag]) {
      finalTags.add(tag);
      if (Array.isArray(tagDictionary[tag].implies)) {
        tagDictionary[tag].implies.forEach(t => finalTags.add(t));
      }
    } else {
      const canonical = Object.keys(tagDictionary).find(key =>
        (tagDictionary[key].aliases || [])
          .map(a => a.toLowerCase().replace(/\s+/g, '_'))
          .includes(tag)
      );
      if (canonical) {
        finalTags.add(canonical);
        const entry = tagDictionary[canonical];
        if (Array.isArray(entry.implies)) entry.implies.forEach(t => finalTags.add(t));
      } else {
        // Instead of throwing an error, extract simple tags from complex ones
        const simpleTags = extractSimpleTags(tag);
        for (const simpleTag of simpleTags) {
          if (tagDictionary[simpleTag]) {
            finalTags.add(simpleTag);
          }
        }
        // If no simple tags found, just skip this tag instead of throwing an error
        if (tag.includes('_')) {
          // For food category tags, don't skip them - add them directly
          finalTags.add(tag);
          console.log(`[DEBUG] Added food category tag '${tag}' to record ${id}`);
        } else {
          console.log(`[INFO] Skipping unknown tag '${tag}' on record ${id}, extracted simple tags: ${simpleTags.join(', ')}`);
        }
      }
    }
  }

  // Basic inference based on key fields
  if (record.isBender && record.bendingElement) {
    const element = String(record.bendingElement).toLowerCase();
    if (['earth', 'fire', 'water', 'air'].includes(element)) {
      finalTags.add(`${element}bender`);
    }
  }

  const promotedFields = {};
  for (const field of UI_FIELDS_TO_PROMOTE) {
    if (record[field] !== undefined) {
      promotedFields[field] = record[field];
    }
  }
  
  // Handle region -> nation mapping for food items
  if (record.type === 'food' && record.region) {
    // Convert underscores to spaces for proper nation display
    const nationName = record.region.replace(/_/g, ' ');
    promotedFields.nation = nationName;
  } else if (record.type === 'food' && record.metadata && record.metadata.region) {
    // Handle region in metadata object
    const nationName = record.metadata.region.replace(/_/g, ' ');
    promotedFields.nation = nationName;
  }

  const metadata = { ...record };
  delete metadata.id;
  delete metadata.name;
  delete metadata.summary;
  delete metadata.type;
  delete metadata.tags;
  for (const field of UI_FIELDS_TO_PROMOTE) {
    delete metadata[field];
  }

  if ((record.id || record.name) === 'air-nomad-style-tea') {
    console.log('[DEBUG] Full record for air-nomad-style-tea:', JSON.stringify(record, null, 2));
  }

  if (id === 'air-nomad-style-tea') {
    console.log('[DEBUG] Tags array for air-nomad-style-tea:', tags);
  }

  return {
    id,
    name,
    summary,
    type,
    slug: record.slug || id,
    tags: finalTags.size > 0 ? Array.from(finalTags) : undefined,
    ...promotedFields,
    metadata,
  };
}