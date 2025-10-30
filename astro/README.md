# d0s Astro Workspace

Astro-based rebuild of the d0s marketing site, catalog, and docs experience. This project supersedes the legacy Vite/React application under `site/` with a static-first Astro implementation backed by Tailwind and Starlight.

## Structure

```
site/astro
├── public/                 # Static assets copied directly to dist/ (CSP + headers live here)
├── scripts/                # Build-time utilities (e.g. remote doc synchroniser)
├── src/
│   ├── components/         # Landing page partials + shared UI
│   ├── components/docs/    # Starlight-specific components (version switcher)
│   ├── content/docs/       # MDX content collections served by Starlight
│   ├── layouts/            # Reusable Astro layouts
│   ├── lib/                # Catalog data loaders, types, and tests
│   ├── pages/              # Route entry points (/, /catalog, /api, etc.)
│   ├── scripts/            # Browser modules loaded via Astro.resolve
│   └── styles/             # Tailwind + themed CSS
├── astro.config.mjs        # Astro + Starlight configuration
├── tailwind.config.mjs     # Tailwind theme tokens
├── biome.jsonc             # Biome lint/format rules
├── package.json            # Scripts + dependency manifest
└── README.md               # You are here
```

## Tooling

- **Astro 5** static output with islands only where interaction is required (landing copy buttons, catalog overlay).
- **Tailwind CSS 3** with dark-first palette tuned to d0s brand tokens.
- **Starlight** powers `/docs/*` routes with a branded theme and inline version switcher component.
- **Biome** + **Vitest** provide linting, type-aware unit tests, and formatting.
- **Chart.js** renders the catalog vulnerability distribution as an island loaded on demand.

## Scripts

Run all commands from `site/astro`:

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Launch the Astro dev server (`http://localhost:4321`) |
| `npm run build` | Generate the production build to `dist/` (runs remote doc sync first) |
| `npm run preview` | Serve the latest build from `dist/` |
| `npm run lint` | Run Biome checks across JS/TS/JSON |
| `npm run lint:fix` | Apply Biome fixes in-place |
| `npm run check` | Execute `astro check` for type safety |
| `npm run test -- --run` | Execute Vitest suites (catalog data, API routes, build snapshot) |
| `npm run sync:docs` | Manually pull remote docs from `d0s-dev/docs` via GitHub raw endpoint |

## Build & Quality Notes

- `npm run build` succeeds in ~2.1s locally (Node 20.17.0) when the remote docs source is reachable.
- `dist/_astro` currently weighs in at ~180 KB (`du -sh dist/_astro`) with the catalog bundle <250 KB gzipped (`dist/_astro/ui-core.D_Lfcn_I.js` ≈ 23 KB gz).
- Lighthouse home baseline (`npm run build && npm run preview`, 2025-10-30, localhost): **Performance 93 / Accessibility 93 / Best Practices 96 / SEO 100**. Report saved at `site/migration-notes/127.0.0.1_2025-10-30_10-17-17.report.html`.
- Lighthouse `/catalog` baseline (127.0.0.1 desktop run, 2025-10-30): **Performance 93 / Accessibility 93 / Best Practices 96 / SEO 100**. Report saved at `site/migration-notes/127.0.0.1_2025-10-30_11-50-10.report.html`.
- `/catalog` passes unit tests covering data-source fallbacks, caching, and build output verification.
- CI workflows (`deploy.yml`, `quality.yml`) run lint, type-check, tests, build, and `npm audit --omit=dev --audit-level=moderate` on pushes and PRs touching `site/astro`.

## Documentation Sync

Remote docs are pulled from `https://github.com/d0s-dev/docs` during `npm run build` via `scripts/sync-docs.mjs`. Configure alternate sources with `D0S_DOCS_REMOTE_BASE`. Failures fall back to the checked-in MDX so offline builds continue to work.
- The site-wide 404 page detects `/docs/*` misses and auto-redirects to the archived 2024.10 React docs after a short countdown (with a cancel button).

## Security Hardening

- `public/_headers` ships HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and a CSP that locks scripts to `'self'` (no inline execution) while allowing Tailwind-generated inline styles.
- Inline browser logic lives under `src/scripts/` to keep the CSP strict for JavaScript.
- Catalog fetchers sanitise JSON payloads and apply ETag-aware caching with a five-minute TTL.
- Docs version switcher keeps the current site in place and links legacy React docs in a new tab.

## Next Steps

- Populate legacy documentation targets once `d0s-dev/docs` exposes versioned bundles.
- Extend chart data tests to exercise live GitHub responses, not just fixtures.
- Add automated accessibility scans (e.g. Pa11y) once CI runners include Chromium.
