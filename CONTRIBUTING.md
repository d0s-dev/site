# Contributing to d0s.dev

Thank you for your interest in contributing to the d0s.dev website! This document provides guidelines and instructions for contributing.

## 🚀 Quick Start

1. **Fork and clone the repository**
   ```bash
   git clone git@github.com:YOUR_USERNAME/site.git
   cd site/astro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321`

## 📁 Project Structure

```
astro/
├── public/                 # Static assets and compiled bundles
├── src/
│   ├── components/         # Astro components and interactive islands
│   ├── content/            # Starlight documentation content collections
│   ├── layouts/            # Shared page layouts
│   ├── lib/                # Catalog data sources and utilities
│   ├── pages/              # Route pages and API endpoints (serverless)
│   ├── scripts/            # Client-side TypeScript bundles
│   └── styles/             # Global CSS and Tailwind layers
├── scripts/                # Build-time helpers (e.g., docs sync)
├── astro.config.mjs        # Astro configuration
├── tailwind.config.mjs     # Tailwind setup and presets
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

This site uses:
- **Tailwind CSS** for utility-first styling
- **Astro islands** pattern for interactive components
- **Starlight** for documentation authoring and navigation
- **Chart.js** for catalog visualizations

### Color Palette

The refreshed color system is based on two tonal ramps:

```css
/* Blues (light → dark) */
--blue-100: #0466C8;
--blue-200: #0353A4;
--blue-300: #023E7D;
--blue-400: #002855;
--blue-500: #001845;

/* Grays (light → dark) */
--gray-100: #979DAC;
--gray-200: #7D8597;
--gray-300: #5C677D;
--gray-400: #33415C;
--gray-500: #001233;
```

## 🛠️ Development Guidelines

### Astro Components & Content

1. Place new UI components in `src/components/`; prefer `.astro` files unless interactivity requires `.tsx` islands.
2. Store shared data helpers in `src/lib/` and keep them framework-agnostic.
3. Author documentation in `src/content/docs/` using MDX; update frontmatter for navigation.
4. For client-side scripts, bundle via `src/scripts/` and wire them up in `scripts/sync-docs.mjs` if needed.

### Styling Guidelines

1. Favor Tailwind utility classes and the color tokens above.
2. Extend Tailwind primitives in `tailwind.config.mjs` instead of ad hoc CSS when possible.
3. Keep animations purposeful and accessible; honor reduced-motion preferences.
4. Test across breakpoints—Astro layouts default to mobile-first.

### Code Quality

- Run `npm run lint` and `npm run check` before opening a PR.
- Execute `npm run test` for unit coverage of catalog data helpers.
- Ensure `npm run build` completes locally.
- Use meaningful commit messages and comment only where intent is non-obvious.

## 📦 Building and Testing

Run all commands from the `astro/` directory.

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Quality Checks
```bash
npm run check     # Astro + TypeScript diagnostics
npm run lint      # Biome formatting and lint rules
npm run test      # Vitest unit tests
```

## 🚢 Deployment

The site automatically deploys to GitHub Pages when you push to `main`:

1. Push your changes to your fork
2. Create a pull request to the main repository
3. Once merged, GitHub Actions will automatically build and deploy

### Manual Deployment
```bash
npm run deploy
```

## 📝 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Test thoroughly
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Add screenshots for UI changes

## 🐛 Reporting Issues

Found a bug? Please create an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS information

## 💡 Feature Requests

Have an idea? Create an issue with:
- Clear description of the feature
- Use case/motivation
- Proposed implementation (if you have one)

## 🎯 Areas for Contribution

- **Content**: Improve documentation and copy
- **Design**: Enhance UI/UX
- **Features**: Add new pages or functionality
- **Performance**: Optimize load times and animations
- **Accessibility**: Improve a11y compliance

## 📞 Getting Help

- Check existing issues and discussions
- Ask questions in discussions
- Review the README for setup help

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to d0s.dev! 🎉
