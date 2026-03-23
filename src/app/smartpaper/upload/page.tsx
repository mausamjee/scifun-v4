'use client';

import React, { useState } from 'react';
import {
 Upload,
 PlusCircle,
 CheckCircle2,
 AlertCircle,
 ArrowLeft,
 Trash2,
 Plus,
 Image as ImageIcon,
 BookOpen,
 Layout
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { supabase } from '@/lib/clients';
import { SectionType, Difficulty } from '@/types';
import { CHAPTERS } from '@/data/questions';
import Link from 'next/link';

export default function UploadQuestionPage() {
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const [question, setQuestion] = useState({
  subject: 'Mathematics',
  chapter: '',
  type: SectionType.MCQ,
  marks: 1,
  difficulty: Difficulty.Easy,
  content: '',
  solution: '',
  examYear: '',
  imageUrl: '',
  options: ['', '', '', '']
 });

 const handleOptionChange = (index: number, value: string) => {
  const newOptions = [...question.options];
  newOptions[index] = value;
  setQuestion({ ...question, options: newOptions });
 };

 const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(false);

  try {
   // 1. Validate
   if (!question.chapter || !question.content || !question.solution) {
    throw new Error("Please fill in Chapter, Content, and Solution.");
   }

   // 2. Prepare payload for 'class12' table
   const payload: any = {
    id: `q_${Date.now()}`, // Auto-generate ID to avoid null constraint
    subject: question.subject,
    chapter: question.chapter,
    type: question.type,
    marks: question.marks,
    difficulty: question.difficulty,
    content: question.content,
    solution: question.solution,
    exam_year: question.examYear || null,
    image_url: question.imageUrl || null,
   };

   // Only include options if it's MCQ
   if (question.type === SectionType.MCQ) {
    payload.options = question.options.filter(opt => opt.trim() !== '');
   }

   // 3. Insert into Supabase table 'class12'
   const { error: sbError } = await supabase
    .from('class12')
    .insert([payload]);

   if (sbError) throw sbError;

   setSuccess(true);
   // Reset major fields
   setQuestion(prev => ({
    ...prev,
    content: '',
    solution: '',
    imageUrl: '',
    options: ['', '', '', '']
   }));

  } catch (err: any) {
   console.error("Upload error:", err);
   setError(err.message || "Failed to upload question.");
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
   <Sidebar />

   <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
    <div className="mb-10 flex items-center justify-between">
     <div>
      <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
       <Upload className="w-8 h-8 text-blue-600" />
       Upload Question (class12)
      </h1>
      <p className="text-slate-400 font-bold text-sm">Add questions directly to the 'class12' table</p>
     </div>
     <Link href="/smartpaper" className="p-2 hover:bg-slate-100 rounded-full transition-all">
      <ArrowLeft className="w-6 h-6 text-slate-400" />
     </Link>
    </div>

    {success && (
     <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
       <CheckCircle2 className="w-6 h-6 text-white" />
      </div>
      <div>
       <p className="font-bold text-green-800">Question Uploaded Successfully to class12!</p>
       <p className="text-xs text-green-600 font-medium">It's now available for generation in all tools.</p>
      </div>
     </div>
    )}

    {error && (
     <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 animate-in shake duration-500">
      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
       <AlertCircle className="w-6 h-6 text-white" />
      </div>
      <div>
       <p className="font-bold text-red-800">Upload Failed</p>
       <p className="text-xs text-red-600 font-medium">{error}</p>
      </div>
     </div>
    )}

    <form onSubmit={handleUpload} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
     <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       {/* Basic Meta */}
       <div className="space-y-6">
        <div>
         <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Subject</label>
         <input
          type="text"
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
          value={question.subject}
          onChange={e => setQuestion({ ...question, subject: e.target.value })}
         />
        </div>

        <div>
         <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Chapter / Topic</label>
         <select
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
          value={question.chapter}
          onChange={e => setQuestion({ ...question, chapter: e.target.value })}
         >
          <option value="">Select Chapter</option>
          {CHAPTERS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
         </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
         <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Question Type</label>
          <select
           className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
           value={question.type}
           onChange={e => setQuestion({ ...question, type: e.target.value as SectionType })}
          >
           {Object.values(SectionType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
         </div>
         <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Marks</label>
          <input
           type="number"
           className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
           value={question.marks}
           onChange={e => setQuestion({ ...question, marks: parseInt(e.target.value) || 1 })}
          />
         </div>
        </div>

        <div>
         <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Difficulty</label>
         <div className="flex gap-2">
          {Object.values(Difficulty).map(d => (
           <button
            key={d}
            type="button"
            onClick={() => setQuestion({ ...question, difficulty: d })}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all ${question.difficulty === d
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
             }`}
           >
            {d}
           </button>
          ))}
         </div>
        </div>

        <div>
         <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-2">
          <ImageIcon className="w-3 h-3" /> Image URL (Optional)
         </label>
         <input
          type="text"
          placeholder="https://imgur.com/your-image.png"
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
          value={question.imageUrl}
          onChange={e => setQuestion({ ...question, imageUrl: e.target.value })}
         />
        </div>
       </div>

       {/* Content Areas */}
       <div className="space-y-6">
        <div>
         <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Question Content (LaTeX Supported)</label>
         <textarea
          className="w-full min-h-[140px] p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 font-mono"
          placeholder="Calculate the value of $x^2 + y^2$ ..."
          value={question.content}
          onChange={e => setQuestion({ ...question, content: e.target.value })}
         />
        </div>

        <div>
         <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Correct Solution / Answer Key</label>
         <textarea
          className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 font-mono"
          placeholder="The solution is based on Pythagoras theorem..."
          value={question.solution}
          onChange={e => setQuestion({ ...question, solution: e.target.value })}
         />
        </div>

        <div>
         <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Exam Year (e.g. 2024 PM)</label>
         <input
          type="text"
          placeholder="Optional"
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
          value={question.examYear}
          onChange={e => setQuestion({ ...question, examYear: e.target.value })}
         />
        </div>
       </div>
      </div>

      {/* MCQ Options */}
      {question.type === SectionType.MCQ && (
       <div className="pt-8 border-t border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">MCQ Options (A, B, C, D)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {question.options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
            {String.fromCharCode(65 + idx)}
           </div>
           <input
            type="text"
            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
            className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
            value={opt}
            onChange={e => handleOptionChange(idx, e.target.value)}
           />
          </div>
         ))}
        </div>
       </div>
      )}
     </div>

     <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
      <button
       type="submit"
       disabled={loading}
       className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:bg-slate-300 flex items-center gap-3"
      >
       {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <><PlusCircle className="w-6 h-6" /> Upload to class12</>}
      </button>
     </div>
    </form>
   </main>

   <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-in {
          animation-fill-mode: forwards;
        }
      `}</style>
  </div>
 );
}
