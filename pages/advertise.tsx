// FIX: Replaced placeholder content with a complete "Advertise With Us" page.
import React from 'react';
import SEO from '@/components/layout/SEO';
import SectionHeader from '@/components/ui/SectionHeader';
import MarketingStatsChart from '@/components/marketing/MarketingStatsChart';
import AdvertisingContactForm from '@/components/forms/AdvertisingContactForm';

const AdvertisePage = () => {
  return (
    <>
      <SEO
        title="Advertise With Us"
        description="Reach a highly engaged audience of finance-savvy individuals and investors. Partner with Hybrid Advisor to grow your brand."
      />
      <div className="space-y-16">
        <SectionHeader
          title="Partner with Hybrid Advisor"
          subtitle="Connect with a rapidly growing audience of financially-minded individuals actively seeking information on investments, retirement planning, and wealth management."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-navy-blue mb-4">Why Advertise With Us?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Hybrid Advisor is a trusted resource for hundreds of thousands of readers each month. Our audience is educated, affluent, and highly motivated to make smart financial decisions.
              </p>
              <ul className="space-y-3 text-gray-700 list-disc list-inside">
                <li><span className="font-semibold">Targeted Audience:</span> Reach users actively researching financial products and services.</li>
                <li><span className="font-semibold">High Engagement:</span> Our content fosters a loyal and engaged readership.</li>
                <li><span className="font-semibold">Brand Alignment:</span> Associate your brand with a trusted, authoritative voice in finance.</li>
                <li><span className="font-semibold">Flexible Solutions:</span> From sponsored content to display advertising, we offer a range of options.</li>
              </ul>
            </div>
            <MarketingStatsChart />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-navy-blue mb-4 text-center">Get in Touch</h3>
            <AdvertisingContactForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvertisePage;
