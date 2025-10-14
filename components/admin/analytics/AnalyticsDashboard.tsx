// components/admin/analytics/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import SectionHeader from '@/components/ui/SectionHeader';
import StatCard from '@/components/admin/ui/StatCard';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

interface AnalyticsData {
  metrics: {
    activeUsers: { value: number; change: string };
    newUsers: { value: number; change: string };
    sessions: { value: number; change: string };
    pageViews: { value: number };
    avgSessionDuration: { value: number; formatted: string };
    bounceRate: { value: string; formatted: string };
  };
  period: string;
}

interface CountryData {
  country: string;
  visitors: number;
  sessions: number;
  avgDurationFormatted: string;
}

interface PageData {
  title: string;
  path: string;
  pageViews: number;
  visitors: number;
  avgDuration: number;
}

interface VisitorData {
  last24h: { visitors: number; sessions: number };
  last7days: { visitors: number; sessions: number };
  last30days: { visitors: number; sessions: number };
  lastYear: { visitors: number; sessions: number };
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { position: 'top' as const },
  },
  interaction: { intersect: false, mode: 'index' as const },
};

// Interactive Chart Component
const InteractiveChart = ({ title, type = 'line', data }: { title: string; type?: 'line' | 'pie'; data: any }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-xl font-bold text-navy-blue mb-4">{title}</h3>
      <div className="relative flex-grow min-h-[320px]">
        {type === 'line' ? (
          <Line options={chartOptions} data={data} />
        ) : (
          <Pie options={chartOptions} data={data} />
        )}
      </div>
    </div>
  );
};

