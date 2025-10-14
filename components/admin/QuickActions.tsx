import React from 'react';
import Link from 'next/link';

const Icon = ({ d }: { d: string }) => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d}></path></svg>
);

const actions = [
    { label: 'New Article', href: '/admin0925/content/new', icon: <Icon d="M12 6v6m0 0v6m0-6h6m-6 0H6" /> },
    { label: 'Upload Media', href: '/admin0925/media', icon: <Icon d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /> },
    { label: 'View Users', href: '/admin0925/users', icon: <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    { label: 'Site Settings', href: '/admin0925/settings', icon: <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /> },
];

const QuickActions = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-xl font-bold text-navy-blue mb-4">Quick Actions</h3>
            <div className="space-y-3">
                {actions.map(action => (
                    <Link key={action.href} href={action.href} className="flex items-center space-x-3 p-3 rounded-md text-navy-blue font-semibold bg-gray-50 hover:bg-gold transition-colors">
                        {action.icon}
                        <span>{action.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;