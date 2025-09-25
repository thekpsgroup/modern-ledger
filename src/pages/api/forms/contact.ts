import type { APIRoute } from 'astro';
import { z } from 'zod';
import getEnv from '../../../lib/env';

const env = getEnv();
const formsubmitEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(env.COMPANY_EMAIL)}`;

const requestSchema = z.object({
  name: z.string({ required_error: 'Name is required.' }).min(2, 'Name must be at least 2 characters.'),
  email: z
    .string({ required_error: 'Email is required.' })
    .email('Please provide a valid email address.'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  teamSize: z.string().optional(),
  monthlyTransactions: z.string().optional(),
  annualRevenue: z.string().optional(),
  bookkeepingTools: z.string().optional(),
  timeline: z.string().optional(),
  sourcePage: z.string().optional(),
  pageUrl: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  message: z
    .string({ required_error: 'Message is required.' })
    .min(10, 'Message must be at least 10 characters.'),
  honeypot: z.string().optional()
});

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, RateLimitEntry>();

const getClientIp = (request: Request): string => {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    // @ts-ignore - adapters like Vercel add clientAddress
    (request as any).clientAddress ||
    'unknown'
  );
};

const isRateLimited = (ip: string): boolean => {
  if (ip === 'unknown') return false;

  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  return false;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const payload = await request.json().catch(() => null);
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const parsed = requestSchema.safeParse(payload);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed.',
          details: parsed.error.flatten().fieldErrors
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = parsed.data;

    if (data.honeypot && data.honeypot.trim().length > 0) {
      return new Response(
        JSON.stringify({ error: 'Spam detected.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const bodyLines = [
      'New contact form submission from modernledger.co',
      '--- Lead Details ---',
      `Source Page: ${data.sourcePage || 'Not provided'}`,
      `Page URL: ${data.pageUrl || 'Not provided'}`,
      `Referrer: ${data.referrer || 'Not provided'}`,
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || 'Not provided'}`,
      `Company: ${data.company || 'Not provided'}`,
      `Team Size: ${data.teamSize || 'Not provided'}`,
      `Monthly Transactions: ${data.monthlyTransactions || 'Not provided'}`,
      `Annual Revenue: ${data.annualRevenue || 'Not provided'}`,
      `Bookkeeping Tools: ${data.bookkeepingTools || 'Not provided'}`,
      `Timeline: ${data.timeline || 'Not provided'}`,
      `Service Focus: ${data.service || 'Not provided'}`,
      '',
      'Message:',
      data.message,
      '',
      '--- Tracking ---',
      `UTM Source: ${data.utmSource || 'Not provided'}`,
      `UTM Medium: ${data.utmMedium || 'Not provided'}`,
      `UTM Campaign: ${data.utmCampaign || 'Not provided'}`,
      `UTM Term: ${data.utmTerm || 'Not provided'}`,
      `UTM Content: ${data.utmContent || 'Not provided'}`,
      '',
      `IP Address: ${ip}`,
      `User Agent: ${request.headers.get('user-agent') || 'Unknown'}`
    ];

    const response = await fetch(formsubmitEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || 'Not provided',
        message: bodyLines.join('\n'),
        _replyto: data.email,
        _subject: 'New Contact Form Submission - Modern Ledger'
      })
    });

    const result = await response.json().catch(() => ({}));
    const successFlag =
      typeof result?.success === 'undefined'
        ? true
        : String(result.success).toLowerCase() === 'true';

    if (!response.ok || !successFlag) {
      console.error('Formsubmit error:', result);
      throw new Error(result?.message || 'Form submission failed.');
    }

    const leadData = {
      ...data,
      timestamp: new Date().toISOString(),
      ip,
      userAgent: request.headers.get('user-agent')
    };
    console.log('New contact lead:', leadData);

    return new Response(
      JSON.stringify({
        success: true,
        message: result?.message ?? "Thank you! We'll be in touch within one business day."
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again later.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
