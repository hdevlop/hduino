import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Types } from '../../arduino/types';

/**
 * Text blocks
 * Includes: text, text_join, text_append, text_length, text_isEmpty, text_indexOf,
 * text_charAt, text_getSubstring, text_changeCase, text_trim, text_print, text_prompt
 */

/**
 * Block: text
 * Simple text value with quotes extension
 */
Blockly.Blocks['text'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'text',
      message0: '%1',
      args0: [{
        type: 'field_input',
        name: 'TEXT',
        text: '',
      }],
      output: 'String',
      colour: CATEGORY_COLORS.text,
      helpUrl: '%{BKY_TEXT_TEXT_HELPURL}',
      tooltip: '%{BKY_TEXT_TEXT_TOOLTIP}',
      extensions: [
        'text_quotes',
        'parent_tooltip_when_inline',
      ],
    });
  },
  getBlockType: function(this: Blockly.Block) {
    return Types.TEXT;
  },
};

/**
 * Block: text_join
 * Join multiple text strings together
 */
Blockly.Blocks['text_join'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'text_join',
      message0: '',
      output: 'String',
      colour: CATEGORY_COLORS.text,
      helpUrl: '%{BKY_TEXT_JOIN_HELPURL}',
      tooltip: '%{BKY_TEXT_JOIN_TOOLTIP}',
      mutator: 'text_join_mutator',
    });
  },
  getBlockType: function(this: Blockly.Block) {
    return Types.TEXT;
  },
};

/**
 * Block: text_create_join_container
 * Mutator container for text_join
 */
Blockly.Blocks['text_create_join_container'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'text_create_join_container',
      message0: '%{BKY_TEXT_CREATE_JOIN_TITLE_JOIN} %1 %2',
      args0: [{
        type: 'input_dummy',
      },
      {
        type: 'input_statement',
        name: 'STACK',
      }],
      colour: CATEGORY_COLORS.text,
      tooltip: '%{BKY_TEXT_CREATE_JOIN_TOOLTIP}',
      enableContextMenu: false,
    });
  },
  getBlockType: function(this: Blockly.Block) {
    return Types.TEXT;
  },
};

/**
 * Block: text_create_join_item
 * Mutator item for text_join
 */
Blockly.Blocks['text_create_join_item'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'text_create_join_item',
      message0: '%{BKY_TEXT_CREATE_JOIN_ITEM_TITLE_ITEM}',
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.text,
      tooltip: '%{BKY_TEXT_CREATE_JOIN_ITEM_TOOLTIP}',
      enableContextMenu: false,
    });
  },
  getVarType: function(this: Blockly.Block, varName: string) {
    return Types.TEXT;
  },
};

/**
 * Block: text_append
 * Append text to a variable
 */
Blockly.Blocks['text_append'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'text_append',
      message0: '%{BKY_TEXT_APPEND_TITLE}',
      args0: [{
        type: 'field_variable',
        name: 'VAR',
        variable: '%{BKY_TEXT_APPEND_VARIABLE}',
      },
      {
        type: 'input_value',
        name: 'TEXT',
      }],
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.text,
      extensions: [
        'text_append_tooltip',
      ],
    });
  },
  getVarType: function(this: Blockly.Block, varName: string) {
    return Types.TEXT;
  },
};

/**
 * Block: text_length
 * Get length of text or array
 */
Blockly.Blocks['text_length'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      message0: Blockly.Msg.TEXT_LENGTH_TITLE,
      args0: [
        {
          type: 'input_value',
          name: 'VALUE',
          check: ['String', 'Array'],
        },
      ],
      output: 'Number',
      colour: CATEGORY_COLORS.text,
      tooltip: Blockly.Msg.TEXT_LENGTH_TOOLTIP,
      helpUrl: Blockly.Msg.TEXT_LENGTH_HELPURL,
    });
  },
  getBlockType: function(this: Blockly.Block) {
    return Types.NUMBER;
  },
};

