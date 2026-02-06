import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Arduino } from '../../arduino/boards';

Blockly.Blocks['led_digitalwrite'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/led_ico.png', 20, 20, '*'))
      .appendField('Set')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN')
      .appendField('to')
      .appendField(new Blockly.FieldDropdown([['ON', 'HIGH'], ['OFF', 'LOW']]), 'STATE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(CATEGORY_COLORS.display);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPins', workspace);
  },
};

Blockly.Blocks['lcd_i2c_lcdinit'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Init LCD I2C')
      .appendField(new Blockly.FieldImage('/img/ico/lcd_ico.png', 120, 50, '*'));
    this.appendDummyInput()
      .appendField('Size')
      .appendField(new Blockly.FieldDropdown([
        ['16x2', '16x2'],
        ['20x4', '20x4'],
        ['16x4', '16x4'],
        ['20x2', '20x2'],
        ['8x2', '8x2'],
      ]), 'SIZE')
      .appendField('Address')
      .appendField(new Blockly.FieldTextInput('0x27'), 'ADD')
      .appendField('Cursor')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Cr');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CATEGORY_COLORS.display);
    this.setTooltip('Initialize I2C LCD display with common sizes');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['lcd_i2c_lcdclear'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.display);
    this.setHelpUrl('');
    this.appendDummyInput()
      .appendField('Clear Lcd ')
      .appendField(new Blockly.FieldImage('/img/ico/lcd_ico.png', 120, 50, '*'));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.TECHNOZONE51_TEXT93);
  },
};

Blockly.Blocks['lcd_i2c_lcdwrite'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/lcd_ico.png', 120, 50, '*'));
    this.appendValueInput('TEXT')
      .appendField('Write In')
      .appendField('Col')
      .appendField(new Blockly.FieldTextInput('0'), 'Col')
      .appendField('Row')
      .appendField(new Blockly.FieldTextInput('0'), 'Row');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CATEGORY_COLORS.display);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
