'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, ImageIcon, Trash2, Edit } from 'lucide-react'

export default function AdminPanel() {
  const [selectedCategory, setSelectedCategory] = useState('weddings')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const categories = [
    { id: 'weddings', label: 'Weddings' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'maternity', label: 'Maternity' },
    { id: 'minis', label: 'Mini Sessions' },
    { id: 'holiday-minis', label: 'Holiday Minis' },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const handlePhotoSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // This would integrate with your CMS/backend
    console.log('Uploading photos to category:', selectedCategory)
    console.log('Files:', uploadedFiles)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-sora">Gallery Management</h1>
          <p className="text-muted-foreground">Upload and manage your photography portfolio</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Photos</TabsTrigger>
            <TabsTrigger value="manage">Manage Photos</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePhotoSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gallery Category
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Photos
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Drag and drop your photos here, or click to browse
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                          Choose Files
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Files Preview */}
                  {uploadedFiles.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        Selected Files ({uploadedFiles.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="relative">
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-xs text-center mt-1 truncate">
                              {file.name}
                            </p>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => {
                                setUploadedFiles(prev => prev.filter((_, i) => i !== index))
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata Form */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Photo Title (Optional)
                      </label>
                      <Input placeholder="Enter photo title" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location (Optional)
                      </label>
                      <Input placeholder="Photo location" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description (Optional)
                    </label>
                    <Textarea 
                      placeholder="Photo description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tags (Optional)
                    </label>
                    <Input placeholder="Enter tags separated by commas" />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Upload Photos
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Existing Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Select defaultValue="weddings">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Bulk Edit
                    </Button>
                  </div>

                  <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="mx-auto h-12 w-12 mb-4" />
                    <p>Photo management interface will be displayed here</p>
                    <p className="text-sm">Connect to your CMS to manage existing photos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Gallery Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Category Management</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <span>{category.label}</span>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="mt-4" variant="outline">
                      Add New Category
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Photos per page (Infinite Scroll)
                        </label>
                        <Select defaultValue="12">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
