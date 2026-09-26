/*  record.mjs — Capture SDS Prime Day 2026 as a full 2-min video
    Uses Puppeteer (non-headless) + real-time screenshot capture       */

import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://localhost:8765';
const DURATION_S = 124;
const FPS = 6;  // 6 fps is enough for this type of presentation
const FRAME_DIR = join(import.meta.dirname, '_frames');
const OUT_FILE = '/Users/user/Downloads/SDS_Prime_Day_2026.webm';
const OUT_MP4  = '/Users/user/Downloads/SDS_Prime_Day_2026.mp4';

console.log('🎬 SDS Prime Day 2026 — Video Recorder');
console.log('━'.repeat(50));

// Clean up
if (existsSync(FRAME_DIR)) rmSync(FRAME_DIR, { recursive: true });
mkdirSync(FRAME_DIR, { recursive: true });

console.log('🚀 Launching Chrome (headless=new)...');
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: [
    '--window-size=1920,1080',
    '--no-sandbox',
    '--disable-gpu',
    '--autoplay-policy=no-user-gesture-required',
    '--disable-features=IsolateOrigins,site-per-process',
  ],
  defaultViewport: { width: 1920, height: 1080 },
});

const page = await browser.newPage();

console.log('📄 Loading presentation...');
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });

// Wait for everything to render
await new Promise(r => setTimeout(r, 3000));

console.log('▶️  Starting presentation...');
// Click play
await page.evaluate(() => {
  document.getElementById('play-btn').click();
});

// Wait a moment for play to engage
await new Promise(r => setTimeout(r, 1000));

// Capture frames in real-time
console.log(`📸 Capturing ${DURATION_S}s at ${FPS} fps (${DURATION_S * FPS} frames)...`);
console.log('   This takes ~2 minutes. Please wait...\n');

let frameCount = 0;
const totalFrames = DURATION_S * FPS;
const frameInterval = 1000 / FPS;
const startTime = Date.now();

for (let i = 0; i < totalFrames; i++) {
  const frameStart = Date.now();

  try {
    const buf = await page.screenshot({ type: 'png', encoding: 'binary', captureBeyondViewport: false });
    const fname = `frame_${String(frameCount).padStart(6, '0')}.png`;
    writeFileSync(join(FRAME_DIR, fname), buf);
    frameCount++;
  } catch (e) {
    // skip frame
  }

  // Progress
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const pct = Math.round((i / totalFrames) * 100);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  process.stdout.write(`\r  ⏱️  ${m}:${String(s).padStart(2,'0')} | ${pct}% | Frame ${frameCount}/${totalFrames}`);

  // Wait for next frame timing
  const frameElapsed = Date.now() - frameStart;
  const waitMs = Math.max(0, frameInterval - frameElapsed);
  if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));
}

console.log(`\n\n✅ Captured ${frameCount} frames!`);
await browser.close();

// Encode video
console.log('\n🎥 Encoding video...');

// Get ffmpeg path
let ffmpegPath = null;
try {
  ffmpegPath = execSync('which ffmpeg', { encoding: 'utf8' }).trim();
} catch (e) {
  try {
    // Try npm-installed ffmpeg
    ffmpegPath = execSync('node -e "console.log(require(\'@ffmpeg-installer/ffmpeg\').path)"', {
      cwd: import.meta.dirname, encoding: 'utf8'
    }).trim();
  } catch (e2) {
    // Install it
    console.log('   Installing ffmpeg...');
    execSync('npm install @ffmpeg-installer/ffmpeg --save 2>&1', { cwd: import.meta.dirname, stdio: 'pipe' });
    ffmpegPath = execSync('node -e "console.log(require(\'@ffmpeg-installer/ffmpeg\').path)"', {
      cwd: import.meta.dirname, encoding: 'utf8'
    }).trim();
  }
}

console.log(`   Using ffmpeg: ${ffmpegPath}`);

// Try MP4 first (most compatible)
try {
  execSync(
    `"${ffmpegPath}" -y -framerate ${FPS} -i "${FRAME_DIR}/frame_%06d.png" ` +
    `-c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p ` +
    `-vf "scale=1920:1080:flags=lanczos" "${OUT_MP4}"`,
    { stdio: 'pipe', timeout: 120000 }
  );
  const size = (existsSync(OUT_MP4) ? (require('fs').statSync(OUT_MP4).size / 1024 / 1024).toFixed(1) : '?');
  console.log(`\n🎉 MP4 Video saved to: ${OUT_MP4} (${size} MB)`);
} catch (e) {
  console.log('   MP4 encoding failed, trying WebM...');
  try {
    execSync(
      `"${ffmpegPath}" -y -framerate ${FPS} -i "${FRAME_DIR}/frame_%06d.png" ` +
      `-c:v libvpx-vp9 -b:v 3M -pix_fmt yuv420p "${OUT_FILE}"`,
      { stdio: 'pipe', timeout: 120000 }
    );
    console.log(`\n🎉 WebM Video saved to: ${OUT_FILE}`);
  } catch (e2) {
    console.log(`\n❌ Encoding failed. ${frameCount} frames are saved in: ${FRAME_DIR}`);
  }
}

// Clean up frames if video was created
if (existsSync(OUT_MP4) || existsSync(OUT_FILE)) {
  rmSync(FRAME_DIR, { recursive: true });
  console.log('🧹 Cleaned up temporary frames');
}

console.log('\n' + '━'.repeat(50));
console.log('🏁 Done! Check your Downloads folder.');
