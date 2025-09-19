import type { NextApiRequest, NextApiResponse } from 'next';
import { useSampleData } from '@/config/featureFlags';

type ResponseData = {
  message: string;
};

// In-memory store for sample data mode
let sampleSubmissions: any[] = [];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const { companyName, contactName, email, budget, message } = req.body;

    if (!companyName || !contactName || !email || !budget) {
      return res.status(400).json({ message: 'Please fill out all required fields.' });
    }

    if (useSampleData) {
      console.log('SAMPLE MODE: Received advertising inquiry:', { companyName, contactName, email, budget, message });
      sampleSubmissions.push(req.body);
      return res.status(200).json({ message: 'Thank you for your inquiry! Our partnership team will review your submission and get in touch shortly. (Sample Mode)' });
    }
    
    // --- REAL DATABASE LOGIC WOULD GO HERE ---
    // Example: const { data, error } = await supabase.from('advertising_inquiries').insert([{...}]);
    console.log('LIVE MODE: Received advertising inquiry:', { companyName, contactName, email, budget, message });
    
    res.status(200).json({ message: 'Thank you for your inquiry! Our partnership team will review your submission and get in touch shortly.' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
