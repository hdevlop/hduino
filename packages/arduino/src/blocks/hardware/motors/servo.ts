import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../../theme';
import { Arduino } from '../../../arduino/boards';
import { FieldVariableCreateOnly } from '../../../fields/FieldVariableCreateOnly';

Blockly.Blocks['motor_servo_init'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/motorServo_ico.png', 140, 40, '*'));

    this.appendDummyInput('COMMAND_ROW')
      .appendField('Init')
      .appendField(new FieldVariableCreateOnly('myServo'), 'VAR')
      .appendField(' To ')
      .appendField(new Blockly.FieldDropdown(Arduino.PwmPins), 'PIN');

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Initialize servo motor and attach to pin');
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'pwmPins', workspace);
  },
};

Blockly.Blocks['motor_servo_write'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Servo')
      .appendField(new FieldVariableCreateOnly('myServo'), 'VAR')
      .appendField(' Write ')
      .appendField(new Blockly.FieldNumber(90, 0, 180), 'ANGLE')
      .appendField('deg');

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Write angle to servo motor (0-180 degrees)');
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
};

Blockly.Blocks['motor_servo_attach'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Servo')
      .appendField(new FieldVariableCreateOnly('myServo'), 'VAR')
      .appendField(' Attach');

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Re-attach servo motor to its pin');
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
};

Blockly.Blocks['motor_servo_detach'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Servo')
      .appendField(new FieldVariableCreateOnly('myServo'), 'VAR')
      .appendField(' Detach');

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Detach servo motor from its pin');
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
};
