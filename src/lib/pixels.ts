// Auto-generated pixel tracking code
// Generated on: 2025-09-24T23:37:18.820Z
// Do not edit manually - run 'npm run pixels:build' to update

// Plausible Analytics
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

// Master tracking function with consent check
export function trackEvent(event: string, params: any = {}) {
  // Check consent
  const consent = localStorage.getItem('cookie-consent');
  if (!consent && true) {
    return; // No consent given
  }

  plausible.track(event, params);
}

// Initialize all pixels
export function initPixels() {
  const consent = localStorage.getItem('cookie-consent');
  if (!consent && true) {
    return; // No consent given
  }

}

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
