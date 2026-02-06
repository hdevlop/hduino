import * as Blockly from 'blockly';

/**
 * Category colors for Blockly toolbox
 */
declare const CATEGORY_COLORS: {
    readonly operators: "#59C059";
    readonly control: "#FFAB19";
    readonly math: "#6990ca";
    readonly text: "#774DCB";
    readonly array: "#FF6680";
    readonly variables: "#ff764c";
    readonly functions: "#995ba5";
    readonly arduino: "#00979D";
    readonly display: "#59C059";
    readonly sensors: "#47A8D1";
    readonly motors: "#DC143C";
    readonly switch: "#9966FF";
    readonly telecom: "#00CED1";
};
/**
 * Dark theme configuration for Hduino
 */
declare const darkTheme: Blockly.Theme;
/**
 * Light theme configuration for Hduino
 */
declare const lightTheme: Blockly.Theme;
/**
 * Default theme
 */
declare const defaultTheme: Blockly.Theme;
/**
 * Zelos renderer customization for Hduino
 * These overrides customize the appearance of blocks
 */
declare const rendererOverrides: {
    /** Minimum height for dummy inputs */
    readonly DUMMY_INPUT_MIN_HEIGHT: 12;
    /** Minimum height for shadow dummy inputs */
    readonly DUMMY_INPUT_SHADOW_MIN_HEIGHT: 12;
    /** Height for empty inline inputs */
    readonly EMPTY_INLINE_INPUT_HEIGHT: 35;
    /** Border color for field rectangles */
    readonly FIELD_BORDER_RECT_COLOUR: "var(--tinkerblocks-color-foreground)";
    /** Whether dropdown fields have colored divs */
    readonly FIELD_DROPDOWN_COLOURED_DIV: false;
    /** Whether dropdown fields have border rect shadows */
    readonly FIELD_DROPDOWN_NO_BORDER_RECT_SHADOW: false;
    /** Font family for text fields */
    readonly FIELD_TEXT_FONTFAMILY: "IBM Plex Sans";
    /** Opacity for insertion markers */
    readonly INSERTION_MARKER_OPACITY: 0.4;
    /** Color for replacement glow effect */
    readonly REPLACEMENT_GLOW_COLOUR: "var(--tinkerblocks-color-foreground)";
    /** Color for selected block glow effect */
    readonly SELECTED_GLOW_COLOUR: "var(--tinkerblocks-color-foreground)";
    /** Size of the selected glow effect */
    readonly SELECTED_GLOW_SIZE: 0.2;
};
/**
 * Renderer name to use (Zelos)
 */
declare const RENDERER_NAME = "zelos";

export { CATEGORY_COLORS, RENDERER_NAME, darkTheme, defaultTheme, lightTheme, rendererOverrides };
