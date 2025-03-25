import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { streamData } = body;

    if (!streamData || typeof streamData !== 'object') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Simulate processing the request
    const responseText = `Stream data received: ${JSON.stringify(streamData)}`;

    return NextResponse.json({ text: responseText }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
