#!/usr/bin/env ts-node

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';
import { getEnv } from '../src/lib/env';

interface City {
  slug: string;
  name: string;
  landmarks: string[];
  notes: string;
}

const env = getEnv();

function loadCities(): City[] {
  const citiesPath = env.CITY_DATA_PATH;
  const content = readFileSync(citiesPath, 'utf-8');
  return load(content) as City[];
}

function generateCityPage(city: City): string {
  const landmarksText = city.landmarks.length > 0
    ? `near ${city.landmarks.slice(0, 2).join(' and ')}`
    : 'in the area';

  return `---
import Layout from '../../layouts/Layout.astro';
import Header from '../../components/Header.astro';
import Hero from '../../components/Hero.astro';
import TestimonialCarousel from '../../components/TestimonialCarousel.astro';
import ServicesGrid from '../../components/ServicesGrid.astro';
import CTASection from '../../components/CTASection.astro';
import FAQAccordion from '../../components/FAQAccordion.astro';
import Footer from '../../components/Footer.astro';
import { TESTIMONIALS } from '../../data/testimonials';

// Filter testimonials for ${city.name} and surrounding areas
const localTestimonials = TESTIMONIALS.filter(testimonial =>
  testimonial.city?.toLowerCase().includes('${city.name.toLowerCase().split(',')[0]}') ||
  testimonial.city?.toLowerCase().includes('rockwall') ||
  testimonial.city?.toLowerCase().includes('royse city') ||
  testimonial.city?.toLowerCase().includes('fate')
);

const pageTitle = "Bookkeeping Services in ${city.name} | Modern Ledger";
const pageDescription = "Professional bookkeeping services in ${city.name}. Serving small businesses ${landmarksText}. QuickBooks experts with 5-star Google reviews.";
const pageUrl = "${env.SITE_URL}/locations/${city.slug}";

---

<Layout
  title={pageTitle}
  description={pageDescription}
  url={pageUrl}
  image="/images/${city.slug}-bookkeeping.jpg"
  type="website"
>
  <Header />
  <Hero
    title="Professional Bookkeeping Services in ${city.name}"
    subtitle="Expert QuickBooks bookkeeping for small businesses in ${city.name} and surrounding areas. Join 50+ local businesses saving time and money."
    ctaText="Get Free Consultation"
    ctaLink="#contact"
    backgroundImage="/images/${city.slug}-hero.jpg"
  />

  <!-- Local Testimonials Section -->
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Trusted by ${city.name} Businesses
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          See what local business owners in ${city.name} and surrounding areas say about our bookkeeping services.
        </p>
      </div>
      <TestimonialCarousel testimonials={localTestimonials.length > 0 ? localTestimonials : TESTIMONIALS.slice(0, 3)} />
    </div>
  </section>

  <!-- Local Services Section -->
  <ServicesGrid />

  <!-- Local Pricing Section -->
  <CTASection />

  <!-- Location Map Section -->
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Serving ${city.name} & Surrounding Areas
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          We provide professional bookkeeping services throughout Northeast Texas, including ${city.name}${city.notes ? ` (${city.notes})` : ''}.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <!-- Service Areas -->
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-6">Service Areas</h3>
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              ${city.name}
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Rockwall, TX
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Royse City, TX
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Fate, TX
            </li>
          </ul>
        </div>

        <!-- Google Maps Embed -->
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-6">Find Us</h3>
          <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.123456789012!2d-96.29876543210987!3d32.9750987654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c2b2b2b2b2b%3A0x1234567890abcdef!2s${encodeURIComponent(city.name)}!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Modern Ledger Bookkeeping - ${city.name} Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Local FAQ Section -->
  <FAQAccordion />

  <!-- Contact Section -->
  <section id="contact" class="py-16 bg-primary-600 text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">
        Ready to Get Your Books in Order?
      </h2>
      <p class="text-xl mb-8 max-w-2xl mx-auto">
        Contact us today for a free consultation and see how we can help your ${city.name} business save time and money.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="tel:+1${env.COMPANY_PHONE}"
          class="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
          </svg>
          Call (${env.COMPANY_PHONE.slice(0,3)}) ${env.COMPANY_PHONE.slice(3,6)}-${env.COMPANY_PHONE.slice(6)}
        </a>
        <a
          href="mailto:${env.COMPANY_EMAIL}"
          class="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
          </svg>
          Email Us
        </a>
      </div>
    </div>
  </section>

  <Footer />
</Layout>`;
}

async function main() {
  console.log('Generating city pages...');

  const cities = loadCities();
  const locationsDir = join(process.cwd(), 'src', 'pages', 'locations');

  // Ensure locations directory exists
  mkdirSync(locationsDir, { recursive: true });

  for (const city of cities) {
    const pagePath = join(locationsDir, `${city.slug}.astro`);
    const pageContent = generateCityPage(city);

    writeFileSync(pagePath, pageContent);
    console.log(`Generated ${city.name} page: ${pagePath}`);
  }

  console.log(`Generated ${cities.length} city pages successfully!`);
}

// CLI execution
main().catch(console.error);