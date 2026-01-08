'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
             SF
           </div>
           <span className="text-xl font-bold text-gray-900">SciFun Education</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/courses" className="hover:text-blue-600 transition">Courses</Link>
          <Link href="/about" className="hover:text-blue-600 transition">About Us</Link>
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
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-4 text-sm font-medium shadow-lg absolute w-full left-0 top-full">
          <Link href="/courses" className="block text-gray-700 hover:text-blue-600">Courses</Link>
          <Link href="/about" className="block text-gray-700 hover:text-blue-600">About Us</Link>
          <Link href="/results" className="block text-gray-700 hover:text-blue-600">Results</Link>
          <Link href="/faculty" className="block text-gray-700 hover:text-blue-600">Faculty</Link>
          <Link href="/login" className="block bg-blue-600 text-white px-4 py-2 rounded-full text-center">Login</Link>
        </div>
      )}
    </header>
  )
}
