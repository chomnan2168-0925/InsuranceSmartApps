// pages/admin0925/media.tsx

import React from 'react';
import MediaLibrary from '@/components/admin/media/MediaLibrary';
import withAuth from '@/components/auth/withAuth';

const MediaPage = () => {
  return (
    <>
      <MediaLibrary />
    </>
  );
};

export default withAuth(MediaPage);
