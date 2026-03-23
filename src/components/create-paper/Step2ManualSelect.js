'use client';

import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Cpu, 
  Sparkles, 
  Eye
} from 'lucide-react';
import { fetchQuestions } from '@/services/questionService';

// Re-defining SectionType enum for JS
const SectionType = {
  MCQ: 'MCQ',
  VSA: 'VSA',
  SA_2: 'SA_2',
  SA_3: 'SA_3',
  LA_4: 'LA_4'
};

export const Step2ManualSelect = ({
  config,
  onGenerate,
  onBack,
  loading
}) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterChapter, setFilterChapter] = useState('All');

  useEffect(() => {
    const loadQuestions = async () => {
      setFetching(true);
      try {
        const pool = await fetchQuestions('manual', config.selectedChapters);
        setQuestions(pool);
      } catch (err) {
        setError(err.message || 'Failed to fetch questions');
      } finally {
        setFetching(false);
      }
    };
    if (config.selectedChapters.length > 0) {
      loadQuestions();
    }
  }, [config.selectedChapters]);

  // Derived marks sum from selected questions
  const currentTotalMarks = selectedQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);

  const toggleQuestion = (question) => {
    if (selectedQuestions.find(q => q.id === question.id)) {
      setSelectedQuestions(selectedQuestions.filter(q => q.id !== question.id));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleGenerate = () => {
    if (selectedQuestions.length === 0) return;
    
    // Group selected custom paper by types into sections
    const types = [SectionType.MCQ, SectionType.VSA, SectionType.SA_2, SectionType.SA_3, SectionType.LA_4];
    const sections = [];

    types.forEach(type => {
      const typeQuestions = selectedQuestions.filter(q => q.type === type);
      if (typeQuestions.length > 0) {
        sections.push({
          name: `${type} Section`,
          type: type,
          description: `Questions manually selected`,
          marksPerQuestion: typeQuestions[0].marks || 1,
          requiredCount: typeQuestions.length,
          totalPoolCount: typeQuestions.length,
          questions: typeQuestions
        });
      }
    });

    const manualPaper = {
      id: `PAPER_MANUAL_${Date.now()}`,
      title: config.headerTitle,
      subject: config.subject,
      date: config.testDate,
      totalMarks: currentTotalMarks,
      timeAllowed: config.timeAllowed,
      sections: sections
    };

    onGenerate(manualPaper);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || q.type === filterType;
    const matchesChapter = filterChapter === 'All' || q.chapter === filterChapter;
    return matchesSearch && matchesType && matchesChapter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Column: Question Bank */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-500" /> Manual Question Selection
            </h3>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
              {questions.length} Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 w-full"
            />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)} 
              className="p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-500"
            >
              <option value="All">All Types</option>
              <option value={SectionType.MCQ}>MCQ</option>
              <option value={SectionType.VSA}>VSA</option>
              <option value={SectionType.SA_2}>SA (2M)</option>
              <option value={SectionType.SA_3}>SA (3M)</option>
              <option value={SectionType.LA_4}>LA (4M)</option>
            </select>
            <select 
              value={filterChapter} 
              onChange={(e) => setFilterChapter(e.target.value)} 
              className="p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 line-clamp-1"
            >
              <option value="All">All Chapters</option>
              {config.selectedChapters.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {fetching ? (
               <div className="flex justify-center items-center h-40">
                  <div className="animate-spin w-8 h-8 flex border-2 border-emerald-500 border-t-transparent rounded-full" />
               </div>
            ) : error ? (
               <div className="text-center py-10 bg-red-50 rounded-2xl border border-dashed border-red-200 text-red-500 font-bold">
                  {error}
               </div>
            ) : filteredQuestions.length === 0 ? (
               <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 font-bold">
                  No questions found matching criteria
               </div>
            ) : (
              filteredQuestions.map((q) => {
                const isSelected = !!selectedQuestions.find(sq => sq.id === q.id);
                return (
                  <div 
                    key={q.id} 
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    onClick={() => toggleQuestion(q)}
                  >
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <div className="flex gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          isSelected ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {q.type}
                        </span>
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          {q.chapter}
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 border border-slate-200'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <div 
                      className="font-serif text-slate-800 text-sm"
                      dangerouslySetInnerHTML={{ __html: q.content }} 
                    />
                    {q.imageUrl && (
                      <div className="mt-2">
                         <img src={q.imageUrl} alt="Question figure" className="max-h-24 max-w-full object-contain rounded border border-slate-200" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Summary */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl sticky top-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-500/20 p-2 rounded-xl">
               <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black">Selection Summary</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <span className="text-slate-400 font-bold text-sm">Selected Qs</span>
              <span className="text-4xl font-black">{selectedQuestions.length}</span>
            </div>
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <span className="text-slate-400 font-bold text-sm">Total Marks</span>
              <span className="text-4xl font-black text-emerald-400">{currentTotalMarks}</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || selectedQuestions.length === 0}
            className="w-full mt-8 py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black rounded-3xl shadow-lg transition-all flex items-center justify-center gap-3"
          >
            {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full" /> : <Sparkles className="w-5 h-5" />}
            Generate Paper
          </button>

          <button onClick={onBack} className="w-full mt-4 py-3 pb-0 text-slate-500 font-black text-xs uppercase hover:text-white transition-colors">
             Cancel Manual Select
          </button>
        </div>
      </div>

    </div>
  );
};
