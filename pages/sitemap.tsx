// /pages/sitemap.tsx
// ✅ AI-OPTIMIZED VERSION - Keyword stuffing removed, structured data enhanced
import React from 'react';
import Link from 'next/link';
import SEO from '@/components/layout/SEO';

const SitemapPage = () => {
  const sitemapSections = [
    {
      title: 'Insurance Calculators',
      icon: '💡',
      links: [
        { name: 'Auto Insurance Calculator', href: '/calculators/auto-insurance', description: 'Calculate your car insurance premium' },
        { name: 'Home Insurance Calculator', href: '/calculators/home-insurance', description: 'Estimate homeowners insurance costs' },
        { name: 'Life Insurance Calculator', href: '/calculators/life-insurance', description: 'Determine your life insurance needs' },
        { name: 'Health Insurance Calculator', href: '/calculators/health-insurance', description: 'Compare health insurance plans' },
        { name: 'Disability Insurance Calculator', href: '/calculators/disability-insurance', description: 'Calculate disability coverage' },
        { name: 'Pet Insurance Calculator', href: '/calculators/pet-insurance', description: 'Estimate pet insurance costs' }
      ]
    },
    {
      title: 'Resources & Tools',
      icon: '📖',
      links: [
        { name: 'Ask An Expert', href: '/ask-an-expert', description: 'Get free financial advice' },
        { name: 'Insurance Guides', href: '/insurance-tips', description: 'Educational insurance articles' },
        { name: 'Blog', href: '/newsroom', description: 'Latest insurance news and tips' },
        { name: 'All Calculators', href: '/calculators', description: 'Browse all calculator tools' }
      ]
    },
    {
      title: 'Company Information',
      icon: '📋',
      links: [
        { name: 'About Us', href: '/about-us', description: 'Learn about our mission' },
        { name: 'Contact Us', href: '/advertise', description: 'Get in touch with us' },
        { name: 'Privacy Policy', href: '/privacy-policy', description: 'How we protect your data' },
        { name: 'Terms of Use', href: '/terms-of-use', description: 'Website usage terms' },
        { name: 'XML Sitemap', href: '/sitemap.xml', description: 'Technical sitemap for search engines', external: true }
      ]
    }
  ];

  // ✅ AI-OPTIMIZED FAQ DATA - Natural language, direct answers
  const faqData = [
    {
      question: "What insurance calculators do you offer?",
      answer: "We provide free calculators for auto, home, life, health, disability, and pet insurance. Each calculator helps you estimate premiums and compare coverage options based on your specific needs."
    },
    {
      question: "How do insurance calculators work?",
      answer: "Our calculators use industry-standard formulas and current market data to provide estimates. You input your information (age, location, coverage needs), and the calculator generates personalized premium estimates."
    },
    {
      question: "Are these calculators really free to use?",
      answer: "Yes, all our insurance calculators are completely free with no hidden fees. You can use them as many times as needed to compare different scenarios and coverage options."
    },
    {
      question: "Do I need to create an account?",
      answer: "No account is required. You can access and use all calculators immediately without registration or providing personal contact information."
    },
    {
      question: "How accurate are the insurance estimates?",
      answer: "Our calculators provide estimates based on typical market rates and industry data. Actual quotes from insurance providers may vary based on their specific underwriting criteria and available discounts."
    }
  ];

  return (
    <div>
      <SEO
        title="Site Map - Free Insurance Calculators & Tools"
        description="Complete directory of free insurance calculators for auto, home, life, health, disability, and pet insurance. Find tools, guides, and resources to help you make informed insurance decisions."
        faqs={faqData}
        breadcrumbs={[
          { name: 'Home', url: 'https://www.insurancesmartcalculator.com' },
          { name: 'Sitemap', url: 'https://www.insurancesmartcalculator.com/sitemap' }
        ]}
      />
      
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-8 rounded-2xl shadow-lg border-2 border-blue-100 mb-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-xl">
                🗺️
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-navy-blue mb-3">
              Site Map
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Navigate through our free insurance calculators, educational resources, and expert guidance tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sitemapSections.map((section) => {
            return (
              <div key={section.title} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gold">
                  <span className="text-3xl">{section.icon}</span>
                  <h2 className="text-lg font-bold text-navy-blue">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link) => {
                    return (
                      <li key={link.href}>
                        {link.external ? (
                          <a href={link.href} target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="flex items-start gap-2">
                              <span className="text-gold mt-1 transform group-hover:translate-x-1 transition-transform">→</span>
                              <div>
                                <div className="text-sm font-semibold text-gray-800 group-hover:text-gold transition-colors">{link.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{link.description}</div>
                              </div>
                            </div>
                          </a>
                        ) : (
                          <Link href={link.href} className="block group">
                            <div className="flex items-start gap-2">
                              <span className="text-gold mt-1 transform group-hover:translate-x-1 transition-transform">→</span>
                              <div>
                                <div className="text-sm font-semibold text-gray-800 group-hover:text-gold transition-colors">{link.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{link.description}</div>
                              </div>
                            </div>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* ✅ FAQ Section - Visible to users AND AI crawlers */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-navy-blue mb-4 flex items-center gap-2">
            <span className="text-3xl">❓</span>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-gray-700">
                <strong>Need personalized help?</strong> Use our calculators to get instant estimates, or{' '}
                <Link href="/ask-an-expert" className="text-blue-600 hover:text-blue-800 underline">
                  ask our experts
                </Link>{' '}
                for guidance tailored to your situation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* ✅ REMOVED: Hidden keyword-stuffed content */}
        {/* SEO is now handled by proper structured data above */}

        {/* ✅ Enhanced Schema.org - AI-optimized */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Insurance Calculator Sitemap",
              "url": "https://www.insurancesmartcalculator.com/sitemap",
              "description": "Complete directory of free insurance calculators and resources",
              "inLanguage": "en-US",
              "isPartOf": {
                "@type": "WebSite",
                "name": "Insurance SmartCalculator",
                "url": "https://www.insurancesmartcalculator.com"
              },
              "mainEntity": {
                "@type": "ItemList",
                "name": "Insurance Calculator Tools",
                "description": "Free online calculators for estimating insurance premiums and coverage needs",
                "numberOfItems": 6,
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                      "@type": "SoftwareApplication",
                      "name": "Auto Insurance Calculator",
                      "description": "Calculate estimated car insurance premiums based on vehicle type, driver profile, and coverage needs",
                      "url": "https://www.insurancesmartcalculator.com/calculators/auto-insurance",
                      "applicationCategory": "FinanceApplication",
                      "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                      }
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                      "@type": "SoftwareApplication",
                      "name": "Home Insurance Calculator",
                      "description": "Estimate homeowners insurance costs based on property value, location, and coverage options",
                      "url": "https://www.insurancesmartcalculator.com/calculators/home-insurance",
                      "applicationCategory": "FinanceApplication",
                      "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                      }
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                      "@type": "SoftwareApplication",
                      "name": "Life Insurance Calculator",
                      "description": "Determine appropriate life insurance coverage based on income, dependents, and financial obligations",
                      "url": "https://www.insurancesmartcalculator.com/calculators/life-insurance",
                      "applicationCategory": "FinanceApplication",
                      "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                      }
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "item": {
                      "@type": "SoftwareApplication",
                      "name": "Health Insurance Calculator",
                      "description": "Compare health insurance plans and estimate premium costs based on coverage needs",
                      "url": "https://www.insurancesmartcalculator.com/calculators/health-insurance",
                      "applicationCategory": "FinanceApplication",
                      "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                      }
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 5,
                    "item": {
                      "@type": "SoftwareApplication",
                      "name": "Disability Insurance Calculator",
                      "description": "Calculate recommended disability insurance coverage based on income and expenses",
                      "url": "https://www.insurancesmartcalculator.com/calculators/disability-insurance",
                      "applicationCategory": "FinanceApplication",
                      "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                      }
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 6,
                    "item": {
                      "@type": "SoftwareApplication",
                      "name": "Pet Insurance Calculator",
                      "description": "Estimate pet insurance costs based on pet type, age, and coverage options",
                      "url": "https://www.insurancesmartcalculator.com/calculators/pet-insurance",
                      "applicationCategory": "FinanceApplication",
                      "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                      }
                    }
                  }
                ]
              }
            })
          }}
        />
      </div>
    </div>
  );
};

export default SitemapPage;