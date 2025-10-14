// pages/api/forms/advertising.ts
import { NextApiRequest, NextApiResponse } from 'next';

//⚠️ IMPORTANT: No NEXT_PUBLIC_ prefix - this should be server-only
const ADVERTISING_SHEET_URL = process.env.SHEETDB_ADVERTISING_API;

// Rate limiting helper (simple in-memory store)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5; // Max 5 submissions per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Remove old timestamps outside the window
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (recentTimestamps.length >= MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }
  
  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return true;
}

// Input validation helper
function validateAdvertisingInput(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required fields
  if (!data.companyName || typeof data.companyName !== 'string' || data.companyName.trim().length === 0) {
    errors.push('Company name is required');
  }
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    }
  }
  
  if (!data.phone || typeof data.phone !== 'string') {
    errors.push('Phone number is required');
  }
  
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.push('Message is required');
  }
  
  // Optional: Check message length
  if (data.message && data.message.length > 5000) {
    errors.push('Message is too long (max 5000 characters)');
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
    console.error('[ADVERTISING] SheetDB API URL not configured');
    return res.status(500).json({ message: 'Server configuration error. Please contact support.' });
  }
  
  try {
    // Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const ipString = Array.isArray(ip) ? ip[0] : ip;
    
    if (!checkRateLimit(ipString)) {
      console.warn(`[ADVERTISING] Rate limit exceeded for IP: ${ipString}`);
      return res.status(429).json({ 
        message: 'Too many requests. Please try again in a minute.' 
      });
    }
    
    // Validate input
    const validation = validateAdvertisingInput(req.body);
    if (!validation.valid) {
      console.warn('[ADVERTISING] Validation failed:', validation.errors);
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
      // Metadata
      timestamp: new Date().toISOString(),
      submittedFrom: 'Website',
      ipAddress: ipString,
    };
    
    console.log('[ADVERTISING] Submitting inquiry from:', submissionData.email);
    
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
      const errorText = await response.text();
      console.error('[ADVERTISING] SheetDB error:', response.status, errorText);
      throw new Error(`Failed to save inquiry. Status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('[ADVERTISING] Successfully saved inquiry:', result);
    
    return res.status(200).json({ 
      message: 'Thank you! Your advertising inquiry has been received. We will contact you soon.',
      success: true 
    });
    
  } catch (error: any) {
    console.error('[ADVERTISING] Error submitting to SheetDB:', error);
    return res.status(500).json({ 
      message: 'Failed to submit your inquiry. Please try again later or contact us directly.',
      success: false
    });
  }
}