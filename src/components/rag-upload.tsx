"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, CheckCircle, X, Loader2 } from "lucide-react"

interface RagUploadProps {
  onComplete: (data: { context: any }) => void
}

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "processing" | "complete" | "error"
  progress: number
  content?: string
}

export default function RagUpload({ onComplete }: RagUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: "uploading" as const,
      progress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Simulate file processing
    newFiles.forEach((file) => {
      simulateFileProcessing(file.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  })

  const simulateFileProcessing = (fileId: string) => {
    const updateProgress = (progress: number, status: UploadedFile["status"]) => {
      setUploadedFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress, status } : file)))
    }

    // Upload simulation
    let progress = 0
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        clearInterval(uploadInterval)
        updateProgress(100, "processing")

        // Processing simulation
        setTimeout(() => {
          updateProgress(100, "complete")
        }, 2000)
      } else {
        updateProgress(progress, "uploading")
      }
    }, 300)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleComplete = async () => {
    setIsProcessing(true)

    // Simulate RAG context creation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const context = {
      files: uploadedFiles.filter((f) => f.status === "complete"),
      vectorStore: "created",
      embeddings: "processed",
      ready: true,
    }

    onComplete({ context })
  }

  const completedFiles = uploadedFiles.filter((f) => f.status === "complete")
  const canProceed = completedFiles.length > 0

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Upload Company & Marketing Documents</h3>
        <p className="text-slate-600">
          Add PDFs containing your company information, brand guidelines, and marketing materials for context
        </p>
      </div>

      {/* File Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop the PDF files here...</p>
            ) : (
              <div>
                <p className="text-slate-600 font-medium mb-2">Drag & drop PDF files here, or click to select</p>
                <p className="text-sm text-slate-500">
                  Upload brand guidelines, marketing materials, company info, etc.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Uploaded Files ({uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center flex-1">
                    <FileText className="w-5 h-5 text-slate-500 mr-3" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900">{file.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">{formatFileSize(file.size)}</span>
                          {file.status === "complete" && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ready
                            </Badge>
                          )}
                          {file.status === "processing" && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Processing
                            </Badge>
                          )}
                        </div>
                      </div>
                      {file.status !== "complete" && <Progress value={file.progress} className="h-1" />}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="ml-2 text-slate-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RAG Context Status */}
      {completedFiles.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center text-green-700 mb-2">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">RAG Context Ready</span>
            </div>
            <p className="text-green-600 text-sm">
              {completedFiles.length} document{completedFiles.length !== 1 ? "s" : ""} processed and ready for AI
              generation
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-slate-600">
          {canProceed ? (
            <span>✓ Ready to generate contextual content</span>
          ) : (
            <span>Upload at least one PDF to continue</span>
          )}
        </div>

        <Button
          onClick={handleComplete}
          disabled={!canProceed || isProcessing}
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Setting up RAG...
            </>
          ) : (
            <>
              Continue to Generation
              <FileText className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
