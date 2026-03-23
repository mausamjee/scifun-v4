import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | SciFun Education - Nallasopara East',
  description: 'Get in touch with SciFun Education for science and maths coaching in Nallasopara East. Location, contact numbers, and inquiry form.',
};

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 md:px-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 uppercase">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 max-w-2xl mx-auto font-medium">
            Have questions? We're here to help you on your journey to academic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-slate-100 space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Our Center</h3>
                  <p className="text-slate-600 font-semibold leading-relaxed">
                    Valaipada road Santosh Bhuvan, Nallasopara (E), Maharashtra 401209.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Phone Numbers</h3>
                  <p className="text-slate-600 font-semibold leading-relaxed">+91 9604249235</p>
                   <p className="text-slate-600 font-semibold leading-relaxed">+91 7057318654</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Email Address</h3>
                  <p className="text-slate-600 font-semibold leading-relaxed">vickymausam01@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-slate-100 pt-8">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Office Hours</h3>
                  <p className="text-slate-600 font-semibold leading-relaxed">Mon - Sat: 9:00 AM - 9:00 PM</p>
                  <p className="text-slate-600 font-semibold leading-relaxed">Sunday: Close</p>
                </div>
              </div>
            </div>

            {/* Premium Badge */}
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/30 transition-colors"></div>
                <p className="text-blue-400 font-black uppercase text-xs tracking-widest mb-2">Visit Us Today</p>
                <p className="text-slate-300 font-medium leading-relaxed">
                   Walk-in to our center at Valaipada for personalized career guidance and course consultation.
                </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-8 bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-blue-100/50 border border-slate-100 relative group overflow-hidden">
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50/50 rounded-full group-hover:bg-blue-100/50 transition-colors"></div>
             
             <div className="mb-10 relative">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter uppercase mb-2">
                  Send <span className="text-blue-600 italic">Inquiry</span>
                </h2>
                <p className="text-slate-500 font-bold">We will get back to you within 24 hours.</p>
             </div>

             <form className="space-y-8 relative">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-400 ml-4 tracking-widest">Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="Enter Name"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-400 ml-4 tracking-widest">Mobile Number *</label>
                    <input 
                      type="tel" 
                      placeholder="+91 Mobile"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-lg"
                    />
                  </div>
               </div>

               <div className="space-y-3">
                 <label className="text-xs font-black uppercase text-slate-400 ml-4 tracking-widest">Subject *</label>
                 <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-lg appearance-none cursor-pointer">
                    <option>Course Inquiry</option>
                    <option>Free Demo Session</option>
                    <option>Fees Information</option>
                    <option>Feedback</option>
                    <option>Other</option>
                 </select>
               </div>

               <div className="space-y-3">
                 <label className="text-xs font-black uppercase text-slate-400 ml-4 tracking-widest">Your Message *</label>
                 <textarea 
                   rows="5"
                   placeholder="How can we help you?"
                   className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-lg resize-none"
                 ></textarea>
               </div>

               <button className="w-full bg-blue-600 text-white py-6 md:py-8 rounded-[1.75rem] font-black text-xl hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 group active:scale-95">
                 SEND INQUIRY NOW <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}
