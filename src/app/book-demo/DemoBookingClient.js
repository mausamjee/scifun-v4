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
  const [isSuccess, setIsSuccess] = useState(false);

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
        setIsSuccess(true);
        setFormData({studentName: '', whatsappNumber: '', grade: '10th Std', board: 'Maharashtra Board', stream: 'General Batches', email: ''});
      } else {
        throw new Error(result.message || 'Failed to book demo.');
      }
    } catch (error) {
      alert('❌ Submission Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,102,255,0.15)] border-4 border-white max-w-2xl w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600"></div>
          
          <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center text-green-600 mx-auto mb-8 animate-bounce">
            <CheckCircle2 size={48} strokeWidth={3} />
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            Booking <span className="text-blue-600 italic">Confirmed!</span>
          </h2>
          
          <p className="text-xl text-slate-600 font-medium mb-10 leading-relaxed">
            Congratulations! Your free demo session at <span className="font-bold text-slate-800">SciFun Education</span> is successfully booked.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col items-center gap-2">
              <MessageCircle className="text-blue-600" size={24} />
              <span className="text-sm font-black text-blue-900 uppercase tracking-widest">Team Call</span>
              <p className="text-xs text-blue-700 font-bold">Within 24 Hours</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex flex-col items-center gap-2">
              <GraduationCap className="text-indigo-600" size={24} />
              <span className="text-sm font-black text-indigo-900 uppercase tracking-widest">Free Materials</span>
              <p className="text-xs text-indigo-700 font-bold">Included in Demo</p>
            </div>
          </div>

          <div className="space-y-4">
              <Link 
                href="/" 
                className="block w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-lg hover:bg-slate-800 transition shadow-xl active:scale-95"
              >
                GO TO HOME
              </Link>
              <p className="text-sm font-bold text-slate-400">
                Facing issues? Call <span className="text-blue-600">9604249235</span>
              </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* 2. Urgency/Offer Banner */}
      <div className="bg-blue-600 text-white py-3 text-center font-black uppercase tracking-widest text-sm px-4">
        ✨ Limited Time Offer: Get 2-Month  All Grades (1st-12th)
      </div>

      <main className="pt-12 pb-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-start">
            
            {/* Right: The Booking Form */}
            <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_32px_80px_-16px_rgba(0,102,255,0.1)] border-2 border-white w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-700">
              <div className="mb-10 text-center">
                <span className="bg-blue-50 text-blue-700 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-4 inline-block">
                  No Registration Fee
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center justify-center gap-3 tracking-tighter uppercase">
                  <FileText className="text-blue-600" size={32} /> Book Demo Session
                </h3>
                <p className="text-slate-500 font-bold mt-2">Personalized coaching for Class 1st to 12th</p>
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slideIn 0.6s ease-out; }
      `}</style>
    </div>
  );
}
