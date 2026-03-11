'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, CheckCircle2 } from 'lucide-react';
import SmartDownloadButton from '@/components/SmartDownloadButton';

export default function ScienceBoardPaper2025() {
  const driveLink = "https://drive.google.com/uc?export=download&id=1_8q-fsgp1ieNGsxUmUMgxgY28y1m--YP";
  const previewLink = "https://drive.google.com/file/d/1_8q-fsgp1ieNGsxUmUMgxgY28y1m--YP/preview";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        {/* Banner linking to 2026 Paper */}
        <div className="bg-indigo-600 text-white p-4 rounded-2xl mb-8 text-center font-bold animate-pulse shadow-xl shadow-indigo-200">
          <Link href="/ssc-board-papers/2026/science">
            🚨 SSC Science Board Paper 2026 Expected Questions & Updates ➔
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4">
             <BookOpen size={20} />
             <span className="tracking-widest uppercase text-[10px] md:text-sm">Maharashtra Board SSC</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            SSC Science Board Paper 2025 With Solutions — Maharashtra 10th Board
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs md:text-sm mb-6">
            <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-full text-slate-700 font-medium whitespace-nowrap">
              <Calendar size={14} /> Exam Conducted: 2025
            </div>
            <div className="flex items-center gap-1 text-green-600 font-bold whitespace-nowrap">
              <CheckCircle2 size={14} /> Official Paper
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-lg text-slate-700 leading-relaxed bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-indigo-50/50">
            <p className="leading-relaxed">
              Use the official <strong>Maharashtra SSC Science Question Paper 2025</strong> to verify exam patterns and practice for your upcoming boards. Below you will find both the direct preview of the paper and a high-resolution PDF download link.
            </p>
          </div>
        </header>

        {/* Download Section (Using SmartDownloadButton) */}
        <section className="mb-12">
           <SmartDownloadButton 
             fileUrl={driveLink} 
             fileName="SSC-Science-Board-Paper-2025.pdf"
             paperId="ssc-science-2025"
           />
        </section>

        {/* Paper Preview Section using Google Drive iframe */}
        <section className="mb-12 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-indigo-600" /> Paper Preview
          </h2>
          
          <div className="w-full bg-white rounded-[2rem] p-4 shadow-2xl border border-indigo-50 relative overflow-hidden">
             {/* If iframe takes a moment to load, this serves as a background skeleton-like visual */}
             <div className="absolute inset-0 bg-slate-100 animate-pulse -z-10"></div>
             
             <iframe 
                src={previewLink} 
                width="100%" 
                height="800px" 
                className="rounded-2xl border-none shadow-inner bg-white relative z-10"
                allow="autoplay"
                title="Google Drive Science Paper 2025 Preview"
             ></iframe>
          </div>
        </section>

      </main>
    </div>
  );
}
