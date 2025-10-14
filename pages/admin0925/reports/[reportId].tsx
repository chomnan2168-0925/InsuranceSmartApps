import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import SectionHeader from '@/components/ui/SectionHeader';
import sampleMarketingReports from '@/data/sampleMarketingReports.json';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import MarketingStatsChart from '@/components/marketing/MarketingStatsChart';
import { MarketingReportsData } from '@/types/marketing';
import type { ReportSummaryData, ReportDataItem } from '../../../types';

// Type guard to check if data is ReportSummaryData
function isReportSummaryData(data: any): data is ReportSummaryData {
  return data && typeof data === 'object' && !Array.isArray(data) && 'totalVisitors' in data;
}

// Helper function to safely parse duration string
function parseDuration(duration: any): number {
  if (typeof duration !== 'string') return 0;
  const parts = duration.match(/(\d+)m\s*(\d+)s/);
  if (parts) {
    return parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }
  return 0;
}

// Helper function to safely parse bounce rate
function parseBounceRate(bounceRate: any): number {
  if (typeof bounceRate === 'string') {
    return parseFloat(bounceRate.replace('%', '')) || 0;
  }
  if (typeof bounceRate === 'number') {
    return bounceRate;
  }
  return 0;
}

// Custom interface that extends the base report with editor-specific fields
// This avoids the union type issue by always using ReportSummaryData
interface ReportEditorReport {
  id: string;
  title: string;
  period: string;
  date: string; // Required by base Report interface
  data: ReportSummaryData; // Always use summary data, not union type
  rawData?: ReportDataItem[];
  aiSummary?: string;
}

const ReportSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-t pt-4 mt-4">
    <h4 className="text-md font-semibold mb-3 text-gray-800">{title}</h4>
    <div className="space-y-3">{children}</div>
  </div>
);

