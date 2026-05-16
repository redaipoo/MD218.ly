const fs = require('fs');

const content = fs.readFileSync('src/lib/products.ts', 'utf8');

// Find the defaultCategories array
const startIdx = content.indexOf('export const defaultCategories: Category[] = [');
if (startIdx === -1) {
  console.log("Could not find defaultCategories array");
  process.exit(1);
}

const endIdx = content.indexOf('];\n\nexport async function getCategories');
if (endIdx === -1) {
  console.log("Could not find end of defaultCategories array");
  process.exit(1);
}

const arrayString = content.substring(startIdx + 'export const defaultCategories: Category[] = '.length, endIdx + 1);

// We need to safely eval this to get the object, since it contains JS objects, not strict JSON.
try {
  // eval needs to evaluate the array
  const evalResult = eval(arrayString);
  if (!fs.existsSync('src/data')) {
    fs.mkdirSync('src/data');
  }
  fs.writeFileSync('src/data/categories.json', JSON.stringify(evalResult, null, 2));
  console.log('Successfully created src/data/categories.json');
} catch (e) {
  console.error("Error evaluating array:", e);
}
