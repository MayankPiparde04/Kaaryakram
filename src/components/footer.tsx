import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 space-y-6 md:space-y-0">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start">
          <Image src="/Hindi_Name.png" alt="Logo" width={180} height={40} className="object-contain" />
          <p className="text-gray-400 text-sm mt-2 ml-4">Bringing Events to Life</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <Link href="/" className="hover:text-gray-400 transition">Home</Link>
          <Link href="/about" className="hover:text-gray-400 transition">About</Link>
          <Link href="/services" className="hover:text-gray-400 transition">Services</Link>
          <Link href="/contact" className="hover:text-gray-400 transition">Contact</Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <Link href="#" className="hover:text-gray-400 transition">
            <Facebook size={22} />
          </Link>
          <Link href="#" className="hover:text-gray-400 transition">
            <Twitter size={22} />
          </Link>
          <Link href="#" className="hover:text-gray-400 transition">
            <Instagram size={22} />
          </Link>
          <Link href="#" className="hover:text-gray-400 transition">
            <Linkedin size={22} />
          </Link>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} KaaryaKram. All rights reserved.
      </div>
    </footer>
  );
}