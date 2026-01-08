
import Link from 'next/link';
import { GRADE_SUBJECTS } from '../../../lib/flashcardData';

export default async function SubjectSelection({ params }) {
  const { grade } = await params;
  const subjects = GRADE_SUBJECTS[grade] || [];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/grades" className="text-slate-400 hover:text-white mb-8 inline-block transition">
          &larr; Back to Grades
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Grade <span className="text-blue-400">{grade}</span> Subjects
        </h1>
        <p className="text-slate-400 mb-12">Select a subject to view chapters.</p>

        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Link key={subject} href={`/grades/${grade}/${subject.toLowerCase()}`}>
                <div className="group bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-teal-400 hover:bg-slate-750 transition cursor-pointer shadow-lg">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-400 transition">
                    {subject}
                  </h3>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">View Chapters</span>
                    <span className="bg-slate-700 text-teal-400 p-2 rounded-full group-hover:bg-teal-400 group-hover:text-slate-900 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p>We are adding subjects for Grade {grade}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
