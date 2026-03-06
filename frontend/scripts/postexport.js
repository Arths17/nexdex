const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../out');
const nojekyllPath = path.join(outDir, '.nojekyll');

fs.writeFileSync(nojekyllPath, '');
console.log('✅ .nojekyll file created in /out for GitHub Pages');
