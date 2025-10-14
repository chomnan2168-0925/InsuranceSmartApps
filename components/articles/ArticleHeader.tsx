import React from 'react';
import { Article } from '@/types';
import Image from 'next/image';

interface ArticleHeaderProps {
  post: Article;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ post }) => {
  if (!post.author) {
    return null;
  }
  
  return (
    <div className="my-6 flex items-center space-x-4">
      <Image
        src={post.author.avatarUrl}
        alt={post.author.name}
        width={48}
        height={48}
        className="rounded-full"
      />
      <div>
        <p className="text-base font-semibold text-gray-900">{post.author.name}</p>
        <p className="text-sm text-gray-500">
          {(post.date || post.published_date || post.created_at) ? (
            <>Published on {new Date(post.date || post.published_date || post.created_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</>
          ) : (
            <>Published recently</>
          )}
        </p>
      </div>
    </div>
  );
};

export default ArticleHeader;