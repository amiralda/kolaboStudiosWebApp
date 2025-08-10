"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, X, FileImage, CheckCircle, AlertCircle, Trash2, Eye } from "lucide-react"

interface FileUploadProps {
  onUpload?: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedFileTypes?: string[]
  uploadType?: "photo" | "client" | "general"
  category?: string
  orderId?: string
  title?: string
  description?: string
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
  uploadedAt?: string
}

export function FileUpload({
  onUpload,
  maxFiles = 10,
  maxSize = 50,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp", "image/tiff"],
  uploadType = "general",
  category = "general",
  orderId,
  title = "Upload Files",
  description,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalProgress, setTotalProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null)

      // Check file count limit
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      // Create initial file objects
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2),
        name: file.name,
        size: file.size,
        type: file.type,
        url: "",
        status: "uploading" as const,
        progress: 0,
        uploadedAt: new Date().toISOString(),
      }))

      setFiles((prev) => [...prev, ...newFiles])
      setIsUploading(true)

      let completedUploads = 0

      // Upload files one by one
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        const fileId = newFiles[i].id

        try {
          // Update progress to show upload starting
          setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: 10 } : f)))

          // Create form data
          const formData = new FormData()
          formData.append("file", file)
          formData.append("type", uploadType)
          if (category) formData.append("category", category)
          if (orderId) formData.append("orderId", orderId)

          // Simulate progress updates
          const progressInterval = setInterval(() => {
            setFiles((prev) =>
              prev.map((f) => {
                if (f.id === fileId && f.progress < 90) {
                  return { ...f, progress: f.progress + 10 }
                }
                return f
              }),
            )
          }, 200)

          // Upload file
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          clearInterval(progressInterval)

          const result = await response.json()

          if (!response.ok) {
            throw new Error(result.error || "Upload failed")
          }

          // Update file with success
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: "success" as const,
                    progress: 100,
                    url: result.file.url,
                  }
                : f,
            ),
          )

          completedUploads++
        } catch (error) {
          console.error("Upload error:", error)

          // Update file with error
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: "error" as const,
                    progress: 0,
                    error: error instanceof Error ? error.message : "Upload failed",
                  }
                : f,
            ),
          )
        }

        // Update total progress
        setTotalProgress(((completedUploads + 1) / acceptedFiles.length) * 100)
      }

      setIsUploading(false)
      setTotalProgress(100)

      // Call onUpload callback with successful files
      const successfulFiles = files.filter((f) => f.status === "success")
      if (onUpload && successfulFiles.length > 0) {
        onUpload(successfulFiles)
      }

      // Reset total progress after a delay
      setTimeout(() => setTotalProgress(0), 2000)
    },
    [files, maxFiles, uploadType, category, orderId, onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    disabled: isUploading,
  })

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const retryUpload = async (fileId: string) => {
    const fileToRetry = files.find((f) => f.id === fileId)
    if (!fileToRetry) return

    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "uploading", progress: 0, error: undefined } : f)),
    )

    // In a real implementation, you'd need to store the original File object
    // For now, we'll just update the UI
  }

  const deleteFile = async (fileId: string, fileUrl: string) => {
    try {
      const response = await fetch(`/api/upload?url=${encodeURIComponent(fileUrl)}`, {
        method: "DELETE",
      })

      if (response.ok) {
        removeFile(fileId)
      } else {
        const result = await response.json()
        setError(result.error || "Failed to delete file")
      }
    } catch (error) {
      console.error("Delete error:", error)
      setError("Failed to delete file")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {title}
          </CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"}
              ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />

            {isDragActive ? (
              <p className="text-lg font-medium text-primary">Drop files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-gray-500 mb-4">
                  Maximum {maxFiles} files, up to {maxSize}MB each
                </p>
                <p className="text-xs text-gray-400">
                  Supported:{" "}
                  {acceptedFileTypes
                    .map((type) => type.split("/")[1])
                    .join(", ")
                    .toUpperCase()}
                </p>
                <Button variant="outline" disabled={isUploading} className="mt-4 bg-transparent">
                  Choose Files
                </Button>
              </div>
            )}
          </div>

          {/* Total Progress */}
          {isUploading && totalProgress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Uploading files...</span>
                <span>{Math.round(totalProgress)}%</span>
              </div>
              <Progress value={totalProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Uploaded Files ({files.length}/{maxFiles})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {file.status === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : file.status === "error" ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <FileImage className="h-5 w-5 text-blue-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(file.size)}
                      </Badge>
                    </div>

                    {file.status === "uploading" && <Progress value={file.progress} className="h-2" />}

                    {file.status === "error" && file.error && <p className="text-xs text-red-500 mt-1">{file.error}</p>}

                    {file.status === "success" && <p className="text-xs text-green-600 mt-1">Upload completed</p>}
                  </div>

                  <div className="flex-shrink-0 flex space-x-2">
                    {file.status === "success" && file.url && (
                      <Button size="sm" variant="outline" onClick={() => window.open(file.url, "_blank")}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}

                    {file.status === "error" && (
                      <Button size="sm" variant="outline" onClick={() => retryUpload(file.id)}>
                        Retry
                      </Button>
                    )}

                    {file.status === "success" && file.url && (
                      <Button size="sm" variant="destructive" onClick={() => deleteFile(file.id, file.url)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <Button size="sm" variant="ghost" onClick={() => removeFile(file.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Summary */}
      {files.length > 0 && !isUploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">
                  {files.filter((f) => f.status === "success").length} of {files.length} files uploaded successfully
                </p>
                {files.some((f) => f.status === "error") && (
                  <p className="text-xs text-red-500">
                    {files.filter((f) => f.status === "error").length} files failed to upload
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setFiles([])}>
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
