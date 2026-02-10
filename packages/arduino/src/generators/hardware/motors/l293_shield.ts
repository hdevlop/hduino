import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino } from '../../../arduino/generator';

Arduino.forBlock['L293_Motor_Shield_Init'] = function (block: Blockly.Block): string {
  const varName = block.getField('VAR')?.getText() || 'MS';

  if (!varName.trim()) {
    return '// Error: Motor Shield variable name cannot be empty\n';
  }

  const motorNum = block.getFieldValue('MOTOR') || '1';
  Arduino.addInclude('include-AFMotor', '#include <AFMotor.h>');
  Arduino.addDeclaration('declare_motor_' + varName, `AF_DCMotor ${varName}(${motorNum});`);
  return '';
};

Arduino.forBlock['L293_Motor_Shield_Movement'] = function (block: Blockly.Block): string {
  const varName = block.getField('VAR')?.getText() || 'MS';
  const direction = block.getFieldValue('DIRECTION') || 'Forward';

  if (!varName.trim()) {
    return '// Error: Motor Shield variable name cannot be empty\n';
  }

  block.setWarningText(null, 'L293 Shield');

  // Special handling for Stop - use RELEASE for AFMotor library
  const command = direction === 'Stop' ? 'RELEASE' : direction.toUpperCase();
  return `${varName}.run(${command});\n`;
};

Arduino.forBlock['L293_Motor_Shield_SetSpeed'] = function (block: Blockly.Block): string {
  const varName = block.getField('VAR')?.getText() || 'MS';
  const speed = block.getFieldValue('SPEED') ?? 200;

  if (!varName.trim()) {
    return '// Error: Motor Shield variable name cannot be empty\n';
  }

  block.setWarningText(null, 'L293 Shield');
  return `${varName}.setSpeed(${speed});\n`;
};

Arduino.forBlock['L293_Motor_Shield_InitAll'] = function (block: Blockly.Block): string {
  const varM1 = block.getField('VAR_M1')?.getText() || 'M1';
  const varM2 = block.getField('VAR_M2')?.getText() || 'M2';
  const varM3 = block.getField('VAR_M3')?.getText() || 'M3';
  const varM4 = block.getField('VAR_M4')?.getText() || 'M4';

  Arduino.addInclude('include-AFMotor', '#include <AFMotor.h>');
  Arduino.addDeclaration('declare_motor_' + varM1, `AF_DCMotor ${varM1}(1);`);
  Arduino.addDeclaration('declare_motor_' + varM2, `AF_DCMotor ${varM2}(2);`);
  Arduino.addDeclaration('declare_motor_' + varM3, `AF_DCMotor ${varM3}(3);`);
  Arduino.addDeclaration('declare_motor_' + varM4, `AF_DCMotor ${varM4}(4);`);
  return '';
};
