import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, PinTypes } from '../../arduino/generator';

Arduino.forBlock['motor_servo'] = function (block: Blockly.Block): string {
  const command = block.getFieldValue('COMMAND') || 'init';
  const varName = block.getField('VAR')?.getText() || 'myServo';

  if (!varName.trim()) {
    return '// Error: Servo variable name cannot be empty\n';
  }

  switch (command) {
    case 'init': {
      const pin = block.getFieldValue('PIN') || '9';
      Arduino.reservePin(block, pin, PinTypes.SERVO, 'Servo');
      Arduino.addInclude('include-Servo', '#include <Servo.h>');
      Arduino.addDeclaration('define_Servo_' + varName, `Servo ${varName};`);
      Arduino.addSetup('setup_Servo_' + varName, `  ${varName}.attach(${pin});`, true);
      return '';
    }
    case 'write': {
      block.setWarningText(null, 'Servo');
      const angle = block.getFieldValue('ANGLE') ?? 90;
      return `${varName}.write(${angle});\n`;
    }
    case 'attach':
      block.setWarningText(null, 'Servo');
      return `${varName}.attach();\n`;
    case 'detach':
      block.setWarningText(null, 'Servo');
      return `${varName}.detach();\n`;
    default:
      return '';
  }
};

Arduino.forBlock['l293'] = function (block: Blockly.Block): string {
  const command = block.getFieldValue('COMMAND') || 'init';
  const varName = block.getField('VAR')?.getText() || 'MT';

  if (command === 'init') {
    const pin0 = block.getFieldValue('PIN0');
    const pin1 = block.getFieldValue('PIN1');
    const pin2 = block.getFieldValue('PIN2');
    const pin3 = block.getFieldValue('PIN3');

    Arduino.reservePin(block, pin0, PinTypes.OUTPUT, 'DC Motor A1');
    Arduino.reservePin(block, pin1, PinTypes.OUTPUT, 'DC Motor A2');
    Arduino.reservePin(block, pin2, PinTypes.OUTPUT, 'DC Motor B1');
    Arduino.reservePin(block, pin3, PinTypes.OUTPUT, 'DC Motor B2');
    Arduino.addInclude('init-motor',
      `int ${varName}A1  = ${pin0};\nint ${varName}A2 = ${pin1};\nint ${varName}B1 = ${pin2};\nint ${varName}B2 = ${pin3};\nint ${varName}Speed = 200;`
    );

    Arduino.addSetup('setup_motor',
      `pinMode(${varName}A1, OUTPUT);\n  pinMode(${varName}A2, OUTPUT);\n  pinMode(${varName}B1, OUTPUT);\n  pinMode(${varName}B2, OUTPUT);`,
      true
    );

    Arduino.addFunction('FuncForward',
      `void ${varName}_Forward(){\n  analogWrite(${varName}A1, 0);\n  analogWrite(${varName}A2, ${varName}Speed);\n  analogWrite(${varName}B1, 0);\n  analogWrite(${varName}B2, ${varName}Speed);\n}`
    );
    Arduino.addFunction('FuncBackward',
      `void ${varName}_Backward(){\n  analogWrite(${varName}A1, ${varName}Speed);\n  analogWrite(${varName}A2, 0);\n  analogWrite(${varName}B1, ${varName}Speed);\n  analogWrite(${varName}B2, 0);\n}`
    );
    Arduino.addFunction('FuncLeft',
      `void ${varName}_Left(){\n  analogWrite(${varName}A1, ${varName}Speed);\n  analogWrite(${varName}A2, 0);\n  analogWrite(${varName}B1, 0);\n  analogWrite(${varName}B2, ${varName}Speed);\n}`
    );
    Arduino.addFunction('FuncRight',
      `void ${varName}_Right(){\n  analogWrite(${varName}A1, 0);\n  analogWrite(${varName}A2, ${varName}Speed);\n  analogWrite(${varName}B1, ${varName}Speed);\n  analogWrite(${varName}B2, 0);\n}`
    );
    Arduino.addFunction('FuncStop',
      `void ${varName}_Stop(){\n  analogWrite(${varName}A1, 0);\n  analogWrite(${varName}A2, 0);\n  analogWrite(${varName}B1, 0);\n  analogWrite(${varName}B2, 0);\n}`
    );

    return '';
  }

  if (command === 'SetSpeed') {
    block.setWarningText(null, 'DC Motor');
    const speed = block.getFieldValue('SPEED') ?? 200;
    return `${varName}Speed = ${speed};\n`;
  }

  // Forward, Backward, Left, Right, Stop
  block.setWarningText(null, 'DC Motor');
  return `${varName}_${command}();\n`;
};

Arduino.forBlock['L293_Motor_Shield'] = function (block: Blockly.Block): string {
  const command = block.getFieldValue('COMMAND') || 'init';
  const varName = block.getField('VAR')?.getText() || 'MS';

  if (!varName.trim()) {
    return '// Error: Motor Shield variable name cannot be empty\n';
  }

  switch (command) {
    case 'init': {
      const motorNum = block.getFieldValue('MOTOR') || '1';
      Arduino.addInclude('include-AFMotor', '#include <AFMotor.h>');
      Arduino.addDeclaration('declare_motor_' + varName, `AF_DCMotor ${varName}(${motorNum});`);
      return '';
    }
    case 'Forward':
      block.setWarningText(null, 'L293 Shield');
      return `${varName}.run(FORWARD);\n`;
    case 'Backward':
      block.setWarningText(null, 'L293 Shield');
      return `${varName}.run(BACKWARD);\n`;
    case 'Stop':
      block.setWarningText(null, 'L293 Shield');
      return `${varName}.run(RELEASE);\n`;
    case 'SetSpeed': {
      block.setWarningText(null, 'L293 Shield');
      const speed = block.getFieldValue('SPEED') ?? 200;
      return `${varName}.setSpeed(${speed});\n`;
    }
    default:
      return '';
  }
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
