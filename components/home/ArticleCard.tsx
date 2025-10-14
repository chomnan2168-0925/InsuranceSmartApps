import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  // === START OF FIX ===
  // The logic inside this function has been updated to match your new category names.
  // The rest of the component is unchanged.
  const getCategoryPath = (category: string) => {
    if (category === 'Insurance Tips') return '/insurance-tips';
    if (category === 'Insurance Newsroom') return '/newsroom';
    return `/${category.toLowerCase()}`;
  };
  // === END OF FIX ===
  
  const categoryPath = getCategoryPath(article.category);

  // Your original design and JSX are preserved below.
  return (
    <Link href={`${categoryPath}/${article.slug}`} className="block group w-full">
      <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white h-full flex flex-col">
        
        <div className="relative w-full">
          <div className="aspect-w-16 aspect-h-9">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="absolute bottom-2 left-2 right-2 md:hidden">
            <h3 className="text-white font-semibold text-base leading-snug bg-black/20 backdrop-blur-sm px-2 py-1 rounded shadow-sm line-clamp-2">
              {article.title}
            </h3>
          </div>
        </div>
        
        <div className="px-5 pt-1 pb-2 flex-grow flex flex-col">
          <div className="hidden md:block min-h-[2.5rem]">
            <h3 className="text-base font-semibold leading-tight text-navy-blue group-hover:text-gold transition-colors duration-300 line-clamp-2">
              {article.title}
            </h3>
          </div>

          <div className="mt-1 min-h-[3.75rem]">
            <p className="text-sm text-gray-700 leading-snug line-clamp-3">
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;