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

export default function enrichRecord(record, tagDictionary = {}) {
  const id = record.id || generateSlug(record.name);
  const name = record.name || 'Unnamed Record';
  const summary = record.summary || record.shortDescription || '';
  const type = record.type || record.__type || 'character';

  const tags = [
    ...(record.tags || []),
    ...(record.tagCategories ? Object.values(record.tagCategories).flat() : []),
  ];
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

  // Validate tags against the dictionary and resolve aliases
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
        throw new Error(`Unknown tag '${tag}' on record ${id}`);
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

  const metadata = { ...record };
  delete metadata.id;
  delete metadata.name;
  delete metadata.summary;
  delete metadata.type;
  delete metadata.tags;
  for (const field of UI_FIELDS_TO_PROMOTE) {
    delete metadata[field];
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