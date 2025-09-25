/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#002B54',
          navyLight: '#274872',
          navyDark: '#001833',
          gold: '#CAB068',
          goldDark: '#A68E45',
          sky: '#E6EEF7',
          slate: '#2E4057',
        },
        neutral: {
          25: '#F8FAFC',
          50: '#F1F5F9',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#0F172A',
          900: '#020617',
        },
        success: {
          50: '#F0F9EC',
          500: '#1B9D4F',
          600: '#15803D',
        },
        warning: {
          50: '#FFF7E6',
          500: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          50: '#FEF2F2',
          500: '#DC2626',
          600: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading-1': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'heading-2': ['3rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'heading-3': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'heading-4': ['1.875rem', { lineHeight: '1.15' }],
        'heading-5': ['1.5rem', { lineHeight: '1.2' }],
        'heading-6': ['1.25rem', { lineHeight: '1.3' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.6' }],
      },
      spacing: {
        section: '5rem',
        'section-sm': '3.5rem',
        gutter: '1.5rem',
      },
      borderRadius: {
        button: '0.75rem',
        surface: '1.25rem',
      },
      boxShadow: {
        card: '0 24px 60px -32px rgba(0, 43, 84, 0.25)',
        elevation: '0 16px 40px -24px rgba(0, 43, 84, 0.3)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
          sm: '1.5rem',
          lg: '2.5rem',
          xl: '3rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },
      },
      maxWidth: {
        'content-sm': '36rem',
        'content-md': '48rem',
        'content-lg': '64rem',
        'content-xl': '72rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};