# Modern Ledger - Professional Bookkeeping Services

A comprehensive, production-ready website for Modern Ledger, featuring dynamic city pages, enterprise-grade security, advanced analytics, and conversion optimization.

## Tech Stack

- **Framework:** Astro 4.5+ with TypeScript
- **Styling:** Tailwind CSS 3.4+ with custom design system
- **Content:** MDX for blog posts and structured content
- **Testing:** Playwright for E2E testing, Axe-core for accessibility
- **Performance:** Lighthouse CI, asset optimization, critical CSS
- **Analytics:** GA4 with consent management
- **Deployment:** Vercel with GitHub Actions CI/CD
- **Security:** SOC 2 compliant, GDPR/CCPA compliant

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd modern-ledger
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Generate required assets:**
   ```bash
   npm run assets:index
   npm run prebuild
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:4321`

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run start            # Alias for dev

# Building
npm run prebuild         # Generate cities data (required before build)
npm run build            # Production build with asset optimization
npm run preview          # Preview production build locally

# Content Generation
npm run gen:city-pages   # Generate static city pages
npm run gen:content-plan # Generate content scaffolding
npm run seo:sitemaps     # Generate XML sitemaps

# Quality Assurance
npm run qa:links         # Check internal/external links
npm run qa:lighthouse    # Run Lighthouse performance tests
npm run seo:check        # Run SEO audits

# Asset Management
npm run assets:index     # Generate brand asset index
npm run assets:optimize  # Optimize images and assets

# Analytics & Events
npm run pixels:build     # Build analytics pixel system
npm run events:ssr       # Process server-side events

# A/B Testing
npm run ab:variants      # Manage A/B test variants

# Forms & CRM
npm run forms:serve      # Start form processing server

# Testing
npm run test             # Run all tests
npm run test:e2e         # Run E2E tests only
npm run test:headed      # Run E2E tests in headed mode
npm run test:ui          # Run tests with UI
npm run test:debug       # Debug tests
npm run test:visual      # Run visual regression tests

# CI Pipeline
npm run ci               # Run full CI pipeline locally
```

### Environment Variables

Create a `.env` file with:

```env
# Site Configuration
SITE_URL=https://www.modernledger.co
COMPANY_EMAIL=sales@thekpsgroup.com
COMPANY_PHONE=4695343392

# Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Form Processing
FORMSPARK_ID=your-formspark-id
EVENTS_ENDPOINT_SECRET=your-secret-key

# A/B Testing
AB_FLAGS_PATH=./ab-flags.json

# Development
NODE_ENV=development
```

## Testing Strategy

### E2E Testing with Playwright

The project includes comprehensive E2E tests covering:

- **Navigation:** Header/footer links, breadcrumbs
- **Forms:** Contact forms, lead capture, validation
- **CTAs:** Call-to-action buttons and conversions
- **City Pages:** Dynamic routing and content
- **Accessibility:** WCAG AA compliance with Axe-core
- **Visual Regression:** Screenshot comparison across viewports
- **Performance:** Core Web Vitals and loading times

**Running Tests:**
```bash
# All tests
npm run test

# Specific test categories
npm run test:e2e         # Functional tests
npm run test:visual      # Visual regression
npm run test:headed      # With browser UI

# Debug mode
npm run test:debug
```

### Lighthouse CI

Automated performance monitoring with budgets:

- **Performance:** ≥90 score
- **Accessibility:** ≥90 score
- **Best Practices:** ≥95 score
- **SEO:** ≥95 score

**Local Lighthouse Run:**
```bash
npm run qa:lighthouse
```

## SEO & Performance

### Technical SEO Features

- **Structured Data:** JSON-LD schemas for Organization, LocalBusiness, FAQ
- **Meta Tags:** Open Graph, Twitter Cards, canonical URLs
- **Sitemaps:** Auto-generated XML sitemaps with priorities
- **Robots.txt:** Search engine directives
- **Local SEO:** City pages with NAP consistency

### Performance Optimizations

- **Asset Optimization:** WebP conversion, lazy loading, critical CSS
- **Image Processing:** Sharp-based optimization with responsive images
- **Bundle Analysis:** Minimal JavaScript with tree shaking
- **Caching:** Aggressive caching headers and CDN optimization

### Content Management

#### Adding Blog Posts
1. Create `.mdx` file in `src/content/blog/`
2. Include frontmatter with title, description, date, author
3. Add structured data for Article schema

#### Managing City Pages
- Cities are auto-generated from Overpass API data
- Custom content can be added in `src/pages/locations/[city].astro`
- SEO data is automatically generated per city

#### A/B Testing
```bash
# Update test variants
npm run ab:variants hero_copy_variant=B cta_style=outline

