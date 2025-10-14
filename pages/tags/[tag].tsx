import { GetStaticPaths, GetStaticProps } from 'next';
import { Article } from '@/types';
// --- REMOVED: No longer using local sample data ---
// import sampleArticles from '@/data/sampleArticles.json'; 
import { supabase } from '@/lib/supabaseClient'; // --- ADDED: Import the Supabase client ---
import CategoryPageTemplate from '@/components/templates/CategoryPageTemplate';

interface TagPageProps {
  posts: Article[];
  tag: string;
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
}

// The component that displays the page is unchanged.
const TagPage: React.FC<TagPageProps> = (props) => {
  // We need to format the tag from a slug (e.g., "tax-savings") to a readable title (e.g., "Tax Savings")
  const properCaseTag = props.tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <CategoryPageTemplate
      categoryName={`Articles Tagged: "${properCaseTag}"`}
      categoryDescription={`Browse all articles related to ${properCaseTag}.`}
      posts={props.posts}
      currentPage={1}
      totalPages={1}
      sidebarTopTips={props.sidebarTopTips}
      sidebarTopNews={props.sidebarTopNews}
    />
  );
};

// --- THIS FUNCTION IS NOW POWERED BY SUPABASE ---
export const getStaticPaths: GetStaticPaths = async () => {
  // 1. Fetch all published articles from Supabase, but only the 'tags' column for efficiency.
  const { data: articles, error } = await supabase
    .from('articles')
    .select('tags')
    .eq('status', 'Published');

  if (error || !articles) {
    console.error("Error fetching tags for static paths:", error);
    return { paths: [], fallback: 'blocking' };
  }

  // 2. Create a Set to automatically store only unique tag names.
  const tagSet = new Set<string>();
  articles.forEach(article => {
    if (article.tags) {
      article.tags.forEach((tag: string) => tagSet.add(tag));
    }
  });

  // 3. Convert the Set of tags into the path format Next.js expects.
  const paths = Array.from(tagSet).map(tag => ({
    params: { tag: tag.toLowerCase().replace(/\s+/g, '-') },
  }));

  return { 
    paths, 
    fallback: 'blocking' // 'blocking' allows Next.js to build new tag pages if you add a new tag after deployment
  };
};

// --- THIS FUNCTION IS NOW POWERED BY SUPABASE ---
export const getStaticProps: GetStaticProps = async (context) => {
  const { tag: tagSlug } = context.params!;
  
  // 1. Fetch all published articles from Supabase.
  const { data: allArticles, error: articlesError } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'Published')
    .order('created_at', { ascending: false });

  if (articlesError || !allArticles) {
    return { notFound: true };
  }
  
  // 2. Filter the articles in code to find the ones that match the current tag slug.
  // This is more robust than trying to query the JSONB column directly for a partial match.
  const posts = allArticles.filter(article => 
    article.tags && article.tags.some((t: string) => t.toLowerCase().replace(/\s+/g, '-') === tagSlug)
  );
  
  // 3. Get sidebar data from the same list of all articles for efficiency.
  const sidebarTopTips = allArticles.filter(a => a.category === 'Insurance Tips').slice(0, 3);
  const sidebarTopNews = allArticles.filter(a => a.category === 'Insurance Newsroom').slice(0, 3);

  return {
    props: {
      posts,
      tag: tagSlug as string,
      sidebarTopTips,
      sidebarTopNews,
    },
    // Re-generate this page in the background every 10 minutes to catch new articles.
    revalidate: 600, 
  };
};

export default TagPage;