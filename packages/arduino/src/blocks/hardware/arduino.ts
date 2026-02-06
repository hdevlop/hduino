import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Arduino } from '../../arduino/boards';
import { Types } from '../../arduino/types';

// === Basic blocks ===

Blockly.Blocks['base_begin'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.arduino);
    this.setHelpUrl(Blockly.Msg.ARDUINO_BASE_SETUP_HELPURL);
    this.appendDummyInput('')
      .appendField(Blockly.Msg.ARDUINO_BASE_BEGIN);
    this.appendStatementInput('base_begin');
    this.setTooltip("Exécuté seulement dans le 'Setup'");
  },
  getArduinoLoopsInstance: function () {
    return true;
  },
};

Blockly.Blocks['pinmode'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.arduino);
    this.setHelpUrl(Blockly.Msg.ARDUINO_INOUT_DIGITAL_MODE_HELPURL || 'http://arduino.cc/en/Reference/PinMode');
    this.appendDummyInput('')
      .appendField(new Blockly.FieldDropdown([
        ['INPUT', 'INPUT'],
        ['OUTPUT', 'OUTPUT'],
        ['INPUT_PULLUP', 'INPUT_PULLUP'],
      ]), 'PINMODE');
    this.setOutput(true, 'Null');
    this.setTooltip(Blockly.Msg.ARDUINO_INOUT_DIGITAL_MODE_TOOLTIP || 'Set the pin mode');
  },
};

Blockly.Blocks['base_define_name'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput(''), 'NAME');
    this.setOutput(true, 'Null');
    const thisBlock = this;
    this.setTooltip(function () {
      const parent = thisBlock.getParent();
      return (parent && parent.getInputsInline() && parent.tooltip) ||
        Blockly.Msg.TEXT_TEXT_TOOLTIP;
    });
  },
};

Blockly.Blocks['base_define'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl(Blockly.Msg.ARDUINO_BASE_DEFINE_CONST_HELPURL);
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendValueInput('NAME')
      .setCheck('Null')
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.ARDUINO_BASE_DEFINE_CONST_INPUT1);
    this.appendDummyInput()
      .appendField(' Pin ')
      .appendField(new Blockly.FieldDropdown([['0', '0']]), 'PIN');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARDUINO_BASE_DEFINE_CONST_TOOLTIP);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'digitalPins', workspace);
  },
};

Blockly.Blocks['base_setup'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.arduino);
    this.setHelpUrl(Blockly.Msg.ARDUINO_BASE_SETUP_HELPURL);
    this.appendDummyInput('')
      .appendField(Blockly.Msg.ARDUINO_BASE_SETUP);
    this.appendStatementInput('DO');
    this.setTooltip("Exécuté seulement dans le 'Setup'");
  },
  getArduinoLoopsInstance: function () {
    return true;
  },
};

Blockly.Blocks['base_setup_loop'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARDUINO_BASE_SETUP);
    this.appendStatementInput('SETUP_FUNC');
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARDUINO_BASE_LOOP);
    this.appendStatementInput('LOOP_FUNC');
    this.setInputsInline(false);
    this.setColour(CATEGORY_COLORS.arduino);
    this.setTooltip("Définis le 'setup()' et le 'loop()'");
    this.setHelpUrl('https://arduino.cc/en/Reference/Loop');
    this.contextMenu = false;
  },
  getArduinoLoopsInstance: function () {
    return true;
  },
};

Blockly.Blocks['base_loop'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.arduino);
    this.setHelpUrl(Blockly.Msg.ARDUINO_BASE_SETUP_LOOP_HELPURL);
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARDUINO_BASE_LOOP);
    this.appendStatementInput('LOOP_FUNC');
    this.setInputsInline(false);
    this.setTooltip("Exécuté seulement dans le 'Loop'");
    this.contextMenu = false;
  },
  getArduinoLoopsInstance: function () {
    return true;
  },
};

Blockly.Blocks['base_define_bloc'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.arduino);
    this.setHelpUrl(Blockly.Msg.ARDUINO_BASE_DEFINE_HELPURL);
    this.appendDummyInput('')
      .appendField(Blockly.Msg.ARDUINO_BASE_DEFINE);
    this.appendStatementInput('DO')
      .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);
    this.setTooltip(Blockly.Msg.ARDUINO_BASE_DEFINE_TOOLTIP);
  },
};

