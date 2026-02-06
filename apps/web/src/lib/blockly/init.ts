/**
 * Initialize Blockly blocks and generators
 * Import this file once at app startup
 */

// Import language file first to initialize Blockly.Msg
import './Lang/en';

// Import blocks and generators to register them
import '@hduino/arduino/blocks';
import '@hduino/arduino/generators';
