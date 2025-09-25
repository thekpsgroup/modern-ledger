#!/usr/bin/env ts-node

import { writeFileSync } from 'fs';
import { join } from 'path';

interface ContentPlanEntry {
  month: string;
  week: number;
  title: string;
  targetKeyword: string;
  intent: string;
  h2Outline: string[];
  h3Outline: string[];
  internalLinks: string[];
  ctaBlocks: string[];
}

function generateContentPlan(): ContentPlanEntry[] {
  const months = [
    'January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
    'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025'
  ];

  const plan: ContentPlanEntry[] = [];

  months.forEach((month, monthIndex) => {
    // 2 posts per month
    for (let week = 1; week <= 2; week++) {
      const postNumber = monthIndex * 2 + week;

      let entry: ContentPlanEntry;

      switch (postNumber) {
        case 1:
          entry = {
            month,
            week,
            title: "QuickBooks Setup Guide for Texas Small Businesses",
            targetKeyword: "quickbooks setup texas",
            intent: "Transactional - Guide users through QuickBooks setup",
            h2Outline: [
              "Why QuickBooks is Perfect for Texas Businesses",
              "Step-by-Step QuickBooks Setup Process",
              "Common Setup Mistakes to Avoid",
              "QuickBooks Training Resources"
            ],
            h3Outline: [
              "Texas-specific tax settings",
              "Multi-state sales tax configuration",
              "Bank reconciliation setup",
              "User permissions and security"
            ],
            internalLinks: ["/services/quickbooks-setup", "/pricing", "/locations/royse-city-tx"],
            ctaBlocks: ["Book Free QuickBooks Setup Consultation", "Download QuickBooks Checklist"]
          };
          break;

        case 2:
          entry = {
            month,
            week,
            title: "Month-End Bookkeeping Checklist for Busy Entrepreneurs",
            targetKeyword: "month end bookkeeping checklist",
            intent: "Informational - Provide actionable checklist",
            h2Outline: [
              "Why Monthly Bookkeeping Matters",
              "Complete Month-End Checklist",
              "Common Month-End Mistakes",
              "Automating Your Bookkeeping Process"
            ],
            h3Outline: [
              "Reconciling bank statements",
              "Reviewing expense categories",
              "Generating financial reports",
              "Planning for tax season"
            ],
            internalLinks: ["/services/monthly-bookkeeping", "/blog/quickbooks-setup-guide", "/contact"],
            ctaBlocks: ["Download Free Month-End Checklist", "Schedule Monthly Bookkeeping Review"]
          };
          break;

        case 3:
          entry = {
            month,
            week,
            title: "Tax Preparation Tips for Texas Business Owners",
            targetKeyword: "texas business tax preparation",
            intent: "Informational - Tax preparation guidance",
            h2Outline: [
              "Texas Business Tax Requirements",
              "Quarterly Tax Filing Deadlines",
              "Maximizing Tax Deductions",
              "Working with Tax Professionals"
            ],
            h3Outline: [
              "Sales tax collection and filing",
              "Franchise tax calculations",
              "Business expense tracking",
              "Tax planning strategies"
            ],
            internalLinks: ["/services/tax-preparation", "/locations/rockwall-tx", "/pricing"],
            ctaBlocks: ["Get Tax Preparation Quote", "Download Tax Deduction Guide"]
          };
          break;

        case 4:
          entry = {
            month,
            week,
            title: "Cash Flow Management Strategies for Small Businesses",
            targetKeyword: "small business cash flow management",
            intent: "Informational - Cash flow strategies",
            h2Outline: [
              "Understanding Cash Flow vs Profit",
              "Cash Flow Forecasting Techniques",
              "Managing Seasonal Cash Flow",
              "Cash Flow Improvement Strategies"
            ],
            h3Outline: [
              "Creating cash flow projections",
              "Managing accounts receivable",
              "Controlling inventory costs",
              "Emergency cash reserves"
            ],
            internalLinks: ["/services/cash-flow-management", "/blog/month-end-checklist", "/contact"],
            ctaBlocks: ["Free Cash Flow Analysis", "Download Cash Flow Template"]
          };
          break;

        case 5:
          entry = {
            month,
            week,
            title: "Choosing the Right Bookkeeping Service for Your Business",
            targetKeyword: "bookkeeping service comparison",
            intent: "Transactional - Help choose bookkeeping service",
            h2Outline: [
              "Types of Bookkeeping Services",
              "What to Look for in a Bookkeeper",
              "Pricing Models and Costs",
              "Making the Switch to Outsourced Bookkeeping"
            ],
            h3Outline: [
              "In-house vs outsourced bookkeeping",
              "Fixed vs hourly pricing",
              "Technology and software requirements",
              "Contract terms and SLAs"
            ],
            internalLinks: ["/pricing", "/services", "/about"],
            ctaBlocks: ["Compare Bookkeeping Services", "Get Personalized Quote"]
          };
          break;

        case 6:
          entry = {
            month,
            week,
            title: "Financial Reporting Best Practices for Growing Businesses",
            targetKeyword: "business financial reporting",
            intent: "Informational - Financial reporting guide",
            h2Outline: [
              "Essential Financial Reports",
              "Reading and Understanding Reports",
              "Reporting Frequency Guidelines",
              "Using Reports for Decision Making"
            ],
            h3Outline: [
              "Profit & Loss statements",
              "Balance sheet analysis",
              "Cash flow statements",
              "Key performance indicators"
            ],
            internalLinks: ["/services/financial-reporting", "/blog/cash-flow-management", "/pricing"],
            ctaBlocks: ["Free Financial Report Review", "Download Report Templates"]
          };
          break;

        case 7:
          entry = {
            month,
            week,
            title: "Year-End Tax Planning for Texas Businesses",
            targetKeyword: "texas year end tax planning",
            intent: "Transactional - Tax planning services",
            h2Outline: [
              "Texas Tax Year-End Checklist",
              "Maximizing Year-End Deductions",
              "Estimated Tax Payment Planning",
              "Preparing for Tax Season"
            ],
            h3Outline: [
              "Q4 tax planning strategies",
              "Retirement plan contributions",
              "Equipment purchases and depreciation",
              "Business structure considerations"
            ],
            internalLinks: ["/services/tax-planning", "/locations/fate-tx", "/contact"],
            ctaBlocks: ["Schedule Year-End Tax Review", "Download Tax Planning Guide"]
          };
          break;

        case 8:
          entry = {
            month,
            week,
            title: "Scaling Your Bookkeeping Process as Your Business Grows",
            targetKeyword: "scaling bookkeeping processes",
            intent: "Informational - Scaling guidance",
            h2Outline: [
              "Signs You Need Better Bookkeeping",
              "Scaling Your Bookkeeping System",
              "Technology Solutions for Growth",
              "Building Internal Controls"
            ],
            h3Outline: [
              "Multi-entity bookkeeping",
              "Departmental reporting",
              "Automated workflows",
              "Staff training and development"
            ],
            internalLinks: ["/services/business-growth", "/blog/financial-reporting", "/pricing"],
            ctaBlocks: ["Growth Readiness Assessment", "Scale Your Bookkeeping Consultation"]
          };
          break;

        case 9:
          entry = {
            month,
            week,
            title: "Common Bookkeeping Mistakes Small Businesses Make",
            targetKeyword: "bookkeeping mistakes small business",
            intent: "Informational - Educational content",
            h2Outline: [
              "Most Common Bookkeeping Errors",
              "How Mistakes Impact Your Business",
              "Prevention Strategies",
              "Fixing Existing Errors"
            ],
            h3Outline: [
              "Personal vs business expenses",
              "Inconsistent categorization",
              "Late bank reconciliations",
              "Ignoring small discrepancies"
            ],
            internalLinks: ["/services/bookkeeping-audit", "/blog/month-end-checklist", "/contact"],
            ctaBlocks: ["Free Bookkeeping Health Check", "Download Error Prevention Guide"]
          };
          break;

        case 10:
          entry = {
            month,
            week,
            title: "Integrating QuickBooks with Other Business Tools",
            targetKeyword: "quickbooks integrations",
            intent: "Transactional - Integration services",
            h2Outline: [
              "Popular QuickBooks Integrations",
              "Benefits of Integrated Systems",
              "Setup and Configuration",
              "Troubleshooting Integration Issues"
            ],
            h3Outline: [
              "Payment processor integrations",
              "CRM system connections",
              "Inventory management sync",
              "Reporting tool integrations"
            ],
            internalLinks: ["/services/quickbooks-integration", "/blog/quickbooks-setup-guide", "/pricing"],
            ctaBlocks: ["Integration Assessment", "Setup QuickBooks Integrations"]
          };
          break;

        case 11:
          entry = {
            month,
            week,
            title: "Budgeting and Forecasting for Texas Small Businesses",
            targetKeyword: "small business budgeting texas",
            intent: "Informational - Budgeting guide",
            h2Outline: [
              "Creating Realistic Business Budgets",
              "Cash Flow Forecasting",
              "Budget vs Actual Analysis",
              "Adjusting Budgets as You Grow"
            ],
            h3Outline: [
              "Revenue projections",
              "Expense budgeting",
              "Seasonal adjustments",
              "Contingency planning"
            ],
            internalLinks: ["/services/budgeting-forecasting", "/blog/cash-flow-management", "/locations/wylie-tx"],
            ctaBlocks: ["Free Budget Template", "Budget Planning Consultation"]
          };
          break;

        case 12:
          entry = {
            month,
            week,
            title: "Holiday Season Bookkeeping Tips for Retail Businesses",
            targetKeyword: "holiday bookkeeping tips",
            intent: "Informational - Seasonal content",
            h2Outline: [
              "Preparing for Holiday Sales Season",
              "Managing Seasonal Cash Flow",
              "Year-End Tax Considerations",
              "Post-Holiday Bookkeeping Cleanup"
            ],
            h3Outline: [
              "Inventory tracking during holidays",
              "Gift card accounting",
              "Seasonal staff payroll",
              "Year-end closing procedures"
            ],
            internalLinks: ["/services/seasonal-bookkeeping", "/blog/tax-planning", "/contact"],
            ctaBlocks: ["Holiday Bookkeeping Prep", "Download Seasonal Checklist"]
          };
          break;

        case 13:
          entry = {
            month,
            week,
            title: "Understanding Business Financial Statements",
            targetKeyword: "business financial statements explained",
            intent: "Informational - Educational content",
            h2Outline: [
              "The Three Main Financial Statements",
              "How to Read Each Statement",
              "Key Ratios and Metrics",
              "Using Statements for Decisions"
            ],
            h3Outline: [
              "Income statement breakdown",
              "Balance sheet components",
              "Cash flow statement analysis",
              "Financial ratio calculations"
            ],
            internalLinks: ["/services/financial-analysis", "/blog/financial-reporting", "/pricing"],
            ctaBlocks: ["Free Financial Statement Review", "Financial Literacy Course"]
          };
          break;

        case 14:
          entry = {
            month,
            week,
            title: "Digital Bookkeeping Tools and Apps for 2025",
            targetKeyword: "best bookkeeping apps 2025",
            intent: "Informational - Tool recommendations",
            h2Outline: [
              "Top Bookkeeping Apps for 2025",
              "Mobile Bookkeeping Solutions",
              "Integration Capabilities",
              "Cost and Feature Comparisons"
            ],
            h3Outline: [
              "Receipt scanning apps",
              "Expense tracking tools",
              "Invoice management software",
              "Reporting and analytics tools"
            ],
            internalLinks: ["/services/digital-transformation", "/blog/quickbooks-integrations", "/contact"],
            ctaBlocks: ["Tool Recommendation Quiz", "Digital Bookkeeping Setup"]
          };
          break;

        case 15:
          entry = {
            month,
            week,
            title: "Business Succession Planning and Bookkeeping",
            targetKeyword: "business succession planning bookkeeping",
            intent: "Informational - Succession planning",
            h2Outline: [
              "Why Succession Planning Matters",
              "Bookkeeping for Business Transitions",
              "Valuation and Financial Due Diligence",
              "Tax Implications of Succession"
            ],
            h3Outline: [
              "Business valuation methods",
              "Transfer pricing considerations",
              "Estate planning integration",
              "Succession timeline planning"
            ],
            internalLinks: ["/services/business-valuation", "/blog/tax-planning", "/locations/heath-tx"],
            ctaBlocks: ["Succession Planning Assessment", "Business Valuation Consultation"]
          };
          break;

        case 16:
          entry = {
            month,
            week,
            title: "Sustainability and Green Bookkeeping Practices",
            targetKeyword: "green bookkeeping practices",
            intent: "Informational - Sustainability content",
            h2Outline: [
              "Eco-Friendly Bookkeeping Practices",
              "Digital Transformation Benefits",
              "Sustainable Business Reporting",
              "Green Vendor and Supplier Tracking"
            ],
            h3Outline: [
              "Paperless bookkeeping systems",
              "Carbon footprint accounting",
              "Sustainable procurement tracking",
              "ESG reporting integration"
            ],
            internalLinks: ["/services/sustainable-bookkeeping", "/blog/digital-tools", "/about"],
            ctaBlocks: ["Sustainability Assessment", "Green Bookkeeping Implementation"]
          };
          break;

        case 17:
          entry = {
            month,
            week,
            title: "Bookkeeping for E-commerce Businesses",
            targetKeyword: "ecommerce bookkeeping",
            intent: "Transactional - E-commerce services",
            h2Outline: [
              "E-commerce Bookkeeping Challenges",
              "Platform-Specific Accounting",
              "Managing Online Sales Tax",
              "Inventory and Cost of Goods Sold"
            ],
            h3Outline: [
              "Shopify bookkeeping integration",
              "Amazon seller accounting",
              "Multi-channel sales tracking",
              "Digital payment reconciliation"
            ],
            internalLinks: ["/services/ecommerce-bookkeeping", "/blog/quickbooks-integrations", "/pricing"],
            ctaBlocks: ["E-commerce Bookkeeping Audit", "Platform Integration Setup"]
          };
          break;

        case 18:
          entry = {
            month,
            week,
            title: "Work-from-Home Bookkeeping Solutions",
            targetKeyword: "remote bookkeeping services",
            intent: "Transactional - Remote services",
            h2Outline: [
              "Benefits of Remote Bookkeeping",
              "Secure Data Access Solutions",
              "Communication and Collaboration Tools",
              "Managing Remote Bookkeeping Teams"
            ],
            h3Outline: [
              "Cloud-based accounting software",
              "Secure file sharing platforms",
              "Video conferencing for reviews",
              "Project management tools"
            ],
            internalLinks: ["/services/remote-bookkeeping", "/blog/digital-tools", "/contact"],
            ctaBlocks: ["Remote Bookkeeping Demo", "Secure Access Setup"]
          };
          break;

        case 19:
          entry = {
            month,
            week,
            title: "Bookkeeping for Non-Profit Organizations",
            targetKeyword: "nonprofit bookkeeping",
            intent: "Informational - NPO specific",
            h2Outline: [
              "Non-Profit Accounting Fundamentals",
              "Fund Accounting Principles",
              "Grant and Donation Tracking",
              "Compliance and Reporting Requirements"
            ],
            h3Outline: [
              "Restricted vs unrestricted funds",
              "Program expense allocation",
              "Form 990 preparation",
              "Audit readiness procedures"
            ],
            internalLinks: ["/services/nonprofit-bookkeeping", "/blog/financial-reporting", "/locations/greenville-tx"],
            ctaBlocks: ["Non-Profit Assessment", "Compliance Review"]
          };
          break;

        case 20:
          entry = {
            month,
            week,
            title: "International Business Bookkeeping Considerations",
            targetKeyword: "international business bookkeeping",
            intent: "Informational - International content",
            h2Outline: [
              "Multi-Currency Accounting",
              "International Tax Compliance",
              "Foreign Exchange Management",
              "Cross-Border Transaction Tracking"
            ],
            h3Outline: [
              "Currency conversion accounting",
              "Transfer pricing documentation",
              "VAT and GST compliance",
              "International payment processing"
            ],
            internalLinks: ["/services/international-bookkeeping", "/blog/tax-planning", "/contact"],
            ctaBlocks: ["International Setup Consultation", "Cross-Border Compliance Review"]
          };
          break;

        case 21:
          entry = {
            month,
            week,
            title: "Bookkeeping for Real Estate Professionals",
            targetKeyword: "real estate bookkeeping",
            intent: "Transactional - Real estate services",
            h2Outline: [
              "Real Estate Accounting Challenges",
              "Property Management Bookkeeping",
              "Investment Property Tracking",
              "Real Estate Tax Considerations"
            ],
            h3Outline: [
              "Rental income accounting",
              "Property depreciation",
              "1031 exchange tracking",
              "Real estate closing costs"
            ],
            internalLinks: ["/services/real-estate-bookkeeping", "/blog/tax-planning", "/pricing"],
            ctaBlocks: ["Real Estate Bookkeeping Audit", "Property Portfolio Setup"]
          };
          break;

        case 22:
          entry = {
            month,
            week,
            title: "Crisis Management and Bookkeeping Continuity",
            targetKeyword: "business crisis bookkeeping",
            intent: "Informational - Crisis planning",
            h2Outline: [
              "Bookkeeping During Business Crises",
              "Financial Impact Assessment",
              "Cash Flow Crisis Management",
              "Recovery and Rebuilding Strategies"
            ],
            h3Outline: [
              "Emergency expense tracking",
              "Government relief program accounting",
              "Business interruption calculations",
              "Financial restructuring support"
            ],
            internalLinks: ["/services/crisis-management", "/blog/cash-flow-management", "/contact"],
            ctaBlocks: ["Crisis Financial Assessment", "Continuity Planning Consultation"]
          };
          break;

        case 23:
          entry = {
            month,
            week,
            title: "Bookkeeping Technology Trends for 2025",
            targetKeyword: "bookkeeping technology trends 2025",
            intent: "Informational - Technology trends",
            h2Outline: [
              "AI and Machine Learning in Bookkeeping",
              "Blockchain and Cryptocurrency Accounting",
              "Automated Data Entry Solutions",
              "Cloud Computing Advancements"
            ],
            h3Outline: [
              "AI-powered categorization",
              "Smart receipt scanning",
              "Real-time financial dashboards",
              "Predictive cash flow analytics"
            ],
            internalLinks: ["/services/tech-modernization", "/blog/digital-tools", "/about"],
            ctaBlocks: ["Technology Assessment", "Digital Transformation Planning"]
          };
          break;

        case 24:
          entry = {
            month,
            week,
            title: "Year-End Bookkeeping Review and Cleanup",
            targetKeyword: "year end bookkeeping cleanup",
            intent: "Transactional - Year-end services",
            h2Outline: [
              "Comprehensive Year-End Review",
              "Cleaning Up Accounting Records",
              "Preparing for Tax Season",
              "Setting Up for Next Year"
            ],
            h3Outline: [
              "Account reconciliation finalization",
              "Expense categorization review",
              "Depreciation schedule updates",
              "Budget planning for next year"
            ],
            internalLinks: ["/services/year-end-review", "/blog/tax-planning", "/pricing"],
            ctaBlocks: ["Year-End Bookkeeping Review", "Tax Preparation Planning"]
          };
          break;

        default:
          entry = {
            month,
            week,
            title: `Bookkeeping Best Practices for ${month.split(' ')[0]} ${new Date().getFullYear() + 1}`,
            targetKeyword: "bookkeeping best practices",
            intent: "Informational - General best practices",
            h2Outline: [
              "Monthly Bookkeeping Routines",
              "Financial Reporting Standards",
              "Tax Compliance Updates",
              "Technology Optimization"
            ],
            h3Outline: [
              "Regular data backups",
              "Account reconciliation",
              "Financial ratio monitoring",
              "Process documentation"
            ],
            internalLinks: ["/services", "/blog", "/contact"],
            ctaBlocks: ["Free Bookkeeping Assessment", "Monthly Bookkeeping Setup"]
          };
      }

      plan.push(entry);
    }
  });

  return plan;
}

