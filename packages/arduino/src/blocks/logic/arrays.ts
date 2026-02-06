import * as Blockly from 'blockly/core';

// Access APIs from Blockly (available at runtime but not in TypeScript types)
const BlocklyInputAlign = (Blockly as any).inputs?.Align || (Blockly as any).Input?.Align;
import { CATEGORY_COLORS } from '../../theme';

/**
 * Array blocks
 * Includes: array creation, manipulation, and operations
 */

/**
 * Block: lists_create_empty
 * Creates an empty array
 */
Blockly.Blocks['lists_create_empty'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'lists_create_empty',
      message0: '%{BKY_LISTS_CREATE_EMPTY_TITLE}',
      output: 'Array',
      colour: CATEGORY_COLORS.array,
      tooltip: '%{BKY_LISTS_CREATE_EMPTY_TOOLTIP}',
      helpUrl: '%{BKY_LISTS_CREATE_EMPTY_HELPURL}',
    });
  },
};

/**
 * Block: lists_repeat
 * Creates an array with repeated items
 */
Blockly.Blocks['lists_repeat'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'lists_repeat',
      message0: '%{BKY_LISTS_REPEAT_TITLE}',
      args0: [
        {
          type: 'input_value',
          name: 'ITEM',
        },
        {
          type: 'input_value',
          name: 'NUM',
          check: 'Number',
        },
      ],
      output: 'Array',
      colour: CATEGORY_COLORS.array,
      tooltip: '%{BKY_LISTS_REPEAT_TOOLTIP}',
      helpUrl: '%{BKY_LISTS_REPEAT_HELPURL}',
    });
  },
};

/**
 * Block: lists_create_with
 * Creates an array with multiple items
 */
interface ListsCreateWithBlock extends Blockly.Block {
  itemCount_: number;
  updateShape_(): void;
}

Blockly.Blocks['lists_create_with'] = {
  init: function(this: ListsCreateWithBlock) {
    this.setHelpUrl(Blockly.Msg['LISTS_CREATE_WITH_HELPURL']);
    this.setColour(CATEGORY_COLORS.array);
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true, 'Array');
    this.setMutator(new Blockly.icons.MutatorIcon(['lists_create_with_item'], this as unknown as Blockly.BlockSvg));
    this.setTooltip(Blockly.Msg['LISTS_CREATE_WITH_TOOLTIP']);
  },

  mutationToDom: function(this: ListsCreateWithBlock) {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', String(this.itemCount_));
    return container;
  },

  domToMutation: function(this: ListsCreateWithBlock, xmlElement: Element) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items') || '0', 10);
    this.updateShape_();
  },

  decompose: function(this: ListsCreateWithBlock, workspace: Blockly.Workspace) {
    const containerBlock = workspace.newBlock('lists_create_with_container') as Blockly.BlockSvg;
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK')!.connection;
    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock('lists_create_with_item') as Blockly.BlockSvg;
      itemBlock.initSvg();
      connection!.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(this: ListsCreateWithBlock, containerBlock: Blockly.Block) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK') as any;
    // Count number of inputs.
    const connections: Blockly.Connection[] = [];
    while (itemBlock && !itemBlock.isInsertionMarker()) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (let i = 0; i < this.itemCount_; i++) {
      const connection = this.getInput('ADD' + i)!.connection!.targetConnection;
      if (connection && connections.indexOf(connection) === -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (let i = 0; i < this.itemCount_; i++) {
      connections[i]?.reconnect(this, 'ADD' + i);
    }
  },

  saveConnections: function(this: ListsCreateWithBlock, containerBlock: Blockly.Block) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK') as any;
    let i = 0;
    while (itemBlock) {
      const input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection!.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function(this: ListsCreateWithBlock) {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY').appendField(Blockly.Msg['LISTS_CREATE_EMPTY_TITLE']);
    }
    // Add new inputs.
    for (let i = 0; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        const input = this.appendValueInput('ADD' + i).setAlign(BlocklyInputAlign.RIGHT);
        if (i === 0) {
          input.appendField(Blockly.Msg['LISTS_CREATE_WITH_INPUT_WITH']);
        }
      }
    }
    // Remove deleted inputs.
    let i = this.itemCount_;
    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }
  },
};

/**
 * Block: lists_isEmpty
 * Checks if array is empty
 */
