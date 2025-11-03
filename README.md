# d0s.dev - Official Website

The official website for **d0s** (Disconnected Operations System) - a powerful platform for deploying and managing applications in air-gapped and edge environments.

🌐 **Live Site:** [https://d0s.dev](https://d0s.dev)

## 🎨 Design

This site uses a custom Figma design built with **Astro**, **Starlight**, and **Tailwind CSS**. The design includes:

- **Landing Page** - Flashy hero with terminal animations and feature showcase
- **Documentation** - Starlight-powered documentation with search and theming
- **App Catalog** - Browse and deploy applications with live GitHub data
- **Interactive Features** - CVE charts, manifest overlays, and filtering

### Color Palette

Primary shades (light → dark): `#0466C8`, `#0353A4`, `#023E7D`, `#002855`, `#001845`

Neutral shades (light → dark): `#979DAC`, `#7D8597`, `#5C677D`, `#33415C`, `#001233`

## 🚀 Local Development

### Prerequisites

- Node.js 20.x or higher
- npm 

### Getting Started

1. **Navigate to the Astro project:**
   ```bash
   cd astro/
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:4321`

### Available Scripts

All commands should be run from the `astro/` directory:

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (includes docs sync and script bundling)
- `npm run preview` - Preview production build locally
- `npm run check` - Run Astro diagnostics and TypeScript checks
- `npm run test` - Run unit tests with Vitest
- `npm run lint` - Check code formatting with Biome
- `npm run lint:fix` - Auto-format code with Biome

## 📦 Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions.

### Automatic Deployment

Every push to the `alpha-release` branch triggers an automatic deployment:

1. GitHub Actions builds the site using Astro (`astro build`)
2. Static files are generated in the `astro/dist/` directory
3. The site is deployed to GitHub Pages

### Manual Deployment

Deploy manually from the `astro/` directory:

```bash
npm run build && npx gh-pages -d dist
```

## 🔧 Configuration

### GitHub Pages Setup

To enable GitHub Pages for your repository:

1. Go to **Settings** > **Pages**
2. Set **Source** to "GitHub Actions"
3. Save the configuration

### Custom Domain

To use a custom domain (like d0s.dev):

1. Add a `CNAME` file to the `astro/public/` directory with your domain
2. Configure DNS records:
   - Add an `A` record pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153` 
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add a `CNAME` record pointing to `d0s-dev.github.io`
3. Update the `site` configuration in `astro/astro.config.mjs` if needed

## 🛠️ Technology Stack

- **Framework:** Astro 5 (with Starlight for docs)
- **Build Tool:** Astro + Vite
- **Styling:** Tailwind CSS 3
- **Charts:** Chart.js
- **Testing:** Vitest
- **Linting:** Biome
- **TypeScript:** Full type safety

## 📁 Project Structure

```
site/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Pages deployment
│       └── quality.yml         # Linting and testing
├── astro/                      # Main Astro application
│   ├── src/
│   │   ├── components/         # Astro components
│   │   ├── layouts/            # Page layouts
│   │   ├── pages/              # Route pages and API endpoints
│   │   ├── lib/                # Utilities and data fetching
│   │   ├── content/            # Starlight content
│   │   ├── scripts/            # Client-side TypeScript
│   │   └── styles/             # Global CSS and themes
│   ├── public/                 # Static assets
│   ├── astro.config.mjs        # Astro configuration
│   ├── tailwind.config.mjs     # Tailwind configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # Dependencies and scripts
├── migration-notes/            # Migration artifacts and references
│   └── legacy-react/           # Archived React application
└── task.md                     # Migration roadmap and status
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## 🔗 Links

- [d0s GitHub Organization](https://github.com/d0s-dev)
- [Main d0s Repository](https://github.com/d0s-dev/d0s)
- [Documentation](https://d0s.dev/docs)

---

Built with ❤️ by the d0s community