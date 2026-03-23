'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)

  const downloadCategories = [
    {
      title: "SSC MAHARASHTRA BOARD PAPERS.",
      links: [
        { name: "SSC Board Papers (English Medium)", href: "/ssc-board-papers/all" },
        { name: "SSC Board Papers (Marathi Medium)", href: "/ssc-board-papers/marathi" },
        { name: "SSC Board Papers (Semi English Medium)", href: "/ssc-board-papers/all" },
        { name: "SSC Board Papers (Hindi Medium)", href: "/ssc-board-papers/hindi" },
        { name: "SSC Board Papers (All Medium)", href: "/ssc-board-papers/all" },
      ]
    },
    {
      title: "HSC MAHARASHTRA BOARD PAPERS.",
      links: [
        { name: "12th Science Board Papers (English Medium)", href: "/hsc-board-papers/science" },
        { name: "12th Commerce Board Papers (English Medium)", href: "/hsc-board-papers/commerce" },
        { name: "12th Commerce Board Papers (Marathi Medium)", href: "/hsc-board-papers/commerce" },
        { name: "12th Arts Board Papers (English Medium)", href: "/hsc-board-papers/arts" },
        { name: "12th Arts Board Papers (Marathi Medium)", href: "/hsc-board-papers/arts" },
      ]
    }
  ];

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 print:hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
           <img src="/logobg.png" alt="SciFun Logo" className="w-10 h-10 object-contain" />
           <span className="text-xl font-bold text-gray-900">SciFun Education</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/courses" className="hover:text-blue-600 transition">Courses</Link>
          
          {/* Board Download Megamenu */}
          <div 
            className="relative group h-full py-2"
            onMouseEnter={() => setDownloadOpen(true)}
            onMouseLeave={() => setDownloadOpen(false)}
          >
            <button className="flex items-center gap-1 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full font-bold hover:bg-rose-100 transition">
              Board download <ChevronDown size={14} className={`transition-transform duration-200 ${downloadOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Mega Menu Content */}
            {downloadOpen && (
              <div className="absolute top-full left-0 mt-1 w-[600px] bg-white shadow-2xl rounded-2xl border border-gray-100 p-8 grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <h3 className="text-blue-800 font-black text-xs uppercase tracking-wider mb-4 border-b pb-2">SSC MAHARASHTRA BOARD PAPERS.</h3>
                  <ul className="space-y-3">
                    {downloadCategories[0].links.map((link, i) => (
                      <li key={i}>
                        <Link href={link.href} className="text-gray-500 hover:text-blue-600 text-[13px] block transition-colors">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-blue-800 font-black text-xs uppercase tracking-wider mb-4 border-b pb-2">HSC MAHARASHTRA BOARD PAPERS.</h3>
                  <ul className="space-y-3">
                    {downloadCategories[1].links.map((link, i) => (
                      <li key={i}>
                        <Link href={link.href} className="text-gray-500 hover:text-blue-600 text-[13px] block transition-colors">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>


          <Link href="/about" className="hover:text-blue-600 transition">About Us</Link>
          <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
          <Link href="/results" className="hover:text-blue-600 transition">Results</Link>
          <Link href="/faculty" className="hover:text-blue-600 transition">Faculty</Link>
        </nav>

        {/* Login Button */}
        <div className="hidden md:block">
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition">
            Login
          </Link>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden text-gray-700 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-white overflow-y-auto font-sans">
          {/* Mobile Menu Header */}
          <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <img src="/logobg.png" alt="SciFun Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-gray-900 font-sans tracking-tight">SciFun Education</span>
            </Link>
            <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-500">
              <X size={24} />
            </button>
          </div>

          <div className="px-6 py-6 flex flex-col gap-6">
            <Link href="/courses" className="text-slate-700 font-bold text-base hover:text-blue-600" onClick={() => setMenuOpen(false)}>Courses</Link>
            
            <div className="space-y-3 pt-1">
              <p className="text-rose-600 font-black uppercase text-[11px] tracking-wider">Board Downloads</p>
              <div className="pl-4 space-y-4">
                  <Link href="/ssc-board-papers/all" className="block text-slate-500 font-bold text-sm hover:text-blue-600" onClick={() => setMenuOpen(false)}>SSC MAHARASHTRA</Link>
                  <Link href="/hsc-board-papers/science" className="block text-slate-500 font-bold text-sm hover:text-blue-600" onClick={() => setMenuOpen(false)}>HSC MAHARASHTRA</Link>
              </div>
            </div>

            <div className="flex flex-col gap-5 pt-2 border-t border-gray-50">
              <Link href="/about" className="text-slate-700 font-bold text-base hover:text-blue-600" onClick={() => setMenuOpen(false)}>About Us</Link>
              <Link href="/contact" className="text-slate-700 font-bold text-base hover:text-blue-600" onClick={() => setMenuOpen(false)}>Contact Us</Link>
              <Link href="/results" className="text-slate-700 font-bold text-base hover:text-blue-600" onClick={() => setMenuOpen(false)}>Results</Link>
              <Link href="/faculty" className="text-slate-700 font-bold text-base hover:text-blue-600" onClick={() => setMenuOpen(false)}>Faculty</Link>
            </div>

            <div className="pt-4">
              <Link href="/login" 
                className="block bg-blue-600 text-white px-6 py-3.5 rounded-full text-center font-bold text-base shadow-lg shadow-blue-100 active:scale-95 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}

    </header>
  )
}

