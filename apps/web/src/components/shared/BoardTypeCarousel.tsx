'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { BoardType } from '@/types/arduino'
import { BOARD_KEYS, BOARD_PROFILES } from '@hduino/arduino/arduino'

// Derive BOARD_OPTIONS from the single source of truth (boards.ts)
export const BOARD_OPTIONS: { value: BoardType; label: string; image: string }[] = BOARD_KEYS.map(key => ({
  value: key,
  label: BOARD_PROFILES[key].name,
  image: BOARD_PROFILES[key].image || `/boards/${key.replace('arduino_', '')}.png`,
}))

interface BoardTypeCarouselProps {
  value: BoardType
  onChange: (boardType: BoardType) => void
  className?: string
}

export function BoardTypeCarousel({ value, onChange, className }: BoardTypeCarouselProps) {
  const [currentBoardIndex, setCurrentBoardIndex] = useState(0)

  // Sync currentBoardIndex with the value prop
  useEffect(() => {
    const boardIndex = BOARD_OPTIONS.findIndex(b => b.value === value)
    if (boardIndex !== -1) {
      setCurrentBoardIndex(boardIndex)
    }
  }, [value])

  const handlePrevBoard = () => {
    const newIndex = currentBoardIndex === 0 ? BOARD_OPTIONS.length - 1 : currentBoardIndex - 1
    setCurrentBoardIndex(newIndex)
    onChange(BOARD_OPTIONS[newIndex].value)
  }

  const handleNextBoard = () => {
    const newIndex = currentBoardIndex === BOARD_OPTIONS.length - 1 ? 0 : currentBoardIndex + 1
    setCurrentBoardIndex(newIndex)
    onChange(BOARD_OPTIONS[newIndex].value)
  }

  return (
    <div className={className}>
      <div className="space-y-3 flex flex-col items-center justify-center">
        <label className="text-sm font-medium text-muted-foreground">
          {BOARD_OPTIONS[currentBoardIndex].label}
        </label>

        {/* Responsive container: vertical on mobile/tablet, horizontal on desktop */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full lg:w-auto">
          {/* Board Display - order-1 on mobile (top), order-2 on desktop (center) */}
          <div className="flex-1 flex flex-col items-center gap-4 p-4 lg:p-6 rounded-lg border border-border bg-secondary/30 order-1 lg:order-2 w-full lg:w-auto">
            <div className="relative w-50 h-42 lg:w-75 lg:h-62 flex items-center justify-center">
              <Image
                src={BOARD_OPTIONS[currentBoardIndex].image}
                alt={BOARD_OPTIONS[currentBoardIndex].label}
                width={300}
                height={250}
                className="object-contain rounded-md"
                unoptimized={false}
              />
            </div>
          </div>

          {/* Left Arrow - shown on left on desktop */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handlePrevBoard}
            className="hidden lg:flex shrink-0 h-10 w-10 lg:order-1"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Right Arrow - shown on right on desktop */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleNextBoard}
            className="hidden lg:flex shrink-0 h-10 w-10 lg:order-3"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Mobile navigation buttons - side by side at bottom */}
          <div className="flex lg:hidden items-center justify-center gap-4 order-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handlePrevBoard}
              className="shrink-0 h-10 w-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleNextBoard}
              className="shrink-0 h-10 w-10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
