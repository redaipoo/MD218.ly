const fs = require('fs');
let content = fs.readFileSync('src/lib/products.ts', 'utf8');
content = content.replace(/export interface Denomination \{[\s\S]*?\}/, 'export interface Denomination {\n  value: string;\n  label: string;\n  priceLYD?: number;\n  priceLibyana?: number;\n}');
content = content.replace(/\{ value: "([^"]+)", label: "([^"]+)" \}/g, (match, value, label) => {
  let numericValue = parseFloat(value) || 10;
  return `{ value: "${value}", label: "${label}", priceLYD: ${numericValue * 7}, priceLibyana: ${numericValue * 9} }`;
});
fs.writeFileSync('src/lib/products.ts', content);
