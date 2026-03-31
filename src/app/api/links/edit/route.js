import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function PATCH(request) {
  try {
    const { shortSlug, newDestinationUrl } = await request.json();

    if (!shortSlug || !newDestinationUrl) {
      return NextResponse.json({ error: 'Slug and New Destination URL are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('scifun');
    const collection = db.collection('links');

    // Immutable Slug, Dynamic Destination
    const result = await collection.updateOne(
      { shortSlug },
      { $set: { destinationUrl: newDestinationUrl } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Slug not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedSlug: shortSlug });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
