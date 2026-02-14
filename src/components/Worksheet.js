import React from 'react';
import ProblemCard from './ProblemCard';

const OpTitleMap = {
  ADD: 'Addition',
  SUB: 'Subtraction',
  MUL: 'Multiplication',
  DIV: 'Division'
};

const Worksheet = ({ data, wordProblems, isWordProblemLoading, printSettings }) => {
  
  // 1. Filter active operations based on selection
  const activeOperations = (Object.keys(data))
    .filter(op => data[op] && data[op].length > 0)
    .filter(op => !printSettings.excludedSections.includes(op));

  const showWordProblems = (wordProblems.length > 0 || isWordProblemLoading) && 
                           !printSettings.excludedSections.includes('WORD_PROBLEMS');
  
  // 2. Initial "Blank Page" / Welcome State
  if (activeOperations.length === 0 && !showWordProblems) {
    return (
      <div className="w-full max-w-[21cm] min-h-[29.7cm] mx-auto bg-white p-12 text-center flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
        </div>
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Ready to Create?</h2>
            <p className="text-slate-500 max-w-xs mx-auto">Configure your math problems in the sidebar and click <b>Regenerate All</b> to build your worksheet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[21cm] mx-auto bg-white shadow-xl print:shadow-none print:w-full">
      
      {/* Generate a section (Page) for each active operation */}
      {activeOperations.map((op, sectionIdx) => (
        <div key={op} className="p-2 print:p-2 min-h-[10cm] print:min-h-screen relative flex flex-col break-after-page section-container">
          {/* Heading Removed */}
          {/* <div className="border-b-2 border-slate-100 pb-2 mb-8 print:mb-4">
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{OpTitleMap[op]} Practice</h2>
          </div> */}

          <div 
            className="grid grid-cols-5 gap-y-4 gap-x-2 flex-1 content-start"
            style={{ 
                gap: `${printSettings.spacing}rem`,
                fontSize: `${printSettings.questionSize}px`
            }}
          >
            {data[op].map((prob, idx) => (
              <div key={prob.id} className="no-break flex justify-center">
                <ProblemCard problem={prob} index={idx} scale={printSettings.questionSize / 24} />
              </div>
            ))}
          </div>

          {/* Page Break only if more content follows */}
          {(sectionIdx < activeOperations.length - 1 || showWordProblems || printSettings.includeAnswerKey) && (
            <div className="page-break hidden print:block"></div>
          )}
        </div>
      ))}

      {/* Word Problems Section */}
      {showWordProblems && (
        <div className="p-6 print:p-12 min-h-[10cm] print:min-h-screen relative flex flex-col break-after-page section-container">
          <div className="flex justify-between items-center border-b-2 border-slate-800 pb-2 mb-6">
             <h1 className="text-xl font-bold font-sans text-slate-900 uppercase">Challenge Problems</h1>
             {isWordProblemLoading && <span className="text-xs text-blue-500 animate-pulse">Generating...</span>}
          </div>
          
          <div className="space-y-12 flex-1 mt-4">
            {wordProblems.map((wp, idx) => (
              <div key={idx} className="flex gap-4 no-break">
                <span className="font-bold text-slate-700 text-lg">{idx + 1}.</span>
                <div className="flex-1">
                  <p className="text-lg font-hand text-slate-800 mb-6 leading-relaxed" style={{ fontSize: `${printSettings.questionSize * 0.8}px` }}>
                    {wp.question}
                  </p>
                  <div className="border-b border-slate-200 w-full h-10"></div>
                  <div className="border-b border-slate-200 w-full h-10 mt-6"></div>
                </div>
              </div>
            ))}
          </div>
          {printSettings.includeAnswerKey && <div className="page-break hidden print:block"></div>}
        </div>
      )}

      {/* Answer Key Section */}
      {printSettings.includeAnswerKey && (
        <div className="p-6 print:p-12 min-h-[10cm] print:min-h-screen bg-slate-50 print:bg-white section-container">
          <div className="border-b-2 border-slate-400 pb-2 mb-8">
              <h1 className="text-xl font-bold font-mono text-slate-700 uppercase tracking-tighter">Verified Answer Key</h1>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-12">
              {activeOperations.map(op => (
                  <div key={op} className="mb-4 break-inside-avoid">
                      <h3 className="font-bold text-indigo-600 mb-4 border-b border-indigo-100 pb-1 text-sm uppercase">{OpTitleMap[op]}</h3>
                      <div className="grid grid-cols-4 gap-4 text-sm font-mono text-slate-600">
                          {data[op].map((prob, idx) => (
                              <div key={prob.id} className="whitespace-nowrap flex items-center gap-2">
                                  <span className="font-bold text-slate-300 min-w-[20px]">{idx+1}.</span>
                                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800">{prob.answer}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
              
              {showWordProblems && wordProblems.length > 0 && (
                  <div className="mb-4 col-span-2 break-inside-avoid">
                      <h3 className="font-bold text-indigo-600 mb-4 border-b border-indigo-100 pb-1 text-sm uppercase">Word Problems</h3>
                      <div className="space-y-3 text-sm font-mono text-slate-600">
                          {wordProblems.map((wp, idx) => (
                              <div key={idx} className="flex gap-2">
                                  <span className="font-bold text-slate-300 min-w-[20px]">{idx+1}.</span>
                                  <span className="bg-slate-100 px-3 py-1 rounded text-slate-800">{wp.answer}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Worksheet;
