// pages/api/analytics.ts
// Pages Router API format

import type { NextApiRequest, NextApiResponse } from 'next';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';
import fs from 'fs';

const propertyId = process.env.GA_PROPERTY_ID;

// Initialize client
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

function getAnalyticsClient() {
  if (!analyticsDataClient) {
    // Try to use service account JSON file first
    const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      // Use JSON file
      analyticsDataClient = new BetaAnalyticsDataClient({
        keyFilename: serviceAccountPath,
      });
    } else {
      // Fall back to environment variables
      const clientEmail = process.env.GA_CLIENT_EMAIL;
      const privateKey = process.env.GA_PRIVATE_KEY;

      if (!clientEmail || !privateKey) {
        throw new Error('GA credentials not configured. Please provide either service-account.json or environment variables.');
      }

      // Clean and format the private key
      let formattedKey = privateKey.trim();
      
      // Remove any surrounding quotes
      formattedKey = formattedKey.replace(/^["']|["']$/g, '');
      
      // Ensure proper newline characters
      if (!formattedKey.includes('\n')) {
        formattedKey = formattedKey.replace(/\\n/g, '\n');
      }

      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: {
          client_email: clientEmail,
          private_key: formattedKey,
        },
      });
    }
  }
  
  return analyticsDataClient;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!propertyId) {
      return res.status(500).json({ error: 'GA Property ID not configured' });
    }

    // Get the analytics client
    const client = getAnalyticsClient();

    // Get the query parameter to determine which data to return
    const { metric } = req.query;

    // Route to different analytics based on query parameter
    switch (metric) {
      case 'overview':
        return await getOverviewMetrics(res, client);
      case 'visitors':
        return await getVisitorMetrics(res, client);
      case 'countries':
        return await getCountryMetrics(res, client);
      case 'pages':
        return await getTopPages(res, client);
      case 'comparison':
        return await getComparison(res, client);
      default:
        return await getOverviewMetrics(res, client);
    }

  } catch (error: any) {
    console.error('Error fetching analytics data:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to fetch analytics data';
    if (error.message?.includes('credentials') || error.message?.includes('service-account')) {
      errorMessage = 'Authentication credentials not found. Please check your configuration.';
    } else if (error.code === 2 || error.message?.includes('DECODER')) {
      errorMessage = 'Invalid private key format. Please regenerate your service account key from Google Cloud Console.';
    } else if (error.code === 7) {
      errorMessage = 'Permission denied. Make sure the service account has access to the Google Analytics property.';
    }
    
    return res.status(500).json({ 
      error: errorMessage, 
      details: error.message 
    });
  }
}

// Overview metrics for dashboard
async function getOverviewMetrics(res: NextApiResponse, client: BetaAnalyticsDataClient) {
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      { startDate: '30daysAgo', endDate: 'today' },
      { startDate: '60daysAgo', endDate: '31daysAgo' },
    ],
    metrics: [
      { name: 'activeUsers' },
      { name: 'newUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
    ],
  });

  const currentPeriod = response.rows?.[0]?.metricValues || [];
  const previousPeriod = response.rows?.[1]?.metricValues || [];

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const activeUsers = parseInt(currentPeriod[0]?.value || '0');
  const prevActiveUsers = parseInt(previousPeriod[0]?.value || '0');
  
  const newUsers = parseInt(currentPeriod[1]?.value || '0');
  const prevNewUsers = parseInt(previousPeriod[1]?.value || '0');

  const sessions = parseInt(currentPeriod[2]?.value || '0');
  const prevSessions = parseInt(previousPeriod[2]?.value || '0');

  const pageViews = parseInt(currentPeriod[3]?.value || '0');
  const avgDuration = parseFloat(currentPeriod[4]?.value || '0');
  const bounceRate = parseFloat(currentPeriod[5]?.value || '0');

  return res.status(200).json({
    period: 'Last 30 days',
    metrics: {
      activeUsers: {
        value: activeUsers,
        change: calculateChange(activeUsers, prevActiveUsers),
      },
      newUsers: {
        value: newUsers,
        change: calculateChange(newUsers, prevNewUsers),
      },
      sessions: {
        value: sessions,
        change: calculateChange(sessions, prevSessions),
      },
      pageViews: {
        value: pageViews,
      },
      avgSessionDuration: {
        value: Math.round(avgDuration),
        formatted: `${Math.floor(avgDuration / 60)}m ${Math.round(avgDuration % 60)}s`,
      },
      bounceRate: {
        value: (bounceRate * 100).toFixed(1),
        formatted: `${(bounceRate * 100).toFixed(1)}%`,
      },
    },
  });
}

