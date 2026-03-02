'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Lock, 
  ArrowRight, 
  MessageCircle,
  FileText,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export default function DemoBookingClient() {
  const [formData, setFormData] = useState({
    studentName: '',
    whatsappNumber: '',
    grade: '10th Std',
    board: 'Maharashtra Board',
    stream: 'General Batches',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/demo-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "Success" || response.ok) {
        setFormData({studentName: '', whatsappNumber: '', grade: '10th Std', board: 'Maharashtra Board', stream: 'General Batches', email: ''});
        alert('🎁 Free Demo Booked Successfully!\n\nOur team will contact you shortly to schedule your preferred slot.\n\nNote: You can visit our Valaipada road office anytime to meet the faculty!');
        window.location.href = '/'; 
      } else {
        throw new Error(result.message || 'Failed to book demo.');
      }
    } catch (error) {
      alert('❌ Submission Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* 2. Urgency/Offer Banner */}
      <div className="bg-blue-600 text-white py-3 text-center font-black uppercase tracking-widest text-sm px-4">
        ✨ Limited Time Offer: Get 2-Day FREE Physical Classes for All Grades (1st-12th)
      </div>

      <main className="pt-12 pb-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: Content and Why SciFun? */}
            <div className="space-y-10">
              <div className="space-y-4">
                <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
                      SF
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">SciFun Education</span>
                </Link>
                <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  Experience a <span className="text-blue-600 italic">FREE Demo</span> Session Today
                </h1>
                <p className="text-lg md:text-2xl text-slate-600 leading-relaxed max-w-xl font-medium">
                  Experience the most engaging way to learn Science & Math. From 1st Standard up to 12th Science (HSC).
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Specialized 11th & 12th Science Batches (JEE/NEET)",
                  "Concept-based Science coaching for Primary Grades",
                  "Expert Faculty with proven result track record",
                  "Personalized attention to every student",
                  "Free Career Guidance included in the demo"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 transform hover:-translate-x-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <span className="font-bold text-slate-700 text-lg leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                  <GraduationCap className="text-blue-500" /> Shaping Bright Futures
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Join our Valaipada Center community and see why students love learning with SciFun. This demo session is 100% free with no obligations.
                </p>
              </div>
            </div>

            {/* Right: The Booking Form */}
            <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_32px_80px_-16px_rgba(0,102,255,0.1)] border-2 border-white sticky top-12">
              <div className="mb-10">
                <span className="bg-blue-50 text-blue-700 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-4 inline-block">
                  No Registration Fee
                </span>
                <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter uppercase">
                  <FileText className="text-blue-600" /> Book Demo Session
                </h3>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase text-slate-400 ml-4 tracking-widest group-focus-within:text-blue-600 transition-colors">Student's Full Name *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.studentName}
                    placeholder="Enter Name"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-lg"
                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase text-slate-400 ml-4 tracking-widest group-focus-within:text-blue-600 transition-colors">WhatsApp Number *</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.whatsappNumber}
                    placeholder="99XXXXXXXX"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-lg"
                    onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase text-slate-400 ml-4 tracking-widest group-focus-within:text-blue-600 transition-colors">Grade / Class *</label>
                  <select 
                    required
                    value={formData.grade}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-lg appearance-none cursor-pointer"
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  >
                    <option disabled value="">Select Class</option>
                    <option>1st to 5th</option>
                    <option>6th Std</option>
                    <option>7th Std</option>
                    <option>8th Std</option>
                    <option>9th Std</option>
                    <option>10th Std</option>
                    <option>11th SCIENCE</option>
                    <option>12th SCIENCE (HSC)</option>
                    <option>Entrance (JEE/NEET)</option>
                  </select>
                </div>

                {/* Conditional Board Selection (1st to 10th) */}
                {formData.grade && !formData.grade.includes("SCIENCE") && !formData.grade.includes("Entrance") && (
                  <div className="space-y-2 group animate-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-black uppercase text-blue-600 ml-4 tracking-widest">Select Board *</label>
                    <select 
                      required
                      value={formData.board}
                      className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-lg appearance-none cursor-pointer"
                      onChange={(e) => setFormData({...formData, board: e.target.value})}
                    >
                      <option>Maharashtra Board</option>
                      <option>CBSE Board</option>
                      <option>ICSE Board</option>
                    </select>
                  </div>
                )}

                {/* Conditional Stream Selection (11th & 12th) */}
                {(formData.grade.includes("SCIENCE") || formData.grade.includes("Entrance")) && (
                  <div className="space-y-2 group animate-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-black uppercase text-blue-600 ml-4 tracking-widest">Specific Subject Stream *</label>
                    <select 
                      required
                      value={formData.stream}
                      className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-lg appearance-none cursor-pointer"
                      onChange={(e) => setFormData({...formData, stream: e.target.value})}
                    >
                      <option value="General Science">General Science</option>
                      <option>PCM with Biology</option>
                      <option>PCM with Computer Science (CS)</option>
                      <option>PCM with Information Technology (IT)</option>
                      <option>PCM with Hindi</option>
                      <option>PCB (Medical Focus Focus)</option>
                    </select>
                  </div>
                )}

                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase text-slate-400 ml-4 tracking-widest group-focus-within:text-blue-600 transition-colors">Email Address (To receive updates) *</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    placeholder="student@example.com"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-lg"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 disabled:bg-blue-300 text-white py-6 md:py-8 rounded-[1.75rem] font-black text-xl hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 group mt-4 active:scale-95"
                >
                  {isSubmitting ? 'PROCESSING BOOKING...' : 'CONFIRM FREE DEMO SESSION'} 
                  {!isSubmitting && <ArrowRight className="group-hover:translate-x-2 transition-transform" />}
                </button>

                <div className="flex flex-col items-center gap-4 py-6 border-t border-slate-100 mt-4">
                  <p className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-blue-500" /> SECURE ENROLLMENT SYSTEM
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Floating WhatsApp Button for queries */}
      <a 
        href="https://wa.me/919604249235" 
        className="fixed bottom-8 right-8 z-[100] bg-green-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all text-sm font-bold flex items-center gap-2 group"
        aria-label="Ask Query"
      >
        <MessageCircle size={32} />
        <span className="hidden md:inline pr-2">Ask Fee / Schedule</span>
      </a>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        main { animation: slideIn 0.8s ease-out; }
      `}</style>
    </div>
  );
}
