# d0s.dev - Official Website

The official website for **d0s** (Disconnected Operations System) - a powerful platform for deploying and managing applications in air-gapped and edge environments.

🌐 **Live Site:** [https://d0s.dev](https://d0s.dev)

## 🎨 Design

This site uses a custom Figma design built with React, Vite, and Tailwind CSS. The design includes:

- **Landing Page** - Flashy hero with 3D animations
- **Documentation** - Docusaurus-style documentation pages
- **App Catalog** - Browse and deploy applications
- **Headlamp Integration** - Kubernetes dashboard plugin showcase

## 🚀 Local Development

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 📦 Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions.

### Automatic Deployment

Every push to the `main` branch triggers an automatic deployment:

1. GitHub Actions builds the site using Vite
2. Static files are generated in the `dist/` directory
3. The site is deployed to GitHub Pages

### Manual Deployment

You can also deploy manually using:

```bash
npm run deploy
```

This will build the site and push it to the `gh-pages` branch.

## 🔧 Configuration

### GitHub Pages Setup

To enable GitHub Pages for your repository:

1. Go to **Settings** > **Pages**
2. Set **Source** to "GitHub Actions"
3. Save the configuration

### Custom Domain

To use a custom domain (like d0s.dev):

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS records:
   - Add an `A` record pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add a `CNAME` record pointing to `d0s-dev.github.io`
3. Update the `base` path in `vite.config.ts` if needed

## 🛠️ Technology Stack

- **Framework:** React 18
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **TypeScript:** Full type safety

## 📁 Project Structure

```
site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── LandingPage.tsx     # Home page
│   │   ├── DocsPage.tsx        # Documentation
│   │   ├── CatalogPage.tsx     # App catalog
│   │   └── HeadlampPage.tsx    # Headlamp integration
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
├── index.html
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
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