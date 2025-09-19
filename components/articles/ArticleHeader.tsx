import React from 'react';
import Image from 'next/image';
// FIX: Replaced Post with Article for consistency with type definitions.
import { Article } from '@/types';

interface ArticleHeaderProps {
  post: Article;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ post }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="mb-8">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy-blue mb-4 leading-tight">
        {post.title}
      </h1>
      <div className="flex items-center space-x-4 text-gray-500">
        {post.author && (
           <div className="flex items-center space-x-2">
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
                <Image src={post.author.avatarUrl} alt={post.author.name} layout="fill" objectFit="cover" />
            </div>
            <span className="font-medium text-gray-800">{post.author.name}</span>
           </div>
        )}
         {post.author && <span>&bull;</span>}
        <time dateTime={post.date}>{formattedDate}</time>
        <span>&bull;</span>
        <span className="text-gold font-semibold">{post.category}</span>
      </div>
    </header>
  );
};

export default ArticleHeader;