Blockly.Blocks['lists_isEmpty'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'lists_isEmpty',
      message0: '%{BKY_LISTS_ISEMPTY_TITLE}',
      args0: [
        {
          type: 'input_value',
          name: 'VALUE',
          check: ['String', 'Array'],
        },
      ],
      output: 'Boolean',
      colour: CATEGORY_COLORS.array,
      tooltip: '%{BKY_LISTS_ISEMPTY_TOOLTIP}',
      helpUrl: '%{BKY_LISTS_ISEMPTY_HELPURL}',
    });
  },
};

/**
 * Block: lists_length
 * Returns the length of an array
 */
Blockly.Blocks['lists_length'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'lists_length',
      message0: '%{BKY_LISTS_LENGTH_TITLE}',
      args0: [
        {
          type: 'input_value',
          name: 'VALUE',
          check: ['String', 'Array'],
        },
      ],
      output: 'Number',
      colour: CATEGORY_COLORS.array,
      tooltip: '%{BKY_LISTS_LENGTH_TOOLTIP}',
      helpUrl: '%{BKY_LISTS_LENGTH_HELPURL}',
    });
  },
};

/**
 * Block: lists_create_with_item
 * Mutator block for lists_create_with
 */
Blockly.Blocks['lists_create_with_item'] = {
  init: function(this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.array);
    this.appendDummyInput().appendField(Blockly.Msg.ARRAY_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.ARRAY_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  },
};

/**
 * Block: lists_create_with_container
 * Container block for lists_create_with mutator
 */
Blockly.Blocks['lists_create_with_container'] = {
  init: function(this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.array);
    this.appendDummyInput().appendField(Blockly.Msg.ARRAY_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.ARRAY_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  },
};

/**
 * Block: lists_indexOf
 * Finds first/last index of item in array
 */
Blockly.Blocks['lists_indexOf'] = {
  init: function(this: Blockly.Block) {
    const OPERATORS: [string, string][] = [
      [Blockly.Msg['LISTS_INDEX_OF_FIRST'], 'FIRST'],
      [Blockly.Msg['LISTS_INDEX_OF_LAST'], 'LAST'],
    ];
    this.setHelpUrl(Blockly.Msg['LISTS_INDEX_OF_HELPURL']);
    this.setColour(CATEGORY_COLORS.array);
    this.setOutput(true, 'Number');
    this.appendValueInput('VALUE')
      .setCheck('Array')
      .appendField(Blockly.Msg['LISTS_INDEX_OF_INPUT_IN_LIST']);
    this.appendValueInput('FIND').appendField(new Blockly.FieldDropdown(OPERATORS), 'END');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg['LISTS_INDEX_OF_TOOLTIP'].replace(
        '%1',
        thisBlock.workspace.options.oneBasedIndex ? '0' : '-1'
      );
    });
  },
};

/**
 * Block: lists_getIndex
 * Gets/removes element at index
 */
interface ListsGetIndexBlock extends Blockly.Block {
  WHERE_OPTIONS: [string, string][];
  updateStatement_(isStatement: boolean): void;
  updateAt_(isAt: boolean): void;
}

