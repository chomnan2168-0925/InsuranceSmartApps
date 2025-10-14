const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// IMPORTANT: You MUST update this to your real domain before you go live.
const SITE_URL = 'https://www.insurancesmartcalculator.com';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in environment variables');
  console.error('   Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  console.error('');
  console.error('   Current values:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || 'NOT SET');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'SET (hidden)' : 'NOT SET');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Static pages that should be in the sitemap
const staticPages = {
  'about': true,
  'contact': true,
  'calculators/life-insurance': true,
  'calculators/health-insurance': true,
  'calculators/auto-insurance': true,
  'calculators/home-insurance': true,
  'privacy-policy': true,
  'terms-of-service': true,
};

async function generateSitemap() {
  try {
    console.log('🚀 Starting sitemap generation...');

    // Start building sitemap XML
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/calculators</loc><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/insurance-tips</loc><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/newsroom</loc><priority>0.8</priority></url>
`;

    // Add static pages
    Object.keys(staticPages).forEach(slug => {
      sitemapXml += `  <url><loc>${SITE_URL}/${slug}</loc><priority>0.7</priority></url>\n`;
    });
    console.log(`✅ Added ${Object.keys(staticPages).length} static pages.`);

    // Fetch all published articles from Supabase
    console.log('📡 Fetching articles from Supabase...');
    const { data: articles, error } = await supabase
      .from('articles')
      .select('slug, category, tags, created_at, published_date, last_updated')
      .eq('status', 'Published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching articles from Supabase:', error);
      process.exit(1);
    }

    if (!articles || articles.length === 0) {
      console.warn('⚠️  Warning: No published articles found in Supabase');
    } else {
      console.log(`📰 Found ${articles.length} published articles`);
    }

    // === START OF TAG ENHANCEMENT ===
    // 1. Get all unique tags from all articles
    const allTags = articles.reduce((acc, article) => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach(tag => { 
          if (!acc.includes(tag)) acc.push(tag); 
        });
      }
      return acc;
    }, []);

    // 2. Add each tag page to the sitemap
    allTags.forEach(tag => {
      const slug = tag.toLowerCase().replace(/\s+/g, '-');
      sitemapXml += `  <url><loc>${SITE_URL}/tags/${slug}</loc><priority>0.6</priority></url>\n`;
    });
    console.log(`✅ Added ${allTags.length} tag pages.`);
    // === END OF TAG ENHANCEMENT ===

    // Add article pages
    articles.forEach(article => {
      const categoryPath = article.category === 'Insurance Tips' ? 'insurance-tips' : 'newsroom';
      
      // Use the most recent date available for lastmod
      const lastmod = article.last_updated || article.published_date || article.created_at;
      const formattedDate = new Date(lastmod).toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      sitemapXml += `  <url><loc>${SITE_URL}/${categoryPath}/${article.slug}</loc><lastmod>${formattedDate}</lastmod><priority>0.9</priority></url>\n`;
    });
    console.log(`✅ Added ${articles.length} articles.`);

    // Close the XML
    sitemapXml += `</urlset>`;

    // Write to file
    const sitemapPath = path.resolve('./public/sitemap.xml');
    
    // Ensure public directory exists
    const publicDir = path.resolve('./public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      console.log('📁 Created public directory');
    }

    fs.writeFileSync(sitemapPath, sitemapXml);
    
    // Summary
    const totalUrls = 4 + Object.keys(staticPages).length + allTags.length + articles.length;
    console.log('');
    console.log('🎉 Sitemap generated successfully!');
    console.log(`📍 Location: ${sitemapPath}`);
    console.log(`📊 Total URLs: ${totalUrls}`);
    console.log(`   - Main pages: 4`);
    console.log(`   - Static pages: ${Object.keys(staticPages).length}`);
    console.log(`   - Tag pages: ${allTags.length}`);
    console.log(`   - Article pages: ${articles.length}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the generator
generateSitemap();