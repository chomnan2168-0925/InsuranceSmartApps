import React, { useRef } from 'react';
import { Article } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useSliderScroll } from '@/lib/hooks/useSliderScroll';

// Interface for props, now with an optional title
interface RecommendedSliderProps {
  articles: Article[];
  title?: string; // Optional title prop
}

// Arrow component is unchanged
const Arrow = ({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-100 focus:outline-none"
    style={{ [direction]: '-0.75rem' }}
    aria-label={direction === 'left' ? 'Previous articles' : 'Next articles'}
  >
    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}/>
    </svg>
  </button>
);

// NEW: Helper function to get the correct public URL path
const getArticlePath = (article: Article) => {
  const categorySlug = article.category === 'Insurance Tips' ? 'insurance-tips' : 'newsroom';
  return `/${categorySlug}/${article.slug}`;
};

// NEW: Helper to get a color for the category tag
const getCategoryColor = (category: Article['category']) => {
  if (category === 'Insurance Tips') return 'bg-blue-100 text-blue-800';
  if (category === 'Insurance Newsroom') return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-800';
};


const RecommendedSlider: React.FC<RecommendedSliderProps> = ({ articles, title = "Don’t Miss These!" }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isAtStart, isAtEnd, scroll } = useSliderScroll(scrollContainerRef);

  if (!articles || articles.length === 0) {
    return null;
  }

  const sliderId = 'recommended-articles-slider';

  return (
    <section>
      <div className="bg-white rounded-xl shadow-sm p-0">
        {/* The title is now dynamic */}
        <h2 id={sliderId} className="text-2xl font-bold text-navy-blue text-center mb-3 -mt-3">
          {title}
        </h2>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex space-x-3 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pt-0 -mb-4"
            role="list"
            tabIndex={0}
            aria-label="Recommended Articles"
          >
            {articles.map((post) => (
              <div
                key={post.slug}
                className="flex-shrink-0 w-5/6 sm:w-2/5 lg:w-[calc(33.333%-0.75rem)] snap-start"
                role="listitem"
              >
                {/* Your original card design is preserved here */}
                <Link
                  // The link now uses the helper function for the correct path
                  href={getArticlePath(post)}
                  className="group block rounded-lg overflow-hidden h-full bg-white shadow-md hover:shadow-xl transition-shadow relative"
                >
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={post.imageUrl || '/images/placeholder-thumb.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 33vw"
                    />
                    
                    {/* NEW: Category tag added here */}

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:underline">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {!isAtStart && <Arrow direction="left" onClick={() => scroll('left')} />}
          {!isAtEnd && <Arrow direction="right" onClick={() => scroll('right')} />}
        </div>
      </div>
    </section>
  );
};

export default RecommendedSlider;