Blockly.Blocks['lists_getIndex'] = {
  init: function(this: ListsGetIndexBlock) {
    const MODE: [string, string][] = [
      [Blockly.Msg['LISTS_GET_INDEX_GET'], 'GET'],
      [Blockly.Msg['LISTS_GET_INDEX_GET_REMOVE'], 'GET_REMOVE'],
      [Blockly.Msg['LISTS_GET_INDEX_REMOVE'], 'REMOVE'],
    ];
    this.WHERE_OPTIONS = [
      [Blockly.Msg['LISTS_GET_INDEX_FROM_START'], 'FROM_START'],
      [Blockly.Msg['LISTS_GET_INDEX_FROM_END'], 'FROM_END'],
      [Blockly.Msg['LISTS_GET_INDEX_FIRST'], 'FIRST'],
      [Blockly.Msg['LISTS_GET_INDEX_LAST'], 'LAST'],
      [Blockly.Msg['LISTS_GET_INDEX_RANDOM'], 'RANDOM'],
    ];
    this.setHelpUrl(Blockly.Msg['LISTS_GET_INDEX_HELPURL']);
    this.setColour(CATEGORY_COLORS.array);
    const modeMenu = new Blockly.FieldDropdown(MODE, function(this: Blockly.Field, value: string) {
      const isStatement = value === 'REMOVE';
      (this.getSourceBlock() as ListsGetIndexBlock).updateStatement_(isStatement);
      return undefined;
    });
    this.appendValueInput('VALUE')
      .setCheck('Array')
      .appendField(Blockly.Msg['LISTS_GET_INDEX_INPUT_IN_LIST']);
    this.appendDummyInput().appendField(modeMenu, 'MODE').appendField('', 'SPACE');
    this.appendDummyInput('AT');
    if (Blockly.Msg['LISTS_GET_INDEX_TAIL']) {
      this.appendDummyInput('TAIL').appendField(Blockly.Msg['LISTS_GET_INDEX_TAIL']);
    }
    this.setInputsInline(true);
    this.setOutput(true);
    this.updateAt_(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const mode = thisBlock.getFieldValue('MODE');
      const where = thisBlock.getFieldValue('WHERE');
      let tooltip = '';
      switch (mode + ' ' + where) {
        case 'GET FROM_START':
        case 'GET FROM_END':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_FROM'];
          break;
        case 'GET FIRST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_FIRST'];
          break;
        case 'GET LAST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_LAST'];
          break;
        case 'GET RANDOM':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_RANDOM'];
          break;
        case 'GET_REMOVE FROM_START':
        case 'GET_REMOVE FROM_END':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM'];
          break;
        case 'GET_REMOVE FIRST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST'];
          break;
        case 'GET_REMOVE LAST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST'];
          break;
        case 'GET_REMOVE RANDOM':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM'];
          break;
        case 'REMOVE FROM_START':
        case 'REMOVE FROM_END':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM'];
          break;
        case 'REMOVE FIRST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST'];
          break;
        case 'REMOVE LAST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST'];
          break;
        case 'REMOVE RANDOM':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM'];
          break;
      }
      if (where === 'FROM_START' || where === 'FROM_END') {
        const msg =
          where === 'FROM_START'
            ? Blockly.Msg['LISTS_INDEX_FROM_START_TOOLTIP']
            : Blockly.Msg['LISTS_INDEX_FROM_END_TOOLTIP'];
        tooltip +=
          '  ' +
          msg.replace('%1', thisBlock.workspace.options.oneBasedIndex ? '#1' : '#0');
      }
      return tooltip;
    });
  },

  mutationToDom: function(this: ListsGetIndexBlock) {
    const container = Blockly.utils.xml.createElement('mutation');
    const isStatement = !this.outputConnection;
    container.setAttribute('statement', String(isStatement));
    const isAt = !!this.getInput('AT')!.connection;
    container.setAttribute('at', String(isAt));
    return container;
  },

  domToMutation: function(this: ListsGetIndexBlock, xmlElement: Element) {
    const isStatement = xmlElement.getAttribute('statement') === 'true';
    this.updateStatement_(isStatement);
    const isAt = xmlElement.getAttribute('at') !== 'false';
    this.updateAt_(isAt);
  },

  updateStatement_: function(this: ListsGetIndexBlock, newStatement: boolean) {
    const oldStatement = !this.outputConnection;
    if (newStatement !== oldStatement) {
      this.unplug(true);
      if (newStatement) {
        this.setOutput(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      } else {
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setOutput(true);
      }
    }
  },

  updateAt_: function(this: ListsGetIndexBlock, isAt: boolean) {
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput('AT');
    this.removeInput('ORDINAL', true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT').setCheck('Number');
      if (Blockly.Msg['ORDINAL_NUMBER_SUFFIX']) {
        this.appendDummyInput('ORDINAL').appendField(Blockly.Msg['ORDINAL_NUMBER_SUFFIX']);
      }
    } else {
      this.appendDummyInput('AT');
    }
    const menu = new Blockly.FieldDropdown(this.WHERE_OPTIONS, function(
      this: Blockly.Field,
      value: string
    ) {
      const newAt = value === 'FROM_START' || value === 'FROM_END';
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt !== isAt) {
        const block = this.getSourceBlock() as ListsGetIndexBlock;
        block.updateAt_(newAt);
        // This menu has been destroyed and replaced. Update the replacement.
        block.setFieldValue(value, 'WHERE');
        return null;
      }
      return undefined;
    });
    this.getInput('AT')!.appendField(menu, 'WHERE');
    if (Blockly.Msg['LISTS_GET_INDEX_TAIL']) {
      this.moveInputBefore('TAIL', null);
    }
  },
};

