const { Document } = require('flexsearch');
const idx = new Document({
  document: {
    id: 'slug',
    index: ['name'],
    store: ['name', 'slug'],
  },
});
idx.add({ name: 'Test Item', slug: 'test-item' });
idx.export(function(exportedIndex) {
  console.log('Exported index:', exportedIndex);
  console.log('Type:', typeof exportedIndex);
  process.exit(0);
});