// Detailed visitor metrics by time period
async function getVisitorMetrics(res: NextApiResponse, client: BetaAnalyticsDataClient) {
  const [last24h, last7days, last30days, lastYear] = await Promise.all([
    client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '1daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    }),
    client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    }),
    client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    }),
    client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '365daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    }),
  ]);

  return res.status(200).json({
    last24h: {
      visitors: parseInt(last24h[0].rows?.[0]?.metricValues?.[0]?.value || '0'),
      sessions: parseInt(last24h[0].rows?.[0]?.metricValues?.[1]?.value || '0'),
    },
    last7days: {
      visitors: parseInt(last7days[0].rows?.[0]?.metricValues?.[0]?.value || '0'),
      sessions: parseInt(last7days[0].rows?.[0]?.metricValues?.[1]?.value || '0'),
    },
    last30days: {
      visitors: parseInt(last30days[0].rows?.[0]?.metricValues?.[0]?.value || '0'),
      sessions: parseInt(last30days[0].rows?.[0]?.metricValues?.[1]?.value || '0'),
    },
    lastYear: {
      visitors: parseInt(lastYear[0].rows?.[0]?.metricValues?.[0]?.value || '0'),
      sessions: parseInt(lastYear[0].rows?.[0]?.metricValues?.[1]?.value || '0'),
    },
  });
}

// Visitors by country
async function getCountryMetrics(res: NextApiResponse, client: BetaAnalyticsDataClient) {
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'country' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'averageSessionDuration' },
    ],
    orderBys: [
      {
        metric: { metricName: 'activeUsers' },
        desc: true,
      },
    ],
    limit: 10,
  });

  const countries = response.rows?.map((row) => ({
    country: row.dimensionValues?.[0]?.value || 'Unknown',
    visitors: parseInt(row.metricValues?.[0]?.value || '0'),
    sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    avgDuration: Math.round(parseFloat(row.metricValues?.[2]?.value || '0')),
    avgDurationFormatted: formatDuration(parseFloat(row.metricValues?.[2]?.value || '0')),
  })) || [];

  return res.status(200).json({
    period: 'Last 30 days',
    countries,
  });
}

// Top pages
async function getTopPages(res: NextApiResponse, client: BetaAnalyticsDataClient) {
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pageTitle' }, { name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'activeUsers' },
      { name: 'averageSessionDuration' },
    ],
    orderBys: [
      {
        metric: { metricName: 'screenPageViews' },
        desc: true,
      },
    ],
    limit: 10,
  });

  const pages = response.rows?.map((row) => ({
    title: row.dimensionValues?.[0]?.value || 'Unknown',
    path: row.dimensionValues?.[1]?.value || '/',
    pageViews: parseInt(row.metricValues?.[0]?.value || '0'),
    visitors: parseInt(row.metricValues?.[1]?.value || '0'),
    avgDuration: Math.round(parseFloat(row.metricValues?.[2]?.value || '0')),
  })) || [];

  return res.status(200).json({
    period: 'Last 30 days',
    pages,
  });
}

// Period comparison
async function getComparison(res: NextApiResponse, client: BetaAnalyticsDataClient) {
  const [monthComparison, yearComparison] = await Promise.all([
    client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: '30daysAgo', endDate: 'today' },
        { startDate: '60daysAgo', endDate: '31daysAgo' },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
    }),
    client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: '365daysAgo', endDate: 'today' },
        { startDate: '730daysAgo', endDate: '366daysAgo' },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
    }),
  ]);

  const calculateComparison = (response: any) => {
    const current = response[0].rows?.[0]?.metricValues || [];
    const previous = response[0].rows?.[1]?.metricValues || [];

    const currentUsers = parseInt(current[0]?.value || '0');
    const previousUsers = parseInt(previous[0]?.value || '0');
    const currentSessions = parseInt(current[1]?.value || '0');
    const previousSessions = parseInt(previous[1]?.value || '0');
    const currentPageViews = parseInt(current[2]?.value || '0');
    const previousPageViews = parseInt(previous[2]?.value || '0');

    return {
      current: {
        users: currentUsers,
        sessions: currentSessions,
        pageViews: currentPageViews,
      },
      previous: {
        users: previousUsers,
        sessions: previousSessions,
        pageViews: previousPageViews,
      },
      changes: {
        users: calculatePercentChange(currentUsers, previousUsers),
        sessions: calculatePercentChange(currentSessions, previousSessions),
        pageViews: calculatePercentChange(currentPageViews, previousPageViews),
      },
    };
  };

  return res.status(200).json({
    monthComparison: calculateComparison(monthComparison),
    yearComparison: calculateComparison(yearComparison),
  });
}

// Helper functions
function calculatePercentChange(current: number, previous: number): string {
  if (previous === 0) return '+0%';
  const change = ((current - previous) / previous) * 100;
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}