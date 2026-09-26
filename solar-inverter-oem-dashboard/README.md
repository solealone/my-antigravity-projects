# Solar Inverter OEM Dashboard (Wireframe Prototype)

This project is a high-fidelity HTML/CSS wireframe for a Solar Inverter OEM "Super Admin" Dashboard. It simulates the management of a global fleet of solar inverters, customers, and reporting tools.

## Key Features

- **Dashboard Home (`index.html`)**: A comprehensive operational overview designed as an exact replica of the provided specifications. Features high-density stats, live map status, and critical analytics.
- **Authentication**: `login.html`, `forgot-password.html`.
- **Hardware Management**:
    - `inverters.html`: Inventory list.
    - `devices.html`: IoT data logger management.
    - `models.html`: Catalogue of inverter models.
- **Customer Management**: `clients.html`.
- **Analytics & Reporting**:
    - `analytics.html`: Deep-dive system performance.
    - `reports.html`: Hub for various reports (Generation, Efficiency, Faults, etc.).
- **Administration**:
    - `settings.html`: Profile and organization configuration.
    - `ota.html`: Firmware update management.
    - `alerts.html`: System-wide alert console.

## Technical Details

- **Stack**: Vanilla HTML5, CSS3, and JavaScript.
- **Styling**: Custom CSS (`styles.css`) using BEM-like naming.
- **Icons**: Phosphor Icons (via CDN).
- **Fonts**: 'Inter' from Google Fonts.
- **Charts**: CSS-only visualizations and placeholders for Chart.js.

## Navigation

- **Sidebar**: Present on all authenticated pages. Includes links to all major modules.
- **Settings**: Accessible via the gear icon in the sidebar footer.
- **Log Out**: Returns to the login screen.

## Setup

1.  Open `login.html` in any modern web browser.
2.  Click **Sign In** (no credentials required for this prototype).
3.  Navigate through the dashboard using the sidebar.

## File Structure

- `*.html`: Specific pages for each module.
- `styles.css`: Global styles, layout grids, and component classes.
- `/assets`: (Optional) Directory for static images if added.
