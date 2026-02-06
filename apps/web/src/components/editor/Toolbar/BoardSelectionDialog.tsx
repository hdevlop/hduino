'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BoardTypeCarousel } from '@/components/shared/BoardTypeCarousel'
import type { BoardType } from '@/types/arduino'

interface BoardSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentBoard: BoardType
  onBoardChange: (board: BoardType) => Promise<void>
  isLoading?: boolean
}

export function BoardSelectionDialog({
  open,
  onOpenChange,
  currentBoard,
  onBoardChange,
  isLoading,
}: BoardSelectionDialogProps) {
  const [selectedBoard, setSelectedBoard] = useState<BoardType>(currentBoard)

  // Sync selectedBoard with currentBoard when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedBoard(currentBoard)
    }
  }, [open, currentBoard])

  const handleSave = async () => {
    try {
      await onBoardChange(selectedBoard)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update board type:', error)
    }
  }

  const hasChanges = selectedBoard !== currentBoard

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Board Type</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <BoardTypeCarousel
            value={selectedBoard}
            onChange={setSelectedBoard}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
