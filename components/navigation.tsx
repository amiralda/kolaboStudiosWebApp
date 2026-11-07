'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png?v=2"
              alt="Kolabo Studios"
              width={535}
              height={156}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-black hover:text-primary transition-colors"
            >
              Home
            </Link>

            <Link
              href="/galleries"
              className="text-black hover:text-primary transition-colors"
            >
              Galleries
            </Link>

            <Link
              href="/about"
              className="text-black hover:text-primary transition-colors"
            >
              About
            </Link>

            <Link
              href="/blog"
              className="text-black hover:text-primary transition-colors"
            >
              Blog
            </Link>

            <Link
              href="/faq"
              className="text-black hover:text-primary transition-colors"
            >
              FAQ
            </Link>

            <Link
              href="/pricing"
              className="text-black hover:text-primary transition-colors"
            >
              Pricing
            </Link>

            <Link
              href="/retouch-services"
              className="text-black hover:text-primary transition-colors"
            >
              Retouch Services
            </Link>

            <Link
              href="/contact"
              className="text-black hover:text-primary transition-colors"
            >
              Contact
            </Link>

            {/* Admin Link - Only show in development or for authenticated users */}
            {process.env.NODE_ENV === 'development' && (
              <Link
                href="/admin/orders"
                className="text-gray-500 hover:text-primary transition-colors text-sm"
              >
                Admin
              </Link>
            )}

            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/contact">Book Now</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-black hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                Home
              </Link>

              <Link
                href="/galleries"
                className="block px-3 py-2 text-black hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                Galleries
              </Link>

              <Link
                href="/about"
                className="block px-3 py-2 text-black hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                About
              </Link>

              <Link
                href="/blog"
                className="block px-3 py-2 text-black hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                Blog
              </Link>

              <Link
                href="/faq"
                className="block px-3 py-2 text-black hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                FAQ
              </Link>

              <Link
                href="/pricing"
                className="block px-3 py-2 text-black hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>

              <Link
                href="/retouch-services"
                className="block px-3 py-2 text-black hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                Retouch Services
              </Link>

              <Link
                href="/contact"
                className="block px-3 py-2 text-black hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>

              {process.env.NODE_ENV === 'development' && (
                <Link
                  href="/admin/orders"
                  className="block px-3 py-2 text-gray-500 hover:text-primary transition-colors text-sm"
                  onClick={closeMobileMenu}
                >
                  Admin
                </Link>
              )}
              
              <div className="px-3 py-2">
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/contact">Book Now</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