/**
 * Block: lists_setIndex
 * Sets element at index
 */
interface ListsSetIndexBlock extends Blockly.Block {
  WHERE_OPTIONS: [string, string][];
  updateAt_(isAt: boolean): void;
}

Blockly.Blocks['lists_setIndex'] = {
  init: function(this: ListsSetIndexBlock) {
    const MODE: [string, string][] = [
      [Blockly.Msg['LISTS_SET_INDEX_SET'], 'SET'],
      [Blockly.Msg['LISTS_SET_INDEX_INSERT'], 'INSERT'],
    ];
    this.WHERE_OPTIONS = [
      [Blockly.Msg['LISTS_GET_INDEX_FROM_START'], 'FROM_START'],
      [Blockly.Msg['LISTS_GET_INDEX_FROM_END'], 'FROM_END'],
      [Blockly.Msg['LISTS_GET_INDEX_FIRST'], 'FIRST'],
      [Blockly.Msg['LISTS_GET_INDEX_LAST'], 'LAST'],
      [Blockly.Msg['LISTS_GET_INDEX_RANDOM'], 'RANDOM'],
    ];
    this.setHelpUrl(Blockly.Msg['LISTS_SET_INDEX_HELPURL']);
    this.setColour(CATEGORY_COLORS.array);
    this.appendValueInput('LIST')
      .setCheck('Array')
      .appendField(Blockly.Msg['LISTS_SET_INDEX_INPUT_IN_LIST']);
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(MODE), 'MODE')
      .appendField('', 'SPACE');
    this.appendDummyInput('AT');
    this.appendValueInput('TO').appendField(Blockly.Msg['LISTS_SET_INDEX_INPUT_TO']);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg['LISTS_SET_INDEX_TOOLTIP']);
    this.updateAt_(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const mode = thisBlock.getFieldValue('MODE');
      const where = thisBlock.getFieldValue('WHERE');
      let tooltip = '';
      switch (mode + ' ' + where) {
        case 'SET FROM_START':
        case 'SET FROM_END':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_SET_FROM'];
          break;
        case 'SET FIRST':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_SET_FIRST'];
          break;
        case 'SET LAST':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_SET_LAST'];
          break;
        case 'SET RANDOM':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_SET_RANDOM'];
          break;
        case 'INSERT FROM_START':
        case 'INSERT FROM_END':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_INSERT_FROM'];
          break;
        case 'INSERT FIRST':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST'];
          break;
        case 'INSERT LAST':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_INSERT_LAST'];
          break;
        case 'INSERT RANDOM':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM'];
          break;
      }
      if (where === 'FROM_START' || where === 'FROM_END') {
        tooltip +=
          '  ' +
          Blockly.Msg['LISTS_INDEX_FROM_START_TOOLTIP'].replace(
            '%1',
            thisBlock.workspace.options.oneBasedIndex ? '#1' : '#0'
          );
      }
      return tooltip;
    });
  },

  mutationToDom: function(this: ListsSetIndexBlock) {
    const container = Blockly.utils.xml.createElement('mutation');
    const isAt = !!this.getInput('AT')!.connection;
    container.setAttribute('at', String(isAt));
    return container;
  },

  domToMutation: function(this: ListsSetIndexBlock, xmlElement: Element) {
    const isAt = xmlElement.getAttribute('at') !== 'false';
    this.updateAt_(isAt);
  },

  updateAt_: function(this: ListsSetIndexBlock, isAt: boolean) {
    // Destroy old 'AT' and 'ORDINAL' input.
    this.removeInput('AT');
    this.removeInput('ORDINAL', true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT').setCheck('Number');
      if (Blockly.Msg['ORDINAL_NUMBER_SUFFIX']) {
        this.appendDummyInput('ORDINAL').appendField(Blockly.Msg['ORDINAL_NUMBER_SUFFIX']);
      }
    } else {
      this.appendDummyInput('AT');
    }
    const menu = new Blockly.FieldDropdown(this.WHERE_OPTIONS, function(
      this: Blockly.Field,
      value: string
    ) {
      const newAt = value === 'FROM_START' || value === 'FROM_END';
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt !== isAt) {
        const block = this.getSourceBlock() as ListsSetIndexBlock;
        block.updateAt_(newAt);
        // This menu has been destroyed and replaced. Update the replacement.
        block.setFieldValue(value, 'WHERE');
        return null;
      }
      return undefined;
    });
    this.moveInputBefore('AT', 'TO');
    if (this.getInput('ORDINAL')) {
      this.moveInputBefore('ORDINAL', 'TO');
    }

    this.getInput('AT')!.appendField(menu, 'WHERE');
  },
};

/**
 * Block: lists_getSublist
 * Gets a sublist from array
 */
interface ListsGetSublistBlock extends Blockly.Block {
  WHERE_OPTIONS_1: [string, string][];
  WHERE_OPTIONS_2: [string, string][];
  updateAt_(n: number, isAt: boolean): void;
}

Blockly.Blocks['lists_getSublist'] = {
  init: function(this: ListsGetSublistBlock) {
    this.WHERE_OPTIONS_1 = [
      [Blockly.Msg['LISTS_GET_SUBLIST_START_FROM_START'], 'FROM_START'],
      [Blockly.Msg['LISTS_GET_SUBLIST_START_FROM_END'], 'FROM_END'],
      [Blockly.Msg['LISTS_GET_SUBLIST_START_FIRST'], 'FIRST'],
    ];
    this.WHERE_OPTIONS_2 = [
      [Blockly.Msg['LISTS_GET_SUBLIST_END_FROM_START'], 'FROM_START'],
      [Blockly.Msg['LISTS_GET_SUBLIST_END_FROM_END'], 'FROM_END'],
      [Blockly.Msg['LISTS_GET_SUBLIST_END_LAST'], 'LAST'],
    ];
    this.setHelpUrl(Blockly.Msg['LISTS_GET_SUBLIST_HELPURL']);
    this.setColour(CATEGORY_COLORS.array);
    this.appendValueInput('LIST')
      .setCheck('Array')
      .appendField(Blockly.Msg['LISTS_GET_SUBLIST_INPUT_IN_LIST']);
    this.appendDummyInput('AT1');
    this.appendDummyInput('AT2');
    if (Blockly.Msg['LISTS_GET_SUBLIST_TAIL']) {
      this.appendDummyInput('TAIL').appendField(Blockly.Msg['LISTS_GET_SUBLIST_TAIL']);
    }
    this.setInputsInline(true);
    this.setOutput(true, 'Array');
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(Blockly.Msg['LISTS_GET_SUBLIST_TOOLTIP']);
  },

  mutationToDom: function(this: ListsGetSublistBlock) {
    const container = Blockly.utils.xml.createElement('mutation');
    const isAt1 = !!this.getInput('AT1')!.connection;
    container.setAttribute('at1', String(isAt1));
    const isAt2 = !!this.getInput('AT2')!.connection;
    container.setAttribute('at2', String(isAt2));
    return container;
  },

  domToMutation: function(this: ListsGetSublistBlock, xmlElement: Element) {
    const isAt1 = xmlElement.getAttribute('at1') === 'true';
    const isAt2 = xmlElement.getAttribute('at2') === 'true';
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },

  updateAt_: function(this: ListsGetSublistBlock, n: number, isAt: boolean) {
    // Create or delete an input for the numeric index.
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput('AT' + n);
    this.removeInput('ORDINAL' + n, true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT' + n).setCheck('Number');
      if (Blockly.Msg['ORDINAL_NUMBER_SUFFIX']) {
        this.appendDummyInput('ORDINAL' + n).appendField(Blockly.Msg['ORDINAL_NUMBER_SUFFIX']);
      }
    } else {
      this.appendDummyInput('AT' + n);
    }
    const menu = new Blockly.FieldDropdown(
      (this as any)['WHERE_OPTIONS_' + n],
      function(this: Blockly.Field, value: string) {
        const newAt = value === 'FROM_START' || value === 'FROM_END';
        // The 'isAt' variable is available due to this function being a
        // closure.
        if (newAt !== isAt) {
          const block = this.getSourceBlock() as ListsGetSublistBlock;
          block.updateAt_(n, newAt);
          // This menu has been destroyed and replaced.
          // Update the replacement.
          block.setFieldValue(value, 'WHERE' + n);
          return null;
        }
        return undefined;
      }
    );
    this.getInput('AT' + n)!.appendField(menu, 'WHERE' + n);
    if (n === 1) {
      this.moveInputBefore('AT1', 'AT2');
      if (this.getInput('ORDINAL1')) {
        this.moveInputBefore('ORDINAL1', 'AT2');
      }
    }
    if (Blockly.Msg['LISTS_GET_SUBLIST_TAIL']) {
      this.moveInputBefore('TAIL', null);
    }
  },
};

