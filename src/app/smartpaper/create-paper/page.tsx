'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Layers,
  Printer,
  CheckCircle2,
  Sparkles,
  X,
  Save,
  RefreshCw,
  Image as ImageIcon,
  Upload,
  Trash2
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { GenerationConfig, GeneratedPaper, Question, SectionType, BlueprintRule } from '@/types';
import { generatePaper, getAlternativeQuestion } from '@/services/generator';
import { fetchQuestions } from '@/services/questionService';
import { supabase } from '@/lib/clients';

// Sub-components
import { Step1Setup } from '@/components/create-paper/Step1Setup';
import { Step2Blueprint } from '@/components/create-paper/Step2Blueprint';
import { Step2ManualSelect } from '@/components/create-paper/Step2ManualSelect';
import { Step3PrintStudio } from '@/components/create-paper/Step3PrintStudio';

// --- Step Indicator Component ---
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { id: 1, name: 'Setup & Mode', icon: Settings },
    { id: 2, name: 'Blueprint & Rules', icon: Layers },
    { id: 3, name: 'Preview & Print', icon: Printer }
  ];

  return (
    <div className="flex items-center justify-center w-full mb-12">
      <div className="flex items-center w-full max-w-2xl relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = currentStep === s.id;
          const isCompleted = currentStep > s.id;

          return (
            <div key={s.id} className="flex-1 flex flex-col items-center relative z-10">
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-110' :
                  isCompleted ? 'bg-blue-100 text-blue-600' : 'bg-white border-2 border-slate-100 text-slate-300'}
              `}>
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function CreatePaperPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  const [config, setConfig] = useState<GenerationConfig>({
    mode: 'generator', // 'generator' or 'past_year'
    class: '12',
    selectedYear: '2025',
    selectedMonth: 'March',
    selectedChapters: [],
    totalMarks: 80,
    difficultyFocus: 'Standard',
    headerTitle: 'BOARD QUESTION PAPER : FEBRUARY 2025',
    subHeader: 'Board Model Paper 2025',
    testDate: new Date().toLocaleDateString('en-GB'),
    printTimestamp: new Date().toLocaleString(),
    watermark: 'SCIFUN',
    watermarkImage: undefined,
    watermarkRotation: -45,
    watermarkOpacity: 0.1,
    watermarkSize: 40,
    subject: 'MATHEMATICS AND STATISTICS',
    timeAllowed: '3 Hrs.',
    organizationName: 'ExamCraft - Automatic Question Paper Generator',
    showExamYear: false,
    fontSize: 10.5,
    blueprint: []
  });

  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [questionPool, setQuestionPool] = useState<Question[]>([]);

  // Edit Modal State
  const [editingQuestion, setEditingQuestion] = useState<{
    sectionIndex: number;
    questionIndex: number;
    data: Question;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    const checkConnections = async () => {
      try {
        const { error } = await supabase.from('class12').select('count', { count: 'exact', head: true });
        if (error) throw error;
        setDbStatus('connected');
      } catch (err) {
        setDbStatus('error');
      }
    };
    checkConnections();
  }, []);

  // --- Handlers ---
  const handleGenerate = async () => {
    if (config.mode === 'generator' && config.selectedChapters.length === 0) {
      setError("Please select at least one chapter.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch based on Mode
      const pool = await fetchQuestions(
        config.mode,
        config.selectedChapters,
        config.selectedYear,
        config.selectedMonth
      );

      setQuestionPool(pool);

      if (pool.length === 0) {
        throw new Error("No questions found in database matching your criteria.");
      }

      const newPaper = generatePaper(config, pool);
      setPaper(newPaper);
      setStep(3);
      // Ensure MathJax re-renders after content is set
      setTimeout(() => {
        if ((window as any).MathJax && (window as any).MathJax.typesetPromise) {
          (window as any).MathJax.typesetPromise().catch((err: unknown) => console.error("MathJax error:", err));
        }
      }, 100);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate paper. Check settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualGenerate = (manualPaper: GeneratedPaper) => {
    setPaper(manualPaper);
    setStep(3);
  };

  const saveQuestion = () => {
    if (!paper || !editingQuestion) return;
    const newSections = [...paper.sections];
    newSections[editingQuestion.sectionIndex].questions[editingQuestion.questionIndex] = editingQuestion.data;
    setPaper({ ...paper, sections: newSections });
    setEditingQuestion(null);
  };

  const swapWithRandom = () => {
    if (!paper || !editingQuestion || !questionPool.length) return;
    const usedIds: string[] = [];
    paper.sections.forEach(s => s.questions.forEach(q => usedIds.push(q.id)));
    const newQ = getAlternativeQuestion(editingQuestion.data, questionPool, usedIds);
    if (newQ) {
      setEditingQuestion({
        ...editingQuestion,
        data: { ...newQ, marks: editingQuestion.data.marks }
      });
    } else {
      alert("No other unique questions available for this chapter and type.");
    }
  };

  // Helper for Step 1
  const handleStep1Next = () => {
    if (config.mode === 'generator') {
      setStep(2);
    } else {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row print:bg-white overflow-x-hidden">
      <div className="no-print">
        <Sidebar />
      </div>

      <main className={`flex-1 flex flex-col ${step === 3 ? 'p-0' : 'p-4 md:p-10'} max-w-[1600px] mx-auto w-full transition-all duration-500`}>

        {step < 3 && (
          <>
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 mb-2 flex flex-col md:flex-row items-center gap-3">
                <Sparkles className="w-10 h-10 text-blue-600" />
                Create New Paper
              </h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">Configure the basic details for your examination</p>
            </div>
            <StepIndicator currentStep={step} />
          </>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* --- STEP 1 --- */}
        {step === 1 && (
          <Step1Setup
            config={config}
            setConfig={setConfig}
            dbStatus={dbStatus}
            onNext={handleStep1Next}
          />
        )}

        {/* --- STEP 2 --- */}
        {step === 2 && config.mode === 'generator' && (
          <Step2Blueprint
            config={config}
            setConfig={setConfig}
            onGenerate={handleGenerate}
            onBack={() => setStep(1)}
            loading={loading}
            onManualSelect={() => setConfig({ ...config, mode: 'manual' })}
          />
        )}

        {step === 2 && config.mode === 'manual' && (
          <Step2ManualSelect
            config={config}
            setConfig={setConfig}
            onGenerate={handleManualGenerate}
            onBack={() => setConfig({ ...config, mode: 'generator' })}
            loading={loading}
          />
        )}

        {/* --- STEP 3 --- */}
        {step === 3 && paper && (
          <Step3PrintStudio
            paper={paper}
            config={config}
            setConfig={setConfig}
            onBack={() => setStep(2)}
            onEditQuestion={(sectionIndex, questionIndex, data) => setEditingQuestion({ sectionIndex, questionIndex, data })}
          />
        )}

        {/* --- Edit Question Modal (Overlay) --- */}
        {editingQuestion && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                    Q
                  </span>
                  Edit Question
                </h3>
                <button onClick={() => setEditingQuestion(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Question Text (HTML supported)</label>
                  <textarea
                    value={editingQuestion.data.content}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, data: { ...editingQuestion.data, content: e.target.value } })}
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-serif text-lg outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                {editingQuestion.data.imageUrl && (
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <img src={editingQuestion.data.imageUrl} className="h-20 w-auto rounded-lg border border-slate-200" alt="Figure" />
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Attached Image</p>
                      <button
                        onClick={() => setEditingQuestion({ ...editingQuestion, data: { ...editingQuestion.data, imageUrl: undefined } })}
                        className="text-red-500 font-bold text-xs flex items-center gap-1 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" /> Remove Image
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Solution / Key</label>
                    <textarea
                      value={editingQuestion.data.solution}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, data: { ...editingQuestion.data, solution: e.target.value } })}
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-serif outline-none focus:border-green-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Question Image</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl h-32 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer relative group">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold uppercase">Upload New Image</span>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingQuestion({ ...editingQuestion, data: { ...editingQuestion.data, imageUrl: reader.result as string } });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between rounded-b-[2rem]">
                <button
                  onClick={swapWithRandom}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" /> Swap with Random
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingQuestion(null)}
                    className="px-6 py-3 text-slate-400 font-black hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveQuestion}
                    className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
