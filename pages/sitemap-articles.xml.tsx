// pages/sitemap-articles.xml.tsx
// Articles sitemap (Insurance Tips + Newsroom)
// Dynamically fetches from Supabase

import { GetServerSideProps } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SITE_URL = 'https://www.insurancesmartcalculator.com';

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function getPriorityForArticle(publishedDate: string, createdDate: string): string {
  const publishDate = new Date(publishedDate || createdDate);
  const daysSincePublish = Math.floor((Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSincePublish <= 7) return '1.0';
  if (daysSincePublish <= 30) return '0.9';
  if (daysSincePublish <= 180) return '0.8';
  return '0.7';
}

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
  try {
    // Add category index pages first
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

    // Add category landing pages
    sitemap += createUrlEntry(
      `${SITE_URL}/insurance-tips`,
      new Date().toISOString().split('T')[0],
      '0.9',
      'daily'
    );
    sitemap += createUrlEntry(
      `${SITE_URL}/newsroom`,
      new Date().toISOString().split('T')[0],
      '0.9',
      'daily'
    );

    // Fetch all published articles
    const { data: articles, error } = await supabase
      .from('articles')
      .select('slug, category, created_at, published_date, last_updated')
      .eq('status', 'Published')
      .order('published_date', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }

    const publishedArticles = articles || [];

    // Add individual article pages
    publishedArticles.forEach(article => {
      const categoryPath = article.category === 'Insurance Tips'
        ? 'insurance-tips'
        : 'newsroom';

      const lastmod = article.last_updated || article.published_date || article.created_at;
      const formattedDate = formatDate(lastmod);
      const priority = getPriorityForArticle(article.published_date, article.created_at);

      sitemap += createUrlEntry(
        `${SITE_URL}/${categoryPath}/${article.slug}`,
        formattedDate,
        priority,
        'weekly'
      );
    });

    sitemap += '\n</urlset>';

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('Error generating articles sitemap:', error);

    // Fallback sitemap with just category pages
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/insurance-tips</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/newsroom</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
    res.write(fallbackSitemap);
    res.end();

    return { props: {} };
  }
};

export default function SitemapArticles() {
  return null;
}