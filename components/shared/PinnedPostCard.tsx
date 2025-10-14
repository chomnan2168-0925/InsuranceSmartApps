import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import FireIcon from '../icons/FireIcon';
import StarIcon from '../icons/StarIcon';

interface PinnedPostCardProps {
  article: Article;
}

const PinnedPostCard: React.FC<PinnedPostCardProps> = ({ article }) => {
  const getCategoryPath = (category: string) => {
    if (category === 'Insurance Tips') return '/insurance-tips';
    if (category === 'Insurance Newsroom') return '/newsroom';
    return `/${category.toLowerCase()}`;
  };
  
  const categoryPath = getCategoryPath(article.category);

  const labelConfig = {
    'Most Read': {
      icon: <FireIcon className="w-4 h-4 mr-1.5" />,
      className: 'bg-gold text-navy-blue',
    },
    'Sponsored': {
      icon: <StarIcon className="w-4 h-4" />,
      className: 'bg-navy-blue text-white',
    },
  };
  
  const currentLabel =
    article.label && (labelConfig[article.label as keyof typeof labelConfig]);

  // This logic block remains exactly the same.
  const imageSrc =
    article.slug === 'ai-in-finance-report'
      ? '/images/placeholder-thumb-test.jpg'
      : article.imageUrl && article.imageUrl.trim() !== ''
      ? article.imageUrl
      : '/images/placeholder-thumb.jpg';

 
  return (

    <Link href={`${categoryPath}/${article.slug}`} className="block group w-full mb-4">
      <div className="relative rounded-lg overflow-hidden shadow-soft hover:shadow-soft-lg transition-shadow duration-300 bg-white">
        
        <div className="relative w-full h-56 md:h-72 lg:h-80">
          <Image
            src={imageSrc}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />

          <div className="absolute bottom-3 left-3 right-3">
            <h2 className="text-white font-bold text-base md:text-lg lg:text-xl line-clamp-2 leading-snug bg-black/20 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
              {article.title}
            </h2>
          </div>

          {currentLabel && (
            <div
              className={`absolute top-0 left-0 z-10 flex items-center px-2.5 py-1.5 rounded-br-lg space-x-1.5 ${currentLabel.className}`}
            >
              {currentLabel.icon}
              <span className="text-xs font-bold uppercase tracking-wider">{article.label}</span>
            </div>
          )}
        </div>

        <div className="px-4">
          <div className="min-h-[4.5rem] mt-1 mb-2">
            <p className="text-base text-gray-600 line-clamp-3">{article.excerpt}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PinnedPostCard;