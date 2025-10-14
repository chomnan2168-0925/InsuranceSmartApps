import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import AssignmentCard from './AssignmentCard';
import { Article } from '@/types';
import { supabase } from '@/lib/supabaseClient';

const FeaturedContentManager = () => {
  // State to hold all articles, loading status, and any errors
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- ONE FUNCTION TO FETCH/REFRESH DATA ---
  // This single function is now responsible for getting the latest data from Supabase.
  const fetchData = async () => {
    // We don't need to set loading to true here if it's just a refresh,
    // but it's good practice for the initial load.
    // setError(null) will clear old errors on a new fetch attempt.
    setError(null); 
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'Published'); // We only feature published articles

    if (error) {
      setError(`Failed to fetch articles: ${error.message}`);
      setAllArticles([]); // Clear articles on error
    } else {
      setAllArticles(data || []);
    }
    setLoading(false); // Set loading to false after the fetch is complete
  };

  // --- Use useEffect to call fetchData ONCE on initial component load ---
  useEffect(() => {
    fetchData();
  }, []); // The empty array [] ensures this runs only one time.

  // Filter the fetched articles into their respective "featured" groups.
  // This logic runs every time the component re-renders.
  const recommendedArticles = allArticles.filter(a => a.label === "Don't Miss!");
  const mostReadArticles = allArticles.filter(a => a.label === 'Most Read');
  const sponsoredArticles = allArticles.filter(a => a.label === 'Sponsored');

  // --- UI FEEDBACK: Show loading or error messages ---
  if (loading) {
    return (
        <div className="p-8 text-center text-gray-500">
            <p>Loading featured content data from Supabase...</p>
        </div>
    );
  }
  
  if (error) {
    return (
        <div className="p-8 text-center text-red-600 font-semibold bg-red-50 rounded-lg">
            <p>Error:</p>
            <p>{error}</p>
        </div>
    );
  }

  // --- Main component render ---
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Featured Content Management"
        subtitle="Manually assign articles to special promotion cards across the website."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <AssignmentCard 
          title="Recommended Card ('Don't Miss!')"
          labelToAssign="Don't Miss!"
          description="Highlights a specific post in key, high-traffic locations."
          assignedArticles={recommendedArticles}
          availableArticles={allArticles}
          onUpdate={fetchData} // Pass the single 'fetchData' function to handle updates
          showLocations={true}
        />
        <AssignmentCard 
          title="Most Read Card"
          labelToAssign="Most Read"
          description="Manually sets a post as 'Most Read' on category pages."
          assignedArticles={mostReadArticles}
          availableArticles={allArticles}
          onUpdate={fetchData} // Pass the same function here
        />
        <AssignmentCard 
          title="Sponsored Card"
          labelToAssign="Sponsored"
          description="Assigns a sponsored post to appear prominently on category pages."
          assignedArticles={sponsoredArticles}
          availableArticles={allArticles}
          onUpdate={fetchData} // And here
        />
      </div>
    </div>
  );
};

export default FeaturedContentManager;