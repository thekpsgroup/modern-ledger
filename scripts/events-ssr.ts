#!/usr/bin/env ts-node

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { getEnv } from '../src/lib/env';

const env = getEnv();

function generateEventEndpoint(provider: string): string {
  const providerConfig = {
    'google-ads': {
      endpoint: 'https://www.googleadservices.com/pagead/conversion_async.js',
      paramName: 'gclid'
    },
    'meta-capi': {
      endpoint: 'https://graph.facebook.com/v18.0/{pixel_id}/events',
      paramName: 'fbclid'
    },
    'bing-uet': {
      endpoint: 'https://bat.bing.com/action/0',
      paramName: 'msclkid'
    }
  };

  const config = providerConfig[provider as keyof typeof providerConfig];
  if (!config) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  return `import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verify endpoint secret
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    if (token !== '${env.EVENTS_ENDPOINT_SECRET}') {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { event, url, ts, utm, ${config.paramName}, value } = body;

    // Validate required fields
    if (!event || !url) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Forward to provider endpoint
    const response = await fetch('${config.endpoint}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${env.EVENTS_ENDPOINT_SECRET}'
      },
      body: JSON.stringify({
        event,
        url,
        timestamp: ts || new Date().toISOString(),
        utm_parameters: utm || {},
        click_id: ${config.paramName},
        value: value || 0
      })
    });

    if (!response.ok) {
      throw new Error(\`Provider API error: \${response.status}\`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Event tracking error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};`;
}

function generateTrackUtil(): string {
  return `import { trackEvent } from './pixels';

interface TrackingEvent {
  event: string;
  url?: string;
  value?: number;
  utm?: Record<string, string>;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
}

export async function trackServerEvent(eventData: TrackingEvent) {
  const { event, url = window.location.href, value, utm, gclid, fbclid, msclkid } = eventData;

  // Track locally first
  trackEvent(event, { value, url, ...utm });

  // Send to server-side tracking
  try {
    const response = await fetch('/api/events/google-ads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${env.EVENTS_ENDPOINT_SECRET}'
      },
      body: JSON.stringify({
        event,
        url,
        ts: new Date().toISOString(),
        utm,
        gclid,
        fbclid,
        msclkid,
        value
      })
    });

    if (!response.ok) {
      console.warn('Server-side tracking failed:', response.status);
    }
  } catch (error) {
    console.warn('Server-side tracking error:', error);
  }
}

// Auto-track page views
export function initAutoTracking() {
  // Track page view on load
  trackServerEvent({ event: 'page_view' });

  // Track outbound links
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('a');
    if (link && link.href && link.host !== window.location.host) {
      trackServerEvent({
        event: 'outbound_link_click',
        url: link.href
      });
    }
  });

  // Track form submissions
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    if (form) {
      trackServerEvent({
        event: 'form_submit',
        url: window.location.href
      });
    }
  });
}`;
}

async function main() {
  console.log('Generating server-side event tracking...');

  const apiDir = join(process.cwd(), 'src', 'pages', 'api', 'events');
  mkdirSync(apiDir, { recursive: true });

  const libDir = join(process.cwd(), 'src', 'lib');

  // Generate event endpoints
  const providers = ['google-ads', 'meta-capi', 'bing-uet'];

  for (const provider of providers) {
    const endpointCode = generateEventEndpoint(provider);
    const filePath = join(apiDir, `${provider}.ts`);
    writeFileSync(filePath, endpointCode);
    console.log(`Generated ${provider} endpoint: ${filePath}`);
  }

  // Generate tracking utility
  const trackUtilCode = generateTrackUtil();
  const trackPath = join(libDir, 'track.ts');
  writeFileSync(trackPath, trackUtilCode);
  console.log(`Generated tracking utility: ${trackPath}`);

  console.log(`Server-side event tracking setup complete!`);
  console.log(`   Endpoints: ${providers.length} providers`);
  console.log(`   Secret: ${env.EVENTS_ENDPOINT_SECRET}`);
}

// CLI execution
main().catch(console.error);