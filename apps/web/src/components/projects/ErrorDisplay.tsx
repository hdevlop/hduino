'use client'

import { X } from 'lucide-react'
import { useProjectStore } from '@/stores/projectStore'

export function ErrorDisplay() {
  const { error, clearError } = useProjectStore()

  if (!error) return null

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive">
      <span>{error}</span>
      <button onClick={clearError} className="hover:opacity-70">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
