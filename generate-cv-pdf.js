// Renders cv.html to cv.pdf using the system's installed Chrome via puppeteer-core.
// cv.html already sets its own print margins via `.page{padding:.55in .65in}`
// under @media print, so the PDF-level margin here is 0 to avoid stacking a
// second margin on top of it.
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'cv.html');
const OUT = path.join(ROOT, 'cv.pdf');

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
].filter(Boolean);

function findChrome() {
  return CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate)) || null;
}

async function main() {
  const executablePath = findChrome();
  if (!executablePath) {
    console.error('Error: could not find a local Chrome/Chromium install.');
    console.error('Install Google Chrome (https://google.com/chrome), or set');
    console.error('CHROME_PATH to point at your browser binary.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`file://${SRC}`, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');
    await page.pdf({
      path: OUT,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    });
  } finally {
    await browser.close();
  }
  console.log(`Generated ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
