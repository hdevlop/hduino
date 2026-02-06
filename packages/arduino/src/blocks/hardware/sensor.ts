import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Arduino } from '../../arduino/boards';
import { Types } from '../../arduino/types';
import { FieldVariableCreateOnly } from '../../fields/FieldVariableCreateOnly';

Blockly.Blocks['Ultrasonic'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/ultrason_ico.png', 64, 45, '*'))
      .appendField('Ultrasonic')
      .appendField(new FieldVariableCreateOnly('myUltrasonic'), 'VAR');
    this.appendDummyInput()
      .appendField(Blockly.Msg.VARIABLES_SET_CONST)
      .appendField('Trig   to')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN0');
    this.appendDummyInput()
      .appendField(Blockly.Msg.VARIABLES_SET_CONST)
      .appendField('Echo to')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN1');
    this.setColour(CATEGORY_COLORS.sensors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN0', 'AllPins', workspace);
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN1', 'AllPins', workspace);
  },
};

Blockly.Blocks['Ultrasonic_read'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
    this.setColour(CATEGORY_COLORS.sensors);
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/ultrason_ico.png', 60, 45, '*'))
      .appendField('Distance Of')
      .appendField(new FieldVariableCreateOnly('myUltrasonic'), 'VAR');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.ARD_DIGITALREAD_TIP);
  },
  getBlockType: function () {
    return Types.NUMBER;
  },
};

Blockly.Blocks['SENSOR_dht11'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl('');
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/DHT11_ico.png', 60, 45, '*'))
      .appendField(new Blockly.FieldDropdown([['Humidity', 'h'], ['Temperature', 't']]), 'choix')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN')
      .appendField(Blockly.Msg.pin);
    this.setOutput(true, 'Number');
    this.setTooltip('returns moisture (from 0 to 100%) temperature (from 0 to 80 degrees Celsius) received by the sensor');
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPins', workspace);
  },
};

Blockly.Blocks['SENSOR_line_follower'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl(Blockly.Msg.HELPURL);
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/line_follower.png', 100, 35, '*'))
      .appendField('Line detected At')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN')
    this.setOutput(true, 'Boolean');
    this.setTooltip('returns true (false) if a black line is (not) detected');
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPins', workspace);
  },

};

Blockly.Blocks['SENSOR_lm35'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl('');
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/lm35_ico.png', 32, 50, '*'))
      .appendField('temperature of ')
      .appendField(new Blockly.FieldDropdown(Arduino.analogPins), 'PIN');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.lm35_2);
  },
  getBlockType: function () {
    return Types.NUMBER;
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'analogPins', workspace);
  },
};

Blockly.Blocks['SENSOR_light_sensor'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl('');
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/ldr_ico.png', 40, 40, '*'))
      .appendField('daylight In ')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN');
    this.setOutput(true, 'Number');
    this.setTooltip('returns a value based on brightness: darkness:full light');
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPins', workspace);
  },
  getBlockType: function () {
    return Types.NUMBER;
  },
};

Blockly.Blocks['SENSOR_PIR'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl('');
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/pir_ico.png', 40, 40, '*'))
      .appendField('Motion State In ')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN');
    this.setOutput(true, 'Number');
    this.setTooltip('returns true if motion is detected');
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPins', workspace);
  },
};

Blockly.Blocks['RFID_module'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl(Blockly.Msg.RFID_HELPURL);
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.RFID_module_TEXT)
      .appendField(new Blockly.FieldImage('/img/ico/module_rfid.png', 100, 50, '*'));
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField('CS')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'CS_PIN');
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField('RST')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'RST_PIN');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.RFID_module_TOOLTIP);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'CS_PIN', 'AllPins', workspace);
    Arduino.Boards.refreshBlockFieldDropdown(this, 'RST_PIN', 'AllPins', workspace);
  },
};
