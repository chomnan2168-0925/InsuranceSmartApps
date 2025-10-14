// pages/api/pages/update.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Define the structure of your page data
interface PageData {
  title: string;
  tagline: string;
  content: string;
  [key: string]: any; // Allow additional properties
}

// Define the structure of the entire samplePages file
interface SamplePages {
  [key: string]: PageData;
}

const filePath = path.resolve(process.cwd(), "data/StaticPageData.json");

type ResponseData = {
  success?: boolean;
  message?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { slug, pageData } = req.body;

    if (!slug || !pageData) {
      return res.status(400).json({ error: 'Missing slug or page data.' });
    }

    // Ensure the data directory exists
    const dataDir = path.dirname(filePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read the entire JSON file
    let allPages: SamplePages = {};
    
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      allPages = fileData ? JSON.parse(fileData) : {};
    }

    // Update the specific entry for the given slug
    if (allPages[slug] !== undefined) {
      allPages[slug] = pageData;
    } else {
      // If slug doesn't exist, create it (optional - you can also return 404)
      console.log(`Creating new page entry for slug: ${slug}`);
      allPages[slug] = pageData;
    }

    // Write the entire updated object back to the file
    fs.writeFileSync(filePath, JSON.stringify(allPages, null, 2), 'utf-8');

    console.log(`✅ Page updated successfully: ${slug}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Page updated successfully.' 
    });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ 
      error: 'Failed to update page.' 
    });
  }
}