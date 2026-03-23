'use client';

import Link from 'next/link';
import { Beaker, Atom, Upload, Layout, FileText, Home, FileJson } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';

const DashboardCard = ({ icon: Icon, title, file, href, color = "blue" }: any) => {
  const colorMap: any = {
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-100",
    pink: "bg-pink-600 hover:bg-pink-700 shadow-pink-100",
    indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100",
    slate: "bg-slate-800 hover:bg-slate-900 shadow-slate-100"
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col group hover:-translate-y-1 transition-all duration-300">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${color === 'pink' ? 'bg-pink-50' : color === 'indigo' ? 'bg-indigo-50' : 'bg-blue-50'}`}>
        <Icon className={`w-6 h-6 ${color === 'pink' ? 'text-pink-600' : color === 'indigo' ? 'text-indigo-600' : 'text-blue-600'}`} />
      </div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-400 mb-8 font-bold text-[10px] uppercase tracking-widest">{file}</p>
      <div className="mt-auto">
        <Link
          href={href}
          className={`inline-block px-8 py-3 text-white font-black rounded-2xl transition-all shadow-lg ${colorMap[color]}`}
        >
          Open Link
        </Link>
      </div>
    </div>
  );
};

export default function ReviewDashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-6 md:p-12 md:ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">App Control Center</h1>
            <p className="text-slate-400 font-bold text-lg uppercase tracking-wider">Quick access to all modules</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DashboardCard
              icon={Home}
              title="Landing Page"
              file="src/app/landing-page/page.tsx"
              href="/landing-page"
              color="blue"
            />
            <DashboardCard
              icon={Layout}
              title="Blueprint Flow"
              file="src/app/create-paper/page.tsx"
              href="/smartpaper/create-paper"
              color="blue"
            />
            <DashboardCard
              icon={FileText}
              title="Old Dashboard"
              file="src/app/generator/page.tsx"
              href="/smartpaper/generator"
              color="slate"
            />
            <DashboardCard
              icon={Beaker}
              title="Chemistry"
              file="src/app/chemistry/page.tsx"
              href="/smartpaper/chemistry"
              color="pink"
            />
            <DashboardCard
              icon={Atom}
              title="Physics"
              file="src/app/physics/page.tsx"
              href="/smartpaper/physics"
              color="indigo"
            />
            <DashboardCard
              icon={Upload}
              title="Question Uploader"
              file="src/app/upload/page.tsx"
              href="/smartpaper/upload"
              color="blue"
            />
            <DashboardCard
              icon={FileJson}
              title="Bulk JSON Upload"
              file="src/app/upload-json/page.tsx"
              href="/smartpaper/upload-json"
              color="indigo"
            />
          </div>

          <div className="mt-16 p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white shadow-2xl shadow-blue-200">
            <h3 className="text-2xl font-black mb-4">Project Update</h3>
            <p className="opacity-90 leading-relaxed font-bold text-lg max-w-2xl">
              Maine saare requested routes create kar diye hain. Chemistry aur Physics par abhi "Working in Progress" status hai.
              Question Uploader tool fully functional hai aur direct Supabase se connected hai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
