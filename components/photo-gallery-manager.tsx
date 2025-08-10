"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/file-upload"
import { ImageIcon, Trash2, Eye, Download, FolderOpen, RefreshCw } from "lucide-react"

interface PhotoFile {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

interface PhotoGalleryManagerProps {
  category?: string
  title?: string
}

export function PhotoGalleryManager({
  category = "gallery",
  title = "Photo Gallery Manager",
}: PhotoGalleryManagerProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())

  const loadPhotos = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/files?folder=photos/${category}&limit=100`)
      const result = await response.json()

      if (result.success) {
        setPhotos(result.files)
      } else {
        setError(result.error || "Failed to load photos")
      }
    } catch (err) {
      console.error("Error loading photos:", err)
      setError("Failed to load photos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPhotos()
  }, [category])

  const handleUploadComplete = (uploadedFiles: any[]) => {
    console.log("Photos uploaded:", uploadedFiles)
    loadPhotos() // Refresh the photo list
  }

  const deletePhoto = async (photoUrl: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) {
      return
    }

    try {
      const response = await fetch(`/api/upload?url=${encodeURIComponent(photoUrl)}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPhotos((prev) => prev.filter((photo) => photo.url !== photoUrl))
        setSelectedPhotos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(photoUrl)
          return newSet
        })
      } else {
        const result = await response.json()
        setError(result.error || "Failed to delete photo")
      }
    } catch (err) {
      console.error("Delete error:", err)
      setError("Failed to delete photo")
    }
  }

  const togglePhotoSelection = (photoUrl: string) => {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(photoUrl)) {
        newSet.delete(photoUrl)
      } else {
        newSet.add(photoUrl)
      }
      return newSet
    })
  }

  const deleteSelectedPhotos = async () => {
    if (selectedPhotos.size === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedPhotos.size} selected photos?`)) {
      return
    }

    for (const photoUrl of selectedPhotos) {
      await deletePhoto(photoUrl)
    }

    setSelectedPhotos(new Set())
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                {title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Category: {category} • {photos.length} photos
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadPhotos} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              {selectedPhotos.size > 0 && (
                <Button variant="destructive" size="sm" onClick={deleteSelectedPhotos}>
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedPhotos.size})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Upload Section */}
      <FileUpload
        uploadType="photo"
        category={category}
        maxFiles={20}
        maxSize={50}
        acceptedFileTypes={["image/jpeg", "image/png", "image/webp", "image/tiff"]}
        onUpload={handleUploadComplete}
        title="Upload Photos"
        description={`Upload photos to the ${category} gallery`}
      />

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Photo Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Photo Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-muted-foreground">Loading photos...</span>
              </div>
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">No photos uploaded yet</p>
              <p className="text-sm text-muted-foreground">Upload some photos to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={photo.url} className="group relative">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => window.open(photo.url, "_blank")}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          const a = document.createElement("a")
                          a.href = photo.url
                          a.download = photo.pathname.split("/").pop() || "photo"
                          a.click()
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deletePhoto(photo.url)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedPhotos.has(photo.url)}
                        onChange={() => togglePhotoSelection(photo.url)}
                        className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(photo.size)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(photo.uploadedAt)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{photo.pathname.split("/").pop()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
