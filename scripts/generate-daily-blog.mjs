#!/usr/bin/env node

/**
 * AI Blog Generator for Modern Ledger
 * Generates daily blog posts using AI models
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
  // AI Model settings
  model: 'openai/gpt-4.1', // Using GitHub Models for cost-effectiveness
  temperature: 0.7,
  maxTokens: 4000,

  // Content settings
  targetAudience: 'Texas small business owners and entrepreneurs',
  businessFocus: 'bookkeeping, accounting, financial management',
  contentTypes: [
    'how-to guides',
    'best practices',
    'case studies',
    'tax tips',
    'industry insights',
    'tool comparisons',
    'seasonal advice',
    'compliance updates'
  ],

  // Output settings
  outputDir: path.join(__dirname, '..', 'src', 'pages', 'blog'),
  imagesDir: path.join(__dirname, '..', 'public', 'images', 'blog'),

  // Scheduling
  scheduleTime: '08:00', // 8 AM daily
  timezone: 'America/Chicago' // Central Time for Texas
};

// Content topics database - highly relevant to Modern Ledger's audience
const CONTENT_TOPICS = {
  'bookkeeping-basics': [
    'Setting up your first chart of accounts',
    'Understanding double-entry bookkeeping',
    'Monthly reconciliation checklist',
    'Bank reconciliation best practices',
    'Recording common business transactions',
    'Managing petty cash properly',
    'Inventory tracking methods',
    'Fixed assets and depreciation'
  ],

  'tax-planning': [
    'Quarterly tax planning for small businesses',
    'Maximizing deductions for Texas businesses',
    'Sales tax compliance in Texas',
    'Self-employment tax strategies',
    'Business expense categorization',
    'Tax-efficient business structures',
    'Year-end tax planning checklist',
    'State tax credits for Texas businesses'
  ],

  'quickbooks-training': [
    'QuickBooks Online setup for beginners',
    'Automating recurring transactions',
    'Managing customer invoices efficiently',
    'Payroll setup and compliance',
    'Financial reporting in QuickBooks',
    'QuickBooks inventory management',
    'Multi-user access and permissions',
    'QuickBooks backup and security'
  ],

  'business-growth': [
    'Financial planning for business expansion',
    'Cash flow management for growing businesses',
    'Pricing strategies and profit margins',
    'Financial KPIs every business owner should track',
    'Building financial reserves',
    'Debt management strategies',
    'Investment planning for business owners',
    'Exit strategy planning'
  ],

  'compliance-legal': [
    'Texas business licensing requirements',
    'Employment law basics for small businesses',
    'Data privacy and protection',
    'Insurance requirements for Texas businesses',
    'Contract management best practices',
    'Record retention policies',
    'Business continuity planning',
    'Regulatory compliance checklists'
  ],

  'seasonal-topics': [
    'Year-end tax planning strategies',
    'Q4 business planning and budgeting',
    'Holiday payroll considerations',
    'Annual business planning process',
    'Tax season preparation guide',
    'End-of-year financial review',
    'New year business goal setting',
    'Annual compliance updates'
  ]
};

// AI Content Generator Class
class AIBlogGenerator {
  constructor() {
    this.generatedToday = false;
    this.lastGenerationDate = null;
  }

  async generateBlogPost() {
    try {
      console.log('Starting AI blog post generation...');

      // Select topic category and specific topic
      const category = this.selectRandomCategory();
      const topic = this.selectRandomTopic(category);

      console.log(`Selected topic: ${topic} (${category})`);

      // Generate content using AI
      const blogContent = await this.generateContentWithAI(topic, category);

      // Create the blog post file
      const fileName = this.createFileName(topic);
      const filePath = path.join(CONFIG.outputDir, `${fileName}.astro`);

      // Generate blog post structure
      const blogPost = this.createBlogPostStructure(blogContent, topic, category);

      // Write the file
      fs.writeFileSync(filePath, blogPost, 'utf-8');

      // Generate or select an image
      await this.handleBlogImage(fileName, topic);

      console.log(`Blog post created: ${fileName}.astro`);
      console.log(`Scheduled for publication: ${new Date().toISOString().split('T')[0]}`);

      return { fileName, topic, category };

    } catch (error) {
      console.error('Error generating blog post:', error);
      throw error;
    }
  }

  selectRandomCategory() {
    const categories = Object.keys(CONTENT_TOPICS);
    return categories[Math.floor(Math.random() * categories.length)];
  }

  selectRandomTopic(category) {
    const topics = CONTENT_TOPICS[category];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  async generateContentWithAI(topic, category) {
    // For now, we'll create a comprehensive prompt and simulate AI generation
    // In production, this would call the actual AI API

    const prompt = this.createAIPrompt(topic, category);

    // Simulate AI response (replace with actual API call)
    const aiResponse = await this.callAIModel(prompt);

    return this.parseAIResponse(aiResponse);
  }

  createAIPrompt(topic, category) {
    return `You are a professional content writer specializing in accounting and bookkeeping for small businesses in Texas. Create a comprehensive, SEO-optimized blog post about "${topic}".

TARGET AUDIENCE: Texas small business owners, entrepreneurs, and managers who want to improve their financial management.

BUSINESS CONTEXT: Modern Ledger is a Texas-based bookkeeping service that helps businesses with accounting, tax planning, QuickBooks management, and financial compliance.

CONTENT REQUIREMENTS:
- Title: SEO-friendly, compelling, under 60 characters
- Meta description: Under 160 characters, includes target keywords
- Introduction: Hook the reader, establish credibility, preview value
- Main content: 8-12 detailed sections with practical, actionable advice
- Real examples: Include Texas-specific scenarios and examples
- Call-to-action: Encourage contacting Modern Ledger for services
- SEO optimization: Natural keyword usage, internal linking suggestions

STRUCTURE:
1. Compelling headline
2. SEO meta description
3. Introduction paragraph
4. 8-12 main content sections with H2/H3 headings
5. Conclusion with key takeaways
6. Call-to-action section
7. Related topics for internal linking

TONE: Professional yet approachable, authoritative but not intimidating, practical and solution-focused.

KEYWORD FOCUS: Include naturally: bookkeeping, accounting, small business, Texas, financial management, QuickBooks, tax planning.

OUTPUT FORMAT: Return as JSON with fields: title, description, introduction, sections (array of {heading, content}), conclusion, cta, tags, seoKeywords.`;
  }

  async callAIModel(prompt) {
    // This would be replaced with actual AI API call
    // For now, return a mock response
    console.log('Calling AI model...');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      title: `Mastering ${this.formatTopicForTitle(prompt.split('"')[1])}: A Complete Guide for Texas Businesses`,
      description: `Learn essential strategies for ${prompt.split('"')[1].toLowerCase()} that can save your Texas business time and money. Practical tips from Modern Ledger's experts.`,
      introduction: `As a Texas business owner, managing your finances effectively is crucial for long-term success. Whether you're just starting out or scaling your operations, understanding ${prompt.split('"')[1].toLowerCase()} can make the difference between struggling and thriving.`,
      sections: [
        {
          heading: "Why This Matters for Texas Businesses",
          content: "Texas businesses face unique challenges including state-specific tax requirements, diverse industries, and rapid growth opportunities. Proper financial management isn't just about compliance—it's about positioning your business for success in the competitive Texas market."
        },
        {
          heading: "Getting Started: Foundation Principles",
          content: "Before diving into advanced strategies, ensure you have the basics covered. This includes setting up proper accounting software, understanding your chart of accounts, and establishing regular financial review processes."
        },
        {
          heading: "Step-by-Step Implementation Guide",
          content: "Follow these actionable steps to implement best practices in your business. Each step includes specific tools, timelines, and success metrics to track your progress."
        },
        {
          heading: "Common Pitfalls to Avoid",
          content: "Learn from common mistakes that Texas business owners make. Avoiding these pitfalls can save you thousands in penalties, lost time, and unnecessary stress."
        },
        {
          heading: "Tools and Resources for Success",
          content: "Discover the best tools and resources available to Texas businesses. From affordable accounting software to professional services, find solutions that fit your budget and needs."
        },
        {
          heading: "Measuring Success and ROI",
          content: "Track your progress with key performance indicators. Learn how to measure the financial impact of your improved practices and calculate the ROI of your investments."
        },
        {
          heading: "When to Seek Professional Help",
          content: "Recognize the signs that you need professional bookkeeping assistance. Modern Ledger's Texas-based experts can provide the support you need to focus on growing your business."
        }
      ],
      conclusion: "Implementing these strategies can transform your business's financial health and position you for sustainable growth in the Texas market. Remember, professional bookkeeping services like Modern Ledger are here to support your success every step of the way.",
      cta: "Ready to get your books in order and focus on growing your business? Contact Modern Ledger today for a free consultation and discover how our Texas-based bookkeeping experts can help you achieve financial clarity and success.",
      tags: ["bookkeeping", "accounting", "small business", "Texas", "financial management"],
      seoKeywords: ["Texas bookkeeping", "small business accounting", "financial management", "QuickBooks", "tax planning"]
    };
  }

  parseAIResponse(response) {
    return response; // Already in correct format
  }

  formatTopicForTitle(topic) {
    return topic.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  createFileName(topic) {
    return topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }

  createBlogPostStructure(content, topic, category) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const fileName = this.createFileName(topic);

    // Map category to display name
    const categoryDisplayNames = {
      'bookkeeping-basics': 'Bookkeeping Basics',
      'tax-planning': 'Tax Planning',
      'quickbooks-training': 'QuickBooks Training',
      'business-growth': 'Business Growth',
      'compliance-legal': 'Compliance & Legal',
      'seasonal-topics': 'Seasonal Topics'
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
  publishDate="${dateStr}"
  modifiedDate="${dateStr}"
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

  async handleBlogImage(fileName, topic) {
    // For now, create a placeholder image reference
    // In production, this could generate or select appropriate images
    const imagePath = path.join(CONFIG.imagesDir, `${fileName}.jpg`);

    // Check if image exists, if not, we'll use a default
    if (!fs.existsSync(imagePath)) {
      console.log(`Image placeholder created for: ${fileName}.jpg`);
      // In production, you might want to generate or download relevant images
    }
  }

  async scheduleDailyGeneration() {
    console.log('Setting up daily blog generation at 8:00 AM Central Time...');

    // This would typically use a cron job or task scheduler
    // For demonstration, we'll show how it would be set up

    const cronExpression = '0 8 * * *'; // 8 AM daily
    const command = 'node scripts/generate-daily-blog.mjs';

    console.log(`Cron schedule: ${cronExpression}`);
    console.log(`Command: ${command}`);
    console.log(`Timezone: ${CONFIG.timezone}`);

    // In a production environment, you would:
    // 1. Install node-cron or similar package
    // 2. Set up the scheduled job
    // 3. Handle logging and error recovery
    // 4. Ensure the script runs in the correct environment

    return { cronExpression, command, timezone: CONFIG.timezone };
  }
}

// Main execution
async function main() {
  const generator = new AIBlogGenerator();

  try {
    // Check if we should run today
    const today = new Date().toISOString().split('T')[0];
    const lastRunFile = path.join(__dirname, '.last-blog-generation');

    if (fs.existsSync(lastRunFile)) {
      const lastRun = fs.readFileSync(lastRunFile, 'utf-8').trim();
      if (lastRun === today) {
        console.log('Blog already generated today. Skipping...');
        return;
      }
    }

    // Generate the blog post
    const result = await generator.generateBlogPost();

    // Mark as completed today
    fs.writeFileSync(lastRunFile, today);

    console.log('Daily blog generation completed successfully!');
    console.log(`Generated: ${result.topic}`);
    console.log(`File: src/pages/blog/${result.fileName}.astro`);

  } catch (error) {
    console.error('Blog generation failed:', error);
    process.exit(1);
  }
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'generate':
    main();
    break;

  case 'schedule':
    const generator = new AIBlogGenerator();
    generator.scheduleDailyGeneration();
    break;

  case 'test':
    console.log('Testing blog generation...');
    main();
    break;

  default:
    console.log('🤖 Modern Ledger AI Blog Generator');
    console.log('');
    console.log('Usage:');
    console.log('  node generate-daily-blog.mjs generate  # Generate a blog post now');
    console.log('  node generate-daily-blog.mjs schedule  # Show scheduling setup');
    console.log('  node generate-daily-blog.mjs test      # Test generation (same as generate)');
    console.log('');
    console.log('The script automatically prevents duplicate posts on the same day.');
    break;
}

export default AIBlogGenerator;