// Actionable Insights Component
const ActionableInsights = () => {
  const insights = [
    {
      title: "Visitor growth is strong",
      text: "You've seen an 8.1% increase in unique visitors this month. Keep up the momentum by publishing fresh content.",
      color: "green"
    },
    {
      title: "Improve page stickiness",
      text: "Your bounce rate is 45.2%. Try adding internal links to popular articles to keep users engaged on the site longer.",
      color: "yellow"
    },
    {
      title: "Organic search is winning",
      text: "Over 60% of your traffic comes from search engines. Focus on SEO for your new articles to capitalize on this.",
      color: "blue"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-xl font-bold text-navy-blue mb-4">Actionable Insights</h3>
      <div className="space-y-4">
        {insights.map(insight => (
          <div key={insight.title} className={`p-3 rounded-md border-l-4 ${
            insight.color === 'green' ? 'border-green-500 bg-green-50' :
            insight.color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
            'border-blue-500 bg-blue-50'
          }`}>
            <h4 className="font-bold text-gray-800">{insight.title}</h4>
            <p className="text-sm text-gray-600">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [topCountries, setTopCountries] = useState<CountryData[]>([]);
  const [topPages, setTopPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all analytics data in parallel
      const [overviewRes, visitorsRes, countriesRes, pagesRes] = await Promise.all([
        fetch('/api/analytics?metric=overview'),
        fetch('/api/analytics?metric=visitors'),
        fetch('/api/analytics?metric=countries'),
        fetch('/api/analytics?metric=pages'),
      ]);

      if (!overviewRes.ok || !visitorsRes.ok || !countriesRes.ok || !pagesRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const overview = await overviewRes.json();
      const visitors = await visitorsRes.json();
      const countries = await countriesRes.json();
      const pages = await pagesRes.json();

      setAnalyticsData(overview);
      setVisitorData(visitors);
      setTopCountries(countries.countries || []);
      setTopPages(pages.pages || []);

    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for visitor trends
  const getVisitorTrendData = () => {
    if (!visitorData) return null;

    return {
      labels: ['Last 24h', 'Last 7 days', 'Last 30 days', 'Last Year'],
      datasets: [
        {
          label: 'Visitors',
          data: [
            visitorData.last24h.visitors,
            visitorData.last7days.visitors,
            visitorData.last30days.visitors,
            visitorData.lastYear.visitors,
          ],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  // Prepare chart data for top countries (Pie chart)
  const getCountriesChartData = () => {
    if (topCountries.length === 0) return null;

    const topFive = topCountries.slice(0, 5);
    
    return {
      labels: topFive.map(c => c.country),
      datasets: [
        {
          label: 'Visitors by Country',
          data: topFive.map(c => c.visitors),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gaLink = gaMeasurementId 
    ? `https://analytics.google.com/analytics/web/#/p${gaMeasurementId.replace('G-', '')}/reports/reportinghub`
    : 'https://analytics.google.com/';

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader 
          title="Analytics Dashboard" 
          subtitle="Loading analytics data..." 
        />
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Fetching your analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SectionHeader 
          title="Analytics Dashboard" 
          subtitle="Website traffic and visitor insights" 
        />
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-red-800 mb-2">Unable to Load Analytics</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={fetchAllAnalytics}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
            <a
              href={gaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-navy-blue text-white rounded hover:bg-opacity-90"
            >
              View in Google Analytics
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SectionHeader 
          title="Analytics Dashboard" 
          subtitle="Live website traffic and visitor insights" 
        />
        <div className="flex gap-3">
          <button
            onClick={fetchAllAnalytics}
            disabled={loading}
            className="px-4 py-2 bg-navy-blue text-white rounded hover:bg-opacity-90 disabled:opacity-50"
          >
            Refresh
          </button>
          <a
            href={gaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gold text-navy-blue font-semibold rounded hover:bg-yellow-400"
          >
            Open Google Analytics
          </a>
        </div>
      </div>

      {/* Key Metrics Overview */}
      {analyticsData && (
        <>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-3">
              <strong>Period:</strong> {analyticsData.period}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Active Users"
              value={analyticsData.metrics.activeUsers.value.toLocaleString()}
              change={analyticsData.metrics.activeUsers.change}
            />
            <StatCard
              title="New Users"
              value={analyticsData.metrics.newUsers.value.toLocaleString()}
              change={analyticsData.metrics.newUsers.change}
            />
            <StatCard
              title="Total Sessions"
              value={analyticsData.metrics.sessions.value.toLocaleString()}
              change={analyticsData.metrics.sessions.change}
            />
            <StatCard
              title="Page Views"
              value={analyticsData.metrics.pageViews.value.toLocaleString()}
              change=""
            />
            <StatCard
              title="Avg Session Duration"
              value={analyticsData.metrics.avgSessionDuration.formatted}
              change=""
            />
            <StatCard
              title="Bounce Rate"
              value={analyticsData.metrics.bounceRate.formatted}
              change=""
            />
          </div>
        </>
      )}

      {/* Visitor Trends Over Time */}
      {visitorData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-navy-blue mb-4">Visitor Trends</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Last 24 Hours</p>
              <p className="text-2xl font-bold text-navy-blue">{visitorData.last24h.visitors.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <p className="text-sm text-gray-600">Last 7 Days</p>
              <p className="text-2xl font-bold text-navy-blue">{visitorData.last7days.visitors.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded">
              <p className="text-sm text-gray-600">Last 30 Days</p>
              <p className="text-2xl font-bold text-navy-blue">{visitorData.last30days.visitors.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <p className="text-sm text-gray-600">Last Year</p>
              <p className="text-2xl font-bold text-navy-blue">{visitorData.lastYear.visitors.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getVisitorTrendData() && (
          <InteractiveChart 
            title="Visitor Growth Over Time" 
            type="line" 
            data={getVisitorTrendData()} 
          />
        )}
        
        {getCountriesChartData() && (
          <InteractiveChart 
            title="Top 5 Countries" 
            type="pie" 
            data={getCountriesChartData()} 
          />
        )}
      </div>

      {/* Top Countries Table */}
      {topCountries.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-navy-blue mb-4">Top Countries (Last 30 Days)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCountries.map((country, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {country.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {country.visitors.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {country.sessions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {country.avgDurationFormatted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Pages Table */}
      {topPages.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-navy-blue mb-4">Top Pages (Last 30 Days)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Path
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitors
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPages.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                      {page.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {page.path}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.pageViews.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.visitors.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actionable Insights */}
      <ActionableInsights />
    </div>
  );
};

export default AnalyticsDashboard;