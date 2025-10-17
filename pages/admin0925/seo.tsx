// pages/admin0925/seo.tsx

import React from 'react';

// THIS IS THE CORRECTED IMPORT PATH
import SeoHub from '@/components/admin/seo/SeoHub';
import withAuth from '@/components/auth/withAuth';

const SeoPage = () => {
  return (
    <>
      <SeoHub />
    </>
  );
};

export default withAuth(SeoPage);
