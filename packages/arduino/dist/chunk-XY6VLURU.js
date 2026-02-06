import {
  Arduino,
  Types,
  getChildBlockType,
  getValidTypeArray,
  identifyNumber
} from "./chunk-7NACRFOC.js";
import {
  CATEGORY_COLORS
} from "./chunk-WPDPDPQP.js";

// src/blocks/logic/operators.ts
import * as Blockly from "blockly/core";
Blockly.Blocks["logic_boolean"] = {
  init: function() {
    this.jsonInit({
      type: "logic_boolean",
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "BOOL",
          options: [
            ["%{BKY_LOGIC_BOOLEAN_TRUE}", "TRUE"],
            ["%{BKY_LOGIC_BOOLEAN_FALSE}", "FALSE"]
          ]
        }
      ],
      output: "Boolean",
      colour: CATEGORY_COLORS.operators,
      tooltip: "%{BKY_LOGIC_BOOLEAN_TOOLTIP}",
      helpUrl: "%{BKY_LOGIC_BOOLEAN_HELPURL}"
    });
  },
  getBlockType: function() {
    return Types.BOOLEAN;
  }
};
Blockly.Blocks["logic_operation"] = {
  init: function() {
    this.jsonInit({
      type: "logic_operation",
      message0: "%1 %2 %3",
      args0: [
        {
          type: "input_value",
          name: "A",
          check: "Boolean"
        },
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            ["%{BKY_LOGIC_OPERATION_AND}", "AND"],
            ["%{BKY_LOGIC_OPERATION_OR}", "OR"]
          ]
        },
        {
          type: "input_value",
          name: "B",
          check: "Boolean"
        }
      ],
      inputsInline: true,
      output: "Boolean",
      colour: CATEGORY_COLORS.operators,
      helpUrl: "%{BKY_LOGIC_OPERATION_HELPURL}",
      extensions: ["logic_op_tooltip"]
    });
  },
  getBlockType: function() {
    return Types.BOOLEAN;
  }
};
Blockly.Blocks["logic_compare"] = {
  init: function() {
    const OPERATORS = this.RTL ? [
      ["=", "EQ"],
      ["\u2260", "NEQ"],
      [">", "LT"],
      ["\u2265", "LTE"],
      ["<", "GT"],
      ["\u2264", "GTE"]
    ] : [
      ["=", "EQ"],
      ["\u2260", "NEQ"],
      ["<", "LT"],
      ["\u2264", "LTE"],
      [">", "GT"],
      ["\u2265", "GTE"]
    ];
    this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setColour(CATEGORY_COLORS.operators);
    this.setOutput(true, "Boolean");
    this.appendValueInput("A");
    this.appendValueInput("B").appendField(new Blockly.FieldDropdown(OPERATORS), "OP");
    this.setInputsInline(true);
    const thisBlock = this;
    this.setTooltip(function() {
      const op = thisBlock.getFieldValue("OP");
      const TOOLTIPS = {
        EQ: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
        NEQ: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
        LT: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
        LTE: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
        GT: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
        GTE: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE
      };
      return TOOLTIPS[op];
    });
    this.prevBlocks_ = [null, null];
  },
  getBlockType: function() {
    return Types.BOOLEAN;
  },
  prevBlocks_: [null, null]
};
Blockly.Blocks["logic_negate"] = {
  init: function() {
    this.jsonInit({
      type: "logic_negate",
      message0: "%{BKY_LOGIC_NEGATE_TITLE}",
      args0: [
        {
          type: "input_value",
          name: "BOOL",
          check: "Boolean"
        }
      ],
      output: "Boolean",
      colour: CATEGORY_COLORS.operators,
      tooltip: "%{BKY_LOGIC_NEGATE_TOOLTIP}",
      helpUrl: "%{BKY_LOGIC_NEGATE_HELPURL}"
    });
  },
  getBlockType: function() {
    return Types.BOOLEAN;
  }
};
Blockly.Blocks["logic_null"] = {
  init: function() {
    this.jsonInit({
      type: "logic_null",
      message0: "%{BKY_LOGIC_NULL}",
      output: null,
      colour: CATEGORY_COLORS.operators,
      tooltip: "%{BKY_LOGIC_NULL_TOOLTIP}",
      helpUrl: "%{BKY_LOGIC_NULL_HELPURL}"
    });
  }
};

// src/blocks/logic/control.ts
import * as Blockly2 from "blockly/core";
Blockly2.Blocks["controls_if"] = {
  init: function() {
    this.jsonInit({
      type: "controls_if",
      message0: "%{BKY_CONTROLS_IF_MSG_IF} %1",
      args0: [
        {
          type: "input_value",
          name: "IF0",
          check: "Boolean"
        }
      ],
      message1: "%{BKY_CONTROLS_IF_MSG_THEN} %1",
      args1: [
        {
          type: "input_statement",
          name: "DO0"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.control,
      helpUrl: "%{BKY_CONTROLS_IF_HELPURL}",
      mutator: "controls_if_mutator",
      extensions: ["controls_if_tooltip"]
    });
  }
};
Blockly2.Blocks["controls_repeat_ext"] = {
  init: function() {
    this.jsonInit({
      message0: "%{BKY_CONTROLS_REPEAT_TITLE}",
      args0: [
        {
          type: "input_value",
          name: "TIMES",
          check: "Number"
        }
      ],
      message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
      args1: [
        {
          type: "input_statement",
          name: "DO"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.control,
      tooltip: Blockly2.Msg.CONTROLS_REPEAT_TOOLTIP,
      helpUrl: Blockly2.Msg.CONTROLS_REPEAT_HELPURL
    });
  }
};
Blockly2.Blocks["controls_repeat"] = {
  init: function() {
    this.jsonInit({
      message0: "%{BKY_CONTROLS_REPEAT_TITLE}",
      args0: [
        {
          type: "field_number",
          name: "TIMES",
          value: 10,
          min: 0,
          precision: 1
        }
      ],
      message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
      args1: [
        {
          type: "input_statement",
          name: "DO"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.control,
      tooltip: Blockly2.Msg.CONTROLS_REPEAT_TOOLTIP,
      helpUrl: Blockly2.Msg.CONTROLS_REPEAT_HELPURL
    });
  }
};
Blockly2.Blocks["controls_whileUntil"] = {
  init: function() {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "MODE",
          options: [
            ["%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_WHILE}", "WHILE"],
            ["%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_UNTIL}", "UNTIL"]
          ]
        },
        {
          type: "input_value",
          name: "BOOL",
          check: "Boolean"
        }
      ],
      message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
      args1: [
        {
          type: "input_statement",
          name: "DO"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.control,
      helpUrl: "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}",
      extensions: ["controls_whileUntil_tooltip"]
    });
  }
};
Blockly2.Blocks["controls_for"] = {
  init: function() {
    this.jsonInit({
      message0: "%{BKY_CONTROLS_FOR_TITLE}",
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: null
        },
        {
          type: "input_value",
          name: "FROM",
          check: "Number",
          align: "RIGHT"
        },
        {
          type: "input_value",
          name: "TO",
          check: "Number",
          align: "RIGHT"
        },
        {
          type: "input_value",
          name: "BY",
          check: "Number",
          align: "RIGHT"
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.control,
      helpUrl: Blockly2.Msg.CONTROLS_FOR_HELPURL
    });
    this.appendStatementInput("DO").appendField(Blockly2.Msg.CONTROLS_FOR_INPUT_DO);
    const thisBlock = this;
    this.setTooltip(function() {
      return Blockly2.Msg.CONTROLS_FOR_TOOLTIP.replace("%1", thisBlock.getFieldValue("VAR"));
    });
  },
  getVarType: function(varName) {
    return Types.NUMBER;
  }
};
Blockly2.Blocks["controls_flow_statements"] = {
  init: function() {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "FLOW",
          options: [
            ["%{BKY_CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK}", "BREAK"],
            ["%{BKY_CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE}", "CONTINUE"]
          ]
        }
      ],
      previousStatement: null,
      colour: CATEGORY_COLORS.control,
      helpUrl: "%{BKY_CONTROLS_FLOW_STATEMENTS_HELPURL}",
      suppressPrefixSuffix: true,
      extensions: ["controls_flow_tooltip", "controls_flow_in_loop_check"]
    });
  }
};

