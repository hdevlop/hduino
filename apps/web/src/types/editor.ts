// Block category definition
export interface BlockCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;           // Background color (e.g., "#8B5CF6")
  hoverColor: string;      // Hover state color
  group: 'logic' | 'hardware';  // Category group for sidebar sections
}

// Code panel state
export interface CodePanelState {
  isOpen: boolean;
  position: { x: number; y: number };
  width: number;
  height: number;
}

// Workspace control action
export type WorkspaceAction = 'zoomIn' | 'zoomOut' | 'undo' | 'redo' | 'center';