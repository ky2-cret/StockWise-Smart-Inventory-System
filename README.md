# Stockwise — Smart Inventory

A React + Vite + Tailwind CSS 4 inventory dashboard starter with separate components.

## Requirements
- Node.js 20.19+ or 22.12+ recommended
- npm

## Run locally
1. Extract the ZIP.
2. Open the `smart-inventory-ready` folder in VS Code (the folder containing `package.json`).
3. Open Terminal → New Terminal.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the localhost URL shown by Vite.

## Production build
```bash
npm run build
npm run preview
```
The production output is created in `dist/`. Deploy the contents of `dist/` to a static hosting service such as Netlify, Vercel, or GitHub Pages (configure Vite base if deploying to a repository subpath).

## Project structure
- `src/components/`: reusable dashboard UI (`ConfirmDialog.jsx` is the shared Yes/No confirmation panel)
- `src/pages/`: one page per sidebar item (Overview, Inventory, Restock planner, Transactions, Reports, Settings) plus `Dashboard.jsx` for shared state
- `src/data/navigation.js`: sidebar links
- `src/data/products.js`: demo inventory records
- `src/utils/inventory.js`: inventory helpers and restock heuristic
- `src/App.jsx`: application root
- `src/main.jsx`: React entry point
- `src/index.css`: Tailwind import and global styles

## Important
This is a frontend demo. Product data and transactions are kept in React state and reset when the page reloads. Workspace settings are saved in the browser's localStorage. No database, login, or backend is configured. Add a database and authentication before using it for real business inventory.
