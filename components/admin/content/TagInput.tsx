import React, { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-navy-blue focus-within:border-navy-blue">
        {tags.map((tag) => (
          <div key={tag} className="flex items-center bg-navy-blue text-white text-sm font-medium pl-2 pr-1 rounded-full">
            <span>{tag}</span>
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 text-white hover:bg-blue-800 rounded-full h-4 w-4 flex items-center justify-center text-xs"
              aria-label={`Remove ${tag}`}
            >
              &times;
            </button>
          </div>
        ))}
         <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow p-0 border-0 focus:ring-0 text-sm"
            placeholder="Add a tag..."
          />
      </div>
      <p className="text-xs text-gray-500">Press Enter or comma to add a tag.</p>
    </div>
  );
};

export default TagInput;