// src/blocks/logic/math.ts
import * as Blockly3 from "blockly/core";
Blockly3.Blocks["math_number"] = {
  init: function() {
    this.setHelpUrl(Blockly3.Msg.MATH_NUMBER_HELPURL);
    this.setColour(CATEGORY_COLORS.math);
    const numberValidator = function(newValue) {
      const n = parseFloat(newValue || "0");
      return isNaN(n) ? null : String(n);
    };
    this.appendDummyInput().appendField(
      new Blockly3.FieldTextInput("0", numberValidator),
      "NUM"
    );
    this.setOutput(true, "Number");
    const thisBlock = this;
    this.setTooltip(function() {
      const parent = thisBlock.getParent();
      return parent && parent.getInputsInline() && parent.tooltip || Blockly3.Msg.MATH_NUMBER_TOOLTIP;
    });
  },
  /**
   * Reads the numerical value from the block and assigns a block type.
   */
  getBlockType: function() {
    const numString = this.getFieldValue("NUM");
    return identifyNumber(numString);
  }
};
Blockly3.Blocks["math_arithmetic"] = {
  init: function() {
    this.jsonInit({
      message0: "%1 %2 %3",
      args0: [
        {
          type: "input_value",
          name: "A",
          check: "Number"
        },
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            ["%{BKY_MATH_ADDITION_SYMBOL}", "ADD"],
            ["%{BKY_MATH_SUBTRACTION_SYMBOL}", "MINUS"],
            ["%{BKY_MATH_MULTIPLICATION_SYMBOL}", "MULTIPLY"],
            ["%{BKY_MATH_DIVISION_SYMBOL}", "DIVIDE"],
            ["%{BKY_MATH_POWER_SYMBOL}", "POWER"]
          ]
        },
        {
          type: "input_value",
          name: "B",
          check: "Number"
        }
      ],
      inputsInline: true,
      output: "Number",
      colour: CATEGORY_COLORS.math,
      helpUrl: "%{BKY_MATH_ARITHMETIC_HELPURL}",
      extensions: ["math_op_tooltip"]
    });
  }
};
Blockly3.Blocks["math_single"] = {
  init: function() {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            ["%{BKY_MATH_SINGLE_OP_ROOT}", "ROOT"],
            ["%{BKY_MATH_SINGLE_OP_ABSOLUTE}", "ABS"],
            ["-", "NEG"],
            ["ln", "LN"],
            ["log10", "LOG10"],
            ["e^", "EXP"],
            ["10^", "POW10"]
          ]
        },
        {
          type: "input_value",
          name: "NUM",
          check: "Number"
        }
      ],
      output: "Number",
      colour: CATEGORY_COLORS.math,
      helpUrl: "%{BKY_MATH_SINGLE_HELPURL}",
      extensions: ["math_op_tooltip"]
    });
  },
  getBlockType: function() {
    return Types.DECIMAL;
  }
};
Blockly3.Blocks["math_trig"] = {
  init: function() {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            ["%{BKY_MATH_TRIG_SIN}", "SIN"],
            ["%{BKY_MATH_TRIG_COS}", "COS"],
            ["%{BKY_MATH_TRIG_TAN}", "TAN"],
            ["%{BKY_MATH_TRIG_ASIN}", "ASIN"],
            ["%{BKY_MATH_TRIG_ACOS}", "ACOS"],
            ["%{BKY_MATH_TRIG_ATAN}", "ATAN"]
          ]
        },
        {
          type: "input_value",
          name: "NUM",
          check: "Number"
        }
      ],
      output: "Number",
      colour: CATEGORY_COLORS.math,
      helpUrl: "%{BKY_MATH_TRIG_HELPURL}",
      extensions: ["math_op_tooltip"]
    });
  },
  getBlockType: function() {
    return Types.DECIMAL;
  }
};
Blockly3.Blocks["math_constant"] = {
  init: function() {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "CONSTANT",
          options: [
            ["\u03C0", "PI"],
            ["e", "E"],
            ["\u03C6", "GOLDEN_RATIO"],
            ["sqrt(2)", "SQRT2"],
            ["sqrt(\xBD)", "SQRT1_2"],
            ["\u221E", "INFINITY"]
          ]
        }
      ],
      output: "Number",
      colour: CATEGORY_COLORS.math,
      tooltip: "%{BKY_MATH_CONSTANT_TOOLTIP}",
      helpUrl: "%{BKY_MATH_CONSTANT_HELPURL}"
    });
  }
};
Blockly3.Blocks["math_number_property"] = {
  init: function() {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "input_value",
          name: "NUMBER_TO_CHECK",
          check: "Number"
        },
        {
          type: "field_dropdown",
          name: "PROPERTY",
          options: [
            ["%{BKY_MATH_IS_EVEN}", "EVEN"],
            ["%{BKY_MATH_IS_ODD}", "ODD"],
            ["%{BKY_MATH_IS_PRIME}", "PRIME"],
            ["%{BKY_MATH_IS_WHOLE}", "WHOLE"],
            ["%{BKY_MATH_IS_POSITIVE}", "POSITIVE"],
            ["%{BKY_MATH_IS_NEGATIVE}", "NEGATIVE"],
            ["%{BKY_MATH_IS_DIVISIBLE_BY}", "DIVISIBLE_BY"]
          ]
        }
      ],
      inputsInline: true,
      output: "Boolean",
      colour: CATEGORY_COLORS.math,
      tooltip: "%{BKY_MATH_IS_TOOLTIP}",
      mutator: "math_is_divisibleby_mutator"
    });
  },
  getBlockType: function() {
    return Types.BOOLEAN;
  }
};
Blockly3.Blocks["math_change"] = {
  init: function() {
    this.jsonInit({
      message0: Blockly3.Msg.MATH_CHANGE_TITLE,
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: Blockly3.Msg.MATH_CHANGE_TITLE_ITEM
        },
        {
          type: "input_value",
          name: "DELTA",
          check: "Number"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.variables,
      helpUrl: Blockly3.Msg.MATH_CHANGE_HELPURL
    });
  },
  getVarType: function(varName) {
    return Types.NUMBER;
  }
};
Blockly3.Blocks["math_round"] = {
  init: function() {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            ["%{BKY_MATH_ROUND_OPERATOR_ROUND}", "ROUND"],
            ["%{BKY_MATH_ROUND_OPERATOR_ROUNDUP}", "ROUNDUP"],
            ["%{BKY_MATH_ROUND_OPERATOR_ROUNDDOWN}", "ROUNDDOWN"]
          ]
        },
        {
          type: "input_value",
          name: "NUM",
          check: "Number"
        }
      ],
      output: "Number",
      colour: CATEGORY_COLORS.math,
      helpUrl: "%{BKY_MATH_ROUND_HELPURL}",
      tooltip: "%{BKY_MATH_ROUND_TOOLTIP}"
    });
  },
  getBlockType: function() {
    return Types.DECIMAL;
  }
};
Blockly3.Blocks["math_on_list"] = {
  init: function() {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            ["%{BKY_MATH_ONLIST_OPERATOR_SUM}", "SUM"],
            ["%{BKY_MATH_ONLIST_OPERATOR_MIN}", "MIN"],
            ["%{BKY_MATH_ONLIST_OPERATOR_MAX}", "MAX"],
            ["%{BKY_MATH_ONLIST_OPERATOR_AVERAGE}", "AVERAGE"],
            ["%{BKY_MATH_ONLIST_OPERATOR_MEDIAN}", "MEDIAN"],
            ["%{BKY_MATH_ONLIST_OPERATOR_MODE}", "MODE"],
            ["%{BKY_MATH_ONLIST_OPERATOR_STD_DEV}", "STD_DEV"],
            ["%{BKY_MATH_ONLIST_OPERATOR_RANDOM}", "RANDOM"]
          ]
        },
        {
          type: "input_value",
          name: "LIST",
          check: "Array"
        }
      ],
      output: "Number",
      colour: CATEGORY_COLORS.math,
      helpUrl: "%{BKY_MATH_ONLIST_HELPURL}",
      mutator: "math_modes_of_list_mutator",
      extensions: ["math_op_tooltip"]
    });
  }
};
Blockly3.Blocks["math_modulo"] = {
  init: function() {
    this.jsonInit({
      message0: "%{BKY_MATH_MODULO_TITLE}",
      args0: [
        {
          type: "input_value",
          name: "DIVIDEND",
          check: "Number"
        },
        {
          type: "input_value",
          name: "DIVISOR",
          check: "Number"
        }
      ],
      inputsInline: true,
      output: "Number",
      colour: CATEGORY_COLORS.math,
      tooltip: "%{BKY_MATH_MODULO_TOOLTIP}",
      helpUrl: "%{BKY_MATH_MODULO_HELPURL}"
    });
  },
  getBlockType: function() {
    return Types.NUMBER;
  }
};
Blockly3.Blocks["math_constrain"] = {
  init: function() {
    this.jsonInit({
      message0: "%{BKY_MATH_CONSTRAIN_TITLE}",
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: "Number"
        },
        {
          type: "input_value",
          name: "LOW",
          check: "Number"
        },
        {
          type: "input_value",
          name: "HIGH",
          check: "Number"
        }
      ],
      inputsInline: true,
      output: "Number",
      colour: CATEGORY_COLORS.math,
      tooltip: "%{BKY_MATH_CONSTRAIN_TOOLTIP}",
      helpUrl: "%{BKY_MATH_CONSTRAIN_HELPURL}"
    });
  }
};
Blockly3.Blocks["math_random_int"] = {
  init: function() {
    this.jsonInit({
      message0: "%{BKY_MATH_RANDOM_INT_TITLE}",
      args0: [
        {
          type: "input_value",
          name: "FROM",
          check: "Number"
        },
        {
          type: "input_value",
          name: "TO",
          check: "Number"
        }
      ],
      inputsInline: true,
      output: "Number",
      colour: CATEGORY_COLORS.math,
      tooltip: "%{BKY_MATH_RANDOM_INT_TOOLTIP}",
      helpUrl: "%{BKY_MATH_RANDOM_INT_HELPURL}"
    });
  },
  getBlockType: function() {
    return Types.NUMBER;
  }
};
Blockly3.Blocks["math_random_float"] = {
  init: function() {
    this.jsonInit({
      message0: "%{BKY_MATH_RANDOM_FLOAT_TITLE_RANDOM}",
      output: "Number",
      colour: CATEGORY_COLORS.math,
      tooltip: "%{BKY_MATH_RANDOM_FLOAT_TOOLTIP}",
      helpUrl: "%{BKY_MATH_RANDOM_FLOAT_HELPURL}"
    });
  },
  getBlockType: function() {
    return Types.DECIMAL;
  }
};
Blockly3.Blocks["math_atan2"] = {
  init: function() {
    this.jsonInit({
      message0: "%{BKY_MATH_ATAN2_TITLE}",
      args0: [
        {
          type: "input_value",
          name: "X",
          check: "Number"
        },
        {
          type: "input_value",
          name: "Y",
          check: "Number"
        }
      ],
      inputsInline: true,
      output: "Number",
      colour: CATEGORY_COLORS.math,
      tooltip: "%{BKY_MATH_ATAN2_TOOLTIP}",
      helpUrl: "%{BKY_MATH_ATAN2_HELPURL}"
    });
  },
  getBlockType: function() {
    return Types.DECIMAL;
  }
};

