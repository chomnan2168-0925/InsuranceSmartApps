// FIX: Replaced placeholder content with a complete, functional Pagination component.
import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, basePath }) => {

  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    // Always show first page
    pageNumbers.push(1);

    // Ellipsis after first page
    if (currentPage > 3) {
      pageNumbers.push('...');
    }

    // Pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    // Ellipsis before last page
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }
    
    // Always show last page
    pageNumbers.push(totalPages);
    
    return pageNumbers;
  };

  const pages = renderPageNumbers();

  return (
    <nav className="flex justify-center items-center space-x-2" aria-label="Pagination">
      <Link
        href={currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : '#'}
        className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </Link>

      {pages.map((page, index) =>
        typeof page === 'string' ? (
          <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-500">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={`${basePath}?page=${page}`}
            className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-navy-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={currentPage < totalPages ? `${basePath}?page=${currentPage + 1}` : '#'}
        className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </nav>
  );
};

export default Pagination;