/**
 * Block: lists_sort
 * Sorts an array
 */
Blockly.Blocks['lists_sort'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      message0: Blockly.Msg['LISTS_SORT_TITLE'],
      args0: [
        {
          type: 'field_dropdown',
          name: 'TYPE',
          options: [
            [Blockly.Msg['LISTS_SORT_TYPE_NUMERIC'], 'NUMERIC'],
            [Blockly.Msg['LISTS_SORT_TYPE_TEXT'], 'TEXT'],
            [Blockly.Msg['LISTS_SORT_TYPE_IGNORECASE'], 'IGNORE_CASE'],
          ],
        },
        {
          type: 'field_dropdown',
          name: 'DIRECTION',
          options: [
            [Blockly.Msg['LISTS_SORT_ORDER_ASCENDING'], '1'],
            [Blockly.Msg['LISTS_SORT_ORDER_DESCENDING'], '-1'],
          ],
        },
        {
          type: 'input_value',
          name: 'LIST',
          check: 'Array',
        },
      ],
      output: 'Array',
      colour: CATEGORY_COLORS.array,
      tooltip: Blockly.Msg['LISTS_SORT_TOOLTIP'],
      helpUrl: Blockly.Msg['LISTS_SORT_HELPURL'],
    });
  },
};

/**
 * Block: lists_split
 * Splits text into array or joins array into text
 */
interface ListsSplitBlock extends Blockly.Block {
  updateType_(newMode: string): void;
}

Blockly.Blocks['lists_split'] = {
  init: function(this: ListsSplitBlock) {
    // Assign 'this' to a variable for use in the closures below.
    const thisBlock = this;
    const dropdown = new Blockly.FieldDropdown(
      [
        [Blockly.Msg['LISTS_SPLIT_LIST_FROM_TEXT'], 'SPLIT'],
        [Blockly.Msg['LISTS_SPLIT_TEXT_FROM_LIST'], 'JOIN'],
      ],
      function(this: Blockly.Field, newMode: string) {
        (thisBlock as ListsSplitBlock).updateType_(newMode);
        return undefined;
      }
    );
    this.setHelpUrl(Blockly.Msg['LISTS_SPLIT_HELPURL']);
    this.setColour(CATEGORY_COLORS.array);
    this.appendValueInput('INPUT').setCheck('String').appendField(dropdown, 'MODE');
    this.appendValueInput('DELIM')
      .setCheck('String')
      .appendField(Blockly.Msg['LISTS_SPLIT_WITH_DELIMITER']);
    this.setInputsInline(true);
    this.setOutput(true, 'Array');
    this.setTooltip(function() {
      const mode = thisBlock.getFieldValue('MODE');
      if (mode === 'SPLIT') {
        return Blockly.Msg['LISTS_SPLIT_TOOLTIP_SPLIT'];
      } else if (mode === 'JOIN') {
        return Blockly.Msg['LISTS_SPLIT_TOOLTIP_JOIN'];
      }
      throw Error('Unknown mode: ' + mode);
    });
  },

  updateType_: function(this: ListsSplitBlock, newMode: string) {
    const mode = this.getFieldValue('MODE');
    if (mode !== newMode) {
      const inputConnection = this.getInput('INPUT')!.connection!;
      inputConnection.setShadowDom(null);
      const inputBlock = inputConnection.targetBlock();
      if (inputBlock) {
        inputConnection.disconnect();
        if (inputBlock.isShadow()) {
          inputBlock.dispose();
        } else {
          this.bumpNeighbours();
        }
      }
    }
    if (newMode === 'SPLIT') {
      this.outputConnection!.setCheck('Array');
      this.getInput('INPUT')!.setCheck('String');
    } else {
      this.outputConnection!.setCheck('String');
      this.getInput('INPUT')!.setCheck('Array');
    }
  },

  mutationToDom: function(this: ListsSplitBlock) {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('mode', this.getFieldValue('MODE'));
    return container;
  },

  domToMutation: function(this: ListsSplitBlock, xmlElement: Element) {
    this.updateType_(xmlElement.getAttribute('mode') || 'SPLIT');
  },
};
