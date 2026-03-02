'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ListOrdered, 
  MessageSquare,
  Share2,
  Calendar,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

export default function BoardPaperClient({ params }) {
  const { year, subject } = params;
  
  const isHindi2026 = subject === 'ssc-board-hindi-question-paper-2026-with-solutions' || (subject === 'hindi' && year === '2026');
  const subjectName = isHindi2026 ? "Hindi" : subject.charAt(0).toUpperCase() + subject.slice(1);
  const [currentTime, setCurrentTime] = useState('');
  const [status, setStatus] = useState('Checking Status...');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      const hour = now.getHours();
      if (hour < 11) setStatus('Exam Day: Waiting...');
      else if (hour >= 11 && hour < 14) setStatus('Live: Exam Ongoing...');
      else setStatus('Paper Concluded');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Dynamic Live Progress Bar */}
      <div className="sticky top-0 z-50 bg-indigo-600 text-white py-2 px-4 shadow-md text-[10px] md:text-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center font-bold uppercase tracking-widest px-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="hidden xs:inline">LIVE TRACKER:</span> {subjectName} {year}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
             <span className="hidden md:inline">{currentTime}</span>
             <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] md:text-xs">{status}</span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        {/* Article Header */}
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4">
             <BookOpen size={20} />
             <span className="tracking-widest uppercase text-[10px] md:text-sm">Maharashtra Board SSC</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            {isHindi2026 ? "SSC Board Hindi Question Paper 2026 With Solutions — Maharashtra 10th Standard" : `Maharashtra SSC ${subjectName} Board Paper ${year} PDF Download: Question Paper & Answer Key Solution`}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs md:text-sm mb-6">
            <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-full text-slate-700 font-medium whitespace-nowrap">
              <Calendar size={14} /> Exam Year: {year}
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Clock size={14} /> Last Updated: Just Now
            </div>
            <div className="flex items-center gap-1 text-green-600 font-bold whitespace-nowrap">
              <CheckCircle2 size={14} /> Verified Content
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-lg text-slate-700 leading-relaxed bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-indigo-50/50 transition-all hover:shadow-indigo-100/50">
            <p className="leading-relaxed">
              Searching for the <strong>Maharashtra SSC {subjectName} Board Paper {year} PDF Download</strong>? You are in the right place. On this page, we provide the complete question paper, expert analysis, and a detailed <strong>{subjectName} Paper Solution {year}</strong> as soon as the exam concludes.
            </p>
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-indigo-900 italic font-medium">
              Important: Students are advised to use these solutions for self-assessment and conceptual clarity.
            </div>
          </div>
        </header>

        {/* Exam Overview */}
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center -rotate-6 shadow-indigo-200 shadow-lg">1</span>
             Exam Overview & Live Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
              <h4 className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Subject Name</h4>
              <p className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase">{subjectName}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
              <h4 className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Status</h4>
              <p className="text-xl font-bold text-slate-800 flex items-center gap-2 transition-colors">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                In Progress / Updating
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-700 leading-relaxed italic border-l-4 border-slate-100 pl-4">
              "Preliminary reports for the <strong>{subjectName}</strong> paper suggest that the overall difficulty was balanced. While some sections followed the expected blueprint, others offered a fresh perspective on the <strong>{year} SSC curriculum</strong>."
            </p>
          </div>
        </section>

        {/* Download Section */}
        <section className="mb-12 bg-indigo-900 text-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32 blur-3xl"></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 relative z-10">
            Official {subjectName} {year} Question Paper PDF
          </h2>
          <p className="text-indigo-200 mb-8 max-w-md mx-auto relative z-10 text-sm md:text-base">
            Download the scanned copy of the original board question paper provided by our students and teachers.
          </p>
          
          <div className="inline-flex flex-col items-center gap-4 relative z-10 w-full">
            <button className="flex items-center justify-center gap-3 bg-white text-indigo-900 hover:bg-indigo-50 px-6 md:px-10 py-4 md:py-5 rounded-2xl font-extrabold transition shadow-xl transform hover:-translate-y-1 active:scale-95 w-full md:w-auto">
              <Download size={24} /> DOWNLOAD PDF NOW
            </button>
            <span className="text-[10px] font-bold tracking-widest opacity-60">PDF FORMAT | {year} EDITION</span>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center rotate-6 shadow-indigo-200 shadow-lg">2</span>
             Answer Key & Solved Paper
          </h2>
          
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 mb-8 italic text-sm md:text-base">
              Our academic team is currently preparing the step-by-step <strong>SSC {subjectName} Solution</strong>. Objective answers will be populated below as we verify them.
            </p>

            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">SECTION {i}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-100 flex items-center justify-center font-bold text-slate-300 group-hover:border-indigo-200 group-hover:text-indigo-400 transition-all text-sm md:text-base flex-shrink-0">Q.{i}</div>
                    <div className="flex-1">
                      <div className="h-4 w-full bg-slate-50 rounded animate-pulse"></div>
                      <p className="text-[8px] md:text-[10px] uppercase tracking-tighter text-slate-300 mt-2 font-bold italic">Awaiting final verification...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <MessageSquare className="text-indigo-600" size={24} /> Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {isHindi2026 ? (
              <>
                <div className="border-b border-slate-100 pb-6 last:border-0">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2">Is the SSC Hindi Board Exam 2026 postponed due to Holi?</h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">There are rumors about the SSC Hindi exam being postponed since Holi (Dhulivandan) falls on March 3, just a day before the exam. As of now, the exam is scheduled for March 4, 2026. However, any official change from MSBSHSE regarding postponement will be updated here instantly.</p>
                </div>
                <div className="border-b border-slate-100 pb-6 last:border-0">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2">Was the SSC Hindi 2026 paper harder than previous years?</h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">Yes, many students found the 2026 Hindi paper harder and more time-consuming than the 2025 paper. The Grammar section was particularly tricky this year.</p>
                </div>
                <div className="border-b border-slate-100 pb-6 last:border-0">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2">Are there any wrong questions or free marks in the Hindi 2026 paper?</h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">We are currently checking the paper for errors. If there's a wrong question, students will get 1-2 bonus marks. Check our 'Wrong Question Tracker' on SciFun.in for the latest updates.</p>
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-slate-100 pb-6 last:border-0">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">When will the {subjectName} results be declared?</h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">The board usually declares the SSC results in late May or early June. Final dates will be confirmed via the official board portal.</p>
                </div>
                <div className="border-b border-slate-100 pb-6 last:border-0">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">Is this paper exactly as given in the exam?</h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">Yes, our team scans the original question papers provided by students immediately after the exam concludes.</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-slate-200">
           <div className="text-center md:text-left">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">SciFun Education Platform</p>
              <h4 className="font-extrabold text-slate-800">Your Study Partner for SSC Boards</h4>
           </div>
           <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg ripple w-full md:w-auto justify-center">
              <Share2 size={18} /> Share Live Link
           </button>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        main { animation: fadeIn 0.8s ease-out; }
      `}</style>
    </div>
  );
}
