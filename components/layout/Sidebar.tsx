import React, { useEffect, useState } from 'react';
import { Article } from '@/types';
import SidebarArticleCard from '../shared/SidebarArticleCard';
import { supabase } from '@/lib/supabaseClient';

interface SidebarProps {
  topTips: Article[];
  topNews: Article[];
}

interface AdSlotState {
  code: string;
  enabled: boolean;
}

const SidebarAd: React.FC = () => {
  const [adSlot, setAdSlot] = useState<AdSlotState | null>(null);

  useEffect(() => {
    const fetchSidebarAd = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'ad_slots')
          .single();

        if (error) {
          console.error('Error fetching sidebar ad:', error);
        } else if (data && data.value) {
          const adSlots = data.value as any;
          setAdSlot(adSlots.sidebar || null);
        }
      } catch (err) {
        console.error('Error loading sidebar ad:', err);
      }
    };

    fetchSidebarAd();
  }, []);

  if (!adSlot || !adSlot.enabled || !adSlot.code) {
    return null;
  }

  return (
    <div className="my-0" dangerouslySetInnerHTML={{ __html: adSlot.code }} />
  );
};

const Sidebar: React.FC<SidebarProps> = ({ topTips, topNews }) => {
  return (
    <div className="space-y-0">
      {/* Top Sidebar Ad (render only if active) */}
      <SidebarAd />

      {topTips.length > 0 && (
        <ul className="space-y-2">
          {topTips.map((tip) => (
            <SidebarArticleCard key={`tip-${tip.id}`} article={tip} />
          ))}
        </ul>
      )}

      {/* Bottom Sidebar Ad (render only if active) */}
      <SidebarAd />

      {topNews.length > 0 && (
        <ul className="space-y-2">
          {topNews.map((news) => (
            <SidebarArticleCard key={`news-${news.id}`} article={news} />
          ))}
        </ul>
      )}
    </div>
  );
};
export default Sidebar;