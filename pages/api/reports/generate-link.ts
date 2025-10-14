// pages/api/reports/generate-link.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import type { ReportSummaryData, ReportDataItem } from '@/types';

const filePath = path.resolve(process.cwd(), 'data/sharableReports.json');

// Local SavedReport interface to avoid union type issues
interface SavedReport {
  id: string;
  title: string;
  period: string;
  data: ReportSummaryData; // Always use summary data
  rawData?: ReportDataItem[];
  aiSummary?: string;
  createdAt: string;
  expires: string;
}

// Helper function to safely read the JSON file
const readDb = (): Record<string, SavedReport> => {
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      // Ensure we don't crash on an empty or malformed file
      return fileData ? JSON.parse(fileData) : {};
    }
  } catch (error) {
    console.error('Error reading sharableReports.json:', error);
  }
  return {}; // Return an empty object if the file doesn't exist or is malformed
};

// Helper function to safely write the JSON file
const writeDb = (data: Record<string, SavedReport>): boolean => {
  try {
    // Ensure the data directory exists
    const dataDir = path.dirname(filePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing sharableReports.json:', error);
    return false;
  }
};

type ResponseData = {
  url?: string;
  id?: string;
  title?: string;
  expires?: string;
  message?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // This API only accepts POST requests
  if (req.method === 'POST') {
    try {
      const reportsDb = readDb();
      const newReportData = req.body;
      
      // Validate required fields
      if (!newReportData.title || !newReportData.data) {
        return res.status(400).json({ 
          error: 'Missing required fields: title and data are required' 
        });
      }

      const newId = nanoid(10); // Generate a unique ID

      // Calculate expiry date (30 days from now)
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + 30); 
      const expiryString = newExpiry.toISOString().split('T')[0];

      // Create the saved report object
      const savedReport: SavedReport = {
        id: newId,
        title: newReportData.title,
        period: newReportData.period || '',
        data: newReportData.data,
        rawData: newReportData.rawData,
        aiSummary: newReportData.aiSummary,
        createdAt: new Date().toISOString(),
        expires: expiryString,
      };

      // Add to database
      reportsDb[newId] = savedReport;

      // Save the updated database back to the file
      const writeSuccess = writeDb(reportsDb);

      if (!writeSuccess) {
        return res.status(500).json({ 
          message: 'Failed to save report. Please try again.' 
        });
      }

      console.log(`✅ Generated new report link: ${newId} (expires: ${expiryString})`);

      // Respond with the details of the newly created report link
      res.status(200).json({
        url: `/reports/view/${newId}`,
        id: newId,
        title: newReportData.title,
        expires: expiryString,
      });
    } catch (error) {
      console.error('Error generating link:', error);
      res.status(500).json({ 
        message: 'Failed to generate link. Server error.' 
      });
    }
  } else {
    // For any other request type, tell the client it's not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ 
      error: `Method ${req.method} Not Allowed` 
    });
  }
}