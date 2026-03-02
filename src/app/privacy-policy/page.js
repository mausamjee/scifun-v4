import React from 'react';

export const metadata = {
  title: 'Privacy Policy | SciFun Education',
  description: 'Read our Privacy Policy to understand how we collect, use, and protect your information at SciFun Education.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 border-b-4 border-blue-600 pb-4 inline-block">
          Privacy Policy
        </h1>
        
        <div className="prose prose-slate prose-lg max-w-none space-y-8 text-slate-700 leading-relaxed font-medium">
          <p>Last updated: March 02, 2026</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Introduction</h2>
            <p>
              At SciFun Education, we respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website (scifun.in).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Information We Collect</h2>
            <p>We collect information that you provide directly to us when you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Register for our "Come Back Series" or other courses.</li>
              <li>Book a free demo session.</li>
              <li>Contact us through our website.</li>
              <li>Subscribe to our newsletters.</li>
            </ul>
            <p>The types of information we collect include your name, email address, phone number, grade/class, and school details.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your registrations and demo bookings.</li>
              <li>Communicate with you regarding your education at SciFun.</li>
              <li>Send you updates via email or WhatsApp (if consented).</li>
              <li>Improve our website and services.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Third-Party Services</h2>
            <p>
              We use third-party services like Google Apps Script to store our form data securely in Google Sheets. We may also use Google AdSense to serve ads on our website. These third-party providers have their own privacy policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Cookies</h2>
            <p>
              Our website uses cookies to enhance user experience. Cookies are small files stored on your device that help us analyze web traffic and provide personalized content. You can choose to decline cookies through your browser settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="font-bold">SciFun Education</p>
              <p>Valaipada road santosh bhuvan, Nalasopara (E), Maharashtra 401209.</p>
              <p>Email: vickymausam01@gmail.com</p>
              <p>Phone: +91 9604249235</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
