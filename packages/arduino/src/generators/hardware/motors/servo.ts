import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, PinTypes } from '../../../arduino/generator';

Arduino.forBlock['motor_servo_init'] = function (block: Blockly.Block): string {
  const varName = block.getField('VAR')?.getText() || 'myServo';

  if (!varName.trim()) {
    return '// Error: Servo variable name cannot be empty\n';
  }

  const pin = block.getFieldValue('PIN') || '9';
  Arduino.reservePin(block, pin, PinTypes.SERVO, 'Servo');
  Arduino.addInclude('include-Servo', '#include <Servo.h>');
  Arduino.addDeclaration('define_Servo_' + varName, `Servo ${varName};`);
  Arduino.addSetup('setup_Servo_' + varName, `  ${varName}.attach(${pin});`, true);
  return '';
};

Arduino.forBlock['motor_servo_write'] = function (block: Blockly.Block): string {
  const varName = block.getField('VAR')?.getText() || 'myServo';

  if (!varName.trim()) {
    return '// Error: Servo variable name cannot be empty\n';
  }

  block.setWarningText(null, 'Servo');
  const angle = block.getFieldValue('ANGLE') ?? 90;
  return `${varName}.write(${angle});\n`;
};

Arduino.forBlock['motor_servo_attach'] = function (block: Blockly.Block): string {
  const varName = block.getField('VAR')?.getText() || 'myServo';

  if (!varName.trim()) {
    return '// Error: Servo variable name cannot be empty\n';
  }

  block.setWarningText(null, 'Servo');
  return `${varName}.attach();\n`;
};

Arduino.forBlock['motor_servo_detach'] = function (block: Blockly.Block): string {
  const varName = block.getField('VAR')?.getText() || 'myServo';

  if (!varName.trim()) {
    return '// Error: Servo variable name cannot be empty\n';
  }

  block.setWarningText(null, 'Servo');
  return `${varName}.detach();\n`;
};
