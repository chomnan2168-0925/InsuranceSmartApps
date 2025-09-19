import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface Crumb {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  const router = useRouter();

  // Don't display on admin pages or if there are no crumbs to show
  if (router.pathname.startsWith('/admin') || !crumbs || crumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center space-x-2">
            {index < crumbs.length - 1 ? (
              <Link href={crumb.href} className="hover:text-navy-blue transition-colors duration-300">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-700" aria-current="page">
                {crumb.label}
              </span>
            )}
            {index < crumbs.length - 1 && (
              <span className="select-none text-gray-400" aria-hidden="true">&gt;</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;