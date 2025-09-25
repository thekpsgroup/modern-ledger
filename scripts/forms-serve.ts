#!/usr/bin/env ts-node

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { getEnv } from '../src/lib/env';

const env = getEnv();
const formsubmitEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(env.COMPANY_EMAIL)}`;

function generateContactFormAPI(): string {
  return `import type { APIRoute } from 'astro';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  honeypot?: string;
}

const FORM_SUBMIT_ENDPOINT = '${formsubmitEndpoint}';

// Rate limiting store (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const userLimit = rateLimit.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

function validateForm(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.message || data.message.length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  // Honeypot check
  if (data.honeypot) {
    errors.push('Spam detected');
  }

  return { valid: errors.length === 0, errors };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({
        error: 'Too many requests. Please try again later.'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formData: ContactFormData = await request.json();

    // Validate form
    const validation = validateForm(formData);
    if (!validation.valid) {
      return new Response(JSON.stringify({
        error: 'Validation failed',
        details: validation.errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const messageBody = [
      'New contact form submission from modernledger.co',
      'Name: ' + formData.name,
      'Email: ' + formData.email,
      'Phone: ' + (formData.phone || 'Not provided'),
      '',
      'Message:',
      formData.message,
      '',
      'IP Address: ' + ip,
      'User Agent: ' + (request.headers.get('user-agent') || 'Unknown')
    ].join('\n');

    const response = await fetch(FORM_SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        message: messageBody,
        _replyto: formData.email,
        _subject: 'New Contact Form Submission - Modern Ledger'
      })
    });

    const result = await response.json().catch(() => ({}));
    const successFlag = typeof result?.success === 'undefined'
      ? true
      : String(result.success).toLowerCase() === 'true';

    if (!response.ok || !successFlag) {
      console.error('Formsubmit error:', result);
      throw new Error(result?.message || 'Form submission failed');
    }

    // Store lead data (in production, send to CRM)
    const leadData = {
      ...formData,
      timestamp: new Date().toISOString(),
      ip: ip,
      userAgent: request.headers.get('user-agent')
    };

    // For now, just log (in production, save to database/CRM)
    console.log('New lead:', leadData);

    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you for your message. We\\'ll get back to you soon!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({
      error: 'Something went wrong. Please try again later.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};`;
}

function generateLeadFormComponent(): string {
  return `---
// Contact form component
import { trackEvent } from '../lib/pixels';

interface Props {
  title?: string;
  subtitle?: string;
}

const { title = "Get Your Free Consultation", subtitle = "Let's discuss your bookkeeping needs" } = Astro.props;
---

<div class="bg-white rounded-lg shadow-lg p-8">
  <div class="text-center mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
    <p class="text-gray-600">{subtitle}</p>
  </div>

  <form id="contact-form" class="space-y-6">
    <!-- Honeypot field (hidden) -->
    <div style="display: none;">
      <label for="honeypot">Leave this field empty</label>
      <input type="text" id="honeypot" name="honeypot" tabindex="-1" />
    </div>

    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
        Full Name *
      </label>
      <input
        type="text"
        id="name"
        name="name"
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Your full name"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
        Email Address *
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="your.email@example.com"
      />
    </div>

    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
        Phone Number
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="(972) 555-0123"
      />
    </div>

    <div>
      <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
        Message *
      </label>
      <textarea
        id="message"
        name="message"
        required
        rows="4"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Tell us about your bookkeeping needs..."
      ></textarea>
    </div>

    <button
      type="submit"
      id="submit-btn"
      class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span id="btn-text">Send Message</span>
      <span id="btn-loading" class="hidden">Sending...</span>
    </button>
  </form>

  <p class="text-xs text-gray-500 mt-4 text-center">
    We respect your privacy and will never share your information.
  </p>
</div>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const btnText = document.getElementById('btn-text');
  const btnLoading = document.getElementById('btn-loading');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    btnText?.classList.add('hidden');
    btnLoading?.classList.remove('hidden');

    try {
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        honeypot: formData.get('honeypot')
      };

      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        alert(result.message);
        form.reset();

        // Track conversion
        if (typeof trackEvent === 'function') {
          trackEvent('form_submit', { form_type: 'contact' });
        }
      } else {
        // Error
        alert(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      // Reset loading state
      submitBtn.disabled = false;
      btnText?.classList.remove('hidden');
      btnLoading?.classList.add('hidden');
    }
  });
</script>`;
}

async function main() {
  console.log('📝 Generating contact form system...');

  const apiDir = join(process.cwd(), 'src', 'pages', 'api', 'forms');
  mkdirSync(apiDir, { recursive: true });

  const componentsDir = join(process.cwd(), 'src', 'components');

  // Generate contact form API
  const apiCode = generateContactFormAPI();
  const apiPath = join(apiDir, 'contact.ts');
  writeFileSync(apiPath, apiCode);
  console.log(`✅ Generated contact form API: ${apiPath}`);

  // Generate lead form component
  const componentCode = generateLeadFormComponent();
  const componentPath = join(componentsDir, 'LeadForm.astro');
  writeFileSync(componentPath, componentCode);
  console.log(`✅ Generated lead form component: ${componentPath}`);

  console.log(`🎉 Contact form system setup complete!`);
  console.log(`   API endpoint: /api/forms/contact`);
  console.log(`   Component: LeadForm.astro`);
  console.log(`   Email destination: ${env.COMPANY_EMAIL}`);
}

// CLI execution
main().catch(console.error);