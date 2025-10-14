import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import DevToolCard from './DevToolCard';
import StatusIndicator from './StatusIndicator';
import { supabase } from '@/lib/supabaseClient'; // --- ADDED IMPORT ---

const DevAdminDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  // --- NEW: State to hold the live database connection status ---
  const [supabaseStatus, setSupabaseStatus] = useState<'operational' | 'error' | 'loading'>('loading');

  useEffect(() => {
    setIsClient(true);
    
    // --- NEW: Check Supabase connection on load ---
    const checkSupabaseConnection = async () => {
      // We perform a simple query to see if we get a valid response or an error.
      const { error } = await supabase.from('articles').select('id').limit(1);
      
      if (error) {
        // Any error (e.g., wrong key, network issue) will be caught here.
        setSupabaseStatus('error');
        console.error("Supabase connection check failed:", error.message);
      } else {
        // If we get a response with no error, the connection is good.
        setSupabaseStatus('operational');
      }
    };
    checkSupabaseConnection();
  }, []);

  const handleClearCache = async () => {
  if (confirm('This will trigger a new deployment of the entire site, which can take a few minutes. Are you sure you want to continue?')) {
    alert('Sending re-deployment request...');
    try {
      const res = await fetch('/api/admin/redeploy', { method: 'POST' });
      if (res.ok) {
        alert('Success! A new deployment has been triggered. It will be live in a few minutes.');
      } else {
        alert('Error: Failed to send re-deployment request.');
      }
    } catch (error) {
      alert('Error: Could not connect to the server.');
    }
  }
};

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Developer Admin Panel"
        subtitle="Tools for managing the application, infrastructure, and feature flags."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column */}
        <div className="space-y-8">
          <DevToolCard
            title="Cache Management"
            description="Force a rebuild of all static pages to reflect recent data changes."
          >
            <div className="flex items-center justify-between">
              <p className="text-sm">This action can take several minutes.</p>
              <button onClick={handleClearCache} className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700">
                Clear Site Cache
              </button>
            </div>
          </DevToolCard>

          {/* --- REMOVED: The "Feature Flags" card has been removed --- */}
          {/* This section is no longer needed as we have transitioned to a hybrid model. */}

        </div>

        {/* Right Column: Monitoring */}
        <div className="space-y-8">
          <DevToolCard
            title="System Health & Monitoring"
            description="Live status of critical third-party services."
          >
            <div className="border rounded-lg">
              {/* --- THIS IS NOW A LIVE INDICATOR --- */}
              <StatusIndicator status={supabaseStatus} label="Supabase Database" />
              
              {/* These remain as mock/placeholder statuses */}
              <StatusIndicator status="operational" label="Cloudinary Media API" />
              <StatusIndicator status="operational" label="Google Gemini API" />
              <StatusIndicator status="degraded" label="SheetDB API" />
              <StatusIndicator status="error" label="Email Service (Resend)" />
            </div>
          </DevToolCard>
          
           <DevToolCard
            title="Recent Server Errors"
            description="A live view of the 5 most recent errors from the server logs."
          >
            <div className="bg-gray-800 text-white font-mono text-xs p-4 rounded-md h-48 overflow-y-auto">
              {isClient ? (
                <>
                  <p>[{new Date().toISOString()}] ERROR: Failed to connect to email server.</p>
                  <p>[{new Date(Date.now() - 50000).toISOString()}] WARN: High latency detected from SheetDB API.</p>
                </>
              ) : (
                <p>Loading logs...</p>
              )}
            </div>
          </DevToolCard>
        </div>
      </div>
    </div>
  );
};

export default DevAdminDashboard;