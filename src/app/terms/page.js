import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | SciFun Education',
  description: 'View the Terms & Conditions for using SciFun Education website and services.',
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white py-20 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 border-b-4 border-blue-600 pb-4 inline-block tracking-tight">
          Terms & Conditions
        </h1>
        
        <div className="prose prose-slate prose-lg max-w-none space-y-8 text-slate-700 leading-relaxed font-medium">
          <p>Last updated: March 02, 2026</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">1. Use of Website</h2>
            <p>
              By accessing scifun.in, you agree to comply with and be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">2. User Accounts</h2>
            <p>
              You may need to register an account with us to access certain services. You are responsible for maintaining the confidentiality of your account information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">3. User Content</h2>
            <p>
              Users are responsible for any content they post on our website. We reserve the right to remove any content that violates our terms or is deemed inappropriate.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">4. Intellectual Property</h2>
            <p>
              All content on scifun.in, including text, graphics, logos, and software, is the property of SciFun Education and is protected by copyright laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">5. Limitation of Liability</h2>
            <p>
              SciFun Education is not liable for any damages that may occur from your use of our website or services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">6. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms & Conditions at any time. Your continued use of the website following any changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">7. Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 font-bold">
              <p>SciFun Education</p>
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
