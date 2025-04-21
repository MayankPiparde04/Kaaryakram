import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-primary">
                  <Image
                    src="/logo.png"
                    alt="Kaaryakram Logo"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                  />
                </div>

                <div className="relative h-12 w-32 font-bold">
                  <Image
                    src="/Hindi_Name.png"
                    alt="About Kaaryakram"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                  />
                </div>

                {/* <span className="text-xl font-bold tracking-tight">Kaaryakram</span> */}
              </Link>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting devotees with authentic poojas, quality samagri, and
              experienced pandits for your spiritual journey.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Explore</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Join Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/join/pandit"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Become a Pandit
                  </Link>
                </li>
                <li>
                  <Link
                    href="/join/delivery"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Delivery Partner
                  </Link>
                </li>
                <li>
                  <Link
                    href="/join/darkstore"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Darkstore Owner
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                Email: contact@kaaryakram.com
              </li>
              <li className="text-sm text-muted-foreground">
                Phone: +91 98765 43210
              </li>
              <li className="text-sm text-muted-foreground">
                Address: 123 Temple Street, Spiritual District, India
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kaaryakram. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
