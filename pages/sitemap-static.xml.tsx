// pages/sitemap-static.xml.tsx
// Static pages sitemap - ENHANCED VERSION
// Includes all main category pages and utility pages

import { GetServerSideProps } from 'next';

const SITE_URL = 'https://www.insurancesmartcalculator.com';

const staticPages = [
  // Homepage - Highest priority
  { path: '/', priority: '1.0', changefreq: 'daily' },
  
  // Main category landing pages - Very high priority
  { path: '/calculators', priority: '0.9', changefreq: 'weekly' },
  { path: '/insurance-tips', priority: '0.9', changefreq: 'daily' },
  { path: '/newsroom', priority: '0.9', changefreq: 'daily' },
  
  // Important utility pages
  { path: '/ask-an-expert', priority: '0.8', changefreq: 'weekly' },
  { path: '/sitemap', priority: '0.6', changefreq: 'monthly' },
  
  // About/Contact pages
  { path: '/about-us', priority: '0.7', changefreq: 'monthly' },
  { path: '/advertise', priority: '0.6', changefreq: 'monthly' },
  
  // Legal pages - Lower priority, rarely change
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms-of-use', priority: '0.5', changefreq: 'yearly' },
  { path: '/cookie-policy', priority: '0.5', changefreq: 'yearly' },
];

function createUrlEntry(
  loc: string,
  priority: string = '0.5',
  changefreq: string = 'weekly'
): string {
  return `
  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  staticPages.forEach(page => {
    sitemap += createUrlEntry(
      `${SITE_URL}${page.path}`,
      page.priority,
      page.changefreq
    );
  });

  sitemap += '\n</urlset>';

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  // Cache for 24 hours (static pages don't change often)
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function SitemapStatic() {
  return null;
}