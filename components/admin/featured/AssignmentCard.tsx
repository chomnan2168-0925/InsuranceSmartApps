import React, { useState } from 'react';
import { Article } from '@/types';
import ArticleSearchCombobox from './ArticleSearchCombobox';
import { supabase } from '@/lib/supabaseClient';

interface AssignmentCardProps {
  title: string;
  labelToAssign: string;
  description: string;
  assignedArticles: Article[];
  availableArticles: Article[];
  onUpdate: () => void;
  showLocations?: boolean; 
}

const ALL_LOCATIONS = ['Home Page', 'Calculators Page', 'Article View Pages'];

const AssignmentCard: React.FC<AssignmentCardProps> = ({ title, labelToAssign, description, assignedArticles, availableArticles, onUpdate, showLocations = false }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };

  const handleAssign = async () => {
    if (!selectedArticle) {
      alert('Please search for and select an article to assign.');
      return;
    }
    if (showLocations && selectedLocations.length === 0) {
      alert('Please select at least one display location.');
      return;
    }
    setIsSaving(true);

    // ✅ FIXED: Use camelCase featuredLocations
    const updateData: { label: string; featuredLocations?: string[] } = {
      label: labelToAssign,
    };
    if (showLocations) {
      updateData.featuredLocations = selectedLocations;
    }
    
    const { error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', selectedArticle.id);

    if (error) {
      alert(`Failed to assign article: ${error.message}`);
    } else {
      alert(`Successfully assigned "${selectedArticle.title}".`);
      onUpdate();
    }
    setIsSaving(false);
    setSelectedArticle(null);
    setSelectedLocations([]);
  };

  const handleRemove = async (article: Article) => {
    if (window.confirm(`Are you sure you want to remove the "${labelToAssign}" label from "${article.title}"?`)) {
      // ✅ FIXED: Use camelCase featuredLocations
      const { error } = await supabase
        .from('articles')
        .update({ label: null, featuredLocations: null })
        .eq('id', article.id);

      if (error) {
        alert(`Failed to remove assignment: ${error.message}`);
      } else {
        onUpdate();
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <h3 className="text-xl font-bold text-navy-blue">{title}</h3>
      <p className="text-sm text-gray-600 mt-1 flex-grow">{description}</p>
      
      <div className="mt-4 border-t pt-4">
        <h4 className="font-semibold mb-2 text-gray-800">Currently Assigned:</h4>
        <ul className="space-y-2">
          {assignedArticles.map(article => (
            <li key={article.id} className="p-3 border rounded-md flex justify-between items-center text-sm bg-gray-50">
              <div>
                <p className="font-semibold">{article.title}</p>
                {/* ✅ FIXED: Use camelCase featuredLocations */}
                {showLocations && article.featuredLocations && (
                  <p className="text-xs text-gray-500 mt-1">Locations: {article.featuredLocations.join(', ')}</p>
                )}
              </div>
              <button onClick={() => handleRemove(article)} className="text-red-500 hover:underline font-semibold flex-shrink-0 ml-2">Remove</button>
            </li>
          ))}
          {assignedArticles.length === 0 && <p className="text-sm text-gray-500 italic">No articles assigned.</p>}
        </ul>
      </div>

      <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold mb-2 text-gray-800">Assign New Article:</h4>
        <div className="space-y-4">
          <ArticleSearchCombobox
            articles={availableArticles}
            onSelect={setSelectedArticle}
            key={assignedArticles.length}
          />

          {showLocations && (
            <div>
              <p className="text-sm font-medium text-gray-700">Display Locations:</p>
              <div className="mt-2 space-y-2">
                {ALL_LOCATIONS.map(location => (
                  <label key={location} className="flex items-center gap-2 font-normal text-sm">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-navy-blue focus:ring-navy-blue"
                      checked={selectedLocations.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleAssign} disabled={isSaving || !selectedArticle} className="w-full px-4 py-2 bg-gold text-navy-blue font-bold rounded-md hover:bg-yellow-400 disabled:bg-gray-300">
            {isSaving ? 'Saving...' : 'Assign Article'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
