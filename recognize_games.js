const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");

const dir = "C:\\Users\\PC\\Downloads\\Telegram Desktop\\حسابتt عماب مشتركة";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".jpg") || f.endsWith(".png"));

async function recognize() {
  console.log(`Found ${files.length} images.`);
  // Limit to 5 for the first test to see if OCR is good enough
  const testFiles = files.slice(0, 5);
  for (const file of testFiles) {
    const filePath = path.join(dir, file);
    try {
      const result = await Tesseract.recognize(filePath, "eng", { logger: m => {} });
      console.log(`--- ${file} ---`);
      console.log(result.data.text.trim().split("\n").filter(l => l.trim().length > 0).join(" | "));
    } catch(e) {
      console.log(`Failed ${file}:`, e.message);
    }
  }
}

recognize();