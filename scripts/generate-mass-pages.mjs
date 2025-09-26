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
  batchSize: 100, // Generate 100 pages at a time for massive scale
  totalTarget: 1000, // Target 1000+ pages for maximum SEO impact
  delayBetweenGenerations: 50, // Faster generation for scale

  // SEO settings
  targetKeywords: [
    'bookkeeping Texas', 'small business accounting', 'QuickBooks help',
    'tax planning Texas', 'business bookkeeping services', 'accounting firm Texas',
    'financial management', 'bookkeeping services near me', 'Texas CPA',
    'small business taxes', 'accounting software', 'business financial planning',
    'bookkeeping Dallas', 'accounting Houston', 'tax services Austin',
    'QuickBooks training', 'payroll services Texas', 'business consulting',
    'financial statements', 'tax preparation', 'accounting software comparison',
    'small business bookkeeping', 'bookkeeping for startups', 'construction bookkeeping',
    'medical practice accounting', 'restaurant bookkeeping', 'retail accounting',
    'ecommerce bookkeeping', 'freelancer accounting', 'nonprofit bookkeeping'
  ]
};

// Enhanced content topics with massive expansion
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
    'Bookkeeping for Freelancers',
    'Bookkeeping for Manufacturing',
    'Bookkeeping for Healthcare',
    'Bookkeeping for Technology Companies',
    'Bookkeeping for Consulting Firms',
    'Bookkeeping for Retail Stores',
    'Bookkeeping for Food Service',
    'Bookkeeping for Professional Services',
    'Bookkeeping for Creative Agencies',
    'Bookkeeping for Fitness Businesses',
    'Bookkeeping for Salons and Spas',
    'Bookkeeping for Auto Repair Shops',
    'Bookkeeping for Home Services',
    'Bookkeeping for Cleaning Services',
    'Bookkeeping for Landscaping',
    'Bookkeeping for Pet Services',
    'Bookkeeping for Event Planning',
    'Bookkeeping for Photography',
    'Bookkeeping for Tutoring Services',
    'Bookkeeping for Coaching Businesses',
    'Bookkeeping for Online Businesses'
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
    'QuickBooks Project Management',
    'QuickBooks Desktop to Online Migration',
    'QuickBooks Custom Reports',
    'QuickBooks Budgeting Tools',
    'QuickBooks Class Tracking',
    'QuickBooks Automated Workflows',
    'QuickBooks API Integration',
    'QuickBooks Advanced Inventory',
    'QuickBooks Multi-Company Setup',
    'QuickBooks User Permissions',
    'QuickBooks Audit Trail',
    'QuickBooks Reconciliation Automation',
    'QuickBooks Tax Preparation',
    'QuickBooks Year-End Procedures',
    'QuickBooks Data Cleanup',
    'QuickBooks Performance Optimization'
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
    'Tax Loss Harvesting',
    'Tax Planning for LLCs',
    'Tax Planning for Corporations',
    'Tax Planning for Partnerships',
    'Tax Planning for Sole Proprietors',
    'Tax Planning for Contractors',
    'Tax Planning for Consultants',
    'Tax Planning for Real Estate',
    'Tax Planning for E-commerce',
    'Tax Planning for Retail',
    'Tax Planning for Restaurants',
    'Tax Planning for Medical Practices',
    'Tax Planning for Law Firms',
    'Tax Planning for Nonprofits',
    'Tax Planning for Startups',
    'Tax Planning for High-Income Earners'
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
    'Revenue Optimization',
    'Financial Modeling',
    'Scenario Planning',
    'Break-Even Analysis',
    'Financial Ratio Analysis',
    'Working Capital Management',
    'Debt Management Strategies',
    'Equity Financing Planning',
    'Financial Projections',
    'Budget vs Actual Analysis',
    'Financial Dashboard Creation',
    'Cash Flow Forecasting',
    'Profit Margin Optimization',
    'Expense Tracking Systems',
    'Financial Benchmarking',
    'Business Performance Metrics'
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
    'Enterprise Accounting Solutions',
    'Sage Accounting Software',
    'Peachtree Accounting',
    'MYOB Accounting',
    'Kruze Consulting',
    'Botkeeper Review',
    'ScaleFactor Accounting',
    'InDinero Services',
    'Accounting Software for Nonprofits',
    'Accounting Software for Restaurants',
    'Accounting Software for Retail',
    'Accounting Software for Construction',
    'Accounting Software for Medical',
    'Accounting Software for Law Firms',
    'Accounting Software for E-commerce',
    'Accounting Software for Startups'
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
    'Texas Veterans Business Programs',
    'Texas Business Entity Search',
    'Texas Public Information Act',
    'Texas Business Regulations',
    'Texas Tax Incentives',
    'Texas Workforce Development',
    'Texas Small Business Certification',
    'Texas Procurement Opportunities',
    'Texas Business Disaster Recovery',
    'Texas Cybersecurity Requirements',
    'Texas Data Privacy Laws',
    'Texas Employment Law Updates',
    'Texas Minimum Wage Requirements',
    'Texas Overtime Regulations',
    'Texas Workers Rights',
    'Texas Business Succession Laws'
  ],

  'industry-specific': [
    'Construction Bookkeeping Services',
    'Medical Practice Accounting',
    'Restaurant Accounting Services',
    'Retail Business Bookkeeping',
    'E-commerce Accounting Solutions',
    'Manufacturing Accounting',
    'Healthcare Accounting Services',
    'Technology Company Bookkeeping',
    'Consulting Firm Accounting',
    'Real Estate Accounting Services',
    'Nonprofit Organization Accounting',
    'Law Firm Bookkeeping',
    'Freelancer Accounting Services',
    'Startup Accounting Solutions',
    'Professional Services Accounting',
    'Creative Agency Bookkeeping',
    'Fitness Business Accounting',
    'Salon and Spa Bookkeeping',
    'Auto Repair Accounting',
    'Home Services Bookkeeping',
    'Cleaning Service Accounting',
    'Landscaping Business Bookkeeping',
    'Pet Services Accounting',
    'Event Planning Bookkeeping',
    'Photography Business Accounting',
    'Tutoring Service Bookkeeping',
    'Coaching Business Accounting',
    'Online Business Bookkeeping',
    'Food Truck Accounting',
    'Brewery Accounting Services',
    'Gym Accounting Solutions',
    'Daycare Bookkeeping',
    'Veterinary Practice Accounting',
    'Dental Practice Bookkeeping',
    'Chiropractic Office Accounting',
    'Therapy Practice Bookkeeping',
    'Marketing Agency Accounting',
    'Software Development Bookkeeping',
    'App Development Accounting',
    'Web Design Business Bookkeeping'
  ],

  'seasonal-content': [
    'Q1 Tax Planning Strategies',
    'Q2 Business Planning Guide',
    'Q3 Financial Review Checklist',
    'Q4 Year-End Tax Preparation',
    'January Business Planning',
    'February Tax Planning',
    'March Financial Planning',
    'April Tax Filing Guide',
    'May Business Growth Strategies',
    'June Financial Planning',
    'July Tax Planning',
    'August Business Planning',
    'September Tax Preparation',
    'October Financial Planning',
    'November Year-End Planning',
    'December Tax Strategies',
    'New Year Business Goals',
    'Tax Season Preparation',
    'End of Quarter Checklist',
    'Mid-Year Financial Review',
    'Back to School Business Planning',
    'Holiday Season Tax Planning',
    'Summer Business Strategies',
    'Fall Financial Planning',
    'Spring Business Growth',
    'Winter Tax Planning',
    'Black Friday Business Planning',
    'Cyber Monday Accounting',
    'Christmas Tax Strategies',
    'New Years Financial Goals',
    'Valentines Business Planning',
    'Easter Tax Planning',
    'Memorial Day Financial Review',
    'Independence Day Business Planning',
    'Labor Day Tax Strategies',
    'Halloween Business Planning',
    'Thanksgiving Financial Review',
    'Christmas Business Strategies',
    'Super Bowl Business Planning',
    'March Madness Tax Planning',
    'Easter Business Strategies',
    'Mother\'s Day Financial Planning'
  ],

  'advanced-topics': [
    'Advanced Financial Modeling',
    'Business Intelligence Analytics',
    'Predictive Financial Forecasting',
    'Machine Learning in Accounting',
    'Blockchain Accounting Solutions',
    'Cryptocurrency Tax Compliance',
    'International Business Expansion',
    'Mergers and Acquisitions Accounting',
    'Business Restructuring Services',
    'Financial Due Diligence',
    'Forensic Accounting Services',
    'Business Valuation Methods',
    'Intellectual Property Accounting',
    'Research and Development Tax Credits',
    'Employee Stock Ownership Plans',
    'Qualified Retirement Plans',
    'Business Succession Strategies',
    'Estate Planning for Business Owners',
    'Trust Accounting Services',
    'Partnership Accounting',
    'Joint Venture Accounting',
    'Consolidated Financial Statements',
    'Segment Reporting',
    'Foreign Currency Translation',
    'Hedging Strategies',
    'Derivative Accounting',
    'Lease Accounting Standards',
    'Revenue Recognition Rules',
    'Stock-Based Compensation',
    'Business Combination Accounting',
    'Impairment Testing',
    'Goodwill Accounting',
    'Intangible Asset Valuation',
    'Brand Valuation Services',
    'Patent Accounting',
    'Trademark Accounting',
    'Copyright Accounting',
    'Licensing Revenue Accounting',
    'Franchise Accounting',
    'Multi-State Tax Planning',
    'Transfer Pricing Strategies',
    'BEPS Compliance',
    'GAAP vs IFRS Differences',
    'SEC Reporting Requirements',
    'Sarbanes-Oxley Compliance',
    'Internal Controls Design',
    'Risk Assessment Procedures',
    'Audit Preparation Services',
    'Compilation Services',
    'Review Services',
    'Agreed-Upon Procedures'
  ],

  'startup-content': [
    'Startup Bookkeeping Essentials',
    'Bootstrapping Financial Management',
    'Venture Capital Accounting',
    'Angel Investment Tracking',
    'Startup Tax Strategies',
    'Equity Accounting for Startups',
    'Convertible Note Accounting',
    'SAFE Agreement Accounting',
    'Startup Valuation Methods',
    'Burn Rate Calculations',
    'Runway Analysis',
    'Unit Economics Tracking',
    'Cohort Analysis Accounting',
    'Customer Acquisition Cost Accounting',
    'Lifetime Value Calculations',
    'Churn Rate Financial Impact',
    'Startup Financial Projections',
    'Pitch Deck Financials',
    'Due Diligence Preparation',
    'Series A Accounting Preparation',
    'IPO Accounting Readiness',
    'Startup Insurance Accounting',
    'Remote Team Payroll',
    'Equity Compensation Accounting',
    'Stock Option Accounting',
    'Employee Retention Tax Credits',
    'Startup Grant Accounting',
    'Government Loan Accounting',
    'PPP Loan Forgiveness Accounting',
    'Economic Injury Disaster Loan Accounting',
    'Startup Accelerator Accounting',
    'Incubator Program Accounting',
    'Co-Working Space Accounting',
    'Home Office Deductions',
    'Startup Vehicle Expenses',
    'R&D Tax Credits for Startups',
    'Patent Costs Accounting',
    'Prototype Development Costs',
    'Minimum Viable Product Accounting',
    'Beta Testing Expenses',
    'User Acquisition Costs',
    'Marketing Expense Tracking',
    'Content Marketing Accounting',
    'Social Media Advertising Costs',
    'Influencer Marketing Accounting',
    'Affiliate Marketing Commissions',
    'SEO Expense Tracking',
    'PPC Advertising Accounting'
  ],

  'compliance-content': [
    'SOX Compliance Accounting',
    'HIPAA Accounting Requirements',
    'PCI DSS Compliance Costs',
    'GDPR Financial Data Protection',
    'CCPA Compliance Accounting',
    'FERPA Education Records Accounting',
    'GLBA Financial Privacy Rules',
    'PATRIOT Act Compliance',
    'BSA Anti-Money Laundering',
    'OFAC Sanctions Compliance',
    'FCPA Foreign Corrupt Practices',
    'Dodd-Frank Compliance',
    'Volcker Rule Accounting',
    'MiFID II Compliance',
    'EMIR Regulatory Reporting',
    'FATCA Compliance',
    'CRS Common Reporting Standard',
    'DAC6 Mandatory Disclosure',
    'PSD2 Payment Services Directive',
    'ePrivacy Directive Compliance',
    'Cookie Law Financial Impact',
    'Data Breach Notification Costs',
    'Cyber Insurance Accounting',
    'Ransomware Recovery Accounting',
    'Business Continuity Planning',
    'Disaster Recovery Accounting',
    'Crisis Management Financial Planning',
    'Regulatory Fines Accounting',
    'Compliance Training Costs',
    'Audit Committee Accounting',
    'Internal Audit Expenses',
    'External Audit Fees',
    'Compliance Officer Salary Accounting',
    'Legal Compliance Costs',
    'Regulatory Filing Fees',
    'Licensing Fee Accounting',
    'Certification Costs',
    'Accreditation Expenses',
    'Quality Assurance Accounting',
    'Risk Management Costs',
    'Insurance Premium Accounting',
    'Bonding Costs',
    'Fidelity Bond Accounting',
    'Professional Liability Insurance',
    'Directors and Officers Insurance',
    'Employment Practices Liability',
    'Workers Compensation Insurance',
    'General Liability Insurance',
    'Property Insurance Accounting',
    'Business Interruption Insurance',
    'Key Person Insurance',
    'Life Insurance Accounting',
    'Health Insurance Accounting',
    'Disability Insurance Costs'
  ]
};

