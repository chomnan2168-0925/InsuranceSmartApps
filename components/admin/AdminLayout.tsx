import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import siteConfig from '@/config/siteConfig.json';
import { useSampleData } from '@/config/featureFlags';
import { supabase } from '@/lib/supabaseClient';


// Simple icon components for demonstration
const Icon = ({ d }: { d: string }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d}></path></svg>
);
const DashboardIcon = () => <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
const ContentIcon = () => <Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />;
const MediaIcon = () => <Icon d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />;
const UsersIcon = () => <Icon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197" />;
const AnalyticsIcon = () => <Icon d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />;
const SeoIcon = () => <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />;
const SettingsIcon = () => <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />;
const LogoutIcon = () => <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />;


const navItems = [
  { href: '/admin0925', label: 'Dashboard', icon: <DashboardIcon /> },
  { href: '/admin0925/content', label: 'Content', icon: <ContentIcon /> },
  { href: '/admin0925/media', label: 'Media', icon: <MediaIcon /> },
  { href: '/admin0925/users', label: 'Users', icon: <UsersIcon /> },
  { href: '/admin0925/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  { href: '/admin0925/seo', label: 'SEO Hub', icon: <SeoIcon /> },
  { href: '/admin0925/settings', label: 'Settings', icon: <SettingsIcon /> },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = async () => {
    if (useSampleData) {
        localStorage.removeItem('sample-auth-token');
    } else {
        await supabase.auth.signOut();
    }
    router.push('/login');
  };

  // FIX: Changed component to React.FC to correctly handle props like 'key' from .map().
  const NavLink: React.FC<{ href: string; label: string; icon: React.ReactNode }> = ({ href, label, icon }) => {
    const isActive = router.asPath === href || (href !== '/admin0925' && router.asPath.startsWith(href));
    return (
      <Link href={href} className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive ? 'bg-gold text-navy-blue' : 'text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
      }`}>
          {icon}
          <span>{label}</span>
      </Link>
    );
  };
  
  const sidebarContent = (
      <div className="flex flex-col h-full bg-navy-blue">
        <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 space-x-2 border-b border-white border-opacity-20">
           <div className="relative h-8 w-8">
             <Image src="/logo.png" alt={`${siteConfig.siteName} logo`} layout="fill" objectFit="contain" className="filter invert" />
           </div>
           <span className="font-bold text-xl text-white">{siteConfig.siteName} Admin</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map(item => <NavLink key={item.href} {...item} />)}
        </nav>
        <div className="px-2 py-4 border-t border-white border-opacity-20">
             <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white">
                <LogoutIcon />
                <span>Logout</span>
             </button>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
       {/* Mobile sidebar toggle */}
        <div className="md:hidden fixed top-4 left-4 z-40">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md bg-white text-navy-blue shadow-md">
                <Icon d="M4 6h16M4 12h16M4 18h16" />
            </button>
        </div>
        
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0`}>
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;