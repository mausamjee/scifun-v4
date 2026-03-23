'use client';

import React from 'react';
import { Atom, Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';

export default function PhysicsPage() {
 return (
  <div className="min-h-screen bg-white flex flex-col md:flex-row">
   <Sidebar />
   <div className="flex-1 flex flex-col items-center justify-center p-6 text-center md:ml-64">
    <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
     <Atom className="w-12 h-12 text-blue-500" />
    </div>
    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Physics Portal</h1>
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100">
     <Construction className="w-4 h-4" />
     Working in Progress
    </div>
    <p className="text-slate-500 font-medium max-w-md mb-10 leading-relaxed">
     Our scientists are working hard to integrate Physics concepts, kinematics formulas, and circuit diagrams into the generator.
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
