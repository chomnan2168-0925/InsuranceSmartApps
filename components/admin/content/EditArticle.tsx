import React, { useState, useEffect, FormEvent, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SectionHeader from '@/components/ui/SectionHeader';
import TagInput from './TagInput';
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

// Helper function to create SEO-friendly slug for images
const createImageSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
};

const EditArticle: React.FC<{ articleId?: string }> = ({ articleId }) => {
  const router = useRouter();
  const [article, setArticle] = useState<Partial<Article>>({
    title: '', slug: '', excerpt: '', content: '', category: 'Insurance Newsroom', status: 'Draft', 
    tags: [], label: null, imageUrl: '', metaTitle: '', metaDescription: '', targetKeyword: '',
    show_author: true, show_publish_date: true
  });

  const isNewArticle = !articleId;
  const [loading, setLoading] = useState(!isNewArticle);
  const [statusMessage, setStatusMessage] = useState('');
  const imageCounterRef = useRef(1); // Track multiple images for naming

  useEffect(() => {
    if (isNewArticle) {
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      setLoading(true);
      setStatusMessage('');
      
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
        // Ensure display options have default values
        setArticle({
          ...data,
          show_author: data.show_author !== undefined ? data.show_author : true,
          show_publish_date: data.show_publish_date !== undefined ? data.show_publish_date : true
        });
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
      if (name === 'title' && isNewArticle) { 
        setArticle(prev => ({ ...prev, slug: generateSlug(value) })); 
      }
      // Auto-fill metaTitle and metaDescription if empty
      if (name === 'title' && !article.metaTitle) {
        setArticle(prev => ({ ...prev, metaTitle: value }));
      }
      if (name === 'excerpt' && !article.metaDescription) {
        setArticle(prev => ({ ...prev, metaDescription: value }));
      }
    }
  };
  
  const handleContentChange = (content: string) => { setArticle(prev => ({ ...prev, content })); };
  const handleTagsChange = (tags: string[]) => { setArticle(prev => ({ ...prev, tags })); };
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setArticle(prev => ({ ...prev, slug: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage('Saving...');

    let finalArticle = { ...article };
    
    // Auto-generate slug from title if it's a new article and slug is empty
    if (isNewArticle && !finalArticle.slug) {
      finalArticle.slug = generateSlug(finalArticle.title || '');
    }

    // Auto-fill SEO fields if empty
    if (!finalArticle.metaTitle) {
      finalArticle.metaTitle = finalArticle.title;
    }
    if (!finalArticle.metaDescription) {
      finalArticle.metaDescription = finalArticle.excerpt;
    }
    
    if (isNewArticle) {
      const { id, ...insertData } = finalArticle; 
      const { error } = await supabase.from('articles').insert([insertData]);
      
      if (error) {
        setStatusMessage(`Error creating article: ${error.message}`);
      } else {
        setStatusMessage('New article created successfully!');
        setTimeout(() => router.push('/admin0925/content'), 1000);
      }
    } else {
      const { id, ...updateData } = finalArticle;
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
    const previewUrl = `/preview/${article.slug || 'new-article'}`;
    window.open(previewUrl, '_blank');
  };

  // UPDATED: Image upload with SEO-friendly naming
  const imageUploadHandler = (blobInfo: any, progress: (percent: number) => void): Promise<string> => 
    new Promise((resolve, reject) => {
      if (!CLOUDINARY_UPLOAD_PRESET) { 
        reject("Cloudinary upload preset is not configured."); 
        return; 
      }

      // Check if article has a title
      if (!article.title || article.title.trim() === '') {
        reject("Please enter an article title before uploading images.");
        return;
      }

      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      // Generate SEO-friendly public_id
      const articleSlug = createImageSlug(article.title || '');
      const count = imageCounterRef.current;
      const publicId = count === 1 
        ? `articles/${articleSlug}` 
        : `articles/${articleSlug}-${count}`;
      
      formData.append('public_id', publicId);
      formData.append('folder', 'articles');
      
      // Add context for metadata
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

  // UPDATED: Cloudinary widget with SEO-friendly naming
  const openCloudinaryWidget = (onSuccess: (url: string) => void) => {
    if (!(window as any).cloudinary) { 
      alert("Cloudinary script not loaded."); 
      return; 
    }

    // Check if article has a title
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
        
        // SEO-friendly naming
        folder: 'articles',
        publicId: count === 1 ? articleSlug : `${articleSlug}-${count}`,
        
        // Add metadata
        context: {
          custom: {
            alt: article.title,
            article_title: article.title,
          }
        },
        
        // Tags for organization
        tags: ['article-image', article.category || 'uncategorized'],
        
        // UI customization
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
  }
  
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
                  // Insert image at cursor position in editor
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
              
              {/* Display Options */}
              <div className="space-y-2 pt-2 border-t">
                <h4 className="text-sm font-bold text-gray-700">Display Options</h4>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show_author"
                    name="show_author"
                    checked={article.show_author || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-navy-blue focus:ring-navy-blue border-gray-300 rounded"
                  />
                  <label htmlFor="show_author" className="ml-2 text-sm text-gray-700">
                    Show Author Info
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show_publish_date"
                    name="show_publish_date"
                    checked={article.show_publish_date || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-navy-blue focus:ring-navy-blue border-gray-300 rounded"
                  />
                  <label htmlFor="show_publish_date" className="ml-2 text-sm text-gray-700">
                    Show Publish Date
                  </label>
                </div>
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
                      <option>Insurance Newsroom</option>
                      <option>Insurance Tips</option>
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

                 <div>
                    <label className="block text-sm font-bold text-gray-700 pb-2 pt-0">Tags</label>
                    <TagInput tags={article.tags || []} setTags={handleTagsChange} />
                    <button type="button" onClick={handleSuggestKeywords} className="mt-2 text-sm text-navy-blue hover:underline font-semibold">
                      Suggest Tags & Keywords
                    </button>
                 </div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-md space-y-2">
                <h3 className="text-md font-bold text-navy-blue border-b pb-0 pt-0">Search Engine Optimization</h3>
                <div>
                    <label htmlFor="metaTitle" className="block text-sm font-bold text-gray-700">Meta Title</label>
                    <input type="text" id="metaTitle" name="metaTitle" value={article.metaTitle || ''} onChange={handleChange}
                        className="mt-1 block w-full px-2 py-2 bg-white text-sm border border-gray-300 rounded-md shadow-sm" />
                    <p className="text-xs text-gray-500 mt-1">Appears in search results and browser tabs. Keep it under 60 characters.</p>
                </div>
                <div>
                    <label htmlFor="metaDescription" className="block text-sm font-bold text-gray-700">Meta Description</label>
                    <textarea id="metaDescription" name="metaDescription" rows={3} value={article.metaDescription || ''} onChange={handleChange}
                        className="mt-1 block w-full px-2 py-2 bg-white text-sm border border-gray-300 rounded-md shadow-sm" placeholder="A brief summary for search engines." />
                    <p className="text-xs text-gray-500 mt-1">Appears in search results. Keep it under 160 characters.</p>
                </div>
                <div>
                    <label htmlFor="targetKeyword" className="block text-sm font-bold text-gray-700">Target Keyword</label>
                    <input type="text" id="targetKeyword" name="targetKeyword" value={article.targetKeyword || ''} onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white text-sm border border-gray-300 rounded-md shadow-sm" />
                    <p className="text-xs text-gray-500 mt-1">The main keyword this article is targeting.</p>
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