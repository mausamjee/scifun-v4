import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    if (!client) throw new Error('MongoDB client not initialized');
    const db = client.db('scifun');
    const collection = db.collection('links');

    const links = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ success: true, links });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
