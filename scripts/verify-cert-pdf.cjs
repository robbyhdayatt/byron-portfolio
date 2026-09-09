const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');

// 1. Check local assets exist
assert(fs.existsSync(path.join(root, 'public/assets/pdf.min.js')), 'pdf.min.js missing');
assert(fs.existsSync(path.join(root, 'public/assets/pdf.worker.min.js')), 'pdf.worker.min.js missing');
assert(fs.existsSync(path.join(root, 'public/assets/images/doc_1788950765131_peserta_bootcamp_xdemia.pdf')), 'PDF cert missing');

// 2. Check dist files exist
assert(fs.existsSync(path.join(root, 'dist/assets/pdf.min.js')), 'dist pdf.min.js missing');
assert(fs.existsSync(path.join(root, 'dist/assets/pdf.worker.min.js')), 'dist pdf.worker.min.js missing');

// 3. Check dist/index.html has no cdnjs
const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
assert(!html.includes('cdnjs.cloudflare.com/ajax/libs/pdf.js'), 'dist/index.html still references cdnjs');
assert(html.includes('./assets/pdf.min.js'), 'dist/index.html missing ./assets/pdf.min.js');

// 4. Check main bundle
const distAssets = path.join(root, 'dist/assets');
const mainJs = fs.readdirSync(distAssets).find(f => f.startsWith('main-') && f.endsWith('.js'));
assert(mainJs, 'main JS bundle missing');
const jsContent = fs.readFileSync(path.join(distAssets, mainJs), 'utf8');
assert(!jsContent.includes('cdnjs.cloudflare.com/ajax/libs/pdf.js'), 'bundle still references cdnjs');
assert(jsContent.includes('assets/pdf.worker.min.js'), 'bundle does not reference local worker');

console.log('✅ All certification PDF self-checks passed successfully!');
