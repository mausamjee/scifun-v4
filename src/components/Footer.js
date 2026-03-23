import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 pt-20 border-t border-slate-100 print:hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
           <div className="flex items-center gap-2">
             <img src="/logobg.png" alt="SciFun Logo" className="w-10 h-10 object-contain" />
             <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">SciFun Education</span>
           </div>
           <p className="text-slate-500 text-sm leading-relaxed font-semibold">
             Empowering students with concept-based coaching and modern learning techniques. Your success is our mission.
           </p>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><ShieldCheck size={16}/></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Google Adsense Verified</span>
           </div>
        </div>
        
        {/* Quick Links */}
        <div>
          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Learning Hub</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-bold">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">SSC Board Papers</Link></li>
            <li><Link href="/book-demo" className="hover:text-blue-600 transition-colors">Book Free Demo</Link></li>
            <li><Link href="/cbsi" className="hover:text-blue-600 transition-colors">Come Back Series</Link></li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div>
          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Trust & Privacy</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-bold">
            <li><Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Office Info */}
        <div>
          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Main Center</h4>
           <div className="space-y-4 text-sm text-slate-500 font-bold">
              <div className="flex items-start gap-3 group">
                 <MapPin size={18} className="text-blue-600 shrink-0" />
                 <span className="leading-relaxed">Valaipada road Santosh Bhuvan, Nallasopara (E), Maharashtra 401209.</span>
              </div>
              <div className="flex items-center gap-3">
                 <Phone size={18} className="text-blue-600 shrink-0" />
                 <span>+91 9604249235 / 7057318654</span>
              </div>
              <div className="flex items-center gap-3">
                 <Mail size={18} className="text-blue-600 shrink-0" />
                 <span>vickymausam01@gmail.com</span>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-200/60 py-8 bg-white">
         <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
               © {new Date().getFullYear()} SCIFUN EDUCATION. ALL RIGHTS RESERVED.
            </p>
            
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   Online Admission Open
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                   Developed with ❤️ for Students
                </div>
            </div>
         </div>
      </div>
    </footer>
  );
}