// src/blocks/logic/text.ts
import * as Blockly4 from "blockly/core";
Blockly4.Blocks["text"] = {
  init: function() {
    this.jsonInit({
      type: "text",
      message0: "%1",
      args0: [{
        type: "field_input",
        name: "TEXT",
        text: ""
      }],
      output: "String",
      colour: CATEGORY_COLORS.text,
      helpUrl: "%{BKY_TEXT_TEXT_HELPURL}",
      tooltip: "%{BKY_TEXT_TEXT_TOOLTIP}",
      extensions: [
        "text_quotes",
        "parent_tooltip_when_inline"
      ]
    });
  },
  getBlockType: function() {
    return Types.TEXT;
  }
};
Blockly4.Blocks["text_join"] = {
  init: function() {
    this.jsonInit({
      type: "text_join",
      message0: "",
      output: "String",
      colour: CATEGORY_COLORS.text,
      helpUrl: "%{BKY_TEXT_JOIN_HELPURL}",
      tooltip: "%{BKY_TEXT_JOIN_TOOLTIP}",
      mutator: "text_join_mutator"
    });
  },
  getBlockType: function() {
    return Types.TEXT;
  }
};
Blockly4.Blocks["text_create_join_container"] = {
  init: function() {
    this.jsonInit({
      type: "text_create_join_container",
      message0: "%{BKY_TEXT_CREATE_JOIN_TITLE_JOIN} %1 %2",
      args0: [
        {
          type: "input_dummy"
        },
        {
          type: "input_statement",
          name: "STACK"
        }
      ],
      colour: CATEGORY_COLORS.text,
      tooltip: "%{BKY_TEXT_CREATE_JOIN_TOOLTIP}",
      enableContextMenu: false
    });
  },
  getBlockType: function() {
    return Types.TEXT;
  }
};
Blockly4.Blocks["text_create_join_item"] = {
  init: function() {
    this.jsonInit({
      type: "text_create_join_item",
      message0: "%{BKY_TEXT_CREATE_JOIN_ITEM_TITLE_ITEM}",
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.text,
      tooltip: "%{BKY_TEXT_CREATE_JOIN_ITEM_TOOLTIP}",
      enableContextMenu: false
    });
  },
  getVarType: function(varName) {
    return Types.TEXT;
  }
};
Blockly4.Blocks["text_append"] = {
  init: function() {
    this.jsonInit({
      type: "text_append",
      message0: "%{BKY_TEXT_APPEND_TITLE}",
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: "%{BKY_TEXT_APPEND_VARIABLE}"
        },
        {
          type: "input_value",
          name: "TEXT"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.text,
      extensions: [
        "text_append_tooltip"
      ]
    });
  },
  getVarType: function(varName) {
    return Types.TEXT;
  }
};
Blockly4.Blocks["text_length"] = {
  init: function() {
    this.jsonInit({
      message0: Blockly4.Msg.TEXT_LENGTH_TITLE,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: ["String", "Array"]
        }
      ],
      output: "Number",
      colour: CATEGORY_COLORS.text,
      tooltip: Blockly4.Msg.TEXT_LENGTH_TOOLTIP,
      helpUrl: Blockly4.Msg.TEXT_LENGTH_HELPURL
    });
  },
  getBlockType: function() {
    return Types.NUMBER;
  }
};
Blockly4.Blocks["text_isEmpty"] = {
  init: function() {
    this.jsonInit({
      message0: Blockly4.Msg.TEXT_ISEMPTY_TITLE,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: ["String", "Array"]
        }
      ],
      output: "Boolean",
      colour: CATEGORY_COLORS.text,
      tooltip: Blockly4.Msg.TEXT_ISEMPTY_TOOLTIP,
      helpUrl: Blockly4.Msg.TEXT_ISEMPTY_HELPURL
    });
  },
  getBlockType: function() {
    return Types.BOOLEAN;
  }
};
Blockly4.Blocks["text_indexOf"] = {
  init: function() {
    const OPERATORS = [
      [Blockly4.Msg.TEXT_INDEXOF_OPERATOR_FIRST, "FIRST"],
      [Blockly4.Msg.TEXT_INDEXOF_OPERATOR_LAST, "LAST"]
    ];
    this.setHelpUrl(Blockly4.Msg.TEXT_INDEXOF_HELPURL);
    this.setColour(CATEGORY_COLORS.text);
    this.setOutput(true, "Number");
    this.appendValueInput("VALUE").setCheck("String").appendField(Blockly4.Msg.TEXT_INDEXOF_INPUT_INTEXT);
    this.appendValueInput("FIND").setCheck("String").appendField(new Blockly4.FieldDropdown(OPERATORS), "END");
    if (Blockly4.Msg.TEXT_INDEXOF_TAIL) {
      this.appendDummyInput().appendField(Blockly4.Msg.TEXT_INDEXOF_TAIL);
    }
    this.setInputsInline(true);
    const thisBlock = this;
    this.setTooltip(function() {
      return Blockly4.Msg.TEXT_INDEXOF_TOOLTIP.replace(
        "%1",
        thisBlock.workspace.options.oneBasedIndex ? "0" : "-1"
      );
    });
  }
};
Blockly4.Blocks["text_charAt"] = {
  WHERE_OPTIONS: [],
  init: function() {
    this.WHERE_OPTIONS = [
      [Blockly4.Msg.TEXT_CHARAT_FROM_START, "FROM_START"],
      [Blockly4.Msg.TEXT_CHARAT_FROM_END, "FROM_END"],
      [Blockly4.Msg.TEXT_CHARAT_FIRST, "FIRST"],
      [Blockly4.Msg.TEXT_CHARAT_LAST, "LAST"]
    ];
    this.setHelpUrl(Blockly4.Msg.TEXT_CHARAT_HELPURL);
    this.setColour(CATEGORY_COLORS.text);
    this.setOutput(true, "String");
    this.appendValueInput("VALUE").setCheck("String").appendField(Blockly4.Msg.TEXT_CHARAT_INPUT_INTEXT);
    this.appendDummyInput("AT");
    this.setInputsInline(true);
    this.updateAt_(true);
    const thisBlock = this;
    this.setTooltip(function() {
      const where = thisBlock.getFieldValue("WHERE");
      let tooltip = Blockly4.Msg.TEXT_CHARAT_TOOLTIP;
      if (where === "FROM_START" || where === "FROM_END") {
        const msg = where === "FROM_START" ? Blockly4.Msg.LISTS_INDEX_FROM_START_TOOLTIP : Blockly4.Msg.LISTS_INDEX_FROM_END_TOOLTIP;
        tooltip += "  " + msg.replace(
          "%1",
          thisBlock.workspace.options.oneBasedIndex ? "#1" : "#0"
        );
      }
      return tooltip;
    });
  },
  mutationToDom: function() {
    const container = document.createElement("mutation");
    const isAt = !!this.getInput("AT").connection;
    container.setAttribute("at", String(isAt));
    return container;
  },
  domToMutation: function(xmlElement) {
    const isAt = xmlElement.getAttribute("at") !== "false";
    this.updateAt_(isAt);
  },
  updateAt_: function(isAt) {
    this.removeInput("AT");
    this.removeInput("ORDINAL", true);
    if (isAt) {
      this.appendValueInput("AT").setCheck("Number");
      if (Blockly4.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL").appendField(Blockly4.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      this.appendDummyInput("AT");
    }
    if (Blockly4.Msg.TEXT_CHARAT_TAIL) {
      this.removeInput("TAIL", true);
      this.appendDummyInput("TAIL").appendField(Blockly4.Msg.TEXT_CHARAT_TAIL);
    }
    const menu = new Blockly4.FieldDropdown(this.WHERE_OPTIONS, function(value) {
      const newAt = value === "FROM_START" || value === "FROM_END";
      if (newAt !== isAt) {
        const block = this.sourceBlock_;
        block.updateAt_(newAt);
        block.setFieldValue(value, "WHERE");
        return null;
      }
      return void 0;
    });
    this.getInput("AT").appendField(menu, "WHERE");
  }
};
Blockly4.Blocks["text_getSubstring"] = {
  WHERE_OPTIONS_1: [],
  WHERE_OPTIONS_2: [],
  init: function() {
    this.WHERE_OPTIONS_1 = [
      [Blockly4.Msg.TEXT_GET_SUBSTRING_START_FROM_START, "FROM_START"],
      [Blockly4.Msg.TEXT_GET_SUBSTRING_START_FROM_END, "FROM_END"],
      [Blockly4.Msg.TEXT_GET_SUBSTRING_START_FIRST, "FIRST"]
    ];
    this.WHERE_OPTIONS_2 = [
      [Blockly4.Msg.TEXT_GET_SUBSTRING_END_FROM_START, "FROM_START"],
      [Blockly4.Msg.TEXT_GET_SUBSTRING_END_FROM_END, "FROM_END"],
      [Blockly4.Msg.TEXT_GET_SUBSTRING_END_LAST, "LAST"]
    ];
    this.setHelpUrl(Blockly4.Msg.TEXT_GET_SUBSTRING_HELPURL);
    this.setColour(CATEGORY_COLORS.text);
    this.appendValueInput("STRING").setCheck("String").appendField(Blockly4.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT);
    this.appendDummyInput("AT1");
    this.appendDummyInput("AT2");
    if (Blockly4.Msg.TEXT_GET_SUBSTRING_TAIL) {
      this.appendDummyInput("TAIL").appendField(Blockly4.Msg.TEXT_GET_SUBSTRING_TAIL);
    }
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(Blockly4.Msg.TEXT_GET_SUBSTRING_TOOLTIP);
  },
  mutationToDom: function() {
    const container = document.createElement("mutation");
    const isAt1 = !!this.getInput("AT1").connection;
    container.setAttribute("at1", String(isAt1));
    const isAt2 = !!this.getInput("AT2").connection;
    container.setAttribute("at2", String(isAt2));
    return container;
  },
  domToMutation: function(xmlElement) {
    const isAt1 = xmlElement.getAttribute("at1") === "true";
    const isAt2 = xmlElement.getAttribute("at2") === "true";
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },
  updateAt_: function(n, isAt) {
    this.removeInput("AT" + n);
    this.removeInput("ORDINAL" + n, true);
    if (isAt) {
      this.appendValueInput("AT" + n).setCheck("Number");
      if (Blockly4.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL" + n).appendField(Blockly4.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      this.appendDummyInput("AT" + n);
    }
    if (n === 2 && Blockly4.Msg.TEXT_GET_SUBSTRING_TAIL) {
      this.removeInput("TAIL", true);
      this.appendDummyInput("TAIL").appendField(Blockly4.Msg.TEXT_GET_SUBSTRING_TAIL);
    }
    const optionsKey = "WHERE_OPTIONS_" + n;
    const menu = new Blockly4.FieldDropdown(
      this[optionsKey],
      function(value) {
        const newAt = value === "FROM_START" || value === "FROM_END";
        if (newAt !== isAt) {
          const block = this.sourceBlock_;
          block.updateAt_(n, newAt);
          block.setFieldValue(value, "WHERE" + n);
          return null;
        }
        return void 0;
      }
    );
    this.getInput("AT" + n).appendField(menu, "WHERE" + n);
    if (n === 1) {
      this.moveInputBefore("AT1", "AT2");
    }
  }
};
Blockly4.Blocks["text_changeCase"] = {
  init: function() {
    const OPERATORS = [
      [Blockly4.Msg.TEXT_CHANGECASE_OPERATOR_UPPERCASE, "UPPERCASE"],
      [Blockly4.Msg.TEXT_CHANGECASE_OPERATOR_LOWERCASE, "LOWERCASE"]
    ];
    this.setHelpUrl(Blockly4.Msg.TEXT_CHANGECASE_HELPURL);
    this.setColour(CATEGORY_COLORS.text);
    this.appendValueInput("TEXT").setCheck("String").appendField(new Blockly4.FieldDropdown(OPERATORS), "CASE");
    this.setOutput(true, "String");
    this.setTooltip(Blockly4.Msg.TEXT_CHANGECASE_TOOLTIP);
  }
};
Blockly4.Blocks["text_trim"] = {
  init: function() {
    const OPERATORS = [
      [Blockly4.Msg.TEXT_TRIM_OPERATOR_BOTH, "BOTH"],
      [Blockly4.Msg.TEXT_TRIM_OPERATOR_LEFT, "LEFT"],
      [Blockly4.Msg.TEXT_TRIM_OPERATOR_RIGHT, "RIGHT"]
    ];
    this.setHelpUrl(Blockly4.Msg.TEXT_TRIM_HELPURL);
    this.setStyle("text_blocks");
    this.appendValueInput("TEXT").setCheck("String").appendField(new Blockly4.FieldDropdown(OPERATORS), "MODE");
    this.setOutput(true, "String");
    this.setTooltip(Blockly4.Msg.TEXT_TRIM_TOOLTIP);
    this.setColour(CATEGORY_COLORS.text);
  }
};
Blockly4.Blocks["text_print"] = {
  init: function() {
    this.jsonInit({
      message0: Blockly4.Msg.TEXT_PRINT_TITLE,
      args0: [
        {
          type: "input_value",
          name: "TEXT"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.text,
      tooltip: Blockly4.Msg.TEXT_PRINT_TOOLTIP,
      helpUrl: Blockly4.Msg.TEXT_PRINT_HELPURL
    });
  }
};
Blockly4.Blocks["text_prompt_ext"] = {
  init: function() {
    const TYPES = [
      [Blockly4.Msg.TEXT_PROMPT_TYPE_TEXT, "TEXT"],
      [Blockly4.Msg.TEXT_PROMPT_TYPE_NUMBER, "NUMBER"]
    ];
    this.setHelpUrl(Blockly4.Msg.TEXT_PROMPT_HELPURL);
    this.setColour(CATEGORY_COLORS.text);
    const thisBlock = this;
    const dropdown = new Blockly4.FieldDropdown(TYPES, function(newOp) {
      thisBlock.updateType_(newOp);
      return void 0;
    });
    this.appendValueInput("TEXT").appendField(dropdown, "TYPE");
    this.setOutput(true, "String");
    this.setTooltip(function() {
      return thisBlock.getFieldValue("TYPE") === "TEXT" ? Blockly4.Msg.TEXT_PROMPT_TOOLTIP_TEXT : Blockly4.Msg.TEXT_PROMPT_TOOLTIP_NUMBER;
    });
  },
  updateType_: function(newOp) {
    this.outputConnection.setCheck(newOp === "NUMBER" ? "Number" : "String");
  },
  mutationToDom: function() {
    const container = document.createElement("mutation");
    container.setAttribute("type", this.getFieldValue("TYPE"));
    return container;
  },
  domToMutation: function(xmlElement) {
    this.updateType_(xmlElement.getAttribute("type"));
  },
  getBlockType: function() {
    return this.getFieldValue("TYPE") === "TEXT" ? Types.TEXT : Types.NUMBER;
  }
};
Blockly4.Blocks["text_prompt"] = {
  init: function() {
    const TYPES = [
      [Blockly4.Msg.TEXT_PROMPT_TYPE_TEXT, "TEXT"],
      [Blockly4.Msg.TEXT_PROMPT_TYPE_NUMBER, "NUMBER"]
    ];
    const thisBlock = this;
    this.setHelpUrl(Blockly4.Msg.TEXT_PROMPT_HELPURL);
    this.setColour(CATEGORY_COLORS.text);
    const dropdown = new Blockly4.FieldDropdown(TYPES, function(newOp) {
      thisBlock.updateType_(newOp);
      return void 0;
    });
    this.appendDummyInput().appendField(dropdown, "TYPE").appendField(this.newQuote_(true)).appendField(new Blockly4.FieldTextInput(""), "TEXT").appendField(this.newQuote_(false));
    this.setOutput(true, "String");
    this.setTooltip(function() {
      return thisBlock.getFieldValue("TYPE") === "TEXT" ? Blockly4.Msg.TEXT_PROMPT_TOOLTIP_TEXT : Blockly4.Msg.TEXT_PROMPT_TOOLTIP_NUMBER;
    });
  },
  newQuote_: Blockly4.Blocks["text"].newQuote_,
  updateType_: Blockly4.Blocks["text_prompt_ext"].updateType_,
  mutationToDom: Blockly4.Blocks["text_prompt_ext"].mutationToDom,
  domToMutation: Blockly4.Blocks["text_prompt_ext"].domToMutation,
  getBlockType: function() {
    return this.getFieldValue("TYPE") === "NUMBER" ? Types.NUMBER : Types.TEXT;
  }
};

// src/blocks/logic/arrays.ts
import * as Blockly5 from "blockly/core";
var BlocklyInputAlign = Blockly5.inputs?.Align || Blockly5.Input?.Align;
Blockly5.Blocks["lists_create_empty"] = {
  init: function() {
    this.jsonInit({
      type: "lists_create_empty",
      message0: "%{BKY_LISTS_CREATE_EMPTY_TITLE}",
      output: "Array",
      colour: CATEGORY_COLORS.array,
      tooltip: "%{BKY_LISTS_CREATE_EMPTY_TOOLTIP}",
      helpUrl: "%{BKY_LISTS_CREATE_EMPTY_HELPURL}"
    });
  }
};
Blockly5.Blocks["lists_repeat"] = {
  init: function() {
    this.jsonInit({
      type: "lists_repeat",
      message0: "%{BKY_LISTS_REPEAT_TITLE}",
      args0: [
        {
          type: "input_value",
          name: "ITEM"
        },
        {
          type: "input_value",
          name: "NUM",
          check: "Number"
        }
      ],
      output: "Array",
      colour: CATEGORY_COLORS.array,
      tooltip: "%{BKY_LISTS_REPEAT_TOOLTIP}",
      helpUrl: "%{BKY_LISTS_REPEAT_HELPURL}"
    });
  }
};
Blockly5.Blocks["lists_create_with"] = {
  init: function() {
    this.setHelpUrl(Blockly5.Msg["LISTS_CREATE_WITH_HELPURL"]);
    this.setColour(CATEGORY_COLORS.array);
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true, "Array");
    this.setMutator(new Blockly5.icons.MutatorIcon(["lists_create_with_item"], this));
    this.setTooltip(Blockly5.Msg["LISTS_CREATE_WITH_TOOLTIP"]);
  },
  mutationToDom: function() {
    const container = Blockly5.utils.xml.createElement("mutation");
    container.setAttribute("items", String(this.itemCount_));
    return container;
  },
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute("items") || "0", 10);
    this.updateShape_();
  },
  decompose: function(workspace) {
    const containerBlock = workspace.newBlock("lists_create_with_container");
    containerBlock.initSvg();
    let connection = containerBlock.getInput("STACK").connection;
    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock("lists_create_with_item");
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock("STACK");
    const connections = [];
    while (itemBlock && !itemBlock.isInsertionMarker()) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
    for (let i = 0; i < this.itemCount_; i++) {
      const connection = this.getInput("ADD" + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) === -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (let i = 0; i < this.itemCount_; i++) {
      connections[i]?.reconnect(this, "ADD" + i);
    }
  },
  saveConnections: function(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock("STACK");
    let i = 0;
    while (itemBlock) {
      const input = this.getInput("ADD" + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    if (this.itemCount_ && this.getInput("EMPTY")) {
      this.removeInput("EMPTY");
    } else if (!this.itemCount_ && !this.getInput("EMPTY")) {
      this.appendDummyInput("EMPTY").appendField(Blockly5.Msg["LISTS_CREATE_EMPTY_TITLE"]);
    }
    for (let i2 = 0; i2 < this.itemCount_; i2++) {
      if (!this.getInput("ADD" + i2)) {
        const input = this.appendValueInput("ADD" + i2).setAlign(BlocklyInputAlign.RIGHT);
        if (i2 === 0) {
          input.appendField(Blockly5.Msg["LISTS_CREATE_WITH_INPUT_WITH"]);
        }
      }
    }
    let i = this.itemCount_;
    while (this.getInput("ADD" + i)) {
      this.removeInput("ADD" + i);
      i++;
    }
  }
};
Blockly5.Blocks["lists_isEmpty"] = {
  init: function() {
    this.jsonInit({
      type: "lists_isEmpty",
      message0: "%{BKY_LISTS_ISEMPTY_TITLE}",
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: ["String", "Array"]
        }
      ],
      output: "Boolean",
      colour: CATEGORY_COLORS.array,
      tooltip: "%{BKY_LISTS_ISEMPTY_TOOLTIP}",
      helpUrl: "%{BKY_LISTS_ISEMPTY_HELPURL}"
    });
  }
};
Blockly5.Blocks["lists_length"] = {
  init: function() {
    this.jsonInit({
      type: "lists_length",
      message0: "%{BKY_LISTS_LENGTH_TITLE}",
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: ["String", "Array"]
        }
      ],
      output: "Number",
      colour: CATEGORY_COLORS.array,
      tooltip: "%{BKY_LISTS_LENGTH_TOOLTIP}",
      helpUrl: "%{BKY_LISTS_LENGTH_HELPURL}"
    });
  }
};
Blockly5.Blocks["lists_create_with_item"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.array);
    this.appendDummyInput().appendField(Blockly5.Msg.ARRAY_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly5.Msg.ARRAY_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};
