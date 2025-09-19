// FIX: Replaced placeholder content with a complete, functional Header component.
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import siteConfig from '@/config/siteConfig.json';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
                <div className="relative h-8 w-8">
                    {/* Assuming a logo exists at public/logo.png */}
                    <Image src="/logo.png" alt={`${siteConfig.siteName} logo`} layout="fill" objectFit="contain" />
                </div>
                <span className="font-bold text-xl text-navy-blue">{siteConfig.siteName}</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-gray-700 hover:bg-gray-100 hover:text-navy-blue px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
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
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-gray-700 hover:bg-gray-100 hover:text-navy-blue block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
