Ok I need you to do a bit of an overhaul on our main d0s page. We need to remove some of this older placeholder pieces.
Remove:
- Current why choose d0s section (rework)
- d0s vs The Rest section
- GITHUB Stars, secure cubes, uptime, deploy time
- Explore the Catalog (rework) with top 4 apps that link over to catalog with that app popped up
- Unlock your first cube


Info for new page:

Offerings:
- "App" Catalog (zarf packages)
- IDP (Internal Developer Platform)
- "Factory" (Tools for building Secure Apps)
- Secure Apps (zarf packages using FIPS Containers)


Components:
- d0s cli
  - d0s api
  - d0s agent
- d0s headlamp plugin
- d0s factory


Context lines to come
- More than just containers, we offer fully bundled apps
- Offline Helm charts w/Automation
- Trusted origin, UBI based FIPS containers
- IDP (internal developer platform) in one command


`Factory` fully automated:
- AI RAG connections
- OIDC integration
- Secrets management
- Metrics/Logging automated
- CSP resource automation
- FinOPS cost management
- Security tools???

Keep it simple and clean don't make stuff up. We should follow other modern k8s tools site styles. Start out with an easy button to install our d0s cli using our curl into sh install method. Keep a mac terminal automated typing out:
- the curl install command
- d0s init
- d0s deploy nginx:latest

Make sure to add in suttle animations and transitions to keep it modern and fresh. Use our color scheme and branding but keep it light and simple. Use modern fonts and spacing.

---

## Questions & Clarifications Needed Before Starting

### 1. **Install Command Details**
   - What is the exact curl install command? Is it `curl -sSL https://d0s.dev/install | sh` (as currently used)? yes
   - Should we add any flags or options for different platforms (Linux, macOS, Windows/WSL)? no

### 2. **Top 4 Catalog Apps**
   - Which 4 apps should be featured in the new catalog preview section? argocd, fluxcd, keycloak, grafana (just stage some don't exist but I'll add them soon)
   - Do you want to link these to the catalog page with specific app pre-selected/highlighted? yes

### 3. **Hero Section & Terminal Animation**
   - Should the Mac terminal be in the hero section at the top, or below it? below it
   - Animation timing: How fast should the typing animation be? medium speed
   - Should the terminal show all 3 commands sequentially, or allow user to step through? sequentially

### 4. **Offerings Section Layout**
   - How should the 4 offerings be displayed? (Cards, grid, vertical list?) Each have their own section you scroll through
   - Should each offering have:
     - An icon/badge? yes
     - Detailed description or keep it minimal? medium not too many words
     - Link to more details? Links to relavent tech (zarf.dev, headlamp.io, etc)

### 5. **Components Section**
   - Should this be a separate section showing the architecture/tech stack? yes
   - Visual style: Diagram, cards, or simple list? simple cards or list
   - How much technical detail for each component? short description for each component only

### 6. **Factory Automation Features**
   - Remove the "???" from "Security tools???" - should we include this or leave it out for now? remove just use what I said as context but make it look complete
   - Should Factory features be shown as a detailed list, or summarized? Summarized with icons
   - Factory should have a Contact Us link for more info? yes

### 7. **Branding & Style**
   - Keep current blue gradient scheme (blues: #0466C8 to #001845)?
   - Any specific K8s tools sites to reference for inspiration? (e.g., Argo, Flux, Crossplane?)
   - Font preference: Keep Cascadia Code or use Inter/other modern sans-serif for body text?

### 8. **Page Structure Priority**
   What order should sections appear in?
   - Suggested order:
     1. Hero + Install Terminal Demo
     2. Context Lines (key benefits)
     3. Offerings Overview
     4. Components Architecture
     5. Factory Features (if included)
     6. Top 4 Catalog Apps Preview
     7. Final CTA

### 9. **Content to Remove - Confirm**
   Confirm removal of these components/sections:
   - ✓ `FeaturesGrid` (Why Choose d0s)
   - ✓ `ComparisonTable` (d0s vs The Rest)
   - ✓ `StatsStrip` (GitHub Stars, Secure Cubes, Uptime, Deploy Time)
   - ✓ Current `CatalogPreview` implementation
   - ✓ `FinalCta` (Unlock your first cube)

### 10. **New Components Needed**
   Should we create:
   - `OfferingsGrid.astro` - Display 4 main offerings
   - `ComponentsArchitecture.astro` - Show d0s components
   - `ContextHighlights.astro` - Show the 4 context lines
   - `FactoryFeatures.astro` - Display Factory automation features
   - Update `MacTerminal.astro` to show install sequence
   - Update `CatalogPreview.astro` to show top 4 apps with links

---

## Implementation Tasks (Pending Answers Above)

### Phase 1: Setup & Cleanup
- [ ] Review and answer questions above
- [ ] Back up current components before removal
- [ ] Remove deprecated components (StatsStrip, ComparisonTable, old FeaturesGrid)
- [ ] Update `index.astro` structure

### Phase 2: New Components Creation
- [ ] Create/update `MacTerminal.astro` with install animation
- [ ] Create `OfferingsGrid.astro` for 4 main offerings
- [ ] Create `ComponentsArchitecture.astro` for d0s components
- [ ] Create `ContextHighlights.astro` for key benefits
- [ ] Create `FactoryFeatures.astro` (if included)
- [ ] Update `CatalogPreview.astro` for top 4 apps

### Phase 3: Styling & Animation
- [ ] Add subtle fade-in animations for sections
- [ ] Implement typing animation for terminal
- [ ] Add hover effects and transitions
- [ ] Ensure responsive design (mobile, tablet, desktop)
- [ ] Test animation performance

### Phase 4: Integration & Testing
- [ ] Update `index.astro` with new component layout
- [ ] Link catalog preview to catalog page with app selection
- [ ] Test all animations and transitions
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check
- [ ] Performance audit (Lighthouse)

### Phase 5: Polish
- [ ] Final spacing and typography adjustments
- [ ] Accessibility review (ARIA labels, keyboard navigation)
- [ ] Copy/content review
- [ ] Final QA pass

