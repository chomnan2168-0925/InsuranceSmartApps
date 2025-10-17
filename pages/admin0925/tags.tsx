import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import TagManager from '@/components/admin/seo/TagManager';
import withAuth from '@/components/auth/withAuth';

const TagsManagementPage = () => {
  return (
    <>
      <SectionHeader title="Tag Audit & Management" subtitle="A central place to manage all content tags." />
      <div className="mt-6">
        <TagManager />
      </div>
    </>
  );
};

export default withAuth (TagsManagementPage);
