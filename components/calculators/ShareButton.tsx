import React, { useState } from 'react';
import { CalculatorResult } from '@/context/CalculatorContext';
import { generateSocialShareData } from '@/lib/socialShare';

interface ShareButtonProps {
  result: CalculatorResult;
  colors: {
    gradient: string;
    text: string;
    bg: string;
    border: string;
  };
  resultElementId?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  result, 
  colors,
  resultElementId = 'latest-result-card' 
}) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const shareData = generateSocialShareData(result);

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareData.url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareData.url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy. Please try again.');
    }
  };

  // Capture screenshot using html2canvas
  const captureScreenshot = async (): Promise<Blob | null> => {
    const element = document.getElementById(resultElementId);
    if (!element) {
      console.error('Result element not found');
      return null;
    }

    try {
      // Dynamically import html2canvas only when needed
      const html2canvas = (await import('html2canvas')).default;
      
      // Find and hide the share button container temporarily
      const shareButtonContainer = element.querySelector('[data-share-button]') as HTMLElement;
      const originalDisplay = shareButtonContainer?.style.display;
      if (shareButtonContainer) {
        shareButtonContainer.style.display = 'none';
      }

      // Wait longer for DOM to fully update and render
      await new Promise(resolve => setTimeout(resolve, 250));
      
      // Capture the screenshot
      const canvas = await html2canvas(element, {
  background: '#ffffff',
  scale: 2,
  logging: false,
  useCORS: true,
  allowTaint: true,
  height: element.scrollHeight,
  width: element.scrollWidth,
} as any);  // Add "as any" here to bypass TypeScript checking
      
      // Restore the share button
      if (shareButtonContainer) {
        shareButtonContainer.style.display = originalDisplay || '';
      }

      // Close menu after capture
      setShowMenu(false);
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
      });
    } catch (error) {
      console.error('Screenshot failed:', error);
      return null;
    }
  };

  // Download screenshot
  const handleDownloadScreenshot = async () => {
    setIsCapturing(true);
    setShowMenu(false);
    try {
      const blob = await captureScreenshot();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${result.type}-insurance-estimate.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert('Failed to capture screenshot. Please try again.');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download screenshot.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Copy screenshot to clipboard
  const handleCopyScreenshot = async () => {
    setIsCapturing(true);
    setShowMenu(false);
    try {
      const blob = await captureScreenshot();
      if (blob && navigator.clipboard && ClipboardItem) {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        alert('Copy image not supported in your browser. Try downloading instead.');
      }
    } catch (error) {
      console.error('Copy screenshot failed:', error);
      alert('Failed to copy image. Try downloading instead.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Native share with image
  const handleNativeShare = async () => {
    setIsCapturing(true);
    setShowMenu(false);
    try {
      if (navigator.share) {
        const blob = await captureScreenshot();
        
        if (blob && navigator.canShare) {
          const file = new File([blob], 'insurance-estimate.png', { type: 'image/png' });
          const sharePayload = {
            title: shareData.title,
            text: shareData.description,
            url: shareData.url,
            files: [file],
          };

          if (navigator.canShare(sharePayload)) {
            await navigator.share(sharePayload);
          } else {
            // Fallback to text-only share
            await navigator.share({
              title: shareData.title,
              text: shareData.description,
              url: shareData.url,
            });
          }
        } else {
          // Text-only share
          await navigator.share({
            title: shareData.title,
            text: shareData.description,
            url: shareData.url,
          });
        }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Social media shares
  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.description)}`;
    window.open(facebookUrl, 'facebook-share', 'width=600,height=400');
    setShowMenu(false);
  };

  const shareViaTwitter = () => {
    const hashtags = shareData.hashtags.join(',');
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}&hashtags=${hashtags}`;
    window.open(twitterUrl, 'twitter-share', 'width=600,height=400');
    setShowMenu(false);
  };

  const shareViaLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`;
    window.open(linkedInUrl, 'linkedin-share', 'width=600,height=600');
    setShowMenu(false);
  };

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.description + '\n\n' + shareData.url)}`;
    window.open(whatsappUrl, '_blank');
    setShowMenu(false);
  };

  return (
    <div className="relative" data-share-button>
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all text-sm font-bold text-gray-700 group relative"
        aria-label="Share calculator results"
        disabled={isCapturing}
      >
        {isCapturing ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Results
          </>
        )}
        
        {copied && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-[100]">
            ✓ Copied!
          </span>
        )}
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setShowMenu(false)} />
          
          <div className="absolute bottom-full left-12 mb-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-3 w-72 z-[70]">
            <div className="flex items-center justify-between mb-3 px-2">
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                Share Your Results
              </h4>
              <button
                onClick={() => setShowMenu(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Screenshot Actions */}
            <div className="mb-3 pb-3 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadScreenshot}
                  disabled={isCapturing}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-colors text-white text-xs font-semibold disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={handleCopyScreenshot}
                  disabled={isCapturing}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-colors text-white text-xs font-semibold disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Image
                </button>
              </div>
            </div>
            
            {/* Native Share */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <>
                <button
                  onClick={handleNativeShare}
                  disabled={isCapturing}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-300 hover:to-purple-200 transition-all text-left mb-2 border border-gray-100 disabled:opacity-50"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900 block -mb-1">Share via...</span>
                    <span className="text-xs text-gray-600">Native share with image</span>
                  </div>
                </button>
                <div className="border-t border-gray-200 my-2"></div>
              </>
            )}
            
            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 gap-1">
              <button onClick={shareViaFacebook} className="flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>

              <button onClick={shareViaTwitter} className="flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 transition-colors text-white text-sm font-semibold shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </button>

              <button onClick={shareViaLinkedIn} className="flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 transition-colors text-white text-sm font-semibold shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>

              <button onClick={shareViaWhatsApp} className="flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 transition-colors text-white text-sm font-semibold shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;