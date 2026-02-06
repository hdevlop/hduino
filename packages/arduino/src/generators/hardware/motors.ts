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

Arduino.forBlock['DC_Motor'] = function (block: Blockly.Block): string {
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
      `int ${varName}A1  = ${pin0};\nint ${varName}A2 = ${pin1};\nint ${varName}B1 = ${pin2};\nint ${varName}B2 = ${pin3};`
    );

    Arduino.addSetup('setup_motor',
      `pinMode(${varName}A1, OUTPUT);\n  pinMode(${varName}A2, OUTPUT);\n  pinMode(${varName}B1, OUTPUT);\n  pinMode(${varName}B2, OUTPUT);`,
      true
    );

    Arduino.addFunction('FuncForward',
      `void ${varName}_Forward(){\n  digitalWrite(${varName}A1, LOW);\n  digitalWrite(${varName}A2, HIGH);\n  digitalWrite(${varName}B1, LOW);\n  digitalWrite(${varName}B2, HIGH);\n}`
    );
    Arduino.addFunction('FuncBackward',
      `void ${varName}_Backward(){\n  digitalWrite(${varName}A1, HIGH);\n  digitalWrite(${varName}A2, LOW);\n  digitalWrite(${varName}B1, HIGH);\n  digitalWrite(${varName}B2, LOW);\n}`
    );
    Arduino.addFunction('FuncLeft',
      `void ${varName}_Left(){\n  digitalWrite(${varName}A1, HIGH);\n  digitalWrite(${varName}A2, LOW);\n  digitalWrite(${varName}B1, LOW);\n  digitalWrite(${varName}B2, HIGH);\n}`
    );
    Arduino.addFunction('FuncRight',
      `void ${varName}_Right(){\n  digitalWrite(${varName}A1, LOW);\n  digitalWrite(${varName}A2, HIGH);\n  digitalWrite(${varName}B1, HIGH);\n  digitalWrite(${varName}B2, LOW);\n}`
    );
    Arduino.addFunction('FuncStop',
      `void ${varName}_Stop(){\n  digitalWrite(${varName}A1, LOW);\n  digitalWrite(${varName}A2, LOW);\n  digitalWrite(${varName}B1, LOW);\n  digitalWrite(${varName}B2, LOW);\n}`
    );

    return '';
  }

  // Forward, Backward, Left, Right, Stop
  block.setWarningText(null, 'DC Motor');
  return `${varName}_${command}();\n`;
};
