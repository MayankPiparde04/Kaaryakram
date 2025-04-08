import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 min-w-screen bg-gradient-to-br from-orange-600/60 to-amber-500/60 backdrop-blur-md shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-1">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={20}
            priority
            className="object-contain"
          />
        </Link>

        {/* Desktop Login Button */}
        <div className="hidden md:flex pr-10 gap-2">
          <Link
            href="/auth/login"
            className="px-5 py-2 rounded-lg border border-gray-700 bg-transparent text-indigo-950 font-bold hover:bg-gray-900  hover:text-orange-600 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/joinus"
            className="px-5 py-2 rounded-lg border border-gray-700 bg-transparent text-indigo-950 font-bold hover:bg-gray-900  hover:text-orange-600 transition"
          >
            Join Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden block text-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center backdrop-blur-lg py-3 space-y-3 shadow-lg">
          <Link
            href="/auth/login"
            className="px-4 py-2 w-full text-center text-gray-800 hover:bg-gray-200 transition"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
