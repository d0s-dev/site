# Contributing to d0s.dev

Thank you for your interest in contributing to the d0s.dev website! This document provides guidelines and instructions for contributing.

## 🚀 Quick Start

1. **Fork and clone the repository**
   ```bash
   git clone git@github.com:YOUR_USERNAME/site.git
   cd site
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
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── LandingPage.tsx # Home page
│   ├── DocsPage.tsx    # Documentation page
│   ├── CatalogPage.tsx # App catalog
│   └── HeadlampPage.tsx # Headlamp integration showcase
├── styles/             # Global styles
├── App.tsx             # Main application
└── main.tsx            # Entry point
```

## 🎨 Design System

This site uses:
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Framer Motion** for animations
- **shadcn/ui** component patterns

### Color Palette

The d0s.dev design uses a dark, modal-inspired color scheme:

```css
--background: #001233     /* Deep navy blue */
--foreground: #979DAC     /* Light gray text */
--primary: #0466C8        /* Bright blue */
--card: #33415C           /* Card background */
--border: #002855         /* Subtle borders */
```

## 🛠️ Development Guidelines

### Adding New Components

1. Create your component in `src/components/`
2. Use TypeScript for type safety
3. Follow the existing naming conventions
4. Import UI components from `@/components/ui`

Example:
```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card className="p-6">
      <Button>Click me</Button>
    </Card>
  )
}
```

### Styling Guidelines

1. Use Tailwind utility classes first
2. Use CSS variables for theme colors
3. Keep animations smooth and purposeful
4. Ensure responsive design (mobile-first)

### Code Quality

- Run the build before committing: `npm run build`
- Use meaningful commit messages
- Keep components small and focused
- Comment complex logic

## 📦 Building and Testing

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
