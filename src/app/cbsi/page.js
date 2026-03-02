import React from 'react';
import CBSLandingClient from './CBSLandingClient';

export const metadata = {
  title: 'Come Back Series - Master 11th Grade Maths & Physics | SciFun Education',
  description: 'Join our intensive 60-day Come Back Series to fix your 11th grade concepts. Only 30 seats available. Book your demo and secure your spot for just ₹500.',
  openGraph: {
    title: 'Come Back Series 2026 | SciFun Education',
    description: 'Fix your 11th grade Physics & Maths in 60 days. Secure your seat now!',
    url: 'https://scifun.in/cbsi',
    siteName: 'SciFun Education',
    images: [{ url: 'https://scifun.in/og-cbsi.jpg', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function CBSLandingPage() {
  return <CBSLandingClient />;
}
