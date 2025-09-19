import React from 'react';
import SEO from '@/components/layout/SEO';
import SectionHeader from '@/components/ui/SectionHeader';
import AskAnExpertForm from '@/components/forms/AskAnExpertForm';

const AskAnExpertPage = () => {
  return (
    <>
      <SEO
        title="Ask an Expert"
        description="Have a financial question? Our team of certified financial advisors is here to help you."
      />
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          title="Ask an Expert"
          subtitle="Submit your financial questions below, and one of our certified advisors will get back to you. We're here to provide clarity and guidance on your financial journey."
        />

        <div className="bg-white p-8 rounded-lg shadow-lg mt-8">
          <AskAnExpertForm />
        </div>
      </div>
    </>
  );
};

export default AskAnExpertPage;
