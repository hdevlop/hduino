import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../../theme';
import { FieldVariableCreateOnly } from '../../../fields/FieldVariableCreateOnly';

Blockly.Blocks['L293_Motor_Shield_InitAll'] = {
  init: function (this: Blockly.Block) {

    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('Ada Motor Shield Init All Pins')

    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField(new Blockly.FieldImage('/img/ico/shieldL293.png', 120, 93, '*'));

    this.appendDummyInput('M1_ROW')
      .appendField('  M1 ')
      .appendField(new FieldVariableCreateOnly('M1'), 'VAR_M1')
      .appendField('  M2 ')
      .appendField(new FieldVariableCreateOnly('M2'), 'VAR_M2');

    this.appendDummyInput('M2_ROW')
      .appendField('  M3 ')
      .appendField(new FieldVariableCreateOnly('M3'), 'VAR_M3')
      .appendField('  M4 ')
      .appendField(new FieldVariableCreateOnly('M4'), 'VAR_M4');

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Initialize all 4 motors on L293 Motor Shield');
    this.setHelpUrl('');
  },
};


Blockly.Blocks['L293_Motor_Shield_Init'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Ada Motor Shield');

    this.appendDummyInput('COMMAND_ROW')
      .appendField('Init')
      .appendField(new FieldVariableCreateOnly('MS'), 'VAR')
      .appendField(new Blockly.FieldDropdown([
        ['M1', '1'],
        ['M2', '2'],
        ['M3', '3'],
        ['M4', '4'],
      ]), 'MOTOR');

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Initialize single motor on Adafruit L293 Motor Shield');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['L293_Motor_Shield_Movement'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Ada Motor Shield')
      .appendField(new FieldVariableCreateOnly('MS'), 'VAR')
      .appendField(new Blockly.FieldDropdown([
        ['Forward', 'Forward'],
        ['Backward', 'Backward'],
        ['Stop', 'Stop'],
      ]), 'DIRECTION');

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Control L293 Motor Shield direction and stop');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['L293_Motor_Shield_SetSpeed'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Ada Motor Shield')
      .appendField(new FieldVariableCreateOnly('MS'), 'VAR')
      .appendField(' Set Speed ')
      .appendField(new Blockly.FieldNumber(200, 0, 255), 'SPEED');

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Set speed for L293 Motor Shield (0-255)');
    this.setHelpUrl('');
  },
};
