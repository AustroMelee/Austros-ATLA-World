const fs = require('fs');
const path = require('path');
const TEST_PATH = path.resolve('public/search-index.json');

console.log('Reading:', TEST_PATH);

fs.readFile(TEST_PATH, 'utf-8', (err, data) => {
  if (err) {
    console.error('Read error:', err);
    process.exit(1);
  }
  console.log('File length:', data.length);
  try {
    const parsed = JSON.parse(data);
    console.log('File parsed OK:', typeof parsed, parsed ? 'object' : 'not object');
  } catch (e) {
    console.error('JSON parse error:', e);
    process.exit(1);
  }
});