/**
 * Block: text_isEmpty
 * Check if text is empty
 */
Blockly.Blocks['text_isEmpty'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      message0: Blockly.Msg.TEXT_ISEMPTY_TITLE,
      args0: [
        {
          type: 'input_value',
          name: 'VALUE',
          check: ['String', 'Array'],
        },
      ],
      output: 'Boolean',
      colour: CATEGORY_COLORS.text,
      tooltip: Blockly.Msg.TEXT_ISEMPTY_TOOLTIP,
      helpUrl: Blockly.Msg.TEXT_ISEMPTY_HELPURL,
    });
  },
  getBlockType: function(this: Blockly.Block) {
    return Types.BOOLEAN;
  },
};

/**
 * Block: text_indexOf
 * Find first or last occurrence of substring
 */
Blockly.Blocks['text_indexOf'] = {
  init: function(this: Blockly.Block) {
    const OPERATORS: [string, string][] = [
      [Blockly.Msg.TEXT_INDEXOF_OPERATOR_FIRST, 'FIRST'],
      [Blockly.Msg.TEXT_INDEXOF_OPERATOR_LAST, 'LAST'],
    ];
    this.setHelpUrl(Blockly.Msg.TEXT_INDEXOF_HELPURL);
    this.setColour(CATEGORY_COLORS.text);
    this.setOutput(true, 'Number');
    this.appendValueInput('VALUE')
      .setCheck('String')
      .appendField(Blockly.Msg.TEXT_INDEXOF_INPUT_INTEXT);
    this.appendValueInput('FIND')
      .setCheck('String')
      .appendField(new Blockly.FieldDropdown(OPERATORS), 'END');
    if (Blockly.Msg.TEXT_INDEXOF_TAIL) {
      this.appendDummyInput().appendField(Blockly.Msg.TEXT_INDEXOF_TAIL);
    }
    this.setInputsInline(true);

    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TEXT_INDEXOF_TOOLTIP.replace('%1',
        thisBlock.workspace.options.oneBasedIndex ? '0' : '-1');
    });
  },
};

/**
 * Block: text_charAt
 * Get character from string at position
 */
interface TextCharAtBlock extends Blockly.Block {
  WHERE_OPTIONS: [string, string][];
  updateAt_(isAt: boolean): void;
}

Blockly.Blocks['text_charAt'] = {
  WHERE_OPTIONS: [] as [string, string][],

  init: function(this: TextCharAtBlock) {
    this.WHERE_OPTIONS = [
      [Blockly.Msg.TEXT_CHARAT_FROM_START, 'FROM_START'],
      [Blockly.Msg.TEXT_CHARAT_FROM_END, 'FROM_END'],
      [Blockly.Msg.TEXT_CHARAT_FIRST, 'FIRST'],
      [Blockly.Msg.TEXT_CHARAT_LAST, 'LAST'],
    ];
    this.setHelpUrl(Blockly.Msg.TEXT_CHARAT_HELPURL);
    this.setColour(CATEGORY_COLORS.text);
    this.setOutput(true, 'String');
    this.appendValueInput('VALUE')
      .setCheck('String')
      .appendField(Blockly.Msg.TEXT_CHARAT_INPUT_INTEXT);
    this.appendDummyInput('AT');
    this.setInputsInline(true);
    this.updateAt_(true);

    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const where = thisBlock.getFieldValue('WHERE');
      let tooltip = Blockly.Msg.TEXT_CHARAT_TOOLTIP;
      if (where === 'FROM_START' || where === 'FROM_END') {
        const msg = (where === 'FROM_START') ?
          Blockly.Msg.LISTS_INDEX_FROM_START_TOOLTIP :
          Blockly.Msg.LISTS_INDEX_FROM_END_TOOLTIP;
        tooltip += '  ' + msg.replace('%1',
          thisBlock.workspace.options.oneBasedIndex ? '#1' : '#0');
      }
      return tooltip;
    });
  },

  mutationToDom: function(this: Blockly.Block): Element {
    const container = document.createElement('mutation');
    const isAt = !!this.getInput('AT')!.connection;
    container.setAttribute('at', String(isAt));
    return container;
  },

  domToMutation: function(this: TextCharAtBlock, xmlElement: Element): void {
    // Note: Until January 2013 this block did not have mutations,
    // so 'at' defaults to true.
    const isAt = (xmlElement.getAttribute('at') !== 'false');
    this.updateAt_(isAt);
  },

  updateAt_: function(this: TextCharAtBlock, isAt: boolean): void {
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput('AT');
    this.removeInput('ORDINAL', true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT').setCheck('Number');
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput('ORDINAL')
          .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      this.appendDummyInput('AT');
    }
    if (Blockly.Msg.TEXT_CHARAT_TAIL) {
      this.removeInput('TAIL', true);
      this.appendDummyInput('TAIL')
        .appendField(Blockly.Msg.TEXT_CHARAT_TAIL);
    }
    const menu = new Blockly.FieldDropdown(this.WHERE_OPTIONS, function(this: any, value: string) {
      const newAt = (value === 'FROM_START') || (value === 'FROM_END');
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt !== isAt) {
        const block = this.sourceBlock_;
        block.updateAt_(newAt);
        // This menu has been destroyed and replaced. Update the replacement.
        block.setFieldValue(value, 'WHERE');
        return null;
      }
      return undefined;
    });
    this.getInput('AT')!.appendField(menu, 'WHERE');
  },
};

/**
 * Block: text_getSubstring
 * Get substring from string
 */
interface TextGetSubstringBlock extends Blockly.Block {
  WHERE_OPTIONS_1: [string, string][];
  WHERE_OPTIONS_2: [string, string][];
  updateAt_(n: number, isAt: boolean): void;
}

Blockly.Blocks['text_getSubstring'] = {
  WHERE_OPTIONS_1: [] as [string, string][],
  WHERE_OPTIONS_2: [] as [string, string][],

  init: function(this: TextGetSubstringBlock) {
    this.WHERE_OPTIONS_1 = [
      [Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_START, 'FROM_START'],
      [Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_END, 'FROM_END'],
      [Blockly.Msg.TEXT_GET_SUBSTRING_START_FIRST, 'FIRST'],
    ];
    this.WHERE_OPTIONS_2 = [
      [Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_START, 'FROM_START'],
      [Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_END, 'FROM_END'],
      [Blockly.Msg.TEXT_GET_SUBSTRING_END_LAST, 'LAST'],
    ];
    this.setHelpUrl(Blockly.Msg.TEXT_GET_SUBSTRING_HELPURL);
    this.setColour(CATEGORY_COLORS.text);
    this.appendValueInput('STRING')
      .setCheck('String')
      .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT);
    this.appendDummyInput('AT1');
    this.appendDummyInput('AT2');
    if (Blockly.Msg.TEXT_GET_SUBSTRING_TAIL) {
      this.appendDummyInput('TAIL')
        .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_TAIL);
    }
    this.setInputsInline(true);
    this.setOutput(true, 'String');
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(Blockly.Msg.TEXT_GET_SUBSTRING_TOOLTIP);
  },

  mutationToDom: function(this: TextGetSubstringBlock): Element {
    const container = document.createElement('mutation');
    const isAt1 = !!this.getInput('AT1')!.connection;
    container.setAttribute('at1', String(isAt1));
    const isAt2 = !!this.getInput('AT2')!.connection;
    container.setAttribute('at2', String(isAt2));
    return container;
  },

  domToMutation: function(this: TextGetSubstringBlock, xmlElement: Element): void {
    const isAt1 = (xmlElement.getAttribute('at1') === 'true');
    const isAt2 = (xmlElement.getAttribute('at2') === 'true');
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },

  updateAt_: function(
    this: TextGetSubstringBlock,
    n: number,
    isAt: boolean
  ): void {
    // Create or delete an input for the numeric index.
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput('AT' + n);
    this.removeInput('ORDINAL' + n, true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT' + n).setCheck('Number');
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput('ORDINAL' + n).appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      this.appendDummyInput('AT' + n);
    }
    // Move tail, if present, to end of block.
    if (n === 2 && Blockly.Msg.TEXT_GET_SUBSTRING_TAIL) {
      this.removeInput('TAIL', true);
      this.appendDummyInput('TAIL')
        .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_TAIL);
    }
    const optionsKey = ('WHERE_OPTIONS_' + n) as 'WHERE_OPTIONS_1' | 'WHERE_OPTIONS_2';
    const menu = new Blockly.FieldDropdown(this[optionsKey],
      function(this: any, value: string) {
        const newAt = (value === 'FROM_START') || (value === 'FROM_END');
        // The 'isAt' variable is available due to this function being a closure.
        if (newAt !== isAt) {
          const block = this.sourceBlock_;
          block.updateAt_(n, newAt);
          // This menu has been destroyed and replaced. Update the replacement.
          block.setFieldValue(value, 'WHERE' + n);
          return null;
        }
        return undefined;
      });

    this.getInput('AT' + n)!.appendField(menu, 'WHERE' + n);
    if (n === 1) {
      this.moveInputBefore('AT1', 'AT2');
    }
  },
};

