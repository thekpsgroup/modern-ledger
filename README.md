# Modern Ledger - Professional Bookkeeping Website

A modern, SEO-optimized website for Modern Ledger, a professional bookkeeping service serving Royse City, Texas and surrounding areas.

## 🚀 Tech Stack

- **Framework:** Astro 4.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** MDX for blog posts
- **Deployment:** Vercel/Netlify ready

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd modern-ledger
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

## 🏗️ Build & Deploy

### Development
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

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the `dist` folder to Netlify
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   └── ...
├── layouts/            # Page layouts
│   └── Layout.astro
├── pages/              # Route pages
│   ├── index.astro
│   ├── about.astro
│   └── ...
├── data/               # Static data files
│   └── testimonials.ts
└── content/            # MDX content (blog posts, etc.)
```

## 🎨 Design System

### Colors
- Primary: Blue (#0ea5e9)
- Secondary: Slate (#64748b)
- Accent: Emerald (#10b981)

### Typography
- Headings: Poppins
- Body: Inter

## 🔍 SEO Features

- JSON-LD structured data
- Open Graph meta tags
- Twitter Cards
- Sitemap generation
- Robots.txt
- Local business schema
- FAQ schema

## 📊 Performance

- Lighthouse score target: 95+
- Core Web Vitals optimized
- Image optimization
- Minimal JavaScript
- Fast loading times

## 🧪 Testing

```bash
npm test
```

## 📈 Analytics

The site includes:
- Privacy-friendly analytics setup
- Conversion tracking
- Lead capture forms
- Exit-intent modal

## 📋 Content Management

### Adding Blog Posts
Create new `.mdx` files in `src/content/blog/`

### Updating Testimonials
Edit `src/data/testimonials.ts`

### Modifying Services
Update components in `src/components/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

© 2025 Modern Ledger. All rights reserved.

## 📞 Support

For questions or support:
- Email: sales@thekpsgroup.com
- Phone: (469) 534-3392