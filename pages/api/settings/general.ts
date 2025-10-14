// pages/api/settings/general.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Path to your site configuration file
const filePath = path.resolve(process.cwd(), 'config/siteConfig.json');

type ResponseData = {
  message?: string;
  [key: string]: any; // Allow any site settings to be returned
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // --- This handles GET requests (reading the data) ---
  if (req.method === 'GET') {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        // Return default settings if file doesn't exist
        return res.status(200).json({
          siteName: 'My Site',
          siteDescription: 'Site description',
          contactEmail: 'contact@example.com',
        });
      }

      const fileData = fs.readFileSync(filePath, 'utf8');
      const settings = fileData ? JSON.parse(fileData) : {};
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Error reading site settings:', error);
      return res.status(500).json({ 
        message: 'Failed to read site settings.' 
      });
    }
  }

  // --- This handles POST requests (saving the data) ---
  if (req.method === 'POST') {
    try {
      // Ensure the config directory exists
      const configDir = path.dirname(filePath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      let currentSettings = {};

      // Read the existing file first to not lose other settings
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        currentSettings = fileData ? JSON.parse(fileData) : {};
      }
      
      // Merge the new settings from the admin panel with the existing ones
      const newSettings = { ...currentSettings, ...req.body };
      
      // Write the entire updated object back to the file
      fs.writeFileSync(filePath, JSON.stringify(newSettings, null, 2), 'utf-8');
      
      console.log('✅ Site settings saved successfully');
      
      return res.status(200).json({ 
        message: 'Settings saved successfully!' 
      });
    } catch (error) {
      console.error('Error saving site settings:', error);
      return res.status(500).json({ 
        message: 'Failed to save site settings.' 
      });
    }
  }

  // If the method is not GET or POST, it's not allowed.
  return res.status(405).json({ 
    message: 'Method Not Allowed' 
  });
}