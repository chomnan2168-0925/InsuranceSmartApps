// components/forms/AskAnExpertForm.tsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ASK_AN_EXPERT_SUBJECTS, INTEREST_OPTIONS } from '@/config/form.config';
import locationData from '@/data/locationData.json';
import LockIcon from '../icons/LockIcon';

const MAX_WORDS = 200;

// Define proper types for location data
interface LocationOption {
  value: string;
  label: string;
}

interface CountryOption extends LocationOption {
  states?: LocationOption[];
}

const AskAnExpertForm = () => {
  const [question, setQuestion] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<LocationOption | null>(null);
  const [selectedState, setSelectedState] = useState<LocationOption | null>(null);
  const [stateOptions, setStateOptions] = useState<LocationOption[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const words = question.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [question]);
  
  const handleCountryChange = (selectedOption: LocationOption | null) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null); // Reset state when country changes
    
    if (selectedOption) {
      const country = (locationData as CountryOption[]).find(
        c => c.value === selectedOption.value
      );
      setStateOptions(country?.states || []);
    } else {
      setStateOptions([]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    // Validate word count
    if (wordCount > MAX_WORDS) {
      setError(`Your question exceeds the ${MAX_WORDS} word limit. Please shorten it.`);
      return;
    }

    if (wordCount === 0) {
      setError('Please enter your question.');
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Get selected interests
    const interests: string[] = [];
    formData.getAll('interests').forEach(value => {
      interests.push(value as string);
    });

    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: selectedSubject === 'Other' ? customSubject : selectedSubject,
      question: question,
      country: selectedCountry?.label || '',
      state: selectedState?.label || '',
      interests: interests.join(', '), // Convert array to comma-separated string
      topic: formData.get('subject') as string, // For categorization
    };

    try {
      console.log('Submitting expert question:', payload);
      
      const res = await fetch('/api/forms/expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        console.log('Success:', result);
        setIsSubmitted(true);
      } else {
        console.error('Error response:', result);
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success Message Component
  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-2xl font-bold text-navy-blue">Thank you!</h3>
        <p className="mt-2 text-gray-600">
          We've received your question and our experts will get back to you shortly.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-gold text-navy-blue font-semibold rounded-md hover:bg-yellow-400 transition-colors"
        >
          Submit Another Question
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500 italic">* Required Field</p>
      
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
      
      {/* Subject Selection */}
<div>
  <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-1">
    Subject*
  </label>
  <select
    id="subject-select"
    value={selectedSubject}
    onChange={(e) => {
      setSelectedSubject(e.target.value);
      if (e.target.value !== 'Other') {
        setCustomSubject('');
      }
    }}
    required
    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent appearance-none bg-white cursor-pointer"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
      backgroundPosition: 'right 0.5rem center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1.5em 1.5em',
      paddingRight: '2.5rem'
    }}
  >
    <option value="">Select a subject...</option>
    {ASK_AN_EXPERT_SUBJECTS.map(subject => (
      <option key={subject} value={subject}>
        {subject}
      </option>
    ))}
    <option value="Other">Other (Please specify)</option>
  </select>
  
  {/* Conditional "Other" text input */}
  {selectedSubject === 'Other' && (
    <div className="mt-3 animate-fadeIn">
      <input
        type="text"
        value={customSubject}
        onChange={(e) => setCustomSubject(e.target.value)}
        placeholder="Please specify your subject..."
        required
        className="w-full p-2 border-2 border-blue-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold bg-blue-50"
      />
    </div>
  )}
</div>

      {/* Your Question Textarea */}
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
          Your Question*
        </label>
        <textarea
          id="question" 
          name="question" 
          rows={6} 
          required
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          placeholder="Feel free to share what's on your mind."
        />
        <p className={`text-xs mt-1 ${wordCount > MAX_WORDS ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
          {wordCount} / {MAX_WORDS} words {wordCount > MAX_WORDS && '(exceeds limit)'}
        </p>
      </div>
      
      {/* Name and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name*
          </label>
          <input 
            type="text" 
            id="name" 
            name="name"
            required 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent" 
            placeholder="What do your friends call you?"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Your Email*
          </label>
          <input 
            type="email" 
            id="email" 
            name="email"
            required 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent" 
            placeholder="The email you read most often."
          />
        </div>
      </div>
      
      {/* Country and State Dependent Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country*
          </label>
          <Select 
            options={locationData as CountryOption[]} 
            value={selectedCountry}
            onChange={handleCountryChange} 
            className="react-select-container" 
            classNamePrefix="react-select"
            placeholder="Select your country..."
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                borderColor: '#d1d5db',
                '&:hover': {
                  borderColor: '#d4af37'
                }
              })
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State / Province
          </label>
          <Select 
            options={stateOptions} 
            value={selectedState}
            onChange={setSelectedState}
            isDisabled={!selectedCountry || stateOptions.length === 0} 
            className="react-select-container" 
            classNamePrefix="react-select"
            placeholder={!selectedCountry ? "Select country first..." : "Select state..."}
            isClearable
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: '#d1d5db',
                backgroundColor: state.isDisabled ? '#f3f4f6' : 'white',
                '&:hover': {
                  borderColor: state.isDisabled ? '#d1d5db' : '#d4af37'
                }
              })
            }}
          />
        </div>
      </div>

      {/* Interests Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I'm interested in...
        </label>
        <div className="space-y-2">
          {INTEREST_OPTIONS.map(interest => (
            <label 
              key={interest} 
              className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:bg-gold has-[:checked]:border-navy-blue transition-colors"
            >
              <input 
                type="checkbox" 
                name="interests" 
                value={interest} 
                className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span className="ml-3 text-sm text-gray-700">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Legal & Consent */}
      <div className="border-t pt-4 space-y-4">
        <label className="flex items-start cursor-pointer">
          <input 
            type="checkbox" 
            name="privacy-consent"
            required 
            className="h-4 w-4 mt-0.5 rounded border-gray-300 text-gold focus:ring-gold"
          />
          <span className="ml-3 text-sm text-gray-600">
            I agree to the{' '}
            <a 
              href="/privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-navy-blue underline hover:text-blue-800"
            >
              Privacy Policy
            </a>
            {' '}and{' '}
            <a 
              href="/terms-of-use" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-navy-blue underline hover:text-blue-800"
            >
              Terms of Use
            </a>.*
          </span>
        </label>
        
        <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
          <LockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>Your personal information is confidential and secure.</span>
        </div>
      </div>
      
      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading || wordCount > MAX_WORDS}
        className="w-full py-3 bg-gold text-navy-blue font-bold rounded-md text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gold"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        ) : (
          'Submit Request'
        )}
      </button>
    </form>
  );
};

export default AskAnExpertForm;