"use client";

import React, { useState, useEffect } from 'react';
import Worksheet from '@/components/Worksheet';
import { Printer, RefreshCw, Settings, CheckCircle2, Circle } from 'lucide-react';

/**
 * MATH SERVICE LOGIC - Integrated directly for a self-contained page
 */
const generateRandomNumber = (digits) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateForOperation = (op, settings) => {
  const problems = [];
  for (let i = 0; i < settings.questionCount; i++) {
    let valA = 0;
    let valB = 0;
    let answer = 0;
    
    if (op === 'DIV') {
      const divisor = generateRandomNumber(settings.digitCountA); 
      const quotient = generateRandomNumber(settings.digitCountB);
      valA = divisor;
      valB = divisor * quotient;
      answer = quotient;
    } else {
      valA = generateRandomNumber(settings.digitCountA);
      valB = generateRandomNumber(settings.digitCountB);
      if (op === 'SUB' && valB > valA) [valA, valB] = [valB, valA];
      if (op === 'ADD') answer = valA + valB;
      if (op === 'SUB') answer = valA - valB;
      if (op === 'MUL') answer = valA * valB;
    }
    problems.push({
      id: Math.random().toString(36).substr(2, 9),
      type: op,
      valA,
      valB,
      operandDisplayA: valA.toString(),
      operandDisplayB: valB.toString(),
      answer
    });
  }
  return problems;
};

const generateProblemsLocal = (config) => {
  const data = {};
  Object.keys(config.operations).forEach((op) => {
    if (config.operations[op].enabled) {
      data[op] = generateForOperation(op, config.operations[op]);
    }
  });
  return data;
};

/**
 * WORKSHEET CREATOR COMPONENT
 */
