import React from 'react';
import { useRouter } from 'next/router';

interface AdBannerProps {
  position: 'top' | 'bottom';
}

const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const router = useRouter();

  // Don't display on admin pages
  if (router.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="container mx-auto my-4 px-4">
      <div className="border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500 rounded-lg">
        <p>Ad Banner Slot</p>
      </div>
    </div>
  );
};

export default AdBanner;