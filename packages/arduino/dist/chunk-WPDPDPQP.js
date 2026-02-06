// src/theme.ts
import * as Blockly from "blockly";
var CATEGORY_COLORS = {
  operators: "#59C059",
  control: "#FFAB19",
  math: "#6990ca",
  text: "#774DCB",
  array: "#FF6680",
  variables: "#ff764c",
  functions: "#995ba5",
  arduino: "#00979D",
  display: "#59C059",
  sensors: "#47A8D1",
  motors: "#DC143C",
  switch: "#9966FF",
  telecom: "#00CED1"
};
var darkTheme = Blockly.Theme.defineTheme("hduino_dark", {
  name: "hduino_dark",
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: "#1e1e1e",
    toolboxBackgroundColour: "#252526",
    toolboxForegroundColour: "#cccccc",
    flyoutBackgroundColour: "#2d2d2d",
    flyoutForegroundColour: "#cccccc",
    flyoutOpacity: 0.9,
    scrollbarColour: "#797979",
    insertionMarkerColour: "#ffffff",
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.4,
    cursorColour: "#d0d0d0"
  },
  fontStyle: {
    family: "IBM Plex Sans, sans-serif",
    weight: "normal",
    size: 12
  },
  startHats: true
});
var lightTheme = Blockly.Theme.defineTheme("hduino_light", {
  name: "hduino_light",
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: "#ffffff",
    toolboxBackgroundColour: "#f3f3f3",
    toolboxForegroundColour: "#333333",
    flyoutBackgroundColour: "#f3f3f3",
    flyoutForegroundColour: "#333333",
    flyoutOpacity: 0.5,
    scrollbarColour: "#cccccc",
    insertionMarkerColour: "#000000",
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.4,
    cursorColour: "#333333"
  },
  fontStyle: {
    family: "IBM Plex Sans, sans-serif",
    weight: "normal",
    size: 12
  },
  startHats: true
});
var defaultTheme = darkTheme;
var rendererOverrides = {
  /** Minimum height for dummy inputs */
  DUMMY_INPUT_MIN_HEIGHT: 12,
  /** Minimum height for shadow dummy inputs */
  DUMMY_INPUT_SHADOW_MIN_HEIGHT: 12,
  /** Height for empty inline inputs */
  EMPTY_INLINE_INPUT_HEIGHT: 35,
  /** Border color for field rectangles */
  FIELD_BORDER_RECT_COLOUR: "var(--tinkerblocks-color-foreground)",
  /** Whether dropdown fields have colored divs */
  FIELD_DROPDOWN_COLOURED_DIV: false,
  /** Whether dropdown fields have border rect shadows */
  FIELD_DROPDOWN_NO_BORDER_RECT_SHADOW: false,
  /** Font family for text fields */
  FIELD_TEXT_FONTFAMILY: "IBM Plex Sans",
  /** Opacity for insertion markers */
  INSERTION_MARKER_OPACITY: 0.4,
  /** Color for replacement glow effect */
  REPLACEMENT_GLOW_COLOUR: "var(--tinkerblocks-color-foreground)",
  /** Color for selected block glow effect */
  SELECTED_GLOW_COLOUR: "var(--tinkerblocks-color-foreground)",
  /** Size of the selected glow effect */
  SELECTED_GLOW_SIZE: 0.2
};
var RENDERER_NAME = "zelos";

export {
  CATEGORY_COLORS,
  darkTheme,
  lightTheme,
  defaultTheme,
  rendererOverrides,
  RENDERER_NAME
};
//# sourceMappingURL=chunk-WPDPDPQP.js.map