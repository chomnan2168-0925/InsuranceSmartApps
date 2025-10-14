// /pages/sitemap.tsx
import React from 'react';
import Link from 'next/link';
import SEO from '@/components/layout/SEO';

const SitemapPage = () => {
  const sitemapSections = [
    {
      title: 'Insurance Calculators',
      icon: '💡',
      links: [
        { name: 'Auto Insurance Calculator', href: '/calculators', description: 'Calculate your car insurance premium' },
        { name: 'Home Insurance Calculator', href: '/calculators', description: 'Estimate homeowners insurance costs' },
        { name: 'Life Insurance Calculator', href: '/calculators', description: 'Determine your life insurance needs' },
        { name: 'Health Insurance Calculator', href: '/calculators', description: 'Compare health insurance plans' },
        { name: 'Disability Insurance Calculator', href: '/calculators', description: 'Calculate disability coverage' },
        { name: 'Pet Insurance Calculator', href: '/calculators', description: 'Estimate pet insurance costs' }
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

  return (
    <div>
      <SEO
        title="Sitemap | Free Insurance Calculators & Rate Comparison Tools | Insurance SmartApps"
        description="Complete directory of free insurance calculators for auto, home, life, health, disability, and pet insurance. Compare rates, estimate premiums, calculate coverage needs, and find the best insurance policies with our unbiased calculator tools and expert financial guidance."
      />
      
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-8 rounded-2xl shadow-lg border-2 border-blue-100 mb-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-xl">
                🗺️
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-navy-blue mb-3">Site Map - Insurance Calculator Tools & Resources</h1>
            <p className="text-base md:text-lg text-gray-600">
              Navigate through all free insurance calculators, premium estimators, coverage comparison tools, and educational resources. Find insurance quotes, compare rates, calculate your insurance needs, and get expert financial guidance.
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

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-gray-700">
                <strong>Looking for something specific?</strong> Use our insurance calculators to compare rates and coverage options, or <Link href="/ask-an-expert" className="text-blue-600 hover:text-blue-800 underline">ask our experts</Link> for personalized financial guidance and insurance recommendations.
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

        {/* SEO Content - Hidden but crawlable */}
        <div className="sr-only">
          <h2>Free Insurance Calculator Tools and Premium Estimators</h2>
          <p>
            Insurance SmartApps provides comprehensive free insurance calculator tools for auto insurance quotes, 
            car insurance premium estimates, home insurance cost calculator, homeowners insurance estimator, 
            life insurance needs analysis, term life insurance calculator, whole life insurance calculator, 
            health insurance comparison tool, health insurance premium calculator, disability income protection calculator, 
            disability insurance coverage estimator, and pet insurance cost calculator.
          </p>
          <p>
            Our unbiased insurance calculators help you compare insurance rates, understand coverage options, 
            estimate monthly premiums, calculate deductibles, analyze insurance costs, find the best insurance policies, 
            and make informed decisions about your financial protection needs. Use our insurance comparison tools to 
            get instant quotes, compare multiple insurance providers, and find affordable coverage that fits your budget.
          </p>
          <h3>Insurance Calculator Keywords and Tools</h3>
          <p>
            Auto insurance calculator, car insurance estimator, vehicle insurance quote tool, auto premium calculator, 
            homeowners insurance calculator, home insurance cost estimator, property insurance calculator, 
            life insurance needs calculator, life coverage estimator, term life calculator, permanent life insurance tool, 
            health insurance comparison calculator, medical insurance premium estimator, health plan comparison tool, 
            disability insurance calculator, income protection calculator, disability coverage estimator, 
            pet insurance calculator, pet coverage cost estimator, veterinary insurance calculator.
          </p>
          <h3>Insurance Planning and Comparison Resources</h3>
          <p>
            Insurance comparison tool, rate comparison calculator, premium estimator, coverage calculator, 
            insurance cost estimator, quote comparison tool, policy comparison calculator, insurance planning tools, 
            financial protection calculator, risk assessment tools, insurance needs analysis, coverage gap analysis, 
            deductible calculator, liability coverage calculator, comprehensive coverage estimator, collision coverage tool, 
            umbrella insurance calculator, supplemental insurance estimator, insurance bundle savings calculator.
          </p>
          <h3>Expert Insurance Guidance and Educational Resources</h3>
          <p>
            Free insurance advice, expert insurance guidance, insurance planning help, coverage recommendations, 
            insurance tips and guides, insurance education, policy selection guide, insurance buying guide, 
            coverage optimization, insurance savings tips, discount finder, insurance budget planner, 
            financial protection planning, risk management tools, insurance decision support, unbiased insurance information.
          </p>
        </div>

        {/* Schema.org Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Insurance SmartApps",
              "url": "https://InsuranceSmartCalculator.com",
              "description": "Free insurance calculators and premium estimators for auto, home, life, health, disability, and pet insurance",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://InsuranceSmartCalculator.com/sitemap?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "mainEntity": {
                "@type": "ItemList",
                "name": "Insurance Calculator Tools",
                "description": "Comprehensive suite of free insurance calculators and premium estimators",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Auto Insurance Calculator",
                    "description": "Calculate car insurance premiums and compare auto insurance rates",
                    "url": "https://InsuranceSmartCalculator.com/calculators"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Home Insurance Calculator",
                    "description": "Estimate homeowners insurance costs and coverage needs",
                    "url": "https://InsuranceSmartCalculator.com/calculators"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Life Insurance Calculator",
                    "description": "Determine life insurance coverage needs and compare term vs whole life",
                    "url": "https://InsuranceSmartCalculator.com/calculators"
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "Health Insurance Calculator",
                    "description": "Compare health insurance plans and estimate premium costs",
                    "url": "https://InsuranceSmartCalculator.com/calculators"
                  },
                  {
                    "@type": "ListItem",
                    "position": 5,
                    "name": "Disability Insurance Calculator",
                    "description": "Calculate disability income protection and coverage amounts",
                    "url": "https://InsuranceSmartCalculator.com/calculators"
                  },
                  {
                    "@type": "ListItem",
                    "position": 6,
                    "name": "Pet Insurance Calculator",
                    "description": "Estimate pet insurance costs and veterinary coverage",
                    "url": "https://InsuranceSmartCalculator.com/calculators"
                  }
                ]
              }
            })
          }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://insurancesmartapps.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Sitemap",
                  "item": "https://insurancesmartapps.com/sitemap"
                }
              ]
            })
          }}
        />
      </div>
    </div>
  );
};

export default SitemapPage;