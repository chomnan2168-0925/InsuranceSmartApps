const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function diagnoseArticles() {
  console.log('🔍 Diagnosing Article Issues...\n');

  // Check database connection
  console.log('1. Testing database connection...');
  const { data: testData, error: testError } = await supabase
    .from('articles')
    .select('id')
    .limit(1);
  
  if (testError) {
    console.error('❌ Database connection failed:', testError.message);
    return;
  }
  console.log('✅ Database connected\n');

  // Check for problematic article
  console.log('2. Checking problematic article...');
  const { data: article, error: articleError } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', '8-smart-ways-ai-is-transforming-the-future-of-insurance')
    .single();
  
  if (articleError) {
    console.error('❌ Article not found:', articleError.message);
  } else {
    console.log('✅ Article found:', article.title);
    console.log('   Category:', article.category);
    console.log('   Status:', article.status);
    console.log('   Created:', article.created_at);
  }
  console.log('');

  // Check table schema
  console.log('3. Checking table schema...');
  const { data: columns } = await supabase
    .rpc('get_table_columns', { table_name: 'articles' });
  
  console.log('Available columns:', columns || 'Unable to fetch');
  console.log('');

  // Check all articles
  console.log('4. Checking all articles...');
  const { data: allArticles, count } = await supabase
    .from('articles')
    .select('slug, category, status', { count: 'exact' });
  
  console.log(`   Total articles: ${count}`);
  console.log(`   Published: ${allArticles?.filter(a => a.status === 'Published').length}`);
  console.log('');

  // Check for duplicate slugs
  console.log('5. Checking for duplicate slugs...');
  const slugs = allArticles?.map(a => a.slug) || [];
  const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  
  if (duplicates.length > 0) {
    console.log('⚠️  Duplicate slugs found:', duplicates);
  } else {
    console.log('✅ No duplicate slugs');
  }
  console.log('');

  console.log('✨ Diagnosis complete!');
}

diagnoseArticles();