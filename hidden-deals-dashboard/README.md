# Hidden Deals Dashboard

A WordPress admin dashboard plugin with a React frontend for managing and viewing hidden property deals.

## Features
- WordPress admin menu integration
- React-based dashboard UI
- Asset loading via `asset-manifest.json` for cache-busting and chunk support
- (Optional) REST API endpoint for property listings

## Folder Structure
```
hidden-deals-dashboard/
├── hidden-deals-dashboard.php   # Main WordPress plugin file
├── react-app/                  # React frontend (Create React App)
│   ├── build/                  # Production build output
│   ├── public/                 # Static public assets
│   └── src/                    # React source code
└── ...
```

## Setup

### 1. React App
- Navigate to `react-app/`
- Install dependencies:
  ```sh
  npm install
  ```
- Build the React app:
  ```sh
  npm run build
  ```
- The build output will be in `react-app/build/` and used by the WordPress plugin.

### 2. WordPress Plugin
- Copy the `hidden-deals-dashboard` folder (including the PHP and `react-app/build/`) into your WordPress `wp-content/plugins/` directory.
- Activate the plugin from the WordPress admin.
- A new "Hidden Deals" menu item will appear in the admin sidebar.

## Development
- For React development, use `npm start` in `react-app/` and consider using a proxy or local REST API for data.
- After changes, always run `npm run build` to update the production assets.

## Notes
- The plugin loads JS/CSS assets based on `asset-manifest.json` for compatibility with Create React App's output.
- If you add new entrypoints or chunk files, ensure the manifest is up to date.
- The plugin expects the build output to be present at `react-app/build/` relative to the PHP file.

## Optional: REST API
- You can enable the included (commented) REST API endpoint in `hidden-deals-dashboard.php` for dynamic data.

