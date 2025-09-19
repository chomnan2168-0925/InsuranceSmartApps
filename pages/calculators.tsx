import React, { useState } from 'react';
import SEO from '@/components/layout/SEO';
import SectionHeader from '@/components/ui/SectionHeader';
import InsuranceTypeSelector from '@/components/calculators/InsuranceTypeSelector';
import AutoCalculator from '@/components/calculators/AutoCalculator';
import HomeCalculator from '@/components/calculators/HomeCalculator';
import LifeCalculator from '@/components/calculators/LifeCalculator';
import DisabilityCalculator from '@/components/calculators/DisabilityCalculator';
import HealthCalculator from '@/components/calculators/HealthCalculator';
import PetCalculator from '@/components/calculators/PetCalculator';

type CalculatorType = 'auto' | 'home' | 'life' | 'disability' | 'health' | 'pet';

const CalculatorsPage = () => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('life');

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'auto':
        return <AutoCalculator />;
      case 'home':
        return <HomeCalculator />;
      case 'life':
        return <LifeCalculator />;
      case 'disability':
        return <DisabilityCalculator />;
      case 'health':
        return <HealthCalculator />;
      case 'pet':
        return <PetCalculator />;
      default:
        return <LifeCalculator />;
    }
  };

  return (
    <>
      <SEO
        title="Insurance Calculators"
        description="Estimate your insurance needs with our suite of free calculators for life, home, auto, and more."
      />
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Insurance Needs Calculators"
          subtitle="Get a clear picture of your insurance needs. Select a category below to get a personalized estimate in minutes."
        />
        <div className="mt-8">
          <InsuranceTypeSelector
            selectedType={activeCalculator}
            onTypeSelect={setActiveCalculator}
          />
        </div>
        <div className="mt-8 bg-white p-6 md:p-8 rounded-lg shadow-lg">
          {renderCalculator()}
        </div>
      </div>
    </>
  );
};

export default CalculatorsPage;
