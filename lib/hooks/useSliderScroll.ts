// /lib/hooks/useSliderScroll.ts
import { useState, useEffect, RefObject, useCallback } from 'react';

// A simple debounce utility. You can also use one from a library like lodash.
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const useSliderScroll = (scrollRef: RefObject<HTMLDivElement>) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkForScrollPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // A small tolerance helps with fractional pixel values in some browsers
    const tolerance = 1; 
    const atStart = el.scrollLeft <= tolerance;
    const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - tolerance;

    setIsAtStart(atStart);
    setIsAtEnd(atEnd);
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    // Debounce the check function to avoid performance issues
    const debouncedCheck = debounce(checkForScrollPosition, 100);

    // Initial check on mount
    checkForScrollPosition();

    // Use passive listener for better scroll performance
    el.addEventListener('scroll', debouncedCheck, { passive: true });
    window.addEventListener('resize', debouncedCheck);

    return () => {
      el.removeEventListener('scroll', debouncedCheck);
      window.removeEventListener('resize', debouncedCheck);
    };
  }, [scrollRef, checkForScrollPosition]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    // Scroll by 90% of the visible width
    const amount = el.clientWidth * 0.9; 
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return { isAtStart, isAtEnd, scroll };
};