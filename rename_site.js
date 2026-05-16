const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src', function(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace standard occurrences
  if (content.includes('MD.LY')) {
    content = content.replace(/MD\.LY/g, 'MD218.LY');
    changed = true;
  }

  // Handle split occurrences in components
  if (content.includes('>MD</span>')) {
    content = content.replace(/>MD<\/span>/g, '>MD218</span>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});
