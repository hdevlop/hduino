import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../../theme';
import { Arduino } from '../../../arduino/boards';
import { FieldVariableCreateOnly } from '../../../fields/FieldVariableCreateOnly';

// Define interface for L293 init block with mutation state
interface L293InitBlock extends Blockly.Block {
  motorCount_: number;
  motorAHasEN_: boolean;
  motorBHasEN_: boolean;
  updateShape_(): void;
}

// Define interface for L293 movement block
interface L293MovementBlock extends Blockly.Block {
  getDirectionOptions(): [string, string][];
  findInitBlock(varName: string): Blockly.Block | null;
}

// Mutator helper blocks
Blockly.Blocks['l293_mutator_container'] = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('motors:');
    this.appendStatementInput('STACK');
    this.setColour(CATEGORY_COLORS.motors);
    this.setTooltip('Add or remove motors and enable pins');
    this.contextMenu = false;
  }
};

Blockly.Blocks['l293_mutator_motorA'] = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Motor A');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(CATEGORY_COLORS.motors);
    this.setTooltip('Include Motor A');
    this.contextMenu = false;
  }
};

Blockly.Blocks['l293_mutator_motorB'] = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Motor B');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(CATEGORY_COLORS.motors);
    this.setTooltip('Include Motor B');
    this.contextMenu = false;
  }
};

Blockly.Blocks['l293_mutator_enableA'] = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('  Enable A');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(CATEGORY_COLORS.motors);
    this.setTooltip('Include enable pin for Motor A (for speed control)');
    this.contextMenu = false;
  }
};

Blockly.Blocks['l293_mutator_enableB'] = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('  Enable B');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(CATEGORY_COLORS.motors);
    this.setTooltip('Include enable pin for Motor B (for speed control)');
    this.contextMenu = false;
  }
};

Blockly.Blocks['l293_init'] = {
  init: function (this: L293InitBlock) {
    // Initialize mutation state - default to 1 motor with EN
    this.motorCount_ = 1;
    this.motorAHasEN_ = true;
    this.motorBHasEN_ = true;

    this.appendDummyInput('COMMAND_ROW')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('Init L293 Driver Named:')
      .appendField(new FieldVariableCreateOnly('MT'), 'VAR');

    this.appendDummyInput('IMAGE_ROW')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField(new Blockly.FieldImage('/img/ico/icHBridgeL293D.png', 100, 45, '*'));

    this.updateShape_();
    this.setMutator(new Blockly.icons.MutatorIcon(
      ['l293_mutator_motorA', 'l293_mutator_motorB', 'l293_mutator_enableA', 'l293_mutator_enableB'],
      this as unknown as Blockly.BlockSvg
    ));

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Initialize L293 DC Motor with pins');
    this.setHelpUrl('');
  },

  mutationToDom: function(this: L293InitBlock) {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('motors', String(this.motorCount_));
    container.setAttribute('aHasEN', String(this.motorAHasEN_));
    container.setAttribute('bHasEN', String(this.motorBHasEN_));
    return container;
  },

  domToMutation: function(this: L293InitBlock, xmlElement: Element) {
    const motorsAttr = xmlElement.getAttribute('motors');
    const aHasENAttr = xmlElement.getAttribute('aHasEN');
    const bHasENAttr = xmlElement.getAttribute('bHasEN');

    // Backward compatibility: if no mutation XML, default to old behavior (2 motors, both with EN)
    this.motorCount_ = motorsAttr ? parseInt(motorsAttr, 10) : 2;
    this.motorAHasEN_ = aHasENAttr ? aHasENAttr === 'true' : true;
    this.motorBHasEN_ = bHasENAttr ? bHasENAttr === 'true' : true;

    this.updateShape_();
  },

  decompose: function(this: L293InitBlock, workspace: Blockly.Workspace) {
    const containerBlock = workspace.newBlock('l293_mutator_container') as Blockly.BlockSvg;
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK')!.connection;

    // Always add Motor A
    const motorABlock = workspace.newBlock('l293_mutator_motorA') as Blockly.BlockSvg;
    motorABlock.initSvg();
    connection!.connect(motorABlock.previousConnection);
    connection = motorABlock.nextConnection;

    // Add Enable A if enabled
    if (this.motorAHasEN_) {
      const enableABlock = workspace.newBlock('l293_mutator_enableA') as Blockly.BlockSvg;
      enableABlock.initSvg();
      connection!.connect(enableABlock.previousConnection);
      connection = enableABlock.nextConnection;
    }

    // Add Motor B if present
    if (this.motorCount_ === 2) {
      const motorBBlock = workspace.newBlock('l293_mutator_motorB') as Blockly.BlockSvg;
      motorBBlock.initSvg();
      connection!.connect(motorBBlock.previousConnection);
      connection = motorBBlock.nextConnection;

      // Add Enable B if enabled
      if (this.motorBHasEN_) {
        const enableBBlock = workspace.newBlock('l293_mutator_enableB') as Blockly.BlockSvg;
        enableBBlock.initSvg();
        connection!.connect(enableBBlock.previousConnection);
        connection = enableBBlock.nextConnection;
      }
    }

    return containerBlock;
  },

  compose: function(this: L293InitBlock, containerBlock: Blockly.Block) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');

    // Parse the mutator state
    let hasMotorA = false;
    let hasMotorB = false;
    let hasEnableA = false;
    let hasEnableB = false;

    while (itemBlock && !itemBlock.isInsertionMarker()) {
      switch (itemBlock.type) {
        case 'l293_mutator_motorA':
          hasMotorA = true;
          break;
        case 'l293_mutator_motorB':
          hasMotorB = true;
          break;
        case 'l293_mutator_enableA':
          hasEnableA = true;
          break;
        case 'l293_mutator_enableB':
          hasEnableB = true;
          break;
      }
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }

    // Motor A must always be present
    if (!hasMotorA) {
      hasMotorA = true;
    }

    // Update state
    this.motorCount_ = hasMotorB ? 2 : 1;
    this.motorAHasEN_ = hasEnableA;
    this.motorBHasEN_ = hasEnableB;

    this.updateShape_();
  },

  saveConnections: function(this: L293InitBlock, containerBlock: Blockly.Block) {
    // No value connections to save for this block
  },

  updateShape_: function(this: L293InitBlock) {
    // Remove all motor inputs
    if (this.getInput('MOTOR_A_ROW')) {
      this.removeInput('MOTOR_A_ROW');
    }
    if (this.getInput('MOTOR_B_ROW')) {
      this.removeInput('MOTOR_B_ROW');
    }

    // Always add Motor A control pins
    const motorAInput = this.appendDummyInput('MOTOR_A_ROW')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('  MA1 ')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN0')
      .appendField(' MA2 ')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN1');

    // Add Motor A enable pin on same line if enabled
    if (this.motorAHasEN_) {
      motorAInput
        .appendField('  ENA ')
        .appendField(new Blockly.FieldDropdown(Arduino.PwmPins), 'PIN_ENA');
    }

    // Add Motor B if motorCount === 2
    if (this.motorCount_ === 2) {
      const motorBInput = this.appendDummyInput('MOTOR_B_ROW')
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField('  MB1 ')
        .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN2')
        .appendField(' MB2 ')
        .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN3');

      // Add Motor B enable pin on same line if enabled
      if (this.motorBHasEN_) {
        motorBInput
          .appendField('  ENB ')
          .appendField(new Blockly.FieldDropdown(Arduino.PwmPins), 'PIN_ENB');
      }
    }
  },

  updateFields: function (this: L293InitBlock, workspace?: any) {
    // Refresh Motor A pin dropdowns
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN0', 'digitalPins', workspace);
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN1', 'digitalPins', workspace);
    if (this.motorAHasEN_ && this.getField('PIN_ENA')) {
      Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN_ENA', 'pwmPins', workspace);
    }

    // Refresh Motor B pin dropdowns if present
    if (this.motorCount_ === 2) {
      Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN2', 'digitalPins', workspace);
      Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN3', 'digitalPins', workspace);
      if (this.motorBHasEN_ && this.getField('PIN_ENB')) {
        Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN_ENB', 'pwmPins', workspace);
      }
    }
  },
};

