import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Types, getChildBlockType, getValidTypeArray } from '../../arduino/types';
import { Arduino } from '../../arduino/boards';

/**
 * Variable blocks
 * Includes: get, set, typed init, type casting, pin constants
 */

/**
 * Block: variables_get
 * Gets a variable value
 */
Blockly.Blocks['variables_get'] = {
  init: function (this: Blockly.Block) {
    this.jsonInit({
      message0: '%1',
      args0: [
        {
          type: 'field_variable',
          name: 'VAR',
          variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
        },
      ],
      output: null,
      colour: CATEGORY_COLORS.variables,
      helpUrl: '%{BKY_VARIABLES_GET_HELPURL}',
      tooltip: '%{BKY_VARIABLES_GET_TOOLTIP}',
      extensions: ['contextMenu_variableSetterGetter'],
    });
  },
  getBlockType: function (this: Blockly.Block) {
    return [Types.UNDEF, this.getFieldValue('VAR')];
  },
  getVarType: function (this: Blockly.Block) {
    return getChildBlockType(this);
  },
};

/**
 * Block: variables_set
 * Sets a variable to a value
 */
Blockly.Blocks['variables_set'] = {
  init: function (this: Blockly.Block) {
    this.jsonInit({
      type: 'variables_set',
      message0: '%{BKY_VARIABLES_SET}',
      args0: [
        {
          type: 'field_variable',
          name: 'VAR',
          variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
        },
        {
          type: 'input_value',
          name: 'VALUE',
        },
      ],
      previousStatement: null,
      nextStatement: null,
      tooltip: '%{BKY_VARIABLES_SET_TOOLTIP}',
      helpUrl: '%{BKY_VARIABLES_SET_HELPURL}',
      extensions: ['contextMenu_variableSetterGetter'],
      colour: CATEGORY_COLORS.variables,
    });
  },
  getBlockType: function (this: Blockly.Block) {
    return [Types.UNDEF, this.getFieldValue('VAR')];
  },
  getVarType: function (this: Blockly.Block) {
    return getChildBlockType(this);
  },
};

/**
 * Block: variables_set_type
 * Casts a value to a specific Arduino type
 */
Blockly.Blocks['variables_set_type'] = {
  init: function (this: Blockly.Block) {
    this.setHelpUrl('http://arduino.cc/en/Reference/HomePage');
    this.setColour(CATEGORY_COLORS.variables);
    this.appendValueInput('VARIABLE_SETTYPE_INPUT');
    this.appendDummyInput()
      .appendField(Blockly.Msg.VARIABLES_AS)
      .appendField(
        new Blockly.FieldDropdown(getValidTypeArray()),
        'VARIABLE_SETTYPE_TYPE'
      );
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Sets a value to a specific type');
  },
  getBlockType: function (this: Blockly.Block) {
    const blocklyTypeKey = this.getFieldValue('VARIABLE_SETTYPE_TYPE');
    return (Types as Record<string, any>)[blocklyTypeKey];
  },
};

/**
 * Block: variables_const
 * Declares a constant variable with a value
 */
Blockly.Blocks['variables_const'] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('VALUE')
      .appendField('constant')
      .appendField(new Blockly.FieldVariable(Blockly.Msg.VARIABLES_DEFAULT_NAME), 'VAR')
      .appendField('set');
    this.setColour(CATEGORY_COLORS.variables);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly.Msg.HELPURL);
    (this as any).contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
  },
  contextMenuType_: 'variables_get',
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu,
  getVarType: function (this: Blockly.Block) {
    return getChildBlockType(this);
  },
};

/**
 * Block: variables_set_init
 * Declares a typed variable with an initial value
 */
Blockly.Blocks['variables_set_init'] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('VALUE')
      .appendField('initialize')
      .appendField(new Blockly.FieldVariable(Blockly.Msg.VARIABLES_DEFAULT_NAME), 'VAR')
      .appendField(Blockly.Msg.VARIABLES_AS)
      .appendField(
        new Blockly.FieldDropdown(getValidTypeArray()),
        'VARIABLE_SETTYPE_TYPE'
      )
      .appendField('to');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CATEGORY_COLORS.variables);
    this.setHelpUrl(Blockly.Msg.var_set_init_helpurl);
    this.setTooltip(Blockly.Msg.var_set_init_tooltip);
    (this as any).contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
  },
  contextMenuType_: 'variables_get',
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu,
  getVarType: function (this: Blockly.Block) {
    return getChildBlockType(this);
  },
};


/**
 * Block: io_VarIN
 * Declares a pin constant for an INPUT pin
 */
Blockly.Blocks['io_VarIN'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(Blockly.Msg.VARIABLES_SET_CONST)
      .appendField('IN')
      .appendField(new Blockly.FieldVariable(Blockly.Msg.VARIABLES_DEFAULT_NAME), 'VAR')
      .appendField(Blockly.Msg.ARD_WRITE_TO)
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN');
    this.setColour(CATEGORY_COLORS.variables);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
};

/**
 * Block: io_VarOut
 * Declares a pin constant for an OUTPUT pin
 */
Blockly.Blocks['io_VarOut'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(Blockly.Msg.VARIABLES_SET_CONST)
      .appendField('OUT')
      .appendField(new Blockly.FieldVariable(Blockly.Msg.VARIABLES_DEFAULT_NAME), 'VAR')
      .appendField(Blockly.Msg.ARD_WRITE_TO)
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN');
    this.setColour(CATEGORY_COLORS.variables);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
};
