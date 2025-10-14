import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb, { Crumb } from './Breadcrumb';

const ClientOnlyBreadcrumb = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // This effect runs only in the browser, ensuring the component
  // only renders on the client side, after hydration.
  useEffect(() => {
    setIsClient(true);
  }, []);

  const breadcrumbCrumbs = useMemo(() => {
    // On the server or initial render, this will be an empty array.
    if (!isClient) {
      return [];
    }
    
    // This logic now ONLY runs on the client, preventing any mismatch.
    const pathParts = router.asPath.split('?')[0].split('/').filter(part => part);
    if (router.pathname === '/') { return []; }
    const crumbs: Crumb[] = [{ label: 'Home', href: '/' }];
    const labelMap: { [key: string]: string } = {
        'insurance-tips': 'Insurance Tips',
        'newsroom': 'Insurance Newsroom',
        'about-us': 'About Us',
        // ... other mappings
    };
    let currentPath = '';
    pathParts.forEach(part => {
        currentPath += `/${part}`;
        if (part.startsWith('[')) return;
        const label = labelMap[part] || part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        crumbs.push({ label, href: currentPath });
    });
    return crumbs;
  }, [router.asPath, router.pathname, isClient]);

  // Don't render anything if it's not the client or if there aren't enough crumbs
  if (!isClient || breadcrumbCrumbs.length <= 1) {
    return null;
  }

  return (
    <div className="mb-2">
      <Breadcrumb crumbs={breadcrumbCrumbs} />
    </div>
  );
};

export default ClientOnlyBreadcrumb;