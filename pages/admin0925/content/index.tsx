import React from 'react';
// We no longer need to import AdminLayout here
import ContentList from '@/components/admin/content/ContentList';

const ContentListPage = () => {
  // The page now ONLY returns its direct content.
  // The AdminLayout is now provided by the _app.tsx file.
  return <ContentList />;
};

export default ContentListPage;