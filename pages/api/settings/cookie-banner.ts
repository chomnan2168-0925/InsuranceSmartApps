import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'config', 'cookieBannerSettings.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure config directory exists
  const configDir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (req.method === 'GET') {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
        const settings = JSON.parse(data);
        return res.status(200).json(settings);
      } else {
        // Return default settings if file doesn't exist
        const defaultSettings = {
          enabled: true,
          excludePaths: ['/admin0925', '/dev-admin0925', '/login'],
          style: 'corner',
          position: 'bottom-right',
        };
        return res.status(200).json(defaultSettings);
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to read settings' });
    }
  }

  if (req.method === 'POST') {
    try {
      const settings = req.body;
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(settings, null, 2), 'utf-8');
      return res.status(200).json({ message: 'Settings saved successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save settings' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}