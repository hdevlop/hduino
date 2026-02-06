import * as Blockly from 'blockly';
import { darkTheme, RENDERER_NAME, rendererOverrides, registerToolboxCallbacks } from '@hduino/arduino';
import { variablesFlyoutCallback } from './variables';

/**
 * Custom Flyout that maintains constant scale regardless of workspace zoom
 */
class FixedScaleFlyout extends Blockly.VerticalFlyout {
  override getFlyoutScale(): number {
    return 0.8;
  }
}

// Register the custom flyout
Blockly.registry.register(
  Blockly.registry.Type.FLYOUTS_VERTICAL_TOOLBOX,
  'fixedScaleFlyout',
  FixedScaleFlyout
);

/**
 * Workspace configuration options
 */
export interface WorkspaceOptions {
  container: HTMLElement;
  onChange?: (event: Blockly.Events.Abstract) => void;
}

/**
 * Default workspace preferences
 */
const DEFAULT_PREFERENCES: Blockly.BlocklyOptions = {
  media: '/media/',
  collapse: true,
  comments: true,
  css: true,
  disable: false,
  horizontalLayout: false,
  maxBlocks: Infinity,
  maxInstances: {},
  oneBasedIndex: false,
  readOnly: false,
  rtl: false,
  toolboxPosition: 'start',
  trashcan: true,
  maxTrashcanContents: 0,
  renderer: RENDERER_NAME,
  rendererOverrides,
  theme: darkTheme,
  toolbox: {
    kind: 'flyoutToolbox',
    contents: [],
  },
  move: {
    scrollbars: {
      horizontal: true,
      vertical: true,
    },
    drag: true,
    wheel: true,
  },
  zoom: {
    controls: false,
    wheel: true,
    startScale: 0.8,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
  },
  plugins: {
    flyoutsVerticalToolbox: 'fixedScaleFlyout',
  },
};

/**
 * Insert DOM elements (trash icon) into the workspace container
 */
function insertDomElements(container: HTMLElement): void {
  const trashIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADsQAAA7EB9YPtSQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAx3SURBVHic7Z19cBTlHce/v727zeWSQF4JIhIQxBcERBQhDjZaGTWE2sIkmENTQKlDVSyoM4w6Hf7ptHZaqhWopdUgAqmhVUgwEYtCR2zHlwLtIG+iOPJSEhLzArmEu9t9+kdYTCB3t3f77O4l+3z+3H329zw038/u7ctzuwSHcvUqNvZsCC92BlF4PoSMsALJ7YLq9aDFK2NnejoeP7aIGuwep9mQ3QOwgyG/Y283d+B+RYn8+d0uqNkZWNv4JC22cmxW4ygBRlYyb2sT9rcGMFrvNjkZ+KR5KaaBSDVzbHaRtAIUFxePlSTpF4qifE9RlGzGmAQARNTldruPyrL8py1btryst964aiaf+BqH2zoxMt6xZPlwsOVp3DgQJUg6AWbNmuVTVXVLMBi8mzEWdXxut7tNkqQf19XVbY3Wzkj4GgNVgqQSYM6cOVcHAoHPQqFQlt5tiIh5vd6VtbW1T/e1nkf4GgNRgqQRoLS0dFR7e/t+RVF8iWzv9Xr/sm3btvKey3iGrzHQJEgKAYyGr9FTAjPC1xhIEtguAK/wNbxe75vHKmarzApfY6BIINnZeXFx8di2trbPeYUPAJ0hde6pY+dPmhk+ALQEcH3OSnxkZh9WYJsAxcXFY8Ph8D5VVVNjtZUkKSTL8j5Zlk9Ea8dcMvZPfx0tXSm5/EYameZzmHrlranFX2ZhiwCxBO+x+M5Ja8dcMnZPfR0tXSmm/EYameZzmHblrannJ2dhS4CxBO+xeMZJa8dcMnZPfR0tXSkm/EYameZzmOryNdXkLe2Vl2A/hA+C/6Gs/k+RkI/FaqBklQBsdhpZ5nMYateLx0xZJK0ApcXEFexv99PSs4+0Ne1mHm1a0G8E+ORx8tgpwPYBJBu2C8BuAdgtALsF+BR4b+D0ANQVYKcA7BYA3YL/B9AtKN4CoFsA7Bb0C0C3gN0C0C3ItwB0C7JbAHYL0C34f+B/MUJpd9QOXFsAAAAASUVORK5CYII=`;

  const deletionIcon = document.createElement('div');
  const deletionIconInner = document.createElement('img');
  deletionIcon.className = 'blocklyDeletionIcon';
  deletionIconInner.src = trashIcon;
  deletionIcon.appendChild(deletionIconInner);
  container.insertAdjacentElement('beforeend', deletionIcon);
}

/**
 * Initialize a Blockly workspace
 */
export function initWorkspace(options: WorkspaceOptions): Blockly.WorkspaceSvg {
  const workspace = Blockly.inject(options.container, DEFAULT_PREFERENCES);

  // Hide flyout initially
  const flyout = workspace.getFlyout();
  if (flyout) {
    flyout.hide();
    flyout.autoClose = true;
  }

  // Register toolbox callbacks
  registerToolboxCallbacks(workspace, variablesFlyoutCallback);

  // Add change listener if provided
  if (options.onChange) {
    workspace.addChangeListener(options.onChange);
  }

  // Insert DOM elements
  insertDomElements(options.container);

  return workspace;
}

/**
 * Dispose of a Blockly workspace
 */
export function disposeWorkspace(workspace: Blockly.WorkspaceSvg | null): void {
  if (workspace) {
    try {
      workspace.dispose();
    } catch {
      // Ignore disposal errors during unmount
    }
  }
}

/**
 * Get the empty workspace XML with start block
 */
export function getEmptyWorkspaceXml(): string {
  return '<xml><block type="base_begin"></block></xml>';
}

/**
 * Clear workspace and load start block
 */
export function clearWorkspace(workspace: Blockly.WorkspaceSvg): void {
  const workspaceXml = getEmptyWorkspaceXml();
  const workspaceDom = Blockly.utils.xml.textToDom(workspaceXml);
  Blockly.Xml.clearWorkspaceAndLoadFromXml(workspaceDom, workspace);
}

/**
 * Get all blocks in workspace
 */
export function getAllBlocks(workspace: Blockly.WorkspaceSvg): Blockly.Block[] {
  return workspace.getAllBlocks();
}

/**
 * Get the start block (base_begin)
 */
export function getStartBlock(workspace: Blockly.WorkspaceSvg): Blockly.Block | null {
  const blocks = getAllBlocks(workspace);
  return blocks.find((block) => block.type === 'base_begin') || null;
}

/**
 * Delete all blocks from workspace
 */
export function deleteAllBlocks(workspace: Blockly.WorkspaceSvg): void {
  workspace.clear();
}
