'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import {
    MoreVertical,
    ExternalLink,
    Pencil,
    Copy,
    Download,
    Trash2,
    Cpu,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Project } from '@/types/project'
import type { BoardType } from '@/types/arduino'
import { BOARD_PROFILES } from '@hduino/arduino'
import { useProjectStore } from '@/stores/projectStore'
import { downloadProject } from '@/lib/storage'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface ProjectCardProps {
    project: Project
}

// Board type badge styles
const boardBadgeStyles: Record<BoardType, string> = {
    'arduino_uno': 'bg-blue-500/15 text-blue-400',
    'arduino_nano': 'bg-green-500/15 text-green-400',
    'arduino_mega': 'bg-orange-500/15 text-orange-400',
    'arduino_pro_mini': 'bg-gray-500/15 text-gray-400',
    'esp32': 'bg-purple-500/15 text-purple-400',
    'esp8266': 'bg-cyan-500/15 text-cyan-400',
}

// Get board display name from single source of truth
const getBoardDisplayName = (boardType: BoardType): string => {
    return BOARD_PROFILES[boardType]?.name || boardType
}

export function ProjectCard({ project }: ProjectCardProps) {
    const router = useRouter()
    const { duplicateProject, openRenameDialog, openDeleteDialog } = useProjectStore()

    const handleOpen = () => {
        router.push(`/editor?id=${project.id}`)
    }

    const formattedDate = formatDistanceToNow(new Date(project.updatedAt), {
        addSuffix: true,
    })

    return (
        <div
            className={cn(
                'group relative p-4 rounded-lg cursor-pointer',
                'bg-card border border-border',
                'transition-all duration-150',
                'hover:bg-accent/50 hover:border-border/80'
            )}
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <Cpu className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <h3 className="font-semibold text-[15px] truncate">
                        {project.name}
                    </h3>
                </div>

                {/* Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Project menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={handleOpen}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            openRenameDialog(project)
                        }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            duplicateProject(project.id)
                        }}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            downloadProject(project.id)
                        }}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation()
                                openDeleteDialog(project)
                            }}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <span
                    className={cn(
                        'text-xs font-medium px-2 py-1 rounded',
                        boardBadgeStyles[project.boardType]
                    )}
                >
                    {getBoardDisplayName(project.boardType)}
                </span>
                <span className="text-xs text-muted-foreground">
                    {formattedDate}
                </span>
            </div>
        </div>
    )
}