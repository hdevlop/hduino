'use client'

import Image from 'next/image'
import { Upload, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProjectStore } from '@/stores/projectStore'

export function EmptyState() {
  const { projects, isLoading, hasFetched, searchQuery, openCreateDialog, openImportDialog } = useProjectStore()

  const isEmpty = projects.length === 0 && !isLoading && hasFetched && !searchQuery

  if (!isEmpty) return null

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-5">
      {/* Illustration */}
      <Image
        src="/icons/main/empty.png"
        alt="No projects"
        width={192}
        height={192}
        className="w-48 h-48 mb-8"
        unoptimized={false}
      />

      {/* Text */}
      <h2 className="text-2xl font-semibold mb-3">No projects yet</h2>
      <p className="text-muted-foreground text-base mb-8 max-w-md">
        Create your first Arduino project or import an existing one to get started with visual block programming.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={openCreateDialog} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </Button>
        <Button variant="outline" onClick={openImportDialog} size="lg">
          <Upload className="w-4 h-4 mr-2" />
          Import .hd
        </Button>
      </div>
    </div>
  )
}