Blockly5.Blocks["lists_create_with_container"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.array);
    this.appendDummyInput().appendField(Blockly5.Msg.ARRAY_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput("STACK");
    this.setTooltip(Blockly5.Msg.ARRAY_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};
Blockly5.Blocks["lists_indexOf"] = {
  init: function() {
    const OPERATORS = [
      [Blockly5.Msg["LISTS_INDEX_OF_FIRST"], "FIRST"],
      [Blockly5.Msg["LISTS_INDEX_OF_LAST"], "LAST"]
    ];
    this.setHelpUrl(Blockly5.Msg["LISTS_INDEX_OF_HELPURL"]);
    this.setColour(CATEGORY_COLORS.array);
    this.setOutput(true, "Number");
    this.appendValueInput("VALUE").setCheck("Array").appendField(Blockly5.Msg["LISTS_INDEX_OF_INPUT_IN_LIST"]);
    this.appendValueInput("FIND").appendField(new Blockly5.FieldDropdown(OPERATORS), "END");
    this.setInputsInline(true);
    const thisBlock = this;
    this.setTooltip(function() {
      return Blockly5.Msg["LISTS_INDEX_OF_TOOLTIP"].replace(
        "%1",
        thisBlock.workspace.options.oneBasedIndex ? "0" : "-1"
      );
    });
  }
};
Blockly5.Blocks["lists_getIndex"] = {
  init: function() {
    const MODE = [
      [Blockly5.Msg["LISTS_GET_INDEX_GET"], "GET"],
      [Blockly5.Msg["LISTS_GET_INDEX_GET_REMOVE"], "GET_REMOVE"],
      [Blockly5.Msg["LISTS_GET_INDEX_REMOVE"], "REMOVE"]
    ];
    this.WHERE_OPTIONS = [
      [Blockly5.Msg["LISTS_GET_INDEX_FROM_START"], "FROM_START"],
      [Blockly5.Msg["LISTS_GET_INDEX_FROM_END"], "FROM_END"],
      [Blockly5.Msg["LISTS_GET_INDEX_FIRST"], "FIRST"],
      [Blockly5.Msg["LISTS_GET_INDEX_LAST"], "LAST"],
      [Blockly5.Msg["LISTS_GET_INDEX_RANDOM"], "RANDOM"]
    ];
    this.setHelpUrl(Blockly5.Msg["LISTS_GET_INDEX_HELPURL"]);
    this.setColour(CATEGORY_COLORS.array);
    const modeMenu = new Blockly5.FieldDropdown(MODE, function(value) {
      const isStatement = value === "REMOVE";
      this.getSourceBlock().updateStatement_(isStatement);
      return void 0;
    });
    this.appendValueInput("VALUE").setCheck("Array").appendField(Blockly5.Msg["LISTS_GET_INDEX_INPUT_IN_LIST"]);
    this.appendDummyInput().appendField(modeMenu, "MODE").appendField("", "SPACE");
    this.appendDummyInput("AT");
    if (Blockly5.Msg["LISTS_GET_INDEX_TAIL"]) {
      this.appendDummyInput("TAIL").appendField(Blockly5.Msg["LISTS_GET_INDEX_TAIL"]);
    }
    this.setInputsInline(true);
    this.setOutput(true);
    this.updateAt_(true);
    const thisBlock = this;
    this.setTooltip(function() {
      const mode = thisBlock.getFieldValue("MODE");
      const where = thisBlock.getFieldValue("WHERE");
      let tooltip = "";
      switch (mode + " " + where) {
        case "GET FROM_START":
        case "GET FROM_END":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_GET_FROM"];
          break;
        case "GET FIRST":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_GET_FIRST"];
          break;
        case "GET LAST":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_GET_LAST"];
          break;
        case "GET RANDOM":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_GET_RANDOM"];
          break;
        case "GET_REMOVE FROM_START":
        case "GET_REMOVE FROM_END":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM"];
          break;
        case "GET_REMOVE FIRST":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST"];
          break;
        case "GET_REMOVE LAST":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST"];
          break;
        case "GET_REMOVE RANDOM":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM"];
          break;
        case "REMOVE FROM_START":
        case "REMOVE FROM_END":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM"];
          break;
        case "REMOVE FIRST":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST"];
          break;
        case "REMOVE LAST":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST"];
          break;
        case "REMOVE RANDOM":
          tooltip = Blockly5.Msg["LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM"];
          break;
      }
      if (where === "FROM_START" || where === "FROM_END") {
        const msg = where === "FROM_START" ? Blockly5.Msg["LISTS_INDEX_FROM_START_TOOLTIP"] : Blockly5.Msg["LISTS_INDEX_FROM_END_TOOLTIP"];
        tooltip += "  " + msg.replace("%1", thisBlock.workspace.options.oneBasedIndex ? "#1" : "#0");
      }
      return tooltip;
    });
  },
  mutationToDom: function() {
    const container = Blockly5.utils.xml.createElement("mutation");
    const isStatement = !this.outputConnection;
    container.setAttribute("statement", String(isStatement));
    const isAt = !!this.getInput("AT").connection;
    container.setAttribute("at", String(isAt));
    return container;
  },
  domToMutation: function(xmlElement) {
    const isStatement = xmlElement.getAttribute("statement") === "true";
    this.updateStatement_(isStatement);
    const isAt = xmlElement.getAttribute("at") !== "false";
    this.updateAt_(isAt);
  },
  updateStatement_: function(newStatement) {
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
  updateAt_: function(isAt) {
    this.removeInput("AT");
    this.removeInput("ORDINAL", true);
    if (isAt) {
      this.appendValueInput("AT").setCheck("Number");
      if (Blockly5.Msg["ORDINAL_NUMBER_SUFFIX"]) {
        this.appendDummyInput("ORDINAL").appendField(Blockly5.Msg["ORDINAL_NUMBER_SUFFIX"]);
      }
    } else {
      this.appendDummyInput("AT");
    }
    const menu = new Blockly5.FieldDropdown(this.WHERE_OPTIONS, function(value) {
      const newAt = value === "FROM_START" || value === "FROM_END";
      if (newAt !== isAt) {
        const block = this.getSourceBlock();
        block.updateAt_(newAt);
        block.setFieldValue(value, "WHERE");
        return null;
      }
      return void 0;
    });
    this.getInput("AT").appendField(menu, "WHERE");
    if (Blockly5.Msg["LISTS_GET_INDEX_TAIL"]) {
      this.moveInputBefore("TAIL", null);
    }
  }
};
Blockly5.Blocks["lists_setIndex"] = {
  init: function() {
    const MODE = [
      [Blockly5.Msg["LISTS_SET_INDEX_SET"], "SET"],
      [Blockly5.Msg["LISTS_SET_INDEX_INSERT"], "INSERT"]
    ];
    this.WHERE_OPTIONS = [
      [Blockly5.Msg["LISTS_GET_INDEX_FROM_START"], "FROM_START"],
      [Blockly5.Msg["LISTS_GET_INDEX_FROM_END"], "FROM_END"],
      [Blockly5.Msg["LISTS_GET_INDEX_FIRST"], "FIRST"],
      [Blockly5.Msg["LISTS_GET_INDEX_LAST"], "LAST"],
      [Blockly5.Msg["LISTS_GET_INDEX_RANDOM"], "RANDOM"]
    ];
    this.setHelpUrl(Blockly5.Msg["LISTS_SET_INDEX_HELPURL"]);
    this.setColour(CATEGORY_COLORS.array);
    this.appendValueInput("LIST").setCheck("Array").appendField(Blockly5.Msg["LISTS_SET_INDEX_INPUT_IN_LIST"]);
    this.appendDummyInput().appendField(new Blockly5.FieldDropdown(MODE), "MODE").appendField("", "SPACE");
    this.appendDummyInput("AT");
    this.appendValueInput("TO").appendField(Blockly5.Msg["LISTS_SET_INDEX_INPUT_TO"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly5.Msg["LISTS_SET_INDEX_TOOLTIP"]);
    this.updateAt_(true);
    const thisBlock = this;
    this.setTooltip(function() {
      const mode = thisBlock.getFieldValue("MODE");
      const where = thisBlock.getFieldValue("WHERE");
      let tooltip = "";
      switch (mode + " " + where) {
        case "SET FROM_START":
        case "SET FROM_END":
          tooltip = Blockly5.Msg["LISTS_SET_INDEX_TOOLTIP_SET_FROM"];
          break;
        case "SET FIRST":
          tooltip = Blockly5.Msg["LISTS_SET_INDEX_TOOLTIP_SET_FIRST"];
          break;
        case "SET LAST":
          tooltip = Blockly5.Msg["LISTS_SET_INDEX_TOOLTIP_SET_LAST"];
          break;
        case "SET RANDOM":
          tooltip = Blockly5.Msg["LISTS_SET_INDEX_TOOLTIP_SET_RANDOM"];
          break;
        case "INSERT FROM_START":
        case "INSERT FROM_END":
          tooltip = Blockly5.Msg["LISTS_SET_INDEX_TOOLTIP_INSERT_FROM"];
          break;
        case "INSERT FIRST":
          tooltip = Blockly5.Msg["LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST"];
          break;
        case "INSERT LAST":
          tooltip = Blockly5.Msg["LISTS_SET_INDEX_TOOLTIP_INSERT_LAST"];
          break;
        case "INSERT RANDOM":
          tooltip = Blockly5.Msg["LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM"];
          break;
      }
      if (where === "FROM_START" || where === "FROM_END") {
        tooltip += "  " + Blockly5.Msg["LISTS_INDEX_FROM_START_TOOLTIP"].replace(
          "%1",
          thisBlock.workspace.options.oneBasedIndex ? "#1" : "#0"
        );
      }
      return tooltip;
    });
  },
  mutationToDom: function() {
    const container = Blockly5.utils.xml.createElement("mutation");
    const isAt = !!this.getInput("AT").connection;
    container.setAttribute("at", String(isAt));
    return container;
  },
  domToMutation: function(xmlElement) {
    const isAt = xmlElement.getAttribute("at") !== "false";
    this.updateAt_(isAt);
  },
  updateAt_: function(isAt) {
    this.removeInput("AT");
    this.removeInput("ORDINAL", true);
    if (isAt) {
      this.appendValueInput("AT").setCheck("Number");
      if (Blockly5.Msg["ORDINAL_NUMBER_SUFFIX"]) {
        this.appendDummyInput("ORDINAL").appendField(Blockly5.Msg["ORDINAL_NUMBER_SUFFIX"]);
      }
    } else {
      this.appendDummyInput("AT");
    }
    const menu = new Blockly5.FieldDropdown(this.WHERE_OPTIONS, function(value) {
      const newAt = value === "FROM_START" || value === "FROM_END";
      if (newAt !== isAt) {
        const block = this.getSourceBlock();
        block.updateAt_(newAt);
        block.setFieldValue(value, "WHERE");
        return null;
      }
      return void 0;
    });
    this.moveInputBefore("AT", "TO");
    if (this.getInput("ORDINAL")) {
      this.moveInputBefore("ORDINAL", "TO");
    }
    this.getInput("AT").appendField(menu, "WHERE");
  }
};
Blockly5.Blocks["lists_getSublist"] = {
  init: function() {
    this.WHERE_OPTIONS_1 = [
      [Blockly5.Msg["LISTS_GET_SUBLIST_START_FROM_START"], "FROM_START"],
      [Blockly5.Msg["LISTS_GET_SUBLIST_START_FROM_END"], "FROM_END"],
      [Blockly5.Msg["LISTS_GET_SUBLIST_START_FIRST"], "FIRST"]
    ];
    this.WHERE_OPTIONS_2 = [
      [Blockly5.Msg["LISTS_GET_SUBLIST_END_FROM_START"], "FROM_START"],
      [Blockly5.Msg["LISTS_GET_SUBLIST_END_FROM_END"], "FROM_END"],
      [Blockly5.Msg["LISTS_GET_SUBLIST_END_LAST"], "LAST"]
    ];
    this.setHelpUrl(Blockly5.Msg["LISTS_GET_SUBLIST_HELPURL"]);
    this.setColour(CATEGORY_COLORS.array);
    this.appendValueInput("LIST").setCheck("Array").appendField(Blockly5.Msg["LISTS_GET_SUBLIST_INPUT_IN_LIST"]);
    this.appendDummyInput("AT1");
    this.appendDummyInput("AT2");
    if (Blockly5.Msg["LISTS_GET_SUBLIST_TAIL"]) {
      this.appendDummyInput("TAIL").appendField(Blockly5.Msg["LISTS_GET_SUBLIST_TAIL"]);
    }
    this.setInputsInline(true);
    this.setOutput(true, "Array");
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(Blockly5.Msg["LISTS_GET_SUBLIST_TOOLTIP"]);
  },
  mutationToDom: function() {
    const container = Blockly5.utils.xml.createElement("mutation");
    const isAt1 = !!this.getInput("AT1").connection;
    container.setAttribute("at1", String(isAt1));
    const isAt2 = !!this.getInput("AT2").connection;
    container.setAttribute("at2", String(isAt2));
    return container;
  },
  domToMutation: function(xmlElement) {
    const isAt1 = xmlElement.getAttribute("at1") === "true";
    const isAt2 = xmlElement.getAttribute("at2") === "true";
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },
  updateAt_: function(n, isAt) {
    this.removeInput("AT" + n);
    this.removeInput("ORDINAL" + n, true);
    if (isAt) {
      this.appendValueInput("AT" + n).setCheck("Number");
      if (Blockly5.Msg["ORDINAL_NUMBER_SUFFIX"]) {
        this.appendDummyInput("ORDINAL" + n).appendField(Blockly5.Msg["ORDINAL_NUMBER_SUFFIX"]);
      }
    } else {
      this.appendDummyInput("AT" + n);
    }
    const menu = new Blockly5.FieldDropdown(
      this["WHERE_OPTIONS_" + n],
      function(value) {
        const newAt = value === "FROM_START" || value === "FROM_END";
        if (newAt !== isAt) {
          const block = this.getSourceBlock();
          block.updateAt_(n, newAt);
          block.setFieldValue(value, "WHERE" + n);
          return null;
        }
        return void 0;
      }
    );
    this.getInput("AT" + n).appendField(menu, "WHERE" + n);
    if (n === 1) {
      this.moveInputBefore("AT1", "AT2");
      if (this.getInput("ORDINAL1")) {
        this.moveInputBefore("ORDINAL1", "AT2");
      }
    }
    if (Blockly5.Msg["LISTS_GET_SUBLIST_TAIL"]) {
      this.moveInputBefore("TAIL", null);
    }
  }
};
Blockly5.Blocks["lists_sort"] = {
  init: function() {
    this.jsonInit({
      message0: Blockly5.Msg["LISTS_SORT_TITLE"],
      args0: [
        {
          type: "field_dropdown",
          name: "TYPE",
          options: [
            [Blockly5.Msg["LISTS_SORT_TYPE_NUMERIC"], "NUMERIC"],
            [Blockly5.Msg["LISTS_SORT_TYPE_TEXT"], "TEXT"],
            [Blockly5.Msg["LISTS_SORT_TYPE_IGNORECASE"], "IGNORE_CASE"]
          ]
        },
        {
          type: "field_dropdown",
          name: "DIRECTION",
          options: [
            [Blockly5.Msg["LISTS_SORT_ORDER_ASCENDING"], "1"],
            [Blockly5.Msg["LISTS_SORT_ORDER_DESCENDING"], "-1"]
          ]
        },
        {
          type: "input_value",
          name: "LIST",
          check: "Array"
        }
      ],
      output: "Array",
      colour: CATEGORY_COLORS.array,
      tooltip: Blockly5.Msg["LISTS_SORT_TOOLTIP"],
      helpUrl: Blockly5.Msg["LISTS_SORT_HELPURL"]
    });
  }
};
Blockly5.Blocks["lists_split"] = {
  init: function() {
    const thisBlock = this;
    const dropdown = new Blockly5.FieldDropdown(
      [
        [Blockly5.Msg["LISTS_SPLIT_LIST_FROM_TEXT"], "SPLIT"],
        [Blockly5.Msg["LISTS_SPLIT_TEXT_FROM_LIST"], "JOIN"]
      ],
      function(newMode) {
        thisBlock.updateType_(newMode);
        return void 0;
      }
    );
    this.setHelpUrl(Blockly5.Msg["LISTS_SPLIT_HELPURL"]);
    this.setColour(CATEGORY_COLORS.array);
    this.appendValueInput("INPUT").setCheck("String").appendField(dropdown, "MODE");
    this.appendValueInput("DELIM").setCheck("String").appendField(Blockly5.Msg["LISTS_SPLIT_WITH_DELIMITER"]);
    this.setInputsInline(true);
    this.setOutput(true, "Array");
    this.setTooltip(function() {
      const mode = thisBlock.getFieldValue("MODE");
      if (mode === "SPLIT") {
        return Blockly5.Msg["LISTS_SPLIT_TOOLTIP_SPLIT"];
      } else if (mode === "JOIN") {
        return Blockly5.Msg["LISTS_SPLIT_TOOLTIP_JOIN"];
      }
      throw Error("Unknown mode: " + mode);
    });
  },
  updateType_: function(newMode) {
    const mode = this.getFieldValue("MODE");
    if (mode !== newMode) {
      const inputConnection = this.getInput("INPUT").connection;
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
    if (newMode === "SPLIT") {
      this.outputConnection.setCheck("Array");
      this.getInput("INPUT").setCheck("String");
    } else {
      this.outputConnection.setCheck("String");
      this.getInput("INPUT").setCheck("Array");
    }
  },
  mutationToDom: function() {
    const container = Blockly5.utils.xml.createElement("mutation");
    container.setAttribute("mode", this.getFieldValue("MODE"));
    return container;
  },
  domToMutation: function(xmlElement) {
    this.updateType_(xmlElement.getAttribute("mode") || "SPLIT");
  }
};

// src/blocks/logic/variables.ts
import * as Blockly6 from "blockly/core";
Blockly6.Blocks["variables_get"] = {
  init: function() {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: "%{BKY_VARIABLES_DEFAULT_NAME}"
        }
      ],
      output: null,
      colour: CATEGORY_COLORS.variables,
      helpUrl: "%{BKY_VARIABLES_GET_HELPURL}",
      tooltip: "%{BKY_VARIABLES_GET_TOOLTIP}",
      extensions: ["contextMenu_variableSetterGetter"]
    });
  },
  getBlockType: function() {
    return [Types.UNDEF, this.getFieldValue("VAR")];
  },
  getVarType: function() {
    return getChildBlockType(this);
  }
};
Blockly6.Blocks["variables_set"] = {
  init: function() {
    this.jsonInit({
      type: "variables_set",
      message0: "%{BKY_VARIABLES_SET}",
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: "%{BKY_VARIABLES_DEFAULT_NAME}"
        },
        {
          type: "input_value",
          name: "VALUE"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      tooltip: "%{BKY_VARIABLES_SET_TOOLTIP}",
      helpUrl: "%{BKY_VARIABLES_SET_HELPURL}",
      extensions: ["contextMenu_variableSetterGetter"],
      colour: CATEGORY_COLORS.variables
    });
  },
  getBlockType: function() {
    return [Types.UNDEF, this.getFieldValue("VAR")];
  },
  getVarType: function() {
    return getChildBlockType(this);
  }
};
Blockly6.Blocks["variables_set_type"] = {
  init: function() {
    this.setHelpUrl("http://arduino.cc/en/Reference/HomePage");
    this.setColour(CATEGORY_COLORS.variables);
    this.appendValueInput("VARIABLE_SETTYPE_INPUT");
    this.appendDummyInput().appendField(Blockly6.Msg.VARIABLES_AS).appendField(
      new Blockly6.FieldDropdown(getValidTypeArray()),
      "VARIABLE_SETTYPE_TYPE"
    );
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip("Sets a value to a specific type");
  },
  getBlockType: function() {
    const blocklyTypeKey = this.getFieldValue("VARIABLE_SETTYPE_TYPE");
    return Types[blocklyTypeKey];
  }
};
Blockly6.Blocks["variables_const"] = {
  init: function() {
    this.appendValueInput("VALUE").appendField("constant").appendField(new Blockly6.FieldVariable(Blockly6.Msg.VARIABLES_DEFAULT_NAME), "VAR").appendField("set");
    this.setColour(CATEGORY_COLORS.variables);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly6.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly6.Msg.HELPURL);
    this.contextMenuMsg_ = Blockly6.Msg.VARIABLES_SET_CREATE_GET;
  },
  contextMenuType_: "variables_get",
  customContextMenu: Blockly6.Blocks["variables_get"].customContextMenu,
  getVarType: function() {
    return getChildBlockType(this);
  }
};
Blockly6.Blocks["variables_set_init"] = {
  init: function() {
    this.appendValueInput("VALUE").appendField("initialize").appendField(new Blockly6.FieldVariable(Blockly6.Msg.VARIABLES_DEFAULT_NAME), "VAR").appendField(Blockly6.Msg.VARIABLES_AS).appendField(
      new Blockly6.FieldDropdown(getValidTypeArray()),
      "VARIABLE_SETTYPE_TYPE"
    ).appendField("to");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CATEGORY_COLORS.variables);
    this.setHelpUrl(Blockly6.Msg.var_set_init_helpurl);
    this.setTooltip(Blockly6.Msg.var_set_init_tooltip);
    this.contextMenuMsg_ = Blockly6.Msg.VARIABLES_SET_CREATE_GET;
  },
  contextMenuType_: "variables_get",
  customContextMenu: Blockly6.Blocks["variables_get"].customContextMenu,
  getVarType: function() {
    return getChildBlockType(this);
  }
};
Blockly6.Blocks["io_VarIN"] = {
  init: function() {
    this.appendDummyInput().appendField(Blockly6.Msg.VARIABLES_SET_CONST).appendField("IN").appendField(new Blockly6.FieldVariable(Blockly6.Msg.VARIABLES_DEFAULT_NAME), "VAR").appendField(Blockly6.Msg.ARD_WRITE_TO).appendField(new Blockly6.FieldDropdown(Arduino.AllPins), "PIN");
    this.setColour(CATEGORY_COLORS.variables);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly6.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly6.Msg.HELPURL);
  }
};
Blockly6.Blocks["io_VarOut"] = {
  init: function() {
    this.appendDummyInput().appendField(Blockly6.Msg.VARIABLES_SET_CONST).appendField("OUT").appendField(new Blockly6.FieldVariable(Blockly6.Msg.VARIABLES_DEFAULT_NAME), "VAR").appendField(Blockly6.Msg.ARD_WRITE_TO).appendField(new Blockly6.FieldDropdown(Arduino.AllPins), "PIN");
    this.setColour(CATEGORY_COLORS.variables);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly6.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly6.Msg.HELPURL);
  }
};

