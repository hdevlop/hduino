import * as Blockly from 'blockly';

export type { Toolbox, ToolboxCategory, ToolboxBlock, ToolboxSeparator, ToolboxItem } from './categories';
export { standardCategories } from './standard';
export { hardwareCategories } from './hardware';

import type { Toolbox, ToolboxCategory } from './categories';
import { standardCategories } from './standard';
import { hardwareCategories } from './hardware';

export function createToolbox(): Toolbox {
  return {
    kind: 'categoryToolbox',
    contents: [...standardCategories, ...hardwareCategories],
  };
}

/**
 * Find category by ID (supports nested subcategories)
 */
export function findCategoryById(categories: ToolboxCategory[], id: string): ToolboxCategory | null {
  for (const category of categories) {
    if (
      category.toolboxitemid?.toLowerCase() === id.toLowerCase() ||
      category.name?.toLowerCase() === id.toLowerCase()
    ) {
      return category;
    }

    if (category.contents) {
      const subcategories = category.contents.filter(
        (item): item is ToolboxCategory => 'kind' in item && item.kind === 'category'
      );
      const found = findCategoryById(subcategories, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Flatten category contents to show all blocks (including nested subcategories)
 */
export function flattenCategoryBlocks(contents: any[]): any[] {
  const blocks: any[] = [];

  for (const item of contents) {
    if (item.kind === 'category' && item.contents) {
      blocks.push(...flattenCategoryBlocks(item.contents));
    } else if (item.kind === 'block' || item.kind === 'button' || item.blockxml) {
      blocks.push(item);
    }
  }

  return blocks;
}

/**
 * Show blocks for a specific category in the flyout
 */
export function showCategoryBlocks(
  workspace: Blockly.WorkspaceSvg,
  categoryId: string | null
): void {
  const flyout = workspace.getFlyout();

  if (!categoryId) {
    flyout?.hide();
    return;
  }

  const allCategories = [...standardCategories, ...hardwareCategories] as ToolboxCategory[];
  const category = findCategoryById(allCategories, categoryId);

  if (!category) {
    console.warn(`Category not found: ${categoryId}`);
    return;
  }

  // Handle custom categories (Variables, Functions)
  if (category.custom) {
    const callback = workspace.getToolboxCategoryCallback(category.custom);
    if (callback) {
      const flyoutContents = callback(workspace);
      flyout?.show(flyoutContents);
    }
  } else if (category.contents) {
    // Show regular category blocks (flatten nested subcategories)
    const blocks = flattenCategoryBlocks(category.contents);
    flyout?.show(blocks);
  }
}

/**
 * Register toolbox category callbacks for Variables and Functions
 * @param workspace The Blockly workspace
 * @param variablesFlyoutCallback The callback function for variables flyout
 */
export function registerToolboxCallbacks(
  workspace: Blockly.WorkspaceSvg,
  variablesFlyoutCallback: (workspace: Blockly.WorkspaceSvg) => Blockly.utils.toolbox.FlyoutItemInfoArray
): void {
  // Register the create variable button callback
  workspace.registerButtonCallback('CREATE_VARIABLE', () => {
    Blockly.Variables.createVariableButtonHandler(workspace);
  });

  workspace.registerToolboxCategoryCallback('VARIABLE', variablesFlyoutCallback);

  workspace.registerToolboxCategoryCallback('Variables', variablesFlyoutCallback);

  workspace.registerToolboxCategoryCallback(
    'PROCEDURE',
    (ws: Blockly.WorkspaceSvg) => Blockly.Procedures.flyoutCategory(ws, true)
  );
}
