import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const categoryPath = article.category.toLowerCase();

  const getLabelClass = () => {
    if (article.label === 'Sponsored') return 'bg-gray-500 text-white';
    if (article.label === 'Most Read') return 'bg-gold text-navy-blue';
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <Link href={`/${categoryPath}/${article.slug}`} className="block group">
        <div className="relative h-48 w-full">
          {article.label && (
            <div className={`absolute top-2 left-2 z-10 px-2 py-1 text-xs font-bold rounded-full ${getLabelClass()}`}>
              {article.label}
            </div>
          )}
          <Image
            src={article.imageUrl}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <p className="text-sm text-gray-500 mb-2">{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <h3 className="text-xl font-bold text-navy-blue mb-3 group-hover:text-gold transition-colors duration-300">{article.title}</h3>
          <p className="text-gray-700 flex-grow">{article.excerpt}</p>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;
