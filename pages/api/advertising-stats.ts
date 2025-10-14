import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'data/advertisingStats.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Handle SAVING the new data
    try {
      const newData = JSON.stringify(req.body, null, 2);
      fs.writeFileSync(filePath, newData);
      res.status(200).json({ message: 'Stats saved successfully!' });
    } catch (error) {
      console.error('[ADVERTISING-STATS] Error saving stats:', error);
      res.status(500).json({ message: 'Error saving stats.' });
    }
  } else if (req.method === 'GET') {
    // Handle GETTING the current data
    try {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileData);
      res.status(200).json(data);
    } catch (error) {
      console.error('[ADVERTISING-STATS] Error fetching stats:', error);
      res.status(500).json({ message: 'Error fetching stats.' });
    }
  } else {
    // Method not allowed
    res.status(405).json({ message: 'Method not allowed' });
  }
}