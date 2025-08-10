"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PhotoGalleryManager } from "@/components/photo-gallery-manager"
import { BarChart3, Users, Mail, Camera, DollarSign, Calendar, TrendingUp, Settings, Upload } from "lucide-react"

interface DashboardStats {
  totalContacts: number
  totalOrders: number
  totalRevenue: number
  totalPhotos: number
  recentContacts: Array<{
    id: string
    name: string
    email: string
    message: string
    createdAt: string
    status: string
  }>
  recentOrders: Array<{
    id: string
    customerName: string
    serviceType: string
    amount: number
    status: string
    createdAt: string
  }>
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - in a real app, this would come from your database
  const stats: DashboardStats = {
    totalContacts: 47,
    totalOrders: 23,
    totalRevenue: 12450,
    totalPhotos: 156,
    recentContacts: [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah@email.com",
        message: "Interested in wedding photography package...",
        createdAt: "2024-01-15T10:30:00Z",
        status: "new",
      },
      {
        id: "2",
        name: "Mike Chen",
        email: "mike@email.com",
        message: "Looking for engagement session pricing...",
        createdAt: "2024-01-14T15:45:00Z",
        status: "contacted",
      },
      {
        id: "3",
        name: "Emily Davis",
        email: "emily@email.com",
        message: "Maternity photo session inquiry...",
        createdAt: "2024-01-13T09:20:00Z",
        status: "new",
      },
    ],
    recentOrders: [
      {
        id: "1",
        customerName: "Jessica Wilson",
        serviceType: "Basic Retouch",
        amount: 150,
        status: "completed",
        createdAt: "2024-01-12T14:30:00Z",
      },
      {
        id: "2",
        customerName: "David Brown",
        serviceType: "Premium Retouch",
        amount: 300,
        status: "processing",
        createdAt: "2024-01-11T11:15:00Z",
      },
    ],
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-sora">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your photography business</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContacts}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +15% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPhotos}</div>
                <p className="text-xs text-muted-foreground">
                  <Upload className="h-3 w-3 inline mr-1" />
                  +23 this week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Recent Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentContacts.map((contact) => (
                    <div key={contact.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{contact.name}</p>
                          <Badge className={`text-xs ${getStatusColor(contact.status)}`}>{contact.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{contact.email}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">{formatDate(contact.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{order.customerName}</p>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.serviceType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">${order.amount}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <Tabs defaultValue="weddings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="weddings">Weddings</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="maternity">Maternity</TabsTrigger>
              <TabsTrigger value="minis">Mini Sessions</TabsTrigger>
            </TabsList>

            <TabsContent value="weddings">
              <PhotoGalleryManager category="weddings" title="Wedding Photos" />
            </TabsContent>

            <TabsContent value="engagement">
              <PhotoGalleryManager category="engagement" title="Engagement Photos" />
            </TabsContent>

            <TabsContent value="maternity">
              <PhotoGalleryManager category="maternity" title="Maternity Photos" />
            </TabsContent>

            <TabsContent value="minis">
              <PhotoGalleryManager category="minis" title="Mini Session Photos" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Management</CardTitle>
              <p className="text-sm text-muted-foreground">Manage customer inquiries and communications</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">Contact management coming soon</p>
                <p className="text-sm text-muted-foreground">
                  This will show all contact form submissions and allow you to manage them
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <p className="text-sm text-muted-foreground">Manage retouch service orders and payments</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">Order management coming soon</p>
                <p className="text-sm text-muted-foreground">
                  This will show all orders and allow you to manage their status
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
