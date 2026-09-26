# Antigravity Workspace Developments & Projects

This repository contains all projects, dashboards, mobile applications, presentations, and automation scripts developed with Antigravity.

---

## 📁 Project Directory Overview

### 1. Web Applications & Dashboards
- **`sds-prime-day-2026/`**: SDS Prime Day interactive web celebration & dashboard.
  - Setup: Open `index.html` in a browser or run `npm install` for local tooling.
- **`solar-inverter-oem-dashboard/`**: Solar Inverter OEM management dashboard.
  - Includes device metrics, inverter summaries, fault reporting, and OTA updates.
  - Setup: Open `index.html` or serve via local HTTP server.
- **`yez-bus-dashboard/`**: Fleet / bus tracking and telemetry dashboard.
  - Setup: Open `index.html` in browser.
- **`video-telematics-report/`**: Telematics analysis report interface.
  - Setup: Open `index.html` in browser.
- **`transight-redesign/`**: UI redesign layouts and assets for Transight.

### 2. Mobile Applications
- **`church_admin_app/`**: Church administration web/mobile app interface (`index.html`, `mobile.html`, `app.js`).
- **`church_admin_mobile/`**: Native Android application (Kotlin + Gradle).
  - Setup: Open in Android Studio or run `./gradlew build`.

### 3. Presentations & Slides
- **`Transight_Presentation/`**: Modular presentation Markdown and visual assets.
- **`annual_day_presentation/`**: Annual day slide decks and export tooling (`export_pdf.js`).
- **`presentation.html`**: Standalone HTML presentation.

### 4. Utility Scripts & Tools
- **`add_red_border.py`**, **`composite_banner.py`**, **`crop_particle_logo.py`**, **`make_perfect_composite.py`**, **`transparent_logo.py`**: Image processing & graphic automation scripts.
- **`check_ocr.py`**, **`inspect_image_text.py`**, **`inspect_images.py`**: OCR inspection scripts.
- **`inspect_excel.py`**, **`read_pptx.py`**: Document parsing and inspection utilities.

---

## 🚀 Setting Up on a New MacBook Pro

### Step 1: Clone Repository into Antigravity Scratch Directory
```bash
git clone <YOUR_REMOTE_REPO_URL> ~/.gemini/antigravity/scratch
cd ~/.gemini/antigravity/scratch
```

### Step 2: Open in Antigravity or VS Code / Android Studio
- Open Antigravity and select `~/.gemini/antigravity/scratch` (or any sub-project) as your workspace.
- For Android: Open `church_admin_mobile` in Android Studio.
- For Node projects: Run `npm install` inside `sds-prime-day-2026`.

### Step 3: Optional Dependencies (if needed)
- **whisper.cpp**: Clone from `https://github.com/ggerganov/whisper.cpp.git` if you need local speech-to-text models.
- **Python environments**: Create virtual environments as needed (`python3 -m venv venv && source venv/bin/activate`).
