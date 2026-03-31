import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import QRCode from 'qrcode';

export async function POST(request) {
  try {
    const { destinationUrl, customSlug } = await request.json();

    if (!destinationUrl) {
      return NextResponse.json({ error: 'Destination URL is required' }, { status: 400 });
    }

    const slug = customSlug || Math.random().toString(36).substring(7);
    
    const client = await clientPromise;
    const db = client.db('scifun');
    const collection = db.collection('links');

    // Check if slug already exists
    const existing = await collection.findOne({ shortSlug: slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }

    // Generate QR Code on server-side
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const shortLink = `${protocol}://${host}/l/${slug}`;
    
    const qrData = await QRCode.toDataURL(shortLink, {
        width: 400,
        margin: 2,
        color: {
            dark: '#1e293b',
            light: '#f8fafc',
        }
    });

    const newLink = {
      shortSlug: slug,
      destinationUrl,
      qrData,
      createdAt: new Date(),
    };

    await collection.insertOne(newLink);

    // Create unique index for shortSlug if it doesn't exist
    await collection.createIndex({ shortSlug: 1 }, { unique: true });

    return NextResponse.json({ success: true, link: newLink, shortLink });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
