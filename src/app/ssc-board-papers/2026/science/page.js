'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, ArrowRight, FileText } from 'lucide-react';

export default function ScienceBoardPaper2026Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Generate a random total duration between 5 and 12 seconds
    const duration = Math.floor(Math.random() * (12000 - 5000 + 1)) + 5000;
    const interval = 100;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev + increment >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header content */}
        <div className="mb-10 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Maharashtra SSC Science Board Paper 2026
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                We are currently processing and scanning the high-quality official Board Paper for Science. Please wait while we generate your PDF...
            </p>
        </div>

        {/* Loading Indicator */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center mb-12 relative overflow-hidden">
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50/50 to-transparent animate-[shimmer_2s_infinite] -translate-x-full"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-indigo-100 p-4 rounded-full mb-6">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Generating Paper & Solutions...
                </h2>
                
                <div className="w-full max-w-md bg-slate-100 rounded-full h-3 mb-4 overflow-hidden border border-slate-200 relative">
                    <div 
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="text-xl font-mono font-black text-indigo-600 mb-6 drop-shadow-sm">
                    {Math.floor(progress)}%
                </div>

                <p className="text-sm font-medium text-slate-500 animate-pulse">
                     {progress < 100 ? "Compiling PDF, extracting answer key, and optimizing images..." : "Finalizing Upload... Please wait."}
                </p>
            </div>
        </div>

        {/* Skeleton Document Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 animate-pulse">
                    <div className="w-1/3 h-6 bg-slate-200 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                    </div>
                    <div className="mt-8 w-full h-32 bg-slate-100 rounded-xl"></div>
                </div>
            ))}
        </div>

        {/* Previous Paper Link */}
        <div className="bg-indigo-900 rounded-2xl p-8 text-center shadow-lg relative overflow-hidden mt-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <FileText className="w-10 h-10 text-indigo-300 mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Want to prepare while you wait?</h3>
                <p className="text-indigo-200 mb-6 max-w-lg mx-auto">
                    Check out last year's Science Board Paper to understand the exam pattern and test your preparation level.
                </p>
                <Link 
                    href="/ssc-board-papers/2025/science" 
                    className="inline-flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-xl hover:scale-105 hover:gap-3"
                >
                   View 2025 Science Paper <ArrowRight size={20} />
                </Link>
            </div>
        </div>
        
      </div>
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
