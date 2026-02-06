import {
  CATEGORY_COLORS
} from "./chunk-WPDPDPQP.js";

// src/toolbox/index.ts
import * as Blockly from "blockly";

// src/toolbox/standard.ts
var operatorsCategory = {
  kind: "category",
  name: "Operators",
  toolboxitemid: "Operators",
  colour: CATEGORY_COLORS.operators,
  level: "1",
  levels: "1,2,3",
  cssConfig: { container: "Category", icon: "customTreeIcon operators" },
  contents: [
    { kind: "block", type: "logic_compare" },
    { kind: "block", type: "logic_operation" },
    { kind: "block", type: "logic_negate" },
    { kind: "block", type: "logic_boolean" },
    { kind: "block", type: "logic_null" }
  ]
};
var controlCategory = {
  kind: "category",
  name: "Control",
  toolboxitemid: "Control",
  colour: CATEGORY_COLORS.control,
  level: "1",
  levels: "1,2,3",
  cssConfig: { container: "Category", icon: "customTreeIcon control" },
  contents: [
    { kind: "block", type: "controls_if" },
    { kind: "block", type: "controls_repeat" },
    { kind: "block", type: "controls_whileUntil" },
    {
      kind: "block",
      blockxml: "<block type='controls_for'><value name='FROM'><shadow type='math_number'><field name='NUM'>1</field></shadow></value><value name='TO'><shadow type='math_number'><field name='NUM'>10</field></shadow></value><value name='BY'><shadow type='math_number'><field name='NUM'>1</field></shadow></value></block>"
    },
    { kind: "block", type: "controls_repeat_ext" },
    { kind: "block", type: "controls_flow_statements" }
  ]
};
var mathCategory = {
  kind: "category",
  name: "Math",
  toolboxitemid: "MATH",
  colour: CATEGORY_COLORS.math,
  level: "1",
  levels: "1,2,3",
  cssConfig: { container: "Category", icon: "customTreeIcon maths" },
  contents: [
    { kind: "block", blockxml: "<block type='math_number'><field name='NUM'>123</field></block>" },
    {
      kind: "block",
      blockxml: "<block type='math_arithmetic'><value name='A'><shadow type='math_number'><field name='NUM'>1</field></shadow></value><value name='B'><shadow type='math_number'><field name='NUM'>1</field></shadow></value></block>"
    },
    {
      kind: "block",
      blockxml: "<block type='math_single'><value name='NUM'><shadow type='math_number'><field name='NUM'>9</field></shadow></value></block>"
    },
    {
      kind: "block",
      blockxml: "<block type='math_trig'><value name='NUM'><shadow type='math_number'><field name='NUM'>45</field></shadow></value></block>"
    },
    { kind: "block", type: "math_constant" },
    {
      kind: "block",
      blockxml: "<block type='math_number_property'><value name='NUMBER_TO_CHECK'><shadow type='math_number'><field name='NUM'>0</field></shadow></value></block>"
    },
    {
      kind: "block",
      blockxml: "<block type='math_round'><value name='NUM'><shadow type='math_number'><field name='NUM'>3.14</field></shadow></value></block>"
    },
    { kind: "block", type: "math_on_list" },
    {
      kind: "block",
      blockxml: "<block type='math_modulo'><value name='DIVIDEND'><shadow type='math_number'><field name='NUM'>64</field></shadow></value><value name='DIVISOR'><shadow type='math_number'><field name='NUM'>10</field></shadow></value></block>"
    },
    {
      kind: "block",
      blockxml: "<block type='math_constrain'><value name='VALUE'> <shadow type='math_number'> <field name='NUM'>50</field> </shadow> </value> <value name='LOW'> <shadow type='math_number'> <field name='NUM'>1</field> </shadow> </value> <value name='HIGH'> <shadow type='math_number'> <field name='NUM'>100</field> </shadow> </value></block>"
    },
    {
      kind: "block",
      blockxml: "<block type='math_random_int'><value name='FROM'> <shadow type='math_number'> <field name='NUM'>1</field> </shadow> </value> <value name='TO'> <shadow type='math_number'> <field name='NUM'>100</field> </shadow> </value></block>"
    },
    {
      kind: "block",
      blockxml: "<block type='math_atan2'><value name='X'> <shadow type='math_number'> <field name='NUM'>1</field> </shadow> </value> <value name='Y'> <shadow type='math_number'> <field name='NUM'>1</field> </shadow> </value></block>"
    }
  ]
};
var textCategory = {
  kind: "category",
  name: "Text",
  toolboxitemid: "TEXT",
  colour: CATEGORY_COLORS.text,
  level: "1",
  levels: "1,2,3",
  cssConfig: { container: "Category", icon: "customTreeIcon text" },
  contents: [
    { kind: "block", type: "text" },
    { kind: "block", type: "text_join" },
    {
      kind: "block",
      blockxml: "<block type='text_append'><value name='TEXT'><shadow type='text'></shadow></value></block>"
    },
    {
      kind: "block",
      blockxml: "<block type='text_length'><value name='VALUE'><shadow type='text'><field name='TEXT'>abc</field></shadow></value></block>"
    },
    {
      kind: "block",
      blockxml: "<block type='text_isEmpty'><value name='VALUE'><shadow type='text'><field name='TEXT'></field></shadow></value></block>"
    }
  ]
};
var arrayCategory = {
  kind: "category",
  name: "Array",
  toolboxitemid: "ARRAY",
  colour: CATEGORY_COLORS.array,
  level: "1",
  levels: "1,2,3",
  cssConfig: { container: "Category", icon: "customTreeIcon array" },
  contents: [
    { kind: "block", type: "lists_create_with" },
    {
      kind: "block",
      blockxml: "<block type='lists_getIndex'><value name='AT'><block type='math_number'><field name='NUM'>1</field></block></value></block>"
    }
  ]
};
var variablesCategory = {
  kind: "category",
  name: "Variables",
  toolboxitemid: "VARIABLES",
  colour: CATEGORY_COLORS.variables,
  level: "1",
  levels: "1,2,3",
  cssConfig: { container: "Category", icon: "customTreeIcon variable" },
  custom: "Variables"
};
var functionsCategory = {
  kind: "category",
  name: "Functions",
  toolboxitemid: "FUNCTIONS",
  colour: CATEGORY_COLORS.functions,
  level: "1",
  levels: "1,2,3",
  cssConfig: { container: "Category", icon: "customTreeIcon function" },
  custom: "PROCEDURE"
};
var separator = { kind: "sep" };
var standardCategories = [
  operatorsCategory,
  controlCategory,
  mathCategory,
  textCategory,
  arrayCategory,
  variablesCategory,
  functionsCategory,
  separator
];

