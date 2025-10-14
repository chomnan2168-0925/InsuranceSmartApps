import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Defines the expected structure of a single ad slot's data
interface AdSlotState {
  code: string;
  enabled: boolean;
}

// Defines the props (instructions) we give to this component
interface AdPlacementProps {
  slotId: string; // The name of the ad we want to show, e.g., "inpost"
  spacing?: string; // An optional spacing class, e.g., "my-4"
}

const AdPlacement: React.FC<AdPlacementProps> = ({ slotId, spacing = 'my-2' }) => {
  // By default, the ad will have a medium margin ('my-6'). 
  // You can override this by providing a different value, like spacing="my-0".

  // This is the state that will hold our ad data once we find it.
  const [adSlot, setAdSlot] = useState<AdSlotState | null>(null);

  // useEffect runs on the user's browser, AFTER the page has loaded.
  useEffect(() => {
    const fetchAdSlot = async () => {
      try {
        // STEP 1: Query Supabase for the ad settings
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'ad_slots')
          .single();

        if (error) {
          console.error('Error fetching ad placement:', error);
          return;
        }

        // STEP 2: Check if any data was found
        if (data && data.value) {
          // STEP 3: The value is a JSONB object containing all ad slots
          const allAds = data.value as any;

          // STEP 4: Look inside the 'allAds' object for a key that matches the 'slotId'
          // For example, if we used <AdPlacement slotId="inpost" />, it looks for allAds['inpost'].
          const specificAd = allAds[slotId] || null;

          // STEP 5: Save the found ad data into our component's state
          setAdSlot(specificAd);
        }
      } catch (err) {
        // This is a safety net to prevent the site from crashing
        console.error("Failed to fetch ad placement from Supabase:", err);
      }
    };

    fetchAdSlot();
  }, [slotId]); // This logic will re-run if the slotId ever changes.

  // --- Rendering Logic ---

  // If we couldn't find an ad, or if the found ad is disabled, or has no code,
  // we render nothing (null). This is clean and safe.
  if (!adSlot || !adSlot.enabled || !adSlot.code) {
    return null;
  }

  // If we have a valid, enabled ad, we render it.
  return (
    // The outer container controls the spacing.
    <div className={`${spacing} flex justify-center`}>
      {/* This inner div securely renders the ad's HTML code. */}
      <div dangerouslySetInnerHTML={{ __html: adSlot.code }} />
    </div>
  );
};

export default AdPlacement;