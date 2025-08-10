'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Upload, ExternalLink, Copy, CheckCircle, Clock, FileImage, AlertCircle, Mail } from 'lucide-react'

interface WeTransferUploadGuideProps {
  orderId: string
  customerEmail: string
  onUploadConfirmed: () => void
}

export function WeTransferUploadGuide({ 
  orderId, 
  customerEmail, 
  onUploadConfirmed 
}: WeTransferUploadGuideProps) {
  const [uploadConfirmed, setUploadConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)

  const uploadEmail = 'uploads@kolabostudios.com'
  const uploadMessage = `Order ID: ${orderId}
Customer: ${customerEmail}
Service: Photo Retouching

Please process these photos for retouching according to the service specifications.`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openWeTransfer = () => {
    const params = new URLSearchParams({
      to: uploadEmail,
      subject: `Photo Upload - Order #${orderId}`,
      message: uploadMessage
    })
    
    window.open(`https://wetransfer.com/?${params.toString()}`, '_blank')
  }

  const handleUploadConfirmed = () => {
    setUploadConfirmed(true)
    onUploadConfirmed()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Your Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              We use WeTransfer for secure file transfers. Follow the steps below to upload your photos.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Click to Open WeTransfer</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This will open WeTransfer with pre-filled information for your order.
                </p>
                <Button onClick={openWeTransfer} className="bg-primary hover:bg-primary/90">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open WeTransfer
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Upload Your Files</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Select all photos you want retouched</p>
                  <p>• Maximum 20GB per transfer</p>
                  <p>• Supported: JPG, PNG, TIFF, PSD, RAW files</p>
                  <p>• Upload original, unedited files for best results</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Verify Transfer Details</h3>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Send to:</span>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-white px-2 py-1 rounded">{uploadEmail}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(uploadEmail)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Subject:</span>
                    <span className="text-sm">Photo Upload - Order #{orderId}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Message includes:</span>
                    <div className="text-xs text-muted-foreground mt-1">
                      Order ID, customer email, and service details
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Send Transfer</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Transfer" in WeTransfer to send your files. You'll receive a confirmation email.
                </p>
              </div>
            </div>
          </div>

          {!uploadConfirmed && (
            <div className="pt-4 border-t">
              <Button 
                onClick={handleUploadConfirmed}
                variant="outline" 
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                I've Sent My Files
              </Button>
            </div>
          )}

          {uploadConfirmed && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Great! We'll notify you once we receive your files and begin processing.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* File Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileImage className="h-5 w-5 mr-2" />
            File Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-green-700">✓ Recommended</h4>
              <ul className="text-sm space-y-1 text-green-600">
                <li>• High-resolution original files</li>
                <li>• RAW files when available</li>
                <li>• Unedited, straight from camera</li>
                <li>• Consistent file naming</li>
                <li>• Include all shots for context</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-red-700">✗ Avoid</h4>
              <ul className="text-sm space-y-1 text-red-600">
                <li>• Already heavily edited files</li>
                <li>• Low-resolution images</li>
                <li>• Screenshots or phone photos</li>
                <li>• Watermarked images</li>
                <li>• Corrupted or damaged files</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
