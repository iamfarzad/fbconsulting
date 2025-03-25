import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Simulate processing the request
    const responseText = `You asked: ${prompt}`;

    return NextResponse.json({ text: responseText }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
