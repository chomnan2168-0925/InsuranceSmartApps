// /components/calculators/PetCalculator.tsx
// ✅ UPDATED: Added comprehensive SEO keywords section
import React, { useState } from 'react';
import { useCalculatorContext } from '@/context/CalculatorContext';

const PetCalculator: React.FC = () => {
  const { saveResult } = useCalculatorContext();
  
  const [formData, setFormData] = useState({
    petType: 'dog',
    breed: '',
    age: '',
    coverageLevel: 'mid',
    deductible: '250',
    reimbursement: '80',
    annualLimit: '10000',
    addWellness: false,
  });

  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Common dog breeds with their risk factors
  const dogBreeds = [
    'Labrador Retriever', 'German Shepherd', 'Golden Retriever', 'French Bulldog',
    'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer',
    'Dachshund', 'Siberian Husky', 'Great Dane', 'Chihuahua', 'Mixed Breed'
  ];

  // Common cat breeds
  const catBreeds = [
    'Domestic Shorthair', 'Domestic Longhair', 'Siamese', 'Maine Coon',
    'Persian', 'Ragdoll', 'Bengal', 'British Shorthair', 'Sphynx', 'Mixed Breed'
  ];

  const breeds = formData.petType === 'dog' ? dogBreeds : catBreeds;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setShowResult(false);
  };

  const calculatePremium = () => {
    const age = parseInt(formData.age);
    
    if (!formData.breed || !age || age < 0) {
      alert('Please enter all required fields');
      return;
    }

    // Base premium
    let basePremium = formData.petType === 'dog' ? 45 : 35;

    // Age factor
    if (age < 1) basePremium *= 0.8;
    else if (age >= 1 && age < 5) basePremium *= 1.0;
    else if (age >= 5 && age < 10) basePremium *= 1.4;
    else basePremium *= 2.0;

    // Breed risk factor (simplified)
    const highRiskDogBreeds = ['French Bulldog', 'Bulldog', 'Rottweiler', 'Great Dane', 'German Shepherd'];
    const highRiskCatBreeds = ['Persian', 'Sphynx', 'Maine Coon'];
    
    if (formData.petType === 'dog' && highRiskDogBreeds.includes(formData.breed)) {
      basePremium *= 1.3;
    } else if (formData.petType === 'cat' && highRiskCatBreeds.includes(formData.breed)) {
      basePremium *= 1.2;
    }

    // Coverage level adjustments
    const coverageLevels: { [key: string]: number } = {
      basic: 0.7,
      mid: 1.0,
      premium: 1.4,
    };
    basePremium *= coverageLevels[formData.coverageLevel];

    // Deductible adjustment
    const deductible = parseInt(formData.deductible);
    if (deductible >= 500) basePremium *= 0.85;
    else if (deductible >= 250) basePremium *= 0.95;
    else basePremium *= 1.05;

    // Reimbursement percentage adjustment
    const reimbursement = parseInt(formData.reimbursement);
    basePremium *= (reimbursement / 80);

    // Annual limit adjustment
    const annualLimit = parseInt(formData.annualLimit);
    if (annualLimit >= 20000) basePremium *= 1.3;
    else if (annualLimit >= 10000) basePremium *= 1.0;
    else basePremium *= 0.8;

    // Wellness add-on
    let wellnessAdd = 0;
    if (formData.addWellness) {
      wellnessAdd = 15;
    }

    const finalPremium = basePremium + wellnessAdd;
    
    setResult(`$${Math.round(finalPremium)}/mo`);
    setShowResult(true);

    // Save to context
    saveResult({
      type: 'pet',
      result: `$${Math.round(finalPremium)}/mo`,
      inputs: [
        { label: 'Pet Type', value: formData.petType === 'dog' ? 'Dog' : 'Cat' },
        { label: 'Breed', value: formData.breed },
        { label: 'Age', value: `${age} years` },
        { label: 'Coverage Level', value: formData.coverageLevel.charAt(0).toUpperCase() + formData.coverageLevel.slice(1) },
        { label: 'Deductible', value: `$${deductible}` },
        { label: 'Reimbursement', value: `${reimbursement}%` },
        { label: 'Annual Limit', value: `$${annualLimit.toLocaleString()}` },
        { label: 'Wellness', value: formData.addWellness ? 'Yes' : 'No' },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-yellow-800">
            Get a personalized pet insurance estimate based on your pet's breed, age, and coverage preferences. Protect your furry friend today!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pet Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pet Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, petType: 'dog', breed: '' })}
              className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                formData.petType === 'dog'
                  ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              🐕 Dog
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, petType: 'cat', breed: '' })}
              className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                formData.petType === 'cat'
                  ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              🐈 Cat
            </button>
          </div>
        </div>

        {/* Breed */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Breed <span className="text-red-500">*</span>
          </label>
          <select
            name="breed"
            value={formData.breed}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
          >
            <option value="">Select breed</option>
            {breeds.map(breed => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            min="0"
            max="25"
            placeholder="Age in years"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Coverage Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Coverage Level <span className="text-red-500">*</span>
          </label>
          <select
            name="coverageLevel"
            value={formData.coverageLevel}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
          >
            <option value="basic">Basic - Accidents Only</option>
            <option value="mid">Mid - Accidents & Illness</option>
            <option value="premium">Premium - Comprehensive</option>
          </select>
        </div>

        {/* Deductible */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual Deductible <span className="text-red-500">*</span>
          </label>
          <select
            name="deductible"
            value={formData.deductible}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
          >
            <option value="100">$100</option>
            <option value="250">$250</option>
            <option value="500">$500</option>
            <option value="1000">$1,000</option>
          </select>
        </div>

        {/* Reimbursement */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reimbursement Level <span className="text-red-500">*</span>
          </label>
          <select
            name="reimbursement"
            value={formData.reimbursement}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
          >
            <option value="70">70%</option>
            <option value="80">80%</option>
            <option value="90">90%</option>
          </select>
        </div>

        {/* Annual Limit */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual Coverage Limit <span className="text-red-500">*</span>
          </label>
          <select
            name="annualLimit"
            value={formData.annualLimit}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
          >
            <option value="5000">$5,000</option>
            <option value="10000">$10,000</option>
            <option value="20000">$20,000</option>
            <option value="unlimited">Unlimited</option>
          </select>
        </div>

        {/* Wellness Add-on */}
        <div className="md:col-span-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="addWellness"
              checked={formData.addWellness}
              onChange={handleInputChange}
              className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
            />
            <span className="text-sm font-semibold text-gray-700">
              Add Wellness & Preventive Care (+$15/mo)
            </span>
          </label>
          <p className="text-xs text-gray-500 ml-8 mt-1">Includes vaccinations, annual exams, dental cleaning</p>
        </div>
      </div>

      <button
        onClick={calculatePremium}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl"
      >
        Calculate Pet Insurance Premium
      </button>

      {showResult && result && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 shadow-lg animate-fadeIn">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🐾</div>
            <h3 className="text-2xl font-bold text-yellow-900 mb-2">Your Estimated Premium</h3>
            <div className="text-5xl font-bold text-yellow-600">{result}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div className="bg-white rounded-lg p-3">
              <div className="text-gray-600 mb-1">Coverage</div>
              <div className="font-bold text-gray-900 capitalize">{formData.coverageLevel}</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-gray-600 mb-1">Deductible</div>
              <div className="font-bold text-gray-900">${formData.deductible}</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-gray-600 mb-1">Reimbursement</div>
              <div className="font-bold text-gray-900">{formData.reimbursement}%</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-gray-600 mb-1">Annual Limit</div>
              <div className="font-bold text-gray-900">${parseInt(formData.annualLimit).toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-yellow-200">
            <h4 className="font-bold text-gray-900 mb-2">What's Covered:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Accidents & injuries (broken bones, lacerations, etc.)</span>
              </li>
              {formData.coverageLevel !== 'basic' && (
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Illnesses (cancer, infections, digestive issues, etc.)</span>
                </li>
              )}
              {formData.coverageLevel === 'premium' && (
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Hereditary & congenital conditions</span>
                </li>
              )}
              {formData.addWellness && (
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Wellness care (vaccinations, annual exams, dental)</span>
                </li>
              )}
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> This is an estimate. Actual premiums vary by location, specific plan details, and pet health history. Pre-existing conditions are typically not covered.
            </p>
          </div>

          {/* ✅ ENHANCED SEO CONTENT - Optimized Length & Keyword Density */}
          <div className="sr-only">
            <h2>Pet Insurance Calculator - Comprehensive Coverage Estimator</h2>
            <p>
              Calculate accurate pet insurance premiums with our free dog insurance calculator and cat insurance cost estimator. 
              Get breed-specific quotes for popular breeds including Labrador Retriever, Golden Retriever, German Shepherd, 
              French Bulldog, Beagle, Maine Coon, Persian, and Siamese cats. Our veterinary insurance premium calculator helps 
              you compare accident-only coverage, comprehensive illness protection, and wellness care plans. Estimate monthly costs 
              based on your pet's age, breed health risks, deductible preferences ($100-$1000), reimbursement levels (70%-90%), 
              and annual coverage limits ($5K-Unlimited). Calculate insurance for puppies, kittens, adult pets, and senior animals 
              while understanding hereditary condition coverage, emergency vet visit protection, and preventive care benefits. 
              Compare multi-pet discounts and find affordable pet health insurance tailored to your furry companion's specific needs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetCalculator;