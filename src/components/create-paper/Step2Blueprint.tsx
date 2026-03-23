import React, { useState } from 'react';
import {
 FileText,
 Target,
 ListPlus,
 BookOpen,
 Cpu,
 Sparkles,
 Trash2,
 Plus,
 Eye
} from 'lucide-react';
import { GenerationConfig, BlueprintRule, SectionType } from '@/types';
import { CHAPTERS } from '@/data/questions';

interface Step2BlueprintProps {
 config: GenerationConfig;
 setConfig: (config: GenerationConfig) => void;
 onGenerate: () => void;
 onBack: () => void;
 loading: boolean;
 onManualSelect?: () => void;
}

export const Step2Blueprint: React.FC<Step2BlueprintProps> = ({
 config,
 setConfig,
 onGenerate,
 onBack,
 loading,
 onManualSelect
}) => {
 const [searchChapter, setSearchChapter] = useState('');
 const [newRule, setNewRule] = useState<Partial<BlueprintRule>>({
  type: SectionType.MCQ,
  requiredCount: 1,
  marksPerQuestion: 1,
  chapterFilter: 'All'
 });

 const currentTotalMarks = config.blueprint.reduce((sum, r) => sum + (r.requiredCount * r.marksPerQuestion), 0);
 const currentTotalQuestions = config.blueprint.reduce((sum, r) => sum + r.requiredCount, 0);

 const toggleChapter = (chapter: string) => {
  setConfig({
   ...config,
   selectedChapters: config.selectedChapters.includes(chapter)
    ? config.selectedChapters.filter(c => c !== chapter)
    : [...config.selectedChapters, chapter]
  });
 };

 const addBlueprintRule = () => {
  if (!newRule.type || !newRule.requiredCount || !newRule.marksPerQuestion) return;

  const rule: BlueprintRule = {
   id: Date.now().toString(),
   name: `Custom Section (${newRule.type})`,
   type: newRule.type,
   requiredCount: newRule.requiredCount,
   marksPerQuestion: newRule.marksPerQuestion,
   chapterFilter: newRule.chapterFilter || 'All'
  };

  setConfig({ ...config, blueprint: [...config.blueprint, rule] });
 };

 const removeBlueprintRule = (id: string) => {
  setConfig({ ...config, blueprint: config.blueprint.filter(r => r.id !== id) });
 };

 const loadPreset = (type: '80M' | '40M' | '20M') => {
  if (type === '80M') {
   setConfig({
    ...config,
    totalMarks: 80,
    blueprint: [
     { id: '1', name: 'Section A - MCQ', type: SectionType.MCQ, requiredCount: 8, marksPerQuestion: 2, chapterFilter: 'All' },
     { id: '2', name: 'Section A - VSA', type: SectionType.VSA, requiredCount: 4, marksPerQuestion: 1, chapterFilter: 'All' },
     { id: '3', name: 'Section B - SA I', type: SectionType.SA_2, requiredCount: 8, marksPerQuestion: 2, chapterFilter: 'All' },
     { id: '4', name: 'Section C - SA II', type: SectionType.SA_3, requiredCount: 8, marksPerQuestion: 3, chapterFilter: 'All' },
     { id: '5', name: 'Section D - LA', type: SectionType.LA_4, requiredCount: 5, marksPerQuestion: 4, chapterFilter: 'All' },
    ]
   });
  } else if (type === '40M') {
   setConfig({
    ...config,
    totalMarks: 40,
    blueprint: [
     { id: '1', name: 'Section A - MCQ', type: SectionType.MCQ, requiredCount: 4, marksPerQuestion: 2, chapterFilter: 'All' },
     { id: '2', name: 'Section A - VSA', type: SectionType.VSA, requiredCount: 2, marksPerQuestion: 1, chapterFilter: 'All' },
     { id: '3', name: 'Section B - SA I', type: SectionType.SA_2, requiredCount: 4, marksPerQuestion: 2, chapterFilter: 'All' },
     { id: '4', name: 'Section C - SA II', type: SectionType.SA_3, requiredCount: 4, marksPerQuestion: 3, chapterFilter: 'All' },
     { id: '5', name: 'Section D - LA', type: SectionType.LA_4, requiredCount: 2, marksPerQuestion: 4, chapterFilter: 'All' },
    ]
   });
  } else {
   setConfig({
    ...config,
    totalMarks: 20,
    blueprint: [
     { id: '1', name: 'Section A - MCQ', type: SectionType.MCQ, requiredCount: 2, marksPerQuestion: 2, chapterFilter: 'All' },
     { id: '2', name: 'Section A - VSA', type: SectionType.VSA, requiredCount: 2, marksPerQuestion: 1, chapterFilter: 'All' },
     { id: '3', name: 'Section B - SA I', type: SectionType.SA_2, requiredCount: 2, marksPerQuestion: 2, chapterFilter: 'All' },
     { id: '4', name: 'Section C - SA II', type: SectionType.SA_3, requiredCount: 2, marksPerQuestion: 3, chapterFilter: 'All' },
     { id: '5', name: 'Section D - LA', type: SectionType.LA_4, requiredCount: 1, marksPerQuestion: 4, chapterFilter: 'All' },
    ]
   });
  }
 };

 return (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

   {/* Left Column: Chapters & Rules */}
   <div className="lg:col-span-8 flex flex-col gap-8">

    {/* 1. Quick Presets */}
    <div className="grid grid-cols-2 gap-4">
     <button onClick={() => loadPreset('80M')} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-blue-500 hover:shadow-lg transition-all text-left group">
      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
       <FileText className="w-5 h-5 text-blue-600 group-hover:text-white" />
      </div>
      <h4 className="font-black text-slate-800">Load Standard 80M</h4>
      <p className="text-xs font-bold text-slate-400 mt-1">Board Pattern (Sec A-D)</p>
     </button>
     <button onClick={() => loadPreset('40M')} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-purple-500 hover:shadow-lg transition-all text-left group">
      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-600 transition-colors">
       <Target className="w-5 h-5 text-purple-600 group-hover:text-white" />
      </div>
      <h4 className="font-black text-slate-800">Load 40 Marks</h4>
      <p className="text-xs font-bold text-slate-400 mt-1">Semester Pattern</p>
     </button>
     <button onClick={() => loadPreset('20M')} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-500 hover:shadow-lg transition-all text-left group">
      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-600 transition-colors">
       <ListPlus className="w-5 h-5 text-indigo-600 group-hover:text-white" />
      </div>
      <h4 className="font-black text-slate-800">Load 20 Marks</h4>
      <p className="text-xs font-bold text-slate-400 mt-1">Unit Test Pattern</p>
     </button>
     <button onClick={() => onManualSelect && onManualSelect()} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-emerald-500 hover:shadow-lg transition-all text-left group">
      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-600 transition-colors">
       <Eye className="w-5 h-5 text-emerald-600 group-hover:text-white" />
      </div>
      <h4 className="font-black text-slate-800">Select Manually</h4>
      <p className="text-xs font-bold text-slate-400 mt-1">View and pick questions</p>
     </button>
    </div>

    {/* 2. Chapter Selection */}
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
     <div className="flex justify-between items-center mb-6">
      <h3 className="font-black text-lg text-slate-800 flex items-center gap-2"><BookOpen className="w-5 h-5 text-slate-400" /> Select Chapters</h3>
      <button onClick={() => setConfig({ ...config, selectedChapters: CHAPTERS })} className="text-xs font-black text-blue-600 uppercase">Select All</button>
     </div>
     <div className="max-h-60 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2 custom-scrollbar pr-2">
      {CHAPTERS.map(ch => (
       <button
        key={ch}
        onClick={() => toggleChapter(ch)}
        className={`
                            px-4 py-3 rounded-xl text-left font-bold text-xs transition-all border
                            ${config.selectedChapters.includes(ch)
          ? 'bg-slate-800 text-white border-slate-800'
          : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'}
                          `}
       >
        {ch}
       </button>
      ))}
     </div>
    </div>

    {/* 3. Rule Builder */}
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
     <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-2"><ListPlus className="w-5 h-5 text-slate-400" /> Rule Builder</h3>

     <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-6 rounded-[2rem]">
      <div className="flex-1 w-full">
       <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Type</label>
       <select
        className="w-full p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none focus:border-blue-500"
        value={newRule.type}
        onChange={e => {
         const t = e.target.value as SectionType;
         let m = 1;
         if (t === SectionType.MCQ) m = 2;
         if (t === SectionType.VSA) m = 1;
         if (t === SectionType.SA_2) m = 2;
         if (t === SectionType.SA_3) m = 3;
         if (t === SectionType.LA_4) m = 4;
         setNewRule({ ...newRule, type: t, marksPerQuestion: m });
        }}
       >
        <option value={SectionType.MCQ}>Multiple Choice (MCQ)</option>
        <option value={SectionType.VSA}>Very Short Answer (VSA)</option>
        <option value={SectionType.SA_2}>Short Answer I (2M)</option>
        <option value={SectionType.SA_3}>Short Answer II (3M)</option>
        <option value={SectionType.LA_4}>Long Answer (4M)</option>
       </select>
      </div>

      <div className="w-full md:w-32">
       <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Count</label>
       <input
        type="number" min="1"
        className="w-full p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none focus:border-blue-500"
        value={newRule.requiredCount}
        onChange={e => setNewRule({ ...newRule, requiredCount: parseInt(e.target.value) })}
       />
      </div>

      <div className="w-full md:w-32">
       <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Marks Each</label>
       <input
        type="number" min="1"
        className="w-full p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none focus:border-blue-500"
        value={newRule.marksPerQuestion}
        onChange={e => setNewRule({ ...newRule, marksPerQuestion: parseInt(e.target.value) })}
       />
      </div>

      <button
       onClick={addBlueprintRule}
       className="w-full md:w-auto p-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-colors"
      >
       <Plus className="w-6 h-6" />
      </button>
     </div>

     {/* Rule List */}
     <div className="mt-8 space-y-3">
      {config.blueprint.length === 0 && (
       <p className="text-center text-slate-400 font-bold text-sm py-4">No rules added yet. Use presets or add manually.</p>
      )}
      {config.blueprint.map((rule, idx) => (
       <div key={rule.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
         <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-black flex items-center justify-center text-xs">
          {idx + 1}
         </div>
         <div>
          <p className="font-black text-slate-800 text-sm">{rule.name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{rule.requiredCount} Qs × {rule.marksPerQuestion}M</p>
         </div>
        </div>
        <button onClick={() => removeBlueprintRule(rule.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
         <Trash2 className="w-4 h-4" />
        </button>
       </div>
      ))}
     </div>
    </div>

   </div>

   {/* Right Column: Summary */}
   <div className="lg:col-span-4 space-y-8">
    <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl sticky top-8">
     <h3 className="text-xl font-black mb-8 flex items-center gap-2"><Cpu className="w-5 h-5 text-blue-400" /> Blueprint Summary</h3>

     <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
       <span className="text-slate-400 font-bold text-sm">Total Questions</span>
       <span className="text-4xl font-black">{currentTotalQuestions}</span>
      </div>
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
       <span className="text-slate-400 font-bold text-sm">Total Marks</span>
       <span className={`text-4xl font-black ${currentTotalMarks === config.totalMarks ? 'text-green-400' : 'text-blue-400'}`}>{currentTotalMarks}</span>
      </div>
      <div className="flex items-end justify-between pb-4">
       <span className="text-slate-400 font-bold text-sm">Target Marks</span>
       <span className="text-xl font-black text-slate-500">{config.totalMarks}</span>
      </div>
     </div>

     <button
      onClick={onGenerate}
      disabled={loading || config.blueprint.length === 0}
      className="w-full mt-8 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black rounded-3xl shadow-lg transition-all flex items-center justify-center gap-3"
     >
      {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full" /> : <Sparkles className="w-5 h-5" />}
      Generate Paper
     </button>

     <button onClick={onBack} className="w-full mt-4 py-3 text-slate-500 font-black text-xs uppercase hover:text-white transition-colors">
      Back to Setup
     </button>
    </div>
   </div>
  </div>
 );
};
