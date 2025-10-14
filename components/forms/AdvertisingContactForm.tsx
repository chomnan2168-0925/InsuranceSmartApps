// components/forms/AdvertisingContactForm.tsx
import React, { useState } from 'react';
import LockIcon from '../icons/LockIcon';

const AdvertisingContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const payload = {
      companyName: formData.get('company'), // Changed to match API
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      website: formData.get('website') || '',
      budget: formData.get('budget') || '',
      message: formData.get('message'),
    };

    try {
      console.log('Submitting advertising inquiry:', payload);
      
      const res = await fetch('/api/forms/advertising', {
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
        setError(result.message || 'Something went wrong. Please try again later.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center border">
        <svg
          className="w-16 h-16 mx-auto text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-2xl font-bold text-navy-blue">Thank You!</h3>
        <p className="mt-2 text-gray-600">
          Our partnership team will review your inquiry and be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-lg space-y-6 border"
    >
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium">
            Company Name*
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="Your company name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Work Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number*
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="website" className="block text-sm font-medium">
            Website <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="url"
            id="website"
            name="website"
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="https://yourwebsite.com"
          />
        </div>
        <div>
          <label htmlFor="budget" className="block text-sm font-medium">
            Budget Range <span className="text-gray-400">(Optional)</span>
          </label>
          <select
            id="budget"
            name="budget"
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          >
            <option value="">Select budget range...</option>
            <option value="Under $5,000">Under $5,000</option>
            <option value="$5,000 - $10,000">$5,000 - $10,000</option>
            <option value="$10,000 - $25,000">$10,000 - $25,000</option>
            <option value="$25,000 - $50,000">$25,000 - $50,000</option>
            <option value="$50,000+">$50,000+</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message*
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          placeholder="Tell us a bit about your brand and what you're looking to achieve..."
        ></textarea>
      </div>

      <div className="border-t pt-6 space-y-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="privacy-consent"
            required
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="ml-3 text-sm text-gray-600">
            I agree to the{' '}
            <a 
              href="/privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-navy-blue underline"
            >
              Privacy Policy
            </a>.*
          </span>
        </label>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <LockIcon className="w-4 h-4 mr-2" />
          <span>Your information is confidential and secure.</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gold text-navy-blue font-bold rounded-md text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
};

export default AdvertisingContactForm;