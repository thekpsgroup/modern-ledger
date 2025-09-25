#!/usr/bin/env ts-node

import { writeFileSync } from 'fs';
import { join } from 'path';
import { getEnv } from '../src/lib/env';

const env = getEnv();

function generatePixelsCode(): string {
  let code = `// Auto-generated pixel tracking code
// Generated on: ${new Date().toISOString()}
// Do not edit manually - run 'npm run pixels:build' to update

`;

  // Google Analytics
  if (env.ADS_GOOGLE_ID) {
    code += `// Google Analytics
export const googleAnalytics = {
  init: () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', '${env.ADS_GOOGLE_ID}');
    }
  },
  track: (event: string, params: any = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, params);
    }
  }
};

`;
  }

  // Meta Pixel
  if (env.ADS_META_PIXEL_ID) {
    code += `// Meta Pixel
export const metaPixel = {
  init: () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('init', '${env.ADS_META_PIXEL_ID}');
    }
  },
  track: (event: string, params: any = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', event, params);
    }
  }
};

`;
  }

  // Bing UET
  if (env.ADS_BING_UET_TAG) {
    code += `// Bing UET
export const bingUET = {
  init: () => {
    if (typeof window !== 'undefined' && window.uetq) {
      window.uetq = window.uetq || [];
    }
  },
  track: (event: string, params: any = {}) => {
    if (typeof window !== 'undefined' && window.uetq) {
      window.uetq.push({ event, ...params });
    }
  }
};

`;
  }

  // Plausible Analytics
  if (env.ANALYTICS_PROVIDER === 'plausible') {
    code += `// Plausible Analytics
export const plausible = {
  init: () => {
    // Plausible is loaded via script tag
  },
  track: (event: string, props: any = {}) => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(event, { props });
    }
  }
};

`;
  }

  // Umami Analytics
  if (env.ANALYTICS_PROVIDER === 'umami') {
    code += `// Umami Analytics
export const umami = {
  init: () => {
    // Umami is loaded via script tag
  },
  track: (event: string, props: any = {}) => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(event, props);
    }
  }
};

`;
  }

  // Master tracking function
  code += `// Master tracking function with consent check
export function trackEvent(event: string, params: any = {}) {
  // Check consent
  const consent = localStorage.getItem('cookie-consent');
  if (!consent && ${env.COOKIE_CONSENT}) {
    return; // No consent given
  }

`;

  if (env.ADS_GOOGLE_ID) {
    code += `  googleAnalytics.track(event, params);
`;
  }

  if (env.ADS_META_PIXEL_ID) {
    code += `  metaPixel.track(event, params);
`;
  }

  if (env.ADS_BING_UET_TAG) {
    code += `  bingUET.track(event, params);
`;
  }

  if (env.ANALYTICS_PROVIDER === 'plausible') {
    code += `  plausible.track(event, params);
`;
  }

  if (env.ANALYTICS_PROVIDER === 'umami') {
    code += `  umami.track(event, params);
`;
  }

  code += `}

// Initialize all pixels
export function initPixels() {
  const consent = localStorage.getItem('cookie-consent');
  if (!consent && ${env.COOKIE_CONSENT}) {
    return; // No consent given
  }

`;

  if (env.ADS_GOOGLE_ID) {
    code += `  googleAnalytics.init();
`;
  }

  if (env.ADS_META_PIXEL_ID) {
    code += `  metaPixel.init();
`;
  }

  if (env.ADS_BING_UET_TAG) {
    code += `  bingUET.init();
`;
  }

  code += `}

// Type definitions for global objects
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    uetq?: any[];
    plausible?: (event: string, options?: any) => void;
    umami?: { track: (event: string, props?: any) => void };
  }
}
`;

  return code;
}

function generatePixelScripts(): string {
  let scripts = '';

  // Google Analytics
  if (env.ADS_GOOGLE_ID) {
    scripts += `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${env.ADS_GOOGLE_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
</script>
`;
  }

  // Meta Pixel
  if (env.ADS_META_PIXEL_ID) {
    scripts += `<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
</script>
`;
  }

  // Bing UET
  if (env.ADS_BING_UET_TAG) {
    scripts += `<!-- Bing UET -->
<script>
  (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"${env.ADS_BING_UET_TAG}"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");
</script>
`;
  }

  // Plausible
  if (env.ANALYTICS_PROVIDER === 'plausible' && env.PLAUSIBLE_DOMAIN) {
    scripts += `<!-- Plausible Analytics -->
<script defer data-domain="${env.PLAUSIBLE_DOMAIN}" src="https://plausible.io/js/script.js"></script>
`;
  }

  // Umami
  if (env.ANALYTICS_PROVIDER === 'umami' && env.UMAMI_WEBSITE_ID) {
    scripts += `<!-- Umami Analytics -->
<script async defer data-website-id="${env.UMAMI_WEBSITE_ID}" src="${env.UMAMI_API_URL || 'https://umami.example.com'}/script.js"></script>
`;
  }

  return scripts;
}

async function main() {
  console.log('📊 Building pixel tracking code...');

  const pixelsCode = generatePixelsCode();
  const pixelScripts = generatePixelScripts();

  // Write pixels library
  const libPath = join(process.cwd(), 'src', 'lib', 'pixels.ts');
  writeFileSync(libPath, pixelsCode);

  // Write pixel scripts (to be included in layout)
  const scriptsPath = join(process.cwd(), 'src', 'lib', 'pixel-scripts.html');
  writeFileSync(scriptsPath, pixelScripts);

  console.log('✅ Generated pixel tracking code');
  console.log(`   Library: ${libPath}`);
  console.log(`   Scripts: ${scriptsPath}`);

  const enabledPixels = [];
  if (env.ADS_GOOGLE_ID) enabledPixels.push('Google Analytics');
  if (env.ADS_META_PIXEL_ID) enabledPixels.push('Meta Pixel');
  if (env.ADS_BING_UET_TAG) enabledPixels.push('Bing UET');
  if (env.ANALYTICS_PROVIDER === 'plausible') enabledPixels.push('Plausible');
  if (env.ANALYTICS_PROVIDER === 'umami') enabledPixels.push('Umami');

  console.log(`   Enabled: ${enabledPixels.join(', ') || 'None'}`);
}

// CLI execution
main().catch(console.error);