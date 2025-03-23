import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Test with a simple prompt
    await model.generateContent('test');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Connection test failed:', error);
    return NextResponse.json(
      { error: 'Connection test failed', details: error.message },
      { status: 500 }
    );
  }
}
