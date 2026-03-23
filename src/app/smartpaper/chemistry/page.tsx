'use client';

import React from 'react';
import { Beaker, Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';

export default function ChemistryPage() {
 return (
  <div className="min-h-screen bg-white flex flex-col md:flex-row">
   <Sidebar />
   <div className="flex-1 flex flex-col items-center justify-center p-6 text-center md:ml-64">
    <div className="w-24 h-24 bg-pink-50 rounded-3xl flex items-center justify-center mb-8 animate-bounce">
     <Beaker className="w-12 h-12 text-pink-500" />
    </div>
    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Chemistry Portal</h1>
    <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-pink-100">
     <Construction className="w-4 h-4" />
     Working in Progress
    </div>
    <p className="text-slate-500 font-medium max-w-md mb-10 leading-relaxed">
     We are currently setting up the Chemistry question bank and curriculum modules. Check back soon for periodic table support and molecular diagrams!
    </p>
    <Link
     href="/smartpaper"
     className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
    >
     <ArrowLeft className="w-5 h-5" />
     Back to Dashboard
    </Link>
   </div>
  </div>
 );
}
