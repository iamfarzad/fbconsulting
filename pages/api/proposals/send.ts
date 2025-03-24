import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { to, subject, text, html } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Proposal sent successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default handler;
