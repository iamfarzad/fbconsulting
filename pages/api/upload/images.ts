import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const processImage = async (file: formidable.File): Promise<{ mimeType: string; data: string }> => {
  const buffer = fs.readFileSync(file.path);
  const mimeType = file.type || 'image/jpeg';
  const base64Data = buffer.toString('base64');
  return { mimeType, data: base64Data };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { files } = await readFile(req);
    const processedImages = [];

    for (const key in files) {
      const file = files[key] as formidable.File;
      const imageData = await processImage(file);

      processedImages.push({
        filename: file.name,
        mimeType: imageData.mimeType,
        data: imageData.data,
        size: file.size,
      });
    }

    return res.status(200).json({ success: true, images: processedImages });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default handler;
