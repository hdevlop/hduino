'use client'

import { useCallback } from 'react'
import { Plus, Upload, Languages } from 'lucide-react'
import { Logo } from './logo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ProjectDialog, ImportDialog } from '@/components/projects'
import { useProjectStore } from '@/stores/projectStore'

interface HeaderProps {
  className?: string
  sticky?: boolean
  showActions?: boolean
}

export function Header({
  className,
  sticky = true,
  showActions = false,
}: HeaderProps) {
  const { openCreateDialog, openImportDialog } = useProjectStore()

  // Handle language change
  const handleLanguageChange = useCallback(() => {

  }, [])

  return (
    <>
      <header
        className={cn(
          'z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          sticky && 'sticky top-0',
          className
        )}
      >
        <div className="flex h-16 w-full items-center justify-between gap-4 px-4 md:px-8">
          <Logo />
          {showActions && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLanguageChange}
                title="Change Language"
              >
                <Languages className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={openImportDialog}
                title="Import Project"
              >
                <Upload className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                onClick={openCreateDialog}
                title="New Project"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Dialogs - no props needed */}
      {showActions && (
        <>
          <ProjectDialog mode="create" />
          <ImportDialog />
        </>
      )}
    </>
  )
}
