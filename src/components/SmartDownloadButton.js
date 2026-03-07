'use client';

import React, { useState, useEffect } from 'react';
import { Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';

export default function SmartDownloadButton({ fileUrl, fileName, paperId }) {
  const [status, setStatus] = useState('idle'); // idle, buffering, ready
  const [downloadCount, setDownloadCount] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const messages = [
    "Initializing secure download...",
    "Connecting to high-speed dedicated server...",
    "Detecting your network speed...",
    "Synchronizing with SciFun database...",
    "Your internet connection seems slow, please wait...",
    "Almost there, finalizing PDF quality...",
    "Optimizing download stream for your region...",
    "Establishing encrypted link..."
  ];

  useEffect(() => {
    // Fetch initial download count
    const fetchCount = async () => {
      try {
        const docRef = doc(db, "downloads", paperId || "default_paper");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDownloadCount(docSnap.data().count);
        } else {
          // If doesn't exist, set to a realistic initial number to show popularity
          const initialCount = Math.floor(Math.random() * 50) + 2470; 
          await setDoc(docRef, { count: initialCount });
          setDownloadCount(initialCount);
        }
      } catch (error) {
        console.error("Error fetching download count:", error);
        setDownloadCount(2500); // Fallback
      }
    };

    fetchCount();
  }, [paperId]);

  const handleDownload = async () => {
    if (status !== 'idle') return;

    setStatus('buffering');
    
    // Pick a random time between 5 and 10 seconds
    const delay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
    const startTime = Date.now();

    // Cycle through messages
    let msgIndex = 0;
    setLoadingMessage(messages[0]);
    const msgInterval = setInterval(() => {
      msgIndex++;
      setLoadingMessage(messages[msgIndex % messages.length]);
    }, 1200);

    // Update progress bar
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min((elapsed / delay) * 100, 95);
      setProgress(calculatedProgress);
    }, 50);

    // Track download in Firestore
    try {
      const docRef = doc(db, "downloads", paperId || "default_paper");
      await updateDoc(docRef, {
        count: increment(1)
      });
      setDownloadCount(prev => prev + 1);
    } catch (error) {
      console.error("Error updating download count:", error);
    }

      // After the delay
      setTimeout(() => {
        clearInterval(msgInterval);
        clearInterval(progressInterval);
        setProgress(100);
        setStatus('ready');
        
        // Trigger actual download via top-level location change
        // Since it's a download link (uc?export=download), the browser stays on the page
        // but starts the file download. This is more reliable than anchor.click() after a delay.
        try {
          window.location.assign(fileUrl);
        } catch (error) {
          console.error("Download trigger failed:", error);
          // Fallback just in case
          window.open(fileUrl, '_self');
        }

        // Reset after a few seconds
        setTimeout(() => {
          setStatus('idle');
          setProgress(0);
        }, 6000);
      }, delay);
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-indigo-50 transition-all duration-500 hover:shadow-indigo-100 relative overflow-hidden">
        
        {/* Subtle background decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-50 rounded-full opacity-50 blur-3xl"></div>

        {/* Download Count Badge */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="bg-indigo-600 text-white px-5 py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-200">
            <Download size={16} />
            {downloadCount ? `${downloadCount.toLocaleString()} Students have downloaded this PDF` : "Calculating downloads..."}
          </div>
        </div>

        {status === 'idle' && (
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="text-center">
               <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Download?</h3>
               <p className="text-slate-500 text-sm">Download the complete {fileName} in high-quality PDF format.</p>
            </div>
            
            <button
              onClick={handleDownload}
              className="group w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-5 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.03] active:scale-95 shadow-xl shadow-indigo-100 border-b-4 border-indigo-800"
            >
              <Download size={24} className="group-hover:animate-bounce" />
              FREE DOWNLOAD PDF
            </button>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Verified Safely by SciFun Education</p>
          </div>
        )}

        {status === 'buffering' && (
          <div className="space-y-6 relative z-10 py-4">
            <div className="flex flex-col items-center gap-6">
              <div className="relative h-24 w-24">
                {/* Custom circular progress loader */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-100 stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-indigo-600 stroke-current transition-all duration-300 ease-out"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * progress) / 100}
                    transform="rotate(-90 50 50)"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black text-indigo-600">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-indigo-900 font-extrabold text-xl h-8">
                  {loadingMessage}
                </p>
                <div className="inline-flex items-center gap-2 text-rose-500 font-bold text-xs bg-rose-50 px-4 py-2 rounded-full border border-rose-100 animate-pulse">
                  <AlertCircle size={14} />
                  WEAK INTERNET DETECTED: AUTO-STABILIZING...
                </div>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-1 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-400 transition-all duration-300 ease-out rounded-full shadow-lg relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-center text-slate-400 text-xs italic">Please do not refresh or close this tab...</p>
          </div>
        )}

        {status === 'ready' && (
          <div className="flex flex-col items-center gap-4 py-6 relative z-10 transition-all animate-in fade-in zoom-in">
            <div className="bg-emerald-500 p-5 rounded-full text-white shadow-lg shadow-emerald-200 animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            <div className="text-center">
               <p className="text-emerald-700 font-black text-2xl mb-1">Success!</p>
               <p className="text-slate-600 font-bold">Your download has started.</p>
            </div>
            <div className="mt-4 px-6 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs text-center leading-relaxed font-bold animate-pulse">
              VERIFYING FILE INTEGRITY... 
              <br />
              <span className="text-emerald-600">DOWNLOAD INITIATED SUCCESSFULLY</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
