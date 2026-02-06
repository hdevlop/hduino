'use client'

import { Button } from '@/components/ui/button'
import { ProjectCard } from './ProjectCard'
import { ProjectCardSkeleton } from './ProjectCardSkeleton'
import { useProjectStore } from '@/stores/projectStore'

export function ProjectList() {
  const { projects, isLoading, hasFetched, searchQuery, clearSearch } =
    useProjectStore()

  const isInitialLoading = !hasFetched || isLoading
  const isEmpty = projects.length === 0 && !isLoading && hasFetched && !searchQuery

  if (isEmpty) return null

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  if (isInitialLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProjectCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    )
  }

  if (projects.length === 0 && searchQuery) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">
          No projects found matching &quot;{searchQuery}&quot;
        </p>
        <Button variant="link" onClick={clearSearch} className="mt-2">
          Clear search
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">My Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {sortedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}