/**
 * Block: text_changeCase
 * Change text to uppercase or lowercase
 */
Blockly.Blocks['text_changeCase'] = {
  init: function(this: Blockly.Block) {
    const OPERATORS: [string, string][] = [
      [Blockly.Msg.TEXT_CHANGECASE_OPERATOR_UPPERCASE, 'UPPERCASE'],
      [Blockly.Msg.TEXT_CHANGECASE_OPERATOR_LOWERCASE, 'LOWERCASE'],
    ];
    this.setHelpUrl(Blockly.Msg.TEXT_CHANGECASE_HELPURL);
    this.setColour(CATEGORY_COLORS.text);
    this.appendValueInput('TEXT')
      .setCheck('String')
      .appendField(new Blockly.FieldDropdown(OPERATORS), 'CASE');
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.TEXT_CHANGECASE_TOOLTIP);
  },
};

/**
 * Block: text_trim
 * Trim whitespace from text
 */
Blockly.Blocks['text_trim'] = {
  init: function(this: Blockly.Block) {
    const OPERATORS: [string, string][] = [
      [Blockly.Msg.TEXT_TRIM_OPERATOR_BOTH, 'BOTH'],
      [Blockly.Msg.TEXT_TRIM_OPERATOR_LEFT, 'LEFT'],
      [Blockly.Msg.TEXT_TRIM_OPERATOR_RIGHT, 'RIGHT'],
    ];
    this.setHelpUrl(Blockly.Msg.TEXT_TRIM_HELPURL);
    this.setStyle('text_blocks');
    this.appendValueInput('TEXT')
      .setCheck('String')
      .appendField(new Blockly.FieldDropdown(OPERATORS), 'MODE');
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.TEXT_TRIM_TOOLTIP);
    this.setColour(CATEGORY_COLORS.text);
  },
};

/**
 * Block: text_print
 * Print text to serial
 */
Blockly.Blocks['text_print'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      message0: Blockly.Msg.TEXT_PRINT_TITLE,
      args0: [
        {
          type: 'input_value',
          name: 'TEXT',
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.text,
      tooltip: Blockly.Msg.TEXT_PRINT_TOOLTIP,
      helpUrl: Blockly.Msg.TEXT_PRINT_HELPURL,
    });
  },
};

/**
 * Block: text_prompt_ext
 * Prompt for text or number input
 */
interface TextPromptExtBlock extends Blockly.Block {
  updateType_(newOp: string): void;
}