Blockly.Blocks['base_code'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARDUINO_BASE_CODE)
      .appendField(new Blockly.FieldTextInput(''), 'TEXT');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.TEXT_TEXT_TOOLTIP);
  },
};

Blockly.Blocks['base_comment'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl(Blockly.Msg.ARDUINO_BASE_COMMENT_HELPURL);
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARDUINO_BASE_COMMENT_TEXT)
      .appendField(new Blockly.FieldTextInput(''), 'TEXT');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.TEXT_TEXT_TOOLTIP);
  },
};

Blockly.Blocks['base_end'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl('');
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARDUINO_BASE_END);
    this.setPreviousStatement(true, null);
    this.setTooltip(Blockly.Msg.END_TOOLTIP);
  },
};

// === I/O blocks ===

Blockly.Blocks['io_digitalwrite_Var'] = {
  init: function (this: Blockly.Block) {
    this.jsonInit({
      type: 'io_digitalwrite_Var',
      message0: 'set digital %1 to %2',
      args0: [
        {
          type: 'input_value',
          name: 'VAR',
        },
        {
          type: 'field_dropdown',
          name: 'STATE',
          options: [
            ['ON', 'HIGH'],
            ['OFF', 'LOW'],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.arduino,
      tooltip: '',
      helpUrl: '',
    });
  },
  getBlockType: function () {
    return Types.NUMBER;
  },
};

Blockly.Blocks['io_digitalwrite'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendValueInput('STATE')
      .appendField(Blockly.Msg.ARD_DIGITALWRITE)
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN')
      .appendField(Blockly.Msg.ARD_WRITE_TO)
      .setCheck('Boolean');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_DIGITALWRITE_TIP);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPins', workspace);
  },
};

Blockly.Blocks['io_digitalreadVar'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput()
      .appendField('read digital pin ')
      .appendField(new Blockly.FieldVariable('item'), 'VAR');
    this.setOutput(true, 'Boolean');
    this.setTooltip(Blockly.Msg.ARD_DIGITALREAD_TIP);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'digitalPins', workspace);
  },
};

Blockly.Blocks['io_digitalread'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARD_DIGITALREAD)
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN');
    this.setOutput(true, 'Boolean');
    this.setTooltip(Blockly.Msg.ARD_DIGITALREAD_TIP);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPins', workspace);
  },
  getBlockType: function () {
    return Types.NUMBER;
  },
};

Blockly.Blocks['io_builtin_led'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARD_BUILTIN_LED)
      .appendField(new Blockly.FieldDropdown(Arduino.BuiltinLed), 'BUILT_IN_LED')
      .appendField('to')
      .appendField(new Blockly.FieldDropdown([['ON', 'HIGH'], ['OFF', 'LOW']]), 'STATE');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_BUILTIN_LED_TIP);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'BUILT_IN_LED', 'builtinLed', workspace);
  },
  getBlockType: function () {
    return Types.BOOLEAN;
  },
};

Blockly.Blocks['io_analogwrite'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogWrite');
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendValueInput('NUM')
      .appendField(Blockly.Msg.ARD_ANALOGWRITE)
      .appendField(new Blockly.FieldDropdown(Arduino.PwmPins), 'PIN')
      .appendField(Blockly.Msg.ARD_WRITE_TO)
      .setCheck('Number');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_ANALOGWRITE_TIP);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'pwmPins', workspace);
  },
  getBlockType: function () {
    return Types.NUMBER;
  },
};

Blockly.Blocks['io_analogreadVar'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput()
      .appendField('read analog ')
      .appendField(new Blockly.FieldVariable('item'), 'VAR');
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.ARD_ANALOGREAD_TIP);
  },
  getBlockType: function () {
    return Types.NUMBER;
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'analogPins', workspace);
  },
};

Blockly.Blocks['io_analogread'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARD_ANALOGREAD)
      .appendField(new Blockly.FieldDropdown(Arduino.AllPinsAnalog), 'PIN');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.ARD_ANALOGREAD_TIP);
  },
  getBlockType: function () {
    return Types.NUMBER;
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPinsAnalog', workspace);
  },
};

Blockly.Blocks['io_highlow'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([['ON', 'HIGH'], ['OFF', 'LOW']]), 'STATE');
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
  },
  getBlockType: function () {
    return Types.BOOLEAN;
  },
};