Blockly.Blocks['l293_movement'] = {
  init: function (this: L293MovementBlock) {
    this.appendDummyInput()
      .appendField('L293')
      .appendField(new FieldVariableCreateOnly('MT'), 'VAR')
      .appendField(new Blockly.FieldDropdown(this.getDirectionOptions.bind(this)), 'DIRECTION');

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Control L293 motor direction and stop');
    this.setHelpUrl('');
  },

  getDirectionOptions: function(this: L293MovementBlock): [string, string][] {
    // Try to find the init block to determine motor count
    const varName = this.getField('VAR')?.getText();
    if (varName) {
      const initBlock = this.findInitBlock(varName);
      if (initBlock && (initBlock as L293InitBlock).motorCount_ === 1) {
        // Single motor: only Forward, Backward, Stop
        return [
          ['Forward', 'Forward'],
          ['Backward', 'Backward'],
          ['Stop', 'Stop'],
        ];
      }
    }

    // Two motors: all directions including Left, Right
    return [
      ['Forward', 'Forward'],
      ['Backward', 'Backward'],
      ['Left', 'Left'],
      ['Right', 'Right'],
      ['Stop', 'Stop'],
    ];
  },

  findInitBlock: function(this: L293MovementBlock, varName: string): Blockly.Block | null {
    // Search workspace for l293_init block with matching VAR field
    const blocks = this.workspace.getAllBlocks(false);
    for (const block of blocks) {
      if (block.type === 'l293_init' && block.getField('VAR')?.getText() === varName) {
        return block;
      }
    }
    return null;
  }
};

Blockly.Blocks['l293_set_speed'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('L293')
      .appendField(new FieldVariableCreateOnly('MT'), 'VAR')
      .appendField(' Set Speed ')
      .appendField(new Blockly.FieldNumber(200, 0, 255), 'SPEED');

    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Set L293 motor speed (0-255)');
    this.setHelpUrl('');
  },
};
