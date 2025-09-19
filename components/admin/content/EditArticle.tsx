import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import RichTextEditor from './RichTextEditor';
import TagInput from './TagInput';

interface EditArticleProps {
  articleId?: string;
}

// Mock function to fetch article data. In a real app, this would be an API call.
const getArticleData = (id: string) => {
  const mockArticles = {
    'market-outlook-q4-2024': {
      title: 'Market Outlook for Q4 2024: Trends to Watch',
      slug: 'market-outlook-q4-2024',
      category: 'News',
      content: '<p>As we head into the final quarter, experts weigh in on potential market shifts and opportunities.</p>',
      tags: ['Markets', 'Investing', '2024'],
      status: 'Published'
    },
    'understanding-401k-options': {
        title: 'Understanding Your 401(k) Options',
        content: '<p>Maximize your retirement savings by learning the ins and outs of your 401(k) plan.</p>',
        tags: ['Retirement', '401k'],
        status: 'Published'
    }
  };
  return mockArticles[id] || null;
};

const EditArticle: React.FC<EditArticleProps> = ({ articleId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState('Draft');

  useEffect(() => {
    if (articleId) {
      const article = getArticleData(articleId);
      if (article) {
        setTitle(article.title);
        setContent(article.content);
        setTags(article.tags);
        setStatus(article.status);
      }
    }
  }, [articleId]);

  const handleSave = () => {
    // In a real app, this would send data to a backend API to save the article
    alert(`Saving article: ${title}`);
    console.log({ title, content, tags, status });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title={articleId ? `Edit: ${title}` : 'New Article'} className="text-left mb-0" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue"
              placeholder="Article Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar for Settings */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h3 className="text-lg font-bold">Publish Settings</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:ring-navy-blue focus:border-navy-blue sm:text-sm rounded-md">
                        <option>Draft</option>
                        <option>Published</option>
                    </select>
                </div>
                 <button onClick={handleSave} className="w-full bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-4 rounded-md">
                    {articleId ? 'Update' : 'Save Draft'}
                </button>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h3 className="text-lg font-bold">Tags</h3>
                <TagInput tags={tags} setTags={setTags} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;
