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

export default function MarathiBoardPaper2026() {
  const [currentTime, setCurrentTime] = useState('');
  const [status, setStatus] = useState('Ending Soon...');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      const hour = now.getHours();
      if (hour < 11) setStatus('Starting Soon...');
      else if (hour >= 11 && hour < 14) setStatus('Exam Ongoing...');
      else setStatus('Exam Concluded');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* 
        Note: Metadata should ideally be in a layout.js for Next.js 15 SEO.
        This client component handles the Live Blog interactivity.
      */}
      
      {/* Live Progress Bar */}
      <div className="sticky top-0 z-50 bg-indigo-600 text-white py-2 px-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-xs md:text-sm font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            LIVE UPDATES
          </div>
          <div>{currentTime} | {status}</div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        {/* Article Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            Maharashtra SSC Marathi Board Paper 2026 PDF Download: 10th Question Paper & Answer Key Live Updates
          </h1>
          
          <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
            <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-full text-slate-700 font-medium">
              <Calendar size={14} /> Feb 23, 2026
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} /> Last Updated: Just Now
            </div>
          </div>

          {/* Intro Section */}
          <div className="prose prose-slate max-w-none text-lg text-slate-700 leading-relaxed bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p>
              The <strong>Maharashtra SSC Marathi Board Exam 2026</strong> has successfully concluded today, <strong>February 23, 2026</strong>, at 2:00 PM. Thousands of students across the state appeared for the first major language paper. We know the anxiety of checking answers!
            </p>
            <p>
              Stay tuned as we are providing the <strong>Maharashtra SSC Marathi Board Paper 2026 PDF Download</strong> link and the <strong>Marathi Question Paper Solution 2026</strong> in real-time. Our expert teachers are currently verifying the <strong>SSC Marathi Answer Key</strong> and will upload the solved set shortly.
            </p>
          </div>
        </header>

        {/* H2: Exam Overview & Analysis */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-indigo-600" /> Exam Overview & Analysis (Live Updates)
          </h2>
          
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-lg bg-white mb-8">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="py-4 px-6 font-semibold">Entity</th>
                  <th className="py-4 px-6 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors cursor-default">
                  <td className="py-4 px-6 font-bold text-slate-600">Exam Name</td>
                  <td className="py-4 px-6">Maharashtra State Board SSC Exam 2026</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors cursor-default">
                  <td className="py-4 px-6 font-bold text-slate-600">Subject</td>
                  <td className="py-4 px-6 font-medium text-slate-800 italic">Marathi (Kumarbharati/Aksharbharati)</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors cursor-default">
                  <td className="py-4 px-6 font-bold text-slate-600">Date</td>
                  <td className="py-4 px-6 font-medium">23 Feb 2026</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors cursor-default">
                  <td className="py-4 px-6 font-bold text-slate-600">Difficulty Level</td>
                  <td className="py-4 px-6">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                      Moderate to Easy - Updating...
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors cursor-default">
                  <td className="py-4 px-6 font-bold text-slate-600">Answer Key Status</td>
                  <td className="py-4 px-6">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      Available Soon
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-xl">
            <h3 className="text-xl font-bold text-indigo-900 mb-3 italic underline decoration-indigo-200">Initial Student Reactions:</h3>
            <p className="text-slate-700 leading-relaxed italic">
              "Students coming out of the exam hall reported that the <strong>10th Board Marathi Paper Analysis</strong> suggests the grammar section (Vyakaran) was slightly tricky but the writing skills (Upyojit Lekhan) section was manageable and straightforward. Most students found the 'Sthulvachan' part to be direct from the textbook."
            </p>
          </div>
        </section>

        {/* H2: Download Marathi Board Question Paper 2026 PDF */}
        <section className="mb-12 bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Download Marathi Board Question Paper 2026 PDF
          </h2>
          <p className="text-slate-600 mb-8">
            The official scanned copy of today's question paper is being uploaded by our team.
          </p>
          
          <div className="bg-slate-100 p-6 rounded-2xl border-2 border-dashed border-slate-300">
            <p className="font-bold text-indigo-600 animate-pulse mb-4">
              The official question paper PDF link will be activated below at 2:15 PM.
            </p>
            <div className="flex flex-col items-center gap-4">
              <button className="flex items-center gap-2 bg-slate-300 text-slate-500 cursor-not-allowed px-8 py-4 rounded-full font-bold transition shadow-lg">
                <Download size={20} /> Download Question Paper PDF Here
              </button>
              <span className="text-xs text-slate-400 italic">File Size: 2.4 MB | Format: PDF</span>
            </div>
          </div>
        </section>

        {/* H2: Marathi Board Paper Solution & Answer Key 2026 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <ListOrdered className="text-indigo-600 flex-shrink-0" /> Marathi Board Paper Solution & Answer Key 2026
          </h2>
          
          <p className="text-slate-700 mb-6 italic">
            Check the set-wise <strong>SSC Marathi Answer Key</strong> for the objective and grammar sections below. Full solutions for the long-form answers will follow.
          </p>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 italic text-indigo-700">Q.1 (Language Study / Vyakaran) Answers:</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 flex-shrink-0 mt-1">1</div>
                  <div className="flex-1">
                    <p className="text-slate-500 italic">[Answer for Question 1 will be updated here at 2:30 PM]</p>
                    <div className="h-4 w-full bg-slate-50 rounded mt-2 animate-pulse"></div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 flex-shrink-0 mt-1">2</div>
                  <div className="flex-1">
                    <p className="text-slate-500 italic">[Answer for Question 2 will be updated here at 2:30 PM]</p>
                    <div className="h-4 w-3/4 bg-slate-50 rounded mt-2 animate-pulse"></div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 flex-shrink-0 mt-1">3</div>
                  <div className="flex-1">
                    <p className="text-slate-500 italic">[Answer for Question 3 will be updated here at 2:30 PM]</p>
                    <div className="h-4 w-5/6 bg-slate-50 rounded mt-2 animate-pulse"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* H2: FAQs Section */}
        <section className="mb-12 bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
            <MessageSquare className="text-indigo-400" /> Frequently Asked Questions (FAQs)
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
              <h3 className="text-lg font-bold text-indigo-300 mb-2 group-hover:text-indigo-200">Was the Marathi paper hard today?</h3>
              <p className="text-slate-300">
                Initial feedback from Class 10th students suggests that the paper was "Moderate." While the seen passages were easy, some grammar questions required deep thinking.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
              <h3 className="text-lg font-bold text-indigo-300 mb-2 group-hover:text-indigo-200">When will the official answer key be released?</h3>
              <p className="text-slate-300">
                The official Maharashtra SSC board doesn't usually release a separate key immediately, but coaching classes and top educators provide unofficial solutions within hours.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
              <h3 className="text-lg font-bold text-indigo-300 mb-2 group-hover:text-indigo-200">Where can I download the 10th Marathi question paper?</h3>
              <p className="text-slate-300">
                You can download the PDF right here on <strong>SciFun Education's</strong> website. We update all subjects as soon as the exam ends.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Footer */}
        <div className="border-t border-slate-200 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg ripple">
              <Share2 size={18} /> Share Paper Link
            </button>
          </div>
          <Link href="/ssc-board-papers/2026/english" className="flex items-center gap-2 group text-indigo-600 font-bold hover:gap-4 transition-all bg-indigo-50 px-6 py-3 rounded-full">
            Next Exam: English Prep <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      {/* Modern Aesthetics Styles */}
      <style jsx>{`
        .ripple {
          position: relative;
          overflow: hidden;
        }
        main {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
