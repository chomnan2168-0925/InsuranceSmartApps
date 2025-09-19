
import React from 'react';
import { useRouter } from 'next/router';
import withAuth from '@/components/auth/withAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/components/admin/Dashboard';
import ContentList from '@/components/admin/content/ContentList';
import EditArticle from '@/components/admin/content/EditArticle';
import MediaLibrary from '@/components/admin/media/MediaLibrary';
import UserManagement from '@/components/admin/users/UserManagement';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';
import SeoHub from '@/components/admin/seo/SeoHub';
import SettingsPage from '@/components/admin/settings/SettingsPage';


const AdminPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const renderContent = () => {
    // slug is an array of path parts
    const page = slug?.[0] || 'dashboard';
    const subpage = slug?.[1];

    switch (page) {
      case 'dashboard':
        return <Dashboard />;
      case 'content':
        if (subpage === 'new') {
            return <EditArticle />;
        }
        if (subpage) {
            return <EditArticle articleId={subpage} />;
        }
        return <ContentList />;
      case 'media':
        return <MediaLibrary />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
       case 'seo':
        return <SeoHub />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />; // Default to dashboard
    }
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
};

export default withAuth(AdminPage);
