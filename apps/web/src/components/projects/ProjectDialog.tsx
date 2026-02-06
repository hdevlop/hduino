'use client'

import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { BoardType } from '@/types/arduino'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { BoardTypeCarousel } from '@/components/shared/BoardTypeCarousel'
import { useProjectStore } from '@/stores/projectStore'

const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .min(2, 'Project name must be at least 2 characters')
    .max(50, 'Project name must be less than 50 characters'),
  boardType: z.enum(['arduino_uno', 'arduino_nano', 'arduino_mega', 'arduino_pro_mini', 'esp32', 'esp8266']),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters'),
})

interface ProjectDialogProps {
  mode?: 'create' | 'rename'
}

export function ProjectDialog({ mode = 'rename' }: ProjectDialogProps) {
  const {
    createDialogOpen,
    renameDialogOpen,
    selectedProject,
    isSubmitting,
    closeCreateDialog,
    closeRenameDialog,
    submitCreate,
    submitRename,
  } = useProjectStore()

  const open = mode === 'create' ? createDialogOpen : renameDialogOpen
  const close = mode === 'create' ? closeCreateDialog : closeRenameDialog

  const form = useForm({
    defaultValues: {
      name: '',
      boardType: 'arduino_uno' as BoardType,
      description: '',
    },
    validators: {
      onSubmit: projectSchema,
    },
    onSubmit: async ({ value }) => {
      const trimmedName = value.name.trim()
      const trimmedDescription = value.description?.trim() || undefined

      if (mode === 'create') {
        await submitCreate({
          name: trimmedName,
          boardType: value.boardType,
          description: trimmedDescription,
        })
      } else {
        await submitRename(trimmedName)
      }
    },
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (mode === 'rename' && selectedProject) {
        form.reset({
          name: selectedProject.name,
          boardType: selectedProject.boardType,
          description: selectedProject.description || '',
        })
      } else {
        form.reset({
          name: '',
          boardType: 'arduino_uno',
          description: '',
        })
      }
    }
  }, [open, mode, selectedProject, form])

  const title = mode === 'create' ? 'New Project' : 'Rename Project'
  const submitLabel = mode === 'create' ? 'Create' : 'Save'

  return (
    <Dialog open={open} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Project Name Field */}
            <form.Field
              name="name"
              children={(field) => {
                const errors = field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? field.state.meta.errors.map((e) => ({ message: String(e) }))
                  : undefined
                return (
                  <Field data-invalid={!!errors}>
                    <FieldLabel htmlFor={field.name}>Project name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!!errors}
                      placeholder="My Arduino Project"
                      autoFocus
                      autoComplete="off"
                    />
                    <FieldError errors={errors} />
                  </Field>
                )
              }}
            />

            {/* Description Field (only for create mode) */}
            {mode === 'create' && (
              <form.Field
                name="description"
                children={(field) => {
                  const errors = field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? field.state.meta.errors.map((e) => ({ message: String(e) }))
                    : undefined
                  return (
                    <Field data-invalid={!!errors}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={!!errors}
                        placeholder="A brief description of your project (optional)"
                        rows={3}
                      />
                      <FieldError errors={errors} />
                    </Field>
                  )
                }}
              />
            )}

            {/* Board Type Carousel (only for create mode) */}
            {mode === 'create' && (
              <form.Field
                name="boardType"
                children={(field) => (
                  <BoardTypeCarousel
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              />
            )}


          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => ({ canSubmit: state.canSubmit, name: state.values.name })}
              children={({ canSubmit, name }) => (
                <Button type="submit" disabled={isSubmitting || !canSubmit || !name.trim()}>
                  {isSubmitting ? 'Saving...' : submitLabel}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
