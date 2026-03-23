import React from 'react';
import {
  Target,
  CheckCircle2,
  Cpu,
  History,
  FileText,
  Sparkles,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const Step1Setup = ({
 config,
 setConfig,
 dbStatus,
 onNext
}) => {
 return (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
   <div className="lg:col-span-8 space-y-8">

    {/* Mode Selection */}
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
     <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
      <Target className="w-6 h-6 text-blue-600" /> Select Generation Mode
     </h3>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button
       onClick={() => setConfig({ ...config, mode: 'generator' })}
       className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${config.mode === 'generator' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}
      >
       <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${config.mode === 'generator' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
        {config.mode === 'generator' && <CheckCircle2 className="w-4 h-4 text-white" />}
       </div>
       <Cpu className={`w-10 h-10 mb-4 ${config.mode === 'generator' ? 'text-blue-600' : 'text-slate-400'}`} />
       <h4 className="font-black text-lg text-slate-800">Automatic Generator</h4>
       <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">Create a unique paper from the question bank using custom rules or templates.</p>
      </button>

      {['10', '12'].includes(config.class) && (
       <button
        onClick={() => setConfig({ ...config, mode: 'past_year' })}
        className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${config.mode === 'past_year' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
       >
        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${config.mode === 'past_year' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
         {config.mode === 'past_year' && <CheckCircle2 className="w-4 h-4 text-white" />}
        </div>
        <History className={`w-10 h-10 mb-4 ${config.mode === 'past_year' ? 'text-indigo-600' : 'text-slate-400'}`} />
        <h4 className="font-black text-lg text-slate-800">Past Year Paper</h4>
        <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">Load an exact replica of a previous board exam paper for practice.</p>
       </button>
      )}
     </div>

     {/* Past Year Selector */}
     {config.mode === 'past_year' && (
      <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Select Exam Year</label>
          <select
           value={config.selectedYear}
           onChange={(e) => setConfig({ ...config, selectedYear: e.target.value })}
           className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-bold text-slate-700 outline-none focus:border-indigo-500"
          >
           {Array.from({ length: 2026 - 2015 + 1 }, (_, i) => 2026 - i).map(year => (
            <option key={year} value={year.toString()}>{year}</option>
           ))}
          </select>
         </div>
         <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Select Session</label>
          <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-200 h-[60px]">
           {['March', 'July'].map((m) => (
            <button
             key={m}
             onClick={() => setConfig({ ...config, selectedMonth: m })}
             className={`flex-1 rounded-2xl font-black text-sm transition-all ${config.selectedMonth === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
             {m}
            </button>
           ))}
          </div>
         </div>
        </div>
      </div>
     )}
    </div>

    {/* Class Selection */}
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
     <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
      <GraduationCap className="w-6 h-6 text-blue-600" /> Select Class
     </h3>
     <div className="flex flex-wrap gap-4">
      {['5', '6', '7', '8', '9', '10', '11', '12'].map((cls) => (
       <button
        key={cls}
        onClick={() => {
         const newMode = (cls === '10' || cls === '12') ? config.mode : 'generator';
         setConfig({ ...config, class: cls, mode: newMode });
        }}
        className={`w-14 h-14 rounded-2xl font-black text-xl transition-all shadow-sm flex items-center justify-center border-2
          ${config.class === cls
          ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200 scale-110'
          : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-500'
         }`}
       >
        {cls}
       </button>
      ))}
     </div>
    </div>

    {/* Basic Details Form */}
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100 space-y-8">
     <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
       <FileText className="text-white w-5 h-5" />
      </div>
      <div>
       <h2 className="text-lg font-black text-slate-800">Header Details</h2>
       <p className="text-xs font-bold text-slate-400">Institutional branding</p>
      </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="col-span-1 md:col-span-2">
       <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Exam Title</label>
       <input
        type="text"
        value={config.headerTitle}
        onChange={(e) => setConfig({ ...config, headerTitle: e.target.value })}
        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
       />
      </div>
      <div>
       <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Subject</label>
       <input
        type="text"
        value={config.subject}
        onChange={(e) => setConfig({ ...config, subject: e.target.value })}
        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
       />
      </div>
      <div>
       <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Time Allowed</label>
       <input
        type="text"
        value={config.timeAllowed}
        onChange={(e) => setConfig({ ...config, timeAllowed: e.target.value })}
        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
       />
      </div>
      <div className="col-span-1 md:col-span-2">
       <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Organization Name</label>
       <input
        type="text"
        value={config.organizationName}
        onChange={(e) => setConfig({ ...config, organizationName: e.target.value })}
        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
       />
      </div>
     </div>
    </div>
   </div>

   <div className="lg:col-span-4 space-y-6">
    {/* Next Step / Action Card */}
    <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
     <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
      <Sparkles className="w-32 h-32" />
     </div>

     <h3 className="text-2xl font-black mb-2">Ready?</h3>
     <p className="text-slate-400 font-bold text-sm mb-8 leading-relaxed">
      {config.mode === 'generator' ? 'Proceed to select chapters and define your blueprint.' : 'Proceed to preview the past year paper.'}
     </p>

     <button
      onClick={onNext}
      className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl shadow-lg transition-all flex items-center justify-center gap-3 relative z-10"
     >
      {config.mode === 'generator' ? 'Configure Blueprint' : 'Load Paper'} <ChevronRight className="w-5 h-5" />
     </button>
    </div>

    {/* Status Indicators */}
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-4">
     <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${dbStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Database</span>
     </div>
    </div>
   </div>
  </div>
 );
};