// src/blocks/hardware/arduino.ts
import * as Blockly7 from "blockly/core";
Blockly7.Blocks["base_begin"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.arduino);
    this.setHelpUrl(Blockly7.Msg.ARDUINO_BASE_SETUP_HELPURL);
    this.appendDummyInput("").appendField(Blockly7.Msg.ARDUINO_BASE_BEGIN);
    this.appendStatementInput("base_begin");
    this.setTooltip("Ex\xE9cut\xE9 seulement dans le 'Setup'");
  },
  getArduinoLoopsInstance: function() {
    return true;
  }
};
Blockly7.Blocks["pinmode"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.arduino);
    this.setHelpUrl(Blockly7.Msg.ARDUINO_INOUT_DIGITAL_MODE_HELPURL || "http://arduino.cc/en/Reference/PinMode");
    this.appendDummyInput("").appendField(new Blockly7.FieldDropdown([
      ["INPUT", "INPUT"],
      ["OUTPUT", "OUTPUT"],
      ["INPUT_PULLUP", "INPUT_PULLUP"]
    ]), "PINMODE");
    this.setOutput(true, "Null");
    this.setTooltip(Blockly7.Msg.ARDUINO_INOUT_DIGITAL_MODE_TOOLTIP || "Set the pin mode");
  }
};
Blockly7.Blocks["base_define_name"] = {
  init: function() {
    this.setHelpUrl(Blockly7.Msg.TEXT_TEXT_HELPURL);
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput().appendField(new Blockly7.FieldTextInput(""), "NAME");
    this.setOutput(true, "Null");
    const thisBlock = this;
    this.setTooltip(function() {
      const parent = thisBlock.getParent();
      return parent && parent.getInputsInline() && parent.tooltip || Blockly7.Msg.TEXT_TEXT_TOOLTIP;
    });
  }
};
Blockly7.Blocks["base_define"] = {
  init: function() {
    this.setHelpUrl(Blockly7.Msg.ARDUINO_BASE_DEFINE_CONST_HELPURL);
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendValueInput("NAME").setCheck("Null").setAlign(Blockly7.inputs.Align.RIGHT).appendField(Blockly7.Msg.ARDUINO_BASE_DEFINE_CONST_INPUT1);
    this.appendDummyInput().appendField(" Pin ").appendField(new Blockly7.FieldDropdown([["0", "0"]]), "PIN");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly7.Msg.ARDUINO_BASE_DEFINE_CONST_TOOLTIP);
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "digitalPins", workspace);
  }
};
Blockly7.Blocks["base_setup"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.arduino);
    this.setHelpUrl(Blockly7.Msg.ARDUINO_BASE_SETUP_HELPURL);
    this.appendDummyInput("").appendField(Blockly7.Msg.ARDUINO_BASE_SETUP);
    this.appendStatementInput("DO");
    this.setTooltip("Ex\xE9cut\xE9 seulement dans le 'Setup'");
  },
  getArduinoLoopsInstance: function() {
    return true;
  }
};
Blockly7.Blocks["base_setup_loop"] = {
  init: function() {
    this.appendDummyInput().appendField(Blockly7.Msg.ARDUINO_BASE_SETUP);
    this.appendStatementInput("SETUP_FUNC");
    this.appendDummyInput().appendField(Blockly7.Msg.ARDUINO_BASE_LOOP);
    this.appendStatementInput("LOOP_FUNC");
    this.setInputsInline(false);
    this.setColour(CATEGORY_COLORS.arduino);
    this.setTooltip("D\xE9finis le 'setup()' et le 'loop()'");
    this.setHelpUrl("https://arduino.cc/en/Reference/Loop");
    this.contextMenu = false;
  },
  getArduinoLoopsInstance: function() {
    return true;
  }
};
Blockly7.Blocks["base_loop"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.arduino);
    this.setHelpUrl(Blockly7.Msg.ARDUINO_BASE_SETUP_LOOP_HELPURL);
    this.appendDummyInput().appendField(Blockly7.Msg.ARDUINO_BASE_LOOP);
    this.appendStatementInput("LOOP_FUNC");
    this.setInputsInline(false);
    this.setTooltip("Ex\xE9cut\xE9 seulement dans le 'Loop'");
    this.contextMenu = false;
  },
  getArduinoLoopsInstance: function() {
    return true;
  }
};
Blockly7.Blocks["base_define_bloc"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.arduino);
    this.setHelpUrl(Blockly7.Msg.ARDUINO_BASE_DEFINE_HELPURL);
    this.appendDummyInput("").appendField(Blockly7.Msg.ARDUINO_BASE_DEFINE);
    this.appendStatementInput("DO").appendField(Blockly7.Msg.CONTROLS_REPEAT_INPUT_DO);
    this.setTooltip(Blockly7.Msg.ARDUINO_BASE_DEFINE_TOOLTIP);
  }
};
Blockly7.Blocks["base_code"] = {
  init: function() {
    this.setHelpUrl(Blockly7.Msg.TEXT_TEXT_HELPURL);
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput().appendField(Blockly7.Msg.ARDUINO_BASE_CODE).appendField(new Blockly7.FieldTextInput(""), "TEXT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly7.Msg.TEXT_TEXT_TOOLTIP);
  }
};
Blockly7.Blocks["base_comment"] = {
  init: function() {
    this.setHelpUrl(Blockly7.Msg.ARDUINO_BASE_COMMENT_HELPURL);
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput().appendField(Blockly7.Msg.ARDUINO_BASE_COMMENT_TEXT).appendField(new Blockly7.FieldTextInput(""), "TEXT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly7.Msg.TEXT_TEXT_TOOLTIP);
  }
};
Blockly7.Blocks["base_end"] = {
  init: function() {
    this.setHelpUrl("");
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput().appendField(Blockly7.Msg.ARDUINO_BASE_END);
    this.setPreviousStatement(true, null);
    this.setTooltip(Blockly7.Msg.END_TOOLTIP);
  }
};
Blockly7.Blocks["io_digitalwrite_Var"] = {
  init: function() {
    this.jsonInit({
      type: "io_digitalwrite_Var",
      message0: "set digital %1 to %2",
      args0: [
        {
          type: "input_value",
          name: "VAR"
        },
        {
          type: "field_dropdown",
          name: "STATE",
          options: [
            ["ON", "HIGH"],
            ["OFF", "LOW"]
          ]
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: CATEGORY_COLORS.arduino,
      tooltip: "",
      helpUrl: ""
    });
  },
  getBlockType: function() {
    return Types.NUMBER;
  }
};
Blockly7.Blocks["io_digitalwrite"] = {
  init: function() {
    this.setHelpUrl("http://arduino.cc/en/Reference/DigitalWrite");
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendValueInput("STATE").appendField(Blockly7.Msg.ARD_DIGITALWRITE).appendField(new Blockly7.FieldDropdown(Arduino.AllPins), "PIN").appendField(Blockly7.Msg.ARD_WRITE_TO).setCheck("Boolean");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly7.Msg.ARD_DIGITALWRITE_TIP);
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "AllPins", workspace);
  }
};
Blockly7.Blocks["io_digitalreadVar"] = {
  init: function() {
    this.setHelpUrl("http://arduino.cc/en/Reference/DigitalRead");
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput().appendField("read digital pin ").appendField(new Blockly7.FieldVariable("item"), "VAR");
    this.setOutput(true, "Boolean");
    this.setTooltip(Blockly7.Msg.ARD_DIGITALREAD_TIP);
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "digitalPins", workspace);
  }
};
Blockly7.Blocks["io_digitalread"] = {
  init: function() {
    this.setHelpUrl("http://arduino.cc/en/Reference/DigitalRead");
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput().appendField(Blockly7.Msg.ARD_DIGITALREAD).appendField(new Blockly7.FieldDropdown(Arduino.AllPins), "PIN");
    this.setOutput(true, "Boolean");
    this.setTooltip(Blockly7.Msg.ARD_DIGITALREAD_TIP);
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "AllPins", workspace);
  },
  getBlockType: function() {
    return Types.NUMBER;
  }
};
Blockly7.Blocks["io_builtin_led"] = {
  init: function() {
    this.setHelpUrl("http://arduino.cc/en/Reference/DigitalWrite");
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput().appendField(Blockly7.Msg.ARD_BUILTIN_LED).appendField(new Blockly7.FieldDropdown(Arduino.BuiltinLed), "BUILT_IN_LED").appendField("to").appendField(new Blockly7.FieldDropdown([["ON", "HIGH"], ["OFF", "LOW"]]), "STATE");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly7.Msg.ARD_BUILTIN_LED_TIP);
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "BUILT_IN_LED", "builtinLed", workspace);
  },
  getBlockType: function() {
    return Types.BOOLEAN;
  }
};
Blockly7.Blocks["io_analogwrite"] = {
  init: function() {
    this.setHelpUrl("http://arduino.cc/en/Reference/AnalogWrite");
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendValueInput("NUM").appendField(Blockly7.Msg.ARD_ANALOGWRITE).appendField(new Blockly7.FieldDropdown(Arduino.PwmPins), "PIN").appendField(Blockly7.Msg.ARD_WRITE_TO).setCheck("Number");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly7.Msg.ARD_ANALOGWRITE_TIP);
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "pwmPins", workspace);
  },
  getBlockType: function() {
    return Types.NUMBER;
  }
};
Blockly7.Blocks["io_analogreadVar"] = {
  init: function() {
    this.setHelpUrl("http://arduino.cc/en/Reference/AnalogRead");
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput().appendField("read analog ").appendField(new Blockly7.FieldVariable("item"), "VAR");
    this.setOutput(true);
    this.setTooltip(Blockly7.Msg.ARD_ANALOGREAD_TIP);
  },
  getBlockType: function() {
    return Types.NUMBER;
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "analogPins", workspace);
  }
};
Blockly7.Blocks["io_analogread"] = {
  init: function() {
    this.setHelpUrl("http://arduino.cc/en/Reference/AnalogRead");
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput().appendField(Blockly7.Msg.ARD_ANALOGREAD).appendField(new Blockly7.FieldDropdown(Arduino.AllPinsAnalog), "PIN");
    this.setOutput(true, "Number");
    this.setTooltip(Blockly7.Msg.ARD_ANALOGREAD_TIP);
  },
  getBlockType: function() {
    return Types.NUMBER;
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "AllPinsAnalog", workspace);
  }
};
Blockly7.Blocks["io_highlow"] = {
  init: function() {
    this.setHelpUrl("http://arduino.cc/en/Reference/Constants");
    this.setColour(CATEGORY_COLORS.arduino);
    this.appendDummyInput().appendField(new Blockly7.FieldDropdown([["ON", "HIGH"], ["OFF", "LOW"]]), "STATE");
    this.setOutput(true);
    this.setTooltip(Blockly7.Msg.ARD_HIGHLOW_TIP);
  },
  getBlockType: function() {
    return Types.BOOLEAN;
  }
};

