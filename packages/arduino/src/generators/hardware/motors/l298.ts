import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, PinTypes } from '../../../arduino/generator';

// Helper interface matching the block definition
interface L298InitBlock extends Blockly.Block {
  motorCount_: number;
  motorAHasEN_: boolean;
  motorBHasEN_: boolean;
}

Arduino.forBlock['l298_init'] = function (block: Blockly.Block): string {
  const initBlock = block as L298InitBlock;
  const varName = block.getField('VAR')?.getText() || 'MT';

  // Read mutation state with defaults for backward compatibility
  const motorCount = initBlock.motorCount_ ?? 2;
  const motorAHasEN = initBlock.motorAHasEN_ ?? true;
  const motorBHasEN = initBlock.motorBHasEN_ ?? true;

  // Get Motor A pins
  const pin0 = block.getFieldValue('PIN0');
  const pin1 = block.getFieldValue('PIN1');
  const pinENA = motorAHasEN ? block.getFieldValue('PIN_ENA') : null;

  // Reserve Motor A pins
  Arduino.reservePin(block, pin0, PinTypes.OUTPUT, 'L298 Motor A1');
  Arduino.reservePin(block, pin1, PinTypes.OUTPUT, 'L298 Motor A2');
  if (pinENA) {
    Arduino.reservePin(block, pinENA, PinTypes.PWM, 'L298 Motor A EN');
  }

  // Build variable declarations for Motor A
  let varDeclarations = `int ${varName}A1 = ${pin0};\nint ${varName}A2 = ${pin1};\n`;
  if (pinENA) {
    varDeclarations += `int ${varName}ENA = ${pinENA};\n`;
  }

  // Setup code for Motor A
  let setupCode = `  pinMode(${varName}A1, OUTPUT);\n  pinMode(${varName}A2, OUTPUT);\n`;
  if (pinENA) {
    setupCode += `  pinMode(${varName}ENA, OUTPUT);\n`;
  }

  // Get Motor B pins if motorCount === 2
  let pin2: string | null = null;
  let pin3: string | null = null;
  let pinENB: string | null = null;

  if (motorCount === 2) {
    pin2 = block.getFieldValue('PIN2');
    pin3 = block.getFieldValue('PIN3');
    pinENB = motorBHasEN ? block.getFieldValue('PIN_ENB') : null;

    // Reserve Motor B pins
    Arduino.reservePin(block, pin2, PinTypes.OUTPUT, 'L298 Motor B1');
    Arduino.reservePin(block, pin3, PinTypes.OUTPUT, 'L298 Motor B2');
    if (pinENB) {
      Arduino.reservePin(block, pinENB, PinTypes.PWM, 'L298 Motor B EN');
    }

    // Add Motor B variable declarations
    varDeclarations += `int ${varName}B1 = ${pin2};\nint ${varName}B2 = ${pin3};\n`;
    if (pinENB) {
      varDeclarations += `int ${varName}ENB = ${pinENB};\n`;
    }

    // Add Motor B setup code
    setupCode += `  pinMode(${varName}B1, OUTPUT);\n  pinMode(${varName}B2, OUTPUT);\n`;
    if (pinENB) {
      setupCode += `  pinMode(${varName}ENB, OUTPUT);\n`;
    }
  }

  // Add speed variable
  varDeclarations += `int ${varName}Speed = 200;`;

  // Add includes and setup
  Arduino.addInclude('init-motor_' + varName, varDeclarations);
  Arduino.addSetup('setup_motor_' + varName, setupCode, true);

  // Generate movement functions
  generateMovementFunctions(varName, motorCount, motorAHasEN, motorBHasEN, pinENA, pinENB);

  return '';
};

