import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import { supabase } from '@/lib/supabaseClient';
import { Article } from '@/types';
import { useRouter } from 'next/router';

const ROWS_PER_PAGE = 10;

const getCategoryPath = (category: Article['category']) => {
  if (category === 'Insurance Tips') return '/insurance-tips';
  if (category === 'Insurance Newsroom') return '/newsroom';
  return '/'; // Fallback path if category doesn't match
};

const ContentList = () => {
  const [allPosts, setAllPosts] = useState<Article[]>([]); 

  // STATE for all interactive features
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Article | null; direction: 'ascending' | 'descending' }>({ key: 'created_at', direction: 'descending' });
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(`Failed to fetch articles: ${error.message}`);
        console.error("Error fetching articles:", error);
      } else {
        setAllPosts(data || []);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  // LOGIC for filtering and sorting the entire dataset
  const filteredAndSortedPosts = useMemo(() => {
    let processablePosts = [...allPosts];
    
    // Filtering logic
    if (searchTerm || filterStatus !== 'All' || filterCategory !== 'All') {
      processablePosts = processablePosts.filter(post => {
        const searchableString = `${post.title} ${post.category} ${post.status}`.toLowerCase();
        return searchableString.includes(searchTerm.toLowerCase()) &&
               (filterStatus === 'All' || post.status === filterStatus) &&
               (filterCategory === 'All' || post.category === filterCategory);
      });
    }

    // Sorting logic
    if (sortConfig.key) {
      processablePosts.sort((a, b) => {
        const aValue = a[sortConfig.key!] ?? 0;
        const bValue = b[sortConfig.key!] ?? 0;
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return processablePosts;
  }, [allPosts, searchTerm, filterStatus, filterCategory, sortConfig]);

  // LOGIC for pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / ROWS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredAndSortedPosts.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [currentPage, filteredAndSortedPosts]);

  // HANDLER for sorting
  const requestSort = (key: keyof Article) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // HANDLER for individual row selection
  const handleSelect = (articleId: number) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId]
    );
  };
  
  // HANDLER for "select all" checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedArticles(filteredAndSortedPosts.map(p => p.id));
    } else {
      setSelectedArticles([]);
    }
  };
  
  // HANDLER for bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedArticles.length === 0) {
      alert('Please select at least one article.');
      return;
    }
    
    if (action === 'Delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedArticles.length} article(s)? This action cannot be undone.`)) {
        const { error } = await supabase
          .from('articles')
          .delete()
          .in('id', selectedArticles);
        
        if (error) {
          alert(`Error deleting articles: ${error.message}`);
        } else {
          setAllPosts(prev => prev.filter(p => !selectedArticles.includes(p.id)));
          setSelectedArticles([]);
          alert('Articles deleted successfully.');
        }
      }
    } else {
      alert(`Action "${action}" applied to ${selectedArticles.length} article(s). (Mock for now)`);
    }
  };

  // COMPONENT for sortable table headers to keep JSX clean
  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: keyof Article }) => {
    const isSorted = sortConfig.key === sortKey;
    return (
      <th className="p-3 cursor-pointer select-none" onClick={() => requestSort(sortKey)}>
        <div className="flex items-center">
          {label}
          <span className="ml-1 w-4">{isSorted ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</span>
        </div>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4 -mb-4 -mt-4">
        <div className="flex-1 text-center [&>div]:py-0 [&>div>h2]:text-xl [&>div>p]:text-sm [&>div>p]:mt-0">
          <SectionHeader
            title="Content Management"
            subtitle={`Showing ${filteredAndSortedPosts.length} articles`}
            className="text-center mb-4"
          />
        </div>
        <Link href="/admin0925/content/new" className="bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-4 rounded-md transition-colors flex-shrink-0">
          + New Article
        </Link>
      </div>

      <div className="bg-white p-2 rounded-lg shadow-md flex flex-wrap gap-6 items-center">
        <div className="relative w-full md:w-1/3">
          <label htmlFor="search-input" className="sr-only">Search</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
          </div>
          <input
            id="search-input" type="text" placeholder="Search all fields..."
            className="w-full p-1.5 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue"
            value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="p-1.5 border border-gray-300 rounded-md">
          <option value="All">All Statuses</option><option value="Published">Published</option><option value="Draft">Draft</option>
        </select>
        <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }} className="p-1.5 border border-gray-300 rounded-md">
          <option value="All">All Categories</option><option value="Insurance Newsroom">Insurance Newsroom</option><option value="Insurance Tips">Insurance Tips</option>
        </select>
      </div>

      {selectedArticles.length > 0 && (
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center gap-4">
          <span className="font-semibold text-sm">{selectedArticles.length} selected</span>
          <select onChange={e => handleBulkAction(e.target.value)} className="p-2 border border-gray-300 rounded-md text-sm" defaultValue="">
            <option value="" disabled>Bulk Actions...</option><option value="Publish">Publish Selected</option><option value="Unpublish">Unpublish Selected</option><option value="Delete">Delete Selected</option>
          </select>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md flex flex-col max-h-[75vh]">
        <div className="overflow-y-auto">
          
          {loading && <p className="p-6 text-center text-gray-500">Loading articles from Supabase...</p>}
          {error && <p className="p-6 text-center text-red-600 font-semibold">{error}</p>}
          
          {!loading && !error && (
            <table className="w-full text-left min-w-[700px]">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr className="border-b text-sm">
                  <th className="p-3 w-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedArticles.length > 0 && selectedArticles.length === filteredAndSortedPosts.length}/></th>
                  <th className="p-3">#</th>
                  <SortableHeader label="Title" sortKey="title" />
                  <SortableHeader label="Category" sortKey="category" />
                  <SortableHeader label="Date" sortKey="created_at" />
                  <SortableHeader label="Status" sortKey="status" />
                  <SortableHeader label="Views" sortKey="views" />
                  <SortableHeader label="Shares" sortKey="shares" />
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post, index) => (
                  <tr key={post.id} className={`border-b hover:bg-gray-50 text-sm ${selectedArticles.includes(post.id) ? 'bg-yellow-50' : ''}`}>
                    <td className="p-3"><input type="checkbox" checked={selectedArticles.includes(post.id)} onChange={() => handleSelect(post.id)}/></td>
                    <td className="p-3 text-gray-500">{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                    <td className="p-3 font-medium text-gray-800">{post.title}</td>
                    <td className="p-3 text-gray-600">{post.category}</td>
                    {/* FIXED: Added null check for created_at */}
                    <td className="p-3 text-gray-600">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString() : '–'}
                    </td>
                    <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{post.status}</span></td>
                    <td className="p-3 text-gray-600">{post.views?.toLocaleString() || '–'}</td>
                    <td className="p-3 text-gray-600">{post.shares?.toLocaleString() || '–'}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => router.push(`/admin0925/content/${post.slug}`)} className="text-navy-blue hover:underline font-semibold">
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <a 
                          href={`${getCategoryPath(post.category)}/${post.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline font-semibold"
                        >
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 flex justify-between items-center border-t flex-shrink-0">
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <span className="text-sm font-semibold">Page {currentPage} of {totalPages > 0 ? totalPages : 1}</span>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0} className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentList;