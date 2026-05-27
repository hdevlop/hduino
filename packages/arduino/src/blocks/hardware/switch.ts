import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Arduino } from '../../arduino/boards';
import { Types } from '../../arduino/types';
import { FieldVariableCreateOnly } from '../../fields/FieldVariableCreateOnly';

Blockly.Blocks['switch_button_read'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/button_ico.png', 35, 35, '*'))
      .appendField('BT State')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN');
    this.setOutput(true, Types.NUMBER.typeId);
    this.setColour(CATEGORY_COLORS.switch);
    this.setTooltip(Blockly.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPins', workspace);
  },
};

Blockly.Blocks['switch_relay'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Relay')
      .appendField('PIN')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN')
      .appendField('set to')
      .appendField(new Blockly.FieldDropdown([
        ['ON', 'HIGH'],
        ['OFF', 'LOW']
      ]), 'STATE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CATEGORY_COLORS.switch);
    this.setTooltip('Control a relay module');
    this.setHelpUrl('');
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPins', workspace);
  },
};

// Define interface for Relay Board init block with mutation state
interface RelayBoardInitBlock extends Blockly.Block {
  relayCount_: number;
  updateShape_(): void;
}

// Define interface for Relay Board control block
interface RelayBoardControlBlock extends Blockly.Block {
  getRelayOptions(): [string, string][];
  findInitBlock(varName: string): Blockly.Block | null;
}

// Mutator helper blocks
Blockly.Blocks['relay_mutator_container'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Relay Count:');
    this.appendStatementInput('STACK');
    this.setColour(CATEGORY_COLORS.switch);
    this.setTooltip('Select number of relays (1, 2, 4, 8, or 16)');
    this.contextMenu = false;
  }
};

Blockly.Blocks['relay_mutator_1ch'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('1 Relay');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(CATEGORY_COLORS.switch);
    this.setTooltip('Single relay configuration');
    this.contextMenu = false;
  }
};

Blockly.Blocks['relay_mutator_2ch'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('2 Relays');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(CATEGORY_COLORS.switch);
    this.setTooltip('2-channel relay board');
    this.contextMenu = false;
  }
};

Blockly.Blocks['relay_mutator_4ch'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('4 Relays');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(CATEGORY_COLORS.switch);
    this.setTooltip('4-channel relay board');
    this.contextMenu = false;
  }
};

Blockly.Blocks['relay_mutator_8ch'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('8 Relays');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(CATEGORY_COLORS.switch);
    this.setTooltip('8-channel relay board');
    this.contextMenu = false;
  }
};

Blockly.Blocks['relay_mutator_16ch'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('16 Relays');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(CATEGORY_COLORS.switch);
    this.setTooltip('16-channel relay board');
    this.contextMenu = false;
  }
};

