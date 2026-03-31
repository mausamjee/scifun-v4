import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function DELETE(request) {
  try {
    const { shortSlug } = await request.json();

    if (!shortSlug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const client = await clientPromise;
    if (!client) throw new Error('MongoDB client not initialized');
    const db = client.db('scifun');
    const collection = db.collection('links');

    const result = await collection.deleteOne({ shortSlug });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Link deleted' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
