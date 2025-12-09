import { NextResponse } from 'next/server';

// This API route is deprecated - logic moved to client side
// Keeping for backward compatibility but should not be used
export async function POST(request) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Please use client-side operations.' },
    { status: 410 }
  );
}

