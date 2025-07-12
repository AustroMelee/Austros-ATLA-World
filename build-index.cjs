const fs = require('fs');
const FlexSearch = require('flexsearch');
const path = require('path');

const ENRICHED_PATH = path.resolve('dist/enriched-data.json');
const INDEX_PATH = path.resolve('public/search-index.json');

(async () => {
  console.log('[START] Reading enriched data...');
  const raw = JSON.parse(fs.readFileSync(ENRICHED_PATH, 'utf-8'));

  console.log('[OK] Data loaded:', Array.isArray(raw.food) ? raw.food.length : 'no food array');

  const index = new FlexSearch.Document({
    document: {
      id: "slug",
      index: ["name", "description", "region"]
    }
  });

  for (const rec of raw.food) {
    index.add(rec);
  }

  console.log('[OK] All records indexed.');

  const exported = await index.export();
  console.log('[DEBUG] Export type:', typeof exported, Array.isArray(exported), exported && exported.constructor && exported.constructor.name);

  fs.writeFileSync(INDEX_PATH, JSON.stringify(exported));
  console.log('[DONE] Index exported:', INDEX_PATH);
})();
