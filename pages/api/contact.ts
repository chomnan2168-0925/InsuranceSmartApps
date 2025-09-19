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
    const { name, email, topic, question } = req.body;

    if (!name || !email || !topic || !question) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (useSampleData) {
      console.log('SAMPLE MODE: Received contact form submission:', { name, email, topic, question });
      sampleSubmissions.push(req.body);
      return res.status(200).json({ message: 'Your question has been submitted successfully! (Sample Mode)' });
    }

    // --- REAL DATABASE/EMAIL LOGIC WOULD GO HERE ---
    // Example: const { data, error } = await supabase.from('submissions').insert([{...}]);
    console.log('LIVE MODE: Received contact form submission:', { name, email, topic, question });
    
    res.status(200).json({ message: 'Your question has been submitted successfully! An expert will get back to you shortly.' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
