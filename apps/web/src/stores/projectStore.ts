import { create } from 'zustand'
import type { Project, ProjectCreate, ProjectUpdate } from '@/types/project'
import {
  getProjects,
  createProject as createProjectStorage,
  updateProject as updateProjectStorage,
  deleteProject as deleteProjectStorage,
  duplicateProject as duplicateProjectStorage,
  importProject as importProjectStorage,
  searchProjects as searchProjectsStorage,
} from '@/lib/storage'
import { toast } from 'sonner'

interface ProjectState {
  // State
  projects: Project[]
  isLoading: boolean
  hasFetched: boolean
  error: string | null
  searchQuery: string

  // Dialog state
  createDialogOpen: boolean
  importDialogOpen: boolean
  renameDialogOpen: boolean
  deleteDialogOpen: boolean
  selectedProject: Project | null
  isSubmitting: boolean

  // Actions
  fetchProjects: () => Promise<void>
  createProject: (data: ProjectCreate) => Promise<Project>
  updateProject: (id: string, data: ProjectUpdate) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  duplicateProject: (id: string) => Promise<Project | null>
  importProject: (file: File) => Promise<Project>
  searchProjects: (query: string) => Promise<void>
  clearSearch: () => Promise<void>
  clearError: () => void

  // Dialog actions
  openCreateDialog: () => void
  closeCreateDialog: () => void
  openImportDialog: () => void
  closeImportDialog: () => void
  openRenameDialog: (project: Project) => void
  closeRenameDialog: () => void
  openDeleteDialog: (project: Project) => void
  closeDeleteDialog: () => void
  submitCreate: (data: ProjectCreate) => Promise<void>
  submitImport: (file: File) => Promise<void>
  submitRename: (name: string) => Promise<void>
  submitDelete: () => Promise<void>
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  projects: [],
  isLoading: false,
  hasFetched: false,
  error: null,
  searchQuery: '',

  // Dialog state
  createDialogOpen: false,
  importDialogOpen: false,
  renameDialogOpen: false,
  deleteDialogOpen: false,
  selectedProject: null,
  isSubmitting: false,

  // Fetch all projects
  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      const projects = await getProjects()
      set({ projects, isLoading: false, hasFetched: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch projects'
      set({
        error: message,
        isLoading: false,
        hasFetched: true,
      })
      toast.error('Failed to load projects', {
        description: message
      })
    }
  },

  // Create new project
  createProject: async (data: ProjectCreate) => {
    set({ isLoading: true, error: null })
    try {
      const project = await createProjectStorage(data)
      set((state) => ({
        projects: [project, ...state.projects],
        isLoading: false,
      }))
      toast.success('Project created', {
        description: `"${data.name}" has been created successfully`
      })
      return project
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create project'
      set({
        error: message,
        isLoading: false,
      })
      toast.error('Failed to create project', {
        description: message
      })
      throw error
    }
  },

  // Update project
  updateProject: async (id: string, data: ProjectUpdate) => {
    set({ error: null })
    try {
      const updated = await updateProjectStorage(id, data)
      if (!updated) {
        throw new Error('Project not found')
      }
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? updated : p
        ),
      }))
      if (data.name) {
        toast.success('Project updated', {
          description: `"${data.name}" has been updated successfully`
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update project'
      set({
        error: message,
      })
      toast.error('Failed to update project', {
        description: message
      })
      throw error
    }
  },

  // Delete project
  deleteProject: async (id: string) => {
    set({ error: null })
    try {
      const success = await deleteProjectStorage(id)
      if (!success) {
        throw new Error('Project not found')
      }
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }))
      toast.success('Project deleted', {
        description: 'Project has been deleted successfully'
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete project'
      set({
        error: message,
      })
      toast.error('Failed to delete project', {
        description: message
      })
      throw error
    }
  },

  // Duplicate project
  duplicateProject: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const project = await duplicateProjectStorage(id)
      if (!project) {
        throw new Error('Project not found')
      }
      set((state) => ({
        projects: [project, ...state.projects],
        isLoading: false,
      }))
      toast.success('Project duplicated', {
        description: `"${project.name}" has been created successfully`
      })
      return project
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to duplicate project'
      set({
        error: message,
        isLoading: false,
      })
      toast.error('Failed to duplicate project', {
        description: message
      })
      throw error
    }
  },

  // Import project from file
  importProject: async (file: File) => {
    set({ isLoading: true, error: null })
    try {
      const project = await importProjectStorage(file)
      set((state) => ({
        projects: [project, ...state.projects],
        isLoading: false,
      }))
      toast.success('Project imported', {
        description: `"${project.name}" has been imported successfully`
      })
      return project
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import project'
      set({
        error: message,
        isLoading: false,
      })
      toast.error('Failed to import project', {
        description: message
      })
      throw error
    }
  },

  // Search projects
  searchProjects: async (query: string) => {
    set({ searchQuery: query, isLoading: true, error: null })
    try {
      const projects = await searchProjectsStorage(query)
      set({ projects, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to search projects'
      set({
        error: message,
        isLoading: false,
      })
      toast.error('Search failed', {
        description: message
      })
    }
  },

  // Clear search and fetch all
  clearSearch: async () => {
    set({ searchQuery: '' })
    await get().fetchProjects()
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Dialog actions
  openCreateDialog: () => set({ createDialogOpen: true }),
  closeCreateDialog: () => set({ createDialogOpen: false }),
  openImportDialog: () => set({ importDialogOpen: true }),
  closeImportDialog: () => set({ importDialogOpen: false }),
  openRenameDialog: (project: Project) => set({ renameDialogOpen: true, selectedProject: project }),
  closeRenameDialog: () => set({ renameDialogOpen: false, selectedProject: null }),
  openDeleteDialog: (project: Project) => set({ deleteDialogOpen: true, selectedProject: project }),
  closeDeleteDialog: () => set({ deleteDialogOpen: false, selectedProject: null }),

  submitCreate: async (data: ProjectCreate) => {
    set({ isSubmitting: true })
    try {
      await get().createProject(data)
      set({ createDialogOpen: false })
    } finally {
      set({ isSubmitting: false })
    }
  },

  submitImport: async (file: File) => {
    set({ isSubmitting: true })
    try {
      await get().importProject(file)
      set({ importDialogOpen: false })
    } finally {
      set({ isSubmitting: false })
    }
  },

  submitRename: async (name: string) => {
    const { selectedProject } = get()
    if (!selectedProject) return

    set({ isSubmitting: true })
    try {
      await get().updateProject(selectedProject.id, { name })
      set({ renameDialogOpen: false, selectedProject: null })
    } finally {
      set({ isSubmitting: false })
    }
  },

  submitDelete: async () => {
    const { selectedProject } = get()
    if (!selectedProject) return

    set({ isSubmitting: true })
    try {
      await get().deleteProject(selectedProject.id)
      set({ deleteDialogOpen: false, selectedProject: null })
    } finally {
      set({ isSubmitting: false })
    }
  },
}))