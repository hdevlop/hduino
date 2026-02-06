import { create } from 'zustand';

export type VariableDialogType = 'create' | 'rename' | null;

interface VariableDialogState {
  isOpen: boolean;
  type: VariableDialogType;
  message: string;
  defaultValue: string;
  callback: ((value: string | null) => void) | null;

  // Actions
  openDialog: (
    type: VariableDialogType,
    message: string,
    defaultValue: string,
    callback: (value: string | null) => void
  ) => void;
  closeDialog: (value: string | null) => void;
}

export const useVariableDialogStore = create<VariableDialogState>((set, get) => ({
  isOpen: false,
  type: null,
  message: '',
  defaultValue: '',
  callback: null,

  openDialog: (type, message, defaultValue, callback) => {
    set({
      isOpen: true,
      type,
      message,
      defaultValue,
      callback,
    });
  },

  closeDialog: (value) => {
    const { callback } = get();
    if (callback) {
      callback(value);
    }
    set({
      isOpen: false,
      type: null,
      message: '',
      defaultValue: '',
      callback: null,
    });
  },
}));
