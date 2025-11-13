// components/admin/content/TagInput.tsx
// ✅ COMPLETE ENHANCED VERSION
// Based on your current version + new paste & favorite features
// 100% backward compatible - keeps all your existing functionality

import React, { useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');
  const [favoriteTags, setFavoriteTags] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // ✅ NEW: Fetch favorite tags from database
  useEffect(() => {
    const fetchFavoriteTags = async () => {
      setLoadingFavorites(true);
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'default_tags')
          .single();
        
        if (data && data.value && Array.isArray(data.value)) {
          setFavoriteTags(data.value);
        } else {
          // Fallback defaults if database doesn't have them yet
          setFavoriteTags([
            'Insurance',
            'Insurance Tips',
            'Save Money',
            'Auto Insurance',
            'Home Insurance',
            'Life Insurance',
            'Health Insurance',
            'US Insurance',
            'Insurance Guide'
          ]);
        }
      } catch (err) {
        console.error('Error loading favorite tags:', err);
        // Use fallback on error
        setFavoriteTags([
          'Insurance',
          'Insurance Tips',
          'Save Money'
        ]);
      }
      setLoadingFavorites(false);
    };

    fetchFavoriteTags();
  }, []);

  // ✅ NEW: Parse multiple tags from pasted text
  const parseMultipleTags = (text: string): string[] => {
    // Split by comma, semicolon, newline, or tab
    const separators = /[,;\n\t]/;
    const rawTags = text.split(separators);
    
    return rawTags
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .filter((tag, index, self) => self.indexOf(tag) === index); // Remove duplicates
  };

  // ✅ KEPT: Your original keyboard handler (enhanced)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      
      // ✅ NEW: Check if input contains multiple tags
      const parsedTags = parseMultipleTags(inputValue);
      
      if (parsedTags.length > 1) {
        // Add multiple tags at once
        const newTags = parsedTags.filter(tag => !tags.includes(tag));
        if (newTags.length > 0) {
          setTags([...tags, ...newTags]);
        }
      } else {
        // Original single tag logic
        const newTag = inputValue.trim();
        if (newTag && !tags.includes(newTag)) {
          setTags([...tags, newTag]);
        }
      }
      
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // ✅ NEW: Remove last tag when pressing backspace on empty input
      setTags(tags.slice(0, -1));
    }
  };

  // ✅ NEW: Handle paste event for multiple tags
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // Parse pasted text
    const parsedTags = parseMultipleTags(pastedText);
    
    if (parsedTags.length > 0) {
      // Add only new tags (avoid duplicates)
      const newTags = parsedTags.filter(tag => !tags.includes(tag));
      
      if (newTags.length > 0) {
        setTags([...tags, ...newTags]);
        setInputValue('');
        
        // Optional: Show success feedback
        console.log(`✅ Added ${newTags.length} tag(s):`, newTags.join(', '));
      } else {
        console.log('ℹ️ All pasted tags already exist');
      }
    }
  };

  // ✅ KEPT: Your original removeTag function
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // ✅ NEW: Add favorite tag
  const addFavoriteTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  // ✅ NEW: Toggle favorites panel
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <div className="space-y-2">
      {/* ✅ KEPT: Your original tags display (enhanced styling) */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div 
            key={index} 
            className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-gray-300 transition-colors"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 text-gray-500 hover:text-gray-800 font-bold"
              aria-label={`Remove ${tag}`}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* ✅ KEPT: Your original input field (enhanced with paste handler) */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
        placeholder="Type tag and press Enter, or paste multiple (comma-separated)"
      />

      {/* ✅ NEW: Helper text */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>
          💡 <strong>Quick tips:</strong>
        </p>
        <ul className="ml-4 list-disc space-y-0.5">
          <li>Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs font-mono">Enter</kbd> or <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs font-mono">,</kbd> to add a tag</li>
          <li>Paste multiple: <code className="text-xs bg-gray-100 px-1 rounded">Insurance, Tips, Auto</code> splits automatically</li>
          <li>Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs font-mono">Backspace</kbd> on empty field to remove last tag</li>
        </ul>
      </div>

      {/* ✅ NEW: Favorite Tags Section */}
      <div className="border-t pt-3 mt-3">
        <button
          type="button"
          onClick={toggleFavorites}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors w-full"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${showFavorites ? 'rotate-90' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>Quick Add Favorite Tags ({favoriteTags.length})</span>
          {showFavorites && (
            <span className="ml-auto text-xs text-gray-500">Click to hide</span>
          )}
        </button>

        {showFavorites && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md animate-fadeIn">
            {loadingFavorites ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading favorite tags...
              </div>
            ) : favoriteTags.length === 0 ? (
              <p className="text-sm text-gray-500">
                No favorite tags configured. Add some in Site Settings → Default Tags.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {favoriteTags.map((tag, index) => {
                    const isAlreadyAdded = tags.includes(tag);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addFavoriteTag(tag)}
                        disabled={isAlreadyAdded}
                        className={`
                          px-3 py-1.5 text-xs font-medium rounded-md transition-all
                          ${isAlreadyAdded
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 hover:shadow-sm'
                          }
                        `}
                        title={isAlreadyAdded ? 'Already added' : `Add "${tag}"`}
                      >
                        <span className="mr-1">
                          {isAlreadyAdded ? '✓' : '+'}
                        </span>
                        {tag}
                      </button>
                    );
                  })}
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    💡 <strong>Tip:</strong> Customize this list in Supabase → <code className="bg-white px-1 rounded">site_settings</code> table → <code className="bg-white px-1 rounded">default_tags</code>
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ✅ NEW: Tags counter */}
      {tags.length > 0 && (
        <p className="text-xs text-gray-600 mt-2">
          {tags.length} {tags.length === 1 ? 'tag' : 'tags'} added
        </p>
      )}
    </div>
  );
};

export default TagInput;
