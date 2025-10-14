import React from 'react';

interface AdSlotState {
  code: string;
  enabled: boolean;
}

interface InPostAdProps {
  content: string;
  adSlot?: AdSlotState | null;
  spacing?: string;
  insertAfterParagraph?: number; // For automatic placement (default: 2)
  autoPlacement?: boolean; // Enable automatic placement (default: true)
}

const InPostAd: React.FC<InPostAdProps> = ({ 
  content, 
  adSlot, 
  spacing = '',
  insertAfterParagraph = 2,
  autoPlacement = true 
}) => {
  
  // Define all possible manual placeholder formats
  const placeholders = [
    '<div data-ad-placeholder="inpost">&nbsp;</div>',
    '<div data-ad-placeholder="inpost"></div>',
    '<!-- INPOST AD -->',
    '<!--INPOST AD-->',
    '{{INPOST_AD}}',
  ];

  // Check if content has any manual placeholder
  const hasManualPlaceholder = placeholders.some(ph => content.includes(ph));

  // If no ad slot or ad is disabled, return content without ad
  if (!adSlot || !adSlot.enabled || !adSlot.code) {
    // Remove placeholders if they exist (clean display)
    let cleanContent = content;
    if (hasManualPlaceholder) {
      placeholders.forEach(placeholder => {
        const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        cleanContent = cleanContent.replace(regex, '');
      });
    }
    
    return (
      <div 
        className={spacing}
        dangerouslySetInnerHTML={{ __html: cleanContent }} 
      />
    );
  }

  // Wrap ad code with minimal spacing
  const adHtml = `
    <div class="-my-8 -mt-6 flex justify-center">
      ${adSlot.code}
    </div>
  `;

  // PRIORITY 1: Manual Placeholder (if exists, use it regardless of autoPlacement setting)
  if (hasManualPlaceholder) {
    let finalContent = content;
    
    // Replace all placeholder formats with the actual ad
    placeholders.forEach(placeholder => {
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      finalContent = finalContent.replace(regex, adHtml);
    });
    
    return (
      <div 
        className={spacing}
        dangerouslySetInnerHTML={{ __html: finalContent }} 
      />
    );
  }

  // PRIORITY 2: Automatic Placement (using string manipulation for SSR compatibility)
  if (autoPlacement) {
    // Use regex to find paragraph tags and count only those with content
    const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gi;
    const matches = [];
    let match;
    
    // Find all paragraph matches
    while ((match = paragraphRegex.exec(content)) !== null) {
      const innerContent = match[1].trim();
      // Only count paragraphs with actual text (not just <br> or empty)
      if (innerContent && innerContent !== '<br>' && innerContent !== '<br/>' && innerContent !== '<br />') {
        matches.push({
          fullMatch: match[0],
          index: match.index,
          endIndex: match.index + match[0].length
        });
      }
    }
    
    // If we have enough paragraphs, insert ad after the specified one
    if (matches.length > insertAfterParagraph) {
      const targetParagraph = matches[insertAfterParagraph];
      const beforeAd = content.substring(0, targetParagraph.endIndex);
      const afterAd = content.substring(targetParagraph.endIndex);
      
      const finalContent = beforeAd + adHtml + afterAd;
      
      return (
        <div 
          className={spacing}
          dangerouslySetInnerHTML={{ __html: finalContent }} 
        />
      );
    }
  }

  // FALLBACK: No placeholder, not enough paragraphs, or autoPlacement disabled
  return (
    <div 
      className={spacing}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
};

export default InPostAd;