// pages/api/forms/advertising.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// ⚠️ IMPORTANT: No NEXT_PUBLIC_ prefix - this should be server-only
const ADVERTISING_SHEET_URL = process.env.SHEETDB_ADVERTISING_API;

// Rate limiting helper (simple in-memory store)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5; // Max 5 submissions per minute per IP

// Cleanup old rate limit entries every minute to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((timestamps, key) => {
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
    if (recent.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, recent);
    }
  });
}, 60000);

// Hash IP for privacy compliance
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'advertising-salt').digest('hex').substring(0, 16);
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const hashedIP = hashIP(ip);
  const timestamps = rateLimitMap.get(hashedIP) || [];
  
  // Remove old timestamps outside the window
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (recentTimestamps.length >= MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }
  
  recentTimestamps.push(now);
  rateLimitMap.set(hashedIP, recentTimestamps);
  return true;
}

// Input validation helper
function validateAdvertisingInput(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required fields
  if (!data.companyName || typeof data.companyName !== 'string' || data.companyName.trim().length === 0) {
    errors.push('Company name is required');
  } else if (data.companyName.trim().length > 200) {
    errors.push('Company name is too long (max 200 characters)');
  }
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (data.name.trim().length > 100) {
    errors.push('Name is too long (max 100 characters)');
  }
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else {
    // Basic email validation - SAFE regex (no ReDoS vulnerability)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    } else if (data.email.length > 255) {
      errors.push('Email is too long');
    }
  }
  
  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
    errors.push('Phone number is required');
  } else if (data.phone.trim().length > 50) {
    errors.push('Phone number is too long');
  }
  
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.push('Message is required');
  } else if (data.message.length > 5000) {
    errors.push('Message is too long (max 5000 characters)');
  }
  
  // Optional fields validation
  if (data.website && typeof data.website === 'string' && data.website.length > 500) {
    errors.push('Website URL is too long');
  }
  
  if (data.budget && typeof data.budget === 'string' && data.budget.length > 100) {
    errors.push('Budget value is too long');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }
  
  // Check if SheetDB URL is configured
  if (!ADVERTISING_SHEET_URL) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ADVERTISING] SheetDB API URL not configured');
    }
    return res.status(500).json({ message: 'Server configuration error. Please contact support.' });
  }
  
  try {
    // Get IP address for rate limiting
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const ipString = Array.isArray(ip) ? ip[0] : ip;
    
    // Rate limiting check
    if (!checkRateLimit(ipString)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[ADVERTISING] Rate limit exceeded for hashed IP`);
      }
      return res.status(429).json({ 
        message: 'Too many requests. Please try again in a minute.' 
      });
    }
    
    // Validate input
    const validation = validateAdvertisingInput(req.body);
    if (!validation.valid) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[ADVERTISING] Validation failed:', validation.errors);
      }
      return res.status(400).json({ 
        message: 'Invalid input', 
        errors: validation.errors 
      });
    }
    
    // Sanitize and prepare data
    const submissionData = {
      companyName: req.body.companyName?.trim(),
      name: req.body.name?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      phone: req.body.phone?.trim(),
      message: req.body.message?.trim(),
      // Optional fields
      website: req.body.website?.trim() || '',
      budget: req.body.budget || '',
      // Metadata (no IP address stored for privacy)
      timestamp: new Date().toISOString(),
      submittedFrom: 'Website',
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[ADVERTISING] Submitting inquiry from:', submissionData.email);
    }
    
    // Submit to SheetDB
    const response = await fetch(ADVERTISING_SHEET_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ data: [submissionData] }),
    });
    
    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        const errorText = await response.text();
        console.error('[ADVERTISING] SheetDB error:', response.status, errorText);
      }
      throw new Error('Failed to save inquiry');
    }
    
    const result = await response.json();
    if (process.env.NODE_ENV === 'development') {
      console.log('[ADVERTISING] Successfully saved inquiry:', result);
    }
    
    return res.status(200).json({ 
      message: 'Thank you! Your advertising inquiry has been received. We will contact you soon.',
      success: true 
    });
    
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ADVERTISING] Error submitting to SheetDB:', error);
    }
    return res.status(500).json({ 
      message: 'Failed to submit your inquiry. Please try again later or contact us directly.',
      success: false
    });
  }
}
