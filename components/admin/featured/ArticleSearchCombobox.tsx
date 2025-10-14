import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Article } from '@/types';

interface ArticleSearchComboboxProps {
  articles: Article[];
  onSelect: (article: Article | null) => void;
}

const ArticleSearchCombobox: React.FC<ArticleSearchComboboxProps> = ({ articles, onSelect }) => {
  const [query, setQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredArticles = useMemo(() => {
    if (!query) return [];
    return articles.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, articles]);

  // Handle clicks outside the component to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setQuery(article.title); // Show the full title in the input
    onSelect(article);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedArticle(null); // Clear selection if user types
    onSelect(null);
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <label htmlFor="article-search" className="sr-only">Search for an article</label>
        <input
          id="article-search"
          type="text"
          className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue"
          value={query}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          placeholder="Type to search for an article..."
          autoComplete="off"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
        </div>
      </div>

      {isOpen && query && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <li
                key={article.slug}
                className="p-3 cursor-pointer hover:bg-gold"
                onClick={() => handleSelectArticle(article)}
              >
                <p className="font-semibold text-sm">{article.title}</p>
                <p className="text-xs text-gray-500">{article.category} - {article.date}</p>
              </li>
            ))
          ) : (
            <li className="p-3 text-sm text-gray-500">No articles found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ArticleSearchCombobox;