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
  'expandedView',
];

const generateSlug = (name) =>
  name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';

export default function enrichRecord(record) {
  const id = record.id || generateSlug(record.name);
  const name = record.name || 'Unnamed Record';
  const summary = record.summary || record.shortDescription || '';
  const type = record.type || record.__type || 'character';

  const tags = [
    ...(record.tags || []),
    ...(record.tagCategories ? Object.values(record.tagCategories).flat() : []),
  ];
  const uniqueTags = [...new Set(tags)];

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
    tags: uniqueTags.length > 0 ? uniqueTags : undefined,
    ...promotedFields,
    metadata,
  };
} 