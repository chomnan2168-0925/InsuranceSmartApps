import React from 'react';
import StaticPageTemplate from '@/components/layout/StaticPageTemplate';

const OurStoryPage = () => {
  const title = "Our Story";
  const tagline = "Pioneering a new era of financial guidance.";
  const content = `
    <h2 class="text-2xl font-semibold mb-4 text-navy-blue">Our Journey</h2>
    <p class="mb-4">
      Founded in 2010, Hybrid Advisor was born from a simple yet powerful idea: to combine the best of human expertise with cutting-edge technology to make financial advice accessible to everyone. We saw a gap in the market where individuals were often forced to choose between expensive, traditional advisors and impersonal, automated platforms. We knew there had to be a better way.
    </p>
    <p class="mb-4">
      Our founders, a team of seasoned financial planners and innovative tech entrepreneurs, set out to build a platform that delivers personalized, data-driven insights without sacrificing the crucial human element of trust and guidance.
    </p>
    <h2 class="text-2xl font-semibold mb-4 mt-8 text-navy-blue">Our Mission</h2>
    <p class="mb-4">
      Our mission is to empower you to achieve your financial goals with confidence. We believe that financial well-being is a cornerstone of a happy life, and we are dedicated to providing the tools, resources, and expert support you need to navigate your financial journey, no matter how complex.
    </p>
  `;

  return <StaticPageTemplate title={title} tagline={tagline} content={content} />;
};

export default OurStoryPage;
