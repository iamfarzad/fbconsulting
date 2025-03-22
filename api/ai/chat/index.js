import { spawn } from 'child_process';
import { join } from 'path';
import { createReadStream } from 'fs';
import { tmpdir } from 'os';
import { writeFile } from 'fs/promises';
import { v4 as uuid } from 'uuid';

// Path to the Python executable inside the Vercel environment
const pythonBinary = process.env.PYTHON_PATH || 'pip3.9';

export default async function handler(req, res) {
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check for the Google API key
    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!googleApiKey) {
      return res.status(401).json({ error: 'Missing Google API key' });
    }

    // Generate a temporary file to store the request body
    const tempFilePath = join(tmpdir(), `${uuid()}.json`);
    await writeFile(tempFilePath, JSON.stringify(req.body));

    // Call the Python script with the JSON file
    const scriptPath = join(process.cwd(), 'api', 'ai', 'chat.py');
    const python = spawn(pythonBinary, [scriptPath, tempFilePath]);

    let dataString = '';
    let errorString = '';

    // Collect data from the Python script
    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    // Handle when the Python script exits
    await new Promise((resolve, reject) => {
      python.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python script exited with code ${code}`);
          console.error(`Error: ${errorString}`);
          reject(new Error(`Python script failed with code ${code}`));
        } else {
          resolve();
        }
      });
    });

    // Parse the output and send the response
    try {
      const result = JSON.parse(dataString);
      if (result.status && result.status >= 400) {
        return res.status(result.status).json({ error: result.error });
      }
      return res.status(200).json(result);
    } catch (e) {
      console.error('Error parsing Python output:', e);
      console.error('Raw output:', dataString);
      return res.status(500).json({ error: 'Error parsing response' });
    }
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
