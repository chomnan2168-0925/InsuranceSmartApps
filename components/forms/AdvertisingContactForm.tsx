// FIX: Replaced placeholder content with a complete, functional AdvertisingContactForm component.
import React, { useState, FormEvent } from 'react';

const AdvertisingContactForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMessage('');

    try {
      const response = await fetch('/api/advertising', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, contactName, email, budget, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setResponseMessage(data.message || 'Your inquiry has been submitted successfully!');
        // Clear form
        setCompanyName('');
        setContactName('');
        setEmail('');
        setBudget('');
        setMessage('');
      } else {
        setStatus('error');
        setResponseMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setResponseMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text" id="companyName" value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Contact Name</label>
          <input
            type="text" id="contactName" value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Work Email</label>
        <input
          type="email" id="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Estimated Monthly Budget</label>
        <select
          id="budget" value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm rounded-md"
          required
        >
          <option value="" disabled>Select a range</option>
          <option value="<5000">&lt; $5,000</option>
          <option value="5000-10000">$5,000 - $10,000</option>
          <option value="10000-25000">$10,000 - $25,000</option>
          <option value=">25000">&gt; $25,000</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          id="message" rows={4} value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
          placeholder="Tell us about your advertising goals..."
        ></textarea>
      </div>
      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-navy-blue bg-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
        </button>
      </div>
      {responseMessage && (
        <div className={`p-4 rounded-md text-sm ${
          status === 'success' ? 'bg-green-100 text-green-800' :
          status === 'error' ? 'bg-red-100 text-red-800' : ''
        }`}>
          {responseMessage}
        </div>
      )}
    </form>
  );
};

export default AdvertisingContactForm;
