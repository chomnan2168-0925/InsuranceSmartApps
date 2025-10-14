import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head'; // NEW: Import Head for injecting schema
import siteConfig from '@/config/siteConfig.json';
const { siteUrl } = siteConfig;

export interface Crumb {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  const router = useRouter();
  const siteUrl = 'https://www.insurancesmartcalculator.com'; // Replace with your actual domain

  if (router.pathname.startsWith('/admin0925') || !crumbs || crumbs.length === 0) {
    return null;
  }

  // NEW: Create the BreadcrumbList schema object
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${siteUrl}${crumb.href}`,
    })),
  };

  return (
    <>
      {/* NEW: Add the schema to the page's head */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <nav aria-label="breadcrumb" className="bg-gray-100 px-3 py-1.5 rounded-md text-sm">
        <ol className="flex items-center space-x-2 text-gray-500 flex-nowrap overflow-hidden">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            const isFirst = index === 0;

            return (
              <li
                key={crumb.href}
                className={`flex items-center space-x-2 ${isLast ? 'min-w-0' : 'flex-shrink-0'}`}
              >
                {isLast ? (
                  <span className="font-medium text-gray-700 flex items-center gap-1.5" aria-current="page">
                    {isFirst && <img src="/assets/icons/home.svg" alt="Home" className="w-4 h-4 opacity-70" />}
                    <span className="truncate">{crumb.label}</span>
                  </span>
                ) : (
                  <Link href={crumb.href} className="hover:text-navy-blue transition-colors duration-300 flex items-center gap-1.5">
                    {isFirst && <img src="/assets/icons/home.svg" alt="Home" className="w-4 h-4 opacity-70" />}
                    <span>{crumb.label}</span>
                  </Link>
                )}
                {!isLast && (
                  <span className="select-none text-gray-400" aria-hidden="true">&gt;</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;