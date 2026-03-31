import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export default async function DynamicRedirectPage({ params }) {
  const { slug } = await params;
  
  if (!slug) {
    redirect('/');
  }

  const client = await clientPromise;
  if (!client) redirect('/?error=db-not-ready');
  const db = client.db('scifun');
  const collection = db.collection('links');

  const link = await collection.findOne({ shortSlug: slug });

  if (link && link.destinationUrl) {
    // Redirect instantly to current live destination
    redirect(link.destinationUrl);
  } else {
    // Basic fallback for unknown slugs
    redirect('/?error=slug-not-found');
  }
}
