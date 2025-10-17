import React from 'react';
import FeaturedContentManager from '@/components/admin/featured/FeaturedContentManager';
import withAuth from '@/components/auth/withAuth';

const FeaturedContentPage = () => {
  return (
    <>
      <FeaturedContentManager />
    </>
  );
};

export default withAuth(FeaturedContentPage);
