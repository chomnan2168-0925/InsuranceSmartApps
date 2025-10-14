import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * ENHANCEMENT: It is critical to disable the default Next.js body parser for API routes
 * that handle file uploads. This allows the request to be processed as a raw stream
 * by a dedicated file-handling library like 'multer' or 'formidable'.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  message: string;
  url?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    // Simulate a network delay to make the mock feel more realistic.
    setTimeout(() => {
      // ENHANCEMENT: Simulate a random failure to test front-end error handling.
      // This will fail approximately 20% of the time.
      const shouldFail = Math.random() > 0.8;

      if (shouldFail) {
        console.error('Mock upload endpoint simulating a server error.');
        res.status(500).json({
          message: 'The server failed to upload the file. Please try again. (Mock Error)',
        });
        return;
      }
      
      console.log('Mock upload endpoint hit. In a real app, file processing would happen here.');

      // In a real implementation:
      // 1. Use a library like 'multer' to parse the multipart/form-data request.
      // 2. Access the file from `req.file`.
      // 3. Upload the file buffer to a cloud storage service like AWS S3 or Cloudinary.
      // 4. Get the final URL from the storage service.
      
      // For now, we continue to simulate a successful upload and return a placeholder URL.
      res.status(200).json({
        message: 'File uploaded successfully (mocked).',
        url: '/images/placeholder-upload.jpg', // Placeholder image URL
      });
    }, 1500); // 1.5 second delay
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}