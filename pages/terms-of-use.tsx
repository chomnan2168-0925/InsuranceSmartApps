import React from 'react';
import StaticPageTemplate from '@/components/layout/StaticPageTemplate';

const TermsOfUsePage = () => {
  const title = "Terms of Use";
  const tagline = "The following terms and conditions govern all use of our website.";
  const content = `
    <p class="mb-4">
      Please read these Terms of Use ("Terms", "Terms of Use") carefully before using the https://hybrid-advisor.com website (the "Service") operated by Hybrid Advisor ("us", "we", or "our").
    </p>
    <h2 class="text-xl font-semibold my-4 text-navy-blue">1. Agreement to Terms</h2>
    <p class="mb-4">
      By using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
    </p>
    <h2 class="text-xl font-semibold my-4 text-navy-blue">2. Intellectual Property</h2>
    <p class="mb-4">
      The Service and its original content, features, and functionality are and will remain the exclusive property of Hybrid Advisor and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
    </p>
    <h2 class="text-xl font-semibold my-4 text-navy-blue">3. Links To Other Web Sites</h2>
    <p class="mb-4">
      Our Service may contain links to third-party web sites or services that are not owned or controlled by Hybrid Advisor. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
    </p>
  `;

  return <StaticPageTemplate title={title} tagline={tagline} content={content} />;
};

export default TermsOfUsePage;
