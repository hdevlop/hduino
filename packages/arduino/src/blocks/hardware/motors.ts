import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Arduino } from '../../arduino/boards';
import { FieldVariableCreateOnly } from '../../fields/FieldVariableCreateOnly';

Blockly.Blocks['motor_servo'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/motorServo_ico.png', 140, 40, '*'));

    this.appendDummyInput('COMMAND_ROW')
      .appendField(new Blockly.FieldDropdown([
        ['Init', 'init'],
        ['Write', 'write'],
        ['Attach', 'attach'],
        ['Detach', 'detach'],
      ], function (this: Blockly.Field, option: string) {
        const block = this.getSourceBlock()!;
        const pinField = block.getField('PIN');
        const toLabel = block.getField('TO_LABEL');

        // Show/hide pin fields (only for Init)
        pinField!.setVisible(option === 'init');
        toLabel!.setVisible(option === 'init');

        // Show/hide angle fields (only for Write)
        const angleField = block.getField('ANGLE');
        const degLabel = block.getField('DEG_LABEL');
        if (angleField) angleField.setVisible(option === 'write');
        if (degLabel) degLabel.setVisible(option === 'write');

        return option;
      }), 'COMMAND')
      .appendField(new FieldVariableCreateOnly('myServo'), 'VAR')
      .appendField(' To ', 'TO_LABEL')
      .appendField(new Blockly.FieldDropdown(Arduino.PwmPins), 'PIN')
      .appendField(new Blockly.FieldNumber(90, 0, 180), 'ANGLE')
      .appendField('deg', 'DEG_LABEL');

    // Default to Init: hide angle fields
    this.getField('ANGLE')!.setVisible(false);
    this.getField('DEG_LABEL')!.setVisible(false);

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Servo motor: init, write angle, attach, or detach');
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'pwmPins', workspace);
  },
};

Blockly.Blocks['l293'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/icHBridgeL293D.png', 100, 45, '*'))
    this.appendDummyInput('COMMAND_ROW')
      .appendField(new Blockly.FieldDropdown([
        ['Init', 'init'],
        ['Forward', 'Forward'],
        ['Backward', 'Backward'],
        ['Left', 'Left'],
        ['Right', 'Right'],
        ['Stop', 'Stop'],
        ['Set Speed', 'SetSpeed'],
      ], function (this: Blockly.Field, option: string) {
        const block = this.getSourceBlock()!;
        const isInit = option === 'init';
        const isSetSpeed = option === 'SetSpeed';

        // Show/hide pin rows (only for Init)
        const motorAInput = block.getInput('MOTOR_A_ROW');
        const motorBInput = block.getInput('MOTOR_B_ROW');
        if (motorAInput) motorAInput.setVisible(isInit);
        if (motorBInput) motorBInput.setVisible(isInit);

        // Show/hide speed field (only for Set Speed)
        const speedField = block.getField('SPEED');
        if (speedField) speedField.setVisible(isSetSpeed);

        return option;
      }), 'COMMAND')
      .appendField(new FieldVariableCreateOnly('MT'), 'VAR')
      .appendField(new Blockly.FieldNumber(200, 0, 255), 'SPEED');

    this.appendDummyInput('MOTOR_A_ROW')
      .appendField('  MA1 ', 'MA1_LABEL')
      .appendField(new Blockly.FieldDropdown([['0', '0']]), 'PIN0')
      .appendField(' MA2 ', 'MA2_LABEL')
      .appendField(new Blockly.FieldDropdown([['1', '1']]), 'PIN1');

    this.appendDummyInput('MOTOR_B_ROW')
      .appendField('  MB1 ', 'MB1_LABEL')
      .appendField(new Blockly.FieldDropdown([['2', '2']]), 'PIN2')
      .appendField(' MB2 ', 'MB2_LABEL')
      .appendField(new Blockly.FieldDropdown([['3', '3']]), 'PIN3');

    // Default to Init: hide speed field
    this.getField('SPEED')!.setVisible(false);

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('DC Motor: init with pins, control direction, or set speed');
    this.setHelpUrl('');
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN0', 'digitalPins', workspace);
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN1', 'digitalPins', workspace);
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN2', 'digitalPins', workspace);
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN3', 'digitalPins', workspace);
  },
};

Blockly.Blocks['L293_Motor_Shield_InitAll'] = {
  init: function (this: Blockly.Block) {
    // Image header for InitAll
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/shieldL293.png', 100, 70, '*'));

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


Blockly.Blocks['L293_Motor_Shield'] = {
  init: function (this: Blockly.Block) {
    // Text header
    this.appendDummyInput()
      .appendField('Adafruit Motor Shield');

    // Command dropdown
    this.appendDummyInput('COMMAND_ROW')
      .appendField(new Blockly.FieldDropdown([
        ['Init', 'init'],
        ['Forward', 'Forward'],
        ['Backward', 'Backward'],
        ['Stop', 'Stop'],
        ['Set Speed', 'SetSpeed'],
      ], function (this: Blockly.Field, option: string) {
        const block = this.getSourceBlock()!;
        const isInit = option === 'init';
        const isSetSpeed = option === 'SetSpeed';

        // Show/hide single motor init fields
        const motorField = block.getField('MOTOR');
        if (motorField) motorField.setVisible(isInit);

        // Show/hide speed field (only for Set Speed)
        const speedField = block.getField('SPEED');
        if (speedField) speedField.setVisible(isSetSpeed);

        return option;
      }), 'COMMAND')
      .appendField(new FieldVariableCreateOnly('MS'), 'VAR')
      .appendField(new Blockly.FieldDropdown([
        ['M1', '1'],
        ['M2', '2'],
        ['M3', '3'],
        ['M4', '4'],
      ]), 'MOTOR')
      .appendField(new Blockly.FieldNumber(200, 0, 255), 'SPEED');

    // Default to Init: hide speed field
    this.getField('SPEED')!.setVisible(false);

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Adafruit L293 Motor Shield: init motor, control direction, or set speed');
    this.setHelpUrl('');
  },
};

