import { GetStaticPaths, GetStaticProps } from 'next';
import StaticPageTemplate from '@/components/layout/StaticPageTemplate';
import StaticPageData from '@/data/StaticPageData.json'; 
import SharedLayout from '@/components/SharedLayout';
import { NextPageWithLayout } from './_app';
import SEO from '@/components/layout/SEO';

interface StaticPageProps {
  page: {
    title: string;
    tagline: string;
    content: string;
    seoTitle: string;
    seoDescription: string;
  } | null;
}

const GenericStaticPage: NextPageWithLayout<StaticPageProps> = ({ page }) => {
  if (!page) {
    return <div>Page not found.</div>;
  }
  
  return (
    <>
      <SEO title={page.seoTitle} description={page.seoDescription} />
      <StaticPageTemplate title={page.title} tagline={page.tagline} content={page.content} />
    </>
  );
};

GenericStaticPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SharedLayout>
      {page}
    </SharedLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // List of slugs that have dedicated page files and should NOT be handled by [slug].tsx
  const excludedSlugs = [
    'advertise',      // Has /pages/advertise.tsx with form + chart
    'ask-an-expert',  // Has /pages/ask-an-expert.tsx with contact form
    // Add other dedicated pages here if needed:
    // 'contact',
    // 'special-landing-page',
  ];

  const allSlugs = Object.keys(StaticPageData);
  
  // Filter out slugs that have their own dedicated page files
  const paths = allSlugs
    .filter(slug => !excludedSlugs.includes(slug))
    .map(slug => ({
      params: { slug },
    }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params!;
  const pageData = (StaticPageData as any)[slug as string] || null;

  if (!pageData) {
    return { notFound: true };
  }

  return {
    props: {
      page: pageData,
    },
  };
};

export default GenericStaticPage;