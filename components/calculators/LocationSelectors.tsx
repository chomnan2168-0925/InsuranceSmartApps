import React from 'react';

interface LocationSelectorsProps {
  state: string;
  zip: string;
  onStateChange: (state: string) => void;
  onZipChange: (zip: string) => void;
}

const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const LocationSelectors: React.FC<LocationSelectorsProps> = ({ state, zip, onStateChange, onZipChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4 my-4">
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
        <select
          id="state"
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm rounded-md"
        >
          <option value="" disabled>Select State</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP Code</label>
        <input
          type="text"
          id="zip"
          value={zip}
          onChange={(e) => onZipChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
          placeholder="e.g., 90210"
        />
      </div>
    </div>
  );
};

export default LocationSelectors;
