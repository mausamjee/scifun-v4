import React from 'react';

const ProblemCard = ({ problem, index, scale = 1 }) => {
  const { type, valA, valB } = problem;

  const fontSizeClass = scale > 1.5 ? 'text-4xl' : scale > 1.2 ? 'text-3xl' : 'text-2xl';
  const labelSize = Math.max(0.6, 0.5 * scale) + 'rem';

  // Compact Division
  if (type === 'DIV') {
    return (
      <div className="flex flex-col items-start p-1 font-mono" style={{ fontSize: `${scale * 1.5}rem` }}>
        <div className="flex items-baseline gap-1">
          <span className="font-sans text-slate-800 font-bold mr-1" style={{ fontSize: labelSize }}>{index + 1}.</span>
          <div className="flex items-center">
            {/* Divisor */}
            <span className="font-bold mr-1">{valA}</span>
            {/* Bracket & Dividend */}
            <div className="flex flex-col">
              <span className="border-l-2 border-t-2 border-black px-1.5 py-0 min-w-[60px] text-center" style={{ minWidth: `${scale * 60}px` }}>
                {valB}
              </span>
            </div>
          </div>
        </div>
        {/* Workspace area for division */}
        <div className="w-full" style={{ height: `${scale * 3}rem` }}></div>
      </div>
    );
  }

  // Symbol map
  const symbol = type === 'ADD' ? '+' : type === 'SUB' ? '−' : '×';

  return (
    <div className="flex flex-row items-start gap-1 p-1 break-inside-avoid">
       <span className="font-sans text-slate-800 font-bold mt-1 w-8 text-right shrink-0" style={{ fontSize: labelSize }}>{index + 1})</span>
       <div className={`flex flex-col items-end font-mono leading-none ${fontSizeClass}`}>
        <div className="tracking-widest mb-1">{valA}</div>
        <div className="flex items-center gap-1 border-b-2 border-black pb-1 mb-1 w-full justify-end relative">
          <span className="absolute left-[-1.5rem] top-0" style={{ fontSize: '0.9em' }}>{symbol}</span>
          <span className="tracking-widest">{valB}</span>
        </div>
        
        {/* Answer Input Areas - Scaled */}
        {/* Answer Input Areas - Removed as per request */}
      </div>
    </div>
  );
};

export default ProblemCard;