export default function WorksheetPage() {
  const defaultOpSettings = {
    enabled: false,
    digitCountA: 2,
    digitCountB: 2,
    questionCount: 20
  };

  const [config, setConfig] = useState({
    operations: {
        ADD: { ...defaultOpSettings, enabled: true },
        SUB: { ...defaultOpSettings, enabled: true },
        MUL: { ...defaultOpSettings, enabled: false },
        DIV: { ...defaultOpSettings, enabled: false },
    },
    includeWordProblems: false,
    printSettings: {
        questionSize: 24,
        spacing: 1.5,
        includeAnswerKey: true,
        excludedSections: []
    }
  });

  const [activeTab, setActiveTab] = useState('ADD');
  const [data, setData] = useState({});
  const [wordProblems, setWordProblems] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [scale, setScale] = useState(1);

  // Initial State is Blank as requested
  useEffect(() => {
    setData({});
    setWordProblems([]);
  }, []);

  // Dynamic Scale for Mobile "Fit to Screen"
  useEffect(() => {
    const handleResize = () => {
        // A4 Width at 96 DPI is approx 794px. 
        // We add some buffer for padding (32px).
        const a4Width = 794; 
        const padding = 32; 
        const availableWidth = window.innerWidth - padding;
        
        // If on mobile/tablet (< 768px), scale to fit
        if (window.innerWidth < 768) {
             const newScale = Math.min(1, availableWidth / a4Width);
             setScale(newScale);
        } else {
            setScale(1);
        }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGenerate = () => {
    const newData = generateProblemsLocal(config);
    setData(newData);
    setWordProblems([]); 
  };

  const handlePrint = () => {
    window.print();
  };

  const updateOpSettings = (op, updates) => {
    setConfig(prev => ({
        ...prev,
        operations: { ...prev.operations, [op]: { ...prev.operations[op], ...updates } }
    }));
  };

  const updatePrintSettings = (updates) => {
    setConfig(prev => ({
        ...prev,
        printSettings: { ...prev.printSettings, ...updates }
    }));
  };

  const toggleSectionSelection = (section) => {
    const isExcluded = config.printSettings.excludedSections.includes(section);
    const newExcluded = isExcluded 
        ? config.printSettings.excludedSections.filter(s => s !== section)
        : [...config.printSettings.excludedSections, section];
    updatePrintSettings({ excludedSections: newExcluded });
  };

  const currentSettings = config.operations[activeTab];

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen bg-slate-100 print:block print:h-auto print:bg-white print:overflow-visible">
      
      {/* Sidebar Controls */}
      <aside className="w-full md:w-96 bg-white border-r border-slate-200 flex flex-col print:hidden z-10 shadow-lg md:shadow-none flex-shrink-0 md:h-full">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 text-indigo-600">
          <Settings size={28} />
          <h1 className="text-2xl font-bold tracking-tight">Math Studio</h1>
        </div>

        {/* Scrollable Settings */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Operations Selection */}
          <section>
            <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Operations</label>
            <div className="flex flex-col gap-2">
                {['ADD', 'SUB', 'MUL', 'DIV'].map(op => {
                    const isEnabled = config.operations[op].enabled;
                    const isActive = activeTab === op;
                    return (
                        <div key={op} className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${isActive ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-slate-50'}`}>
                            <button 
                                onClick={() => updateOpSettings(op, { enabled: !isEnabled })}
                                className={`${isEnabled ? 'text-green-500' : 'text-slate-300'} hover:scale-110 transition-transform`}
                            >
                                {isEnabled ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>
                            <button 
                                onClick={() => setActiveTab(op)}
                                className={`flex-1 text-left font-bold ${isActive ? 'text-indigo-900' : 'text-slate-600'}`}
                            >
                                {op === 'ADD' && 'Addition'}
                                {op === 'SUB' && 'Subtraction'}
                                {op === 'MUL' && 'Multiplication'}
                                {op === 'DIV' && 'Division'}
                            </button>
                        </div>
                    );
                })}
            </div>
          </section>

          {/* Active Skill Settings */}
          <section className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
            <div className="absolute -top-3 left-4 bg-slate-50 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Config: {activeTab}
            </div>
            
            <div className="space-y-5 mt-2">
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-700">Top Number Digits</span>
                        <span className="text-sm font-mono font-bold">{currentSettings.digitCountA}</span>
                    </div>
                    <input type="range" min="1" max="4" value={currentSettings.digitCountA} onChange={(e) => updateOpSettings(activeTab, { digitCountA: parseInt(e.target.value) })} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-700">Bottom Number Digits</span>
                        <span className="text-sm font-mono font-bold">{currentSettings.digitCountB}</span>
                    </div>
                    <input type="range" min="1" max="4" value={currentSettings.digitCountB} onChange={(e) => updateOpSettings(activeTab, { digitCountB: parseInt(e.target.value) })} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-700">Questions</span>
                        <span className="text-sm font-mono font-bold">{currentSettings.questionCount}</span>
                    </div>
                    <input type="range" min="4" max="60" step="4" value={currentSettings.questionCount} onChange={(e) => updateOpSettings(activeTab, { questionCount: parseInt(e.target.value) })} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
            </div>
          </section>

          {/* Print Studio Options */}
          <section className="space-y-6 pt-4 border-t border-slate-100">
             <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider">Print Studio</label>
             
             {/* Question Size */}
             <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-700">Question Size</span>
                    <span className="text-sm font-mono font-bold text-indigo-600">{config.printSettings.questionSize}px</span>
                </div>
                <input type="range" min="16" max="48" step="2" value={config.printSettings.questionSize} onChange={(e) => updatePrintSettings({ questionSize: parseInt(e.target.value) })} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
             </div>

             {/* Spacing */}
             <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-700">Spacing</span>
                    <span className="text-sm font-mono font-bold text-indigo-600">{config.printSettings.spacing}x</span>
                </div>
                <input type="range" min="0.5" max="3" step="0.5" value={config.printSettings.spacing} onChange={(e) => updatePrintSettings({ spacing: parseFloat(e.target.value) })} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
             </div>

             {/* What to include */}
             <div className="space-y-3">
                <span className="text-sm font-medium text-slate-700">Include in Print:</span>
                <div className="grid grid-cols-2 gap-2">
                    {['ADD', 'SUB', 'MUL', 'DIV', 'WORD_PROBLEMS'].map(sec => (
                        <button key={sec} onClick={() => toggleSectionSelection(sec)} className={`px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all ${!config.printSettings.excludedSections.includes(sec) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                            {sec.replace('_', ' ')}
                        </button>
                    ))}
                </div>
             </div>

             {/* Answer Key Toggle */}
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-bold text-slate-700">Print Answer Key</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={config.printSettings.includeAnswerKey} onChange={(e) => updatePrintSettings({ includeAnswerKey: e.target.checked })} />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                </label>
             </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-slate-200 bg-white flex flex-col gap-3">
            <button onClick={handleGenerate} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
              <RefreshCw size={20} /> Generate Problems
            </button>
            <button onClick={handlePrint} className="w-full py-3 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
              <Printer size={20} /> Print Worksheet
            </button>
        </div>
      </aside>

      {/* Worksheet Preview */}
      <main className="flex-1 bg-slate-200/50 p-2 md:p-8 overflow-hidden md:overflow-auto print:p-0 print:bg-white print:overflow-visible print:h-auto print:block print:w-full">
        <div 
            className="flex justify-center md:block origin-top print:transform-none print:scale-100"
        >
          <div className="mx-auto print:w-full print:max-w-none print:mx-0 print:shadow-none print:min-h-screen">
            <Worksheet 
              data={data} 
              wordProblems={wordProblems} 
              isWordProblemLoading={loadingAI} 
              printSettings={config.printSettings}
              scale={scale} // Pass scale to handle internal layout
            />
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page { margin: 5mm; size: A4; }
          body { background: white !important; }
          .section-container { page-break-after: always; break-after: page; }
          .no-break { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
