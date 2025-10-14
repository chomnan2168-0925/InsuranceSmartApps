// pages/admin0925/content/[slug].tsx

import React from 'react';
import { useRouter } from 'next/router';
import EditArticle from '@/components/admin/content/EditArticle';

const EditArticlePage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Render a loading state while the router is hydrating
  if (!router.isReady) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  return (
    <>
      {/* Ensure slug is a string before passing it */}
      <EditArticle articleId={typeof slug === 'string' ? slug : ''} />
    </>
  );
};

export default EditArticlePage;