/**
 * /types/index.ts
 * Central type definitions - Matches YOUR actual database schema
 */

export interface Author {
  name: string;
  avatarUrl: string;
  bio?: string;
}

/**
 * Article interface - Matches your Supabase table exactly
 * Your database has BOTH camelCase and snake_case columns (duplicates)
 * We'll use snake_case as the standard
 */
export interface Article {
  // Primary fields
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string; // Your DB has this in camelCase
  
  // Category and status
  category: 'Insurance Newsroom' | 'Insurance Tips';
  status: 'Published' | 'Draft';
  label?: 'Sponsored' | 'Most Read' | "Don't Miss!" | null;
  
  // Tags as JSONB array
  tags?: string[];
  
  // Author (computed field, not in database)
  author?: Author;
  author_id?: string; // NEW: Link to profiles table
  
  // Date fields - snake_case (standard)
  created_at?: string;
  published_date?: string;
  last_updated?: string;
  
  // SEO fields - snake_case (standard, your DB has both)
  meta_title?: string;
  meta_description?: string;
  target_keyword?: string;
  
  // DEPRECATED: Old camelCase SEO fields (will be removed)
  metaTitle?: string;
  metaDescription?: string;
  targetKeyword?: string;
  
  // Display options - snake_case (standard)
  show_author?: boolean;
  show_publish_date?: boolean;
  
  // DEPRECATED: Old camelCase display option (will be removed)
  showAuthor?: boolean;
  
  // Featured locations (JSONB)
  featured_locations?: any;
  
  // Computed/helper fields
  date?: string; // For backwards compatibility
  views?: number;
  shares?: number;
  
  // Added for new features
  showPublishDate?: boolean; // Alias for show_publish_date
}

export interface Media {
  id: number;
  url: string;
  name: string;
  publicId: string;      // ← ADD: Cloudinary public ID (required for renaming)
  format?: string;       // ← ADD: Image format (jpg, png, etc.)
  bytes: number;         // ← ADD: File size in bytes (was 'size: string')
  size?: string;         // ← KEEP: For backwards compatibility if used elsewhere
  thumbnail?: string;    // ← ADD: Thumbnail URL for optimized loading
  altText?: string;
  caption?: string;
  createdAt?: string;    // ← ADD: Optional creation timestamp
}

export interface User {
  id: number | string; // Can be number or UUID string
  name: string;
  email: string;
  role: 'Administrator' | 'Editor' | 'Author';
  status: 'Active' | 'Invited';
}

// Marketing/Report interfaces
export interface ReportSummaryData {
  totalVisitors: number | string;
  pageviews: number | string;
  avgSessionDuration: string;
  bounceRate: string;
}

export interface ReportDataItem {
  [key: string]: any;
}

export interface Report {
  id: string;
  date?: string;
  title: string;
  period?: string;
  data: ReportSummaryData | ReportDataItem[];
  aiSummary?: string;
}