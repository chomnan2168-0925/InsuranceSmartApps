// /utils/screenshotUtils.ts
// Utility functions for capturing and sharing result screenshots

import html2canvas from 'html2canvas';

/**
 * Capture a screenshot of a DOM element
 * @param elementId - ID of the element to capture
 * @param options - Optional html2canvas configuration
 * @returns Promise with the canvas element
 */
export const captureScreenshot = async (
  elementId: string,
  options?: any  // Change this to "any"
): Promise<HTMLCanvasElement> => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  // Default options optimized for social media sharing
  const defaultOptions: any = {
  background: '#ffffff',  // Changed: backgroundColor → background
  scale: 2,
  logging: false,
  useCORS: true,
  allowTaint: true,
  ...options
  };

  try {
    const canvas = await html2canvas(element, defaultOptions);
    return canvas;
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    throw error;
  }
};

/**
 * Convert canvas to blob for uploading
 * @param canvas - Canvas element
 * @param type - Image MIME type
 * @param quality - Image quality (0-1)
 * @returns Promise with blob
 */
export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string = 'image/png',
  quality: number = 0.95
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      type,
      quality
    );
  });
};

/**
 * Download screenshot as image file
 * @param canvas - Canvas element
 * @param filename - Download filename
 */
export const downloadScreenshot = (
  canvas: HTMLCanvasElement,
  filename: string = 'insurance-estimate.png'
): void => {
  try {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

/**
 * Upload screenshot to server
 * @param blob - Image blob
 * @param metadata - Additional metadata
 * @returns Promise with upload response
 */
export const uploadScreenshot = async (
  blob: Blob,
  metadata?: Record<string, any>
): Promise<{ url: string; id: string }> => {
  try {
    const formData = new FormData();
    formData.append('image', blob, 'screenshot.png');
    
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await fetch('/api/upload-screenshot', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Screenshot upload failed:', error);
    throw error;
  }
};

/**
 * Copy image to clipboard (modern browsers)
 * @param canvas - Canvas element
 */
export const copyToClipboard = async (canvas: HTMLCanvasElement): Promise<void> => {
  try {
    if (!navigator.clipboard || !ClipboardItem) {
      throw new Error('Clipboard API not supported');
    }

    const blob = await canvasToBlob(canvas);
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    throw error;
  }
};

/**
 * Share via native Web Share API with image
 * @param canvas - Canvas element
 * @param title - Share title
 * @param text - Share text
 */
export const shareWithImage = async (
  canvas: HTMLCanvasElement,
  title: string,
  text: string,
  url?: string
): Promise<void> => {
  try {
    if (!navigator.share || !navigator.canShare) {
      throw new Error('Web Share API not supported');
    }

    const blob = await canvasToBlob(canvas, 'image/png');
    const file = new File([blob], 'insurance-estimate.png', { type: 'image/png' });

    const shareData: ShareData = {
      title,
      text,
      files: [file],
    };

    if (url) {
      shareData.url = url;
    }

    // Check if can share with files
    if (navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      // Fallback: share without image
      await navigator.share({ title, text, url });
    }
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Share failed:', error);
      throw error;
    }
  }
};

/**
 * Generate shareable image with branding
 * @param canvas - Original canvas
 * @param branding - Branding options
 * @returns New canvas with branding
 */
export const addBranding = (
  canvas: HTMLCanvasElement,
  branding?: {
    logo?: string;
    watermark?: string;
    footer?: string;
  }
): HTMLCanvasElement => {
  const newCanvas = document.createElement('canvas');
  const ctx = newCanvas.getContext('2d');
  
  if (!ctx) {
    return canvas;
  }

  // Add padding for branding
  const padding = 40;
  newCanvas.width = canvas.width + (padding * 2);
  newCanvas.height = canvas.height + (padding * 2) + 60; // Extra space for footer

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

  // Draw original canvas
  ctx.drawImage(canvas, padding, padding);

  // Add footer with branding
  if (branding?.footer) {
    ctx.fillStyle = '#6B7280';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      branding.footer,
      newCanvas.width / 2,
      newCanvas.height - 20
    );
  }

  return newCanvas;
};

// Install html2canvas: npm install html2canvas
// Install types: npm install --save-dev @types/html2canvas