// src/blocks/hardware/time.ts
import * as Blockly8 from "blockly/core";
Blockly8.Blocks["micros"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl(Blockly8.Msg.ARDUINO_SINCE_PROGRAM_STARTED_HELPURL);
    this.appendDummyInput("").appendField("micros");
    this.setOutput(true, "Number");
    this.setTooltip(Blockly8.Msg.ARDUINO_SINCE_PROGRAM_STARTED_TOOLTIP);
  }
};
Blockly8.Blocks["millis"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl(Blockly8.Msg.ARDUINO_SINCE_PROGRAM_STARTED_HELPURL);
    this.appendDummyInput("").appendField("millis");
    this.setOutput(true, "Number");
    this.setTooltip(Blockly8.Msg.ARDUINO_SINCE_PROGRAM_STARTED_TOOLTIP);
  }
};
Blockly8.Blocks["millis_sec"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl(Blockly8.Msg.ARDUINO_SINCE_PROGRAM_STARTED_HELPURL);
    this.appendDummyInput("").appendField("secondis");
    this.setOutput(true, "Number");
    this.setTooltip(Blockly8.Msg.ARDUINO_SINCE_PROGRAM_STARTED_TOOLTIP);
  }
};
Blockly8.Blocks["base_delay"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl(Blockly8.Msg.ARDUINO_BASE_DELAY_HELPURL);
    this.appendValueInput("DELAY_TIME").appendField(Blockly8.Msg.ARDUINO_BASE_DELAY_DELAY_TIME).setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly8.Msg.ARDUINO_BASE_DELAY_TOOLTIP);
  }
};
Blockly8.Blocks["base_delay_sec"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl(Blockly8.Msg.ARDUINO_BASE_DELAY_HELPURL);
    this.appendValueInput("DELAY_TIME").appendField(Blockly8.Msg.ARDUINO_BASE_DELAY_DELAY_TIME_SEC).setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly8.Msg.ARDUINO_BASE_DELAY_TOOLTIP);
  }
};
Blockly8.Blocks["tempo_no_delay"] = {
  init: function() {
    this.appendValueInput("DELAY_TIME").setCheck("Number").appendField(Blockly8.Msg.ARDUINO_BASE_TEMPO1 || "Every");
    this.appendDummyInput().appendField(new Blockly8.FieldDropdown([
      ["microseconds", "u"],
      ["milliseconds", "m"],
      ["seconds", "s"]
    ]), "unite").appendField(Blockly8.Msg.ARDUINO_BASE_TEMPO2 || "do");
    this.appendStatementInput("branche");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CATEGORY_COLORS.control);
    this.setTooltip(Blockly8.Msg.ARDUINO_BASE_TEMPO_TOOLTIP || "Execute code at regular intervals without blocking");
    this.setHelpUrl(Blockly8.Msg.ARDUINO_BASE_TEMPO_HELPURL || "http://arduino.cc/en/Reference/Millis");
  }
};
Blockly8.Blocks["io_pulsein"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl("http://arduino.cc/en/Reference/pulseIn");
    this.appendDummyInput().appendField(Blockly8.Msg.ARDUINO_PULSEIN || "measure pulse on pin").appendField(new Blockly8.FieldDropdown([["0", "0"]]), "PIN").appendField(Blockly8.Msg.ARDUINO_INOUT_STAT || "state").appendField(new Blockly8.FieldDropdown([
      ["HIGH", "HIGH"],
      ["LOW", "LOW"]
    ]), "STAT");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setTooltip("Reads a pulse (either HIGH or LOW) on a pin. Returns the length of the pulse in microseconds.");
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "digitalPins", workspace);
  },
  getBlockType: function() {
    return Types.NUMBER;
  }
};
Blockly8.Blocks["io_pulsein_timeout"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.control);
    this.setHelpUrl("http://arduino.cc/en/Reference/pulseIn");
    this.appendDummyInput().appendField(Blockly8.Msg.ARDUINO_PULSEIN || "measure pulse on pin").appendField(new Blockly8.FieldDropdown([["0", "0"]]), "PIN").appendField(Blockly8.Msg.ARDUINO_INOUT_STAT || "state").appendField(new Blockly8.FieldDropdown([
      ["HIGH", "HIGH"],
      ["LOW", "LOW"]
    ]), "STAT");
    this.appendValueInput("TIMEOUT").setCheck("Number").appendField(Blockly8.Msg.ARDUINO_PULSEIN_TIMEOUT || "timeout");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setTooltip("Reads a pulse (either HIGH or LOW) on a pin with a timeout. Returns the length of the pulse in microseconds.");
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "digitalPins", workspace);
  },
  getBlockType: function() {
    return Types.NUMBER;
  }
};

