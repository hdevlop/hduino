'use client'

import { useState, useRef } from 'react'
import { Upload, FileUp, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { cn } from '@/lib/utils'
import { HDUINO_FILE_EXTENSION } from '@/types/project'
import { Button } from '@/components/ui/button'
import { useProjectStore } from '@/stores/projectStore'

export function ImportDialog() {
  const {
    importDialogOpen,
    isSubmitting,
    closeImportDialog,
    submitImport,
  } = useProjectStore()

  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const resetState = () => {
    setFile(null)
    setError('')
    setIsDragging(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetState()
      closeImportDialog()
    }
  }

  const validateFile = (selectedFile: File): boolean => {
    if (!selectedFile.name.endsWith(HDUINO_FILE_EXTENSION)) {
      setError(`Please select a ${HDUINO_FILE_EXTENSION} file`)
      return false
    }
    return true
  }

  const handleFileSelect = (selectedFile: File) => {
    setError('')
    if (validateFile(selectedFile)) {
      setFile(selectedFile)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleImport = async () => {
    if (!file) return

    try {
      await submitImport(file)
      resetState()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import project')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open={importDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Project</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/50',
              file && 'border-solid border-primary bg-primary/5'
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={HDUINO_FILE_EXTENSION}
              onChange={handleInputChange}
              className="hidden"
            />

            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileUp className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium truncate max-w-50">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="font-medium mb-1">
                  Drop your file here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports {HDUINO_FILE_EXTENSION} files
                </p>
              </>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive mt-3">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={isSubmitting || !file}
          >
            {isSubmitting ? 'Importing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
