// components/CookieConsent.tsx
// ✅ UPDATED: Fixed localStorage access, improved consent flow, better UX

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface CookieConsentProps {
  enabled?: boolean;
  excludePaths?: string[];
  style?: 'corner' | 'minimal';
  position?: 'bottom-left' | 'bottom-right';
}

const CookieConsent: React.FC<CookieConsentProps> = ({
  enabled = true,
  excludePaths = [],
  style = 'corner',
  position = 'bottom-right',
}) => {
  const router = useRouter();
  const bannerRef = useRef<HTMLDivElement>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoAcceptTimer, setAutoAcceptTimer] = useState(5);
  const [isClient, setIsClient] = useState(false);
  
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    advertising: false, // Changed default to false for better privacy
  });

  // ✅ FIX: Ensure we're on client-side before accessing localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-accept countdown
  useEffect(() => {
    if (!showBanner || isMinimized || showSettings) return;

    const interval = setInterval(() => {
      setAutoAcceptTimer(prev => {
        if (prev <= 1) {
          handleAcceptAll();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showBanner, isMinimized, showSettings]);

  // Initial banner display logic
  useEffect(() => {
    if (!enabled || !isClient) return;

    const isExcluded = excludePaths.some(path => 
      router.pathname.includes(path)
    );
    if (isExcluded) return;

    try {
      const consent = localStorage.getItem('cookieConsent');
      const consentDate = localStorage.getItem('cookieConsentDate');
      
      if (!consent || !consentDate) {
        // First time visitor - show banner after 2 seconds
        setTimeout(() => {
          setShowBanner(true);
          setTimeout(() => setIsVisible(true), 100);
        }, 2000);
      } else {
        // Check if consent is older than 1 year
        const consentTime = new Date(consentDate).getTime();
        const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
        
        if (consentTime < oneYearAgo) {
          // Consent expired - ask again
          setTimeout(() => {
            setShowBanner(true);
            setTimeout(() => setIsVisible(true), 100);
          }, 2000);
        } else {
          // Consent still valid - apply saved preferences
          const savedPrefs = localStorage.getItem('cookiePreferences');
          if (savedPrefs) {
            const prefs = JSON.parse(savedPrefs);
            updateGtagConsent(prefs);
          }
        }
      }
    } catch (error) {
      console.error('Error reading cookie consent:', error);
    }
  }, [enabled, excludePaths, router.pathname, isClient]);

  // Click outside to minimize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bannerRef.current && !bannerRef.current.contains(event.target as Node) && !isMinimized) {
        setIsMinimized(true);
      }
    };

    if (showBanner && isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside as any);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as any);
    };
  }, [showBanner, isVisible, isMinimized]);

  // ✅ NEW: Separate function to update gtag consent
  const updateGtagConsent = (prefs: typeof preferences) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        ad_storage: prefs.advertising ? 'granted' : 'denied',
        ad_user_data: prefs.advertising ? 'granted' : 'denied',
        ad_personalization: prefs.advertising ? 'granted' : 'denied',
      });
      
      // ✅ Log for debugging (remove in production)
      console.log('Cookie consent updated:', prefs);
    }
  };

  const handleAcceptAll = () => {
    saveConsent('accepted', { necessary: true, analytics: true, advertising: true });
  };

  const handleDeclineAll = () => {
    saveConsent('declined', { necessary: true, analytics: false, advertising: false });
  };

  const handleSavePreferences = () => {
    saveConsent('custom', preferences);
  };

  const saveConsent = (type: string, prefs: typeof preferences) => {
    if (!isClient) return;

    try {
      localStorage.setItem('cookieConsent', type);
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
      localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
      
      // Update gtag consent
      updateGtagConsent(prefs);
      
      // ✅ NEW: Trigger a custom event for tracking consent changes
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'cookie_consent', {
          consent_type: type,
          analytics: prefs.analytics,
          advertising: prefs.advertising,
        });
      }
      
      closeBanner();
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  const closeBanner = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  // ✅ Don't render anything on server-side or if not enabled
  if (!isClient || !showBanner) return null;

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  // Minimized floating button
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className={`fixed ${positionClasses[position]} z-50 bg-blue-600 text-white p-3 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-110`}
        aria-label="Open Cookie Settings"
        title="Cookie Settings"
      >
        <span className="text-2xl" role="img" aria-label="cookie">🍪</span>
      </button>
    );
  }

  // Corner style - MOBILE OPTIMIZED
  if (style === 'corner') {
    return (
      <div
        ref={bannerRef}
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
        className={`fixed ${positionClasses[position]} z-50 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ maxWidth: '360px', width: 'calc(100% - 32px)' }}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-base" role="img" aria-label="cookie">🍪</span>
                <h3 id="cookie-banner-title" className="text-xs font-bold text-gray-900">
                  Cookie Settings
                </h3>
              </div>
              {!showSettings && (
                <span className="text-[10px] text-gray-600 bg-white px-2 py-0.5 rounded-full">
                  Auto-accept in {autoAcceptTimer}s
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          {!showSettings ? (
            <div className="p-3">
              <p id="cookie-banner-description" className="text-[10px] leading-snug text-gray-700 mb-2">
                We use cookies to improve your experience and analyze site traffic.{' '} Learn more... 
                <Link href="/cookie-policy" className="text-blue-600 hover:underline font-medium">
                  {' '} Cookie Policy
                </Link>
                 {' '} and
                <Link href="/privacy-policy" className="text-blue-600 hover:underline font-medium">
                {' '} Privacy Policy
                </Link>
              </p>

              <div className="space-y-1.5">
                <button
                  onClick={handleAcceptAll}
                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
                  aria-label="Accept all cookies"
                >
                  Accept All
                </button>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setShowSettings(true);
                      setAutoAcceptTimer(999); // Pause timer
                    }}
                    className="flex-1 px-2 py-1.5 bg-white text-gray-700 text-[10px] font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
                    aria-label="Customize cookie preferences"
                  >
                    Customize
                  </button>
                  <button
                    onClick={handleDeclineAll}
                    className="flex-1 px-2 py-1.5 bg-white text-gray-700 text-[10px] font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
                    aria-label="Decline non-essential cookies"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <button
                onClick={() => {
                  setShowSettings(false);
                  setAutoAcceptTimer(10); // Reset timer
                }}
                className="text-[10px] text-blue-600 hover:underline mb-2 flex items-center"
                aria-label="Go back to main cookie settings"
              >
                <span className="mr-1" aria-hidden="true">←</span> Back
              </button>

              <div className="space-y-2 mb-3">
                {/* Essential */}
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <div className="flex-1">
                    <h4 className="text-[10px] font-semibold text-gray-900">Essential Cookies</h4>
                    <p className="text-[9px] text-gray-500">Required for site functionality</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[9px] text-gray-500 mr-1">Always On</span>
                    <div className="w-8 h-4 bg-blue-600 rounded-full flex items-center px-0.5">
                      <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <div className="flex-1">
                    <h4 className="text-[10px] font-semibold text-gray-900">Analytics Cookies</h4>
                    <p className="text-[9px] text-gray-500">Help us improve the site</p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                    aria-label={`${preferences.analytics ? 'Disable' : 'Enable'} analytics cookies`}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                  >
                    <div className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${
                      preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        preferences.analytics ? 'translate-x-4' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </button>
                </div>

                {/* Advertising */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex-1">
                    <h4 className="text-[10px] font-semibold text-gray-900">Advertising Cookies</h4>
                    <p className="text-[9px] text-gray-500">Personalized ads (optional)</p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, advertising: !preferences.advertising })}
                    aria-label={`${preferences.advertising ? 'Disable' : 'Enable'} advertising cookies`}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                  >
                    <div className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${
                      preferences.advertising ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        preferences.advertising ? 'translate-x-4' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
                aria-label="Save cookie preferences"
              >
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Minimal bar style - ULTRA COMPACT
  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-labelledby="cookie-bar-title"
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p id="cookie-bar-title" className="text-[10px] text-gray-700 flex-1">
              <span role="img" aria-label="cookie">🍪</span> We use cookies to improve your experience. Auto-accept in {autoAcceptTimer}s.{' '}
              <Link href="/privacy-policy" className="text-blue-600 underline hover:text-blue-700">
                Learn more
              </Link>
            </p>
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={handleDeclineAll}
                className="px-2 py-1 text-[10px] text-gray-700 hover:bg-gray-100 rounded transition-colors"
                aria-label="Decline non-essential cookies"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-3 py-1 bg-blue-600 text-white text-[10px] font-medium rounded hover:bg-blue-700 transition-colors"
                aria-label="Accept all cookies"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;