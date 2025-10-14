import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import siteConfig from '@/config/siteConfig.json';

interface MobileNavPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavPanel: React.FC<MobileNavPanelProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-40 md:hidden ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Overlay with transition */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div
        className={`relative w-2/3 max-w-[300px] h-full bg-white/80 backdrop-blur-md p-4 flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center space-x-2">
            <div className="relative h-10 w-10">
              <Image src="/logo.png" alt={`${siteConfig.siteName} logo`} layout="fill" objectFit="contain" />
            </div>
          </Link>
          <button onClick={onClose} className="p-2 -mr-2">
            <svg
              className="h-6 w-6 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <nav className="flex flex-col flex-grow">
          {/* Main Header Links */}
          <div className="flex flex-col space-y-1">
            {siteConfig.navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.title}
                href={link.href}
                onClick={onClose}
                className="flex items-center space-x-3 text-gray-800 hover:text-gold hover:bg-gray-100 px-3 py-3 rounded-md text-lg font-medium transition-colors"
              >
                <img src={link.icon} alt="" className="w-5 h-5 opacity-70" />
                <span>{link.title}</span>
              </Link>
            ))}
          </div>

          <div className="flex-grow"></div>

          {/* Separator and Footer Links */}
          <div className="flex flex-col space-y-1 flex-shrink-0">
             <div className="border-b border-gold my-2"></div>
            {siteConfig.footerLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                onClick={onClose}
                className="flex items-center space-x-3 text-gray-800 hover:text-gold hover:bg-gray-100 px-3 py-3 rounded-md text-lg font-medium transition-colors"
              >
                 <img src={link.icon} alt="" className="w-5 h-5 opacity-70" />
                 <span>{link.title}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileNavPanel;
