import React, { useEffect, useState } from 'react';
import { QuestionItem } from './QuestionItem';

// The "DOM Stamping" Approach: hardcode 15 watermarks exactly 297mm apart
const WatermarkStamps = ({ config, contentRef }) => {
  const [pages, setPages] = useState(1);
  const A4_HEIGHT_MM = 297;
  const size = config.watermarkSize || 40;

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const widthPx = entry.contentRect.width; // This corresponds to 210mm
        const heightPx = entry.contentRect.height;
        if (widthPx > 0) {
          const pageHeightPx = widthPx * (297 / 210);
          const computedPages = Math.max(1, Math.ceil(heightPx / pageHeightPx));
          setPages(computedPages);
        }
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [contentRef]);

  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden print:hidden" aria-hidden="true">
        {Array.from({ length: pages }).map((_, i) => (
          <React.Fragment key={i}>
            {/* Logo 1 for Screen Preview: Positioned at 25% of the page */}
            <div
              className="absolute select-none"
              style={{
                top: `${(i * A4_HEIGHT_MM) + (A4_HEIGHT_MM * 0.25) + (config.watermarkOffsetY || 0)}mm`,
                left: `calc(50% + ${config.watermarkOffsetX || 0}mm)`,
                transform: `translate(-50%, -50%) rotate(${config.watermarkRotation}deg)`,
                opacity: config.watermarkOpacity
              }}
            >
              {config.watermarkImage && config.watermarkImage.trim() !== '' ? (
                <img
                  src={config.watermarkImage}
                  alt="Watermark"
                  className="object-contain grayscale"
                  style={{
                    maxWidth: `${size * 3}mm`,
                    maxHeight: `${size * 3}mm`
                  }}
                />
              ) : config.watermark ? (
                <span
                  className="font-black text-black tracking-[0.1em] uppercase whitespace-nowrap leading-none font-sans"
                  style={{ fontSize: `${size * 2}pt` }}
                >
                  {config.watermark}
                </span>
              ) : null}
            </div>

            {/* Logo 2 for Screen Preview: Positioned at 75% of the page */}
            <div
              className="absolute select-none"
              style={{
                top: `${(i * A4_HEIGHT_MM) + (A4_HEIGHT_MM * 0.75) + (config.watermarkOffsetY || 0)}mm`,
                left: `calc(50% + ${config.watermarkOffsetX || 0}mm)`,
                transform: `translate(-50%, -50%) rotate(${config.watermarkRotation}deg)`,
                opacity: config.watermarkOpacity
              }}
            >
              {config.watermarkImage && config.watermarkImage.trim() !== '' ? (
                <img
                  src={config.watermarkImage}
                  alt="Watermark"
                  className="object-contain grayscale"
                  style={{
                    maxWidth: `${size * 3}mm`,
                    maxHeight: `${size * 3}mm`
                  }}
                />
              ) : config.watermark ? (
                <span
                  className="font-black text-black tracking-[0.1em] uppercase whitespace-nowrap leading-none font-sans"
                  style={{ fontSize: `${size * 2}pt` }}
                >
                  {config.watermark}
                </span>
              ) : null}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Bulletproof Top Watermark for Print Output ONLY (repeats on every page) */}
      <div
        className="hidden print:block fixed z-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          top: `calc(25% + ${config.watermarkOffsetY || 0}mm)`,
          left: `calc(50% + ${config.watermarkOffsetX || 0}mm)`,
          transform: `translate(-50%, -50%) rotate(${config.watermarkRotation}deg)`,
          opacity: config.watermarkOpacity
        }}
      >
        {config.watermarkImage && config.watermarkImage.trim() !== '' ? (
          <img
            src={config.watermarkImage}
            alt="Watermark"
            className="object-contain grayscale"
            style={{
              maxWidth: `${size * 3}mm`,
              maxHeight: `${size * 3}mm`
            }}
          />
        ) : config.watermark ? (
          <span
            className="font-black text-black tracking-[0.1em] uppercase whitespace-nowrap leading-none font-sans"
            style={{ fontSize: `${size * 2}pt` }}
          >
            {config.watermark}
          </span>
        ) : null}
      </div>

      {/* Bulletproof Bottom Watermark for Print Output ONLY (repeats on every page) */}
      <div
        className="hidden print:block fixed z-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
           top: `calc(75% + ${config.watermarkOffsetY || 0}mm)`,
           left: `calc(50% + ${config.watermarkOffsetX || 0}mm)`,
           transform: `translate(-50%, -50%) rotate(${config.watermarkRotation}deg)`,
           opacity: config.watermarkOpacity
        }}
      >
        {config.watermarkImage && config.watermarkImage.trim() !== '' ? (
          <img
            src={config.watermarkImage}
            alt="Watermark"
            className="object-contain grayscale"
            style={{
              maxWidth: `${size * 3}mm`,
              maxHeight: `${size * 3}mm`
            }}
          />
        ) : config.watermark ? (
          <span
            className="font-black text-black tracking-[0.1em] uppercase whitespace-nowrap leading-none font-sans"
            style={{ fontSize: `${size * 2}pt` }}
          >
            {config.watermark}
          </span>
        ) : null}
      </div>
    </>
  );
};

