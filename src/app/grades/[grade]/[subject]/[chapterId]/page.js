
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { academicData } from '../../../../../lib/flashcardData';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function FlashcardPage() {
  const params = useParams();
  const { grade, subject, chapterId } = params;
  
  const [mounted, setMounted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (grade && subject && chapterId) {
        const gradeData = academicData[grade];
        const subjectData = gradeData ? gradeData[decodeURIComponent(subject).toLowerCase()] : null;
        if (subjectData) {
            const foundChapter = subjectData.find(c => c.chapterId === chapterId);
            if (foundChapter) {
                setCurrentChapter(foundChapter);
                setCards(foundChapter.cards);
            }
        }
    }
  }, [grade, subject, chapterId]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  if (!mounted) return null;

  if (!currentChapter || cards.length === 0) {
     if (currentChapter && cards.length === 0) {
         return (
             <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
                <div className="text-center md:max-w-md">
                    <h1 className="text-2xl font-bold mb-4">No cards in this chapter yet</h1>
                    <p className="text-slate-400 mb-8">
                        We're working on adding content for "{currentChapter.title}".
                    </p>
                    <Link href={`/grades/${grade}/${subject}`} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition">
                        Back to Chapters
                    </Link>
                </div>
              </div>
         )
     }
     return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
             <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
                <Link href={`/grades/${grade}/${subject}`} className="text-blue-400 hover:underline">
                    Back to Chapters
                </Link>
             </div>
        </div>
     );
  }

  // Helper to render math/text混合
  const renderContent = (content) => {
    if (!content) return "";
    const parts = content.split(/(\$[^$]+\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        return <InlineMath key={i} math={part.slice(1, -1)} />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <header className="p-4 border-b border-slate-800 flex items-center justify-between">
         <Link href={`/grades/${grade}/${subject}`} className="flex items-center text-slate-400 hover:text-white transition group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" />
            <span className="ml-1 hidden md:inline">Back to Chapters</span>
         </Link>
         <div className="text-center">
             <h1 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-1">
                {currentChapter.title}
             </h1>
             <p className="text-xs text-slate-500">
                {decodeURIComponent(subject)} &bull; Grade {grade}
             </p>
         </div>
         <div className="w-16"></div> {/* Spacer */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
        
        {/* Progress */}
        <div className="w-full max-w-2xl mb-6 flex items-center justify-between text-xs text-slate-500 font-medium uppercase tracking-widest">
            <span>Card {currentIndex + 1} / {cards.length}</span>
            <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full max-w-2xl h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Card Container */}
        <div className="perspective-1000 w-full max-w-2xl h-[350px] md:h-[450px] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={clsx(
                "relative w-full h-full text-center transition-all duration-700 transform-style-3d shadow-2xl rounded-3xl",
                isFlipped && "rotate-y-180"
            )}>
                
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-slate-800 border border-slate-700/50 rounded-3xl flex flex-col items-center justify-center p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                    <span className="absolute top-6 left-6 text-[10px] font-black tracking-widest text-blue-500/80 uppercase">Question</span>
                    <div className="text-xl md:text-3xl font-medium leading-relaxed font-serif text-slate-100">
                        {renderContent(currentCard.question)}
                    </div>
                     <span className="absolute bottom-6 text-xs text-slate-600 font-medium flex items-center gap-2">
                        Click card to flip <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                     </span>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white text-slate-900 rounded-3xl flex flex-col items-center justify-center p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.2)]">
                    <span className="absolute top-6 left-6 text-[10px] font-black tracking-widest text-blue-600 uppercase">Answer</span>
                    <div className="text-lg md:text-2xl font-medium leading-relaxed text-slate-800">
                        {renderContent(currentCard.answer)}
                    </div>
                </div>

            </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-center gap-4 md:gap-8">
            <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                disabled={currentIndex === 0}
                className="p-4 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-800 disabled:cursor-not-allowed transition border border-slate-700"
            >
                <ChevronLeft size={24} />
            </button>

            <button 
                onClick={(e) => { e.stopPropagation(); handleShuffle(); }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition font-medium text-sm text-slate-400 hover:text-blue-400"
            >
                <Shuffle size={16} />
                <span className="hidden md:inline">Shuffle</span>
            </button>

            <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                disabled={currentIndex === cards.length - 1}
                className="p-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-500/20 transform hover:scale-105"
            >
                <ChevronRight size={24} />
            </button>
        </div>

      </main>
    </div>
  );
}
