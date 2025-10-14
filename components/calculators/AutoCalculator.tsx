// /components/calculators/AutoCalculator.tsx
import React, { useState, FormEvent, useMemo } from 'react';
import ResultsDisplay from './ResultsDisplay';
import RateBenchmark from './RateBenchmark';
import ShareResults from './ShareResults';
import LoadingCalculator from './LoadingCalculator';
import benchmarkData from '@/data/benchmarkData.json';
import config from '@/data/calculatorConfig.json';
import { useCalculatorContext } from '@/context/CalculatorContext';
import { DriverAge, DrivingRecord, CoverageLevel } from '@/types/calculatorConfig';

// === ENHANCED UI COMPONENTS WITH VIBRANT COLORS ===

const TextInput = ({ label, value, onChange, placeholder, icon }: { 
  label: string, 
  value: string, 
  onChange: (val: string) => void, 
  placeholder: string,
  icon?: React.ReactNode 
}) => (
  <div className="form-input-group">
    <label className="form-label text-gray-700 font-semibold">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
          {icon}
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className={`form-input ${icon ? 'pl-10' : ''} border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
      />
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, children, color = 'blue' }: { 
  label: string, 
  value: string, 
  onChange: (value: string) => void, 
  children: React.ReactNode,
  color?: string 
}) => (
  <div className="form-input-group">
    <label className="form-label text-gray-700 font-semibold">{label}</label>
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className={`form-input border-2 border-gray-200 focus:border-${color}-500 focus:ring-2 focus:ring-${color}-200 transition-all duration-200 cursor-pointer`}
    >
      {children}
    </select>
  </div>
);

const Slider = ({ label, value, onChange, min, max, step, format, color = 'blue' }: { 
  label: string, 
  value: number, 
  onChange: (val: number) => void, 
  min: number, 
  max: number, 
  step: number, 
  format?: (val: number) => string,
  color?: string 
}) => (
  <div className="form-input-group">
    <label className="form-label flex items-center justify-between text-gray-700 font-semibold">
      <span>{label}</span>
      <span className={`font-bold text-${color}-600 text-lg`}>
        {format ? format(value) : value.toLocaleString()}
      </span>
    </label>
    <div className="relative pt-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full appearance-none cursor-pointer slider-thumb"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #dbeafe ${((value - min) / (max - min)) * 100}%, #dbeafe 100%)`
        }}
      />
    </div>
  </div>
);

