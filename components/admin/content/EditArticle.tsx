// components/admin/content/EditArticle.tsx
// ✅ ENHANCED VERSION - Uses only camelCase fields (no duplicates)

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SectionHeader from '@/components/ui/SectionHeader';
import TagInput from './TagInput'; // ✅ Now uses enhanced version
import { Article } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import AdvancedRichTextEditor from './AdvancedRichTextEditor'; 
import ContentAnalysis from './ContentAnalysis';
import RevisionHistory from './RevisionHistory';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

const createImageSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
};

interface Author {
  id: string;
  name: string;
  role: string;
}

const EditArticle: React.FC<{ articleId?: string }> = ({ articleId }) => {
  const router = useRouter();
  
  // ✅ FIXED: Use only camelCase field names (no duplicates)
  const [article, setArticle] = useState<Partial<Article>>({
    title: '', 
    slug: '', 
    excerpt: '', 
    content: '', 
    category: 'Insurance Tips', // ✅ Changed default to Tips
    status: 'Draft', 
    tags: [], 
    label: null, 
    imageUrl: '', 
    metaTitle: '',        // ✅ camelCase only
    metaDescription: '',  // ✅ camelCase only
    targetKeyword: '',    // ✅ camelCase only
    author_id: undefined
  });

  const isNewArticle = !articleId;
  const [loading, setLoading] = useState(!isNewArticle);
  const [statusMessage, setStatusMessage] = useState('');
  const imageCounterRef = useRef(1);
  
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(true);

  // Fetch authors
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoadingAuthors(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching authors:', error);
        setAuthors([]);
      } else {
        setAuthors(data || []);
      }
      setLoadingAuthors(false);
    };

    fetchAuthors();
  }, []);

  // Fetch article for editing
  useEffect(() => {
    if (isNewArticle) {
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      setLoading(true);
      setStatusMessage('');
      
      // ✅ FIXED: Select all fields (both old and new for migration)
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', articleId)
        .single();
      
      if (error || !data) {
        setStatusMessage("Error: Article not found.");
        console.error("Error fetching article:", error);
        setTimeout(() => router.push('/admin0925/content'), 2000);
      } else {
        // ✅ MIGRATION: Prefer camelCase, fallback to snake_case
        setArticle({
          ...data,
          metaTitle: data.metaTitle || data.meta_title || '',
          metaDescription: data.metaDescription || data.meta_description || '',
          targetKeyword: data.targetKeyword || data.target_keyword || '',
          author_id: data.author_id || null
        });

        // ✅ Log any migration needed (development only)
        if (process.env.NODE_ENV === 'development') {
          if (data.meta_title && !data.metaTitle) {
            console.warn('⚠️ Article has old snake_case fields - will be migrated on save');
          }
        }
      }
      setLoading(false);
    };

    fetchArticle();
  }, [articleId, isNewArticle, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setArticle(prev => ({ ...prev, [name]: checked }));
    } else {
      setArticle(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug for new articles
      if (name === 'title' && isNewArticle) { 
        setArticle(prev => ({ ...prev, slug: generateSlug(value) })); 
      }
      
      // ✅ Auto-fill SEO fields if empty (smart defaults)
      if (name === 'title') {
        setArticle(prev => ({ 
          ...prev, 
          metaTitle: prev.metaTitle || value  // Only fill if empty
        }));
      }
      if (name === 'excerpt') {
        setArticle(prev => ({ 
          ...prev, 
          metaDescription: prev.metaDescription || value  // Only fill if empty
        }));
      }
    }
  };
  
  const handleContentChange = (content: string) => { 
    setArticle(prev => ({ ...prev, content })); 
  };
  
  const handleTagsChange = (tags: string[]) => { 
    setArticle(prev => ({ ...prev, tags })); 
  };
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setArticle(prev => ({ ...prev, slug: value }));
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setArticle(prev => ({ 
      ...prev, 
      author_id: value === '' ? undefined : value 
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage('Saving...');

    let finalArticle = { ...article };
    
    // Auto-generate slug if empty
    if (isNewArticle && !finalArticle.slug) {
      finalArticle.slug = generateSlug(finalArticle.title || '');
    }

    // ✅ Smart SEO field defaults
    if (!finalArticle.metaTitle) {
      finalArticle.metaTitle = finalArticle.title;
    }
    if (!finalArticle.metaDescription) {
      finalArticle.metaDescription = finalArticle.excerpt;
    }

    // Default author
    if (!finalArticle.author_id && authors.length > 0) {
      finalArticle.author_id = authors[0].id;
      setStatusMessage('No author selected, using default author...');
    }

    // ✅ CRITICAL: Remove snake_case fields before saving
    // This ensures we only save to camelCase columns
    const cleanArticle = { ...finalArticle };
    delete (cleanArticle as any).meta_title;
    delete (cleanArticle as any).meta_description;
    delete (cleanArticle as any).target_keyword;
    
    if (isNewArticle) {
      const { id, ...insertData } = cleanArticle; 
      const { error } = await supabase.from('articles').insert([insertData]);
      
      if (error) {
        setStatusMessage(`Error creating article: ${error.message}`);
      } else {
        setStatusMessage('New article created successfully!');
        setTimeout(() => router.push('/admin0925/content'), 1000);
      }
    } else {
      const { id, ...updateData } = cleanArticle;
      const { error } = await supabase.from('articles').update(updateData).eq('id', id);

      if (error) {
        setStatusMessage(`Error updating article: ${error.message}`);
      } else {
        setStatusMessage(`Article "${articleId}" updated successfully!`);
        setTimeout(() => router.push('/admin0925/content'), 1000);
      }
    }
  };
  
  const handlePreview = () => { 
    const categoryPath = article.category === 'Insurance Tips' ? 'insurance-tips' : 'newsroom';
    const previewUrl = `/preview/${categoryPath}/${article.slug || 'new-article'}`;
    window.open(previewUrl, '_blank');
  };

  const imageUploadHandler = (blobInfo: any, progress: (percent: number) => void): Promise<string> => 
    new Promise((resolve, reject) => {
      if (!CLOUDINARY_UPLOAD_PRESET) { 
        reject("Cloudinary upload preset is not configured."); 
        return; 
      }

      if (!article.title || article.title.trim() === '') {
        reject("Please enter an article title before uploading images.");
        return;
      }

      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      const articleSlug = createImageSlug(article.title || '');
      const count = imageCounterRef.current;
      const publicId = count === 1 
        ? `articles/${articleSlug}` 
        : `articles/${articleSlug}-${count}`;
      
      formData.append('public_id', publicId);
      formData.append('folder', 'articles');
      formData.append('context', `alt=${article.title}|article_title=${article.title}`);
      
      imageCounterRef.current += 1;

      fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { 
        method: 'POST', 
        body: formData 
      })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => {
        console.log('✅ Image uploaded with SEO name:', data.public_id);
        resolve(data.secure_url);
      })
      .catch(err => reject(`Image upload failed: ${err}`));
    });

  const openCloudinaryWidget = (onSuccess: (url: string) => void) => {
    if (!(window as any).cloudinary) { 
      alert("Cloudinary script not loaded."); 
      return; 
    }

    if (!article.title || article.title.trim() === '') {
      alert("Please enter an article title before uploading images.");
      return;
    }

    const articleSlug = createImageSlug(article.title || '');
    const count = imageCounterRef.current;

    (window as any).cloudinary.openUploadWidget({
        cloudName: CLOUDINARY_CLOUD_NAME, 
        apiKey: CLOUDINARY_API_KEY, 
        uploadPreset: CLOUDINARY_UPLOAD_PRESET, 
        multiple: false,
        folder: 'articles',
        publicId: count === 1 ? articleSlug : `${articleSlug}-${count}`,
        context: {
          custom: {
            alt: article.title,
            article_title: article.title,
          }
        },
        tags: ['article-image', article.category || 'uncategorized'],
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#1A365D',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#D4AF37',
            action: '#1A365D',
            inactiveTabIcon: '#B0B0B0',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#F4F4F5'
          }
        }
    }, (error: any, result: any) => {
      if (!error && result && result.event === "success") { 
        console.log('✅ Image uploaded with SEO name:', result.info.public_id);
        imageCounterRef.current += 1;
        onSuccess(result.info.secure_url); 
      }
    });
  };
  
  if (loading) {
    return <p className="text-center p-8">Loading article from Supabase...</p>;
  };
  
  const handleSuggestKeywords = () => {
    alert("AI feature coming soon! This will suggest tags and keywords based on your content.");
  };

  return (
    <>
      <Head>
        <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript" />
      </Head>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="[&>div]:py-0 [&>div>h2]:text-xl">
          <SectionHeader title={isNewArticle ? 'Create New Article' : `Editing: ${article.title}`} className="text-left" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-2">
            <div className="bg-white p-3 rounded-lg shadow-md">
                <div>
                    <label htmlFor="title" className="block text-sm font-bold text-navy-blue mb-1">
                      Title
                      <span className="text-xs font-normal text-gray-500 ml-2">
                        (Required for SEO-friendly image names)
                      </span>
                    </label>
                    <input
                        type="text" id="title" name="title" value={article.title || ''}
                        onChange={handleChange} required
                        className="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
                        placeholder="Enter article title first before uploading images"
                    />
                </div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-md">
              <h3 className="text-sm font-bold text-navy-blue mb-1">Featured Image</h3>
              <div className="mt-2 flex items-center gap-4">
                {article.imageUrl && <img src={article.imageUrl} alt="Featured preview" className="w-40 h-28 object-cover rounded-md border bg-gray-100" />}
                <button 
                  type="button" 
                  onClick={() => openCloudinaryWidget(url => setArticle(prev => ({ ...prev, imageUrl: url })))}
                  disabled={!article.title || article.title.trim() === ''}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!article.title ? "Enter article title first" : ""}
                >
                  {article.imageUrl ? 'Change Image' : 'Select from Cloudinary'}
                </button>
              </div>
              {!article.title && (
                <p className="text-xs text-orange-600 mt-2">
                  ⚠️ Enter article title first to enable SEO-friendly image naming
                </p>
              )}
            </div>

            <div className="bg-white p-3 rounded-lg shadow-md flex flex-col flex-grow">
              <label className="block text-sm font-bold text-navy-blue mb-1">Content</label>
              <AdvancedRichTextEditor
                value={article.content || ''}
                onChange={handleContentChange}
                imageUploadHandler={imageUploadHandler}
                onCloudinaryClick={() => openCloudinaryWidget(url => {
                  const img = `<img src="${url}" alt="${article.title || ''}" style="max-width: 100%;" />`;
                  setArticle(prev => ({ 
                    ...prev, 
                    content: (prev.content || '') + img 
                  }));
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg shadow-md space-y-2">
              <h3 className="text-lg font-bold text-navy-blue border-b pb-0 pt-0">Publish Settings</h3>
              
              <div>
                <label htmlFor="status" className="block text-sm font-bold text-gray-700">Status</label>
                <select id="status" name="status" value={article.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-1 pb-1 pt-0 text-base border-gray-300 rounded-md">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>

              <div>
                <label htmlFor="author_id" className="block text-sm font-bold text-gray-700">
                  Author
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    (Who wrote this article?)
                  </span>
                </label>
                {loadingAuthors ? (
                  <div className="mt-1 text-sm text-gray-500">Loading authors...</div>
                ) : (
                  <select 
                    id="author_id" 
                    name="author_id" 
                    value={article.author_id || ''} 
                    onChange={handleAuthorChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navy-blue focus:border-navy-blue rounded-md"
                  >
                    <option value="">-- Select Author --</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name} ({author.role})
                      </option>
                    ))}
                  </select>
                )}
                {!article.author_id && authors.length > 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⚠️ If no author is selected, the first author will be assigned by default
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-center gap-2 pt-2 border-t">
                {statusMessage && <p className="text-sm text-gray-600 mr-auto">{statusMessage}</p>}
                <button type="button" onClick={() => router.back()} className="w-full sm:w-auto px-2 py-1.5 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">
                  Cancel
                </button>
                <button type="button" onClick={handlePreview} className="w-full sm:w-auto px-2 py-1.5 text-sm bg-white text-navy-blue border border-gray-300 rounded-md hover:bg-gray-50 font-semibold">
                  Preview
                </button>
                <button type="submit" className="w-full sm:w-auto px-2 py-1.5 text-sm bg-gold text-navy-blue rounded-md hover:bg-yellow-400 font-semibold">
                  {isNewArticle ? 'Create Article' : 'Update Article'}
                </button>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-md space-y-2">
               <h3 className="text-md font-bold text-navy-blue border-b pb-0 pt-0">Details</h3>
               <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">URL Slug</label>
                  <input type="text" id="slug" name="slug" value={article.slug || ''} onChange={handleSlugChange} required
                      className="mt-1 block w-full px-2 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Auto-generated from title, but can be manually changed.</p>
               </div>
               <div>
                  <label htmlFor="category" className="block text-sm font-bold text-gray-700">Category</label>
                  <select id="category" name="category" value={article.category} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm rounded-md">
                      <option>Insurance Tips</option>
                      <option>Insurance Newsroom</option>
                  </select>
                </div>
                
               <div>
                    <label htmlFor="excerpt" className="block text-sm font-bold text-gray-700">Short Description </label>
                    <textarea 
                      id="excerpt" 
                      name="excerpt" 
                      rows={4}
                      value={article.excerpt || ''} 
                      onChange={handleChange} 
                      className="mt-1 block w-full px-2 py-2 bg-white text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue" 
                      placeholder="A brief, 1-2 sentence summary that will appear on article cards." 
                    />
                 </div>

                 {/* ✅ ENHANCED: New TagInput component */}
                 <div>
                    <label className="block text-sm font-bold text-gray-700 pb-2 pt-0">Tags & Keywords</label>
                    <TagInput tags={article.tags || []} setTags={handleTagsChange} />
                 </div>
            </div>

            {/* ✅ SEO section with clearer labeling */}
            <div className="bg-white p-3 rounded-lg shadow-md space-y-2">
                <h3 className="text-md font-bold text-navy-blue border-b pb-0 pt-0">Search Engine Optimization (SEO)</h3>
                
                <div>
                    <label htmlFor="metaTitle" className="block text-sm font-bold text-gray-700">
                      Meta Title
                      <span className="text-xs font-normal text-gray-500 ml-2">(Shown in Google search)</span>
                    </label>
                    <input 
                      type="text" 
                      id="metaTitle" 
                      name="metaTitle" 
                      value={article.metaTitle || ''} 
                      onChange={handleChange}
                      maxLength={60}
                      className="mt-1 block w-full px-2 py-2 bg-white text-sm border border-gray-300 rounded-md shadow-sm" 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {article.metaTitle?.length || 0}/60 characters • Auto-filled from title if empty
                    </p>
                </div>
                
                <div>
                    <label htmlFor="metaDescription" className="block text-sm font-bold text-gray-700">
                      Meta Description
                      <span className="text-xs font-normal text-gray-500 ml-2">(Shown in Google search)</span>
                    </label>
                    <textarea 
                      id="metaDescription" 
                      name="metaDescription" 
                      rows={3} 
                      value={article.metaDescription || ''} 
                      onChange={handleChange}
                      maxLength={160}
                      className="mt-1 block w-full px-2 py-2 bg-white text-sm border border-gray-300 rounded-md shadow-sm" 
                      placeholder="A compelling summary for search engines..." 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {article.metaDescription?.length || 0}/160 characters • Auto-filled from excerpt if empty
                    </p>
                </div>
                
                <div>
                    <label htmlFor="targetKeyword" className="block text-sm font-bold text-gray-700">
                      Focus Keyword
                      <span className="text-xs font-normal text-gray-500 ml-2">(Main topic of article)</span>
                    </label>
                    <input 
                      type="text" 
                      id="targetKeyword" 
                      name="targetKeyword" 
                      value={article.targetKeyword || ''} 
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white text-sm border border-gray-300 rounded-md shadow-sm" 
                      placeholder="e.g., auto insurance savings"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      1-3 words that best describe this article's topic
                    </p>
                </div>
            </div>
           
            <ContentAnalysis content={article.content || ''} />
            {!isNewArticle && <RevisionHistory articleId={articleId} />}
          </div>
        </div>
      </form>
    </>
  );
};

export default EditArticle;
