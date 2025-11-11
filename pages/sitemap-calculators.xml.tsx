// pages/sitemap-calculators.xml.tsx
// Calculator pages sitemap - UPDATED VERSION WITH LASTMOD
// ✅ Added lastmod dates to all calculator pages
// ✅ Optimized priorities for main calculators

import { GetServerSideProps } from 'next';

const SITE_URL = 'https://www.insurancesmartcalculator.com';

const calculatorPages = [
  // Main calculators page
  { path: '/calculators', priority: '0.9', changefreq: 'weekly' },
  
  // Top priority calculators (most popular)
  { path: '/calculators/auto-insurance', priority: '0.9', changefreq: 'monthly' },
  { path: '/calculators/home-insurance', priority: '0.9', changefreq: 'monthly' },
  { path: '/calculators/life-insurance', priority: '0.9', changefreq: 'monthly' },
  { path: '/calculators/health-insurance', priority: '0.9', changefreq: 'monthly' },
  
  // Secondary calculators
  { path: '/calculators/disability-insurance', priority: '0.8', changefreq: 'monthly' },
  { path: '/calculators/pet-insurance', priority: '0.8', changefreq: 'monthly' },
];

function createUrlEntry(
  loc: string,
  lastmod: string,
  priority: string = '0.5',
  changefreq: string = 'weekly'
): string {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  calculatorPages.forEach(page => {
    sitemap += createUrlEntry(
      `${SITE_URL}${page.path}`,
      currentDate,
      page.priority,
      page.changefreq
    );
  });

  sitemap += '\n</urlset>';

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function SitemapCalculators() {
  return null;
}
