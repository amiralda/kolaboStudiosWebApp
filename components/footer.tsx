'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Contact form submitted:', formData)
    // Reset form
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-6 font-sora">Get In Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <Textarea
                name="message"
                placeholder="Tell us about your vision..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <div className="space-y-2">
                <Button type="submit" disabled={status === 'submitting'} className="bg-primary hover:bg-primary/90 w-full">
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </Button>
                {status === 'success' && (
                  <p className="text-sm text-emerald-300">Message sent. We’ll reply within 24 hours.</p>
                )}
                {submissionError && (
                  <p className="text-sm text-red-300">{submissionError}</p>
                )}
              </div>
            </form>
          </div>

          {/* Contact Info & Social */}
          <div>
            <h3 className="text-2xl font-bold mb-6 font-sora">Kolabo Studios</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <span>South Jersey</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary" />
                <span>(856) 595-5203</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary" />
                <span>hello@kolabostudios.com</span>
              </div>
            </div>

            <div className="flex space-x-4 mb-8">
              <Link href="https://instagram.com/kolabostudios" className="text-white hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="https://facebook.com/kolabostudios" className="text-white hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
            </div>

            <div className="text-sm text-white/60">
              <p>&copy; 2025 Kolabo Studios. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
