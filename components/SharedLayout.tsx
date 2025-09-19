// FIX: Replaced placeholder content with a complete, functional SharedLayout component.
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Header from './layout/Header';
import Footer from './layout/Footer';
import AdBanner from './layout/AdBanner';
import Breadcrumb, { Crumb } from './layout/Breadcrumb';
import SEO from './layout/SEO';

interface SharedLayoutProps {
  children: React.ReactNode;
  hideAds?: boolean;
}

const SharedLayout: React.FC<SharedLayoutProps> = ({ children, hideAds = false }) => {
  const router = useRouter();

  const breadcrumbCrumbs = useMemo(() => {
    const pathParts = router.asPath.split('?')[0].split('/').filter(part => part);
    
    // Don't show breadcrumbs on the homepage
    if (router.pathname === '/') {
      return [];
    }

    const crumbs: Crumb[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    pathParts.forEach(part => {
        currentPath += `/${part}`;
        // Format the label, e.g., 'financial-tips' -> 'Financial Tips'
        const label = part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        crumbs.push({ label, href: currentPath });
    });

    return crumbs;
  }, [router.asPath, router.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SEO />
      <Header />
      {!hideAds && <AdBanner position="top" />}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb crumbs={breadcrumbCrumbs} />
        <div className={breadcrumbCrumbs.length > 0 ? 'mt-6' : ''}>
          {children}
        </div>
      </main>
      {!hideAds && <AdBanner position="bottom" />}
      <Footer />
    </div>
  );
};

export default SharedLayout;
