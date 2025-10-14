import React from "react";
import { GetStaticProps } from "next";
import SEO from "@/components/layout/SEO";
import SectionHeader from "@/components/ui/SectionHeader";
import AdvertisingContactForm from "@/components/forms/AdvertisingContactForm";
import MarketingStatsChart from "@/components/marketing/MarketingStatsChart";
import StaticPageData from '@/data/StaticPageData.json';
import SharedLayout from '@/components/SharedLayout';
import { NextPageWithLayout } from './_app';

interface AdvertisePageProps {
  pageData: {
    title: string;
    tagline: string;
    content: string;
    seoTitle: string;
    seoDescription: string;
  };
  audienceStats: {
    uniqueVisitors: string;
    pageviews: string;
    avgEngagement: string;
  } | null;
}

const AdvertisePage: React.FC<AdvertisePageProps> = ({ pageData, audienceStats }) => {
  // Transform the fetched stats into the format needed by the chart component
  const chartData = audienceStats ? [
    {
      label: 'Unique Visitors',
      value: audienceStats.uniqueVisitors,
      percentage: 100,
      color: 'bg-blue-800'
    },
    {
      label: 'Pageviews',
      value: audienceStats.pageviews,
      percentage: 90,
      color: 'bg-blue-600'
    },
    {
      label: 'Avg. Engagement',
      value: audienceStats.avgEngagement,
      percentage: 75,
      color: 'bg-amber-500'
    },
  ] : [];

  return (
    <>
      <SEO title={pageData.seoTitle} description={pageData.seoDescription} />

      <div className="space-y-8">
        <SectionHeader title={pageData.title} subtitle={pageData.tagline} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Content */}
          <div className="space-y-6">
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />

            {/* Audience Report Graph */}
            {chartData.length > 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-bold text-navy-blue mb-4">
                  Our Audience Reach
                </h3>
                <MarketingStatsChart stats={chartData} />
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border">
                <p className="text-gray-500 text-center">
                  📊 Audience stats will appear here once available.
                </p>
              </div>
            )}
          </div>

          {/* Right Contact Form */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-2xl font-bold text-navy-blue mb-4 text-center">
                Get in Touch
              </h3>
              <p className="text-gray-600 text-sm text-center mb-6">
                Interested in advertising with us? Fill out the form below and we'll get back to you soon.
              </p>
              <AdvertisingContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  let audienceStats = null;
  
  try {
    // Use environment variable or build-time URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/advertising-stats`);
    
    if (res.ok) {
      audienceStats = await res.json();
    } else {
      console.warn('Advertising stats API returned non-OK status:', res.status);
    }
  } catch (err) {
    console.error("Could not fetch advertising stats:", err);
    // Stats remain null, page will show fallback message
  }

  const pageData = StaticPageData.advertise;

  return {
    props: {
      pageData,
      audienceStats,
    },
    revalidate: 600, // Revalidate every 10 minutes
  };
};

export default AdvertisePage;