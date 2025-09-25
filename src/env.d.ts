/// <reference path="../.astro/types.d.ts" />

declare global {
  interface Window {
    abTests?: any;
    abTrackEvent?: (eventName: string, properties?: Record<string, any>) => void;
    abTrackGoal?: (goalId: string, value?: number) => void;
    abGetVariant?: (testId: string) => any;
    abIsVariant?: (testId: string, variantId: string) => boolean;
    abForceVariant?: (testId: string, variantId: string) => void;
    abTrackRevenue?: (amount: number, currency?: string, orderId?: string) => void;
    abConfigs?: Record<string, any>;
    scroll25Tracked?: boolean;
    scroll50Tracked?: boolean;
    scroll75Tracked?: boolean;
    time30Tracked?: boolean;
    time60Tracked?: boolean;
    time180Tracked?: boolean;
    scrollTracked25?: boolean;
    scrollTracked50?: boolean;
    scrollTracked75?: boolean;
    scrollToSection?: (sectionId: string) => void;
  }
}

export {};