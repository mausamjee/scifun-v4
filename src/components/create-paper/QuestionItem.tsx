import React from 'react';
import { Edit } from 'lucide-react';
import { Question, GenerationConfig } from '@/types';

interface QuestionItemProps {
 question: Question;
 label: string;
 showSolutions: boolean;
 config: GenerationConfig;
 onEdit: () => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
 question: q,
 label,
 showSolutions,
 config,
 onEdit
}) => {
 // Option Layout Logic
 const isShortOptions = q.options && q.options.every(o => o.replace(/<[^>]*>/g, '').length < 15);

 return (
  <div className="page-break-avoid group relative pb-1 hover:bg-slate-50/80 transition-all rounded-xl pr-1 pl-1 cursor-pointer">
   <button
    onClick={(e) => {
     e.stopPropagation();
     onEdit();
    }}
    className="absolute right-2 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1.5 text-white bg-blue-600 shadow-lg border border-blue-500 rounded-full no-print z-20 hover:bg-blue-700 hover:scale-110 transform duration-200"
    title="Edit Question"
   >
    <Edit className="w-3.5 h-3.5" />
   </button>

   <div className="flex items-baseline" style={{ gap: '0.4em' }} onClick={onEdit}>
    <span className="font-black shrink-0 text-[1em]">{label}</span>
    <div className="flex-1 min-w-0">
     {/* Question Content & Marks Row */}
     <div className="flex items-baseline flex-wrap">
      <div className="flex-1 leading-snug font-serif text-[1em] pr-2" dangerouslySetInnerHTML={{ __html: q.content }} />
      <div className="flex items-baseline gap-2 shrink-0 self-start ml-auto">
       {config.showExamYear && q.examYear && <span className="text-[9pt] text-slate-500 font-bold whitespace-nowrap">[{q.examYear}]</span>}
       <span className="font-black text-[1em]">({q.marks})</span>
      </div>
     </div>

     {q.imageUrl && <div className="my-2 text-center"><img src={q.imageUrl} alt="Figure" className="max-w-[60%] max-h-[200px] h-auto mx-auto border border-slate-200 p-1 shadow-sm bg-white rounded" /></div>}

     {/* Compact Options */}
     {q.options && q.options.length > 0 && (
      <div className="mt-1 ml-1 font-sans text-[0.95em]">
       <div className={isShortOptions ? "flex flex-wrap gap-x-6 gap-y-1" : "grid grid-cols-2 gap-x-4 gap-y-1"}>
        {q.options.map((opt, oIdx) => (
         <div key={oIdx} className="flex gap-2 items-baseline p-0.5">
          <span className="font-bold shrink-0">({String.fromCharCode(65 + oIdx)})</span>
          <span className="leading-tight" dangerouslySetInnerHTML={{ __html: opt }} />
         </div>
        ))}
       </div>
      </div>
     )}

     {showSolutions && (
      <div className="mt-2 p-2 bg-amber-50 border-l-2 border-amber-400 font-sans text-[0.9em] italic rounded-r">
       <span className="font-bold text-amber-800 mr-2 text-[10px] uppercase">Ans:</span>
       <span dangerouslySetInnerHTML={{ __html: q.solution }} />
      </div>
     )}
    </div>
   </div>
  </div>
 );
};
