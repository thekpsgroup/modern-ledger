# Modern Ledge- Green variants (text-green-*, bg-green-*)
- Pink variants (text-pink-*, bg-pink-*)
- Purple variants (text-purple-*, bg-purple-*)
- Rainbow gradients or multi-color effectssign System

This document outlines the design system rules that must be followed for all pages and components in the Modern Ledger website.

## Color Scheme

### Approved Colors
- **Primary Text**: `text-gray-900` (dark gray for readability)
- **Secondary Text**: `text-gray-600` (medium gray for secondary content)
- **Backgrounds**: `bg-white` (white) or `bg-gray-50` (light gray)
- **Brand Accents**: `text-brand-navy` (dark blue) and `text-brand-gold` (gold)
- **Links**: `text-brand-navy` with `hover:text-brand-gold`

### Prohibited Colors (NEVER USE)
- [PROHIBITED] Green variants (`text-green-*`, `bg-green-*`)
- [PROHIBITED] Pink variants (`text-pink-*`, `bg-pink-*`)
- [PROHIBITED] Purple variants (`text-purple-*`, `bg-purple-*`)
- [PROHIBITED] Rainbow gradients or multi-color effects

## Typography

### H1 Headings (Required)
All H1 headings must use **exactly** this styling:
```astro
<h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-center">
  Your Heading Text
</h1>
```

**OR** use the standardized Heading component:
```astro
<Heading level={1}>Your Heading Text</Heading>
```

### Other Heading Levels
- **H2**: `text-3xl md:text-4xl font-bold text-gray-900 mb-4`
- **H3**: `text-2xl md:text-3xl font-bold text-gray-900 mb-3`
- **H4**: `text-xl md:text-2xl font-semibold text-gray-900 mb-3`

## Components

### Standardized Heading Component
Use the `Heading.astro` component for consistent typography:

```astro
import Heading from '../components/Heading.astro';

// H1
<Heading level={1}>Main Page Title</Heading>

// H2
<Heading level={2}>Section Title</Heading>

// H3
<Heading level={3}>Subsection Title</Heading>
```

## Development Tools

### Design System Check
Run the design system compliance check:

```bash
npm run design:check
```

This will scan all files and report any violations of the design system rules.

### CI Integration
The design system check runs automatically in CI. All PRs must pass the design system check before merging.

## Layout Rules

### Global Layout Structure
All pages must use consistent layouts:
- **Layout.astro**: Global layout with header/footer
- **BlogPostLayout.astro**: Specialized layout for blog posts

### Background Colors
- **Main Content**: Always `bg-white`
- **Hero Sections**: `bg-brand-sky/10` (light blue tint)
- **Alternating Sections**: `bg-gray-50` for contrast

### Spacing
- **Section Padding**: `py-20` (5rem top/bottom)
- **Container Max Width**: `max-w-7xl` for wide content, `max-w-4xl` for text-heavy
- **Text Alignment**: H1 headings must be centered

## Prohibited Patterns

### Colors
```astro
<!-- NEVER DO THIS -->
<h1 class="text-green-600">Green Heading</h1>
<div class="bg-purple-100">Purple Background</div>
<span class="text-pink-500">Pink Text</span>

<!-- DO THIS INSTEAD -->
<h1 class="text-gray-900">Proper Heading</h1>
<div class="bg-blue-50">Blue Background</div>
<span class="text-brand-gold">Gold Accent</span>
```

### Typography
```astro
<!-- NEVER DO THIS -->
<h1 class="text-5xl font-light text-white">Wrong H1</h1>

<!-- DO THIS INSTEAD -->
<h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-center">Correct H1</h1>
```

## Enforcement

### Automatic Checks
- Design system violations are caught by `npm run design:check`
- CI pipeline includes design system validation
- Build will fail if prohibited colors or incorrect typography are found

### Manual Review
- All PRs require design system compliance
- Use the provided utility classes for consistent styling
- Reference this document for any styling decisions

## Resources

- **Global CSS**: `src/styles/global.css` - Contains all design tokens
- **Heading Component**: `src/components/Heading.astro` - Standardized typography
- **Color Variables**: Defined in `:root` in global.css
- **Layout Components**: `src/layouts/` - Consistent page structure

## Contributing

When adding new pages or components:

1. **Always** use the standardized Heading component for H1 elements
2. **Never** use prohibited colors (green, pink, purple, rainbow)
3. **Always** follow the established color scheme
4. **Test** with `npm run design:check` before committing
5. **Reference** this document for any styling questions

Remember: **Consistency is key**. All pages must look and feel identical in terms of styling, colors, and typography.