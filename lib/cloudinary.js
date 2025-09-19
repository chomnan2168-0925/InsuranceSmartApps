import { useSampleData } from '@/config/featureFlags';

const cloudinary = require('cloudinary').v2;

// Only configure Cloudinary if we are NOT using sample data.
// This prevents build errors during deployment if env vars are not set.
if (!useSampleData) {
  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Missing Cloudinary environment variables. Please set them in .env.local or disable sample data mode.');
  }

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('Cloudinary client is in mocked mode because useSampleData is true.');
}


export default cloudinary;