// Relay Board Init Block
Blockly.Blocks['relay_board_init'] = {
  init: function (this: RelayBoardInitBlock) {
    // Initialize mutation state - default to 4 relays
    this.relayCount_ = 4;

    
    
    this.appendDummyInput('COMMAND_ROW')
    .setAlign(Blockly.inputs.Align.CENTRE)
    .appendField('Init Relay Board Named:')
    .appendField(new FieldVariableCreateOnly('RELAY'), 'VAR');
    
    this.appendDummyInput('IMAGE_ROW')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField(new Blockly.FieldImage('/img/ico/relay.png', 200, 133, '*'));
  
      this.updateShape_();
    this.setMutator(new Blockly.icons.MutatorIcon(
      ['relay_mutator_1ch', 'relay_mutator_2ch', 'relay_mutator_4ch', 'relay_mutator_8ch', 'relay_mutator_16ch'],
      this as unknown as Blockly.BlockSvg
    ));

    this.setColour(CATEGORY_COLORS.switch);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Initialize relay board with configurable number of relays');
    this.setHelpUrl('');
  },

  mutationToDom: function (this: RelayBoardInitBlock) {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('relays', String(this.relayCount_));
    return container;
  },

  domToMutation: function (this: RelayBoardInitBlock, xmlElement: Element) {
    const relaysAttr = xmlElement.getAttribute('relays');
    // Backward compatibility: default to 4 relays if no mutation XML
    this.relayCount_ = relaysAttr ? parseInt(relaysAttr, 10) : 4;
    this.updateShape_();
  },

  decompose: function (this: RelayBoardInitBlock, workspace: Blockly.Workspace) {
    const containerBlock = workspace.newBlock('relay_mutator_container') as Blockly.BlockSvg;
    containerBlock.initSvg();
    const connection = containerBlock.getInput('STACK')!.connection;

    // Add the appropriate relay count block
    let relayBlock: Blockly.BlockSvg;
    switch (this.relayCount_) {
      case 1:
        relayBlock = workspace.newBlock('relay_mutator_1ch') as Blockly.BlockSvg;
        break;
      case 2:
        relayBlock = workspace.newBlock('relay_mutator_2ch') as Blockly.BlockSvg;
        break;
      case 4:
        relayBlock = workspace.newBlock('relay_mutator_4ch') as Blockly.BlockSvg;
        break;
      case 8:
        relayBlock = workspace.newBlock('relay_mutator_8ch') as Blockly.BlockSvg;
        break;
      case 16:
        relayBlock = workspace.newBlock('relay_mutator_16ch') as Blockly.BlockSvg;
        break;
      default:
        relayBlock = workspace.newBlock('relay_mutator_4ch') as Blockly.BlockSvg;
    }
    relayBlock.initSvg();
    connection!.connect(relayBlock.previousConnection);

    return containerBlock;
  },

  compose: function (this: RelayBoardInitBlock, containerBlock: Blockly.Block) {
    const itemBlock = containerBlock.getInputTargetBlock('STACK');

    // Parse the mutator state - only allow one relay count selection
    let newRelayCount = 4; // default

    if (itemBlock && !itemBlock.isInsertionMarker()) {
      switch (itemBlock.type) {
        case 'relay_mutator_1ch':
          newRelayCount = 1;
          break;
        case 'relay_mutator_2ch':
          newRelayCount = 2;
          break;
        case 'relay_mutator_4ch':
          newRelayCount = 4;
          break;
        case 'relay_mutator_8ch':
          newRelayCount = 8;
          break;
        case 'relay_mutator_16ch':
          newRelayCount = 16;
          break;
      }
    }

    this.relayCount_ = newRelayCount;
    this.updateShape_();
  },

  saveConnections: function (this: RelayBoardInitBlock) {
    // No value connections to save for this block
  },

  updateShape_: function (this: RelayBoardInitBlock) {
    // Remove all existing relay pin inputs
    for (let i = 1; i <= 16; i++) {
      const inputName = 'RELAY_ROW_' + Math.ceil(i / 2);
      if (this.getInput(inputName)) {
        this.removeInput(inputName);
      }
    }

    // Add relay pins dynamically based on relay count
    // Display 2 relays per row for better layout
    for (let i = 1; i <= this.relayCount_; i += 2) {
      const rowNum = Math.ceil(i / 2);
      const input = this.appendDummyInput(`RELAY_ROW_${rowNum}`)
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField(`Relay ${i}:`)
        .appendField(new Blockly.FieldDropdown(Arduino.AllPins), `PIN${i}`);

      // Add second relay on the same row if available
      if (i + 1 <= this.relayCount_) {
        input
          .appendField(`  Relay ${i + 1}:`)
          .appendField(new Blockly.FieldDropdown(Arduino.AllPins), `PIN${i + 1}`);
      }
    }
  },

  updateFields: function (this: RelayBoardInitBlock, workspace?: any) {
    // Refresh all relay pin dropdowns
    for (let i = 1; i <= this.relayCount_; i++) {
      if (this.getField(`PIN${i}`)) {
        Arduino.Boards.refreshBlockFieldDropdown(this, `PIN${i}`, 'AllPins', workspace);
      }
    }
  },
};

// Relay Board Control Block
Blockly.Blocks['relay_board_control'] = {
  init: function (this: RelayBoardControlBlock) {
    this.appendDummyInput()
      .appendField('Set')
      .appendField(new FieldVariableCreateOnly('RELAY'), 'VAR')
      .appendField('Relay')
      .appendField(new Blockly.FieldDropdown(this.getRelayOptions.bind(this)), 'RELAY_NUM')
      .appendField('to')
      .appendField(new Blockly.FieldDropdown([
        ['ON', 'HIGH'],
        ['OFF', 'LOW']
      ]), 'STATE');

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CATEGORY_COLORS.switch);
    this.setTooltip('Control a relay on the board');
    this.setHelpUrl('');
  },

  getRelayOptions: function (this: RelayBoardControlBlock): [string, string][] {
    // Try to find the init block to determine relay count
    const varName = this.getField('VAR')?.getText();
    if (varName) {
      const initBlock = this.findInitBlock(varName);
      if (initBlock) {
        const relayCount = (initBlock as RelayBoardInitBlock).relayCount_ || 4;
        const options: [string, string][] = [];
        for (let i = 1; i <= relayCount; i++) {
          options.push([String(i), String(i)]);
        }
        return options;
      }
    }

    // Default to 4 relays if init block not found
    return [
      ['1', '1'],
      ['2', '2'],
      ['3', '3'],
      ['4', '4']
    ];
  },

  findInitBlock: function (this: RelayBoardControlBlock, varName: string): Blockly.Block | null {
    // Search workspace for relay_board_init block with matching VAR field
    const blocks = this.workspace.getAllBlocks(false);
    for (const block of blocks) {
      if (block.type === 'relay_board_init' && block.getField('VAR')?.getText() === varName) {
        return block;
      }
    }
    return null;
  }
};
