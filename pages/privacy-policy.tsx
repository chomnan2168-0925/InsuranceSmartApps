import React from 'react';
import StaticPageTemplate from '@/components/layout/StaticPageTemplate';

const PrivacyPolicyPage = () => {
  const title = "Privacy Policy";
  const tagline = "Your privacy is critically important to us.";
  const content = `
    <p class="mb-4">
      It is Hybrid Advisor's policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to https://hybrid-advisor.com (hereinafter, "us", "we", or "https://hybrid-advisor.com").
    </p>
    <h2 class="text-xl font-semibold my-4 text-navy-blue">1. Information We Collect</h2>
    <p class="mb-4">
      We only collect information about you if we have a reason to do so–for example, to provide our Services, to communicate with you, or to make our Services better. We collect this information from three sources: if and when you provide information to us, automatically through operating our services, and from outside sources.
    </p>
    <h2 class="text-xl font-semibold my-4 text-navy-blue">2. How We Use Information</h2>
    <p class="mb-4">
      We use the information we collect to provide, maintain, and improve our services, to develop new services, and to protect Hybrid Advisor and our users. We also use this information to offer you tailored content – like giving you more relevant search results and ads.
    </p>
    <h2 class="text-xl font-semibold my-4 text-navy-blue">3. Sharing Information</h2>
    <p class="mb-4">
      We do not share your personal information with companies, organizations, or individuals outside of Hybrid Advisor except in the following cases: with your consent, for external processing, or for legal reasons.
    </p>
  `;

  return <StaticPageTemplate title={title} tagline={tagline} content={content} />;
};

export default PrivacyPolicyPage;