function generateMovementFunctions(
  varName: string,
  motorCount: number,
  motorAHasEN: boolean,
  motorBHasEN: boolean,
  pinENA: string | null,
  pinENB: string | null
) {
  // Forward function
  let forwardCode = `void ${varName}_Forward(){\n`;
  forwardCode += `  digitalWrite(${varName}A1, HIGH);\n  digitalWrite(${varName}A2, LOW);\n`;
  if (motorAHasEN && pinENA) {
    forwardCode += `  analogWrite(${varName}ENA, ${varName}Speed);\n`;
  }
  if (motorCount === 2) {
    forwardCode += `  digitalWrite(${varName}B1, HIGH);\n  digitalWrite(${varName}B2, LOW);\n`;
    if (motorBHasEN && pinENB) {
      forwardCode += `  analogWrite(${varName}ENB, ${varName}Speed);\n`;
    }
  }
  forwardCode += `}`;
  Arduino.addFunction('Func' + varName + '_Forward', forwardCode);

  // Backward function
  let backwardCode = `void ${varName}_Backward(){\n`;
  backwardCode += `  digitalWrite(${varName}A1, LOW);\n  digitalWrite(${varName}A2, HIGH);\n`;
  if (motorAHasEN && pinENA) {
    backwardCode += `  analogWrite(${varName}ENA, ${varName}Speed);\n`;
  }
  if (motorCount === 2) {
    backwardCode += `  digitalWrite(${varName}B1, LOW);\n  digitalWrite(${varName}B2, HIGH);\n`;
    if (motorBHasEN && pinENB) {
      backwardCode += `  analogWrite(${varName}ENB, ${varName}Speed);\n`;
    }
  }
  backwardCode += `}`;
  Arduino.addFunction('Func' + varName + '_Backward', backwardCode);

  // Stop function
  let stopCode = `void ${varName}_Stop(){\n`;
  stopCode += `  digitalWrite(${varName}A1, LOW);\n  digitalWrite(${varName}A2, LOW);\n`;
  if (motorAHasEN && pinENA) {
    stopCode += `  analogWrite(${varName}ENA, 0);\n`;
  }
  if (motorCount === 2) {
    stopCode += `  digitalWrite(${varName}B1, LOW);\n  digitalWrite(${varName}B2, LOW);\n`;
    if (motorBHasEN && pinENB) {
      stopCode += `  analogWrite(${varName}ENB, 0);\n`;
    }
  }
  stopCode += `}`;
  Arduino.addFunction('Func' + varName + '_Stop', stopCode);

  // Left and Right functions (only if motorCount === 2)
  if (motorCount === 2) {
    // Left function
    let leftCode = `void ${varName}_Left(){\n`;
    leftCode += `  digitalWrite(${varName}A1, LOW);\n  digitalWrite(${varName}A2, HIGH);\n`;
    if (motorAHasEN && pinENA) {
      leftCode += `  analogWrite(${varName}ENA, ${varName}Speed);\n`;
    }
    leftCode += `  digitalWrite(${varName}B1, HIGH);\n  digitalWrite(${varName}B2, LOW);\n`;
    if (motorBHasEN && pinENB) {
      leftCode += `  analogWrite(${varName}ENB, ${varName}Speed);\n`;
    }
    leftCode += `}`;
    Arduino.addFunction('Func' + varName + '_Left', leftCode);

    // Right function
    let rightCode = `void ${varName}_Right(){\n`;
    rightCode += `  digitalWrite(${varName}A1, HIGH);\n  digitalWrite(${varName}A2, LOW);\n`;
    if (motorAHasEN && pinENA) {
      rightCode += `  analogWrite(${varName}ENA, ${varName}Speed);\n`;
    }
    rightCode += `  digitalWrite(${varName}B1, LOW);\n  digitalWrite(${varName}B2, HIGH);\n`;
    if (motorBHasEN && pinENB) {
      rightCode += `  analogWrite(${varName}ENB, ${varName}Speed);\n`;
    }
    rightCode += `}`;
    Arduino.addFunction('Func' + varName + '_Right', rightCode);
  }
}

Arduino.forBlock['l298_movement'] = function (block: Blockly.Block): string {
  const varName = block.getField('VAR')?.getText() || 'MT';
  const direction = block.getFieldValue('DIRECTION') || 'Forward';

  block.setWarningText(null, 'L298_Movement');
  return `${varName}_${direction}();\n`;
};

Arduino.forBlock['l298_set_speed'] = function (block: Blockly.Block): string {
  const varName = block.getField('VAR')?.getText() || 'MT';
  const speed = block.getFieldValue('SPEED') ?? 200;

  // Try to find the init block to check if any EN pins exist
  const initBlock = findInitBlock(block.workspace, varName);

  if (initBlock) {
    const motorAHasEN = (initBlock as L298InitBlock).motorAHasEN_ ?? true;
    const motorBHasEN = (initBlock as L298InitBlock).motorBHasEN_ ?? true;
    const motorCount = (initBlock as L298InitBlock).motorCount_ ?? 2;

    // Check if at least one motor has EN pin
    const hasAnyEN = motorAHasEN || (motorCount === 2 && motorBHasEN);

    if (!hasAnyEN) {
      block.setWarningText(
        'Speed control requires at least one motor with EN pin. Motors without EN pins run at full speed.',
        'L298_NoEN'
      );
      return `// ${varName}: No EN pins configured for speed control\n`;
    }
  }

  block.setWarningText(null, 'L298_NoEN');
  return `${varName}Speed = ${speed};\n`;
};

function findInitBlock(workspace: Blockly.Workspace, varName: string): Blockly.Block | null {
  const blocks = workspace.getAllBlocks(false);
  for (const block of blocks) {
    if (block.type === 'l298_init' && block.getField('VAR')?.getText() === varName) {
      return block;
    }
  }
  return null;
}
