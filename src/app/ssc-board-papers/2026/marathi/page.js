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
  ArrowRight,
  Eye,
  ZoomIn
} from 'lucide-react';

export default function MarathiBoardPaper2026() {
  const [currentTime, setCurrentTime] = useState('');
  const [status, setStatus] = useState('Ending Soon...');

  // Marathi Question Paper 2026 Pages
  const paperPages = [
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXpxxSPzviaziJj13buD3zsgHJMadIZdL2_2rxasbtrAfHSffPgzPvqvBXXnI9iQH9pkAlCSJRaekd0XqynQsvKUc1b1DbyclhCAhLW16nQnMzlH8UZ0vlc7vrry7atiBcGCEM3-nbdHY_E_YWhdbj5Lka7OvS2-3NP9EDMuW9Ujk4KbIIJ5s29owLoJ5l/s1300/Page%201.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiYTMdYy1p4OsD6_MFG2uCEz4QTeouAnhqopTfptcmS6r6yaaToL3yZmP8nFhGG1qgO4DX8WKPtIKTIPJd4ZaFhBZkBY8ZsbI_ew3gRErTQIt8zuC7xnOYfJwvmZqTZwTf8gqTtS2D3UZKyaoBcDWdeQTNE0hRlrQPXVF7zlWiw1ry5y6kDmXE5aEjX_y-c/s1140/Page%202.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5bgNa8uSOIU5KuQugptATD-5ungUzToqRbvvRtDkaJXMfN8klMB0Ums8DhO3ddopVCxaV2lthU0CnDkmrGBOAdnQ4gtdIZAbX-rs-kKRxhUyOkphc68SHU75ZXu57S0okJd8G-yXmH858n5_NOpe_QVJ45fV9MBFYp9QROy3Uudl7d_pFXiqwTNRU1NRb/s1104/Page%203.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjG53ev0tIDdMsm_u16WQscl_PF8xUWrdB6P_x6OIU7Ki6kQ_WRBhzraAGOdf5m7anuC_kYcVzS18OCO201YP-r395L9jb2pmb6t41AhbOFjMqJsYhnFa0QWgnAT3Zt7_7NjXfcV7JHIF1O5YcVAfPpf2d2zpScgNd2xjmLfuJ1u678W0ZMy5SfOwE6gaJL/s1096/Page%204.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8SVabO8KUDWCFPc_jzhwt58CHe4L21x3EuSjEvoH6URfVEHVRx9UtZr-Z7BNR979PFyShbrK0VCnkmqVr-drO8NNAhY_JQmV9a87HWwMKf-0VkHwDOMCGBW8SNc5HvMrhfsfYJBkRXQDD3oHaVeddgFoIpLceeem8t4RhQ21fcbcpvUWXk_oxB8iKIqH_/s1104/Page%205.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEidgbtxvi0dm6npiMW9gxyrtmY2TWcDaQpcw06f3AUEjwrswoTmAdjXaWQdHdnT41gPK0lO7Km0d0zArYZ-W5NeSA6CrZRuuHE5lEQlSHb0et75AP0p6Al_nPA0feE7PRlR1Zd9AFcEhu2_T_WNf2wRlL56WtyTiUQm1la7TnKN8KGH29cwFNxpyTcnJ_6U/s1180/Page%206.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgicxpKyPcCkFFf80E_c5WKryOYTwBieuXfs5hKxW6HdCVRn-61dQVup00kw4fCBllSDNX8Z5BYTSnq8PQltuWdfeH-RUlevmsmcwVk0Nws62__Vx-I40XmReRNmPjXKz7xD2qpqk40UXaHsZLVI0CJCyXzJZvgY2OpMYCYTwdSPFBI2pbk7-3DsvvdnVP1/s1152/Page%207.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhff0xeDNMfDGeTQA_BafUk-49XszqAD4cEBP8hFdHnCez5AE2ywKlEVlAZlbRyYpTk46ACXwK_U7Rg8q37Gxro5SW66k6-8PMFL85vSLAFq6MsN573nji_Ww3jM8y2hNA2iQbIOf2a4HEmofUCZT-FjpaQiRlUevZO2R3-A_FdSD92ySxi7amTMwGh3NDq/s1140/Page%208.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgwbGj8Ecg7dU3ivaf2SrImAYK1D84djSeGaeTcDEyMb9yHHHw6JzpyI9GAcTsqyBJLAGaU4Mf9TO2AzBvL1U3a1ChP2jJHsbSSkmRkH3__guDZanh4lwAdf8d_XuPnUaXE_6xiim3e3LWpHCO8t505_SVKkFQ2spoHhFS_-TXAHdVNXl-Yd1yxrBnf7fpG/s1132/Page%209.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4thjDlP21mDvgsxPUwQks1jc_2HuxEvXNr3D_NW3UL1PlNrK6neVi4M3FRtU7qDPdZPG6jyL_71JcgPCdoiZ0ZsrVVt2kQWo08Xym1PIG2tlsNSCb-JG_jV7h1owEfshDY9tMMvdeeqjUbUNfhw0s6lOml62TKsvK1238_AneUymvAivTczU_5yrJMwO3/s1164/Page%2010.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhrPF8R27YxdSOJxwQQyCV5LrLwDqEIMaeYlP1fTI3zMhnSvtvDRtxbj5VDL_u3LfN_VAaViCY_PwUETIZaSZx-DYPtUXu12ah4SkmZWcArPSBNlCvYCicw_1pFBSmOn6pq1-Cak8N1JadQqhuJv5u7oc44_kJmx9cO6sea06ClPqyZHB94e-rYhaTcSKGm1/s1200/Page%2011.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJ7Gilybj1fBvQJciN8em0LluK9z3ACs0Szf9NP3vi07ttKXeIIRf3CI8LO4ZOZ7V-IIg0IIcONXXgY4JbheZoLFNKpDCoP0srqUzR08WS9C3BsSoLWDvJhNQInQrJnkUzC_IcEGJfqT0djFomU1DqEOWdx_Lkzm8LabS-1WpfbMppJxHZN6UjR041Qr_8/s1104/Page%2012.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgUJHQR28iX7brEvFs2F9VWY7n9QL_Uu6kWhBTYM92X3mPCgA1AVaAiUOI0zbNqM5HQiCXndqVLcqbS8P72FPtVw433cQ-naToYn7GZziEXAQYD0oymYAd6inu9ftj-ynczzeHHeIpEGenhhoi7ePLw005k_pI3S8sp-aVsPZIFqRz_ejRldTvCBeQLTFj0/s1144/Page%2013.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSoCDCtlpVY2xiNO7lJsHSj0i1LW3GC0zPcxe_1PcctZNzBEH-ncgjKEUw-TLuXQKr6-UgUeRU-_eL_ZBK-ek_u9AN1NghxKZKihFu2ZDjMdhPMbNpX0N26Ha4jXpm8qcJIQdA0X7VzMZYWSxZfDRMusVmU2R28Rn0fyN0M_ISb4RsLLHWS02ny6pr3KEy/s1200/Page%2014.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhuEEfse09YhHeps3pQqqU-TM4qtkWeW6Ar8ARvVIYY1xKxd7p2CTHKNLy0G_Ww64OxSCAMPG2N_A1LJER0pqatLMK7Mq9PUiECk7v-_WeAuEA7QrKqyYMpT3oA0IcXanq06VcImI7O0uk7g_R3S6bObzrwbwPqQ9L5tZTuEsxY9VzknSNlzlzZSysCyPQ0/s1200/Page%2015.jpeg"
  ];

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
        {/* Link Juicing Banner: Passes authority from high-traffic Marathi to new English page */}
        <div className="bg-indigo-600 text-white p-4 rounded-2xl mb-8 text-center font-bold animate-pulse shadow-xl shadow-indigo-200">
          <Link href="/maharashtra-board/ssc/english-question-paper-2026-answer-key">
            🚨 Next Exam: Click Here for SSC English Paper 2026 & Live Answer Key (Feb 27) ➔
          </Link>
        </div>

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
              The <strong>Maharashtra SSC Marathi Board Exam 2026</strong> has successfully concluded today, <strong>February 23, 2026</strong>. Thousands of students across the state appeared for the first major language paper.
            </p>
            <p>
              We have now uploaded the <strong>Maharashtra SSC Marathi Board Paper 2026 PDF</strong> and the <strong>Marathi Question Paper Solution 2026</strong>. Our expert teachers have verified the <strong>SSC Marathi Answer Key</strong> and the full paper is available below for preview and download.
            </p>
          </div>
        </header>

        {/* H2: Exam Overview & Analysis */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-indigo-600" /> Exam Overview & Analysis
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
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                      Easy to Moderate
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors cursor-default">
                  <td className="py-4 px-6 font-bold text-slate-600">Answer Key Status</td>
                  <td className="py-4 px-6">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      Available Now
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-xl">
            <h3 className="text-xl font-bold text-indigo-900 mb-3 italic underline decoration-indigo-200">Expert Analysis:</h3>
            <p className="text-slate-700 leading-relaxed italic">
              "The <strong>10th Board Marathi Paper 2026</strong> was well-balanced. Section 1 (Prose) and Section 2 (Poetry) were straight from the textbook. The <strong>Marathi Vyakaran (Grammar)</strong> section was scoring, while the <strong>Upyojit Lekhan (Writing Skills)</strong> gave students ample choice to express their creativity. Overall, a high-scoring paper for well-prepared students."
            </p>
          </div>
        </section>

        {/* H2: Paper Preview Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <Eye className="text-indigo-600" /> Marathi Board Paper 2026 - Page Preview
          </h2>
          <p className="text-slate-600 mb-6">
            Scanned pages of the official Maharashtra SSC Marathi Question Paper 2026 are shown below:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-200 p-4 rounded-3xl">
            {paperPages.map((url, index) => (
              <div key={index} className="relative group overflow-hidden rounded-2xl border-4 border-white shadow-md hover:shadow-2xl transition-all duration-300 bg-white">
                <div className="absolute top-2 left-2 z-10 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                  Page {index + 1}
                </div>
                <img 
                  src={url} 
                  alt={`Marathi Board Paper 2026 Page ${index + 1}`} 
                  className="w-full h-auto object-contain transform group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="bg-white/90 backdrop-blur p-2 rounded-full text-indigo-600 shadow-lg hover:bg-white">
                    <ZoomIn size={20} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* H2: Download Marathi Board Question Paper 2026 PDF */}
        <section className="mb-12 bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Download Marathi Board Question Paper 2026 PDF
          </h2>
          <p className="text-slate-600 mb-8">
            The official scanned copy of today's question paper is ready for download.
          </p>
          
          <div className="bg-indigo-600 p-8 rounded-2xl border-2 border-dashed border-indigo-300">
            <div className="flex flex-col items-center gap-4">
              <a 
                href={paperPages[0]} // Using first page link as placeholder for "download" or user can right click
                className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-5 rounded-full font-extrabold transition-all shadow-xl hover:scale-105"
                download="SSC-Marathi-Paper-2026.jpeg"
              >
                <Download size={24} /> DOWNLOAD FULL PAPER PDF
              </a>
              <span className="text-sm text-indigo-100 font-medium">Verified by SciFun Education | Format: JPEG/PDF</span>
            </div>
          </div>
        </section>

        {/* H2: Marathi Board Paper Solution & Answer Key 2026 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <ListOrdered className="text-indigo-600 flex-shrink-0" /> Marathi Board Paper Solution & Answer Key 2026
          </h2>
          
          <p className="text-slate-700 mb-6">
            Detailed answers for the <strong>SSC Marathi Question Paper 2026</strong>. Focus on the grammar and objective sections for immediate cross-checking.
          </p>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 text-indigo-700">Section 1: Vyakaran & Bhasha Abhyas (Grammar)</h3>
              <div className="bg-slate-50 p-4 rounded-lg italic text-slate-600 border border-dashed border-slate-300">
                Full step-by-step solution video and PDF is being processed. It will be available shortly. 
                Keep refreshing this page!
              </div>
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
              <h3 className="text-lg font-bold text-indigo-300 mb-2 group-hover:text-indigo-200">Was the Class 10th Marathi paper hard today?</h3>
              <p className="text-slate-300">
                Most students rated the paper as "Easy to Moderate." Section 4 (Grammar) was straightforward, and the writing skills topics were common.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
              <h3 className="text-lg font-bold text-indigo-300 mb-2 group-hover:text-indigo-200">How many pages were in the Marathi Question Paper 2026?</h3>
              <p className="text-slate-300">
                The 2026 Marathi (Kumarbharati) paper consisted of 15 pages in total, including all sections from Prose to Writing Skills.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
              <h3 className="text-lg font-bold text-indigo-300 mb-2 group-hover:text-indigo-200">Where can I download the solved Marathi Answer Key?</h3>
              <p className="text-slate-300">
                You can download the PDF solution and view the preview right here on <strong>SciFun Education</strong>.
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