const DiscountChecklist = ({ selectedDiscounts, onToggle }: { 
  selectedDiscounts: string[], 
  onToggle: (discount: string) => void 
}) => {
  const discounts = [
    { 
      id: 'bundle', 
      label: 'Homeowner Bundle', 
      savings: '15%',
      color: 'from-green-400 to-emerald-500',
      icon: '🏠'
    },
    { 
      id: 'goodStudent', 
      label: 'Good Student', 
      savings: '10%',
      color: 'from-blue-400 to-indigo-500',
      icon: '🎓'
    },
    { 
      id: 'antiTheft', 
      label: 'Anti-Theft Device', 
      savings: '5%',
      color: 'from-purple-400 to-pink-500',
      icon: '🔒'
    },
    { 
      id: 'defensiveDriver', 
      label: 'Defensive Driver', 
      savings: '5%',
      color: 'from-orange-400 to-red-500',
      icon: '🛡️'
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">💰 Available Discounts</h3>
      <p className="text-sm text-gray-600 mb-4">Select all that apply to maximize your savings!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {discounts.map(discount => {
          const isSelected = selectedDiscounts.includes(discount.id);
          return (
            <label 
              key={discount.id} 
              className={`
                relative overflow-hidden p-4 rounded-xl cursor-pointer transition-all duration-300 transform
                ${isSelected 
                  ? `bg-gradient-to-br ${discount.color} text-white shadow-lg scale-105` 
                  : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
                }
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(discount.id)}
                className="absolute top-3 right-3 h-5 w-5 rounded"
              />
              <div className="flex items-start gap-3">
                <span className="text-2xl">{discount.icon}</span>
                <div className="flex-1">
                  <p className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    {discount.label}
                  </p>
                  <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-green-600'}`}>
                    Save {discount.savings}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

const CoverageSelector = ({ level, onChange }: { level: string, onChange: (level: string) => void }) => {
  const levels = [
    { 
      id: 'minimum', 
      label: 'State Minimum', 
      description: 'Basic coverage required by law',
      icon: '🔰',
      color: 'from-yellow-400 to-orange-500',
      recommended: false
    },
    { 
      id: 'good', 
      label: 'Good Coverage', 
      description: 'Collision & Comprehensive included',
      icon: '✅',
      color: 'from-blue-400 to-blue-600',
      recommended: true
    },
    { 
      id: 'best', 
      label: 'Best Coverage', 
      description: 'Maximum financial protection',
      icon: '⭐',
      color: 'from-purple-500 to-pink-600',
      recommended: false
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-3">🛡️ Choose Your Coverage Level</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {levels.map(l => {
          const isSelected = level === l.id;
          return (
            <button
              type="button"
              key={l.id}
              onClick={() => onChange(l.id)}
              className={`
                relative p-4 rounded-xl text-left transition-all duration-300 transform
                ${isSelected 
                  ? `bg-gradient-to-br ${l.color} text-white shadow-xl scale-105 border-4 border-white ring-4 ring-blue-300` 
                  : 'bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg hover:scale-102'
                }
              `}
            >
              {l.recommended && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
              <div className="text-3xl mb-2">{l.icon}</div>
              <p className={`font-bold text-base ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                {l.label}
              </p>
              <p className={`text-xs mt-1 ${isSelected ? 'text-white opacity-90' : 'text-gray-500'}`}>
                {l.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// === MAIN CALCULATOR COMPONENT ===

const AutoCalculator = () => {
  const [driverAge, setDriverAge] = useState<DriverAge>('adult');
  const [drivingRecord, setDrivingRecord] = useState<DrivingRecord>('clean');
  const [zipCode, setZipCode] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [primaryUse, setPrimaryUse] = useState<'pleasure' | 'commute' | 'business'>('pleasure');
  const [annualMileage, setAnnualMileage] = useState(10000);
  const [coverageLevel, setCoverageLevel] = useState<CoverageLevel>('good');
  const [deductible, setDeductible] = useState(500);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [averageRate, setAverageRate] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { saveResult } = useCalculatorContext();

  const calculatedPremium = useMemo(() => {
    let baseRate = config.auto.baseRate;
    baseRate *= config.auto.ageMultiplier[driverAge];
    baseRate *= config.auto.recordMultiplier[drivingRecord];
    
    const vehicleRiskFactor = 1.1; 
    const locationMultiplier = 1.05;
    baseRate *= vehicleRiskFactor;
    baseRate *= locationMultiplier;
    
    const usageMultiplier = annualMileage > 12000 ? 1.1 : (annualMileage < 8000 ? 0.9 : 1);
    baseRate *= usageMultiplier;
    baseRate *= config.auto.coverageMultiplier[coverageLevel];
    baseRate *= config.auto.deductibleMultiplier[deductible.toString() as '250' | '500' | '750' | '1000'];
    
    let totalDiscount = 1;
    selectedDiscounts.forEach(id => {
        const discount = config.auto.discounts[id as keyof typeof config.auto.discounts];
        if (discount) {
            totalDiscount *= (1 - discount);
        }
    });
    baseRate *= totalDiscount;
    
    return baseRate;
  }, [driverAge, drivingRecord, annualMileage, coverageLevel, deductible, selectedDiscounts]);

  const totalSavings = useMemo(() => {
    return selectedDiscounts.reduce((total, id) => {
      const discount = config.auto.discounts[id as keyof typeof config.auto.discounts];
      return total + (discount || 0);
    }, 0) * 100;
  }, [selectedDiscounts]);

  const handleDiscountToggle = (discountId: string) => {
    setSelectedDiscounts(prev => 
        prev.includes(discountId) 
            ? prev.filter(id => id !== discountId) 
            : [...prev, discountId]
    );
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    // Simulate calculation time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setResult(calculatedPremium);

    saveResult({
        type: 'auto',
        result: `${calculatedPremium.toFixed(2)}/month`,
        inputs: [
            { label: 'Age Group', value: driverAge.charAt(0).toUpperCase() + driverAge.slice(1) },
            { label: 'Record', value: drivingRecord.charAt(0).toUpperCase() + drivingRecord.slice(1) },
            { label: 'Coverage', value: coverageLevel.charAt(0).toUpperCase() + coverageLevel.slice(1) },
            { label: 'Deductible', value: `${deductible}` }
        ]
    });

    const state = 'CA'; 
    const benchmarkAuto = benchmarkData.auto as Record<string, number>;
    if (state && benchmarkAuto[state]) {
        setAverageRate(benchmarkAuto[state]);
    }
    
    setIsCalculating(false);
  };

  const formatCurrency = (val: number) => `${val.toLocaleString()}`;

  if (isCalculating) {
    return <LoadingCalculator />;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Driver & Vehicle Info */}
        <div className="form-section bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-md border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                👤
              </div>
              <h3 className="text-xl font-bold text-gray-800">About You & Your Vehicle</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="Driver Age Group" value={driverAge} onChange={(v) => setDriverAge(v as DriverAge)} color="blue">
                    <option value="young">🔰 Young (16-24)</option>
                    <option value="adult">✅ Adult (25-64)</option>
                    <option value="senior">👴 Senior (65+)</option>
                </SelectField>
                <SelectField label="Driving Record" value={drivingRecord} onChange={(v) => setDrivingRecord(v as DrivingRecord)} color="blue">
                    <option value="clean">⭐ Clean Record</option>
                    <option value="tickets">⚠️ 1-2 Tickets</option>
                    <option value="accident">🚗 At-Fault Accident</option>
                </SelectField>
                <TextInput 
                  label="Vehicle Year" 
                  value={vehicleYear} 
                  onChange={setVehicleYear} 
                  placeholder="  e.g., 2025"
                  icon={<span>📅</span>}
                />
                <TextInput 
                  label="Vehicle Make" 
                  value={vehicleMake} 
                  onChange={setVehicleMake} 
                  placeholder="  e.g., Toyota"
                  icon={<span>🏭</span>}
                />
                <div className="md:col-span-2">
                  <TextInput 
                    label="Vehicle Model" 
                    value={vehicleModel} 
                    onChange={setVehicleModel} 
                    placeholder="  e.g., RAV4"
                    icon={<span>🚙</span>}
                  />
                </div>
            </div>
        </div>

        {/* Section 2: Coverage Selection */}
        <div className="form-section bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-md border-2 border-purple-100">
            <CoverageSelector level={coverageLevel} onChange={(v) => setCoverageLevel(v as CoverageLevel)} />
            <div className="mt-6">
              <Slider 
                label="Collision Deductible" 
                value={deductible} 
                onChange={setDeductible} 
                min={250} 
                max={1000} 
                step={250} 
                format={formatCurrency}
                color="purple"
              />
              <p className="text-xs text-gray-600 mt-2">
                💡 <strong>Tip:</strong> Higher deductible = Lower monthly premium
              </p>
            </div>
        </div>

        {/* Section 3: Location & Usage */}
        <div className="form-section bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-md border-2 border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl">
                📍
              </div>
              <h3 className="text-xl font-bold text-gray-800">Location & Usage</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput 
                  label="Garaging ZIP Code" 
                  value={zipCode} 
                  onChange={setZipCode} 
                  placeholder="  e.g., 90210"
                  icon={<span>🏠</span>}
                />
                <SelectField label="Primary Use" value={primaryUse} onChange={(v) => setPrimaryUse(v as any)} color="green">
                    <option value="pleasure">🎉 Pleasure</option>
                    <option value="commute">🚗 Commute</option>
                    <option value="business">💼 Business</option>
                </SelectField>
                <div className="md:col-span-2">
                    <Slider 
                      label="Annual Mileage" 
                      value={annualMileage} 
                      onChange={setAnnualMileage} 
                      min={2000} 
                      max={30000} 
                      step={1000} 
                      format={(val) => `${val.toLocaleString()} miles`}
                      color="green"
                    />
                </div>
            </div>
        </div>

        {/* Section 4: Discounts */}
        <div className="form-section bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-md border-2 border-yellow-200">
            <DiscountChecklist selectedDiscounts={selectedDiscounts} onToggle={handleDiscountToggle} />
            {totalSavings > 0 && (
              <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-400 shadow-sm">
                <p className="text-center">
                  <span className="text-sm text-gray-600">Total Potential Savings: </span>
                  <span className="text-2xl font-bold text-green-600">{totalSavings.toFixed(0)}%</span>
                  <span className="text-sm text-gray-600"> off your premium! 🎉</span>
                </p>
              </div>
            )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calculate My Premium
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </form>
      
      {result !== null && (
        <div className="space-y-6 animate-fadeIn">
            {/* Main Result */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 rounded-2xl shadow-2xl text-white">
              <div className="text-center">
                <p className="text-lg opacity-90 mb-2">Your Estimated Monthly Premium</p>
                <p className="text-6xl font-black mb-2">${result.toFixed(2)}</p>
                <p className="text-xl opacity-90">per month</p>
                <div className="mt-6 flex justify-center gap-4 text-sm">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p className="opacity-80">Annual</p>
                    <p className="font-bold">${(result * 12).toFixed(2)}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p className="opacity-80">6-Month</p>
                    <p className="font-bold">${(result * 6).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benchmark Comparison */}
            {averageRate && <RateBenchmark userRate={result} averageRate={averageRate} />}

            {/* SEO Content */}
            <div className="sr-only">
              <h2>Auto Insurance Keywords and Related Phrases</h2>
              <p>
                Use this free auto insurance calculator to get a personalized car insurance quote. 
                Our vehicle premium estimator is one of the most accurate insurance calculator apps available, 
                factoring in your car's make and model, driving record, location, and available discounts. 
                This tool helps you estimate monthly car insurance costs and compare different coverage levels 
                to find the best rate.
              </p>
            </div>

            <p className="text-center text-xs text-gray-500">
              💡 <strong>Pro Tip:</strong> Adjusting your Deductible or Coverage Level above will instantly update this estimate.
            </p>
        </div>
      )}
    </div>
  );
};

export default AutoCalculator;