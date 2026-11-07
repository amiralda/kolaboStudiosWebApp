'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDesktopGalleriesOpen, setIsDesktopGalleriesOpen] = useState(false)
  const [isMobileGalleriesOpen, setIsMobileGalleriesOpen] = useState(false)
  const pathname = usePathname()

  // Whenever the page changes, close every menu. This stops the Galleries
  // dropdown from getting stuck open after visiting another menu item.
  useEffect(() => {
    setIsDesktopGalleriesOpen(false)
    setIsMobileGalleriesOpen(false)
    setIsOpen(false)
  }, [pathname])

  const galleryItems = [
    { href: '/galleries/weddings', label: 'Weddings' },
    { href: '/galleries/engagement', label: 'Engagement' },
    { href: '/galleries/maternity', label: 'Maternity' },
    { href: '/galleries/portrait', label: 'Portrait' },
    { href: '/galleries/minis', label: 'Minis' },
    { href: '/galleries/holiday-minis', label: 'Holiday Minis' },
  ]

  const closeMobileMenu = () => {
    setIsOpen(false)
    setIsMobileGalleriesOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
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
            
            {/* Galleries Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDesktopGalleriesOpen(true)}
              onMouseLeave={() => setIsDesktopGalleriesOpen(false)}
            >
              <button
                className="flex items-center text-black hover:text-primary transition-colors"
                onClick={() => setIsDesktopGalleriesOpen(!isDesktopGalleriesOpen)}
                aria-expanded={isDesktopGalleriesOpen}
              >
                Galleries
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isDesktopGalleriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDesktopGalleriesOpen && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    {galleryItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-black hover:text-primary hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDesktopGalleriesOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
              onClick={() => {
                setIsOpen(!isOpen)
                if (isOpen) setIsMobileGalleriesOpen(false)
              }}
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
              
              {/* Mobile Galleries Submenu */}
              <div>
                <button
                  onClick={() => setIsMobileGalleriesOpen(!isMobileGalleriesOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-black hover:text-primary transition-colors"
                  aria-expanded={isMobileGalleriesOpen}
                >
                  Galleries
                  <ChevronDown className={`h-4 w-4 transition-transform ${isMobileGalleriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMobileGalleriesOpen && (
                  <div className="pl-6 space-y-1">
                    {galleryItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

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
