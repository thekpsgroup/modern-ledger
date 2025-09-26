#!/usr/bin/env node

/**
 * Mass Page Generator for Modern Ledger
 * Generates hundreds of SEO-optimized pages dynamically
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Output directories
  blogDir: path.join(__dirname, '..', 'src', 'pages', 'blog'),
  servicesDir: path.join(__dirname, '..', 'src', 'pages', 'services'),
  locationsDir: path.join(__dirname, '..', 'src', 'pages', 'locations'),
  imagesDir: path.join(__dirname, '..', 'public', 'images', 'blog'),

  // Generation settings
  batchSize: 50, // Generate 50 pages at a time to avoid overwhelming
  totalTarget: 500, // Target total pages
  delayBetweenGenerations: 100, // ms delay between generations

  // SEO settings
  targetKeywords: [
    'bookkeeping Texas', 'small business accounting', 'QuickBooks help',
    'tax planning Texas', 'business bookkeeping services', 'accounting firm Texas',
    'financial management', 'bookkeeping services near me', 'Texas CPA',
    'small business taxes', 'accounting software', 'business financial planning'
  ]
};

// Enhanced content topics with more variety
const CONTENT_TOPICS = {
  'bookkeeping-services': [
    'Bookkeeping Services in Texas',
    'Small Business Bookkeeping',
    'Monthly Bookkeeping Packages',
    'Bookkeeping for Startups',
    'Remote Bookkeeping Services',
    'Bookkeeping for E-commerce',
    'Bookkeeping for Retail Businesses',
    'Bookkeeping for Service Businesses',
    'Bookkeeping for Construction Companies',
    'Bookkeeping for Medical Practices',
    'Bookkeeping for Law Firms',
    'Bookkeeping for Restaurants',
    'Bookkeeping for Real Estate',
    'Bookkeeping for Non-profits',
    'Bookkeeping for Freelancers'
  ],

  'quickbooks-support': [
    'QuickBooks Online Setup',
    'QuickBooks Training Texas',
    'QuickBooks Consulting',
    'QuickBooks Migration Services',
    'QuickBooks Payroll Setup',
    'QuickBooks Inventory Management',
    'QuickBooks Reporting',
    'QuickBooks Multi-user Setup',
    'QuickBooks Integration Services',
    'QuickBooks Troubleshooting',
    'QuickBooks Backup Solutions',
    'QuickBooks Security Best Practices',
    'QuickBooks Mobile App Setup',
    'QuickBooks Time Tracking',
    'QuickBooks Project Management'
  ],

  'tax-services': [
    'Tax Planning for Small Businesses',
    'Quarterly Tax Preparation',
    'Tax Compliance Texas',
    'Business Tax Returns',
    'Sales Tax Filing Texas',
    'Tax Deduction Optimization',
    'Tax Credit Opportunities',
    'Year-End Tax Planning',
    'Tax Audit Preparation',
    'Tax Extension Filing',
    'Business Tax Strategies',
    'Self-Employment Tax Planning',
    'Tax Efficient Business Structures',
    'International Tax Planning',
    'Tax Loss Harvesting'
  ],

  'financial-planning': [
    'Business Financial Planning',
    'Cash Flow Management',
    'Budget Planning Services',
    'Financial Forecasting',
    'Profitability Analysis',
    'Business Valuation Services',
    'Financial Statement Preparation',
    'KPI Tracking and Reporting',
    'Financial Goal Setting',
    'Investment Planning for Businesses',
    'Retirement Planning for Owners',
    'Business Succession Planning',
    'Financial Risk Assessment',
    'Cost Reduction Strategies',
    'Revenue Optimization'
  ],

  'accounting-software': [
    'Best Accounting Software for Small Businesses',
    'Xero vs QuickBooks Comparison',
    'FreshBooks vs QuickBooks',
    'Wave Accounting Review',
    'Bench Accounting Services',
    'Pilot Accounting Software',
    'Brex Accounting Integration',
    'Stripe Accounting Setup',
    'PayPal Accounting Integration',
    'Square Accounting Solutions',
    'Accounting Software Migration',
    'Cloud Accounting Benefits',
    'Accounting App Comparisons',
    'Free Accounting Software Options',
    'Enterprise Accounting Solutions'
  ],

  'texas-specific': [
    'Texas Sales Tax Compliance',
    'Texas Business Licensing',
    'Texas Franchise Tax',
    'Texas Employment Taxes',
    'Texas Business Insurance Requirements',
    'Texas LLC Formation',
    'Texas Corporation Filing',
    'Texas Business Permits',
    'Texas Workers Compensation',
    'Texas Unemployment Insurance',
    'Texas Business Property Tax',
    'Texas Economic Development',
    'Texas Small Business Grants',
    'Texas Minority Business Programs',
    'Texas Veterans Business Programs'
  ]
};

// Texas city data for location pages
const TEXAS_CITIES = [
  'Dallas', 'Fort Worth', 'Houston', 'Austin', 'San Antonio',
  'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock',
  'Laredo', 'Irving', 'Garland', 'Frisco', 'McKinney',
  'Amarillo', 'Grand Prairie', 'Brownsville', 'Killeen', 'Pasadena',
  'Mesquite', 'McAllen', 'Waco', 'Carrollton', 'Denton',
  'Midland', 'Wichita Falls', 'Odessa', 'Round Rock', 'Richardson',
  'Lewisville', 'Tyler', 'College Station', 'Pearland', 'San Angelo',
  'Allen', 'League City', 'Sugar Land', 'Longview', 'Edinburg',
  'Mission', 'Bryan', 'Baytown', 'Pharr', 'Temple',
  'Missouri City', 'Flower Mound', 'Harlingen', 'North Richland Hills', 'Victoria',
  'Conroe', 'New Braunfels', 'Mansfield', 'Cedar Park', 'Rowlett',
  'Port Arthur', 'Euless', 'Georgetown', 'Pflugerville', 'DeSoto',
  'San Marcos', 'Grapevine', 'Bedford', 'Galveston', 'Cedar Hill',
  'Texas City', 'Wylie', 'Huntsville', 'Keller', 'Haltom City'
];

class MassPageGenerator {
  constructor() {
    this.generatedCount = 0;
    this.startTime = Date.now();
  }

  async generateMassContent() {
    console.log('Starting mass page generation...');
    console.log(`Target: ${CONFIG.totalTarget} pages`);
    console.log(`Batch size: ${CONFIG.batchSize} pages`);
    console.log('');

    // Ensure output directories exist
    this.ensureDirectories();

    // Generate blog posts
    await this.generateBlogPosts();

    // Generate service pages
    await this.generateServicePages();

    // Generate location pages
    await this.generateLocationPages();

    const duration = (Date.now() - this.startTime) / 1000;
    console.log('');
    console.log(`Mass generation completed!`);
    console.log(`Total pages generated: ${this.generatedCount}`);
    console.log(`Total time: ${duration.toFixed(2)} seconds`);
    console.log(`Average: ${(this.generatedCount / duration).toFixed(2)} pages/second`);
  }

  ensureDirectories() {
    const dirs = [CONFIG.blogDir, CONFIG.servicesDir, CONFIG.locationsDir, CONFIG.imagesDir];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
  }

  async generateBlogPosts() {
    console.log('Generating blog posts...');

    const topics = this.flattenTopics();
    console.log(`Found ${topics.length} potential topics`);

    // Generate all topics for full SEO impact
    const allTopics = topics.slice(0, 200); // Generate up to 200 blog posts
    console.log(`Generating ${allTopics.length} blog posts for maximum SEO impact`);

    for (const topic of allTopics) {
      console.log(`Generating: ${topic}`);
      await this.generateBlogPost(topic);
      await this.delay(CONFIG.delayBetweenGenerations);
    }

    console.log(`Generated ${Math.min(200, this.generatedCount)} blog posts`);
  }

  async generateServicePages() {
    console.log('Generating service pages...');

    const services = [
      'bookkeeping-services',
      'quickbooks-support',
      'tax-services',
      'financial-planning',
      'accounting-software',
      'texas-specific'
    ];

    for (const service of services) {
      await this.generateServicePage(service);
      await this.delay(CONFIG.delayBetweenGenerations);
    }
  }

  async generateLocationPages() {
    console.log('Generating location pages...');

    const locations = TEXAS_CITIES.slice(0, 50); // Generate for top 50 cities

    for (const city of locations) {
      await this.generateLocationPage(city);
      await this.delay(CONFIG.delayBetweenGenerations);
    }
  }

  flattenTopics() {
    const allTopics = [];
    Object.values(CONTENT_TOPICS).forEach(categoryTopics => {
      allTopics.push(...categoryTopics);
    });
    return this.shuffleArray(allTopics);
  }

  async generateBlogPost(topic) {
    const fileName = this.createFileName(topic);
    const filePath = path.join(CONFIG.blogDir, `${fileName}.astro`);

    console.log(`Checking file: ${filePath}`);

    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`File exists, skipping: ${fileName}`);
      return;
    }

    console.log(`Creating new file: ${fileName}`);
    const category = this.getCategoryForTopic(topic);
    const content = this.generateBlogContent(topic, category);

    const blogPost = this.createBlogPostStructure(content, topic, category, fileName);

    fs.writeFileSync(filePath, blogPost, 'utf-8');
    this.generatedCount++;

    // Create image placeholder
    this.createImagePlaceholder(fileName);
  }

  async generateServicePage(serviceType) {
    const serviceName = serviceType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const fileName = `${serviceType}`;
    const filePath = path.join(CONFIG.servicesDir, `${fileName}.astro`);

    if (fs.existsSync(filePath)) {
      return;
    }

    const content = this.generateServiceContent(serviceName, serviceType);
    const page = this.createServicePageStructure(content, serviceName, fileName);

    fs.writeFileSync(filePath, page, 'utf-8');
    this.generatedCount++;
  }

  async generateLocationPage(city) {
    const fileName = city.toLowerCase().replace(/\s+/g, '-');
    const filePath = path.join(CONFIG.locationsDir, `${fileName}.astro`);

    if (fs.existsSync(filePath)) {
      return;
    }

    const content = this.generateLocationContent(city);
    const page = this.createLocationPageStructure(content, city, fileName);

    fs.writeFileSync(filePath, page, 'utf-8');
    this.generatedCount++;
  }

  generateBlogContent(topic, category) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    return {
      title: `${topic}: Complete Guide for Texas Businesses`,
      description: `Expert guidance on ${topic.toLowerCase()} for Texas small business owners. Professional bookkeeping and accounting services from Modern Ledger.`,
      introduction: `As a Texas business owner, mastering ${topic.toLowerCase()} is essential for maintaining financial health and compliance. Our comprehensive guide covers everything you need to know about implementing best practices in your business.`,
      sections: this.generateSections(topic, category),
      conclusion: `Implementing ${topic.toLowerCase()} best practices can significantly improve your business's financial management and compliance. Modern Ledger's Texas-based experts are here to help you every step of the way.`,
      cta: `Ready to get professional help with ${topic.toLowerCase()}? Contact Modern Ledger today for expert bookkeeping and accounting services tailored to Texas businesses.`,
      tags: this.generateTags(topic, category),
      seoKeywords: this.generateSEOKeywords(topic),
      publishDate: dateStr,
      modifiedDate: dateStr
    };
  }

  generateSections(topic, category) {
    const sectionTemplates = [
      {
        heading: "Why This Matters for Texas Businesses",
        content: `Texas businesses operate in a unique economic environment with specific regulatory requirements. Understanding ${topic.toLowerCase()} is crucial for maintaining compliance and optimizing financial performance in the Lone Star State.`
      },
      {
        heading: "Key Benefits and Advantages",
        content: `Implementing proper ${topic.toLowerCase()} strategies can lead to significant cost savings, improved efficiency, and better financial decision-making. Texas business owners who master these practices gain a competitive edge in their markets.`
      },
      {
        heading: "Step-by-Step Implementation Guide",
        content: `Follow this comprehensive guide to implement ${topic.toLowerCase()} in your business. Each step includes practical tips, common pitfalls to avoid, and success metrics to track your progress.`
      },
      {
        heading: "Common Challenges and Solutions",
        content: `Texas businesses often face unique challenges when implementing ${topic.toLowerCase()}. Learn about the most common issues and proven solutions to overcome them effectively.`
      },
      {
        heading: "Tools and Resources for Success",
        content: `Discover the best tools, software, and resources available to Texas businesses for managing ${topic.toLowerCase()}. From affordable solutions to enterprise-grade platforms, find what works for your business size and needs.`
      },
      {
        heading: "Measuring Success and ROI",
        content: `Track your progress with key performance indicators and metrics. Learn how to calculate the return on investment for your ${topic.toLowerCase()} initiatives and demonstrate value to stakeholders.`
      },
      {
        heading: "When to Seek Professional Help",
        content: `Recognize the signs that you need professional assistance with ${topic.toLowerCase()}. Modern Ledger's certified bookkeepers and accountants provide expert support for Texas businesses at every stage of growth.`
      }
    ];

    return sectionTemplates;
  }

  generateServiceContent(serviceName, serviceType) {
    return {
      title: `${serviceName} | Professional Bookkeeping Services Texas`,
      description: `Expert ${serviceName.toLowerCase()} for Texas small businesses. Professional bookkeeping, accounting, and financial management services from Modern Ledger.`,
      introduction: `Modern Ledger provides comprehensive ${serviceName.toLowerCase()} designed specifically for Texas businesses. Our certified professionals combine deep industry knowledge with cutting-edge technology to deliver exceptional results.`,
      features: this.generateServiceFeatures(serviceType),
      benefits: this.generateServiceBenefits(serviceType),
      pricing: this.generatePricingInfo(serviceType),
      testimonials: this.generateTestimonials(),
      faq: this.generateFAQ(serviceType)
    };
  }

  generateLocationContent(city) {
    return {
      title: `Bookkeeping Services in ${city}, Texas | Modern Ledger`,
      description: `Professional bookkeeping and accounting services in ${city}, Texas. Local expertise with nationwide standards. Serving ${city} businesses since 2019.`,
      introduction: `Modern Ledger provides exceptional bookkeeping and accounting services to businesses in ${city}, Texas. As a locally-owned company with deep roots in the Texas business community, we understand the unique challenges and opportunities that ${city} businesses face.`,
      services: [
        'Monthly Bookkeeping',
        'Tax Preparation',
        'QuickBooks Support',
        'Financial Planning',
        'Business Consulting',
        'Payroll Services'
      ],
      whyChooseUs: this.generateWhyChooseUs(city),
      localInfo: this.generateLocalInfo(city),
      contact: this.generateContactInfo(city)
    };
  }

  generateServiceFeatures(serviceType) {
    const featureMap = {
      'bookkeeping-services': [
        'Monthly financial statement preparation',
        'Bank and credit card reconciliation',
        'Accounts payable and receivable management',
        'Payroll processing and tax filing',
        'Inventory tracking and management',
        'Financial reporting and analysis'
      ],
      'quickbooks-support': [
        'QuickBooks Online setup and configuration',
        'Custom chart of accounts setup',
        'Automated transaction categorization',
        'Financial reporting customization',
        'User training and support',
        'Data migration and cleanup'
      ],
      'tax-services': [
        'Quarterly tax planning and preparation',
        'Business tax return preparation',
        'Sales tax compliance and filing',
        'Tax deduction optimization',
        'Tax audit representation',
        'Year-end tax planning'
      ]
    };

    return featureMap[serviceType] || [
      'Professional financial management',
      'Expert accounting guidance',
      'Compliance and regulatory support',
      'Technology-driven solutions',
      'Dedicated account management',
      'Scalable service options'
    ];
  }

  generateServiceBenefits(serviceType) {
    return [
      'Save time and focus on your business',
      'Ensure accuracy and compliance',
      'Access expert financial guidance',
      'Reduce costs and improve efficiency',
      'Gain valuable business insights',
      'Peace of mind with professional support'
    ];
  }

  generatePricingInfo(serviceType) {
    return {
      starter: { price: '$299', period: 'month', features: ['Basic bookkeeping', 'Monthly reports', 'Email support'] },
      professional: { price: '$599', period: 'month', features: ['Advanced bookkeeping', 'Weekly reports', 'Phone support', 'Tax planning'] },
      enterprise: { price: '$999', period: 'month', features: ['Full-service accounting', 'Daily reports', 'Dedicated manager', 'Comprehensive tax services'] }
    };
  }

  generateTestimonials() {
    return [
      {
        name: 'Sarah Johnson',
        company: 'Johnson Realty',
        text: 'Modern Ledger transformed our financial management. Their expertise and attention to detail helped us save thousands in taxes and improve our cash flow.',
        rating: 5
      },
      {
        name: 'Mike Chen',
        company: 'Chen Construction',
        text: 'Outstanding service! The team at Modern Ledger understands construction accounting and helped us streamline our entire financial process.',
        rating: 5
      },
      {
        name: 'Jennifer Davis',
        company: 'Davis Consulting',
        text: 'Professional, reliable, and incredibly knowledgeable. Modern Ledger has been instrumental in our business growth and financial planning.',
        rating: 5
      }
    ];
  }

  generateFAQ(serviceType) {
    return [
      {
        question: 'How quickly can you start working on my books?',
        answer: 'We can typically begin within 1-2 business days of signing your agreement, depending on your current bookkeeping status and our availability.'
      },
      {
        question: 'Do you work with businesses in my industry?',
        answer: 'Yes! We serve businesses across all industries including retail, construction, healthcare, professional services, e-commerce, and more.'
      },
      {
        question: 'What accounting software do you use?',
        answer: 'We primarily use QuickBooks Online but can also work with Xero, FreshBooks, and other popular accounting platforms.'
      },
      {
        question: 'How do you ensure data security?',
        answer: 'We use bank-level encryption, secure cloud storage, and follow strict data protection protocols to ensure your financial information remains confidential.'
      }
    ];
  }

  generateWhyChooseUs(city) {
    return [
      `Local ${city} expertise with Texas-wide knowledge`,
      'Certified QuickBooks ProAdvisors on staff',
      'Licensed Texas tax professionals',
      'Dedicated account managers for personalized service',
      'Technology-driven solutions for efficiency',
      'Proven track record with 500+ Texas businesses'
    ];
  }

  generateLocalInfo(city) {
    return {
      population: '50,000+ residents',
      businessClimate: 'Thriving business community with diverse industries',
      localIndustries: ['Healthcare', 'Education', 'Manufacturing', 'Retail', 'Professional Services'],
      economicGrowth: 'Strong growth trajectory with expanding business opportunities'
    };
  }

  generateContactInfo(city) {
    return {
      phone: '(972) 555-0123',
      email: `hello@modernledger.com`,
      address: `123 Business Drive, ${city}, TX 75001`,
      hours: 'Monday - Friday: 8:00 AM - 6:00 PM CST'
    };
  }

  createBlogPostStructure(content, topic, category, fileName) {
    const categoryDisplayNames = {
      'bookkeeping-services': 'Bookkeeping Services',
      'quickbooks-support': 'QuickBooks Support',
      'tax-services': 'Tax Services',
      'financial-planning': 'Financial Planning',
      'accounting-software': 'Accounting Software',
      'texas-specific': 'Texas Business Resources'
    };

    const displayCategory = categoryDisplayNames[category] || 'Business Tips';

    return `---
import BlogPostLayout from '../../layouts/BlogPostLayout.astro';
import CTASection from '../../components/CTASection.astro';
import { getEnv } from '../../lib/env';

const env = getEnv();
const canonicalUrl = \`\${env.SITE_URL}/blog/${fileName}\`;
---

<BlogPostLayout
  title="${content.title}"
  description="${content.description}"
  publishDate="${content.publishDate}"
  modifiedDate="${content.modifiedDate}"
  author="Modern Ledger Team"
  category="${displayCategory}"
  tags={${JSON.stringify(content.tags)}}
  image="/images/blog/${fileName}.jpg"
  canonical={canonicalUrl}
>
  <h2 id="introduction">Introduction</h2>

  <p>${content.introduction}</p>

  ${content.sections.map((section, index) => `
  <h2 id="section-${index + 1}">${section.heading}</h2>

  <p>${section.content}</p>
  `).join('\n')}

  <h2 id="conclusion">Key Takeaways</h2>

  <p>${content.conclusion}</p>

  <CTASection />

  <h3>Get Started Today</h3>

  <p>${content.cta}</p>

  <p><a href="/contact" class="btn btn-primary">Schedule Your Free Consultation</a></p>

  <blockquote>
    <p><em>Don't let bookkeeping complexities hold your business back. Modern Ledger's Texas-based experts are here to help you achieve financial clarity and focus on what matters most—growing your business.</em></p>
  </blockquote>
</BlogPostLayout>
`;
  }

  createServicePageStructure(content, serviceName, fileName) {
    return `---
import ServiceLayout from '../../layouts/ServiceLayout.astro';
import CTASection from '../../components/CTASection.astro';
import TestimonialCarousel from '../../components/TestimonialCarousel.astro';
import { getEnv } from '../../lib/env';

const env = getEnv();
const canonicalUrl = \`\${env.SITE_URL}/services/${fileName}\`;
---

<ServiceLayout
  title="${content.title}"
  description="${content.description}"
  canonical={canonicalUrl}
>
  <div class="service-hero">
    <h1>${serviceName}</h1>
    <p class="lead">${content.introduction}</p>
  </div>

  <section class="features">
    <h2>Our ${serviceName} Include</h2>
    <div class="features-grid">
      ${content.features.map(feature => `
      <div class="feature-card">
        <h3>${feature}</h3>
      </div>
      `).join('\n    ')}
    </div>
  </section>

  <section class="benefits">
    <h2>Benefits of Professional ${serviceName}</h2>
    <ul class="benefits-list">
      ${content.benefits.map(benefit => `<li>${benefit}</li>`).join('\n      ')}
    </ul>
  </section>

  <section class="pricing">
    <h2>Pricing Plans</h2>
    <div class="pricing-grid">
      <div class="pricing-card">
        <h3>Starter</h3>
        <div class="price">${content.pricing.starter.price}<span>/${content.pricing.starter.period}</span></div>
        <ul>
          ${content.pricing.starter.features.map(feature => `<li>${feature}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="pricing-card featured">
        <h3>Professional</h3>
        <div class="price">${content.pricing.professional.price}<span>/${content.pricing.professional.period}</span></div>
        <ul>
          ${content.pricing.professional.features.map(feature => `<li>${feature}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="pricing-card">
        <h3>Enterprise</h3>
        <div class="price">${content.pricing.enterprise.price}<span>/${content.pricing.enterprise.period}</span></div>
        <ul>
          ${content.pricing.enterprise.features.map(feature => `<li>${feature}</li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  </section>

  <TestimonialCarousel testimonials={${JSON.stringify(content.testimonials)}} />

  <section class="faq">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-accordion">
      ${content.faq.map((item, index) => `
      <div class="faq-item">
        <h3>${item.question}</h3>
        <p>${item.answer}</p>
      </div>
      `).join('\n      ')}
    </div>
  </section>

  <CTASection />
</ServiceLayout>
`;
  }

  createLocationPageStructure(content, city, fileName) {
    return `---
import LocationLayout from '../../layouts/LocationLayout.astro';
import CTASection from '../../components/CTASection.astro';
import { getEnv } from '../../lib/env';

const env = getEnv();
const canonicalUrl = \`\${env.SITE_URL}/locations/${fileName}\`;
---

<LocationLayout
  title="${content.title}"
  description="${content.description}"
  city="${city}"
  canonical={canonicalUrl}
>
  <div class="location-hero">
    <h1>Bookkeeping Services in ${city}, Texas</h1>
    <p class="lead">${content.introduction}</p>
  </div>

  <section class="services">
    <h2>Our Services in ${city}</h2>
    <div class="services-grid">
      ${content.services.map(service => `
      <div class="service-card">
        <h3>${service}</h3>
        <p>Professional ${service.toLowerCase()} tailored for ${city} businesses.</p>
      </div>
      `).join('\n      ')}
    </div>
  </section>

  <section class="why-choose-us">
    <h2>Why Choose Modern Ledger in ${city}?</h2>
    <ul class="reasons-list">
      ${content.whyChooseUs.map(reason => `<li>${reason}</li>`).join('\n      ')}
    </ul>
  </section>

  <section class="local-info">
    <h2>About ${city}, Texas</h2>
    <div class="local-stats">
      <div class="stat">
        <strong>Population:</strong> ${content.localInfo.population}
      </div>
      <div class="stat">
        <strong>Business Climate:</strong> ${content.localInfo.businessClimate}
      </div>
      <div class="stat">
        <strong>Key Industries:</strong> ${content.localInfo.localIndustries.join(', ')}
      </div>
      <div class="stat">
        <strong>Economic Growth:</strong> ${content.localInfo.economicGrowth}
      </div>
    </div>
  </section>

  <section class="contact">
    <h2>Contact Our ${city} Office</h2>
    <div class="contact-info">
      <div class="contact-item">
        <strong>Phone:</strong> ${content.contact.phone}
      </div>
      <div class="contact-item">
        <strong>Email:</strong> ${content.contact.email}
      </div>
      <div class="contact-item">
        <strong>Address:</strong> ${content.contact.address}
      </div>
      <div class="contact-item">
        <strong>Hours:</strong> ${content.contact.hours}
      </div>
    </div>
  </section>

  <CTASection />
</LocationLayout>
`;
  }

  generateTags(topic, category) {
    const baseTags = ['bookkeeping', 'accounting', 'Texas', 'small business'];
    const categoryTags = {
      'bookkeeping-services': ['bookkeeping services', 'financial management'],
      'quickbooks-support': ['QuickBooks', 'accounting software'],
      'tax-services': ['tax planning', 'tax compliance'],
      'financial-planning': ['financial planning', 'business planning'],
      'accounting-software': ['accounting software', 'business tools'],
      'texas-specific': ['Texas business', 'state compliance']
    };

    return [...baseTags, ...(categoryTags[category] || [])];
  }

  generateSEOKeywords(topic) {
    const keywords = CONFIG.targetKeywords.slice();
    const topicWords = topic.toLowerCase().split(' ');
    keywords.push(...topicWords);
    keywords.push(`${topic.toLowerCase()} texas`);
    return [...new Set(keywords)]; // Remove duplicates
  }

  getCategoryForTopic(topic) {
    for (const [category, topics] of Object.entries(CONTENT_TOPICS)) {
      if (topics.includes(topic)) {
        return category;
      }
    }
    return 'bookkeeping-services'; // Default
  }

  createFileName(topic) {
    const timestamp = Date.now();
    return topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 40) + '-' + timestamp;
  }

  createImagePlaceholder(fileName) {
    const imagePath = path.join(CONFIG.imagesDir, `${fileName}.jpg`);
    if (!fs.existsSync(imagePath)) {
      // Create a simple placeholder file (in production, you'd generate actual images)
      fs.writeFileSync(imagePath, '', 'utf-8');
    }
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  console.log('Starting mass page generation script...');

  const generator = new MassPageGenerator();
  console.log('Generator created');

  try {
    const args = process.argv.slice(2);
    const command = args[0];
    console.log('Command:', command);

    switch (command) {
      case 'generate':
        await generator.generateMassContent();
        break;

      case 'blog-only':
        await generator.generateBlogPosts();
        break;

      case 'services-only':
        await generator.generateServicePages();
        break;

      case 'locations-only':
        await generator.generateLocationPages();
        break;

      default:
        console.log('Modern Ledger Mass Page Generator');
        console.log('');
        console.log('Usage:');
        console.log('  node generate-mass-pages.mjs generate     # Generate all page types');
        console.log('  node generate-mass-pages.mjs blog-only    # Generate blog posts only');
        console.log('  node generate-mass-pages.mjs services-only # Generate service pages only');
        console.log('  node generate-mass-pages.mjs locations-only # Generate location pages only');
        console.log('');
        console.log('This script generates hundreds of SEO-optimized pages for Modern Ledger.');
        break;
    }

  } catch (error) {
    console.error('Mass page generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
main();


export default MassPageGenerator;