import React from 'react';

interface RevisionHistoryProps {
    articleId?: string;
}

// Mock data for revision history
const mockRevisions = [
    { id: 3, date: '2025-09-26 10:15 AM', author: 'Admin User' },
    { id: 2, date: '2025-09-25 04:30 PM', author: 'Jane Doe' },
    { id: 1, date: '2025-09-25 09:00 AM', author: 'Admin User' },
];

const RevisionHistory: React.FC<RevisionHistoryProps> = ({ articleId }) => {
    const handleRestore = (id: number) => {
        alert(`Restoring version ${id}. (Mock)`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-navy-blue border-b pb-2 mb-4">Revision History</h3>
            <ul className="space-y-3">
                {mockRevisions.map(rev => (
                    <li key={rev.id} className="text-sm flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-700">
                                Version from {rev.date}
                            </p>
                            <p className="text-xs text-gray-500">
                                by {rev.author}
                            </p>
                        </div>
                        <div className="space-x-2">
                           <button onClick={() => handleRestore(rev.id)} className="text-navy-blue hover:underline font-semibold">Restore</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RevisionHistory;