// pages/sitemap-tags.xml.tsx
// Tag pages sitemap (dynamically generated from article tags)

import { GetServerSideProps } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SITE_URL = 'https://www.insurancesmartcalculator.com';

function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function createUrlEntry(
  loc: string,
  priority: string = '0.6',
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
  try {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Fetch all published articles to extract tags
    const { data: articles, error } = await supabase
      .from('articles')
      .select('tags')
      .eq('status', 'Published');

    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }

    // Extract unique tags
    const uniqueTags = new Set<string>();
    const processedSlugs = new Set<string>();

    (articles || []).forEach(article => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach((tag: string) => {
          if (tag && tag.trim()) {
            uniqueTags.add(tag.trim());
          }
        });
      }
    });

    // Sort tags alphabetically and create sitemap entries
    const sortedTags = Array.from(uniqueTags).sort();

    sortedTags.forEach(tag => {
      const slug = sanitizeSlug(tag);
      
      // Prevent duplicate slugs (e.g., "Insurance Tips" and "insurance-tips")
      if (slug && !processedSlugs.has(slug)) {
        processedSlugs.add(slug);
        sitemap += createUrlEntry(
          `${SITE_URL}/tags/${slug}`,
          '0.6',
          'weekly'
        );
      }
    });

    sitemap += '\n</urlset>';

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('Error generating tags sitemap:', error);

    // Empty fallback sitemap
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
    res.write(fallbackSitemap);
    res.end();

    return { props: {} };
  }
};

export default function SitemapTags() {
  return null;
}