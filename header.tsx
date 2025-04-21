"use client"

import { Menu, X, Mountain } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Mountain className="h-6 w-6" />
          <span className="text-lg font-bold">Acme Inc</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Services
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Products
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm">
            Log In
          </Button>
          <Button size="sm">Sign Up</Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container flex flex-col space-y-4 py-4 px-4">
            <Link href="#" className="text-sm font-medium py-2 hover:underline underline-offset-4" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="#" className="text-sm font-medium py-2 hover:underline underline-offset-4" onClick={toggleMenu}>
              About
            </Link>
            <Link href="#" className="text-sm font-medium py-2 hover:underline underline-offset-4" onClick={toggleMenu}>
              Services
            </Link>
            <Link href="#" className="text-sm font-medium py-2 hover:underline underline-offset-4" onClick={toggleMenu}>
              Products
            </Link>
            <Link href="#" className="text-sm font-medium py-2 hover:underline underline-offset-4" onClick={toggleMenu}>
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" className="w-full">
                Log In
              </Button>
              <Button className="w-full">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
