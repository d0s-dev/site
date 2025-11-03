# 🚀 Quick Start Guide

## One-Line Setup
```bash
./setup.sh
```

## Manual Commands

Run all commands from the `astro/` directory unless noted otherwise.

### Development
```bash
cd astro/
npm install        # First time only
npm run dev        # Start dev server → http://localhost:4321
```

### Production
```bash
cd astro/
npm run build      # Build for production
npm run preview    # Test production build
```

### Deploy
```bash
git add .
git commit -m "Update site"
git push origin alpha-release
# 🎉 Auto-deploys to GitHub Pages via Actions
```

## File Structure
```
site/
├── astro/
│   ├── public/            ← Static assets
│   ├── src/
│   │   ├── components/    ← Astro islands and partials
│   │   ├── content/       ← Starlight docs content
│   │   ├── layouts/       ← Shared page templates
│   │   ├── lib/           ← Data helpers and catalog logic
│   │   ├── pages/         ← Route endpoints and API handlers
│   │   ├── scripts/       ← Client-side TypeScript utilities
│   │   └── styles/        ← Global and theme styling
│   ├── astro.config.mjs   ← Astro configuration
│   ├── tailwind.config.mjs
│   └── package.json
├── README.md
├── QUICKSTART.md
└── CONTRIBUTING.md
```

## Pages
- **Landing** - Astro hero with animated terminal
- **Docs** - Starlight-powered documentation
- **Catalog** - App marketplace backed by GitHub data
- **Catalog API** - Dynamic endpoints under `/api/catalog`

## Resources
- 📖 [README.md](README.md) - Overview and deployment
- 🧭 [astro/README.md](astro/README.md) - Astro-specific details
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute

---
**Built with:** Astro + Starlight + Tailwind CSS + TypeScript
