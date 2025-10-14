import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, basePath }) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageLink = (page: number) => {
    return page === 1 ? basePath : `${basePath}/page/${page}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center items-center space-x-2" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={getPageLink(currentPage - 1)} className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
          &lt;&lt; Prev
        </Link>
      ) : (
        <span className="px-4 py-2 bg-gray-100 border border-gray-300 text-sm font-medium text-gray-400 rounded-md cursor-not-allowed">
          &lt;&lt; Prev
        </span>
      )}

      <div className="hidden md:flex items-center space-x-2">
        {pages.map(page => (
          page === currentPage ? (
            // This span for the current page prevents the navigation error.
            <span key={page} className="px-4 py-2 border text-sm font-medium rounded-md bg-navy-blue border-navy-blue text-white z-10" aria-current="page">
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={getPageLink(page)}
              className="px-4 py-2 border text-sm font-medium rounded-md bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {page}
            </Link>
          )
        ))}
      </div>

      {currentPage < totalPages ? (
        <Link href={getPageLink(currentPage + 1)} className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
          Next &gt;&gt;
        </Link>
      ) : (
        <span className="px-4 py-2 bg-gray-100 border border-gray-300 text-sm font-medium text-gray-400 rounded-md cursor-not-allowed">
          Next &gt;&gt;
        </span>
      )}
    </nav>
  );
};

export default Pagination;