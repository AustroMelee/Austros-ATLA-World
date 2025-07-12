// Slug utility for Austros ATLA World Encyclopedia
// - Lowercase
// - Replace whitespace with '-'
// - Remove non-alphanumeric (except '-')
// - Strip leading/trailing '-'
// - Collapse '--' to '-'
// - Unicode: remove (documented)
// - Deterministic, collision-safe

/**
 * Generate a strict, URL-safe slug from a string.
 * Unicode is removed (not transliterated).
 * @param {string} name
 * @returns {string}
 */
export function toSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Given an array of records, assign unique slugs (with collision handling) for a domain.
 * Logs a warning for every collision fixed.
 * @param {Array<Object>} records
 * @param {string} domain
 * @returns {Array<Object>} records with unique slug field
 */
export function generateSlugs(records, domain) {
  const slugMap = {};
  const result = [];
  for (const rec of records) {
    let base = typeof rec.name === 'string' ? toSlug(rec.name) : '';
    let slug = base;
    let n = 2;
    while (slug && slugMap[slug]) {
      console.warn(`[SLUG COLLISION] Domain: ${domain}, Name: '${rec.name}', Slug: '${slug}' already used by '${slugMap[slug].name}'. Fixing to '${base}-${n}'.`);
      slug = `${base}-${n++}`;
    }
    slugMap[slug] = rec;
    // Overwrite or add slug field
    if (rec.slug && rec.slug !== slug) {
      console.warn(`[SLUG OVERRIDE] Domain: ${domain}, Name: '${rec.name}', Input slug: '${rec.slug}', Generated: '${slug}'. Overwriting.`);
    }
    result.push({ ...rec, slug });
  }
  return result;
} 