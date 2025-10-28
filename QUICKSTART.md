# 🚀 Quick Start Guide

## One-Line Setup
```bash
./setup.sh
```

## Manual Commands

### Development
```bash
npm install        # First time only
npm run dev        # Start dev server → http://localhost:5173
```

### Production
```bash
npm run build      # Build for production
npm run preview    # Test production build
```

### Deploy
```bash
git add .
git commit -m "Update site"
git push origin main
# 🎉 Auto-deploys to GitHub Pages via Actions
```

## File Structure
```
site/
├── src/           ← Your code here
│   ├── components/
│   ├── App.tsx
│   └── main.tsx
├── public/        ← Static files
├── dist/          ← Build output (auto-generated)
└── .github/workflows/deploy.yml  ← Auto-deployment
```

## Pages
- **Landing** - Hero with animations
- **Docs** - Documentation pages  
- **Catalog** - App marketplace
- **Headlamp** - K8s dashboard

## Resources
- 📖 [README.md](README.md) - Full documentation
- 🚢 [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute

---
**Built with:** React + Vite + Tailwind + TypeScript
