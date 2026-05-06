#!/usr/bin/env bash
set -euo pipefail

DIR="${1:-plant-floor-monitor}"

if [ -e "$DIR" ]; then
  echo "Error: '$DIR' already exists. Pass a different name: bash plant-floor-monitor.sh my-dir" >&2
  exit 1
fi

echo "Creating Plant Floor Monitor scaffold in ./$DIR"
mkdir -p "$DIR"/{src/{types,mocks,components,hooks}}

# ── package.json ─────────────────────────────────────────────────────────────
cat > "$DIR/package.json" << 'EOF'
{
  "name": "plant-floor-monitor",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}
EOF

# ── tsconfig.json ─────────────────────────────────────────────────────────────
cat > "$DIR/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
EOF

# ── vite.config.ts ────────────────────────────────────────────────────────────
cat > "$DIR/vite.config.ts" << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOF

# ── index.html ────────────────────────────────────────────────────────────────
cat > "$DIR/index.html" << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Plant Floor Monitor</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# ── src/index.css ─────────────────────────────────────────────────────────────
cat > "$DIR/src/index.css" << 'EOF'
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #111;
  background: #fff;
}
EOF

# ── src/main.tsx ──────────────────────────────────────────────────────────────
cat > "$DIR/src/main.tsx" << 'EOF'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
EOF

# ── src/App.tsx ───────────────────────────────────────────────────────────────
cat > "$DIR/src/App.tsx" << 'EOF'
export default function App() {
  return (
    <main>
      <h1>Plant Floor Monitor</h1>
    </main>
  )
}
EOF

# ── src/App.css ───────────────────────────────────────────────────────────────
cat > "$DIR/src/App.css" << 'EOF'
/* App-level styles */
EOF

# ── placeholder files ─────────────────────────────────────────────────────────
touch "$DIR/src/types/.gitkeep"
touch "$DIR/src/mocks/.gitkeep"
touch "$DIR/src/components/.gitkeep"
touch "$DIR/src/hooks/.gitkeep"

# ── .gitignore ────────────────────────────────────────────────────────────────
cat > "$DIR/.gitignore" << 'EOF'
node_modules
dist
.DS_Store
EOF

echo ""
echo "Scaffold created. Installing dependencies…"
cd "$DIR"

if command -v pnpm &> /dev/null; then
  pnpm install
elif command -v npm &> /dev/null; then
  npm install
else
  echo "Neither pnpm nor npm found. Run 'npm install' or 'pnpm install' manually."
  exit 0
fi

echo ""
echo "Done. To start:"
echo "  cd $DIR"
echo "  pnpm dev"
