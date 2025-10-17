import React, { useState, useEffect } from 'react';
import sampleReportsData from '@/data/sampleMarketingReports.json';

// Define proper types for the report data
interface ReportData {
  month: string;
  totalVisitors: number;
  pageviews: number;
  avgSessionDuration: string;
  bounceRate: number;
}

interface Report {
  id: string;
  title: string;
  period: string;
  data: ReportData[] | any;
  aiSummary?: string;
}

interface ReportsData {
  reports: {
    [key: string]: Report;
  };
}

// Security: Sanitize text to prevent XSS
const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Security: Validate month format (YYYY-MM)
const isValidMonth = (month: string): boolean => {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
};

// Security: Sanitize numeric input
const sanitizeNumber = (value: string): string => {
  return value.replace(/[^\d,]/g, ''); // Only allow digits and commas
};

const MarketingTab = () => {
  // Type the reports data properly
  const typedReportsData = sampleReportsData as unknown as ReportsData;
  const reportKeys = Object.keys(typedReportsData.reports);

  // State management with sanitized defaults
  const [stats, setStats] = useState({
    uniqueVisitors: '',
    pageviews: '',
    avgEngagement: ''
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedRawReportId, setSelectedRawReportId] = useState(reportKeys[0] || '');
  const [startMonth, setStartMonth] = useState('2024-01');
  const [endMonth, setEndMonth] = useState('2024-12');
  const [loadedData, setLoadedData] = useState<ReportData[]>([]);
  
  // Fetch initial data on component load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/advertising-stats");
        if (res.ok) {
          const data = await res.json();
          // Sanitize received data
          setStats({
            uniqueVisitors: sanitizeNumber(data.uniqueVisitors || ''),
            pageviews: sanitizeNumber(data.pageviews || ''),
            avgEngagement: sanitizeText(data.avgEngagement || '')
          });
        }
      } catch (err) {
        console.error("Failed to fetch advertising stats", err);
      }
    };
    
    fetchStats();
  }, []);

  // Handlers with input sanitization
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Sanitize based on field type
    let sanitizedValue = value;
    if (name === 'uniqueVisitors' || name === 'pageviews') {
      sanitizedValue = sanitizeNumber(value);
    } else if (name === 'avgEngagement') {
      sanitizedValue = sanitizeText(value);
    }
    
    setStats(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleSaveStats = async () => {
    setStatusMessage('Saving...');
    
    // Validate inputs before sending
    if (!stats.uniqueVisitors || !stats.pageviews || !stats.avgEngagement) {
      setStatusMessage('❌ Error: All fields are required.');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
    
    try {
      const res = await fetch("/api/advertising-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueVisitors: sanitizeNumber(stats.uniqueVisitors),
          pageviews: sanitizeNumber(stats.pageviews),
          avgEngagement: sanitizeText(stats.avgEngagement)
        }),
      });
      
      if (res.ok) {
        setStatusMessage('✅ Advertise page stats saved successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setStatusMessage('❌ Error: Failed to save stats.');
      }
    } catch (err) {
      console.error('Error saving stats:', err);
      setStatusMessage('❌ Error: Could not connect to the server.');
    }
  };

  const handleLoadReportData = () => {
    // Security: Validate report ID exists in allowed list
    if (!reportKeys.includes(selectedRawReportId)) {
      alert('Invalid report selected!');
      return;
    }
    
    // Security: Validate date formats
    if (!isValidMonth(startMonth) || !isValidMonth(endMonth)) {
      alert('Invalid date format!');
      return;
    }
    
    // Security: Ensure end month is after start month
    if (startMonth > endMonth) {
      alert('End month must be after start month!');
      return;
    }
    
    const report = typedReportsData.reports[selectedRawReportId];
    
    if (!report) {
      alert('Report not found!');
      return;
    }

    // Check if data is an array (monthly data) or object (summary data)
    const reportData = Array.isArray(report.data) ? report.data : [];
    
    if (reportData.length === 0) {
      alert('This report does not have monthly data. Please select a different report.');
      setLoadedData([]);
      return;
    }

    // Filter data by date range with validation
    const filteredData = reportData.filter((item: ReportData) => {
      // Validate item has required fields
      if (!item.month || !isValidMonth(item.month)) {
        return false;
      }
      return item.month >= startMonth && item.month <= endMonth;
    });

    if (filteredData.length === 0) {
      alert('No data found for the selected date range. Please adjust your filters.');
      setLoadedData([]);
      return;
    }

    setLoadedData(filteredData);
    setStatusMessage(`✅ Loaded ${filteredData.length} months of data`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Security: Sanitize report title for display
  const getReportTitle = (reportId: string): string => {
    const report = typedReportsData.reports[reportId];
    return report ? sanitizeText(report.title) : 'Unknown Report';
  };

  return (
    <div className="space-y-6">

      {/* 1. Update Advertise Page Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 border-2 border-gold">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-navy-blue">Update Advertise Page Stats</h3>
            <p className="text-sm text-gray-600 mt-1">
              Manually enter the key audience metrics to be displayed on the public Advertise page.
            </p>
          </div>
          <a 
            href="/advertise" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View Public Page →
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label htmlFor="uniqueVisitors" className="block text-sm font-medium text-gray-700 mb-1">
              Unique Visitors
            </label>
            <input 
              type="text" 
              id="uniqueVisitors"
              name="uniqueVisitors" 
              value={stats.uniqueVisitors} 
              onChange={handleInputChange}
              maxLength={20}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold" 
              placeholder="e.g., 150,000" 
            />
            <p className="text-xs text-gray-500 mt-1">Monthly unique visitors</p>
          </div>
          <div>
            <label htmlFor="pageviews" className="block text-sm font-medium text-gray-700 mb-1">
              Pageviews
            </label>
            <input 
              type="text"
              id="pageviews"
              name="pageviews" 
              value={stats.pageviews} 
              onChange={handleInputChange}
              maxLength={20}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold" 
              placeholder="e.g., 500,000" 
            />
            <p className="text-xs text-gray-500 mt-1">Total monthly pageviews</p>
          </div>
          <div>
            <label htmlFor="avgEngagement" className="block text-sm font-medium text-gray-700 mb-1">
              Avg. Engagement Time
            </label>
            <input 
              type="text"
              id="avgEngagement"
              name="avgEngagement" 
              value={stats.avgEngagement} 
              onChange={handleInputChange}
              maxLength={20}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold" 
              placeholder="e.g., 2m 30s" 
            />
            <p className="text-xs text-gray-500 mt-1">Average time per session</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <button 
            onClick={handleSaveStats} 
            className="px-6 py-2 bg-gold text-navy-blue font-bold rounded-md hover:bg-yellow-400 transition-colors"
          >
            Save Advertise Page Stats
          </button>
          {statusMessage && (
            <p className="text-sm font-medium text-gray-700">{statusMessage}</p>
          )}
        </div>
      </div>
      
      {/* 2. Create & Customize Sharable Report */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <h3 className="text-xl font-bold text-navy-blue">
            Create & Customize Sharable Report
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Generate professional marketing reports with custom date ranges for partners and advertisers.
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm text-gray-700">
            <strong>How it works:</strong> Select a report, choose a date range, load the data, then customize and generate a sharable link.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="reportSelect" className="block text-sm font-medium text-gray-700 mb-1">
              1. Select Base Report
            </label>
            <select 
              id="reportSelect"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={selectedRawReportId} 
              onChange={(e) => {
                const value = e.target.value;
                // Security: Validate selection is in allowed list
                if (reportKeys.includes(value)) {
                  setSelectedRawReportId(value);
                }
              }}
            >
              {reportKeys.map((key) => {
                const report = typedReportsData.reports[key];
                return (
                  <option key={report.id} value={report.id}>
                    {sanitizeText(report.title)}
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {sanitizeText(typedReportsData.reports[selectedRawReportId]?.period || 
               typedReportsData.reports[selectedRawReportId]?.title || 
               'Select a report')}
            </p>
          </div>
          <div>
            <label htmlFor="startMonth" className="block text-sm font-medium text-gray-700 mb-1">
              2. Start Month
            </label>
            <input 
              type="month"
              id="startMonth"
              value={startMonth} 
              onChange={e => {
                const value = e.target.value;
                if (isValidMonth(value)) {
                  setStartMonth(value);
                }
              }} 
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              min="2024-01"
              max="2024-12"
            />
          </div>
          <div>
            <label htmlFor="endMonth" className="block text-sm font-medium text-gray-700 mb-1">
              3. End Month
            </label>
            <input 
              type="month"
              id="endMonth"
              value={endMonth} 
              onChange={e => {
                const value = e.target.value;
                if (isValidMonth(value)) {
                  setEndMonth(value);
                }
              }} 
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              min="2024-01"
              max="2024-12"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLoadReportData} 
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition-colors"
          >
            4. Load Report Data
          </button>
          {statusMessage && loadedData.length > 0 && (
            <span className="text-sm text-green-600 font-medium">{statusMessage}</span>
          )}
        </div>
        
        {loadedData.length > 0 && (
          <div className="mt-6 border-t pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-900">Loaded Report Preview</h4>
              <span className="text-sm text-gray-600">
                {loadedData.length} month{loadedData.length !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border-b font-semibold text-left">Month</th>
                    <th className="p-3 border-b font-semibold text-right">Total Visitors</th>
                    <th className="p-3 border-b font-semibold text-right">Pageviews</th>
                    <th className="p-3 border-b font-semibold text-right">Avg. Session</th>
                    <th className="p-3 border-b font-semibold text-right">Bounce Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {loadedData.map((row: ReportData, index: number) => (
                    <tr key={sanitizeText(row.month)} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border-b font-medium">{sanitizeText(row.month)}</td>
                      <td className="p-3 border-b text-right">{Number(row.totalVisitors).toLocaleString()}</td>
                      <td className="p-3 border-b text-right">{Number(row.pageviews).toLocaleString()}</td>
                      <td className="p-3 border-b text-right">
                        {typeof row.avgSessionDuration === 'number' 
                          ? `${Math.floor(row.avgSessionDuration / 60)}m ${row.avgSessionDuration % 60}s`
                          : sanitizeText(String(row.avgSessionDuration))}
                      </td>
                      <td className="p-3 border-b text-right">{Number(row.bounceRate).toFixed(1)}%</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-bold">
                    <td className="p-3 border-t-2 border-blue-200">TOTAL</td>
                    <td className="p-3 border-t-2 border-blue-200 text-right">
                      {loadedData.reduce((sum, row) => sum + Number(row.totalVisitors), 0).toLocaleString()}
                    </td>
                    <td className="p-3 border-t-2 border-blue-200 text-right">
                      {loadedData.reduce((sum, row) => sum + Number(row.pageviews), 0).toLocaleString()}
                    </td>
                    <td className="p-3 border-t-2 border-blue-200 text-right">
                      {Math.floor(loadedData.reduce((sum, row) => {
                        const duration = String(row.avgSessionDuration);
                        const [min, sec] = duration.split('m ');
                        return sum + (parseInt(min) * 60 + parseInt(sec));
                      }, 0) / loadedData.length / 60)}m
                    </td>
                    <td className="p-3 border-t-2 border-blue-200 text-right">
                      {(loadedData.reduce((sum, row) => sum + Number(row.bounceRate), 0) / loadedData.length).toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-600">
                <p>Next step: Customize the report and generate a sharable link</p>
              </div>
              <a 
                href={`/admin0925/reports/${encodeURIComponent(selectedRawReportId)}?start=${encodeURIComponent(startMonth)}&end=${encodeURIComponent(endMonth)}`} 
                className="px-6 py-2 bg-gold text-navy-blue rounded-md font-bold hover:bg-yellow-400 transition-colors inline-flex items-center gap-2"
              >
                5. Customize & Generate Link →
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default MarketingTab;
