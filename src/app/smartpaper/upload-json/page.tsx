'use client';

import React, { useState } from 'react';
import {
  FileJson,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Database,
  Terminal,
  Eraser
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { supabase } from '@/lib/clients';
import Link from 'next/link';

export default function BulkUploadPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [selectedClass, setSelectedClass] = useState('12');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const validClasses = ['4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const handleBulkUpload = async () => {
    setLoading(true);
    setResult(null);

    try {
      // 1. Parse JSON
      let data;
      try {
        data = JSON.parse(jsonInput);
      } catch (e) {
        throw new Error("Invalid JSON format. Please check for missing brackets or commas.");
      }

      if (!Array.isArray(data)) {
        throw new Error("Input must be a JSON array of question objects.");
      }

      // 2. Map snake_case to camelCase and ensure required fields
      const mappedData = data.map((item: any) => ({
        id: item.id,
        board: item.board || 'State Board',
        medium: item.medium || 'English',
        subject: item.subject || 'Mathematics',
        chapter: item.chapter,
        type: item.type,
        marks: item.marks,
        difficulty: item.difficulty,
        content: item.content,
        options: Array.isArray(item.options) ? item.options : [],
        solution: item.solution,
        image_url: item.image_url || item.imageUrl || null,
        exam_year: item.exam_year || item.examYear || null
      }));

      const tableName = `class${selectedClass}`;

      // 3. Bulk Insert into selected Supabase table
      const { error: sbError } = await supabase
        .from(tableName)
        .insert(mappedData);

      if (sbError) throw sbError;

      setResult({
        type: 'success',
        message: `Successfully uploaded ${data.length} questions to the '${tableName}' table!`
      });
      setJsonInput(''); // Clear input on success

    } catch (err: any) {
      console.error("Bulk upload error:", err);
      setResult({
        type: 'error',
        message: err.message || "Failed to upload questions."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 md:p-10 max-w-6xl mx-auto w-full">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <FileJson className="w-8 h-8 text-indigo-600" />
              JSON Bulk Upload
            </h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Add multiple questions at once to the database</p>
          </div>
          <Link href="/smartpaper" className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <ArrowLeft className="w-6 h-6 text-slate-400" />
          </Link>
        </div>

        {result && (
          <div className={`mb-8 p-6 rounded-[2rem] flex items-center gap-6 animate-in slide-in-from-top-4 duration-300 ${result.type === 'success' ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
            }`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${result.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}>
              {result.type === 'success' ? <CheckCircle2 className="w-8 h-8 text-white" /> : <AlertCircle className="w-8 h-8 text-white" />}
            </div>
            <div>
              <p className={`text-lg font-black ${result.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                {result.type === 'success' ? 'Upload Successful' : 'Upload Failed'}
              </p>
              <p className={`font-bold text-sm ${result.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {result.message}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-4 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">JSON Input</span>
                  </div>

                  {/* Class Selector */}
                  <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1 border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Target Class:</span>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="bg-transparent text-indigo-400 font-mono text-xs font-bold outline-none cursor-pointer"
                    >
                      {validClasses.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setJsonInput('')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  title="Clear Input"
                >
                  <Eraser className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <textarea
                className="w-full h-[500px] p-8 bg-slate-950 text-indigo-300 font-mono text-xs outline-none resize-none selection:bg-indigo-500/30 selection:text-white leading-relaxed"
                placeholder='[
  {
    "id": "q1",
    "chapter": "Logic",
    "type": "MCQ",
    "content": "...",
    ...
  }
]'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />
              <div className="p-6 bg-white border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleBulkUpload}
                  disabled={loading || !jsonInput.trim()}
                  className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-3"
                >
                  {loading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <><Upload className="w-5 h-5" /> Push to class{selectedClass} table</>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200">
              <Database className="w-10 h-10 mb-6 opacity-30" />
              <h3 className="text-xl font-black mb-4 tracking-tight">Bulk Upload (class{selectedClass}) Guide</h3>
              <ul className="space-y-4 text-sm font-bold opacity-90">
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">1</span>
                  Format must be a JSON Array `[]`.
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">2</span>
                  Required: id, board, medium, subject, chapter, type, marks, difficulty, content, options, solution.
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">3</span>
                  LaTeX formulas are supported using `$...$`.
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">4</span>
                  Type must be: MCQ, VSA, SA_2, SA_3, or LA_4.
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
              <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider">Example Schema</h3>
              <pre className="text-[10px] font-bold text-slate-400 bg-slate-50 p-4 rounded-xl overflow-hidden leading-relaxed">
                {`{
  "id": "mcq1",
  "subject": "Mathematics",
  "chapter": "Logic",
  "type": "MCQ",
  "marks": 2,
  "difficulty": "Medium",
  "content": "...",
  "options": ["A", "B", ...],
  "solution": "...",
  "exam_year": "2025 M"
}`}
              </pre>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .animate-in {
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
