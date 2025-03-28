import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import textract from 'textract';

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

const processPDF = async (file: formidable.File): Promise<string> => {
  const data = await pdfParse(file);
  return data.text;
};

const processDOCX = async (file: formidable.File): Promise<string> => {
  const result = await mammoth.extractRawText({ path: file.path });
  return result.value;
};

const processTXT = async (file: formidable.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(file.path, (error, text) => {
      if (error) reject(error);
      resolve(text);
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { files } = await readFile(req);
    const processedDocuments = [];

    for (const key in files) {
      const file = files[key] as formidable.File;
      let text = '';

      if (file.name.toLowerCase().endsWith('.pdf')) {
        text = await processPDF(file);
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        text = await processDOCX(file);
      } else if (file.name.toLowerCase().endsWith('.txt')) {
        text = await processTXT(file);
      } else {
        return res.status(400).json({ success: false, error: `Unsupported file type: ${file.name}` });
      }

      processedDocuments.push({
        filename: file.name,
        mimeType: file.type,
        text,
        size: file.size,
      });
    }

    return res.status(200).json({ success: true, documents: processedDocuments });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default handler;
