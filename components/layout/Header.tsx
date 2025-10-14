import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import siteConfig from '@/config/siteConfig.json';
import MobileNavPanel from './MobileNavPanel';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-gold">
      <nav className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
                <div className="relative h-8 w-8">
                    {/* --- UPDATED: Image props are now modern --- */}
                    <Image 
                      src="/logo.png" 
                      alt={`${siteConfig.siteName} logo`} 
                      fill 
                      style={{ objectFit: 'contain' }}
                    />
                </div>
                <span className="font-bold text-xl text-navy-blue">{siteConfig.siteName}</span>
            </Link>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-end">
            <div className="grid grid-cols-4 gap-1 items-center">
              {siteConfig.navLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="relative group whitespace-nowrap text-center text-gray-700 hover:text-gold px-3 py-2 border border-transparent rounded-md text-lg font-medium transition-colors duration-300 overflow-hidden"
                >
                  <span className="absolute top-0 left-0 w-0 h-px bg-gold transition-all duration-100 ease-out group-hover:w-full"></span>
                  <span className="absolute top-0 right-0 w-px h-0 bg-gold transition-all duration-100 ease-out delay-100 group-hover:h-full"></span>
                  <span className="absolute bottom-0 right-0 w-0 h-px bg-gold transition-all duration-100 ease-out delay-200 group-hover:w-full"></span>
                  <span className="absolute bottom-0 left-0 w-px h-0 bg-gold transition-all duration-100 ease-out delay-300 group-hover:h-full"></span>
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-navy-blue hover:text-white hover:bg-navy-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileNavPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;