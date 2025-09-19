
import React from 'react';
import Link from 'next/link';

const mockReports = [
  { id: 'q3-2024-summary', title: 'Q3 2024 Traffic Report', date: '2024-10-05' },
  { id: 'q2-2024-summary', title: 'Q2 2024 Traffic Report', date: '2024-07-06' },
];

const MarketingReports = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-navy-blue mb-4">Marketing &amp; Traffic Reports</h3>
      <p className="text-sm text-gray-600 mb-4">
        View AI-generated summaries of website traffic and performance for different periods.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Report Title</th>
              <th className="p-3">Date Generated</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{report.title}</td>
                <td className="p-3 text-gray-600">{report.date}</td>
                <td className="p-3">
                  <Link
                    href={`/reports/traffic/${report.id}`}
                    className="text-navy-blue hover:underline text-sm font-semibold"
                    target="_blank" // Open in new tab to not navigate away from admin
                  >
                    View Report
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketingReports;
