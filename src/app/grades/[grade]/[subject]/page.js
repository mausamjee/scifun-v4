
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { academicData } from '../../../../lib/flashcardData';
import { ChevronLeft, BookOpen } from 'lucide-react';

export default function ChapterSelectionPage() {
  const params = useParams();
  const { grade, subject } = params;

  // Safety check: ensure grade/subject exists in data
  const gradeData = academicData[grade];
  const subjectData = gradeData ? gradeData[decodeURIComponent(subject).toLowerCase()] : null;

  if (!subjectData) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">No content found</h1>
            <p className="text-slate-400 mb-8">
                We couldn't find any chapters for {subject} (Grade {grade}).
            </p>
            <Link href={`/grades/${grade}`} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition">
                Back to Subjects
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <Link href={`/grades/${grade}`} className="items-center text-slate-400 hover:text-white mb-8 inline-flex transition gap-2">
          <ChevronLeft size={20} /> Back to Subjects
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2 capitalize">
          {decodeURIComponent(subject)} <span className="text-slate-500 text-2xl font-normal ml-2">Grade {grade}</span>
        </h1>
        <p className="text-slate-400 mb-12">Select a chapter to practice flashcards.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectData.map((chapter) => (
            <Link key={chapter.chapterId} href={`/grades/${grade}/${subject}/${chapter.chapterId}`}>
              <div className="group bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-blue-500 hover:bg-slate-750 transition cursor-pointer shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-700 p-3 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition">
                            {chapter.title}
                        </h3>
                        <p className="text-sm text-slate-500">{chapter.cards.length} cards</p>
                    </div>
                </div>
                <div className="bg-slate-900 text-slate-500 p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-400 transition">
                   <ChevronLeft size={16} className="rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