# Check current flags
npm run ab:variants
```

## � Analytics & Conversion

### GA4 Implementation

- **Consent Management:** GDPR/CCPA compliant with granular controls
- **Event Tracking:** Lead forms, CTAs, calculator usage, phone/email clicks
- **Conversion Funnels:** Multi-touch attribution
- **Custom Dimensions:** City pages, service types, user journey

### Conversion Optimization

- **A/B Testing:** Hero copy, CTA styles, sticky bars
- **Lead Capture:** Progressive forms with validation
- **Exit Intent:** Modal capture for leaving visitors
- **ROI Calculator:** Interactive tool with conversion tracking

## � Security & Compliance

### Security Measures

- **Data Encryption:** AES-256 at rest, TLS 1.3 in transit
- **Access Control:** Multi-factor authentication, RBAC
- **Regular Audits:** SOC 2 Type II compliance
- **Incident Response:** 72-hour breach notification

### Compliance

- **GDPR:** EU data protection compliance
- **CCPA:** California privacy rights
- **Texas State Board:** Public accountancy registration
- **Industry Standards:** SOC 2, ISO 27001 frameworks

## Deployment

### GitHub Actions CI/CD

The CI pipeline includes:

1. **Install & Setup:** Node.js, dependencies, caching
2. **Content Generation:** Cities, sitemaps, assets
3. **Quality Assurance:** SEO checks, link validation
4. **Build:** Production build with optimizations
5. **Testing:** E2E, visual regression, accessibility
6. **Performance:** Lighthouse CI with budgets
7. **Deploy:** Automatic Vercel deployment on main branch

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
npm run deploy:vercel

# Or deploy manually to any static host
# Upload the `dist/` folder
```

## Project Structure

```
├── .github/workflows/     # GitHub Actions CI/CD
├── scripts/               # Build and utility scripts
│   ├── fetch-cities.mjs   # City data generation
│   ├── assets-optimize.ts # Image optimization
│   ├── seo-check.ts       # SEO auditing
│   └── ...
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Analytics.astro # GA4 integration
│   │   ├── LeadForm.astro  # Contact forms
│   │   └── ...
│   ├── layouts/          # Page layouts
│   ├── pages/            # Route pages
│   │   ├── locations/    # Dynamic city pages
│   │   └── ...
│   ├── data/             # Static data files
│   └── lib/              # Utility functions
├── tests/                # E2E and integration tests
├── public/               # Static assets
└── dist/                 # Build output (generated)
```

## Troubleshooting

### Common Issues

**Build fails with city data error:**
```bash
npm run prebuild  # Regenerate cities.json
```

**Tests failing:**
```bash
npm run test:debug  # Debug with browser
```

**Performance issues:**
```bash
npm run qa:lighthouse  # Check Lighthouse scores
```

### CI Pipeline Interpretation

**Green Build:**
- All tests pass
- Lighthouse scores meet budgets
- SEO checks pass
- No accessibility violations

**Failed Build:**
- Check test results in Actions artifacts
- Review Lighthouse report for performance issues
- Fix any accessibility violations
- Ensure all links are valid

## 🤝 Contributing

1. **Branch Strategy:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Development:**
   ```bash
   npm run dev
   # Make changes, test locally
   ```

3. **Quality Checks:**
   ```bash
   npm run test:e2e
   npm run seo:check
   npm run qa:lighthouse
   ```

4. **Commit & Push:**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

5. **Pull Request:**
   - Ensure CI passes
   - Add description of changes
   - Request review

## License

© 2025 Modern Ledger. All rights reserved.

## Support

- **Email:** sales@thekpsgroup.com
- **Phone:** (469) 534-3392
- **Documentation:** See inline code comments and this README

---

*Built with love for Texas businesses* 