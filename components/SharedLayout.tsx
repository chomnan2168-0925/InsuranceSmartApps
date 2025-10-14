import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from './layout/Header';
import Footer from './layout/Footer';
import AdBanner from './layout/AdBanner';
import SEO from './layout/SEO';
// NEW: Import the new client-only breadcrumb component
import ClientOnlyBreadcrumb from './layout/ClientOnlyBreadcrumb';
// We NO LONGER need the old Breadcrumb component here

interface SharedLayoutProps {
  children: React.ReactNode;
}

const SharedLayout: React.FC<SharedLayoutProps> = ({ children }) => {
  const router = useRouter();

  const isAnAdminPage = 
    router.pathname.startsWith('/admin0925') || 
    router.pathname.startsWith('/dev-admin0925');

  // We have moved all the useMemo logic for breadcrumbs into the new component.
  // This layout is now much simpler.

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lora:wght@700&display=swap" rel="stylesheet" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        
        {/* ✅ UPDATED: Static ad that becomes sticky on scroll */}
        {!isAnAdminPage && <AdBanner position="top" stickyOnScroll={true} />}
        
        <main className="flex-grow container mx-auto px-2 pb-2 max-w-7xl">
          
          {/* THE FIX: We now render the new, safe, client-side breadcrumb component */}
          {!isAnAdminPage && <ClientOnlyBreadcrumb />}

          {children}

        </main>
        
        {/* ✅ Bottom banner stays the same (no sticky) */}
        {!isAnAdminPage && <AdBanner position="bottom" />}
        
        <Footer />
      </div>
    </>
  );
};

export default SharedLayout;