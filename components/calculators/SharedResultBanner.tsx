import React from 'react';

interface SharedResultBannerProps {
  calcType: string;
  result: string;
  onTryYourself: () => void;
}

const SharedResultBanner: React.FC<SharedResultBannerProps> = ({
  calcType,
  result,
  onTryYourself
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl mb-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">
            🎉 Your friend shared their {calcType} insurance estimate!
          </h3>
          <p className="text-lg opacity-90">
            Their estimate: <span className="font-black">{result}</span>
          </p>
        </div>
        <button
          onClick={onTryYourself}
          className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Try It Yourself! 🚀
        </button>
      </div>
    </div>
  );
};

export default SharedResultBanner;