// Texas city data for location pages - expanded to 100+ cities
const TEXAS_CITIES = [
  // Major Cities (Top 20)
  'Dallas', 'Fort Worth', 'Houston', 'Austin', 'San Antonio',
  'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock',
  'Laredo', 'Irving', 'Garland', 'Frisco', 'McKinney',
  'Amarillo', 'Grand Prairie', 'Brownsville', 'Killeen', 'Pasadena',

  // Large Cities (21-50)
  'Mesquite', 'McAllen', 'Waco', 'Carrollton', 'Denton',
  'Midland', 'Wichita Falls', 'Odessa', 'Round Rock', 'Richardson',
  'Lewisville', 'Tyler', 'College Station', 'Pearland', 'San Angelo',
  'Allen', 'League City', 'Sugar Land', 'Longview', 'Edinburg',
  'Mission', 'Bryan', 'Baytown', 'Pharr', 'Temple',
  'Missouri City', 'Flower Mound', 'Harlingen', 'North Richland Hills', 'Victoria',

  // Medium Cities (51-100)
  'Conroe', 'New Braunfels', 'Mansfield', 'Cedar Park', 'Rowlett',
  'Port Arthur', 'Euless', 'Georgetown', 'Pflugerville', 'DeSoto',
  'San Marcos', 'Grapevine', 'Bedford', 'Galveston', 'Cedar Hill',
  'Texas City', 'Wylie', 'Huntsville', 'Keller', 'Haltom City',
  'Coppell', 'Rockwall', 'Duncanville', 'Burleson', 'Hurst',
  'The Colony', 'Waxahachie', 'Farmers Branch', 'Texarkana', 'Huntsville',
  'Rosenberg', 'Dumas', 'Sanger', 'Lake Jackson', 'Sullivan City',
  'Alvin', 'Jacinto City', 'Lockhart', 'Bridge City', 'West Columbia',
  'Seabrook', 'Richmond', 'Bellville', 'Liberty', 'Orchard',
  'West Orange', 'Vidor', 'Lumberton', 'Silsbee', 'Kountze',

  // Additional Cities (101-150)
  'Groves', 'Bridge City', 'Orange', 'Vinton', 'San Benito',
  'Los Fresnos', 'La Feria', 'Santa Rosa', 'Sebastian', 'Indian Lake',
  'Rancho Viejo', 'Lago Vista', 'Jonestown', 'Bee Cave', 'The Hills',
  'West Lake Hills', 'Rollingwood', 'Weston', 'Volente', 'Point Venture',
  'Briargate', ' Steiner Ranch', 'Zilker', 'Tarrytown', 'Hyde Park',
  'North Burnet', 'Parmer Lane', 'Northwest Hills', 'Cat Mountain', 'Lakeway',
  'Cedar Creek', 'Lost Creek', 'Sunset Valley', 'Shady Hollow', 'Hornsby Bend',
  'Manchaca', 'Buda', 'Kyle', 'Dripping Springs', 'Wimberley',
  'Driftwood', 'Martindale', 'Maxwell', 'Prairie Lea', 'Red Rock',
  'San Leanna', 'Onion Creek', 'Pflugerville', 'Round Rock', 'Taylor'
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

    // Generate up to 500 blog posts for massive SEO impact
    const allTopics = topics.slice(0, 500);
    console.log(`Generating ${allTopics.length} blog posts for maximum SEO impact`);

    for (const topic of allTopics) {
      console.log(`Generating: ${topic}`);
      await this.generateBlogPost(topic);
      await this.delay(CONFIG.delayBetweenGenerations);
    }

    console.log(`Generated ${Math.min(500, this.generatedCount)} blog posts`);
  }

  async generateServicePages() {
    console.log('Generating service pages...');

    // Generate service pages for each major category
    const serviceCategories = [
      'bookkeeping-services',
      'quickbooks-support',
      'tax-services',
      'financial-planning',
      'accounting-software',
      'texas-specific',
      'industry-specific',
      'startup-services',
      'compliance-services',
      'advanced-accounting'
    ];

    for (const service of serviceCategories) {
      await this.generateServicePage(service);
      await this.delay(CONFIG.delayBetweenGenerations);
    }
  }

  async generateLocationPages() {
    console.log('Generating location pages...');

    // Generate for all 150+ Texas cities
    const locations = TEXAS_CITIES.slice(0, 150);

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
    const serviceData = this.getServiceData(serviceType);

    return {
      title: `${serviceData.title} | Professional Bookkeeping Services Texas`,
      description: serviceData.description,
      introduction: serviceData.introduction,
      features: serviceData.features,
      benefits: serviceData.benefits,
      pricing: serviceData.pricing,
      testimonials: this.generateTestimonials(),
      faq: serviceData.faq
    };
  }

  getServiceData(serviceType) {
    const serviceMap = {
      'bookkeeping-services': {
        title: 'Bookkeeping Services',
        description: 'Professional bookkeeping services for Texas small businesses. Accurate financial records, timely reporting, and expert support from certified bookkeepers.',
        introduction: 'Modern Ledger provides comprehensive bookkeeping services designed specifically for Texas businesses. Our certified professionals combine deep industry knowledge with cutting-edge technology to deliver exceptional results.',
        features: [
          'Monthly financial statement preparation',
          'Bank and credit card reconciliation',
          'Accounts payable and receivable management',
          'Payroll processing and tax filing',
          'Inventory tracking and management',
          'Financial reporting and analysis'
        ],
        benefits: [
          'Save time and focus on your business',
          'Ensure accuracy and compliance',
          'Access expert financial guidance',
          'Reduce costs and improve efficiency',
          'Gain valuable business insights',
          'Peace of mind with professional support'
        ],
        pricing: {
          starter: { price: '$299', period: 'month', features: ['Basic bookkeeping', 'Monthly reports', 'Email support'] },
          professional: { price: '$599', period: 'month', features: ['Advanced bookkeeping', 'Weekly reports', 'Phone support', 'Tax planning'] },
          enterprise: { price: '$999', period: 'month', features: ['Full-service accounting', 'Daily reports', 'Dedicated manager', 'Comprehensive tax services'] }
        },
        faq: [
          {
            question: 'How quickly can you start working on my books?',
            answer: 'We can typically begin within 1-2 business days of signing your agreement, depending on your current bookkeeping status and our availability.'
          },
          {
            question: 'Do you work with businesses in my industry?',
            answer: 'Yes! We serve businesses across all industries including retail, construction, healthcare, professional services, e-commerce, and more.'
          }
        ]
      },

      'quickbooks-support': {
        title: 'QuickBooks Support & Training',
        description: 'Expert QuickBooks support and training for Texas businesses. Certified ProAdvisors helping you maximize your QuickBooks investment.',
        introduction: 'Get expert QuickBooks support from certified ProAdvisors. We help Texas businesses implement, optimize, and troubleshoot QuickBooks for maximum efficiency.',
        features: [
          'QuickBooks setup and configuration',
          'Custom chart of accounts setup',
          'Automated transaction categorization',
          'Financial reporting customization',
          'User training and support',
          'Data migration and cleanup'
        ],
        benefits: [
          'Maximize your QuickBooks investment',
          'Reduce errors and save time',
          'Access certified expert support',
          'Stay up-to-date with best practices',
          'Custom solutions for your business',
          'Ongoing training and support'
        ],
        pricing: {
          starter: { price: '$199', period: 'month', features: ['Basic support', 'Email help', 'Documentation'] },
          professional: { price: '$399', period: 'month', features: ['Priority support', 'Phone/video calls', 'Training sessions', 'Custom reports'] },
          enterprise: { price: '$699', period: 'month', features: ['Dedicated advisor', 'On-site training', 'System optimization', 'Advanced automation'] }
        },
        faq: [
          {
            question: 'Do you support all versions of QuickBooks?',
            answer: 'Yes, we support QuickBooks Online, QuickBooks Desktop, and Enterprise versions. We can help you choose the best version for your business needs.'
          }
        ]
      },

      'tax-services': {
        title: 'Tax Planning & Preparation Services',
        description: 'Professional tax planning and preparation services for Texas businesses. Maximize deductions, minimize liabilities, ensure compliance.',
        introduction: 'Navigate Texas tax requirements with confidence. Our certified tax professionals provide comprehensive tax planning, preparation, and compliance services.',
        features: [
          'Quarterly tax planning and preparation',
          'Business tax return preparation',
          'Sales tax compliance and filing',
          'Tax deduction optimization',
          'Tax audit representation',
          'Year-end tax planning'
        ],
        benefits: [
          'Minimize tax liabilities legally',
          'Ensure compliance with Texas tax laws',
          'Maximize available deductions and credits',
          'Reduce audit risk',
          'Strategic tax planning advice',
          'Peace of mind during tax season'
        ],
        pricing: {
          starter: { price: '$149', period: 'quarter', features: ['Basic tax planning', 'Quarterly reviews', 'Email support'] },
          professional: { price: '$399', period: 'quarter', features: ['Comprehensive planning', 'Tax preparation', 'Audit support', 'Year-end planning'] },
          enterprise: { price: '$799', period: 'quarter', features: ['Advanced strategies', 'Multi-entity planning', 'IRS representation', 'Ongoing advisory'] }
        },
        faq: [
          {
            question: 'When should I start tax planning?',
            answer: 'Tax planning should be an ongoing process throughout the year. We recommend quarterly reviews to optimize your tax strategy and identify savings opportunities.'
          }
        ]
      },

      'financial-planning': {
        title: 'Business Financial Planning',
        description: 'Strategic financial planning services for Texas businesses. From cash flow management to long-term growth strategies.',
        introduction: 'Build a strong financial foundation for your Texas business. Our financial planning services help you optimize cash flow, manage risk, and plan for sustainable growth.',
        features: [
          'Cash flow management and forecasting',
          'Budget planning and monitoring',
          'Financial statement analysis',
          'KPI tracking and reporting',
          'Business valuation services',
          'Strategic financial planning'
        ],
        benefits: [
          'Improved financial decision-making',
          'Better cash flow management',
          'Reduced financial risk',
          'Strategic growth planning',
          'Performance monitoring and insights',
          'Long-term financial security'
        ],
        pricing: {
          starter: { price: '$399', period: 'month', features: ['Basic planning', 'Monthly reports', 'Cash flow analysis'] },
          professional: { price: '$799', period: 'month', features: ['Advanced planning', 'Weekly reports', 'Risk assessment', 'Growth strategies'] },
          enterprise: { price: '$1,499', period: 'month', features: ['Comprehensive planning', 'Daily monitoring', 'Custom dashboards', 'Executive advisory'] }
        },
        faq: [
          {
            question: 'How often should I review my financial plan?',
            answer: 'We recommend reviewing your financial plan quarterly, with monthly monitoring of key metrics. This allows for timely adjustments and optimal performance.'
          }
        ]
      },

      'accounting-software': {
        title: 'Accounting Software Solutions',
        description: 'Expert accounting software implementation and support. Find the perfect solution for your Texas business needs.',
        introduction: 'Choose the right accounting software for your Texas business. We help you implement, integrate, and optimize accounting solutions for maximum efficiency.',
        features: [
          'Software selection and implementation',
          'System integration and automation',
          'User training and support',
          'Data migration services',
          'Custom reporting and dashboards',
          'Ongoing optimization and updates'
        ],
        benefits: [
          'Streamlined financial processes',
          'Reduced manual data entry',
          'Real-time financial insights',
          'Improved accuracy and compliance',
          'Scalable solutions for growth',
          'Expert technical support'
        ],
        pricing: {
          starter: { price: '$299', period: 'setup', features: ['Software setup', 'Basic training', '30-day support'] },
          professional: { price: '$599', period: 'setup', features: ['Advanced setup', 'Integration', 'Training', '90-day support'] },
          enterprise: { price: '$999', period: 'setup', features: ['Custom implementation', 'Multi-system integration', 'Team training', '6-month support'] }
        },
        faq: [
          {
            question: 'How do you choose the right accounting software?',
            answer: 'We evaluate your business size, industry, growth plans, and specific needs to recommend the best software solution. We consider factors like ease of use, scalability, integrations, and cost.'
          }
        ]
      },

      'texas-specific': {
        title: 'Texas Business Compliance Services',
        description: 'Navigate Texas business regulations with expert guidance. From licensing to tax compliance, we handle the complexities.',
        introduction: 'Master Texas business requirements with confidence. Our team specializes in Texas-specific regulations, ensuring your business stays compliant and optimized.',
        features: [
          'Texas business licensing assistance',
          'Sales tax compliance and filing',
          'Franchise tax preparation',
          'Employment tax compliance',
          'Business permit guidance',
          'Regulatory compliance monitoring'
        ],
        benefits: [
          'Avoid costly compliance violations',
          'Stay current with Texas regulations',
          'Minimize tax liabilities',
          'Reduce regulatory risk',
          'Focus on business growth',
          'Expert Texas-specific guidance'
        ],
        pricing: {
          starter: { price: '$199', period: 'month', features: ['Basic compliance monitoring', 'Monthly reviews', 'Email support'] },
          professional: { price: '$399', period: 'month', features: ['Comprehensive compliance', 'Quarterly filings', 'Priority support', 'Tax planning'] },
          enterprise: { price: '$699', period: 'month', features: ['Full compliance management', 'All filings handled', 'Dedicated advisor', 'Regulatory advocacy'] }
        },
        faq: [
          {
            question: 'What Texas licenses do I need for my business?',
            answer: 'Texas license requirements vary by industry and location. We help identify all necessary licenses, permits, and registrations for your specific business type and locations.'
          }
        ]
      },

      'industry-specific': {
        title: 'Industry-Specific Accounting Services',
        description: 'Specialized accounting services tailored to your industry. Industry expertise combined with Texas business knowledge.',
        introduction: 'Every industry has unique accounting challenges. Our industry-specific services combine deep sector knowledge with Texas business expertise.',
        features: [
          'Industry-specific chart of accounts',
          'Custom reporting and KPIs',
          'Regulatory compliance expertise',
          'Industry benchmarking',
          'Specialized tax strategies',
          'Process optimization'
        ],
        benefits: [
          'Industry-tailored financial management',
          'Regulatory compliance expertise',
          'Competitive benchmarking insights',
          'Optimized processes and workflows',
          'Strategic industry-specific advice',
          'Reduced industry-specific risks'
        ],
        pricing: {
          starter: { price: '$349', period: 'month', features: ['Industry setup', 'Basic reporting', 'Email support'] },
          professional: { price: '$699', period: 'month', features: ['Advanced industry services', 'Custom reporting', 'Phone support', 'Strategic planning'] },
          enterprise: { price: '$1,199', period: 'month', features: ['Full industry specialization', 'Executive advisory', 'Process optimization', 'Industry networking'] }
        },
        faq: [
          {
            question: 'Do you serve my industry?',
            answer: 'We serve businesses across all major industries including construction, healthcare, retail, professional services, manufacturing, and more. Contact us to discuss your specific industry needs.'
          }
        ]
      },

      'startup-services': {
        title: 'Startup Accounting & Advisory',
        description: 'Accounting services designed for startups. From bootstrapping to IPO preparation, we support your growth journey.',
        introduction: 'Navigate the financial challenges of startup growth with expert guidance. From initial setup to scaling and exit strategies, we support every stage of your journey.',
        features: [
          'Startup financial setup and planning',
          'Cash flow management and forecasting',
          'Equity and investment tracking',
          'Scalable accounting processes',
          'Investor reporting preparation',
          'Growth financial planning'
        ],
        benefits: [
          'Focus on business growth, not accounting',
          'Scalable financial systems',
          'Investor-ready reporting',
          'Cash flow optimization',
          'Strategic financial guidance',
          'Exit preparation support'
        ],
        pricing: {
          starter: { price: '$249', period: 'month', features: ['Basic startup accounting', 'Monthly reports', 'Growth planning'] },
          professional: { price: '$499', period: 'month', features: ['Advanced startup services', 'Investor reporting', 'Cash flow optimization', 'Strategic advisory'] },
          enterprise: { price: '$899', period: 'month', features: ['Full startup support', 'IPO preparation', 'M&A advisory', 'Executive financial coaching'] }
        },
        faq: [
          {
            question: 'When should startups hire an accountant?',
            answer: 'Ideally from day one. Proper financial setup and planning are crucial for startup success. We can help establish systems that scale with your growth.'
          }
        ]
      },

      'compliance-services': {
        title: 'Regulatory Compliance Services',
        description: 'Ensure regulatory compliance across all areas. From SOX to industry-specific regulations, we keep you compliant.',
        introduction: 'Navigate complex regulatory requirements with confidence. Our compliance experts ensure your business meets all federal, state, and industry-specific regulations.',
        features: [
          'Regulatory compliance assessments',
          'Compliance program development',
          'Internal controls design',
          'Risk assessment and monitoring',
          'Audit preparation and support',
          'Compliance training and documentation'
        ],
        benefits: [
          'Minimize regulatory risk and penalties',
          'Ensure ongoing compliance',
          'Strengthen internal controls',
          'Prepare for audits and examinations',
          'Build stakeholder confidence',
          'Focus on core business activities'
        ],
        pricing: {
          starter: { price: '$449', period: 'month', features: ['Compliance assessment', 'Basic monitoring', 'Quarterly reviews'] },
          professional: { price: '$899', period: 'month', features: ['Comprehensive compliance', 'Internal controls', 'Monthly reporting', 'Training'] },
          enterprise: { price: '$1,499', period: 'month', features: ['Full compliance management', 'Advanced monitoring', 'Executive reporting', 'Regulatory advocacy'] }
        },
        faq: [
          {
            question: 'What regulations apply to my business?',
            answer: 'Regulatory requirements vary by industry, size, and location. We conduct a comprehensive assessment to identify all applicable regulations for your specific situation.'
          }
        ]
      },

      'advanced-accounting': {
        title: 'Advanced Accounting Services',
        description: 'Sophisticated accounting solutions for complex business needs. From forensic accounting to international expansion.',
        introduction: 'Handle complex accounting challenges with advanced expertise. Our team provides sophisticated solutions for mergers, international expansion, and specialized financial needs.',
        features: [
          'Forensic accounting and investigations',
          'Mergers and acquisitions support',
          'International accounting services',
          'Business valuation and appraisals',
          'Complex tax planning strategies',
          'Advanced financial modeling'
        ],
        benefits: [
          'Expertise in complex financial matters',
          'Strategic transaction support',
          'International business guidance',
          'Accurate business valuations',
          'Sophisticated tax strategies',
          'Advanced analytical insights'
        ],
        pricing: {
          starter: { price: '$599', period: 'month', features: ['Advanced analysis', 'Strategic planning', 'Monthly advisory'] },
          professional: { price: '$1,199', period: 'month', features: ['Complex transactions', 'International services', 'Valuation services', 'Advanced modeling'] },
          enterprise: { price: '$1,999', period: 'month', features: ['Full strategic support', 'M&A advisory', 'Global expansion', 'Executive financial strategy'] }
        },
        faq: [
          {
            question: 'What constitutes advanced accounting services?',
            answer: 'Advanced accounting includes forensic investigations, M&A support, international accounting, business valuations, complex tax strategies, and sophisticated financial modeling.'
          }
        ]
      }
    };

    return serviceMap[serviceType] || serviceMap['bookkeeping-services'];
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
      'texas-specific': ['Texas business', 'state compliance'],
      'industry-specific': ['industry expertise', 'specialized accounting'],
      'seasonal-content': ['seasonal planning', 'quarterly planning'],
      'advanced-topics': ['advanced accounting', 'complex financial'],
      'startup-content': ['startup accounting', 'business growth'],
      'compliance-content': ['regulatory compliance', 'business compliance']
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