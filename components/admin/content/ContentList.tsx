import React from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';

// Mock data, in a real app this would come from an API
const mockPosts = [
  { slug: 'market-outlook-q4-2024', title: 'Market Outlook for Q4 2024: Trends to Watch', category: 'News', date: '2024-10-01', status: 'Published' },
  { slug: 'understanding-401k-options', title: 'Understanding Your 401(k) Options', category: 'Tips', date: '2024-07-15', status: 'Published' },
  { slug: 'new-cfo-joins-leadership-team', title: 'Jane Doe Joins Hybrid Advisor as Chief Financial Officer', category: 'Newsroom', date: '2024-10-20', status: 'Published' },
  { slug: 'draft-post-example', title: 'My Awesome Draft Post', category: 'Tips', date: '2024-11-05', status: 'Draft' },
];

const ContentList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SectionHeader title="Content Management" className="text-left mb-0" />
        <Link
          href="/admin0925/content/new"
          className="bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-4 rounded-md transition-colors"
        >
          + New Article
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockPosts.map((post) => (
              <tr key={post.slug} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{post.title}</td>
                <td className="p-3 text-gray-600">{post.category}</td>
                <td className="p-3 text-gray-600">{post.date}</td>
                <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {post.status}
                    </span>
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin0925/content/${post.slug}`}
                    className="text-navy-blue hover:underline text-sm font-semibold"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentList;
