import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Arduino } from '../../arduino/boards';
import { Types } from '../../arduino/types';

Blockly.Blocks['micros'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl(Blockly.Msg.ARDUINO_SINCE_PROGRAM_STARTED_HELPURL);
    this.appendDummyInput('')
      .appendField('micros');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.ARDUINO_SINCE_PROGRAM_STARTED_TOOLTIP);
  },
};

Blockly.Blocks['millis'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl(Blockly.Msg.ARDUINO_SINCE_PROGRAM_STARTED_HELPURL);
    this.appendDummyInput('')
      .appendField('millis');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.ARDUINO_SINCE_PROGRAM_STARTED_TOOLTIP);
  },
};

Blockly.Blocks['millis_sec'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl(Blockly.Msg.ARDUINO_SINCE_PROGRAM_STARTED_HELPURL);
    this.appendDummyInput('')
      .appendField('secondis');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.ARDUINO_SINCE_PROGRAM_STARTED_TOOLTIP);
  },
};

Blockly.Blocks['base_delay'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl(Blockly.Msg.ARDUINO_BASE_DELAY_HELPURL);
    this.appendValueInput('DELAY_TIME')
      .appendField(Blockly.Msg.ARDUINO_BASE_DELAY_DELAY_TIME)
      .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARDUINO_BASE_DELAY_TOOLTIP);
  },
};

Blockly.Blocks['base_delay_sec'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl(Blockly.Msg.ARDUINO_BASE_DELAY_HELPURL);
    this.appendValueInput('DELAY_TIME')
      .appendField(Blockly.Msg.ARDUINO_BASE_DELAY_DELAY_TIME_SEC)
      .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARDUINO_BASE_DELAY_TOOLTIP);
  },
};

Blockly.Blocks['tempo_no_delay'] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('DELAY_TIME')
      .setCheck('Number')
      .appendField(Blockly.Msg.ARDUINO_BASE_TEMPO1 || 'Every');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ['microseconds', 'u'],
        ['milliseconds', 'm'],
        ['seconds', 's'],
      ]), 'unite')
      .appendField(Blockly.Msg.ARDUINO_BASE_TEMPO2 || 'do');
    this.appendStatementInput('branche');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CATEGORY_COLORS.control);
    this.setTooltip(Blockly.Msg.ARDUINO_BASE_TEMPO_TOOLTIP || 'Execute code at regular intervals without blocking');
    this.setHelpUrl(Blockly.Msg.ARDUINO_BASE_TEMPO_HELPURL || 'http://arduino.cc/en/Reference/Millis');
  },
};

Blockly.Blocks['io_pulsein'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl('http://arduino.cc/en/Reference/pulseIn');
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARDUINO_PULSEIN || 'measure pulse on pin')
      .appendField(new Blockly.FieldDropdown([['0', '0']]), 'PIN')
      .appendField(Blockly.Msg.ARDUINO_INOUT_STAT || 'state')
      .appendField(new Blockly.FieldDropdown([
        ['HIGH', 'HIGH'],
        ['LOW', 'LOW'],
      ]), 'STAT');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setTooltip('Reads a pulse (either HIGH or LOW) on a pin. Returns the length of the pulse in microseconds.');
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'digitalPins', workspace);
  },
  getBlockType: function () {
    return Types.NUMBER;
  },
};

Blockly.Blocks['io_pulsein_timeout'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl('http://arduino.cc/en/Reference/pulseIn');
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARDUINO_PULSEIN || 'measure pulse on pin')
      .appendField(new Blockly.FieldDropdown([['0', '0']]), 'PIN')
      .appendField(Blockly.Msg.ARDUINO_INOUT_STAT || 'state')
      .appendField(new Blockly.FieldDropdown([
        ['HIGH', 'HIGH'],
        ['LOW', 'LOW'],
      ]), 'STAT');
    this.appendValueInput('TIMEOUT')
      .setCheck('Number')
      .appendField(Blockly.Msg.ARDUINO_PULSEIN_TIMEOUT || 'timeout');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setTooltip('Reads a pulse (either HIGH or LOW) on a pin with a timeout. Returns the length of the pulse in microseconds.');
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'digitalPins', workspace);
  },
  getBlockType: function () {
    return Types.NUMBER;
  },
};
