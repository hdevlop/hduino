'use client'

import {
  EmptyState,
  ErrorDisplay,
  ProjectList,
  ProjectDialog,
  DeleteConfirmDialog,
} from '@/components/projects'

export default function ProjectsPage() {
  return (
    <>
      <main className="w-full justify-center px-4 py-8 md:px-8">
        <ErrorDisplay />
        <EmptyState />
        <ProjectList />
      </main>

      <ProjectDialog />
      <DeleteConfirmDialog />
    </>
  )
}
