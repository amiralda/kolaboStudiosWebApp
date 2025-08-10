'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, MapPin, Phone, Mail } from 'lucide-react'
import { format } from 'date-fns'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shootType: '',
    message: ''
  })
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form submitted:', {
      ...formData,
      preferredDate: selectedDate
    })
    
    // Reset form
    setFormData({ name: '', email: '', shootType: '', message: '' })
    setSelectedDate(undefined)
    setIsSubmitting(false)
    
    alert('Thank you for your inquiry! We\'ll get back to you within 24 hours.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-sora">Let's Create Something Beautiful</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to capture your special moments? We'd love to hear about your vision and discuss how we can bring it to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 font-sora">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shootType" className="block text-sm font-medium mb-2">
                    Session Type *
                  </label>
                  <Select value={formData.shootType} onValueChange={(value) => setFormData(prev => ({ ...prev, shootType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="maternity">Maternity</SelectItem>
                      <SelectItem value="mini">Mini Session</SelectItem>
                      <SelectItem value="holiday">Holiday Mini</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preferred Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Tell Us About Your Vision *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Share details about your event, vision, style preferences, location ideas, or any questions you have..."
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 font-sora">Get In Touch</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-muted-foreground">
                    Based in South Jersey<br />
                    Serving NJ, PA, NY & beyond
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">hello@kolabostudios.com</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4 font-sora">What Happens Next?</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</div>
                  <p>We'll respond to your inquiry within 24 hours</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</div>
                  <p>Schedule a consultation call to discuss your vision</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">3</div>
                  <p>Receive a custom proposal tailored to your needs</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">4</div>
                  <p>Book your session and start planning your perfect shoot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
