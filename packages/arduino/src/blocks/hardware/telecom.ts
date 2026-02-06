import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Arduino } from '../../arduino/boards';
import { Types } from '../../arduino/types';

Blockly.Blocks['bluetooth_init'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/Bluetooth.png', 35, 35))
      .appendField('', 'VAR')
      .appendField('RX ')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN1')
      .appendField('TX ')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN0')
      .appendField(new Blockly.FieldDropdown([['9600', '9600'], ['19200', '19200'], ['57600', '57600'], ['115200', '115200'], ['250000', '250000']]), 'SPEED');
    this.setColour(CATEGORY_COLORS.telecom);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
};

Blockly.Blocks['bluetooth_receive'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/Bluetooth.png', 35, 35))
      .appendField('Data Received ??');
    this.setOutput(true, null);
    this.setColour(CATEGORY_COLORS.telecom);
    this.setTooltip(Blockly.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
};

Blockly.Blocks['bluetooth_receive_byte'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/Bluetooth.png', 35, 35))
      .appendField('Receive byte');
    this.setOutput(true, null);
    this.setColour(CATEGORY_COLORS.telecom);
    this.setTooltip(Blockly.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
};

Blockly.Blocks['bluetooth_write'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl(Blockly.Msg.TEXT_APPEND_HELPURL);
    this.setColour(CATEGORY_COLORS.telecom);
    this.appendValueInput('BT')
      .appendField(new Blockly.FieldImage('/img/ico/Bluetooth.png', 35, 35))
      .appendField('bluetooth Write');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    const thisBlock = this;
    this.setTooltip(function () {
      return Blockly.Msg.TEXT_APPEND_TOOLTIP.replace('%1',
        thisBlock.getFieldValue('VAR'));
    });
  },
  getVarType: function () {
    return Types.TEXT;
  },
};