// src/toolbox/hardware.ts
var ardBasicSubcategory = {
  kind: "category",
  name: "ArdBasic",
  toolboxitemid: "ARD_BASIC",
  colour: "#4C97FF",
  level: "1",
  levels: "1,2,3",
  cssConfig: { container: "Category", icon: "ring2 Basic" },
  contents: [
    { kind: "block", type: "base_begin" },
    { kind: "block", type: "pinmode" },
    { kind: "block", type: "base_setup" },
    { kind: "block", type: "base_loop" },
    { kind: "block", type: "base_code" },
    { kind: "block", type: "base_comment" },
    { kind: "block", type: "base_end" }
  ]
};
var ioSubcategory = {
  kind: "category",
  name: "IN / OUT",
  toolboxitemid: "ARD_OUTPUT",
  colour: CATEGORY_COLORS.arduino,
  level: "1",
  levels: "1,2,3",
  cssConfig: { container: "Category", icon: "ring2 Arduino" },
  contents: [
    { kind: "block", type: "io_highlow" },
    {
      kind: "block",
      blockxml: "<block type='io_digitalwrite'><value name='STATE'><block type='io_highlow'></block ></value ></block >"
    },
    { kind: "block", type: "io_analogwrite" },
    { kind: "block", type: "io_builtin_led" },
    { kind: "block", type: "io_digitalread" },
    { kind: "block", type: "io_analogread" }
  ]
};
var timeCategory = {
  kind: "category",
  name: "Time",
  toolboxitemid: "TIME",
  colour: CATEGORY_COLORS.control,
  cssConfig: { container: "Category", icon: "customTreeIcon time" },
  contents: [
    { kind: "block", type: "math_number" },
    { kind: "block", type: "tempo_no_delay" },
    {
      kind: "block",
      blockxml: "<block type='base_delay'><value name='DELAY_TIME'><shadow type='math_number'><field name='NUM'>100</field></shadow></value ></block >"
    },
    {
      kind: "block",
      blockxml: "<block type='base_delay_sec'><value name='DELAY_TIME'><shadow type='math_number'><field name='NUM'>1</field></shadow ></value ></block >"
    },
    { kind: "block", type: "micros" },
    { kind: "block", type: "millis" },
    { kind: "block", type: "millis_sec" },
    { kind: "block", type: "io_pulsein" },
    { kind: "block", type: "io_pulsein_timeout" }
  ]
};
var arduinoCategory = {
  kind: "category",
  name: "Arduino",
  toolboxitemid: "ARDUINO",
  colour: CATEGORY_COLORS.arduino,
  expanded: "false",
  cssConfig: { container: "Category", icon: "customTreeIcon arduino" },
  contents: [ardBasicSubcategory, ioSubcategory]
};
var displayCategory = {
  kind: "category",
  name: "Display",
  toolboxitemid: "DISPLAY",
  colour: CATEGORY_COLORS.display,
  cssConfig: { container: "Category", icon: "customTreeIcon display" },
  contents: [
    { kind: "block", type: "led_digitalwrite" },
    { kind: "block", type: "lcd_i2c_lcdinit" },
    { kind: "block", type: "lcd_i2c_lcdclear" },
    { kind: "block", type: "lcd_i2c_lcdwrite" }
  ]
};
var sensorCategory = {
  kind: "category",
  name: "Sensor",
  toolboxitemid: "SENSOR",
  colour: CATEGORY_COLORS.sensors,
  cssConfig: { container: "Category", icon: "customTreeIcon sensor" },
  contents: [
    { kind: "block", type: "Ultrasonic" },
    {
      kind: "block",
      blockxml: "<block type='Ultrasonic_read'><value name='VAR'><block type='variables_get'></block ></value ></block >"
    },
    { kind: "block", type: "SENSOR_lm35" },
    { kind: "block", type: "SENSOR_dht11" },
    { kind: "block", type: "SENSOR_line_follower" },
    { kind: "block", type: "SENSOR_light_sensor" },
    { kind: "block", type: "SENSOR_PIR" },
    { kind: "block", type: "RFID_module" }
  ]
};
var motorsCategory = {
  kind: "category",
  name: "Motors",
  toolboxitemid: "MOTORS",
  colour: CATEGORY_COLORS.motors,
  cssConfig: { container: "Category", icon: "customTreeIcon motors" },
  contents: [
    { kind: "block", type: "motor_servo" },
    { kind: "block", type: "DC_Motor" }
  ]
};
var switchCategory = {
  kind: "category",
  name: "Switch",
  toolboxitemid: "SWITCH",
  colour: CATEGORY_COLORS.switch,
  cssConfig: { container: "Category", icon: "customTreeIcon switch" },
  contents: [
    { kind: "block", type: "switch_button_read" },
    { kind: "block", type: "io_highlow" }
  ]
};
var telecomCategory = {
  kind: "category",
  name: "Telecom",
  toolboxitemid: "TELECOM",
  colour: CATEGORY_COLORS.telecom,
  cssConfig: { container: "Category", icon: "customTreeIcon telecom" },
  contents: [
    { kind: "block", type: "serial_init" },
    { kind: "block", type: "serial_receive" },
    { kind: "block", type: "serial_receive_byte" },
    { kind: "block", type: "serial_write" },
    { kind: "block", type: "bluetooth_init" },
    { kind: "block", type: "bluetooth_receive" },
    { kind: "block", type: "bluetooth_receive_byte" },
    { kind: "block", type: "bluetooth_write" }
  ]
};
var hardwareCategories = [
  arduinoCategory,
  timeCategory,
  displayCategory,
  sensorCategory,
  motorsCategory,
  switchCategory,
  telecomCategory
];

