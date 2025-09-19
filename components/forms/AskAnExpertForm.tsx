import React, { useState, FormEvent } from 'react';
import Checkbox from '../ui/Checkbox';

const AskAnExpertForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('retirement');
  const [question, setQuestion] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setStatus('error');
      setMessage('You must agree to the terms and conditions.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, question }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Your question has been submitted successfully!');
        // Clear form
        setName('');
        setEmail('');
        setTopic('retirement');
        setQuestion('');
        setAgreed(false);
      } else {
        setStatus('error');
        setMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic</label>
        <select
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm rounded-md"
        >
          <option value="retirement">Retirement Planning</option>
          <option value="investment">Investment Strategies</option>
          <option value="budgeting">Budgeting & Saving</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700">Your Question</label>
        <textarea
          id="question"
          rows={5}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
          required
        ></textarea>
      </div>

      <Checkbox
        id="agree"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        label="I agree to the Terms of Use and Privacy Policy."
      />
      
      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-navy-blue bg-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Question'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-md text-sm ${
          status === 'success' ? 'bg-green-100 text-green-800' :
          status === 'error' ? 'bg-red-100 text-red-800' : ''
        }`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default AskAnExpertForm;