// src/blocks/hardware/serial.ts
import * as Blockly9 from "blockly/core";
Blockly9.Blocks["serial_init"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly9.FieldImage("/img/ico/serial.png", 60, 35)).appendField(new Blockly9.FieldDropdown([["Serial", "Serial"], ["Serial1", "Serial1"]]), "SERIAL").appendField(new Blockly9.FieldDropdown([["9600", "9600"], ["19200", "19200"], ["57600", "57600"], ["115200", "115200"], ["250000", "250000"]]), "SPEED");
    this.setColour(CATEGORY_COLORS.telecom);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly9.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly9.Msg.HELPURL);
  }
};
Blockly9.Blocks["serial_receive"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly9.FieldImage("/img/ico/serial.png", 60, 35)).appendField("Data Received ??");
    this.setOutput(true, null);
    this.setColour(CATEGORY_COLORS.telecom);
    this.setTooltip(Blockly9.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly9.Msg.HELPURL);
  }
};
Blockly9.Blocks["serial_receive_byte"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly9.FieldImage("/img/ico/serial.png", 60, 35)).appendField("Receive byte");
    this.setOutput(true, null);
    this.setColour(CATEGORY_COLORS.telecom);
    this.setTooltip(Blockly9.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly9.Msg.HELPURL);
  }
};
Blockly9.Blocks["serial_write"] = {
  init: function() {
    this.setHelpUrl(Blockly9.Msg.TEXT_APPEND_HELPURL);
    this.setColour(CATEGORY_COLORS.telecom);
    this.appendValueInput("SERIAL").appendField(new Blockly9.FieldImage("/img/ico/serial.png", 60, 35)).appendField("Serial Write");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    const thisBlock = this;
    this.setTooltip(function() {
      return Blockly9.Msg.TEXT_APPEND_TOOLTIP.replace(
        "%1",
        thisBlock.getFieldValue("VAR")
      );
    });
  },
  getVarType: function() {
    return Types.TEXT;
  }
};

// src/blocks/hardware/display.ts
import * as Blockly10 from "blockly/core";
Blockly10.Blocks["led_digitalwrite"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly10.FieldImage("/img/ico/led_ico.png", 20, 20, "*")).appendField("Set").appendField(new Blockly10.FieldDropdown(Arduino.AllPins), "PIN").appendField("to").appendField(new Blockly10.FieldDropdown([["ON", "HIGH"], ["OFF", "LOW"]]), "STATE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setColour(CATEGORY_COLORS.display);
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "AllPins", workspace);
  }
};
Blockly10.Blocks["lcd_i2c_lcdinit"] = {
  init: function() {
    this.appendDummyInput().appendField("Init LCD I2C").appendField(new Blockly10.FieldImage("/img/ico/lcd_ico.png", 120, 50, "*"));
    this.appendDummyInput().appendField("Size").appendField(new Blockly10.FieldDropdown([
      ["16x2", "16x2"],
      ["20x4", "20x4"],
      ["16x4", "16x4"],
      ["20x2", "20x2"],
      ["8x2", "8x2"]
    ]), "SIZE").appendField("Address").appendField(new Blockly10.FieldTextInput("0x27"), "ADD").appendField("Cursor").appendField(new Blockly10.FieldCheckbox("FALSE"), "Cr");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CATEGORY_COLORS.display);
    this.setTooltip("Initialize I2C LCD display with common sizes");
    this.setHelpUrl("");
  }
};
Blockly10.Blocks["lcd_i2c_lcdclear"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.display);
    this.setHelpUrl("");
    this.appendDummyInput().appendField("Clear Lcd ").appendField(new Blockly10.FieldImage("/img/ico/lcd_ico.png", 120, 50, "*"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly10.Msg.TECHNOZONE51_TEXT93);
  }
};
Blockly10.Blocks["lcd_i2c_lcdwrite"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly10.FieldImage("/img/ico/lcd_ico.png", 120, 50, "*"));
    this.appendValueInput("TEXT").appendField("Write In").appendField("Col").appendField(new Blockly10.FieldTextInput("0"), "Col").appendField("Row").appendField(new Blockly10.FieldTextInput("0"), "Row");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CATEGORY_COLORS.display);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

// src/blocks/hardware/sensor.ts
import * as Blockly12 from "blockly/core";

// src/fields/FieldVariableCreateOnly.ts
import * as Blockly11 from "blockly/core";
var RENAME_VARIABLE_ID = "RENAME_VARIABLE_ID";
var DELETE_VARIABLE_ID = "DELETE_VARIABLE_ID";
var FieldVariableCreateOnly = class _FieldVariableCreateOnly extends Blockly11.FieldVariable {
  constructor(varName, validator, variableTypes, defaultType) {
    super(varName, validator, variableTypes, defaultType);
    this.menuGenerator_ = _FieldVariableCreateOnly.dropdownCreate;
  }
  static dropdownCreate() {
    const options = Blockly11.FieldVariable.dropdownCreate.call(this);
    return options.filter((opt) => {
      if (Array.isArray(opt)) {
        return opt[1] !== RENAME_VARIABLE_ID && opt[1] !== DELETE_VARIABLE_ID;
      }
      return true;
    });
  }
  // Safety net: ignore rename/delete if somehow triggered
  onItemSelected_(menu, menuItem) {
    const value = menuItem.getValue();
    if (value === RENAME_VARIABLE_ID || value === DELETE_VARIABLE_ID) return;
    super.onItemSelected_(menu, menuItem);
  }
};

