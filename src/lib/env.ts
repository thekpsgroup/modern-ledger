import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
config();

const envSchema = z.object({
  SITE_URL: z.string().url(),
  COMPANY_PHONE: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  COMPANY_EMAIL: z.string().email(),
  ANALYTICS_PROVIDER: z.enum(['plausible', 'umami', 'none']).default('none'),
  PLAUSIBLE_DOMAIN: z.string().optional(),
  PLAUSIBLE_API_URL: z.string().url().optional(),
  UMAMI_WEBSITE_ID: z.string().optional(),
  UMAMI_API_URL: z.string().url().optional(),
  COOKIE_CONSENT: z.coerce.boolean().default(true),
  ADS_GOOGLE_ID: z.string().optional(),
  ADS_META_PIXEL_ID: z.string().optional(),
  ADS_BING_UET_TAG: z.string().optional(),
  EVENTS_SSR_ENABLED: z.coerce.boolean().default(true),
  EVENTS_ENDPOINT_SECRET: z.string().min(10),
  AB_FLAGS_PATH: z.string().default('./src/data/ab-flags.json'),
  CITY_DATA_PATH: z.string().default('./src/data/cities.yaml'),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

export function getEnv(): Env {
  if (!env) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      console.error('❌ Invalid environment variables:', parsed.error.format());
      process.exit(1);
    }
    env = parsed.data;
  }
  return env;
}

export default getEnv;