function formatContentPlan(plan: ContentPlanEntry[]): string {
  let output = `# Modern Ledger Content Plan - 2025\n\n`;
  output += `Generated on: ${new Date().toISOString().split('T')[0]}\n\n`;

  const monthlyPlan = plan.reduce((acc, entry) => {
    if (!acc[entry.month]) acc[entry.month] = [];
    acc[entry.month].push(entry);
    return acc;
  }, {} as Record<string, ContentPlanEntry[]>);

  Object.entries(monthlyPlan).forEach(([month, entries]) => {
    output += `## ${month}\n\n`;

    entries.forEach((entry) => {
      output += `### Week ${entry.week}: ${entry.title}\n\n`;
      output += `**Target Keyword:** ${entry.targetKeyword}\n\n`;
      output += `**Search Intent:** ${entry.intent}\n\n`;
      output += `**H2 Outline:**\n`;
      entry.h2Outline.forEach(h2 => {
        output += `- ${h2}\n`;
      });
      output += `\n**H3 Outline:**\n`;
      entry.h3Outline.forEach(h3 => {
        output += `- ${h3}\n`;
      });
      output += `\n**Internal Links:** ${entry.internalLinks.join(', ')}\n\n`;
      output += `**CTA Blocks:** ${entry.ctaBlocks.join(', ')}\n\n`;
      output += `---\n\n`;
    });
  });

  return output;
}

async function main() {
  console.log('📝 Generating 12-month content plan...');

  const plan = generateContentPlan();
  const content = formatContentPlan(plan);

  const outputPath = join(process.cwd(), 'content-plan.md');
  writeFileSync(outputPath, content);

  console.log(`✅ Generated content plan with ${plan.length} posts: ${outputPath}`);
  console.log(`📊 Plan covers: ${Object.keys(plan.reduce((acc, p) => ({ ...acc, [p.month]: true }), {})).length} months`);
}

// CLI execution
main().catch(console.error);