// src/blocks/hardware/sensor.ts
Blockly12.Blocks["Ultrasonic"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly12.FieldImage("/img/ico/ultrason_ico.png", 64, 45, "*")).appendField("Ultrasonic").appendField(new FieldVariableCreateOnly("myUltrasonic"), "VAR");
    this.appendDummyInput().appendField(Blockly12.Msg.VARIABLES_SET_CONST).appendField("Trig   to").appendField(new Blockly12.FieldDropdown(Arduino.AllPins), "PIN0");
    this.appendDummyInput().appendField(Blockly12.Msg.VARIABLES_SET_CONST).appendField("Echo to").appendField(new Blockly12.FieldDropdown(Arduino.AllPins), "PIN1");
    this.setColour(CATEGORY_COLORS.sensors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly12.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly12.Msg.HELPURL);
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN0", "AllPins", workspace);
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN1", "AllPins", workspace);
  }
};
Blockly12.Blocks["Ultrasonic_read"] = {
  init: function() {
    this.setHelpUrl("http://arduino.cc/en/Reference/DigitalRead");
    this.setColour(CATEGORY_COLORS.sensors);
    this.appendDummyInput().appendField(new Blockly12.FieldImage("/img/ico/ultrason_ico.png", 60, 45, "*")).appendField("Distance Of").appendField(new FieldVariableCreateOnly("myUltrasonic"), "VAR");
    this.setOutput(true, "Number");
    this.setTooltip(Blockly12.Msg.ARD_DIGITALREAD_TIP);
  },
  getBlockType: function() {
    return Types.NUMBER;
  }
};
Blockly12.Blocks["SENSOR_dht11"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl("");
    this.appendDummyInput().appendField(new Blockly12.FieldImage("/img/ico/DHT11_ico.png", 60, 45, "*")).appendField(new Blockly12.FieldDropdown([["Humidity", "h"], ["Temperature", "t"]]), "choix").appendField(new Blockly12.FieldDropdown(Arduino.AllPins), "PIN").appendField(Blockly12.Msg.pin);
    this.setOutput(true, "Number");
    this.setTooltip("returns moisture (from 0 to 100%) temperature (from 0 to 80 degrees Celsius) received by the sensor");
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "AllPins", workspace);
  }
};
Blockly12.Blocks["SENSOR_line_follower"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl(Blockly12.Msg.HELPURL);
    this.appendDummyInput().appendField(new Blockly12.FieldImage("/img/ico/line_follower.png", 100, 35, "*")).appendField("Line detected At").appendField(new Blockly12.FieldDropdown(Arduino.AllPins), "PIN");
    this.setOutput(true, "Boolean");
    this.setTooltip("returns true (false) if a black line is (not) detected");
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "AllPins", workspace);
  }
};
Blockly12.Blocks["SENSOR_lm35"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl("");
    this.appendDummyInput().appendField(new Blockly12.FieldImage("/img/ico/lm35_ico.png", 32, 50, "*")).appendField("temperature of ").appendField(new Blockly12.FieldDropdown(Arduino.analogPins), "PIN");
    this.setOutput(true, "Number");
    this.setTooltip(Blockly12.Msg.lm35_2);
  },
  getBlockType: function() {
    return Types.NUMBER;
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "analogPins", workspace);
  }
};
Blockly12.Blocks["SENSOR_light_sensor"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl("");
    this.appendDummyInput().appendField(new Blockly12.FieldImage("/img/ico/ldr_ico.png", 40, 40, "*")).appendField("daylight In ").appendField(new Blockly12.FieldDropdown(Arduino.AllPins), "PIN");
    this.setOutput(true, "Number");
    this.setTooltip("returns a value based on brightness: darkness:full light");
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "AllPins", workspace);
  },
  getBlockType: function() {
    return Types.NUMBER;
  }
};
Blockly12.Blocks["SENSOR_PIR"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl("");
    this.appendDummyInput().appendField(new Blockly12.FieldImage("/img/ico/pir_ico.png", 40, 40, "*")).appendField("Motion State In ").appendField(new Blockly12.FieldDropdown(Arduino.AllPins), "PIN");
    this.setOutput(true, "Number");
    this.setTooltip("returns true if motion is detected");
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "AllPins", workspace);
  }
};
Blockly12.Blocks["RFID_module"] = {
  init: function() {
    this.setColour(CATEGORY_COLORS.sensors);
    this.setHelpUrl(Blockly12.Msg.RFID_HELPURL);
    this.appendDummyInput().setAlign(Blockly12.inputs.Align.LEFT).appendField(Blockly12.Msg.RFID_module_TEXT).appendField(new Blockly12.FieldImage("/img/ico/module_rfid.png", 100, 50, "*"));
    this.appendDummyInput().setAlign(Blockly12.inputs.Align.RIGHT).appendField("CS").appendField(new Blockly12.FieldDropdown(Arduino.AllPins), "CS_PIN");
    this.appendDummyInput().setAlign(Blockly12.inputs.Align.RIGHT).appendField("RST").appendField(new Blockly12.FieldDropdown(Arduino.AllPins), "RST_PIN");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly12.Msg.RFID_module_TOOLTIP);
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "CS_PIN", "AllPins", workspace);
    Arduino.Boards.refreshBlockFieldDropdown(this, "RST_PIN", "AllPins", workspace);
  }
};

// src/blocks/hardware/motors.ts
import * as Blockly13 from "blockly/core";
Blockly13.Blocks["motor_servo"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly13.FieldImage("/img/ico/motorServo_ico.png", 140, 40, "*"));
    this.appendDummyInput("COMMAND_ROW").appendField(new Blockly13.FieldDropdown([
      ["Init", "init"],
      ["Write", "write"],
      ["Attach", "attach"],
      ["Detach", "detach"]
    ], function(option) {
      const block = this.getSourceBlock();
      const pinField = block.getField("PIN");
      const toLabel = block.getField("TO_LABEL");
      pinField.setVisible(option === "init");
      toLabel.setVisible(option === "init");
      const angleField = block.getField("ANGLE");
      const degLabel = block.getField("DEG_LABEL");
      if (angleField) angleField.setVisible(option === "write");
      if (degLabel) degLabel.setVisible(option === "write");
      return option;
    }), "COMMAND").appendField(new FieldVariableCreateOnly("myServo"), "VAR").appendField(" To ", "TO_LABEL").appendField(new Blockly13.FieldDropdown(Arduino.PwmPins), "PIN").appendField(new Blockly13.FieldNumber(90, 0, 180), "ANGLE").appendField("deg", "DEG_LABEL");
    this.getField("ANGLE").setVisible(false);
    this.getField("DEG_LABEL").setVisible(false);
    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Servo motor: init, write angle, attach, or detach");
    this.setHelpUrl(Blockly13.Msg.HELPURL);
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "pwmPins", workspace);
  }
};
Blockly13.Blocks["DC_Motor"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly13.FieldImage("/img/ico/icHBridgeL293D.png", 100, 45, "*"));
    this.appendDummyInput("COMMAND_ROW").appendField(new Blockly13.FieldDropdown([
      ["Init", "init"],
      ["Forward", "Forward"],
      ["Backward", "Backward"],
      ["Left", "Left"],
      ["Right", "Right"],
      ["Stop", "Stop"]
    ], function(option) {
      const block = this.getSourceBlock();
      const isInit = option === "init";
      const motorAInput = block.getInput("MOTOR_A_ROW");
      const motorBInput = block.getInput("MOTOR_B_ROW");
      if (motorAInput) motorAInput.setVisible(isInit);
      if (motorBInput) motorBInput.setVisible(isInit);
      return option;
    }), "COMMAND").appendField(new FieldVariableCreateOnly("MT"), "VAR");
    this.appendDummyInput("MOTOR_A_ROW").appendField("  MA1 ", "MA1_LABEL").appendField(new Blockly13.FieldDropdown([["0", "0"]]), "PIN0").appendField(" MA2 ", "MA2_LABEL").appendField(new Blockly13.FieldDropdown([["1", "1"]]), "PIN1");
    this.appendDummyInput("MOTOR_B_ROW").appendField("  MB1 ", "MB1_LABEL").appendField(new Blockly13.FieldDropdown([["2", "2"]]), "PIN2").appendField(" MB2 ", "MB2_LABEL").appendField(new Blockly13.FieldDropdown([["3", "3"]]), "PIN3");
    this.setColour(CATEGORY_COLORS.motors);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("DC Motor: init with pins or control direction");
    this.setHelpUrl("");
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN0", "digitalPins", workspace);
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN1", "digitalPins", workspace);
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN2", "digitalPins", workspace);
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN3", "digitalPins", workspace);
  }
};

// src/blocks/hardware/switch.ts
import * as Blockly14 from "blockly/core";
Blockly14.Blocks["switch_button_read"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly14.FieldImage("/img/ico/button_ico.png", 35, 35, "*")).appendField("BT State").appendField(new Blockly14.FieldDropdown(Arduino.AllPins), "PIN");
    this.setOutput(true, Types.NUMBER.typeId);
    this.setColour(CATEGORY_COLORS.switch);
    this.setTooltip(Blockly14.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly14.Msg.HELPURL);
  },
  updateFields: function(workspace) {
    Arduino.Boards.refreshBlockFieldDropdown(this, "PIN", "AllPins", workspace);
  }
};

// src/blocks/hardware/telecom.ts
import * as Blockly15 from "blockly/core";
Blockly15.Blocks["bluetooth_init"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly15.FieldImage("/img/ico/Bluetooth.png", 35, 35)).appendField("", "VAR").appendField("RX ").appendField(new Blockly15.FieldDropdown(Arduino.AllPins), "PIN1").appendField("TX ").appendField(new Blockly15.FieldDropdown(Arduino.AllPins), "PIN0").appendField(new Blockly15.FieldDropdown([["9600", "9600"], ["19200", "19200"], ["57600", "57600"], ["115200", "115200"], ["250000", "250000"]]), "SPEED");
    this.setColour(CATEGORY_COLORS.telecom);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly15.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly15.Msg.HELPURL);
  }
};
Blockly15.Blocks["bluetooth_receive"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly15.FieldImage("/img/ico/Bluetooth.png", 35, 35)).appendField("Data Received ??");
    this.setOutput(true, null);
    this.setColour(CATEGORY_COLORS.telecom);
    this.setTooltip(Blockly15.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly15.Msg.HELPURL);
  }
};
Blockly15.Blocks["bluetooth_receive_byte"] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly15.FieldImage("/img/ico/Bluetooth.png", 35, 35)).appendField("Receive byte");
    this.setOutput(true, null);
    this.setColour(CATEGORY_COLORS.telecom);
    this.setTooltip(Blockly15.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly15.Msg.HELPURL);
  }
};
Blockly15.Blocks["bluetooth_write"] = {
  init: function() {
    this.setHelpUrl(Blockly15.Msg.TEXT_APPEND_HELPURL);
    this.setColour(CATEGORY_COLORS.telecom);
    this.appendValueInput("BT").appendField(new Blockly15.FieldImage("/img/ico/Bluetooth.png", 35, 35)).appendField("bluetooth Write");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    const thisBlock = this;
    this.setTooltip(function() {
      return Blockly15.Msg.TEXT_APPEND_TOOLTIP.replace(
        "%1",
        thisBlock.getFieldValue("VAR")
      );
    });
  },
  getVarType: function() {
    return Types.TEXT;
  }
};
//# sourceMappingURL=chunk-XY6VLURU.js.map