const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser to generate PDF...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log("Loading presentation...");
  await page.goto('file:///Users/user/.gemini/antigravity/scratch/annual_day_presentation/index.html', {waitUntil: 'networkidle0'});
  
  console.log("Exporting to PDF...");
  // Export as PDF in 16:9 ratio (1920x1080)
  await page.pdf({
    path: '/Users/user/.gemini/antigravity/scratch/annual_day_presentation/Annual_Day_Presentation_2026.pdf',
    width: '1920px',
    height: '1080px',
    printBackground: true
  });
  
  await browser.close();
  console.log("Success! PDF created at: /Users/user/.gemini/antigravity/scratch/annual_day_presentation/Annual_Day_Presentation_2026.pdf");
})();
