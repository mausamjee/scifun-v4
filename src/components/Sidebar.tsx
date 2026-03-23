'use client';

import React from 'react';
import {
  PlusCircle,
  LayoutGrid,
  FileText,
  Settings,
  HelpCircle,
  GraduationCap,
  LogOut,
  FolderOpen,
  Beaker,
  Atom,
  Database,
  FileJson
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string; // Allow checking/merging classes if needed, though we manage most here
}

const NavItem = ({
  icon: Icon,
  label,
  href,
  active,
  onClick
}: {
  icon: any,
  label: string,
  href: string,
  active?: boolean,
  onClick?: () => void
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
        ? 'bg-blue-50 text-blue-600 shadow-sm'
        : 'text-slate-600 hover:bg-slate-50'
        }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span className="font-semibold text-sm">{label}</span>
    </Link>
  );
};

export const Sidebar = ({ isOpen, onClose, className }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Aside */}
      <aside className={`w-64 border-r border-slate-200 bg-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 no-print ${className || ''}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100 ring-4 ring-blue-50">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">ExamGenius</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Administrator</p>
            </div>
          </div>

          <nav className="space-y-2">
            <NavItem
              icon={PlusCircle}
              label="Create New Paper"
              href="/smartpaper/create-paper"
              active={pathname === '/smartpaper/create-paper'}
              onClick={onClose}
            />
            <NavItem
              icon={LayoutGrid}
              label="Dashboard"
              href="/smartpaper"
              active={pathname === '/smartpaper'}
              onClick={onClose}
            />
            <NavItem
              icon={Beaker}
              label="Chemistry"
              href="/smartpaper/chemistry"
              active={pathname === '/smartpaper/chemistry'}
              onClick={onClose}
            />
            <NavItem
              icon={Atom}
              label="Physics"
              href="/smartpaper/physics"
              active={pathname === '/smartpaper/physics'}
              onClick={onClose}
            />
            <NavItem
              icon={Database}
              label="Upload Question"
              href="/smartpaper/upload"
              active={pathname === '/smartpaper/upload'}
              onClick={onClose}
            />
            <NavItem
              icon={FileJson}
              label="Bulk Upload JSON"
              href="/smartpaper/upload-json"
              active={pathname === '/smartpaper/upload-json'}
              onClick={onClose}
            />
            <NavItem
              icon={Settings}
              label="Settings"
              href="#"
              onClick={onClose}
            />
            <NavItem
              icon={FolderOpen}
              label="My Papers"
              href="#"
              onClick={onClose}
            />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all w-full group">
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold text-sm">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
