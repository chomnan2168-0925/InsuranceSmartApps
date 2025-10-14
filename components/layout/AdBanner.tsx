import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

interface AdSlotState {
  code: string;
  enabled: boolean;
}

interface AdBannerProps {
  position: 'top' | 'bottom';
  stickyOnScroll?: boolean; // New prop: makes ad sticky when scrolling
}

const AdBanner: React.FC<AdBannerProps> = ({ position, stickyOnScroll = false }) => {
  const router = useRouter();
  const [adSlot, setAdSlot] = useState<AdSlotState | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const staticAdRef = useRef<HTMLDivElement>(null);
  const [adHeight, setAdHeight] = useState(0);

  useEffect(() => {
    const fetchAdBanner = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'ad_slots')
          .single();

        if (error) {
          console.error(`Error fetching ${position} ad banner:`, error);
        } else if (data && data.value) {
          const adSlots = data.value as any;
          setAdSlot(adSlots[position] || null);
        }
      } catch (err) {
        console.error(`Error loading ${position} ad banner:`, err);
      }
    };

    fetchAdBanner();
  }, [position]);

  // Measure ad height after it loads
  useEffect(() => {
    if (staticAdRef.current && stickyOnScroll) {
      const height = staticAdRef.current.offsetHeight;
      setAdHeight(height);
    }
  }, [adSlot, stickyOnScroll]);

  // Handle scroll behavior with improved stability
  useEffect(() => {
    if (!stickyOnScroll || position !== 'top') return;

    let ticking = false;
    let lastScrollY = 0;

    const handleScroll = () => {
      lastScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Add buffer zone: only switch to sticky after scrolling past the ad + 50px
          const scrollThreshold = adHeight + 50;
          
          if (lastScrollY > scrollThreshold) {
            setIsSticky(true);
          } else {
            setIsSticky(false);
          }
          
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyOnScroll, position, adHeight]);

  // Don't display on admin pages
  if (router.pathname.startsWith('/admin')) return null;

  if (!adSlot || !adSlot.enabled || !adSlot.code) return null;

  // For top banner with stickyOnScroll behavior
  if (stickyOnScroll && position === 'top') {
    return (
      <>
        {/* Static ad that appears on page load */}
        <div 
          ref={staticAdRef}
          className="w-full transition-opacity duration-200"
          style={{ 
            opacity: isSticky ? 0 : 1,
            visibility: isSticky ? 'hidden' : 'visible',
            pointerEvents: isSticky ? 'none' : 'auto'
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: adSlot.code }} />
        </div>

        {/* Sticky/floating version of the SAME ad (appears when scrolling) */}
        <div
          className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg"
          style={{ 
            maxHeight: '120px', 
            overflow: 'hidden',
            transform: isSticky && isVisible ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.3s ease-in-out',
            opacity: isSticky && isVisible ? 1 : 0,
            visibility: isSticky && isVisible ? 'visible' : 'hidden',
            pointerEvents: isSticky && isVisible ? 'auto' : 'none'
          }}
        >
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-1 right-1 z-10 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-700 shadow-md transition-colors"
              aria-label="Close ad"
            >
              ×
            </button>
            <div dangerouslySetInnerHTML={{ __html: adSlot.code }} />
          </div>
        </div>
      </>
    );
  }

  // Regular banner (bottom banner or non-sticky top banner)
  return (
    <div className="w-full">
      <div dangerouslySetInnerHTML={{ __html: adSlot.code }} />
    </div>
  );
};

export default AdBanner;