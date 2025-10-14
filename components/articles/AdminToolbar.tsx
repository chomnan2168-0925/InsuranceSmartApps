import React from 'react';
import Link from 'next/link'; // Import the Link component

interface AdminToolbarProps {
  slug: string;
}

// In a real app, you would have a hook like `useAuth()` to check admin status.
// const { isAdmin } = useAuth();
const AdminToolbar: React.FC<AdminToolbarProps> = ({ slug }) => {
  const isAdmin = true; // For now, we are still mocking the admin status

  if (!isAdmin) {
    return null;
  }

  // The destination URL for the edit page
  const editUrl = `/admin0925/content/${slug}`;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-r-md">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="font-bold">Admin Preview</p>
          <p className="text-sm">You are viewing this live page as an administrator.</p>
        </div>
        
        <Link
          href={editUrl}
          target="_blank" // This opens the link in a new tab
          rel="noopener noreferrer"
          className="bg-navy-blue text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 transition-colors flex-shrink-0"
        >
          Edit Post
        </Link>
      </div>
    </div>
  );
};

export default AdminToolbar;