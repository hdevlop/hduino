import * as Blockly from 'blockly';

interface ToolboxBlock {
    kind: 'block';
    type?: string;
    blockxml?: string;
}
interface ToolboxSeparator {
    kind: 'sep';
}
interface ToolboxCategory {
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
type ToolboxItem = ToolboxCategory | ToolboxSeparator;
interface Toolbox {
    kind: 'categoryToolbox';
    contents: ToolboxItem[];
}

declare const standardCategories: ToolboxItem[];

declare const hardwareCategories: ToolboxItem[];

declare function createToolbox(): Toolbox;
/**
 * Find category by ID (supports nested subcategories)
 */
declare function findCategoryById(categories: ToolboxCategory[], id: string): ToolboxCategory | null;
/**
 * Flatten category contents to show all blocks (including nested subcategories)
 */
declare function flattenCategoryBlocks(contents: any[]): any[];
/**
 * Show blocks for a specific category in the flyout
 */
declare function showCategoryBlocks(workspace: Blockly.WorkspaceSvg, categoryId: string | null): void;
/**
 * Register toolbox category callbacks for Variables and Functions
 * @param workspace The Blockly workspace
 * @param variablesFlyoutCallback The callback function for variables flyout
 */
declare function registerToolboxCallbacks(workspace: Blockly.WorkspaceSvg, variablesFlyoutCallback: (workspace: Blockly.WorkspaceSvg) => Blockly.utils.toolbox.FlyoutItemInfoArray): void;

export { type Toolbox, type ToolboxBlock, type ToolboxCategory, type ToolboxItem, type ToolboxSeparator, createToolbox, findCategoryById, flattenCategoryBlocks, hardwareCategories, registerToolboxCallbacks, showCategoryBlocks, standardCategories };
