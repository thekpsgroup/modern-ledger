import type { APIRoute } from 'astro';
import { z } from 'zod';
import getEnv from '../../../lib/env';

const env = getEnv();
const formsubmitEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(env.COMPANY_EMAIL)}`;

const bodySchema = z.object({
  email: z.string().email('A valid email address is required.'),
  source: z.string().optional(),
  url: z.string().optional()
});

interface RateLimitState {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const rateLimitStore = new Map<string, RateLimitState>();

const getClientIp = (request: Request): string => {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    // @ts-ignore - Astro's env adds clientAddress in some adapters
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

    const parsed = bodySchema.safeParse(payload);
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

    const { email, source, url } = parsed.data;

    const response = await fetch(formsubmitEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        email,
        _replyto: email,
        _subject: 'New Exit-Intent Checklist Request',
        message: [
          `New exit-intent submission from modernledger.co`,
          `Email: ${email}`,
          `Source: ${source || 'Not provided'}`,
          `URL: ${url || 'Not provided'}`,
          `IP Address: ${ip}`
        ].join('\n')
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

    return new Response(
      JSON.stringify({
        success: true,
        message: result?.message ?? 'Thank you! Check your inbox – we\'ll send the checklist right away.'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Exit intent form error:', error);

    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again soon.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