const ReportEditorPage = ({ report: initialReport }: { report: ReportEditorReport }) => {
  const [report, setReport] = useState<ReportEditorReport>(initialReport);
  const [statusMessage, setStatusMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReport((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
    }));
  };

  const handleSaveAndGenerateLink = async () => {
    setIsGenerating(true);
    setStatusMessage('🔄 Generating link...');
    
    try {
      const res = await fetch('/api/reports/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      if (res.ok) {
        const data = await res.json();
        const fullUrl = `${window.location.origin}${data.url}`;
        
        // Copy to clipboard
        await navigator.clipboard.writeText(fullUrl);
        
        setStatusMessage(`✅ Link generated & copied! Expires: ${data.expires}`);
        
        // Show the link in an alert for easy access
        alert(
          `Report Link Generated!\n\n` +
          `URL: ${fullUrl}\n` +
          `Expires: ${data.expires}\n\n` +
          `The link has been copied to your clipboard.`
        );
      } else {
        const errorData = await res.json();
        setStatusMessage(`❌ Error: ${errorData.message || 'Failed to generate link'}`);
      }
    } catch (error) {
      console.error("Failed to generate link:", error);
      setStatusMessage('❌ Error: Could not connect to the server.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Prepare data for the live preview chart
  const engagementChartData = [
    {
      label: 'Unique Visitors',
      value: Number(report.data.totalVisitors || 0).toLocaleString(),
      percentage: 100,
      color: 'bg-blue-800'
    },
    {
      label: 'Pageviews',
      value: Number(report.data.pageviews || 0).toLocaleString(),
      percentage: 90,
      color: 'bg-blue-600'
    },
    {
      label: 'Avg. Engagement',
      value: report.data.avgSessionDuration || '0m 0s',
      percentage: 75,
      color: 'bg-amber-500'
    },
  ];

  return (
    <>
      <SectionHeader
        title="Marketing Report Builder"
        subtitle="Create beautiful, sharable reports for partners and advertisers."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
        {/* Left Side: Form */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-md space-y-4">
          <div>
            <h3 className="text-lg font-bold text-navy-blue">Editable Data</h3>
            <p className="text-sm text-gray-500 mt-1">
              Changes made here will instantly update the live preview on the right.
            </p>
          </div>

          <ReportSection title="1. Report Details">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Report Title (Public)
              </label>
              <input
                type="text"
                value={report.title}
                onChange={(e) => setReport((r) => ({ ...r, title: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Q1 2024 Marketing Report"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Time Period (Display Text)
              </label>
              <textarea
                value={report.period}
                onChange={(e) => setReport((r) => ({ ...r, period: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="e.g., January - March 2024&#10;or Q1 2024"
              />
              <p className="text-xs text-gray-500 mt-1">
                This text will appear below the title. Use line breaks for multi-line display.
              </p>
            </div>
          </ReportSection>

          <ReportSection title="2. Visitor & Engagement Metrics">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Unique Visitors
                </label>
                <input
                  type="text"
                  name="totalVisitors"
                  value={Number(report.data.totalVisitors).toLocaleString()}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/,/g, '');
                    if (!isNaN(Number(numericValue))) {
                      setReport((prev) => ({
                        ...prev,
                        data: { ...prev.data, totalVisitors: Number(numericValue) },
                      }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md text-lg font-semibold focus:ring-2 focus:ring-blue-500"
                  placeholder="150000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Page Views
                </label>
                <input
                  type="text"
                  name="pageviews"
                  value={Number(report.data.pageviews).toLocaleString()}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/,/g, '');
                    if (!isNaN(Number(numericValue))) {
                      setReport((prev) => ({
                        ...prev,
                        data: { ...prev.data, pageviews: Number(numericValue) },
                      }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md text-lg font-semibold focus:ring-2 focus:ring-blue-500"
                  placeholder="500000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Avg. Time on Page
                </label>
                <input
                  type="text"
                  name="avgSessionDuration"
                  value={report.data.avgSessionDuration}
                  onChange={handleDataChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="2m 30s"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Bounce Rate
                </label>
                <input
                  type="text"
                  name="bounceRate"
                  value={report.data.bounceRate}
                  onChange={handleDataChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="45%"
                />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Engagement Overview</h5>
              <MarketingStatsChart stats={engagementChartData} />
            </div>
          </ReportSection>
        </div>

        {/* Right Side: Live Preview */}
        <div className="lg:col-span-3">
          <div className="sticky top-24">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-navy-blue">Live Preview</h3>
                <p className="text-sm text-gray-600">This is how your report will appear to recipients</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handleSaveAndGenerateLink}
                  disabled={isGenerating}
                  className="px-4 py-2 text-sm bg-gold text-navy-blue rounded-md font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? '⏳ Generating...' : '✨ Save & Generate Link'}
                </button>
                {statusMessage && (
                  <p className="text-sm font-medium text-right max-w-xs">
                    {statusMessage}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-lg max-h-[80vh] overflow-y-auto">
              {/* Report Preview */}
              <div className="text-center">
                <img src="/logo.png" alt="Your Logo" className="h-12 mx-auto filter invert" />
                <h1 className="text-2xl md:text-3xl font-bold text-navy-blue mt-4">
                  {report.title}
                </h1>
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                  {report.period}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 my-8 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Unique Visitors
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-navy-blue mt-2">
                    {Number(report.data.totalVisitors).toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Pageviews
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-navy-blue mt-2">
                    {Number(report.data.pageviews).toLocaleString()}
                  </p>
                </div>
              </div>

              {report.aiSummary && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
                  <h3 className="text-xl font-bold text-navy-blue mb-3">
                    AI-Generated Summary
                  </h3>
                  <div 
                    className="prose prose-sm max-w-none text-gray-800" 
                    dangerouslySetInnerHTML={{ __html: report.aiSummary }} 
                  />
                </div>
              )}

              {report.rawData && report.rawData.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md mt-6 border">
                  <h4 className="text-lg font-bold text-navy-blue mb-4">
                    Monthly Trend
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={report.rawData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalVisitors" 
                        stroke="#1e3a8a" 
                        strokeWidth={2}
                        name="Visitors" 
                        dot={{ fill: '#1e3a8a', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pageviews" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        name="Pageviews"
                        dot={{ fill: '#2563eb', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-8 pt-6 border-t text-center">
                <p className="text-xs text-gray-400">
                  This is a confidential marketing report. Do not distribute without authorization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { reportId } = context.params!;
  const { start, end } = context.query;

  const typedReportsData = sampleMarketingReports as unknown as MarketingReportsData;
  const reportData = typedReportsData.reports[reportId as string];

  if (!reportData) {
    return { notFound: true };
  }

  let rawData: ReportDataItem[] = [];
  let summaryData: ReportSummaryData;

  // If the data is an array, calculate the totals
  if (Array.isArray(reportData.data)) {
    const filteredData = (start && end)
      ? reportData.data.filter((item: ReportDataItem) => {
          const itemMonth = item.month;
          if (typeof itemMonth === 'string' && typeof start === 'string' && typeof end === 'string') {
            return itemMonth >= start && itemMonth <= end;
          }
          return true;
        })
      : reportData.data;

    rawData = filteredData;

    if (filteredData.length > 0) {
      // Safely extract and sum totalVisitors
      const totalVisitors = filteredData.reduce((acc, cur) => {
        const visitors = cur.totalVisitors;
        return acc + (typeof visitors === 'number' ? visitors : 0);
      }, 0);

      // Safely extract and sum pageviews
      const totalPageviews = filteredData.reduce((acc, cur) => {
        const pageviews = cur.pageviews;
        return acc + (typeof pageviews === 'number' ? pageviews : 0);
      }, 0);

      // Safely parse and sum duration
      const totalDurationSeconds = filteredData.reduce((acc, cur) => {
        return acc + parseDuration(cur.avgSessionDuration);
      }, 0);
      const avgDuration = Math.round(totalDurationSeconds / filteredData.length);

      // Safely parse and sum bounce rates
      const totalBounceRate = filteredData.reduce((acc, cur) => {
        return acc + parseBounceRate(cur.bounceRate);
      }, 0);
      const avgBounceRate = totalBounceRate / filteredData.length;

      summaryData = {
        totalVisitors,
        pageviews: totalPageviews,
        avgSessionDuration: `${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`,
        bounceRate: `${avgBounceRate.toFixed(1)}%`,
      };
    } else {
      summaryData = { totalVisitors: 0, pageviews: 0, avgSessionDuration: '0m 0s', bounceRate: '0%' };
    }
  }
  // If the data is already a summary object, use it
  else if (isReportSummaryData(reportData.data)) {
    summaryData = reportData.data;
  }
  // Fallback: create an empty summary
  else {
    summaryData = { totalVisitors: 0, pageviews: 0, avgSessionDuration: '0m 0s', bounceRate: '0%' };
  }

  const baseAiSummary = `
    <p>During this period, our platform demonstrated strong performance and engagement across all key metrics.</p>
    <p><strong>Highlights:</strong></p>
    <ul>
      <li>Attracted <strong>${Number(summaryData.totalVisitors).toLocaleString()}</strong> unique visitors</li>
      <li>Generated <strong>${Number(summaryData.pageviews).toLocaleString()}</strong> total pageviews</li>
      <li>Average engagement time of <strong>${summaryData.avgSessionDuration}</strong> per session</li>
      <li>Maintained a bounce rate of <strong>${summaryData.bounceRate}</strong></li>
    </ul>
    <p>These metrics reflect sustained audience interest and high-quality content engagement.</p>
  `;

  const finalReport: ReportEditorReport = {
    id: reportData.id,
    title: reportData.title,
    period: reportData.period || `Report Period: ${start || 'All Time'} to ${end || 'Present'}`,
    date: new Date().toISOString(), // Add the required date field
    data: summaryData, // Always ReportSummaryData, not union type
    rawData,
    aiSummary: baseAiSummary,
  };

  return {
    props: {
      report: finalReport
    },
  };
};

export default ReportEditorPage;