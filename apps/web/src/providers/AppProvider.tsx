'use client'

import { useLayoutEffect, type ReactNode } from 'react'
import { useProjectStore } from '@/stores/projectStore'
import { Toaster } from '@/components/ui/sonner'
import { emitAppReady } from '@hduino/platform'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const fetchProjects = useProjectStore((state) => state.fetchProjects)

  // Fetch projects in background - don't block rendering
  useLayoutEffect(() => {
    fetchProjects()

    // Emit app-ready signal to Tauri after projects loaded
    // Using Promise to ensure event fires after current render cycle
    Promise.resolve().then(() => {
      emitAppReady()
    })
  }, [fetchProjects])

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
