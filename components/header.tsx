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
  Search,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/components/cart-context"; // Import useCart hook
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { itemCount } = useCart(); // Get cart item count from context

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur shadow-sm" : "bg-background"
      } supports-[backdrop-filter]:bg-background/60`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            className="relative h-12 w-12 overflow-hidden rounded-full bg-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/logo.png"
              alt="Kaaryakram Logo"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </motion.div>

          <div className="relative h-14 w-56 font-bold mt-2 hidden sm:block">
            <Image
              src="/English_Name.png"
              alt="Kaaryakram"
              fill
              sizes="224px"
              className="object-cover"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                  pathname === "/" ? "text-primary" : ""
                }`}
              >
                Home
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                    pathname === "/" ? "w-full" : ""
                  }`}
                ></span>
              </Link>
              <Link
                href="/shop"
                className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                  pathname === "/shop" ? "text-primary" : ""
                }`}
              >
                Shop
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                    pathname === "/shop" ? "w-full" : ""
                  }`}
                ></span>
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                  pathname === "/about" ? "text-primary" : ""
                }`}
              >
                About
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                    pathname === "/about" ? "w-full" : ""
                  }`}
                ></span>
              </Link>

              {/* Only show Join Us if user doesn't have a role */}
              {/* {!user.role && ( */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-sm font-medium transition-colors hover:text-primary relative group"
                    >
                      Join Us
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/join/pandit"
                        className="flex items-center cursor-pointer"
                      >
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-xs">🕉️</span>
                        </div>
                        <span>Become a Pandit</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/join/delivery"
                        className="flex items-center cursor-pointer"
                      >
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-xs">🚚</span>
                        </div>
                        <span>Delivery Partner</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/join/darkstore"
                        className="flex items-center cursor-pointer"
                      >
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-xs">🏪</span>
                        </div>
                        <span>Darkstore Owner</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              {/* )} */}


              {/* Admin link if user is admin */}
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                    pathname.includes("/admin") ? "text-primary" : ""
                  }`}
                >
                  Admin
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                      pathname.includes("/admin") ? "w-full" : ""
                    }`}
                  ></span>
                </Link>
              )}
            </>
          ) : null}
        </nav>

        <div className="hidden md:flex items-center gap-1">
          {/* Search Button */}
          <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-1"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="w-screen h-auto flex items-center justify-center py-10"
            >
              <div className="w-full max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for poojas, samagri, services..."
                    className="pl-10 pr-10 h-12 text-lg"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground w-full mb-2">
                    Popular searches:
                  </p>
                  <Badge variant="secondary" className="cursor-pointer">
                    Satyanarayan Pooja
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer">
                    Griha Pravesh
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer">
                    Ganesh Pooja
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer">
                    Kumkum
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer">
                    Incense Sticks
                  </Badge>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="transition-transform hover:rotate-45"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {user ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                      2
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex justify-between items-center">
                    Notifications
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto text-xs"
                    >
                      Mark all as read
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    <DropdownMenuItem className="p-3 focus:bg-accent cursor-pointer">
                      <div className="flex gap-4 items-start">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Your order has been shipped
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            Order #KP12345 has been shipped and will arrive in
                            2-3 business days.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            10 minutes ago
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 focus:bg-accent cursor-pointer">
                      <div className="flex gap-4 items-start">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Pandit confirmed your booking
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            Pandit Sharma has confirmed your Satyanarayan Pooja
                            booking.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            1 hour ago
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="focus:bg-accent cursor-pointer justify-center">
                    <Link
                      href="/notifications"
                      className="w-full text-center text-primary text-sm"
                    >
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart Link with dynamic item count */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Shopping cart"
                  className="relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 p-0.5 transition-transform hover:scale-110"
                  >
                    <Avatar className="h-full w-full border-2 border-primary/20">
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium line-clamp-1">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/order" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="text-sm font-medium">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

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
              <Button
                variant="ghost"
                size="icon"
                aria-label="Shopping cart"
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isMenuOpen ? "close" : "menu"}
                initial={{ opacity: 0, rotate: isMenuOpen ? -90 : 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: isMenuOpen ? 90 : -90 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden border-t divide-y divide-border"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container py-4">
              {user ? (
                <div className="flex items-center gap-3 py-2 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.image || ""}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ) : null}

              <nav className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-1">
                    Navigation
                  </p>
                  {user ? (
                    <div className="space-y-1">
                      <Link
                        href="/"
                        className={`flex items-center px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          pathname === "/"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        Home
                      </Link>
                      <Link
                        href="/shop"
                        className={`flex items-center px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          pathname === "/shop"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        Shop
                      </Link>
                      <Link
                        href="/about"
                        className={`flex items-center px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          pathname === "/about"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        About
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <Link href="/login" className="w-full">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          Log In
                        </Button>
                      </Link>
                      <Link href="/register" className="w-full">
                        <Button className="w-full justify-start">Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </div>

                {user && (
                  <>
                    {/* Only show Join Us if user doesn't have a role */}
                    {!user.role && (
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-1">
                          Join Us
                        </p>
                        <div className="space-y-1">
                          <Link
                            href="/join/pandit"
                            className="flex items-center gap-3 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                          >
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs">🕉️</span>
                            </div>
                            Become a Pandit
                          </Link>
                          <Link
                            href="/join/delivery"
                            className="flex items-center gap-3 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                          >
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs">🚚</span>
                            </div>
                            Become a Delivery Partner
                          </Link>
                          <Link
                            href="/join/darkstore"
                            className="flex items-center gap-3 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                          >
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs">🏪</span>
                            </div>
                            Become a Darkstore Owner
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Dashboard/Admin links */}
                    {(user.role || user.isAdmin) && (
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-1">
                          Manage
                        </p>
                        <div className="space-y-1">
                          {user.role && (
                            <Link
                              href={`/dashboard/${user.role.toLowerCase()}`}
                              className={`flex items-center px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                pathname.includes("/dashboard")
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-accent"
                              }`}
                            >
                              Dashboard
                            </Link>
                          )}
                          {user.isAdmin && (
                            <Link
                              href="/admin"
                              className={`flex items-center px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                pathname.includes("/admin")
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-accent"
                              }`}
                            >
                              Admin Panel
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Account links */}
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-1">
                        Account
                      </p>
                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                        >
                          <Package className="h-4 w-4 text-muted-foreground" />
                          Orders
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 w-full text-left px-2 py-1.5 text-sm font-medium rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Sheet for mobile */}
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent
          side="top"
          className="w-screen h-auto flex items-center justify-center py-10"
        >
          <div className="w-full max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for poojas, samagri, services..."
                className="pl-10 pr-10 h-12 text-lg"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <p className="text-sm text-muted-foreground w-full mb-2">
                Popular searches:
              </p>
              <Badge variant="secondary" className="cursor-pointer">
                Satyanarayan Pooja
              </Badge>
              <Badge variant="secondary" className="cursor-pointer">
                Griha Pravesh
              </Badge>
              <Badge variant="secondary" className="cursor-pointer">
                Ganesh Pooja
              </Badge>
              <Badge variant="secondary" className="cursor-pointer">
                Kumkum
              </Badge>
              <Badge variant="secondary" className="cursor-pointer">
                Incense Sticks
              </Badge>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
