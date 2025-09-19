import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import siteConfig from '@/config/siteConfig.json';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-blue text-white mt-auto border-t-2 border-gold">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Column 1: Footer Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {siteConfig.footerLinks.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-gold transition-colors duration-300">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Copyright */}
          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-300">
              &copy; {currentYear} {siteConfig.siteName}. All Rights Reserved.
            </p>
          </div>

          {/* Column 3: Social Links */}
          <div className="flex flex-col items-center md:items-end">
             <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
            <div className="flex space-x-6">
              {siteConfig.socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex items-center space-x-2 hover:text-gold transition-colors duration-300"
                >
                  <div className="relative w-6 h-6">
                    <Image 
                      src={social.icon} 
                      alt={`${social.name} icon`} 
                      layout="fill" 
                      objectFit="contain" 
                      className="filter invert"
                    />
                  </div>
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
