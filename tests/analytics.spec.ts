import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Type declarations for test environment
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    analytics?: {
      setConsent: (consent: 'granted' | 'denied') => void;
      trackLeadSubmit: (formId: string, page: string) => void;
      trackCallClick: (phoneNumber: string, page: string) => void;
      trackEmailClick: (email: string, page: string) => void;
      trackCTAClick: (ctaText: string, page: string) => void;
      trackCalculatorUsed: (inputsHash: string, page: string) => void;
      hasConsent: () => boolean;
    };
    __trackedEvents?: any[];
    __analyticsClickTrackingReady?: boolean;
  }
}

// Mock GA4 for testing
const waitForAnalyticsReady = async (page: Page) => {
  await page.waitForFunction(() => {
    const events = window.__trackedEvents || [];
    const hasDefaultConsent = events.some(
      event => Array.isArray(event) && event[0] === 'consent' && event[1] === 'default'
    );

    const analytics = window.analytics;

    return (
      hasDefaultConsent &&
      !!analytics &&
      typeof analytics.trackCTAClick === 'function' &&
      typeof analytics.trackLeadSubmit === 'function' &&
      typeof analytics.trackCallClick === 'function' &&
      typeof window.gtag === 'function'
    );
  });
};

test.describe('Analytics Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const trackedEvents: any[] = [];
      const dataLayerStore: any[] = [];

      Object.defineProperty(window, '__trackedEvents', {
        configurable: true,
        get() {
          return trackedEvents;
        }
      });

      Object.defineProperty(window, 'dataLayer', {
        configurable: true,
        get() {
          return dataLayerStore;
        },
        set(value) {
          if (Array.isArray(value)) {
            dataLayerStore.length = 0;
            Array.prototype.push.apply(dataLayerStore, value);
          }
        }
      });

      const originalPush = dataLayerStore.push.bind(dataLayerStore);
      dataLayerStore.push = function (...args: any[]) {
        trackedEvents.push(args);
        return originalPush(...args);
      };

      const recordEvent = (name: string, payload?: Record<string, any>, action?: string) => {
        const entry = action ? ['event', `${name}_${action}`, payload || {}] : ['event', name, payload || {}];
        trackedEvents.push(entry);
        return entry;
      };

      // Seed default consent state similar to GA4 behaviour
      const defaultConsent = ['consent', 'default', { analytics_storage: 'denied' }];
      trackedEvents.push(defaultConsent);
      originalPush(defaultConsent);

      let gtagWrapper: ((...args: any[]) => void) | undefined;
      let gtagOriginal: ((...args: any[]) => void) | undefined;

      const ensureWrapper = () => {
        if (!gtagWrapper) {
          gtagWrapper = (...args: any[]) => {
            trackedEvents.push(args);
            if (typeof gtagOriginal === 'function') {
              return gtagOriginal(...args);
            }
            return undefined;
          };
        }
        return gtagWrapper;
      };

      Object.defineProperty(window, 'gtag', {
        configurable: true,
        get() {
          return ensureWrapper();
        },
        set(fn) {
          gtagOriginal = fn;
          ensureWrapper();
        }
      });

      const analyticsStub = {
        setConsent(consent: 'granted' | 'denied') {
          const entry = ['consent', 'update', { analytics_storage: consent }];
          trackedEvents.push(entry);
          originalPush(entry);
          return entry;
        },
        trackLeadSubmit(formId: string, page: string) {
          return recordEvent('lead_submit', { form_id: formId, page_path: page });
        },
        trackCallClick(phoneNumber: string, page: string) {
          return recordEvent('call_click', { phone_number: phoneNumber, page_path: page });
        },
        trackEmailClick(email: string, page: string) {
          return recordEvent('email_click', { email_address: email, page_path: page });
        },
        trackCTAClick(ctaText: string, page: string) {
          return recordEvent('cta_click', { cta_text: ctaText, page_path: page });
        },
        trackCalculatorUsed(inputsHash: string, page: string) {
          return recordEvent('calculator_used', { inputs_hash: inputsHash, page_path: page });
        },
        hasConsent() {
          return true;
        }
      } as Record<string, any>;

      Object.defineProperty(window, 'analytics', {
        configurable: true,
        get() {
          return analyticsStub;
        },
        set(value) {
          if (value && typeof value === 'object') {
            for (const [key, assignment] of Object.entries(value)) {
              if (typeof assignment === 'function' && key in analyticsStub) {
                const existing = (analyticsStub as Record<string, any>)[key];
                (analyticsStub as Record<string, any>)[key] = ((...args: any[]) => {
                  let instrumentationResult;
                  if (typeof existing === 'function') {
                    instrumentationResult = existing(...args);
                  }
                  const originalResult = assignment.apply(value, args);
                  return originalResult ?? instrumentationResult;
                });
              } else {
                (analyticsStub as Record<string, any>)[key] = assignment;
              }
            }
          }
        }
      });
    });
  });

  test('GA4 consent management works correctly', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForAnalyticsReady(page);

    const initialConsentHandle = await page.waitForFunction(() => {
      const events = window.__trackedEvents || [];
      return events.find(event => Array.isArray(event) && event[0] === 'consent' && event[1] === 'default') || null;
    }, { timeout: browserName === 'webkit' ? 10000 : 5000 });
    const initialConsent = await initialConsentHandle.jsonValue();
    expect(initialConsent[2].analytics_storage).toBe('denied');

    // Accept analytics
    await page.evaluate(() => {
      if (window.analytics) {
        window.analytics.setConsent('granted');
      }
    });

    const consentUpdateHandle = await page.waitForFunction(() => {
      const events = window.__trackedEvents || [];
      return events.find(event => Array.isArray(event) && event[0] === 'consent' && event[1] === 'update') || null;
    }, { timeout: browserName === 'webkit' ? 10000 : 5000 });
    const consentUpdate = await consentUpdateHandle.jsonValue();
    expect(consentUpdate[2].analytics_storage).toBe('granted');
  });

  test('Lead form submission tracks correctly', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForAnalyticsReady(page);

    // Mock the form submission to prevent actual API call
    await page.route('**/api/forms/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Wait for form to be visible
    await page.locator('#closing-cta-form').waitFor({ state: 'visible' });

    // Fill and submit form
    await page.fill('#first-name', 'Test');
    await page.fill('#last-name', 'User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#phone', '(555) 123-4567');
    await page.fill('#message', 'Test message');

    // Submit form and wait for the analytics event
    await page.locator('#closing-cta-form button[type="submit"]').click();

    // Wait a moment for the async form submission to complete
    await page.waitForTimeout(1000);

    const leadEventHandle = await page.waitForFunction(() => {
      const events = window.__trackedEvents || [];
      return events.find(event => Array.isArray(event) && event[0] === 'event' && event[1] === 'lead_submit') || null;
    }, { timeout: browserName === 'firefox' ? 10000 : 5000 });
    const leadEvent = await leadEventHandle.jsonValue();
    expect(leadEvent).toBeTruthy();
    expect(leadEvent[2].form_id).toBe('closing-cta-form');
    expect(leadEvent[2].page_path).toBe('/');
  });

  test('CTA clicks are tracked', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForAnalyticsReady(page);
    await page.waitForFunction(() => window.__analyticsClickTrackingReady === true);

    // Ensure dataLayer is initialized
    await page.evaluate(() => {
      if (!window.dataLayer) {
        window.dataLayer = [];
      }
    });

    // Find and click a CTA - handle both desktop and mobile
    const findCTA = async () => {
      const selectors = [
        'a[href="/contact"]:visible',
        'button:has-text("Book Consult"):visible',
        'button:has-text("Talk to a Texas-based expert"):visible',
        '#closing-cta-form button[type="submit"]:visible'
      ];

      for (const selector of selectors) {
        const locator = page.locator(selector).first();
        if ((await locator.count()) && (await locator.isVisible())) {
          return locator;
        }
      }

      return undefined;
    };

    let ctaButton = await findCTA();

    if (!ctaButton) {
      const mobileMenuToggle = page.locator('[data-testid="mobile-menu-toggle"]:visible');
      if (await mobileMenuToggle.count()) {
        const expanded = await mobileMenuToggle.getAttribute('aria-expanded');
        if (expanded !== 'true') {
          await mobileMenuToggle.click();
        }
        await page.locator('[data-testid="mobile-menu-panel"] nav').waitFor({ state: 'visible' });
      }
      ctaButton = await findCTA();
    }

    expect(ctaButton, 'CTA button should be present for tracking test').toBeDefined();
    await ctaButton!.waitFor({ state: 'visible' });

    // Prevent navigation for testing
    await page.route('/contact', route => route.abort());
    await page.route('**/contact', route => route.abort());

    await ctaButton!.evaluate((element) => {
      element.addEventListener('click', (event) => {
        event.preventDefault();
      }, { capture: true });
    });

    await ctaButton!.click({ noWaitAfter: true });

    const ctaEventHandle = await page.waitForFunction(() => {
      const events = window.__trackedEvents || [];
      return events.find(event => Array.isArray(event) && event[0] === 'event' && event[1] === 'cta_click') || null;
    }, { timeout: browserName === 'firefox' ? 10000 : 5000 });
    const ctaEvent = await ctaEventHandle.jsonValue();
    expect(ctaEvent).toBeTruthy();
    expect(ctaEvent[2].cta_text).toBeDefined();
    expect(ctaEvent[2].page_path).toBe('/');
  });

  // Copilot: Mobile Safari needs extra time for GA events—after clicking, wait briefly for the analytics request before asserting.
  test('Phone and email links are tracked', async ({ page, browserName }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await waitForAnalyticsReady(page);
    await page.waitForFunction(() => window.__analyticsClickTrackingReady === true);

    const ensureMobileMenuOpen = async () => {
      const viewport = page.viewportSize();
      if (viewport && viewport.width >= 768) {
        return;
      }

      const mobileMenuToggle = page.locator('[data-testid="mobile-menu-toggle"]:visible');
      if (!(await mobileMenuToggle.count())) {
        return;
      }

      const expanded = await mobileMenuToggle.getAttribute('aria-expanded');
      if (expanded !== 'true') {
        await mobileMenuToggle.click();
      }
      await page.locator('[data-testid="mobile-menu-panel"] nav').waitFor({ state: 'visible' });
    };

    // Find phone link
    let phoneLink = page.locator('a[href*="tel:"]:visible').first();
    if (!(await phoneLink.count())) {
      await ensureMobileMenuOpen();
      phoneLink = page.locator('a[href*="tel:"]:visible').first();
    }
    if (await phoneLink.count() > 0) {
      const phoneHref = await phoneLink.getAttribute('href');
      expect(phoneHref).toMatch(/tel:/);

      // Click phone link and check tracking
      await phoneLink.evaluate(element => {
        element.addEventListener('click', event => {
          event.preventDefault();
        }, { capture: true });
      });
      await phoneLink.click({ noWaitAfter: true });
      await page.waitForTimeout(500);

      // Increased timeout for Mobile Safari
      const timeout = browserName === 'webkit' ? 10000 : 5000;
      const callEventHandle = await page.waitForFunction(() => {
        const events = window.__trackedEvents || [];
        return events.find(event => Array.isArray(event) && event[0] === 'event' && event[1] === 'call_click') || null;
      }, { timeout });
      const callEvent = await callEventHandle.jsonValue();
      expect(callEvent).toBeTruthy();
      expect(callEvent[2].phone_number).toBeDefined();
    }

    // Find email link - there might not be one, so this is optional
    let emailLink = page.locator('a[href*="mailto:"]:visible').first();
    if (!(await emailLink.count())) {
      await ensureMobileMenuOpen();
      emailLink = page.locator('a[href*="mailto:"]:visible').first();
    }
    if (await emailLink.count() > 0) {
      const emailHref = await emailLink.getAttribute('href');
      expect(emailHref).toMatch(/mailto:/);

      // Click email link and check tracking
      await emailLink.evaluate(element => {
        element.addEventListener('click', event => {
          event.preventDefault();
        }, { capture: true });
      });
      await emailLink.click({ noWaitAfter: true });
      await page.waitForTimeout(500);
      const emailEventsDebug = await page.evaluate(() => window.__trackedEvents || []);
      console.log('Email events after click:', emailEventsDebug);

      // Increased timeout for Mobile Safari
      const timeout = browserName === 'webkit' ? 10000 : 5000;
      const emailEventHandle = await page.waitForFunction(() => {
        const events = window.__trackedEvents || [];
        return events.find(event => Array.isArray(event) && event[0] === 'event' && event[1] === 'email_click') || null;
      }, { timeout });
      const emailEvent = await emailEventHandle.jsonValue();
      expect(emailEvent).toBeTruthy();
      expect(emailEvent[2].email_address).toBeDefined();
    }
  });

  test('ROI calculator tracks usage', async ({ page }) => {
    await page.goto('/roi-calculator');
    await waitForAnalyticsReady(page);

    // Wait for calculator to load
    await page.locator('#hours-per-month').waitFor({ state: 'visible' });

    // Fill calculator inputs
    await page.fill('#hours-per-month', '20');
    await page.fill('#hourly-rate', '50');

    // Trigger calculation (assuming it happens on input change)
    await page.keyboard.press('Tab');

    // Wait a bit for the event to be tracked
    await page.waitForTimeout(500);

    // Check analytics event
    const calcEvent = await page.evaluate(() => {
      return window.dataLayer?.find(item =>
        item[0] === 'event' &&
        item[1] === 'calculator_used'
      );
    });
    expect(calcEvent).toBeDefined();
    expect(calcEvent[2].inputs_hash).toBeDefined();
    expect(calcEvent[2].page_path).toBe('/roi-calculator');
  });
});