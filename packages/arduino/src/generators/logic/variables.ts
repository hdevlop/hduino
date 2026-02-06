import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';
import { Types } from '../../arduino/types';

/**
 * Arduino code generators for variable blocks
 */

/**
 * Generator: variables_get
 * Returns the variable name
 */
Arduino.forBlock['variables_get'] = function(block: Blockly.Block): [string, number] {
  const code = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  return [code, Order.ATOMIC];
};

/**
 * Generator: variables_set
 * Assigns a value to a variable
 */
Arduino.forBlock['variables_set'] = function(block: Blockly.Block): string {
  const value = Arduino.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
  const varName = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  return varName + ' = ' + value + ';\n';
};

/**
 * Generator: variables_set_type
 * Casts a value to a specific Arduino type
 */
Arduino.forBlock['variables_set_type'] = function(block: Blockly.Block): [string, number] {
  const value = Arduino.valueToCode(block, 'VARIABLE_SETTYPE_INPUT', Order.ASSIGNMENT) || '0';
  const varType = Arduino.getArduinoType_((Types as Record<string, any>)[block.getFieldValue('VARIABLE_SETTYPE_TYPE')]);
  const code = '(' + varType + ')(' + value + ')';
  return [code, Order.ATOMIC];
};

/**
 * Generator: variables_const
 * Declares a constant variable with a value
 */
Arduino.forBlock['variables_const'] = function(block: Blockly.Block): string {
  const value = Arduino.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
  const varName = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  Arduino.variables_[varName] = 'const auto ' + varName + ' = ' + value + ';';
  return '';
};

/**
 * Generator: variables_set_init
 * Declares a typed variable with an initial value
 */
Arduino.forBlock['variables_set_init'] = function(block: Blockly.Block): string {
  const value = Arduino.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
  const varName = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  const varType = Arduino.getArduinoType_((Types as Record<string, any>)[block.getFieldValue('VARIABLE_SETTYPE_TYPE')]);
  Arduino.variables_[varName] = varType + ' ' + varName + ' = ' + value + ';';
  return '';
};

/**
 * Generator: io_VarIN
 * Declares a const pin variable and sets pinMode INPUT
 */
Arduino.forBlock['io_VarIN'] = function(block: Blockly.Block): string {
  const pin = block.getFieldValue('PIN') || '2';
  const varName = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );

  const pinSetupCode = '  pinMode(' + varName + ', INPUT);';
  Arduino.addSetup('io_' + varName, pinSetupCode, false);

  Arduino.variables_[varName] = 'const int ' + varName + ' = ' + pin + ';';
  return '';
};

/**
 * Generator: io_VarOut
 * Declares a const pin variable and sets pinMode OUTPUT
 */
Arduino.forBlock['io_VarOut'] = function(block: Blockly.Block): string {
  const pin = block.getFieldValue('PIN') || '2';
  const varName = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );

  const pinSetupCode = '  pinMode(' + varName + ', OUTPUT);';
  Arduino.addSetup('io_' + varName, pinSetupCode, false);

  Arduino.variables_[varName] = 'const int ' + varName + ' = ' + pin + ';';
  return '';
};

/**
 * Generator: io_2Var
 * Declares two const pin variables
 */
Arduino.forBlock['io_2Var'] = function(block: Blockly.Block): string {
  const pin0 = block.getFieldValue('PIN0') || '2';
  const varName0 = Arduino.nameDB_.getName(
    block.getFieldValue('VAR0'),
    Blockly.Names.NameType.VARIABLE
  );
  const pin1 = block.getFieldValue('PIN1') || '3';
  const varName1 = Arduino.nameDB_.getName(
    block.getFieldValue('VAR1'),
    Blockly.Names.NameType.VARIABLE
  );

  Arduino.variables_[varName0] = 'const int ' + varName0 + ' = ' + pin0 + ';';
  Arduino.variables_[varName1] = 'const int ' + varName1 + ' = ' + pin1 + ';';
  return '';
};
