'use client';

import { useState, useEffect } from 'react';
import { useVariableDialogStore } from '@/stores/variableDialogStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * Variable Dialog Component
 * Follows the same pattern as ProjectDialog for consistency
 * Used for creating and renaming variables in Blockly workspace
 */
export function VariableDialog() {
  const { isOpen, type, message, defaultValue, closeDialog } = useVariableDialogStore();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Reset form when dialog opens (same pattern as ProjectDialog)
  useEffect(() => {
    if (isOpen) {
      setName(defaultValue);
      setError('');
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    // Validation
    if (!trimmedName) {
      setError('Variable name is required');
      return;
    }

    if (trimmedName.length < 1) {
      setError('Variable name must be at least 1 character');
      return;
    }

    if (trimmedName.length > 30) {
      setError('Variable name must be less than 30 characters');
      return;
    }

    // Check for valid variable name (alphanumeric and underscore)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedName)) {
      setError('Variable name must start with a letter or underscore and contain only letters, numbers, and underscores');
      return;
    }

    // Close dialog and pass value to callback
    closeDialog(trimmedName);
  };

  const handleCancel = () => {
    closeDialog(null);
  };

  const title = type === 'create' ? 'Create Variable' : 'Rename Variable';
  const submitLabel = type === 'create' ? 'Create' : 'Rename';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label
                htmlFor="variable-name"
                className="text-sm font-medium text-muted-foreground"
              >
                {message || 'Variable name'}
              </label>
              <Input
                id="variable-name"
                type="text"
                placeholder="myVariable"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                autoFocus
                autoComplete="off"
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
