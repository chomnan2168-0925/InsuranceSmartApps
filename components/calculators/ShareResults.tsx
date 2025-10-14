import React, { useState } from 'react';
import { CalculatorResult } from '@/context/CalculatorContext';

interface ShareResultsProps {
  result: CalculatorResult;
}

const ShareResults: React.FC<ShareResultsProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const generateShareableURL = () => {
    const params = new URLSearchParams();
    params.set('calc', result.type);
    params.set('result', result.result);
    result.inputs.forEach((input, idx) => {
      params.set(`input${idx}`, `${input.label}:${input.value}`);
    });
    return `${window.location.origin}/calculators?${params.toString()}`;
  };

  const copyToClipboard = () => {
    const url = generateShareableURL();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Check out my ${result.type} insurance estimate: ${result.result}`;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Your Results
      </h4>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={copyToClipboard}
          className="flex-1 min-w-[120px] px-4 py-2 bg-white border-2 border-blue-500 text-blue-600 rounded-md font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-2">
        Share this link with friends or save it for later reference
      </p>
    </div>
  );
};

export default ShareResults;