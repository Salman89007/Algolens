# AlgoLens — Phase 1 Deployment & Local Setup Guide

AlgoLens is an interactive algorithm visualizer and step debugger powered by a high-performance C++17 engine compiled to WebAssembly (WASM).

---

## 1. Emscripten Installation & WASM Build Commands

Because compiled `.wasm` and `.js` binaries are already committed in `algolens/public/wasm/`, **you do not need Emscripten to run or deploy the web app**. However, when adding or modifying C++ algorithms in the engine, use the following setup:

### Windows (PowerShell)
```powershell
# 1. Clone emsdk (if not already present in .toolchain/emsdk)
git clone https://github.com/emscripten-core/emsdk.git .toolchain/emsdk
cd .toolchain/emsdk
.\emsdk install latest
.\emsdk activate latest
cd ../..

# 2. Build the WASM engine for the web frontend
.\scripts\build.ps1

# 3. (Optional) Run the Node.js test harness
node scripts/test_engine.mjs
```

### Arch Linux (Bash)
```bash
# 1. Install emscripten or emsdk
sudo pacman -S emscripten
# or via emsdk:
git clone https://github.com/emscripten-core/emsdk.git .toolchain/emsdk
cd .toolchain/emsdk && ./emsdk install latest && ./emsdk activate latest
source ./emsdk_env.sh
cd ../..

# 2. Compile WebAssembly engine directly
em++ -std=c++17 -O2 -I engine/include \
  -s EXPORTED_FUNCTIONS="['_run_algorithm','_list_algorithms','_malloc','_free']" \
  -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap','UTF8ToString','stringToUTF8','lengthBytesUTF8']" \
  -s MODULARIZE=1 -s EXPORT_NAME="createAlgoEngine" \
  -s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT="web,node" -s FILESYSTEM=0 --no-entry \
  engine/main.cpp engine/algorithms/*.cpp \
  -o algolens/public/wasm/engine.js

# 3. Test with Node harness
node scripts/test_engine.mjs
```

---

## 2. Project Directory Structure

```text
App/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD workflow
├── .toolchain/                     # Local toolchains (emsdk)
├── engine/                         # Native C++17 algorithm engine
│   ├── algorithms/                 # Bubble sort, merge sort, quick sort implementations
│   ├── include/
│   │   ├── registry.h              # Algorithm registry and reflection
│   │   └── trace.h                 # Trace schema and JSON serialization
│   └── main.cpp                    # Emscripten exported C wrapper API
├── scripts/
│   ├── build.ps1                   # Emscripten build automation
│   └── test_engine.mjs             # 200+ assertions engine test harness
├── algolens/                       # Frontend application (Vite + React 19 + Tailwind)
│   ├── public/
│   │   └── wasm/
│   │       ├── engine.js           # Emscripten JS glue loader
│   │       ├── engine.wasm         # Compiled WebAssembly binary (170 KB)
│   │       └── package.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # Accessible base UI primitives
│   │   │   ├── visualizer/
│   │   │   │   ├── array-bars.tsx  # Dynamic SVG/HTML visualizer bars with state colors
│   │   │   │   ├── code-panel.tsx  # Live C++ syntax panel with active line tracking
│   │   │   │   ├── counters-panel.tsx # Real-time Comparisons, Swaps, Steps metrics
│   │   │   │   ├── custom-input-card.tsx # Custom array input, random array, presets
│   │   │   │   ├── info-card.tsx   # Complexity matrix, stability, and usage advice
│   │   │   │   └── playback-controls.tsx # Scrubbing timeline, speed slider, play/pause
│   │   │   ├── app-shell.tsx       # Layout shell, ambient glows, shortcuts
│   │   │   ├── command-palette.tsx # Ctrl+K global algorithm spotlight search
│   │   │   ├── footer.tsx          # Technical portfolio footer
│   │   │   ├── hero-preview.tsx    # Interactive miniature sorting teaser in hero
│   │   │   ├── navbar.tsx          # Sticky glassmorphism navigation header
│   │   │   └── theme-provider.tsx  # Dark/light theme state provider
│   │   ├── hooks/
│   │   │   └── use-wasm-engine.ts  # React hook for WASM trace execution
│   │   ├── lib/
│   │   │   ├── algorithms-registry.ts # Algorithm metadata & curriculum roadmap
│   │   │   ├── utils.ts            # Class merging utility
│   │   │   └── wasm-engine.ts      # Singleton WASM loader service
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Animated landing page with curriculum cards
│   │   │   └── Visualizer.tsx      # Main interactive algorithm lab & shareable URLs
│   │   ├── types/
│   │   │   ├── algorithm.ts        # Algorithm schema and complexity types
│   │   │   └── trace.ts            # Trace, Step, Highlight, Counter interfaces
│   │   ├── App.tsx                 # Routing configuration
│   │   ├── index.css               # Design system tokens and glassmorphism styling
│   │   └── main.tsx                # React application entrypoint
│   ├── index.html                  # HTML entrypoint with Inter and JetBrains Mono fonts
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── DEPLOYMENT.md                   # This deployment reference
└── ROLE.txt                        # Project specification and multi-phase roadmap
```

---

## 3. Local Run Commands

To run and build the application locally:

```bash
# Navigate to the frontend directory
cd algolens

# Install dependencies (only required once)
npm install

# Start local development server with Hot Module Replacement
npm run dev

# Verify TypeScript compilation and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 4. Git Initialization & Push to GitHub

To push this repository to your GitHub account:

```bash
# From the repository root (z:/project/App)
git status

# If you haven't linked a remote yet:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/algolens.git

# Set default branch and push
git branch -M main
git push -u origin main
```

---

## 5. Free Hosting Deployments

### Option A: Vercel (Recommended — Instant 1-Click Setup)
1. Navigate to [https://vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and import the `algolens` repository.
3. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `algolens`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Vercel will automatically build and assign a global CDN URL (e.g. `https://algolens.vercel.app`).

### Option B: GitHub Pages (Automated via GitHub Actions)
1. Push this repository to GitHub containing `.github/workflows/deploy.yml`.
2. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Push to `main` (or trigger the workflow manually from the **Actions** tab).
4. Your site will automatically go live at `https://<YOUR_GITHUB_USERNAME>.github.io/<REPO_NAME>/`.

---

## 6. Manual Launch Checklist

- [x] C++ algorithm engine compiled to WebAssembly (`algolens/public/wasm/engine.wasm`).
- [x] Node.js test harness confirms 200+ assertions passing for Bubble, Merge, and Quick sort.
- [x] Dark glassmorphic design system with electric cyan and neon violet palette.
- [x] App shell with sticky navbar, theme toggle, and Command Palette (`Ctrl+K`).
- [x] Animated Landing Page with live hero preview, architecture showcase, and roadmap.
- [x] Per-algorithm Visualizer page with timeline scrubbing, speed slider, and keyboard shortcuts (`Space`, `←`, `→`, `R`).
- [x] Live C++ source code panel with synchronized active line highlighting.
- [x] Real-time metric counters (Comparisons, Swaps, Steps, Array Size).
- [x] Custom array input with error validation, presets, and random array generator.
- [x] Shareable URL encoding (`?data=...`) reproducing exact inputs.
- [x] Production build passes cleanly with zero TypeScript errors.
- [x] Deployment workflow configured for GitHub Pages and Vercel.
