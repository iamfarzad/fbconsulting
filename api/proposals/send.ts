import { Request, Response } from 'express';
import { GeminiState } from '../../src/types';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: Request,
  res: Response
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body as GeminiState;

    // Validate required fields
    if (!data.userInfo?.email || !data.userInfo?.name) {
      return res.status(400).json({ error: 'Missing user information' });
    }

    if (!data.proposal) {
      return res.status(400).json({ error: 'Missing proposal data' });
    }

    // Generate proposal ID
    const proposalId = Math.random().toString(36).substring(7);

    // Format proposal content
    const proposalContent = `
      <h2>Proposal Summary</h2>
      <p><strong>For:</strong> ${data.userInfo.name}</p>
      
      <h3>Summary Points</h3>
      <ul>
        ${data.proposal.summary.map(point => `<li>${point}</li>`).join('')}
      </ul>

      <h3>Recommended Services</h3>
      <table>
        <tr>
          <th>Service</th>
          <th>Price</th>
          <th>Description</th>
        </tr>
        ${data.proposal.pricing.map(item => `
          <tr>
            <td>${item.service}</td>
            <td>$${item.price}</td>
            <td>${item.description}</td>
          </tr>
        `).join('')}
      </table>

      <h3>Recommendations</h3>
      <ul>
        ${data.proposal.recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    `;

    // Send email using Resend
    const email = await resend.emails.send({
      from: 'FB Consulting <proposals@fbconsulting.com>',
      to: [data.userInfo.email],
      subject: `Your Proposal from FB Consulting - ${proposalId}`,
      html: proposalContent
    });

    // Log success for monitoring
    console.log('Proposal sent:', {
      proposalId,
      emailId: email.id,
      userInfo: data.userInfo,
      messageCount: data.messages.length
    });

    return res.status(200).json({
      success: true,
      proposalId,
      emailId: email.id,
      message: 'Proposal sent successfully via email'
    });
  } catch (error) {
    console.error('Error sending proposal:', error);
    return res.status(500).json({
      error: 'Failed to send proposal',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
