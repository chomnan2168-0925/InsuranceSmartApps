/**
 * Marketing and Advertising Report Types
 */

export interface ReportDataItem {
  month: string;
  totalVisitors: number;
  pageviews: number;
  avgSessionDuration: number | string;
  bounceRate: number;
}

export interface ReportSummaryData {
  totalVisitors: number | string;
  pageviews: number | string;
  avgSessionDuration: string;
  bounceRate: string;
  topSources?: Array<{ source: string; visitors: number; percentage?: number }>;
  topPages?: Array<{ page: string; views: number }>;
}

export interface Report {
  id: string;
  title: string;
  period?: string; // Make optional since it's missing in your JSON
  data: ReportDataItem[] | ReportSummaryData;
  aiSummary?: string;
  topSources?: Array<{ source: string; visitors: number; percentage?: number }>;
  topPages?: Array<{ page: string; views: number }>;
}

export interface SavedReport extends Report {
  createdAt: string;
  expires: string;
  rawData?: ReportDataItem[];
  period: string; // Required in saved reports
}

export interface AdvertisingStats {
  uniqueVisitors: string;
  pageviews: string;
  avgEngagement: string;
}

export interface MarketingReportsData {
  reports: {
    [key: string]: Report;
  };
}