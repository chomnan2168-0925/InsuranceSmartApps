// /components/shared/SidebarArticleCard.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';

interface SidebarArticleCardProps {
  article: Article;
}

const SidebarArticleCard: React.FC<SidebarArticleCardProps> = ({ article }) => {
  const getCategoryPath = (category: string) => {
    if (category === 'Insurance Tips') return '/insurance-tips';
    if (category === 'Insurance Newsroom') return '/newsroom';
    return `/${category.toLowerCase()}`;
  };
  const articleUrl = `${getCategoryPath(article.category)}/${article.slug}`;

  // CHANGE: The outermost element is now an <li> instead of a <div>
  return (
    <li className="group rounded-lg border border-gray-200 p-2 hover:shadow-sm transition-shadow duration-300">
      <div className="flex space-x-2 md:space-x-3">
        <div className="relative w-2/5 flex-shrink-0">
          <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-md">
            <Link href={articleUrl}>
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>
        </div>
        <div className="w-3/5">
          <Link href={articleUrl}>
            <h4 className="text-sm md:text-base font-semibold md:font-normal leading-tight text-navy-blue group-hover:text-gold transition-colors line-clamp-2 md:line-clamp-none">
              {article.title}
            </h4>
          </Link>
          <div className="min-h-[3.75rem] mt-1 md:hidden"> 
            <p className="text-sm text-gray-600 leading-snug line-clamp-3">
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default SidebarArticleCard;