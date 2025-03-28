import { GeminiAdapter } from '@/features/gemini';
import { NextRequest } from 'next/server';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    const adapter = new GeminiAdapter();
    const response = await adapter.generateResponse(message);

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export default limiter(POST);
