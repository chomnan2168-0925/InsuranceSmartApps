import { GetServerSideProps } from 'next';
import React from 'react';
import fs from 'fs';
import path from 'path';
import SEO from '@/components/layout/SEO';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { ReportSummaryData, ReportDataItem } from '@/types';

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

// Define the SavedReport interface to match what's actually stored
interface SavedReport {
  id: string;
  title: string;
  period: string;
  data: ReportSummaryData; // Always use summary data for display
  rawData?: ReportDataItem[];
  aiSummary?: string;
  expires: string;
  createdAt: string;
}

interface PublicReportPageProps {
  report: SavedReport | null;
}

const PublicReportPage: React.FC<PublicReportPageProps> = ({ report }) => {
  if (!report) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <SEO title="Report Not Found" noindex />
        <div className="text-center py-20 px-4">
          <div className="mb-6">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Not Found</h1>
          <p className="text-gray-600 mb-6">
            This report may have expired, been revoked, or the link is incorrect.
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-navy-blue text-white rounded-md hover:bg-blue-900 transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Check if report has expired
  const isExpired = new Date(report.expires) < new Date();

  if (isExpired) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <SEO title="Report Expired" noindex />
        <div className="text-center py-20 px-4">
          <div className="mb-6">
            <svg className="mx-auto h-24 w-24 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Expired</h1>
          <p className="text-gray-600 mb-2">
            This report expired on {new Date(report.expires).toLocaleDateString()}.
          </p>
          <p className="text-gray-600 mb-6">
            Please contact the sender for an updated link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={report.title} 
        description={`Marketing report for ${report.period}`}
        noindex
      />
      <div className="bg-gray-50 min-h-screen py-8 md:py-12">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Expiry notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This report will expire on <strong>{new Date(report.expires).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Main report container */}
          <div className="bg-white p-6 md:p-10 rounded-lg border shadow-lg">
            <div className="text-center mb-8">
              <img src="/logo.png" alt="Logo" className="h-14 mx-auto filter invert mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-navy-blue">
                {report.title}
              </h1>
              <p className="text-gray-600 mt-3 text-lg whitespace-pre-wrap">
                {report.period}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">
                  Unique Visitors
                </p>
                <p className="text-4xl md:text-5xl font-bold text-navy-blue">
                  {Number(report.data.totalVisitors).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Total unique visitors during this period
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-sm">
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">
                  Pageviews
                </p>
                <p className="text-4xl md:text-5xl font-bold text-navy-blue">
                  {Number(report.data.pageviews).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Total pages viewed across all sessions
                </p>
              </div>
            </div>

            {report.aiSummary && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 md:p-8 rounded-r-lg my-10">
                <h3 className="text-2xl font-bold text-navy-blue mb-4">
                  Performance Summary
                </h3>
                <div 
                  className="prose prose-sm md:prose max-w-none text-gray-800" 
                  dangerouslySetInnerHTML={{ __html: report.aiSummary }} 
                />
              </div>
            )}

            {report.rawData && report.rawData.length > 0 && (
              <div className="mt-10 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-2xl font-bold text-navy-blue mb-6">
                  Monthly Trend Analysis
                </h3>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <ResponsiveContainer width="100%" height={350}>
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
                          borderRadius: '8px',
                          padding: '12px'
                        }}
                        formatter={(value: number) => value.toLocaleString()}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalVisitors" 
                        stroke="#1e3a8a" 
                        strokeWidth={3}
                        name="Unique Visitors" 
                        dot={{ fill: '#1e3a8a', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pageviews" 
                        stroke="#2563eb" 
                        strokeWidth={3}
                        name="Pageviews"
                        dot={{ fill: '#2563eb', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">
              This is a confidential marketing report. Do not distribute without authorization.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Generated on {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { reportId } = context.params!;
  const filePath = path.resolve(process.cwd(), 'data/sharableReports.json');
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn('sharableReports.json does not exist yet');
      return { notFound: true };
    }

    const fileData = fs.readFileSync(filePath, 'utf-8');
    const reportsDb = JSON.parse(fileData);
    const reportData = reportsDb[reportId as string];

    if (!reportData) {
      return { notFound: true };
    }

    // Transform the data to ensure it's always ReportSummaryData
    let finalReport: SavedReport;

    // If the stored data is an array, calculate summary
    if (Array.isArray(reportData.data)) {
      const rawData = reportData.data;
      let summaryData: ReportSummaryData;

      if (rawData.length > 0) {
        const totalVisitors = rawData.reduce((acc: number, cur: any) => {
          const visitors = cur.totalVisitors;
          return acc + (typeof visitors === 'number' ? visitors : 0);
        }, 0);

        const totalPageviews = rawData.reduce((acc: number, cur: any) => {
          const pageviews = cur.pageviews;
          return acc + (typeof pageviews === 'number' ? pageviews : 0);
        }, 0);

        const totalDurationSeconds = rawData.reduce((acc: number, cur: any) => {
          return acc + parseDuration(cur.avgSessionDuration);
        }, 0);
        const avgDuration = Math.round(totalDurationSeconds / rawData.length);

        const totalBounceRate = rawData.reduce((acc: number, cur: any) => {
          return acc + parseBounceRate(cur.bounceRate);
        }, 0);
        const avgBounceRate = totalBounceRate / rawData.length;

        summaryData = {
          totalVisitors,
          pageviews: totalPageviews,
          avgSessionDuration: `${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`,
          bounceRate: `${avgBounceRate.toFixed(1)}%`,
        };
      } else {
        summaryData = { totalVisitors: 0, pageviews: 0, avgSessionDuration: '0m 0s', bounceRate: '0%' };
      }

      finalReport = {
        id: reportData.id,
        title: reportData.title,
        period: reportData.period,
        data: summaryData,
        rawData: rawData,
        aiSummary: reportData.aiSummary,
        expires: reportData.expires,
        createdAt: reportData.createdAt,
      };
    }
    // If it's already a summary object
    else if (isReportSummaryData(reportData.data)) {
      finalReport = {
        id: reportData.id,
        title: reportData.title,
        period: reportData.period,
        data: reportData.data,
        rawData: reportData.rawData,
        aiSummary: reportData.aiSummary,
        expires: reportData.expires,
        createdAt: reportData.createdAt,
      };
    }
    // Fallback
    else {
      finalReport = {
        id: reportData.id,
        title: reportData.title,
        period: reportData.period,
        data: { totalVisitors: 0, pageviews: 0, avgSessionDuration: '0m 0s', bounceRate: '0%' },
        rawData: reportData.rawData,
        aiSummary: reportData.aiSummary,
        expires: reportData.expires,
        createdAt: reportData.createdAt,
      };
    }
    
    return { props: { report: finalReport } };
  } catch (error) {
    console.error("Failed to read report data", error);
    return { notFound: true };
  }
};

export default PublicReportPage;