export const PaperPreview = ({
 paper,
 config,
 showSolutions,
 onEditQuestion
 }) => {
  const paperRef = React.useRef(null);

 useEffect(() => {
  const timer = setTimeout(() => {
   const win = window;
   if (win.MathJax && win.MathJax.typesetPromise) {
    win.MathJax.typesetPromise().catch((err) => console.error("MathJax error:", err));
   }
  }, 100);
  return () => clearTimeout(timer);
 }, [paper, showSolutions, config.fontSize]);

 const getRoman = (num) => {
  const map = { 0: 'i', 1: 'ii', 2: 'iii', 3: 'iv', 4: 'v', 5: 'vi', 6: 'vii', 7: 'viii', 8: 'ix', 9: 'x', 10: 'xi', 11: 'xii' };
  return map[num] || (num + 1).toString();
 };

 return (
  <div className="paper-container relative w-full flex justify-center overflow-hidden print:overflow-visible">
   <div className="scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.75] xl:scale-100 origin-top transition-transform duration-300 print:scale-100 print:transform-none">
    <div
     ref={paperRef}
     className="a4-paper bg-white shadow-2xl print:shadow-none font-serif leading-[1.3] relative overflow-hidden print:overflow-visible print:h-auto mx-auto"
     style={{
      fontSize: `${config.fontSize}pt`,
      width: '210mm',
      maxWidth: 'none',
      minHeight: '297mm',
      padding: '20mm'
     }}
    >

     {/* Watermark Rendering */}
     <WatermarkStamps config={config} contentRef={paperRef} />

     {/* Header */}
     <div className="relative z-10">
      <div className="flex justify-between text-[9px] text-slate-400 mb-2 border-b border-slate-100 pb-1 italic no-print">
       <span>Generated: {config.printTimestamp}</span>
       <span className="font-bold">{config.organizationName}</span>
      </div>

      <div className="text-center mb-6 border-b-2 border-double border-slate-900 pb-4">
       <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 leading-tight">{config.headerTitle}</h2>
       <h3 className="text-xl font-black uppercase mb-3">{config.subject}</h3>
       <div className="flex justify-between items-end text-[11pt] font-black border-t-2 border-slate-900 pt-3 px-2">
        <div className="text-left space-y-1">
         <p>Time: {config.timeAllowed}</p>
         <p>Date: {config.testDate}</p>
        </div>
        <div className="text-right">
         {/* Only show max marks if not past year or if calculated */}
         <p>Max. Marks: {paper.totalMarks}</p>
        </div>
       </div>
      </div>
     </div>

     {/* Content */}
     <div className="space-y-4">
      {(() => {
       let mainQCounter = 3; // Start from Q.3 for Section B onwards

       return paper.sections.map((section, sectionIdx) => {
        const isMCQ = section.type === 'MCQ' || section.name.includes('MCQ');
        const isVSA = section.type === 'VSA' || section.name.includes('VSA');
        const isSectionA = isMCQ || isVSA;

        // Determine Headers
        let sectionTitle = "";
        let showSectionHeader = false;
        let subQuestionHeader = null;

        const isBoardPaper = config.mode === 'past_year';

        if (isMCQ) {
          sectionTitle = isBoardPaper ? "SECTION 1" : "SECTION - A";
          showSectionHeader = !isBoardPaper; // Only centered for normal generator
          subQuestionHeader = "Q.1 Select and write the correct answer for the following questions:";
        } else if (isVSA) {
          showSectionHeader = false;
          subQuestionHeader = "Q.2 Answer the following questions:";
        } else {
          // Sections B, C, D (or 2, 3, 4)
          if (isBoardPaper) {
            const typeMap = { SA_2: '2', SA_3: '3', LA_4: '4' };
            const sectionNum = typeMap[section.type] || (sectionIdx + 1).toString();
            sectionTitle = `SECTION ${sectionNum}`;
            showSectionHeader = false;
          } else {
            const nameParts = section.name.split('-');
            sectionTitle = nameParts[0].trim().toUpperCase();
            const prevSection = paper.sections[sectionIdx - 1];
            const prevTitle = prevSection?.name.split('-')[0].trim().toUpperCase();
            showSectionHeader = sectionTitle !== prevTitle;
          }
        }

        return (
          <div key={section.name + sectionIdx} className="relative mb-4">

            {/* Section Header (Centered) */}
            {showSectionHeader && (
              <div className="text-center mb-2 mt-4">
                <h4 className="inline-block text-[1.2em] font-black tracking-[0.2em] border-y-2 border-slate-900 py-1 px-8 uppercase">
                  {sectionTitle}
                </h4>
              </div>
            )}

            {/* Sub-Group Header (Q.1 / Q.2) */}
            {subQuestionHeader && (
              <div className="mb-2 font-black text-[1.1em] pl-1 border-b border-slate-900 pb-1">
                {subQuestionHeader}
                <span className="float-right text-[0.9em]">[{section.requiredCount * section.marksPerQuestion}]</span>
              </div>
            )}

            {/* Ordinary Section Header (Section 2, 3, 4) */}
            {!isSectionA && (
              <div className="flex justify-between items-baseline mb-2 bg-slate-50/50 print:bg-transparent px-2 border-b border-slate-900 py-1">
                <div className="flex gap-3 items-baseline">
                  <span className="font-black text-[1.1em] tracking-tight">{sectionTitle}</span>
                  {/* description (Questions from 2025) removed per user request */}
                </div>
                <span className="font-black text-[1.1em] shrink-0">[{section.requiredCount * section.marksPerQuestion}]</span>
              </div>
            )}

          <div className="space-y-1">
           {section.questions.map((q, qIdx) => {
            // Numbering Logic
            let qLabel = "";
            if (isSectionA) {
             qLabel = `(${getRoman(qIdx)})`; // (i), (ii)...
            } else {
             qLabel = `Q.${mainQCounter++}.`;
            }

            return (
             <QuestionItem
              key={q.id}
              question={q}
              label={qLabel}
              showSolutions={showSolutions}
              config={{ ...config, showExamYear: isBoardPaper ? false : config.showExamYear }}
              onEdit={() => onEditQuestion(sectionIdx, qIdx, q)}
             />
            );
           })}
          </div>
         </div>
        );
       });
      })()}
     </div>

     <div className="mt-12 text-center text-slate-300 text-[10px] italic border-t border-slate-200 pt-6 flex justify-between items-center font-sans">
      <span className="font-bold underline">{config.organizationName}</span>
      <span className="tracking-[1em] uppercase font-black text-slate-400">--- End of Paper ---</span>
      <span className="font-bold">Page 1 of 1</span>
     </div>
    </div>
   </div>
  </div>
 );
};
