'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, ExternalLink, Mail, Clock, CheckCircle, AlertCircle, Download, Upload } from 'lucide-react'

// Mock order data - in production, this would come from your database
const mockOrders = [
  {
    id: 'ord_1234567890',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    service: 'Standard Retouching',
    quantity: 5,
    amount: 125.00,
    status: 'awaiting_upload',
    paymentStatus: 'paid',
    createdAt: '2024-01-15T10:30:00Z',
    uploadUrl: null,
    deliveryUrl: null
  },
  {
    id: 'ord_0987654321',
    customerName: 'Mike Chen',
    customerEmail: 'mike@studio.com',
    service: 'Premium Retouching',
    quantity: 3,
    amount: 135.00,
    status: 'in_progress',
    paymentStatus: 'paid',
    createdAt: '2024-01-14T15:45:00Z',
    uploadUrl: 'https://wetransfer.com/downloads/abc123',
    deliveryUrl: null
  },
  {
    id: 'ord_1122334455',
    customerName: 'Emma Rodriguez',
    customerEmail: 'emma@photography.com',
    service: 'Basic Retouching',
    quantity: 10,
    amount: 150.00,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2024-01-13T09:15:00Z',
    uploadUrl: 'https://wetransfer.com/downloads/def456',
    deliveryUrl: 'https://wetransfer.com/downloads/ghi789'
  }
]

const statusColors = {
  'awaiting_upload': 'bg-yellow-100 text-yellow-800',
  'files_received': 'bg-blue-100 text-blue-800',
  'in_progress': 'bg-purple-100 text-purple-800',
  'ready_for_review': 'bg-orange-100 text-orange-800',
  'completed': 'bg-green-100 text-green-800',
  'delivered': 'bg-gray-100 text-gray-800'
}

export default function OrdersAdminPage() {
  const [orders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const sendUploadLink = (orderId: string, customerEmail: string) => {
    const uploadUrl = `${window.location.origin}/retouch-services/upload/${orderId}`
    
    // In production, this would send an actual email
    const subject = `Upload Your Photos - Order #${orderId}`
    const body = `Hi there!

Your payment has been processed successfully. Please upload your photos using the link below:

${uploadUrl}

Upload Guidelines:
- Use WeTransfer as guided on the page
- Include your order ID: ${orderId}
- Upload original, unedited files
- Maximum 20GB per transfer

We'll begin processing as soon as we receive your files.

Best regards,
Kolabo Studios Team`

    const mailtoUrl = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  const sendDeliveryNotification = (orderId: string, customerEmail: string, deliveryUrl: string) => {
    const subject = `Your Retouched Photos Are Ready - Order #${orderId}`
    const body = `Great news! Your retouched photos are ready for download.

Download Link: ${deliveryUrl}
Order ID: ${orderId}

Important Notes:
- Download expires in 7 days
- Please download all files promptly
- Contact us within 48 hours for any revisions

Thank you for choosing Kolabo Studios!

Best regards,
The Kolabo Studios Team`

    const mailtoUrl = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-sora mb-2">Order Management</h1>
          <p className="text-muted-foreground">Manage retouching orders and WeTransfer workflow</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders, customers, or emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="awaiting_upload">Awaiting Upload</SelectItem>
                  <SelectItem value="files_received">Files Received</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="ready_for_review">Ready for Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                        {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Customer:</span>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-muted-foreground">{order.customerEmail}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Service:</span>
                        <div className="font-medium">{order.service}</div>
                        <div className="text-muted-foreground">{order.quantity} images</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <div className="font-medium">${order.amount.toFixed(2)}</div>
                        <div className="text-muted-foreground">{order.paymentStatus}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <div className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {order.status === 'awaiting_upload' && (
                      <Button
                        size="sm"
                        onClick={() => sendUploadLink(order.id, order.customerEmail)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Upload Link
                      </Button>
                    )}

                    {order.uploadUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(order.uploadUrl!, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        View Upload
                      </Button>
                    )}

                    {order.status === 'completed' && !order.deliveryUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // In production, you'd create the WeTransfer delivery link here
                          const mockDeliveryUrl = 'https://wetransfer.com/downloads/delivery123'
                          sendDeliveryNotification(order.id, order.customerEmail, mockDeliveryUrl)
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Send Delivery
                      </Button>
                    )}

                    {order.deliveryUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(order.deliveryUrl!, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Delivery
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No orders have been placed yet.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
