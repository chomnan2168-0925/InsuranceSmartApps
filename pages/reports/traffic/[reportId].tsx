// FIX: Implemented a dynamic traffic report page with server-side Gemini API integration.
import React from 'react';
import { GetServerSideProps } from 'next';
import { GoogleGenAI } from '@google/genai';
import SEO from '@/components/layout/SEO';
import SectionHeader from '@/components/ui/SectionHeader';

// Mock Data - In a real app, this would come from a database
const mockReports = {
  'q3-2024-summary': {
    id: 'q3-2024-summary',
    title: 'Q3 2024 Traffic Report',
    period: 'July 1, 2024 - September 30, 2024',
    data: {
      totalVisitors: 1520394,
      uniqueVisitors: 1210932,
      pageviews: 4890123,
      avgSessionDuration: '3m 15s',
      bounceRate: '45.2%',
      topSources: [
        { source: 'Organic Search', visitors: 850123, percentage: 55.9 },
        { source: 'Direct', visitors: 401293, percentage: 26.4 },
        { source: 'Social Media', visitors: 150239, percentage: 9.9 },
        { source: 'Referral', visitors: 118739, percentage: 7.8 },
      ],
      topPages: [
        { path: '/', views: 950234 },
        { path: '/tips/understanding-401k-options', views: 320198 },
        { path: '/ask-an-expert', views: 250934 },
      ],
    },
  },
  'q2-2024-summary': {
    id: 'q2-2024-summary',
    title: 'Q2 2024 Traffic Report',
    period: 'April 1, 2024 - June 30, 2024',
    data: {
      totalVisitors: 1350000,
      uniqueVisitors: 1100000,
      pageviews: 4100000,
      avgSessionDuration: '2m 55s',
      bounceRate: '48.1%',
      topSources: [
          { source: 'Organic Search', visitors: 790000, percentage: 58.5 },
          { source: 'Direct', visitors: 350000, percentage: 25.9 },
          { source: 'Social Media', visitors: 120000, percentage: 8.9 },
          { source: 'Referral', visitors: 90000, percentage: 6.7 },
      ],
      topPages: [
          { path: '/', views: 800000 },
          { path: '/tips/creating-a-budget-that-works', views: 280000 },
          { path: '/news', views: 190000 },
      ],
    },
  }
};

interface ReportPageProps {
  report: typeof mockReports[keyof typeof mockReports];
  aiSummary: string;
  error?: string;
}

const StatCard = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-navy-blue">{value}</p>
  </div>
);

const TrafficReportPage: React.FC<ReportPageProps> = ({ report, aiSummary, error }) => {
  if (!report) {
    return <div>Report not found.</div>;
  }

  const { data } = report;

  return (
    <>
      <SEO title={report.title} />
      <div className="space-y-12">
        <SectionHeader title={report.title} subtitle={`Data for period: ${report.period}`} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Visitors" value={data.totalVisitors.toLocaleString()} />
          <StatCard label="Pageviews" value={data.pageviews.toLocaleString()} />
          <StatCard label="Avg. Session Duration" value={data.avgSessionDuration} />
          <StatCard label="Bounce Rate" value={data.bounceRate} />
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-navy-blue mb-2">AI-Generated Summary</h3>
            {error ? (
                 <p className="text-red-600">Could not generate AI summary: {error}</p>
            ) : (
                <div className="prose prose-sm max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: aiSummary }} />
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-navy-blue mb-4">Top Traffic Sources</h3>
                <ul className="space-y-2">
                    {data.topSources.map(s => (
                        <li key={s.source} className="flex justify-between items-center text-sm">
                            <span>{s.source}</span>
                            <span className="font-medium text-gray-700">{s.visitors.toLocaleString()} ({s.percentage}%)</span>
                        </li>
                    ))}
                </ul>
            </div>
             <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-navy-blue mb-4">Most Viewed Pages</h3>
                 <ul className="space-y-2">
                    {data.topPages.map(p => (
                        <li key={p.path} className="flex justify-between items-center text-sm">
                            <span className="truncate pr-4">{p.path}</span>
                            <span className="font-medium text-gray-700">{p.views.toLocaleString()} views</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { reportId } = context.params;
    const report = mockReports[reportId as string];

    if (!report) {
        return { notFound: true };
    }

    if (!process.env.API_KEY) {
        return {
            props: {
                report,
                aiSummary: '',
                error: 'API_KEY environment variable not set. Cannot generate summary.',
            },
        };
    }
    
    try {
        // FIX: Initialize GoogleGenAI with named apiKey parameter as per guidelines.
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

        const prompt = `
            Analyze the following website traffic report data and provide a concise summary in HTML format (using <p>, <ul>, <li>, and <strong> tags). 
            Focus on key insights, trends, and potential areas for improvement.

            Report Title: ${report.title}
            Period: ${report.period}
            Data: ${JSON.stringify(report.data, null, 2)}
        `;

        // FIX: Use ai.models.generateContent with the correct model 'gemini-2.5-flash'.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // FIX: Extract text directly from the response.text property as per guidelines.
        const aiSummary = response.text;

        return {
            props: {
                report,
                aiSummary,
            },
        };
    } catch (e) {
        console.error('Gemini API call failed:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            props: {
                report,
                aiSummary: '',
                error: `${errorMessage} while contacting the AI service.`,
            },
        };
    }
};

export default TrafficReportPage;
