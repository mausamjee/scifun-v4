
import Link from 'next/link';

const grades = ["8", "9", "10", "11", "12"];

export default function GradeSelection() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          Select Your Grade
        </h1>
        <p className="text-slate-400 mb-12">Choose a grade to categorize your learning materials.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {grades.map((grade) => (
            <Link key={grade} href={`/grades/${grade}`}>
              <div className="group relative bg-slate-800 rounded-2xl p-6 hover:bg-slate-700 transition cursor-pointer border border-slate-700 hover:border-blue-500 shadow-lg hover:shadow-blue-500/20">
                <div className="absolute inset-0 bg-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition"></div>
                <div className="text-5xl font-extrabold text-blue-500 mb-2 group-hover:scale-110 transition duration-300">
                  {grade}
                </div>
                <div className="text-sm font-medium text-slate-300 uppercase tracking-wider">Grade</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
