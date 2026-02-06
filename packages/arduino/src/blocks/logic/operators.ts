import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Types } from '../../arduino/types';

/**
 * Logic operators blocks
 * Includes: boolean, logic operations (AND, OR), comparisons, negation, and null
 */

/**
 * Block: logic_boolean
 * Boolean value (true/false)
 */
Blockly.Blocks['logic_boolean'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'logic_boolean',
      message0: '%1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'BOOL',
          options: [
            ['%{BKY_LOGIC_BOOLEAN_TRUE}', 'TRUE'],
            ['%{BKY_LOGIC_BOOLEAN_FALSE}', 'FALSE'],
          ],
        },
      ],
      output: 'Boolean',
      colour: CATEGORY_COLORS.operators,
      tooltip: '%{BKY_LOGIC_BOOLEAN_TOOLTIP}',
      helpUrl: '%{BKY_LOGIC_BOOLEAN_HELPURL}',
    });
  },
  getBlockType: function(this: Blockly.Block) {
    return Types.BOOLEAN;
  },
};

/**
 * Block: logic_operation
 * Logic operations (AND, OR)
 */
Blockly.Blocks['logic_operation'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'logic_operation',
      message0: '%1 %2 %3',
      args0: [
        {
          type: 'input_value',
          name: 'A',
          check: 'Boolean',
        },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['%{BKY_LOGIC_OPERATION_AND}', 'AND'],
            ['%{BKY_LOGIC_OPERATION_OR}', 'OR'],
          ],
        },
        {
          type: 'input_value',
          name: 'B',
          check: 'Boolean',
        },
      ],
      inputsInline: true,
      output: 'Boolean',
      colour: CATEGORY_COLORS.operators,
      helpUrl: '%{BKY_LOGIC_OPERATION_HELPURL}',
      extensions: ['logic_op_tooltip'],
    });
  },
  getBlockType: function(this: Blockly.Block) {
    return Types.BOOLEAN;
  },
};

/**
 * Block: logic_compare
 * Comparison operators (==, !=, <, >, <=, >=)
 */
interface LogicCompareBlock extends Blockly.Block {
  prevBlocks_: [Blockly.Block | null, Blockly.Block | null];
}

Blockly.Blocks['logic_compare'] = {
  init: function(this: LogicCompareBlock) {
    const OPERATORS: [string, string][] = this.RTL
      ? [
          ['=', 'EQ'],
          ['\u2260', 'NEQ'],
          ['>', 'LT'],
          ['\u2265', 'LTE'],
          ['<', 'GT'],
          ['\u2264', 'GTE'],
        ]
      : [
          ['=', 'EQ'],
          ['\u2260', 'NEQ'],
          ['<', 'LT'],
          ['\u2264', 'LTE'],
          ['>', 'GT'],
          ['\u2265', 'GTE'],
        ];

    this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setColour(CATEGORY_COLORS.operators);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('A');
    this.appendValueInput('B').appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);

    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const op = thisBlock.getFieldValue('OP');
      const TOOLTIPS: Record<string, string> = {
        EQ: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
        NEQ: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
        LT: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
        LTE: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
        GT: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
        GTE: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE,
      };
      return TOOLTIPS[op];
    });

    this.prevBlocks_ = [null, null];
  },
  getBlockType: function(this: LogicCompareBlock) {
    return Types.BOOLEAN;
  },
  prevBlocks_: [null, null],
};

/**
 * Block: logic_negate
 * NOT operator
 */
Blockly.Blocks['logic_negate'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'logic_negate',
      message0: '%{BKY_LOGIC_NEGATE_TITLE}',
      args0: [
        {
          type: 'input_value',
          name: 'BOOL',
          check: 'Boolean',
        },
      ],
      output: 'Boolean',
      colour: CATEGORY_COLORS.operators,
      tooltip: '%{BKY_LOGIC_NEGATE_TOOLTIP}',
      helpUrl: '%{BKY_LOGIC_NEGATE_HELPURL}',
    });
  },
  getBlockType: function(this: Blockly.Block) {
    return Types.BOOLEAN;
  },
};

/**
 * Block: logic_null
 * NULL value
 */
Blockly.Blocks['logic_null'] = {
  init: function(this: Blockly.Block) {
    this.jsonInit({
      type: 'logic_null',
      message0: '%{BKY_LOGIC_NULL}',
      output: null,
      colour: CATEGORY_COLORS.operators,
      tooltip: '%{BKY_LOGIC_NULL_TOOLTIP}',
      helpUrl: '%{BKY_LOGIC_NULL_HELPURL}',
    });
  },
};
