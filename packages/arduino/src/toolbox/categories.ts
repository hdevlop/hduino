export interface ToolboxBlock {
  kind: 'block';
  type?: string;
  blockxml?: string;
}

export interface ToolboxSeparator {
  kind: 'sep';
}

export interface ToolboxCategory {
  kind: 'category';
  name: string;
  toolboxitemid: string;
  colour: string;
  cssConfig: {
    container: string;
    icon: string;
  };
  contents?: (ToolboxBlock | ToolboxCategory)[];
  custom?: string;
  expanded?: string;
  level?: string;
  levels?: string;
}

export type ToolboxItem = ToolboxCategory | ToolboxSeparator;

export interface Toolbox {
  kind: 'categoryToolbox';
  contents: ToolboxItem[];
}