// src/toolbox/index.ts
function createToolbox() {
  return {
    kind: "categoryToolbox",
    contents: [...standardCategories, ...hardwareCategories]
  };
}
function findCategoryById(categories, id) {
  for (const category of categories) {
    if (category.toolboxitemid?.toLowerCase() === id.toLowerCase() || category.name?.toLowerCase() === id.toLowerCase()) {
      return category;
    }
    if (category.contents) {
      const subcategories = category.contents.filter(
        (item) => "kind" in item && item.kind === "category"
      );
      const found = findCategoryById(subcategories, id);
      if (found) return found;
    }
  }
  return null;
}
function flattenCategoryBlocks(contents) {
  const blocks = [];
  for (const item of contents) {
    if (item.kind === "category" && item.contents) {
      blocks.push(...flattenCategoryBlocks(item.contents));
    } else if (item.kind === "block" || item.kind === "button" || item.blockxml) {
      blocks.push(item);
    }
  }
  return blocks;
}
function showCategoryBlocks(workspace, categoryId) {
  const flyout = workspace.getFlyout();
  if (!categoryId) {
    flyout?.hide();
    return;
  }
  const allCategories = [...standardCategories, ...hardwareCategories];
  const category = findCategoryById(allCategories, categoryId);
  if (!category) {
    console.warn(`Category not found: ${categoryId}`);
    return;
  }
  if (category.custom) {
    const callback = workspace.getToolboxCategoryCallback(category.custom);
    if (callback) {
      const flyoutContents = callback(workspace);
      flyout?.show(flyoutContents);
    }
  } else if (category.contents) {
    const blocks = flattenCategoryBlocks(category.contents);
    flyout?.show(blocks);
  }
}
function registerToolboxCallbacks(workspace, variablesFlyoutCallback) {
  workspace.registerButtonCallback("CREATE_VARIABLE", () => {
    Blockly.Variables.createVariableButtonHandler(workspace);
  });
  workspace.registerToolboxCategoryCallback("VARIABLE", variablesFlyoutCallback);
  workspace.registerToolboxCategoryCallback("Variables", variablesFlyoutCallback);
  workspace.registerToolboxCategoryCallback(
    "PROCEDURE",
    (ws) => Blockly.Procedures.flyoutCategory(ws, true)
  );
}

export {
  standardCategories,
  hardwareCategories,
  createToolbox,
  findCategoryById,
  flattenCategoryBlocks,
  showCategoryBlocks,
  registerToolboxCallbacks
};
//# sourceMappingURL=chunk-5ZW2NDNO.js.map