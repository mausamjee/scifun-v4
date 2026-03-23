'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  ChevronRight,
  Clock,
  Star,
  ChevronDown,
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Trash2,
  LayoutGrid,
  Info,
  Lightbulb,
  ArrowLeft,
  X,
  Menu
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { CHAPTERS } from '@/data/questions';

// --- Types ---

interface BlueprintRule {
  id: string;
  chapter: string;
  type: string;
  difficulty: string;
  count: number;
  marksPerQuestion: number;
}

// --- Components ---

const StepIndicator = ({
  currentStep,
  steps
}: {
  currentStep: number,
  steps: { label: string, progress: number }[]
}) => {
  return (
    <div className="mb-10 w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1].label}
        </p>
        <p className="text-xs font-bold text-slate-400">Progress: {steps[currentStep - 1].progress}%</p>
      </div>

      <div className="flex items-center gap-8 mb-6 relative">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2 z-10">
            {idx + 1 < currentStep ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-50" />
                <span className="text-xs font-bold text-blue-600">{step.label}</span>
              </div>
            ) : idx + 1 === currentStep ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-4 border-blue-600 bg-white" />
                <span className="text-xs font-bold text-slate-900">{step.label}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Circle className="w-5 h-5 text-slate-200" />
                <span className="text-xs font-bold text-slate-300">{step.label}</span>
              </div>
            )}
          </div>
        ))}
        {/* Progress Line */}
        <div className="absolute top-[9px] left-0 right-0 h-[2px] bg-slate-100 -z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${steps[currentStep - 1].progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default function CreatePaperPage() {
  const [step, setStep] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Step 1 State
  const [formData, setFormData] = useState({
    examTitle: '',
    class: '',
    subject: '',
    paperType: '',
    duration: '',
    totalMarks: 80
  });

  // Step 2 State
  const [rules, setRules] = useState<BlueprintRule[]>([]);
  const [newRule, setNewRule] = useState({
    chapter: '',
    type: '',
    difficulty: '',
    count: 1
  });

  const questionTypes = ['MCQ', 'Short Answer', 'Long Answer', 'VSA'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  // --- Calculations ---

  const totalQuestions = useMemo(() => rules.reduce((acc, r) => acc + r.count, 0), [rules]);
  const currentTotalMarks = useMemo(() => rules.reduce((acc, r) => acc + (r.count * r.marksPerQuestion), 0), [rules]);
  const marksNeeded = formData.totalMarks - currentTotalMarks;

  const progressPercent = Math.min(100, (currentTotalMarks / formData.totalMarks) * 100);

  // --- Functions ---

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const addRule = () => {
    if (!newRule.chapter || !newRule.type || !newRule.difficulty) return;

    // Assign marks based on type (example logic)
    let marks = 1;
    if (newRule.type === 'MCQ') marks = 2;
    if (newRule.type === 'Short Answer') marks = 3;
    if (newRule.type === 'Long Answer') marks = 4;

    const rule: BlueprintRule = {
      id: Math.random().toString(36).substr(2, 9),
      chapter: newRule.chapter,
      type: newRule.type,
      difficulty: newRule.difficulty,
      count: newRule.count,
      marksPerQuestion: marks
    };

    setRules([...rules, rule]);
    setNewRule({ ...newRule, count: 1 }); // reset some fields if desired
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRuleCount = (id: string, delta: number) => {
    setRules(rules.map(r =>
      r.id === id ? { ...r, count: Math.max(1, r.count + delta) } : r
    ));
  };

  const clearAllRules = () => {
    if (confirm('Clear all rules?')) setRules([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <LayoutGrid className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800">ExamFlow</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar - Responsive */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Top Navigation */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-2">Create New Paper</h1>
          <StepIndicator
            currentStep={step}
            steps={[
              { label: 'Basic Info', progress: 33 },
              { label: 'Blueprint', progress: 66 },
              { label: 'Preview', progress: 100 }
            ]}
          />
        </div>

        {step === 1 && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-10">
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Basic Details</h2>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Exam Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Mid-Term Mathematics 2024"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    value={formData.examTitle}
                    onChange={(e) => setFormData({ ...formData, examTitle: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Class</label>
                    <div className="relative">
                      <select
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none"
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      >
                        <option value="">Select Class</option>
                        <option value="12">Class 12</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Subject</label>
                    <div className="relative">
                      <select
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      >
                        <option value="">Select Subject</option>
                        <option value="math">Mathematics</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Time Duration</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g., 90 mins"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl pr-12"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      />
                      <Clock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Total Marks</label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl pr-12"
                        value={formData.totalMarks}
                        onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) || 0 })}
                      />
                      <Star className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 group"
              >
                Next: Create Blueprint
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Rules & Table */}
            <div className="lg:col-span-8 space-y-8">
              {/* Add Rule Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <LayoutGrid className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Add Questions Rules</h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Chapter</label>
                      <div className="relative">
                        <select
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold appearance-none outline-none focus:border-blue-500"
                          value={newRule.chapter}
                          onChange={(e) => setNewRule({ ...newRule, chapter: e.target.value })}
                        >
                          <option value="">Select Chapter</option>
                          {CHAPTERS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Type</label>
                      <div className="relative">
                        <select
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold appearance-none outline-none focus:border-blue-500"
                          value={newRule.type}
                          onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}
                        >
                          <option value="">Type</option>
                          {questionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Difficulty</label>
                      <div className="relative">
                        <select
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold appearance-none outline-none focus:border-blue-500"
                          value={newRule.difficulty}
                          onChange={(e) => setNewRule({ ...newRule, difficulty: e.target.value })}
                        >
                          <option value="">Diff.</option>
                          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Count</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                        value={newRule.count}
                        onChange={(e) => setNewRule({ ...newRule, count: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <button
                      onClick={addRule}
                      className="md:w-32 py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 self-end w-full"
                    >
                      <Plus className="w-5 h-5" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Added Rules Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">Added Rules (Blueprint Summary)</h2>
                  <button onClick={clearAllRules} className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 group transition-colors">
                    <Trash2 className="w-3.5 h-3.5 group-hover:scale-110" /> Clear All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Chapter / Topic</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Type</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Difficulty</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Count</th>
                        <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Quick Edit</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rules.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                            No rules added yet. Use the form above to add questions.
                          </td>
                        </tr>
                      ) : (
                        rules.map((rule, idx) => (
                          <tr key={rule.id} className="group hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-slate-300">{idx + 1}.</span>
                                <span className="text-sm font-bold text-slate-700">{rule.chapter}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-[10px] font-black px-2 py-1 bg-blue-50 text-blue-600 rounded-md uppercase tracking-tight">
                                {rule.type}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className={`text-[10px] font-black uppercase ${rule.difficulty === 'Easy' ? 'text-green-500' :
                                rule.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'
                                }`}>
                                {rule.difficulty}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-center font-bold text-slate-700">{rule.count}</td>
                            <td className="px-4 py-5">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => updateRuleCount(rule.id, -1)}
                                  className="p-1 px-2 border border-slate-200 rounded hover:bg-white hover:border-blue-400 transition-all text-slate-400 hover:text-blue-500"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => updateRuleCount(rule.id, 1)}
                                  className="p-1 px-2 border border-slate-200 rounded hover:bg-white hover:border-blue-400 transition-all text-slate-400 hover:text-blue-500"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right font-black text-blue-600">{rule.count * rule.marksPerQuestion}</td>
                          </tr>
                        ))
                      )}
                      {rules.length > 0 && (
                        <tr className="bg-slate-50/50 font-black">
                          <td colSpan={5} className="px-6 py-4 text-right text-[10px] uppercase text-slate-400">Sub-total Marks</td>
                          <td className="px-6 py-4 text-right text-lg text-blue-600">{currentTotalMarks}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Summary & Tips */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
              {/* Paper Summary Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Paper Summary</h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Progress Items */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Questions</span>
                      <span className="text-xs font-black text-slate-800">{totalQuestions} <span className="text-slate-300">/ 50</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 transition-all duration-500" style={{ width: `${Math.min(100, (totalQuestions / 50) * 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Marks</span>
                      <span className="text-xs font-black text-slate-800">{currentTotalMarks} <span className="text-slate-300">/ {formData.totalMarks}</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${currentTotalMarks === formData.totalMarks ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {marksNeeded > 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                      <Info className="w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-[11px] font-bold text-amber-800 leading-relaxed">
                        You need {marksNeeded} more marks to complete the paper as per your configuration.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 pt-4">
                    <button
                      disabled={currentTotalMarks < formData.totalMarks}
                      onClick={handleNextStep}
                      className="w-full py-4 bg-blue-600 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
                    >
                      Next: Generate Paper
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1" />
                    </button>
                    <button
                      onClick={handlePrevStep}
                      className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Tip Card */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
                <div className="flex gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm self-start">
                    <Lightbulb className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Quick Tip</h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                      Ensure you have a mix of Easy, Medium, and Hard questions for a balanced paper. The recommended ratio is 30:50:20.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Blueprint Completed!</h2>
            <p className="text-slate-500 font-medium max-w-md">
              Your paper configuration is ready. You can now generate the actual question paper from the database.
            </p>
            <button
              onClick={() => setStep(1)}
              className="mt-8 px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all"
            >
              Start Over
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
