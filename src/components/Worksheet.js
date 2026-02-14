import React from 'react';
import ProblemCard from './ProblemCard';

const OpTitleMap = {
  ADD: 'Addition',
  SUB: 'Subtraction',
  MUL: 'Multiplication',
  DIV: 'Division'
};

// A4 Constants
const A4_HEIGHT_PX = 1123; // approx at 96 DPI
const PAGE_PADDING_PX = 60; // approx 20mm padding top/bottom total
const HEADER_HEIGHT = 60;

const A4Page = ({ children, className = "", scale = 1 }) => {
  // Mobile View Scaling Wrapper
  // Inner: The actual 21cm content, scaled down.
  // Outer: A placeholder that shrinks with the scale to avoid whitespace.
  return (
    <div 
      className="relative mx-auto mb-8 print:mb-0 print:w-full print:h-auto print:block"
      style={{
        width: `calc(21cm * ${scale})`,
        minHeight: `calc(29.7cm * ${scale})`, // Minimum A4 height
        height: 'auto', // Allow it to grow
        marginBottom: `calc(2rem * ${scale})`
      }}
    >
      <div 
        className={`w-[21cm] min-h-[29.7cm] h-auto bg-white shadow-2xl mx-auto p-[1cm] flex flex-col origin-top-left print:shadow-none print:break-after-page section-container print:transform-none ${className}`}
        style={{
          transform: `scale(${scale})`
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Worksheet = ({ data, wordProblems, isWordProblemLoading, printSettings, scale = 1 }) => {
  
  // Helper to calculate items per page based on font size/spacing
  const getItemsPerPage = () => {
      // Heuristic: Base 24px font allows ~50 items (10 rows x 5 cols)
      // As font scales up, space reduces.
      const baseCount = 50; 
      const scaleFactor = 24 / printSettings.questionSize;
      const spacingFactor = 1.5 / Math.max(1, printSettings.spacing);
      
      // Calculate and clamp
      let count = Math.floor(baseCount * scaleFactor * spacingFactor);
      
      // Ensure divisible by 5 for clean grid (5 cols)
      return Math.max(5, Math.floor(count / 5) * 5); 
  };

  const ITEMS_PER_PAGE = getItemsPerPage();

  // 1. Filter active operations
  const activeOperations = (Object.keys(data))
    .filter(op => data[op] && data[op].length > 0)
    .filter(op => !printSettings.excludedSections.includes(op));

  const showWordProblems = (wordProblems.length > 0 || isWordProblemLoading) && 
                           !printSettings.excludedSections.includes('WORD_PROBLEMS');
  
  // 2. Welcome State
  if (activeOperations.length === 0 && !showWordProblems) {
    return (
      <A4Page className="flex flex-col items-center justify-center text-center" scale={scale}>
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Ready to Create?</h2>
        <p className="text-slate-500 max-w-xs mx-auto">Configure your math problems in the sidebar and click <b>Regenerate All</b>.</p>
      </A4Page>
    );
  }

  return (
    <div className="w-full print:w-auto">
        <A4Page scale={scale} className="h-auto min-h-[29.7cm]">
            
            {/* 1. MATH PROBLEMS SECTION */}
            {activeOperations.map((op, opIdx) => (
                <div key={op} className="mb-8 last:mb-0">
                    {/* Optional Header per operation if needed, otherwise just the grid */}
                    <div 
                        className="grid grid-cols-5 gap-y-4 gap-x-2 content-start"
                        style={{ 
                            gap: `${printSettings.spacing}rem`,
                            fontSize: `${printSettings.questionSize}px`
                        }}
                    >
                        {data[op].map((prob, i) => (
                           <div key={prob.id} className="flex justify-center break-inside-avoid">
                              <ProblemCard problem={prob} index={i} scale={printSettings.questionSize / 24} />
                           </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* 2. WORD PROBLEMS SECTION */}
            {showWordProblems && (
                <div className="mt-12 break-before-auto">
                     <h1 className="text-xl font-bold font-sans text-slate-900 uppercase mb-6 border-b-2 border-slate-800 pb-2">Challenge Problems</h1>
                     <div className="space-y-8">
                        {wordProblems.map((wp, i) => (
                           <div key={i} className="flex gap-4 break-inside-avoid">
                                <span className="font-bold text-slate-700 text-lg">{i + 1}.</span>
                                <div className="flex-1">
                                    <p className="text-lg font-hand text-slate-800 mb-6 leading-relaxed" style={{ fontSize: `${printSettings.questionSize * 0.8}px` }}>{wp.question}</p>
                                    <div className="border-b border-slate-200 w-full h-8"></div>
                                </div>
                           </div>
                        ))}
                     </div>
                </div>
            )}

            {/* 3. ANSWER KEY SECTION */}
            {printSettings.includeAnswerKey && (
                <div className="mt-12 break-before-page border-t-2 border-slate-400 pt-8">
                    <h1 className="text-xl font-bold font-mono text-slate-700 uppercase tracking-tighter mb-8 border-b-2 border-slate-400 pb-2">Verified Answer Key</h1>
                    <div className="grid grid-cols-2 gap-8 content-start">
                        {activeOperations.map(op => (
                            <div key={op} className="mb-4">
                                <h3 className="font-bold text-indigo-600 mb-2 text-sm uppercase">{OpTitleMap[op]}</h3>
                                <div className="grid grid-cols-5 gap-2 text-xs font-mono text-slate-600">
                                    {data[op].map((prob, i) => (
                                        <div key={prob.id} className="flex gap-1 break-inside-avoid">
                                            <span className="font-bold text-slate-400">{i+1}.</span>
                                            <span>{prob.answer}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
        </A4Page>
    </div>
  );
};

export default Worksheet;
