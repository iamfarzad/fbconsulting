import { GeminiState } from '@/types';

export interface SendProposalResponse {
  success: boolean;
  proposalId?: string;
  message?: string;
  error?: string;
  details?: string;
  emailId?: string;
}

export async function sendProposal(state: GeminiState): Promise<SendProposalResponse> {
  try {
    const response = await fetch('/api/proposals/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send proposal');
    }

    const data = await response.json();
    return {
      success: data.success,
      proposalId: data.proposalId,
      message: data.message,
      emailId: data.emailId
    };
  } catch (error) {
    console.error('Error sending proposal:', error);
    return {
      success: false,
      error: 'Failed to send proposal',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
