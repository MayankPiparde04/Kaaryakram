"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  Package,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-primary">
            <Image
              src="/logo.png"
              alt="Kaaryakram Logo"
              layout="fill"
              objectFit="cover"
              className="object-cover"
            />
          </div>

          <div className="relative h-14 w-56 font-bold mt-2">
            <Image
              src="/English_Name.png"
              alt="About Kaaryakram"
              layout="fill"
              objectFit="cover"
              className="object-cover"
            />
          </div>

          {/* <span className="text-xl font-bold tracking-tight">Kaaryakram</span> */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/" ? "text-primary" : ""
                }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/shop" ? "text-primary" : ""
                }`}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/about" ? "text-primary" : ""
                }`}
              >
                About
              </Link>

              {/* Only show Join Us if user doesn't have a role */}
              {!user.role && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Join Us
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/join/pandit">Become a Pandit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/join/delivery">
                        Become a Delivery Partner
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/join/darkstore">
                        Become a Darkstore Owner
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Dashboard link based on role */}
              {user.role && (
                <Link
                  href={`/dashboard/${user.role.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.includes("/dashboard") ? "text-primary" : ""
                  }`}
                >
                  Dashboard
                </Link>
              )}

              {/* Admin link if user is admin */}
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.includes("/admin") ? "text-primary" : ""
                  }`}
                >
                  Admin
                </Link>
              )}
            </>
          ) : null}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {user ? (
            <>
              {/* Cart Link */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" aria-label="Shopping cart">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {user && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" aria-label="Shopping cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container flex flex-col space-y-3 py-4">
            {user ? (
              <>
                <Link
                  href="/"
                  className={`px-2 py-1.5 text-sm font-medium ${
                    pathname === "/" ? "text-primary" : ""
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className={`px-2 py-1.5 text-sm font-medium ${
                    pathname === "/shop" ? "text-primary" : ""
                  }`}
                >
                  Shop
                </Link>
                <Link
                  href="/about"
                  className={`px-2 py-1.5 text-sm font-medium ${
                    pathname === "/about" ? "text-primary" : ""
                  }`}
                >
                  About
                </Link>

                {/* Only show Join Us if user doesn't have a role */}
                {!user.role && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium">
                      Join Us
                    </div>
                    <Link href="/join/pandit" className="px-4 py-1.5 text-sm">
                      Become a Pandit
                    </Link>
                    <Link href="/join/delivery" className="px-4 py-1.5 text-sm">
                      Become a Delivery Partner
                    </Link>
                    <Link
                      href="/join/darkstore"
                      className="px-4 py-1.5 text-sm"
                    >
                      Become a Darkstore Owner
                    </Link>
                  </>
                )}

                {/* Dashboard link based on role */}
                {user.role && (
                  <Link
                    href={`/dashboard/${user.role.toLowerCase()}`}
                    className={`px-2 py-1.5 text-sm font-medium ${
                      pathname.includes("/dashboard") ? "text-primary" : ""
                    }`}
                  >
                    Dashboard
                  </Link>
                )}

                {/* Admin link if user is admin */}
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className={`px-2 py-1.5 text-sm font-medium ${
                      pathname.includes("/admin") ? "text-primary" : ""
                    }`}
                  >
                    Admin
                  </Link>
                )}

                <Link
                  href="/profile"
                  className="px-2 py-1.5 text-sm font-medium"
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="px-2 py-1.5 text-sm font-medium"
                >
                  Orders
                </Link>
                <button
                  onClick={logout}
                  className="px-2 py-1.5 text-sm font-medium text-left text-destructive"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="w-full justify-start">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full justify-start">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
