// components/articles/SocialShare.tsx
// UPDATED VERSION - Direct replacement with backward compatibility

import React, { useState } from 'react';
import FacebookIcon from '../icons/FacebookIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import TwitterIcon from '../icons/TwitterIcon';
import { Share2, Link as LinkIcon, MessageCircle, Check } from 'lucide-react';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  // NEW: Enhanced mode props (optional - maintains backward compatibility)
  enhanced?: boolean;
  compact?: boolean;
  article?: {
    slug: string;
    category: string;
    imageUrl?: string;
    author?: string;
  };
}

const SocialShare: React.FC<SocialShareProps> = ({ 
  url, 
  title, 
  description,
  enhanced = false,
  compact = false,
  article 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use provided props or fallback to current page info
  const articleUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const articleTitle = title || (typeof document !== 'undefined' ? document.title : 'Check out this article');
  const articleDescription = description || '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(articleTitle)}&summary=${encodeURIComponent(articleDescription)}`,
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(articleUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = articleUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Native Web Share API
  const handleUniversalShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          text: articleDescription,
          url: articleUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.log('Share cancelled or failed:', error);
        }
      } finally {
        setShowMenu(false);
      }
    } else {
      // Fallback: Copy link to clipboard
      await copyToClipboard();
    }
  };

  const shareViaWhatsApp = () => {
    const text = `${articleTitle}\n\n${articleDescription}\n\nRead more: ${articleUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setShowMenu(false);
  };
  // ===========================================
  // ORIGINAL SIMPLE MODE (Default - Backward Compatible)
  // ===========================================
  if (!enhanced) {
    return (
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-900 flex-shrink-0">Share Now:</h3>
          
          <div className="flex items-center gap-2">
            {/* Universal Share Button */}
            <button
              onClick={handleUniversalShare}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors"
              title="Share via..."
            >
              <Share2 className="w-4 h-4 text-gray-700" />
              <span className="text-gray-700">Share</span>
            </button>

            {/* Facebook */}
            <a 
              href={shareLinks.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-2.5 py-0.5 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.open(shareLinks.facebook, 'facebook-share', 'width=600,height=400');
              }}
            >
              <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
              <span className="text-[#1877F2]">Facebook</span>
            </a>

            {/* LinkedIn */}
            <a 
              href={shareLinks.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-1.5 px-2.5 py-0.5 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.open(shareLinks.linkedin, 'linkedin-share', 'width=600,height=400');
              }}
            >
              <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
              <span className="text-[#0A66C2]">LinkedIn</span>
            </a>

            {/* Twitter */}
            <a 
              href={shareLinks.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-1.5 px-2.5 py-0.5 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.open(shareLinks.twitter, 'twitter-share', 'width=600,height=400');
              }}
            >
              <TwitterIcon className="w-4 h-4 text-black" />
              <span className="text-black">Twitter</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================
  // ENHANCED MODE - NEW FEATURES
  // ===========================================

  // Compact version (for article headers)
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={copyToClipboard}
          className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
          title="Copy link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Copy Link</span>
            </>
          )}
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            window.open(shareLinks.facebook, 'facebook-share', 'width=600,height=400');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2] border border-[#1877F2] rounded-lg text-sm font-semibold hover:bg-[#166FE5] transition-all text-white"
          title="Share on Facebook"
        >
          <FacebookIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Facebook</span>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            window.open(shareLinks.twitter, 'twitter-share', 'width=600,height=400');
          }}
          className="flex items-center gap-1.5 px-3 py-0.5 bg-black border border-black rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all text-white"
          title="Share on Twitter"
        >
          <TwitterIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Twitter</span>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            window.open(shareLinks.linkedin, 'linkedin-share', 'width=600,height=600');
          }}
          className="flex items-center gap-1.5 px-3 py-0.5 bg-[#0A66C2] border border-[#0A66C2] rounded-lg text-sm font-semibold hover:bg-[#095196] transition-all text-white"
          title="Share on LinkedIn"
        >
          <LinkedInIcon className="w-4 h-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </button>
      </div>
    );
  }

  // Full enhanced version with dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Share article"
      >
        <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        Share Article
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />

          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-3 w-80 z-50 animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between mb-1.5 pb-2 border-b border-gray-200">
              <h4 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                Share This Article
              </h4>
              <button
                onClick={() => setShowMenu(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Article Preview */}
            <div className="mb-1.5 p-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <p className="text-xs font-bold text-gray-900 line-clamp-2 mb-0 px-2">
                {articleTitle}
              </p>
            </div>

            {/* Native Share */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <>
                <button
                  onClick={handleUniversalShare}
                  className="w-full flex items-center gap-3 px-4 py-1 rounded-xl hover:bg-gradient-to-r hover:from-blue-200 hover:to-purple-50 transition-all text-left mb-2 border border-gray-100 group"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900 block -mb-1">Share via...</span>
                    <span className="text-xs text-gray-600">Use your device share menu</span>
                  </div>
                </button>
                <div className="border-t border-gray-200 my-1.5"></div>
              </>
            )}

            {/* Social Media Grid */}
            <div className="grid grid-cols-2 gap-1 mb-1 -mt-2">
              <button
                onClick={() => {
                  window.open(shareLinks.facebook, 'facebook-share', 'width=600,height=400');
                  setShowMenu(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] transition-colors text-white text-sm font-semibold shadow-sm group"
              >
                <FacebookIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Facebook
              </button>

              <button
                onClick={() => {
                  window.open(shareLinks.twitter, 'twitter-share', 'width=600,height=400');
                  setShowMenu(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-blue-100 transition-colors text-white text-sm font-semibold shadow-sm group"
              >
                <TwitterIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Twitter
              </button>

              <button
                onClick={() => {
                  window.open(shareLinks.linkedin, 'linkedin-share', 'width=600,height=600');
                  setShowMenu(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#095196] transition-colors text-white text-sm font-semibold shadow-sm group"
              >
                <LinkedInIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                LinkedIn
              </button>

              <button
                onClick={shareViaWhatsApp}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] transition-colors text-white text-sm font-semibold shadow-sm group"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                WhatsApp
              </button>
            </div>

            <div className="border-t border-gray-200 my-1.5"></div>

            {/* Copy Link */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-4 py-0.5 rounded-xl hover:bg-blue-200 transition-colors text-left mb-1.5 border border-gray-200 group"
            >
              {copied ? (
                <>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-green-600 block">Link Copied!</span>
                    <span className="text-xs text-green-600">Ready to paste</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                    <LinkIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900 block -mb-2">Copy Link</span>
                    <span className="text-xs text-gray-600">Share anywhere</span>
                  </div>
                </>
              )}
            </button>

            {/* Footer */}
            <div className="mt-1 -mb-1 pt-2 border-t border-gray-200">
              <div className="flex items-start gap-1 px-1">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Pro tip:</span> Sharing helps others make better insurance decisions!
                </p>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-slideUp {
              animation: slideUp 0.2s ease-out;
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default SocialShare;