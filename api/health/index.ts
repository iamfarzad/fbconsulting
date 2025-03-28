import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

export async function GET(req: NextRequest) {
  try {
    // Simulate a health check response
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export default limiter(GET);