Blockly.Blocks['text_prompt_ext'] = {
  init: function(this: TextPromptExtBlock) {
    const TYPES: [string, string][] = [
      [Blockly.Msg.TEXT_PROMPT_TYPE_TEXT, 'TEXT'],
      [Blockly.Msg.TEXT_PROMPT_TYPE_NUMBER, 'NUMBER'],
    ];
    this.setHelpUrl(Blockly.Msg.TEXT_PROMPT_HELPURL);
    this.setColour(CATEGORY_COLORS.text);

    // Assign 'this' to a variable for use in the closures below.
    const thisBlock = this;
    const dropdown = new Blockly.FieldDropdown(TYPES, function(newOp: string) {
      thisBlock.updateType_(newOp);
      return undefined;
    });
    this.appendValueInput('TEXT')
      .appendField(dropdown, 'TYPE');
    this.setOutput(true, 'String');
    this.setTooltip(function() {
      return (thisBlock.getFieldValue('TYPE') === 'TEXT') ?
        Blockly.Msg.TEXT_PROMPT_TOOLTIP_TEXT :
        Blockly.Msg.TEXT_PROMPT_TOOLTIP_NUMBER;
    });
  },

  updateType_: function(this: TextPromptExtBlock, newOp: string): void {
    this.outputConnection!.setCheck(newOp === 'NUMBER' ? 'Number' : 'String');
  },

  mutationToDom: function(this: TextPromptExtBlock): Element {
    const container = document.createElement('mutation');
    container.setAttribute('type', this.getFieldValue('TYPE'));
    return container;
  },

  domToMutation: function(this: TextPromptExtBlock, xmlElement: Element): void {
    this.updateType_(xmlElement.getAttribute('type')!);
  },

  getBlockType: function(this: TextPromptExtBlock) {
    return (this.getFieldValue('TYPE') === 'TEXT') ?
      Types.TEXT : Types.NUMBER;
  },
};

/**
 * Block: text_prompt
 * Prompt with internal message (deprecated - use text_prompt_ext)
 */
interface TextPromptBlock extends Blockly.Block {
  updateType_(newOp: string): void;
  newQuote_(open: boolean): Blockly.Field;
}

Blockly.Blocks['text_prompt'] = {
  init: function(this: TextPromptBlock) {
    const TYPES: [string, string][] = [
      [Blockly.Msg.TEXT_PROMPT_TYPE_TEXT, 'TEXT'],
      [Blockly.Msg.TEXT_PROMPT_TYPE_NUMBER, 'NUMBER'],
    ];

    // Assign 'this' to a variable for use in the closures below.
    const thisBlock = this;
    this.setHelpUrl(Blockly.Msg.TEXT_PROMPT_HELPURL);
    this.setColour(CATEGORY_COLORS.text);
    const dropdown = new Blockly.FieldDropdown(TYPES, function(newOp: string) {
      thisBlock.updateType_(newOp);
      return undefined;
    });
    this.appendDummyInput()
      .appendField(dropdown, 'TYPE')
      .appendField(this.newQuote_(true))
      .appendField(new Blockly.FieldTextInput(''), 'TEXT')
      .appendField(this.newQuote_(false));
    this.setOutput(true, 'String');
    this.setTooltip(function() {
      return (thisBlock.getFieldValue('TYPE') === 'TEXT') ?
        Blockly.Msg.TEXT_PROMPT_TOOLTIP_TEXT :
        Blockly.Msg.TEXT_PROMPT_TOOLTIP_NUMBER;
    });
  },

  newQuote_: Blockly.Blocks['text'].newQuote_,
  updateType_: Blockly.Blocks['text_prompt_ext'].updateType_,
  mutationToDom: Blockly.Blocks['text_prompt_ext'].mutationToDom,
  domToMutation: Blockly.Blocks['text_prompt_ext'].domToMutation,

  getBlockType: function(this: TextPromptBlock) {
    return (this.getFieldValue('TYPE') === 'NUMBER') ?
      Types.NUMBER : Types.TEXT;
  },
};
