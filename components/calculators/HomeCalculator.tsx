// /components/calculators/HomeCalculator.tsx
import React, { useState, useMemo, FormEvent } from 'react';
import ResultsDisplay from './ResultsDisplay';
import config from '@/data/calculatorConfig.json';
import { useCalculatorContext } from '@/context/CalculatorContext';

// Reusable UI Components
const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
  <div className="relative flex items-center group">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 text-xs text-white bg-gray-900 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

const InputField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  helpText,
  icon 
}: { 
  label: string; 
  value: number | ''; 
  onChange: (val: number | '') => void; 
  placeholder: string; 
  helpText?: string;
  icon?: React.ReactNode;
}) => (
  <div className="form-input-group">
    <label className="form-label flex items-center gap-2">
      {icon}
      <span>{label}</span>
      {helpText && (
        <Tooltip text={helpText}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 hover:text-blue-600 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Tooltip>
      )}
    </label>
    <div className="relative mt-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-500 text-sm font-semibold">$</span>
      </div>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
        placeholder={placeholder}
        className="form-input pl-8"
        required
      />
    </div>
  </div>
);

const SelectField = ({ 
  label, 
  value, 
  onChange, 
  children,
  icon 
}: { 
  label: string;
  value: string;
  onChange: (val: string) => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="form-input-group">
    <label className="form-label flex items-center gap-2">
      {icon}
      {label}
    </label>
    <select value={value} onChange={e => onChange(e.target.value)} className="form-input">
      {children}
    </select>
  </div>
);

const Checklist = ({ 
  title, 
  items, 
  selected, 
  onToggle 
}: { 
  title: string; 
  items: { id: string; label: string; savings?: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) => (
  <div>
    <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      {title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map(item => (
        <label
          key={item.id}
          className={`
            flex items-start space-x-3 p-4 rounded-xl cursor-pointer transition-all border-2
            ${selected.includes(item.id)
              ? 'bg-green-50 border-green-500 shadow-md'
              : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50'
            }
          `}
        >
          <input
            type="checkbox"
            checked={selected.includes(item.id)}
            onChange={() => onToggle(item.id)}
            className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 mt-0.5"
          />
          <div className="flex-1">
            <span className="text-sm font-semibold text-gray-900 block">{item.label}</span>
            {item.savings && (
              <span className="text-xs text-green-600 font-bold mt-1 block">
                💰 Save {item.savings}
              </span>
            )}
          </div>
        </label>
      ))}
    </div>
  </div>
);

const EndorsementSection = () => (
  <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-5 rounded-xl border-2 border-blue-200">
    <h3 className="text-lg font-bold text-navy-blue mb-4 flex items-center gap-2">
      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      Consider Additional Protection
    </h3>
    <div className="space-y-3">
      <div className="bg-white p-4 rounded-lg border-2 border-blue-100 hover:border-blue-300 transition-all">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-1">Water Backup Coverage</h4>
            <p className="text-sm text-gray-600">Covers damage from sewer or drain backups, which is not included in a standard policy. Highly recommended if you have a basement.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border-2 border-blue-100 hover:border-blue-300 transition-all">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-1">Scheduled Personal Property</h4>
            <p className="text-sm text-gray-600">Provides higher coverage limits for specific valuable items like jewelry, art, or collectibles.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border-2 border-blue-100 hover:border-blue-300 transition-all">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM7.879 6.464a1 1 0 010 1.414 3 3 0 000 4.243 1 1 0 11-1.415 1.414 5 5 0 010-7.07 1 1 0 011.415 0zm4.242 0a1 1 0 011.415 0 5 5 0 010 7.072 1 1 0 01-1.415-1.415 3 3 0 000-4.242 1 1 0 010-1.415zM10 9a1 1 0 011 1v.01a1 1 0 11-2 0V10a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-1">Flood Insurance</h4>
            <p className="text-sm text-gray-600">Separate policy that covers damage from flooding. Standard home insurance does NOT cover floods.</p>
          </div>
        </div>
      </div>
    </div>
    <p className="text-xs text-gray-600 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      💡 <strong>Tip:</strong> Ask your insurance advisor about adding these important coverages to your policy for comprehensive protection.
    </p>
  </div>
);

const PremiumBreakdown = ({ 
  basePremium, 
  savings, 
  finalPremium 
}: { 
  basePremium: number; 
  savings: number; 
  finalPremium: number;
}) => (
  <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mt-4">
    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9 4a1 1 0 10-2 0v5a1 1 0 102 0V9zm-6 0a1 1 0 10-2 0v5a1 1 0 102 0V9z" clipRule="evenodd" />
      </svg>
      Premium Breakdown
    </h4>
    <div className="space-y-3">
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-700">Base Premium</span>
        <span className="font-semibold text-gray-900">${basePremium.toFixed(2)}/mo</span>
      </div>
      {savings > 0 && (
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-green-700 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Protective Discounts
          </span>
          <span className="font-semibold text-green-600">-${savings.toFixed(2)}/mo</span>
        </div>
      )}
      <div className="flex justify-between items-center py-3 bg-green-50 px-3 rounded-lg">
        <span className="font-bold text-gray-900">Your Monthly Premium</span>
        <span className="text-2xl font-black text-green-600">${finalPremium.toFixed(2)}/mo</span>
      </div>
      {savings > 0 && (
        <div className="text-center p-3 bg-green-100 rounded-lg">
          <p className="text-sm font-bold text-green-800">
            🎉 You're saving ${(savings * 12).toFixed(2)}/year with protective features!
          </p>
        </div>
      )}
    </div>
  </div>
);

const HomeCalculator = () => {
  const { saveResult } = useCalculatorContext();

  const [replacementCost, setReplacementCost] = useState<number | ''>(350000);
  const [yearBuilt, setYearBuilt] = useState<number | ''>(2010);
  const [construction, setConstruction] = useState('frame');
  const [liability, setLiability] = useState(300000);
  const [deductible, setDeductible] = useState(1000);
  const [protections, setProtections] = useState<string[]>(['smokeDetectors']);
  const [result, setResult] = useState<number | null>(null);

  const calculatePremium = useMemo(() => {
    if (!replacementCost) return 0;
    const { baseRate, constructionMultiplier, ageMultiplier, protectiveCredits, liabilityMultiplier, deductibleMultiplier } = config.home;
    
    let premium = replacementCost * baseRate;
    
    // FIX: Type assertion for dynamic keys
    premium *= (constructionMultiplier as any)[construction] || 1;
    
    const homeAge = new Date().getFullYear() - (yearBuilt || new Date().getFullYear());
    const ageCategory = homeAge < 10 ? 'new' : homeAge < 40 ? 'medium' : 'old';
    premium *= (ageMultiplier as any)[ageCategory] || 1;
    
    premium *= (liabilityMultiplier as any)[liability.toString()] || 1;
    premium *= (deductibleMultiplier as any)[deductible.toString()] || 1;
    
    let totalCredit = 1;
    protections.forEach(id => {
      totalCredit *= (1 - ((protectiveCredits as any)[id] || 0));
    });
    premium *= totalCredit;
    
    return premium / 12;
  }, [replacementCost, yearBuilt, construction, liability, deductible, protections]);

  const basePremiumWithoutDiscounts = useMemo(() => {
    if (!replacementCost) return 0;
    const { baseRate, constructionMultiplier, ageMultiplier, liabilityMultiplier, deductibleMultiplier } = config.home;
    
    let premium = replacementCost * baseRate;
    premium *= (constructionMultiplier as any)[construction] || 1;
    
    const homeAge = new Date().getFullYear() - (yearBuilt || new Date().getFullYear());
    const ageCategory = homeAge < 10 ? 'new' : homeAge < 40 ? 'medium' : 'old';
    premium *= (ageMultiplier as any)[ageCategory] || 1;
    
    premium *= (liabilityMultiplier as any)[liability.toString()] || 1;
    premium *= (deductibleMultiplier as any)[deductible.toString()] || 1;
    
    return premium / 12;
  }, [replacementCost, yearBuilt, construction, liability, deductible]);

  const handleProtectionToggle = (id: string) => {
    setProtections(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResult(calculatePremium);
    
    saveResult({
      type: 'home',
      result: `$${calculatePremium.toFixed(2)}/month`,
      inputs: [
        { label: 'Replacement Cost', value: `$${(replacementCost || 0).toLocaleString()}` },
        { label: 'Year Built', value: (yearBuilt || '').toString() },
        { label: 'Construction', value: construction.charAt(0).toUpperCase() + construction.slice(1) },
        { label: 'Liability', value: `$${liability.toLocaleString()}` },
        { label: 'Deductible', value: `$${deductible.toLocaleString()}` },
        { label: 'Protections', value: `${protections.length} feature(s)` }
      ]
    });
  };

  const protectiveItems = [
    { id: 'burglarAlarm', label: 'Monitored Burglar Alarm', savings: '5-10%' },
    { id: 'smokeDetectors', label: 'Smoke Detectors', savings: '3-5%' },
    { id: 'sprinklerSystem', label: 'Sprinkler System', savings: '7-15%' },
  ];

  const savings = basePremiumWithoutDiscounts - calculatePremium;

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="font-semibold text-green-900">Homeowners Insurance Premium Calculator</div>
            <p className="text-sm text-green-800 mt-1">
              Calculate your estimated home insurance premium based on replacement cost, protective features, and coverage options.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* About Your Home */}
        <div className="form-section p-5 space-y-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-navy-blue border-b-2 border-green-200 pb-3 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            About Your Home
          </h3>
          
          <InputField
            label="Home Replacement Cost"
            value={replacementCost}
            onChange={setReplacementCost}
            placeholder="350000"
            helpText="This is the cost to REBUILD your home from the ground up, not its real estate market value. This is the most important factor in determining your premium."
            icon={
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            }
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Year Built"
              value={yearBuilt}
              onChange={setYearBuilt}
              placeholder="e.g., 2010"
              icon={
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              }
            />
            
            <SelectField
              label="Construction Type"
              value={construction}
              onChange={setConstruction}
              icon={
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              }
            >
              <option value="frame">Frame (Wood) - Most Common</option>
              <option value="masonry">Masonry (Brick/Stone)</option>
              <option value="superior">Superior (Reinforced Concrete)</option>
            </SelectField>
          </div>
        </div>

        {/* Customize Coverage */}
        <div className="form-section p-5 space-y-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-navy-blue border-b-2 border-green-200 pb-3 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Customize Your Coverage
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Liability Limit"
              value={liability.toString()}
              onChange={(v) => setLiability(parseInt(v))}
              icon={
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              }
            >
              <option value="100000">$100,000</option>
              <option value="300000">$300,000 (Recommended)</option>
              <option value="500000">$500,000</option>
            </SelectField>
            
            <SelectField
              label="Deductible"
              value={deductible.toString()}
              onChange={(v) => setDeductible(parseInt(v))}
              icon={
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              }
            >
              <option value="500">$500</option>
              <option value="1000">$1,000 (Most Common)</option>
              <option value="2500">$2,500</option>
              <option value="5000">$5,000</option>
            </SelectField>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Higher deductibles = lower premiums. Choose a deductible you can comfortably afford if you need to file a claim.
            </p>
          </div>
        </div>

        {/* Protective Features */}
        <div className="form-section p-5 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-lg">
          <Checklist
            title="Protective Features & Credits"
            items={protectiveItems}
            selected={protections}
            onToggle={handleProtectionToggle}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Calculate My Home Insurance Premium
        </button>
      </form>

      {result !== null && (
        <div className="pt-6 border-t-2 border-gray-200 space-y-6 animate-fadeIn">
          <ResultsDisplay
            title="Estimated Monthly Premium"
            result={`${result.toFixed(2)}`}
            unit="/month"
            description="A personalized estimate based on your home's characteristics and your chosen coverages."
          />
          
          <PremiumBreakdown
            basePremium={basePremiumWithoutDiscounts}
            savings={savings}
            finalPremium={result}
          />
          
          <EndorsementSection />
          
          <div className="sr-only">
            <h2>Homeowners Insurance Keywords and Related Phrases</h2>
            <p>This free homeowners insurance calculator provides an accurate home insurance quote based on key risk factors. Use our property insurance estimator to see how your home's age, construction type, and protective credits for security systems affect your premium. This tool also helps you understand the difference between replacement cost and market value.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeCalculator;