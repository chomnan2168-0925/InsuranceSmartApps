// components/admin/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StatCard from './ui/StatCard';
import SectionHeader from '../ui/SectionHeader';
import QuickActions from './QuickActions';
import { supabase } from '@/lib/supabaseClient';
import { Article } from '@/types';

// ✅ NEW: Custom type for recent activity (only the fields we fetch)
interface RecentActivity {
  title: string;
  slug: string;
  createdAt?: string;
  status: string;
  lastUpdated?: string;
}

const Dashboard = () => {
  // Supabase data
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [publishedPosts, setPublishedPosts] = useState(0);
  const [draftPosts, setDraftPosts] = useState(0);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]); // ✅ FIXED: Use RecentActivity type
  
  // Form submissions from SheetDB
  const [formSubmissions, setFormSubmissions] = useState(0);
  const [todaySubmissions, setTodaySubmissions] = useState(0);
  
  // Analytics from Google Analytics
  const [siteVisitors, setSiteVisitors] = useState(0);
  const [visitorChange, setVisitorChange] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchSupabaseData(),
        fetchFormSubmissions(),
        fetchAnalyticsSummary(),
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard data");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupabaseData = async () => {
    try {
      const { count: totalCount, error: totalError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      const { count: publishedCount, error: publishedError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Published');

      if (publishedError) throw publishedError;

      const { count: draftCount, error: draftError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Draft');

      if (draftError) throw draftError;

      const { count: authorsCount, error: authorsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (authorsError) throw authorsError;

      const { data: recentArticles, error: activityError } = await supabase
        .from('articles')
        .select('title, slug, createdAt, status, lastUpdated')
        .order('lastUpdated', { ascending: false })
        .limit(5);

      if (activityError) throw activityError;

      setTotalPosts(totalCount || 0);
      setPublishedPosts(publishedCount || 0);
      setDraftPosts(draftCount || 0);
      setTotalAuthors(authorsCount || 0);
      setRecentActivity(recentArticles || []); // ✅ Now TypeScript is happy!
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
      throw err;
    }
  };

  const fetchFormSubmissions = async () => {
    try {
      const SHEETDB_API_URL = process.env.NEXT_PUBLIC_SHEETDB_API_URL;
      
      if (!SHEETDB_API_URL) {
        console.warn('SheetDB API URL not configured');
        return;
      }

      const response = await fetch(SHEETDB_API_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch form submissions');
      }

      const data = await response.json();
      
      const totalSubmissions = data.length;
      setFormSubmissions(totalSubmissions);

      const today = new Date().toISOString().split('T')[0];
      const todayCount = data.filter((submission: any) => {
        const submissionDate = submission.timestamp?.split('T')[0] || 
                               submission.date?.split('T')[0] ||
                               submission.created_at?.split('T')[0];
        return submissionDate === today;
      }).length;
      
      setTodaySubmissions(todayCount);

    } catch (err) {
      console.error('Error fetching form submissions:', err);
    }
  };

  const fetchAnalyticsSummary = async () => {
    try {
      const response = await fetch('/api/analytics?metric=visitors');
      
      if (!response.ok) {
        console.warn('Analytics API not available');
        return;
      }

      const data = await response.json();
      
      const visitors24h = data.last24h?.visitors || 0;
      const visitors7days = data.last7days?.visitors || 0;
      
      setSiteVisitors(visitors24h);
      
      if (visitors7days > 0) {
        const avgDaily = Math.round(visitors7days / 7);
        const change = ((visitors24h - avgDaily) / avgDaily) * 100;
        setVisitorChange(`${change > 0 ? '+' : ''}${change.toFixed(1)}%`);
      }

    } catch (err) {
      console.error('Error fetching analytics summary:', err);
    }
  };

  const stats = [
    { 
      title: 'Total Posts', 
      value: loading ? '...' : totalPosts.toLocaleString(),
      change: publishedPosts > 0 ? `${publishedPosts} published` : ''
    },
    { 
      title: 'Total Authors', 
      value: loading ? '...' : totalAuthors.toLocaleString(),
      change: draftPosts > 0 ? `${draftPosts} drafts` : ''
    },
    { 
      title: 'Form Submissions', 
      value: loading ? '...' : formSubmissions.toLocaleString(),
      change: todaySubmissions > 0 ? `${todaySubmissions} new today` : 'No new submissions'
    },
    { 
      title: 'Site Visitors (24h)', 
      value: loading ? '...' : siteVisitors.toLocaleString(),
      change: visitorChange
    },
  ];
  
  const formatTimeAgo = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    const statusColors: { [key: string]: string } = {
      'Published': 'bg-green-100 text-green-800',
      'Draft': 'bg-gray-100 text-gray-800',
      'Archived': 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${statusColors[status] || 'bg-blue-100 text-blue-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <SectionHeader title="Admin Dashboard" subtitle="Overview of website activity." className="text-left" />
        <button 
          onClick={fetchDashboardData}
          disabled={loading}
          className="px-4 py-2 bg-navy-blue text-white rounded hover:bg-opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} change={stat.change || ''} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-navy-blue mb-4">Recent Activity</h3>
          
          {loading && <p className="text-gray-500">Loading recent activity...</p>}
          
          {!loading && !error && (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.slug} className="py-3 border-b border-gray-200 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">Post updated:</span>
                        {getStatusBadge(activity.status)}
                      </div>
                      <Link 
                        href={`/admin0925/content/${activity.slug}`} 
                        className="text-navy-blue hover:underline block"
                      >
                        {activity.title}
                      </Link>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                      {formatTimeAgo(activity.lastUpdated || activity.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-gray-500">No recent articles found.</p>
              )}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
