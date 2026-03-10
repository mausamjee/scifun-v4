'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Users, 
  Clock, 
  Video, 
  Smartphone, 
  Lock, 
  ArrowRight, 
  MessageCircle,
  PlayCircle,
  FileText,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import Image from 'next/image';

export default function CBSLandingClient() {
  const [seatsRemaining, setSeatsRemaining] = useState(12);
  const [formData, setFormData] = useState({
    studentName: '',
    whatsappNumber: '',
    parentNumber: '',
    email: '',
    schoolName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic urgency effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (seatsRemaining > 3) {
        setSeatsRemaining(prev => prev - 1);
      }
    }, 15000); // Decimate one seat every 15 seconds for demonstration
    return () => clearTimeout(timer);
  }, [seatsRemaining]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Forwards to Google Apps Script via NEW Independent API route
      const response = await fetch('/api/cbs-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "Success" || response.ok) {
        // Clear form after success
        setFormData({studentName: '', whatsappNumber: '', parentNumber: '', email: '', schoolName: ''});
        
        // Redirect to WhatsApp Group
        if (result.whatsappGroup) {
          alert('🎉 Registration Successful!\n\nDetails saved. Now join our WhatsApp group for 60-day schedule and batch updates!\n\nNote: Please visit our Valaipada office to confirm seat with ₹500 fee.');
          window.location.href = result.whatsappGroup;
        } else {
           alert('🎉 Registration Successful! Please visit our office to pay the ₹500 fee and confirm your seat.');
        }
      } else {
        throw new Error(result.message || 'Failed to record registration.');
      }
    } catch (error) {
      alert('❌ Submission Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* 2. Top Urgency Banner */}
      <div className="bg-orange-500 text-white py-3 text-center font-black animate-pulse uppercase tracking-widest text-sm md:text-base px-4">
        ⚠️ Hurry! Only {seatsRemaining} out of 30 Seats Remaining for the March Batch!
      </div>

      <main>
        {/* 3. Hero Section */}
        <section className="relative pt-12 pb-20 px-4 md:px-8 bg-gradient-to-b from-blue-50/50 to-white">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
              Exclusive Come Back Series
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Fix Your <span className="text-blue-600 italic underline decoration-orange-500 underline-offset-8">11th Grade</span> Concepts in 60 Days
            </h1>
            <p className="text-lg md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Ensure you are ready for 12th Boards & Entrance Exams. Intensive Maths & Physics prep for students who want to score big.
            </p>

            {/* Teacher Video / Demo Section */}
            <div className="relative group max-w-4xl mx-auto mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="SciFun Teaching Style" 
                  fill
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-blue-900/40"></div>
                
                {/* Demo Button Overlay */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <PlayCircle size={84} className="text-white drop-shadow-2xl animate-pulse cursor-pointer hover:scale-110 transition-transform" />
                  <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
                    <p className="font-bold text-lg uppercase tracking-wider">Watch 2-Min Course Demo</p>
                  </div>
                </div>
              </div>
              
              {/* Syllabus / Demo List below video */}
              <div className="bg-slate-50 p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left border-t border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="font-bold text-slate-700 text-sm italic">Master complex 11th Algebra & Trigonometry for 12th readiness.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="font-bold text-slate-700 text-sm italic">Complete conceptual clarity on Mechanics & Electrodynamics.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Value Proposition & Registration */}
        <section className="py-20 px-4 md:px-8 border-t border-slate-100" id="register">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              
              {/* Left Column: Why ₹500? */}
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                  Secure your seat for <span className="text-orange-500">₹500</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  The ₹500 registration fee ensures we give these 30 limited seats only to serious students who want to improve. Visit our office to confirm.
                </p>

                <div className="space-y-4">
                  {[
                    "Full Access to the 60-Day Intensive Batch",
                    "Math & Physics Concept Fixer Modules",
                    "Weekly Test Series & Analysis",
                    "Exclusive Handwritten Formula Notes",
                    "1-on-1 Doubt Solving Sessions"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl border border-blue-100 hover:border-blue-300 transition-colors">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="font-bold text-blue-900">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                   <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <ShieldCheck className="text-orange-500" /> Transparent Pricing
                   </h3>
                   <p className="text-slate-400 text-sm leading-relaxed">
                      At SciFun, we believe in outcomes. This fee is to secure your physical seat in the classroom at our Valaipada road santosh bhuvan center. Remaining course details will be shared on Day 1.
                   </p>
                </div>
              </div>

              {/* Right Column: The Form */}
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-2 border-slate-100 relative">
                <div className="absolute -top-8 -right-4 bg-orange-500 text-white px-6 py-4 rounded-2xl rotate-6 font-black text-center shadow-xl">
                    BOOK <br/> NOW
                </div>
                
                <h3 className="text-2xl font-black mb-8 flex items-center gap-2 text-slate-800 uppercase tracking-tight">
                   <FileText className="text-blue-600" /> Student Details
                </h3>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Student's Full Name *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.studentName}
                      placeholder="Enter Full Name"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
                      onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">WhatsApp Number *</label>
                      <input 
                        required
                        type="tel" 
                        value={formData.whatsappNumber}
                        placeholder="Mobile Number"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
                        onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Parent's Number *</label>
                      <input 
                        required
                        type="tel" 
                        value={formData.parentNumber}
                        placeholder="+91 Mobile"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
                        onChange={(e) => setFormData({...formData, parentNumber: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Email Address *</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      placeholder="Receive Receipt here"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Current School/College Name (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.schoolName}
                      placeholder="Optional"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
                      onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 disabled:bg-blue-300 text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 group"
                  >
                    {isSubmitting ? 'RECORDING DETAILS...' : 'CONFIRM & BOOK MY SEAT'}
                    {!isSubmitting && <ArrowRight className="group-hover:translate-x-2 transition-transform" />}
                  </button>

                  <div className="flex flex-col items-center gap-4 py-4 border-t border-slate-100">
                    <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition duration-500">
                       <CreditCard size={24} />
                       <Smartphone size={24} />
                       <Lock size={24} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                       <Lock size={12} /> SECURE 256-BIT ENCRYPTED PAYMENT
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919604249235" 
        className="fixed bottom-8 right-8 z-[100] bg-green-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={32} />
      </a>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        main { animation: fadeIn 1s ease-out; }
      `}</style>
    </div>
  );
}
