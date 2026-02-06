import {
  PinTypes,
  arduinoGenerator
} from "./chunk-VKL5354C.js";
import {
  Types,
  getSelectedBoard
} from "./chunk-7NACRFOC.js";

// src/generators/logic/operators.ts
arduinoGenerator.forBlock["logic_boolean"] = function(block) {
  const code = block.getFieldValue("BOOL") === "TRUE" ? "true" : "false";
  return [code, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["logic_operation_AND"] = function(block) {
  let argument0 = arduinoGenerator.valueToCode(block, "A", 0 /* ATOMIC */) || "false";
  let argument1 = arduinoGenerator.valueToCode(block, "B", 0 /* ATOMIC */) || "false";
  const code = `${argument0} && ${argument1}`;
  return [code, 11 /* LOGICAL_AND */];
};
arduinoGenerator.forBlock["logic_operation_OR"] = function(block) {
  let argument0 = arduinoGenerator.valueToCode(block, "A", 12 /* LOGICAL_OR */) || "false";
  let argument1 = arduinoGenerator.valueToCode(block, "B", 12 /* LOGICAL_OR */) || "false";
  const code = `${argument0} || ${argument1}`;
  return [code, 12 /* LOGICAL_OR */];
};
arduinoGenerator.forBlock["logic_operation"] = function(block) {
  const operator = block.getFieldValue("OP") === "AND" ? "&&" : "||";
  const order = operator === "&&" ? 11 /* LOGICAL_AND */ : 12 /* LOGICAL_OR */;
  let argument0 = arduinoGenerator.valueToCode(block, "A", order) || "false";
  let argument1 = arduinoGenerator.valueToCode(block, "B", order) || "false";
  const code = `${argument0} ${operator} ${argument1}`;
  return [code, order];
};
arduinoGenerator.forBlock["logic_compare"] = function(block) {
  const OPERATORS = {
    EQ: "==",
    NEQ: "!=",
    LT: "<",
    LTE: "<=",
    GT: ">",
    GTE: ">="
  };
  const operator = OPERATORS[block.getFieldValue("OP")];
  const order = operator === "==" || operator === "!=" ? 7 /* EQUALITY */ : 6 /* RELATIONAL */;
  const argument0 = arduinoGenerator.valueToCode(block, "A", order) || "0";
  const argument1 = arduinoGenerator.valueToCode(block, "B", order) || "0";
  const code = `${argument0} ${operator} ${argument1}`;
  return [code, order];
};
arduinoGenerator.forBlock["logic_negate"] = function(block) {
  const order = 2 /* UNARY_PREFIX */;
  const argument0 = arduinoGenerator.valueToCode(block, "BOOL", order) || "false";
  const code = `!${argument0}`;
  return [code, order];
};
arduinoGenerator.forBlock["logic_null"] = function(block) {
  const code = "NULL";
  return [code, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["logic_ternary"] = function(block) {
  const valueIf = arduinoGenerator.valueToCode(block, "IF", 13 /* CONDITIONAL */) || "false";
  const valueThen = arduinoGenerator.valueToCode(block, "THEN", 13 /* CONDITIONAL */) || "null";
  const valueElse = arduinoGenerator.valueToCode(block, "ELSE", 13 /* CONDITIONAL */) || "null";
  const code = `${valueIf} ? ${valueThen} : ${valueElse}`;
  return [code, 13 /* CONDITIONAL */];
};

// src/generators/logic/control.ts
import * as Blockly from "blockly/core";
var isNumber = (value) => {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(value);
};
arduinoGenerator.forBlock["controls_if"] = function(block) {
  let n = 0;
  let argument = arduinoGenerator.valueToCode(block, "IF" + n, 99 /* NONE */) || "false";
  let branch = arduinoGenerator.statementToCode(block, "DO" + n);
  let code = `if (${argument}) {
${branch}
}`;
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = arduinoGenerator.valueToCode(block, "IF" + n, 99 /* NONE */) || "false";
    branch = arduinoGenerator.statementToCode(block, "DO" + n);
    code += ` else if (${argument}) {
${branch}}`;
  }
  if (block.elseCount_) {
    branch = arduinoGenerator.statementToCode(block, "ELSE");
    code += ` else {
${branch}
}`;
  }
  return code + "\n";
};
arduinoGenerator.forBlock["controls_repeat"] = function(block) {
  const repeats = block.getFieldValue("TIMES");
  let branch = arduinoGenerator.statementToCode(block, "DO");
  if (arduinoGenerator.INFINITE_LOOP_TRAP) {
    branch = arduinoGenerator.INFINITE_LOOP_TRAP.replace(/%1/g, `'${block.id}'`) + branch;
  }
  const loopVar = arduinoGenerator.nameDB_.getDistinctName("count", Blockly.Names.NameType.VARIABLE);
  const code = `for (int ${loopVar} = 0; ${loopVar} < ${repeats}; ${loopVar}++) {
${branch}}
`;
  return code;
};
arduinoGenerator.forBlock["controls_repeat_ext"] = function(block) {
  const repeats = arduinoGenerator.valueToCode(block, "TIMES", 14 /* ASSIGNMENT */) || "0";
  let branch = arduinoGenerator.statementToCode(block, "DO");
  if (arduinoGenerator.INFINITE_LOOP_TRAP) {
    branch = arduinoGenerator.INFINITE_LOOP_TRAP.replace(/%1/g, `'${block.id}'`) + branch;
  }
  const loopVar = arduinoGenerator.nameDB_.getName("count", Blockly.Names.NameType.VARIABLE);
  const code = `for (int ${loopVar} = 0; ${loopVar} < ${repeats}; ${loopVar}++) {
${branch}}
`;
  return code;
};
arduinoGenerator.forBlock["controls_whileUntil"] = function(block) {
  let argument0 = arduinoGenerator.valueToCode(block, "BOOL", 99 /* NONE */) || "false";
  let branch = arduinoGenerator.statementToCode(block, "DO");
  if (arduinoGenerator.INFINITE_LOOP_TRAP) {
    branch = arduinoGenerator.INFINITE_LOOP_TRAP.replace(/%1/g, `'${block.id}'`) + branch;
  }
  if (block.getFieldValue("MODE") === "UNTIL") {
    if (!argument0.match(/^\w+$/)) {
      argument0 = `(${argument0})`;
    }
    argument0 = `!${argument0}`;
  }
  return `while (${argument0}) {
${branch}}
`;
};
arduinoGenerator.forBlock["controls_for"] = function(block) {
  const variable0 = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Names.NameType.VARIABLE
  );
  const argument0 = arduinoGenerator.valueToCode(block, "FROM", 14 /* ASSIGNMENT */) || "0";
  const argument1 = arduinoGenerator.valueToCode(block, "TO", 14 /* ASSIGNMENT */) || "0";
  const increment = arduinoGenerator.valueToCode(block, "BY", 14 /* ASSIGNMENT */) || "1";
  let branch = arduinoGenerator.statementToCode(block, "DO");
  branch = arduinoGenerator.addLoopTrap(branch, block);
  let code = "";
  let connectedBlock = "";
  let child = block.getChildren(false)[3];
  while (child != null) {
    connectedBlock += child.type + ",";
    child = child.getNextBlock();
  }
  if (connectedBlock.includes("digitalwrite")) {
    const up = parseFloat(argument0) <= parseFloat(argument1);
    let setupCode = `  for (int ${variable0} = ${argument0}; ${variable0}${up ? " <= " : " >= "}${argument1}; ${variable0}`;
    const step = Math.abs(parseFloat(increment));
    if (step === 1) {
      setupCode += up ? "++" : "--";
    } else {
      setupCode += (up ? " += " : " -= ") + step;
    }
    setupCode += `) {
    pinMode(${variable0}, OUTPUT);
  }
`;
    arduinoGenerator.addSetup("io_" + variable0, setupCode, false);
  }
  if (isNumber(argument0) && isNumber(argument1) && isNumber(increment)) {
    const up = parseFloat(argument0) <= parseFloat(argument1);
    code = `for (int ${variable0} = ${argument0}; ${variable0}${up ? " <= " : " >= "}${argument1}; ${variable0}`;
    const step = Math.abs(parseFloat(increment));
    if (step === 1) {
      code += up ? "++" : "--";
    } else {
      code += (up ? " += " : " -= ") + step;
    }
    code += `) {
${branch}}
`;
  }
  return code;
};
arduinoGenerator.forBlock["controls_flow_statements"] = function(block) {
  switch (block.getFieldValue("FLOW")) {
    case "BREAK":
      return "break;\n";
    case "CONTINUE":
      return "continue;\n";
  }
  throw new Error("Unknown flow statement.");
};

// src/generators/logic/math.ts
import * as Blockly2 from "blockly/core";
arduinoGenerator.forBlock["math_numbers"] = function(block) {
  const code = window.parseFloat(block.getFieldValue("NUM"));
  const order = code < 0 ? 2 /* UNARY_PREFIX */ : 0 /* ATOMIC */;
  return [code.toString(), order];
};
arduinoGenerator.forBlock["math_number"] = function(block) {
  const code = window.parseFloat(block.getFieldValue("NUM"));
  const order = code < 0 ? 2 /* UNARY_PREFIX */ : 0 /* ATOMIC */;
  return [code.toString(), order];
};
var ARITHMETIC_OPERATORS = {
  ADD: [" + ", 4 /* ADDITIVE */],
  MINUS: [" - ", 4 /* ADDITIVE */],
  MULTIPLY: [" * ", 3 /* MULTIPLICATIVE */],
  DIVIDE: [" / ", 3 /* MULTIPLICATIVE */],
  POWER: [null, 99 /* NONE */]
  // Handle power separately
};
arduinoGenerator.forBlock["math_arithmetic"] = function(block) {
  const mode = block.getFieldValue("OP");
  const tuple = ARITHMETIC_OPERATORS[mode];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = arduinoGenerator.valueToCode(block, "A", order) || "0";
  const argument1 = arduinoGenerator.valueToCode(block, "B", order) || "0";
  if (!operator) {
    const code2 = `pow(${argument0}, ${argument1})`;
    return [code2, 1 /* UNARY_POSTFIX */];
  }
  const code = argument0 + operator + argument1;
  return [code, order];
};
arduinoGenerator.forBlock["math_single"] = function(block) {
  const operator = block.getFieldValue("OP");
  let code;
  let arg;
  if (operator === "NEG") {
    arg = arduinoGenerator.valueToCode(block, "NUM", 2 /* UNARY_PREFIX */) || "0";
    if (arg[0] === "-") {
      arg = " " + arg;
    }
    code = "-" + arg;
    return [code, 2 /* UNARY_PREFIX */];
  }
  if (operator === "ABS" || operator.substring(0, 5) === "ROUND") {
    arg = arduinoGenerator.valueToCode(block, "NUM", 1 /* UNARY_POSTFIX */) || "0";
  } else if (operator === "SIN" || operator === "COS" || operator === "TAN") {
    arg = arduinoGenerator.valueToCode(block, "NUM", 3 /* MULTIPLICATIVE */) || "0";
  } else {
    arg = arduinoGenerator.valueToCode(block, "NUM", 99 /* NONE */) || "0";
  }
  switch (operator) {
    case "ABS":
      code = `abs(${arg})`;
      break;
    case "ROOT":
      code = `sqrt(${arg})`;
      break;
    case "LN":
      code = `log(${arg})`;
      break;
    case "EXP":
      code = `exp(${arg})`;
      break;
    case "POW10":
      code = `pow(10,${arg})`;
      break;
    case "ROUND":
      code = `round(${arg})`;
      break;
    case "ROUNDUP":
      code = `ceil(${arg})`;
      break;
    case "ROUNDDOWN":
      code = `floor(${arg})`;
      break;
    case "SIN":
      code = `sin(${arg} / 180 * M_PI)`;
      break;
    case "COS":
      code = `cos(${arg} / 180 * M_PI)`;
      break;
    case "TAN":
      code = `tan(${arg} / 180 * M_PI)`;
      break;
    default:
      switch (operator) {
        case "LOG10":
          code = `log(${arg}) / log(10)`;
          return [code, 3 /* MULTIPLICATIVE */];
        case "ASIN":
          code = `asin(${arg}) / M_PI * 180`;
          return [code, 3 /* MULTIPLICATIVE */];
        case "ACOS":
          code = `acos(${arg}) / M_PI * 180`;
          return [code, 3 /* MULTIPLICATIVE */];
        case "ATAN":
          code = `atan(${arg}) / M_PI * 180`;
          return [code, 3 /* MULTIPLICATIVE */];
        default:
          throw new Error("Unknown math operator: " + operator);
      }
  }
  return [code, 1 /* UNARY_POSTFIX */];
};
arduinoGenerator.forBlock["math_trig"] = arduinoGenerator.forBlock["math_single"];
arduinoGenerator.forBlock["math_round"] = arduinoGenerator.forBlock["math_single"];
arduinoGenerator.forBlock["math_constant"] = function(block) {
  const CONSTANTS = {
    PI: ["M_PI", 17 /* MEMBER */],
    E: ["E", 17 /* MEMBER */],
    GOLDEN_RATIO: ["(1 + sqrt(5)) / 2", 3 /* MULTIPLICATIVE */],
    SQRT2: ["SQRT2", 17 /* MEMBER */],
    SQRT1_2: ["SQRT1_2", 17 /* MEMBER */],
    INFINITY: ["Infinity", 0 /* ATOMIC */]
  };
  return CONSTANTS[block.getFieldValue("CONSTANT")];
};
arduinoGenerator.forBlock["math_number_property"] = function(block) {
  const numberToCheck = arduinoGenerator.valueToCode(block, "NUMBER_TO_CHECK", 3 /* MULTIPLICATIVE */) || "0";
  const property = block.getFieldValue("PROPERTY");
  let code;
  if (property === "PRIME") {
    const func = [
      "boolean " + arduinoGenerator.DEF_FUNC_NAME + "(int n) {",
      "  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods",
      "  if (n == 2 || n == 3) {",
      "    return true;",
      "  }",
      "  // False if n is NaN, negative, is 1.",
      "  // And false if n is divisible by 2 or 3.",
      "  if (isnan(n) || (n <= 1) || (n == 1) || (n % 2 == 0) || (n % 3 == 0)) {",
      "    return false;",
      "  }",
      "  // Check all the numbers of form 6k +/- 1, up to sqrt(n).",
      "  for (int x = 6; x <= sqrt(n) + 1; x += 6) {",
      "    if (n % (x - 1) == 0 || n % (x + 1) == 0) {",
      "      return false;",
      "    }",
      "  }",
      "  return true;",
      "}"
    ];
    const funcName = arduinoGenerator.addFunction("mathIsPrime", func.join("\n"));
    arduinoGenerator.addInclude("math", "#include <math.h>");
    code = `${funcName}(${numberToCheck})`;
    return [code, 1 /* UNARY_POSTFIX */];
  }
  switch (property) {
    case "EVEN":
      code = `${numberToCheck} % 2 == 0`;
      break;
    case "ODD":
      code = `${numberToCheck} % 2 == 1`;
      break;
    case "WHOLE":
      arduinoGenerator.addInclude("math", "#include <math.h>");
      code = `(floor(${numberToCheck}) == ${numberToCheck})`;
      break;
    case "POSITIVE":
      code = `${numberToCheck} > 0`;
      break;
    case "NEGATIVE":
      code = `${numberToCheck} < 0`;
      break;
    case "DIVISIBLE_BY":
      const divisor = arduinoGenerator.valueToCode(block, "DIVISOR", 3 /* MULTIPLICATIVE */) || "0";
      code = `${numberToCheck} % ${divisor} == 0`;
      break;
    default:
      throw new Error("Unknown property: " + property);
  }
  return [code, 7 /* EQUALITY */];
};
arduinoGenerator.forBlock["math_change"] = function(block) {
  const argument0 = arduinoGenerator.valueToCode(block, "DELTA", 4 /* ADDITIVE */) || "0";
  const varName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly2.Names.NameType.VARIABLE
  );
  const code = `${varName} = ${varName} + ${argument0};
`;
  return code;
};
arduinoGenerator.forBlock["math_on_list"] = function() {
  return ["", 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["math_modulo"] = function(block) {
  const argument0 = arduinoGenerator.valueToCode(block, "DIVIDEND", 3 /* MULTIPLICATIVE */) || "0";
  const argument1 = arduinoGenerator.valueToCode(block, "DIVISOR", 3 /* MULTIPLICATIVE */) || "0";
  const code = `${argument0} % ${argument1}`;
  return [code, 3 /* MULTIPLICATIVE */];
};
arduinoGenerator.forBlock["math_constrain"] = function(block) {
  const argument0 = arduinoGenerator.valueToCode(block, "VALUE", 99 /* NONE */) || "0";
  const argument1 = arduinoGenerator.valueToCode(block, "LOW", 99 /* NONE */) || "0";
  const argument2 = arduinoGenerator.valueToCode(block, "HIGH", 99 /* NONE */) || "0";
  const code = `(${argument0} < ${argument1} ? ${argument1} : ( ${argument0} > ${argument2} ? ${argument2} : ${argument0}))`;
  return [code, 1 /* UNARY_POSTFIX */];
};
arduinoGenerator.forBlock["math_random_int"] = function(block) {
  const argument0 = arduinoGenerator.valueToCode(block, "FROM", 99 /* NONE */) || "0";
  const argument1 = arduinoGenerator.valueToCode(block, "TO", 99 /* NONE */) || "0";
  const func = [
    "int " + arduinoGenerator.DEF_FUNC_NAME + "(int min, int max) {",
    "  if (min > max) {",
    "    // Swap min and max to ensure min is smaller.",
    "    int temp = min;",
    "    min = max;",
    "    max = temp;",
    "  }",
    "  return min + (rand() % (max - min + 1));",
    "}"
  ];
  const funcName = arduinoGenerator.addFunction("mathRandomInt", func.join("\n"));
  const code = `${funcName}(${argument0}, ${argument1})`;
  return [code, 1 /* UNARY_POSTFIX */];
};
arduinoGenerator.forBlock["math_random_float"] = function() {
  return ["(rand() / RAND_MAX)", 1 /* UNARY_POSTFIX */];
};
arduinoGenerator.forBlock["math_atan2"] = function(block) {
  const argument0 = arduinoGenerator.valueToCode(block, "X", 99 /* NONE */) || "0";
  const argument1 = arduinoGenerator.valueToCode(block, "Y", 99 /* NONE */) || "0";
  const code = `atan2(${argument1}, ${argument0}) / M_PI * 180`;
  return [code, 3 /* MULTIPLICATIVE */];
};

// src/generators/logic/text.ts
import * as Blockly3 from "blockly/core";
arduinoGenerator.forBlock["text"] = function(block) {
  const code = arduinoGenerator.quote_(block.getFieldValue("TEXT"));
  return [code, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["Simpletext"] = function(block) {
  const TEXT = block.getFieldValue("TEXT");
  const code = `'${TEXT}'`;
  return [code, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["text_join"] = function(block) {
  let code;
  if (block.itemCount_ === 0) {
    return ['""', 0 /* ATOMIC */];
  } else if (block.itemCount_ === 1) {
    const argument0 = arduinoGenerator.valueToCode(block, "ADD0", 1 /* UNARY_POSTFIX */) || '""';
    code = "String(" + argument0 + ")";
    return [code, 1 /* UNARY_POSTFIX */];
  } else {
    const parts = [];
    for (let n = 0; n < (block.itemCount_ || 0); n++) {
      const argument = arduinoGenerator.valueToCode(block, "ADD" + n, 99 /* NONE */);
      if (argument === "") {
        parts[n] = '""';
      } else {
        parts[n] = "String(" + argument + ")";
      }
    }
    code = parts.join(" + ");
    return [code, 1 /* UNARY_POSTFIX */];
  }
};
arduinoGenerator.forBlock["text_length"] = function(block) {
  const argument0 = arduinoGenerator.valueToCode(block, "VALUE", 1 /* UNARY_POSTFIX */) || '""';
  const code = "String(" + argument0 + ").length()";
  return [code, 1 /* UNARY_POSTFIX */];
};
arduinoGenerator.forBlock["text_isEmpty"] = function(block) {
  const func = [
    "boolean " + arduinoGenerator.DEF_FUNC_NAME + "(String msg) {",
    "  if (msg.length() == 0) {",
    "    return true;",
    "  } else {",
    "    return false;",
    "  }",
    "}"
  ];
  const funcName = arduinoGenerator.addFunction("dfg", func.join("\n"));
  let argument0 = arduinoGenerator.valueToCode(block, "VALUE", 1 /* UNARY_POSTFIX */);
  if (argument0 === "") {
    argument0 = '""';
  } else {
    argument0 = "String(" + argument0 + ")";
  }
  const code = funcName + "(" + argument0 + ")";
  return [code, 1 /* UNARY_POSTFIX */];
};
arduinoGenerator.forBlock["text_append"] = function(block) {
  const varName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly3.Names.NameType.VARIABLE
  ) || '"v"';
  let argument0 = arduinoGenerator.valueToCode(block, "TEXT", 1 /* UNARY_POSTFIX */) || '"v"';
  if (argument0 === "") {
    argument0 = '""';
  } else {
    argument0 = "String(" + argument0 + ")";
  }
  return varName + " += " + argument0 + ";\n";
};
arduinoGenerator.forBlock["text_trim"] = function(block) {
  const OPERATORS = {
    LEFT: ".trim()",
    RIGHT: ".trim()",
    BOTH: ".trim()"
  };
  const mode = block.getFieldValue("MODE");
  const operator = OPERATORS[mode];
  let argument0 = arduinoGenerator.valueToCode(block, "TEXT", 1 /* UNARY_POSTFIX */);
  if (argument0 === "") {
    argument0 = '""';
  } else {
    argument0 = "String(" + argument0 + ")";
  }
  return [argument0 + operator, 1 /* UNARY_POSTFIX */];
};
arduinoGenerator.forBlock["text_print"] = function(block) {
  const serialId = getSelectedBoard().serial[0][1];
  const setupCode = serialId + ".begin(9600);";
  arduinoGenerator.addSetup("serial_" + serialId, setupCode, false);
  let argument0 = arduinoGenerator.valueToCode(block, "TEXT", 99 /* NONE */);
  if (argument0 === "") {
    argument0 = '""';
  } else {
    argument0 = "String(" + argument0 + ")";
  }
  return serialId + ".print(" + argument0 + ");\n";
};
arduinoGenerator.forBlock["text_prompt_ext"] = function(block) {
  const serialId = getSelectedBoard().serial[0][1];
  const returnType = block.getFieldValue("TYPE");
  const func = [];
  const toNumber = returnType === "NUMBER";
  if (toNumber) {
    func.push("int " + arduinoGenerator.DEF_FUNC_NAME + "(String msg) {");
  } else {
    func.push("String " + arduinoGenerator.DEF_FUNC_NAME + "(String msg) {");
  }
  func.push("  " + serialId + ".println(msg);");
  func.push("  boolean stringComplete = false;");
  if (toNumber) {
    func.push("  int content = 0;");
  } else {
    func.push('  String content = "";');
  }
  func.push("  while (stringComplete == false) {");
  func.push("    if (" + serialId + ".available()) {");
  if (toNumber) {
    func.push("      content = " + serialId + ".parseInt();");
    func.push("      stringComplete = true;");
  } else {
    func.push("      char readChar = (char)" + serialId + ".read();");
    func.push("      if (readChar == '\\n' || readChar == '\\r') {");
    func.push("        stringComplete = true;");
    func.push("      } else {");
    func.push("        content += readChar;");
    func.push("      }");
  }
  func.push("    }");
  func.push("  }");
  func.push("  // Empty incoming serial buffer");
  func.push("  while(Serial.available()) { Serial.read(); };");
  func.push("  return content;");
  func.push("}");
  const funcName = arduinoGenerator.addFunction(
    "getUserInputPrompt" + returnType,
    func.join("\n")
  );
  const setupCode = serialId + ".begin(9600);";
  arduinoGenerator.addSetup("serial_" + serialId, setupCode, false);
  const msg = arduinoGenerator.valueToCode(block, "TEXT", 99 /* NONE */) || '""';
  const code = funcName + "(" + msg + ")";
  return [code, 1 /* UNARY_POSTFIX */];
};

// src/generators/logic/arrays.ts
import * as Blockly4 from "blockly/core";
var isNumber2 = (value) => {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(value);
};
arduinoGenerator.forBlock["array_create_with"] = function(block) {
  const itemCount = block.itemCount_ || 0;
  const items = [];
  for (let i = 0; i < itemCount; i++) {
    items.push(arduinoGenerator.valueToCode(block, "ADD" + i, 15 /* COMMA */) || "null");
  }
  const code = "{" + items.join(", ") + "}";
  return [code, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["array_getIndex"] = function(block) {
  let at = arduinoGenerator.valueToCode(block, "AT", 16 /* UNARY_NEGATION */) || "1";
  const list = arduinoGenerator.valueToCode(block, "VAR", 17 /* MEMBER */) || "[]";
  if (isNumber2(at)) {
    at = String(parseFloat(at) - 1);
  }
  const code = list + "[" + at + "]";
  return [code, 17 /* MEMBER */];
};
arduinoGenerator.forBlock["array_modify"] = function(block) {
  const index = arduinoGenerator.valueToCode(block, "indice", 0 /* ATOMIC */);
  const name = arduinoGenerator.valueToCode(block, "name", 0 /* ATOMIC */);
  const value = arduinoGenerator.valueToCode(block, "value", 0 /* ATOMIC */);
  return name + "[" + index + "] = " + value + ";\n";
};
arduinoGenerator.forBlock["array_declare"] = function(block) {
  const argument0 = arduinoGenerator.valueToCode(block, "contenu", 14 /* ASSIGNMENT */);
  const varName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly4.Names.NameType.VARIABLE
  );
  const typeBlock = arduinoGenerator.getArduinoType_(Types[block.getFieldValue("type")]);
  const choice = block.getFieldValue("choix");
  const dimension = block.getFieldValue("dim");
  switch (choice) {
    case "c1":
      if (dimension === "d2") {
        arduinoGenerator.variables_[varName] = typeBlock + " " + varName + "[" + argument0 + "][" + argument0 + "];";
      } else {
        arduinoGenerator.variables_[varName] = typeBlock + " " + varName + "[" + argument0 + "];";
      }
      break;
    case "c2":
      if (dimension === "d2") {
        const parts = argument0.split("{");
        const nb1 = parts.length - 2;
        const args = parts[2].split(",");
        const nb2 = args.length - 1;
        arduinoGenerator.variables_[varName] = typeBlock + " " + varName + "[" + nb1 + "][" + nb2 + "] = " + argument0 + ";";
      } else {
        arduinoGenerator.variables_[varName] = typeBlock + " " + varName + "[] = " + argument0 + ";";
      }
      break;
  }
  return "";
};
arduinoGenerator.forBlock["creer_tableau"] = function(block) {
  const varName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly4.Names.NameType.VARIABLE
  );
  const typeBlock = arduinoGenerator.getArduinoType_(Types[block.getFieldValue("type")]);
  const menu = block.getFieldValue("choix");
  const dimension = block.getFieldValue("dim");
  let k = "";
  let l = "";
  switch (menu) {
    case "c1":
      for (let i = 0; i < dimension; i++) {
        const j = arduinoGenerator.valueToCode(block, "D" + i, 14 /* ASSIGNMENT */);
        k += "[" + j + "]";
      }
      arduinoGenerator.variables_[varName] = typeBlock + " " + varName + k + ";";
      break;
    case "c2":
      if (dimension === "1") {
        const j = arduinoGenerator.valueToCode(block, "D0", 14 /* ASSIGNMENT */);
        arduinoGenerator.variables_[varName] = typeBlock + " " + varName + "[] =" + j + ";";
      } else {
        k += "{";
        for (let i = 0; i < dimension; i++) {
          const j = arduinoGenerator.valueToCode(block, "D" + i, 14 /* ASSIGNMENT */);
          const nb = j.split(",");
          k += j + ",";
          l += "[" + nb.length + "]";
        }
        k = k.slice(0, k.length - 1);
        k += "}";
        arduinoGenerator.variables_[varName] = typeBlock + " " + varName + l + "=" + k + ";";
      }
      break;
  }
  return "";
};
arduinoGenerator.forBlock["fixer_tableau"] = function(block) {
  const value = arduinoGenerator.valueToCode(block, "value", 0 /* ATOMIC */);
  let code = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly4.Names.NameType.VARIABLE
  );
  const dimension = block.getFieldValue("dim");
  for (let i = 0; i < dimension; i++) {
    const j = arduinoGenerator.valueToCode(block, "D" + i, 14 /* ASSIGNMENT */);
    code += "[" + j + "]";
  }
  code += "=" + value + ";\n";
  return code;
};
arduinoGenerator.forBlock["tableau_getIndex"] = function(block) {
  let code = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly4.Names.NameType.VARIABLE
  );
  const dimension = block.getFieldValue("dim");
  for (let i = 0; i < dimension; i++) {
    const j = arduinoGenerator.valueToCode(block, "D" + i, 14 /* ASSIGNMENT */);
    code += "[" + j + "]";
  }
  return [code, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["lists_create_with"] = arduinoGenerator.forBlock["array_create_with"];
arduinoGenerator.forBlock["lists_create_empty"] = function(block) {
  return ["{}", 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["lists_repeat"] = function(block) {
  const item = arduinoGenerator.valueToCode(block, "ITEM", 99 /* NONE */) || "0";
  const num = arduinoGenerator.valueToCode(block, "NUM", 99 /* NONE */) || "0";
  const code = "/* repeat " + item + " x " + num + " */";
  return [code, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["lists_length"] = function(block) {
  const list = arduinoGenerator.valueToCode(block, "VALUE", 99 /* NONE */) || "{}";
  const code = "sizeof(" + list + ") / sizeof(" + list + "[0])";
  return [code, 1 /* FUNCTION_CALL */];
};
arduinoGenerator.forBlock["lists_isEmpty"] = function(block) {
  const list = arduinoGenerator.valueToCode(block, "VALUE", 99 /* NONE */) || "{}";
  const code = "(sizeof(" + list + ") == 0)";
  return [code, 7 /* EQUALITY */];
};
arduinoGenerator.forBlock["lists_getIndex"] = function(block) {
  const list = arduinoGenerator.valueToCode(block, "VALUE", 17 /* MEMBER */) || "{}";
  const mode = block.getFieldValue("MODE");
  const where = block.getFieldValue("WHERE");
  let at = arduinoGenerator.valueToCode(block, "AT", 99 /* NONE */) || "1";
  if (where === "FROM_START") {
    if (isNumber2(at)) {
      at = String(parseFloat(at) - 1);
    } else {
      at = "(" + at + " - 1)";
    }
  } else if (where === "FIRST") {
    at = "0";
  } else if (where === "LAST") {
    at = "sizeof(" + list + ") / sizeof(" + list + "[0]) - 1";
  } else if (where === "RANDOM") {
    at = "random(sizeof(" + list + ") / sizeof(" + list + "[0]))";
  }
  const code = list + "[" + at + "]";
  if (mode === "REMOVE") {
    return code + ";\n";
  }
  return [code, 17 /* MEMBER */];
};
arduinoGenerator.forBlock["lists_setIndex"] = function(block) {
  const list = arduinoGenerator.valueToCode(block, "LIST", 17 /* MEMBER */) || "{}";
  const value = arduinoGenerator.valueToCode(block, "TO", 99 /* NONE */) || "0";
  const where = block.getFieldValue("WHERE");
  let at = arduinoGenerator.valueToCode(block, "AT", 99 /* NONE */) || "1";
  if (where === "FROM_START") {
    if (isNumber2(at)) {
      at = String(parseFloat(at) - 1);
    } else {
      at = "(" + at + " - 1)";
    }
  } else if (where === "FIRST") {
    at = "0";
  } else if (where === "LAST") {
    at = "sizeof(" + list + ") / sizeof(" + list + "[0]) - 1";
  } else if (where === "RANDOM") {
    at = "random(sizeof(" + list + ") / sizeof(" + list + "[0]))";
  }
  return list + "[" + at + "] = " + value + ";\n";
};

// src/generators/logic/variables.ts
import * as Blockly5 from "blockly/core";
arduinoGenerator.forBlock["variables_get"] = function(block) {
  const code = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly5.Names.NameType.VARIABLE
  );
  return [code, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["variables_set"] = function(block) {
  const value = arduinoGenerator.valueToCode(block, "VALUE", 14 /* ASSIGNMENT */) || "0";
  const varName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly5.Names.NameType.VARIABLE
  );
  return varName + " = " + value + ";\n";
};
arduinoGenerator.forBlock["variables_set_type"] = function(block) {
  const value = arduinoGenerator.valueToCode(block, "VARIABLE_SETTYPE_INPUT", 14 /* ASSIGNMENT */) || "0";
  const varType = arduinoGenerator.getArduinoType_(Types[block.getFieldValue("VARIABLE_SETTYPE_TYPE")]);
  const code = "(" + varType + ")(" + value + ")";
  return [code, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["variables_const"] = function(block) {
  const value = arduinoGenerator.valueToCode(block, "VALUE", 14 /* ASSIGNMENT */) || "0";
  const varName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly5.Names.NameType.VARIABLE
  );
  arduinoGenerator.variables_[varName] = "const auto " + varName + " = " + value + ";";
  return "";
};
arduinoGenerator.forBlock["variables_set_init"] = function(block) {
  const value = arduinoGenerator.valueToCode(block, "VALUE", 14 /* ASSIGNMENT */) || "0";
  const varName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly5.Names.NameType.VARIABLE
  );
  const varType = arduinoGenerator.getArduinoType_(Types[block.getFieldValue("VARIABLE_SETTYPE_TYPE")]);
  arduinoGenerator.variables_[varName] = varType + " " + varName + " = " + value + ";";
  return "";
};
arduinoGenerator.forBlock["io_VarIN"] = function(block) {
  const pin = block.getFieldValue("PIN") || "2";
  const varName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly5.Names.NameType.VARIABLE
  );
  const pinSetupCode = "  pinMode(" + varName + ", INPUT);";
  arduinoGenerator.addSetup("io_" + varName, pinSetupCode, false);
  arduinoGenerator.variables_[varName] = "const int " + varName + " = " + pin + ";";
  return "";
};
arduinoGenerator.forBlock["io_VarOut"] = function(block) {
  const pin = block.getFieldValue("PIN") || "2";
  const varName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly5.Names.NameType.VARIABLE
  );
  const pinSetupCode = "  pinMode(" + varName + ", OUTPUT);";
  arduinoGenerator.addSetup("io_" + varName, pinSetupCode, false);
  arduinoGenerator.variables_[varName] = "const int " + varName + " = " + pin + ";";
  return "";
};
arduinoGenerator.forBlock["io_2Var"] = function(block) {
  const pin0 = block.getFieldValue("PIN0") || "2";
  const varName0 = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR0"),
    Blockly5.Names.NameType.VARIABLE
  );
  const pin1 = block.getFieldValue("PIN1") || "3";
  const varName1 = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("VAR1"),
    Blockly5.Names.NameType.VARIABLE
  );
  arduinoGenerator.variables_[varName0] = "const int " + varName0 + " = " + pin0 + ";";
  arduinoGenerator.variables_[varName1] = "const int " + varName1 + " = " + pin1 + ";";
  return "";
};

// src/generators/logic/functions.ts
import * as Blockly6 from "blockly/core";
arduinoGenerator.forBlock["procedures_defreturn"] = function(block) {
  const funcName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly6.Names.NameType.PROCEDURE
  );
  let branch = arduinoGenerator.statementToCode(block, "STACK");
  if (arduinoGenerator.STATEMENT_PREFIX) {
    const id = block.id.replace(/\$/g, "$$$$");
    branch = arduinoGenerator.prefixLines(
      arduinoGenerator.STATEMENT_PREFIX.replace(/%1/g, "'" + id + "'"),
      arduinoGenerator.INDENT
    ) + branch;
  }
  if (arduinoGenerator.INFINITE_LOOP_TRAP) {
    branch = arduinoGenerator.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + block.id + "'") + branch;
  }
  let returnValue = arduinoGenerator.valueToCode(block, "RETURN", 99 /* NONE */) || "";
  if (returnValue) {
    returnValue = arduinoGenerator.INDENT + "return " + returnValue + ";\n";
  }
  const returnType = returnValue ? "int" : "void";
  const args = [];
  for (let i = 0; i < block.arguments_.length; i++) {
    args[i] = "int " + arduinoGenerator.nameDB_.getName(
      block.arguments_[i],
      Blockly6.Names.NameType.VARIABLE
    );
  }
  let code = returnType + " " + funcName + "(" + args.join(", ") + ") {\n" + branch + returnValue + "}\n";
  code = arduinoGenerator.scrub_(block, code);
  arduinoGenerator.addDeclaration("%" + funcName, code);
  return null;
};
arduinoGenerator.forBlock["procedures_defnoreturn"] = arduinoGenerator.forBlock["procedures_defreturn"];
arduinoGenerator.forBlock["procedures_callreturn"] = function(block) {
  const funcName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly6.Names.NameType.PROCEDURE
  );
  const args = [];
  for (let i = 0; i < block.arguments_.length; i++) {
    args[i] = arduinoGenerator.valueToCode(block, "ARG" + i, 15 /* COMMA */) || "null";
  }
  const code = funcName + "(" + args.join(", ") + ")";
  return [code, 1 /* FUNCTION_CALL */];
};
arduinoGenerator.forBlock["procedures_callnoreturn"] = function(block) {
  const funcName = arduinoGenerator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly6.Names.NameType.PROCEDURE
  );
  const args = [];
  for (let i = 0; i < block.arguments_.length; i++) {
    args[i] = arduinoGenerator.valueToCode(block, "ARG" + i, 15 /* COMMA */) || "null";
  }
  return funcName + "(" + args.join(", ") + ");\n";
};
arduinoGenerator.forBlock["procedures_ifreturn"] = function(block) {
  const condition = arduinoGenerator.valueToCode(block, "CONDITION", 99 /* NONE */) || "false";
  let code = "if (" + condition + ") {\n";
  if (block.hasReturnValue_) {
    const value = arduinoGenerator.valueToCode(block, "VALUE", 99 /* NONE */) || "null";
    code += arduinoGenerator.INDENT + "return " + value + ";\n";
  } else {
    code += arduinoGenerator.INDENT + "return;\n";
  }
  code += "}\n";
  return code;
};

// src/generators/hardware/arduino.ts
arduinoGenerator.forBlock["base_begin"] = function(block) {
  const branch = arduinoGenerator.statementToCode(block, "base_begin");
  arduinoGenerator.addSetup("base_begin_" + block.id, branch, true);
  return "";
};
arduinoGenerator.forBlock["base_setup"] = function(block) {
  const branch = arduinoGenerator.statementToCode(block, "DO");
  arduinoGenerator.addSetup("base_setup_" + block.id, branch, true);
  return "";
};
arduinoGenerator.forBlock["pinmode"] = function(block) {
  return [block.getFieldValue("PINMODE"), 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["base_define_name"] = function(block) {
  const code = block.getFieldValue("NAME");
  return [code, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["base_define"] = function(block) {
  const name = arduinoGenerator.valueToCode(block, "NAME", 0 /* ATOMIC */);
  const pin = block.getFieldValue("PIN");
  arduinoGenerator.addInclude(name, `#define ${name} ${pin}`);
  return "";
};
arduinoGenerator.forBlock["base_loop"] = function(block) {
  const targetBlock = block.getInputTargetBlock("LOOP_FUNC");
  const loopBranch = targetBlock ? arduinoGenerator.blockToCode(targetBlock) : "";
  if (loopBranch) {
    arduinoGenerator.addLoop("userLoopCode", loopBranch, true);
  }
  return "";
};
arduinoGenerator.forBlock["base_setup_loop"] = function(block) {
  const setupBranch = arduinoGenerator.statementToCode(block, "SETUP_FUNC");
  if (setupBranch) {
    arduinoGenerator.addSetup("userSetupCode", setupBranch, true);
  }
  const targetBlock = block.getInputTargetBlock("LOOP_FUNC");
  const loopBranch = targetBlock ? arduinoGenerator.blockToCode(targetBlock) : "";
  return loopBranch;
};
arduinoGenerator.forBlock["base_define_bloc"] = function(block) {
  const branch = arduinoGenerator.statementToCode(block, "DO");
  arduinoGenerator.addVariable("base_define_bloc_" + block.id, branch, true);
  return "";
};
arduinoGenerator.forBlock["base_code"] = function(block) {
  return block.getFieldValue("TEXT") + "\n";
};
arduinoGenerator.forBlock["base_comment"] = function(block) {
  return "// " + block.getFieldValue("TEXT") + "\n";
};
arduinoGenerator.forBlock["base_end"] = function(_block) {
  return "while(true);\n";
};
arduinoGenerator.forBlock["io_digitalwrite_Var"] = function(block) {
  const pin = arduinoGenerator.valueToCode(block, "VAR", 0 /* ATOMIC */);
  const stateOutput = block.getFieldValue("STATE") || "LOW";
  arduinoGenerator.addSetup("io_" + pin, `  pinMode(${pin}, OUTPUT);`, false);
  return `digitalWrite(${pin}, ${stateOutput});
`;
};
arduinoGenerator.forBlock["io_digitalwrite"] = function(block) {
  const pin = block.getFieldValue("PIN");
  const stateOutput = arduinoGenerator.valueToCode(block, "STATE", 0 /* ATOMIC */) || "LOW";
  arduinoGenerator.reservePin(block, pin, PinTypes.OUTPUT, "Digital Write");
  arduinoGenerator.addSetup("io_" + pin, `  pinMode(${pin}, OUTPUT);`, false);
  return `digitalWrite(${pin}, ${stateOutput});
`;
};
arduinoGenerator.forBlock["io_digitalreadVar"] = function(block) {
  const pin = block.getFieldValue("VAR");
  arduinoGenerator.reservePin(block, pin, PinTypes.INPUT, "Digital Read");
  arduinoGenerator.addSetup("io_" + pin, `  pinMode(${pin}, INPUT);`, false);
  return [`digitalRead(${pin})`, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["io_digitalread"] = function(block) {
  const pin = block.getFieldValue("PIN");
  arduinoGenerator.reservePin(block, pin, PinTypes.INPUT, "Digital Read");
  arduinoGenerator.addSetup("io_" + pin, `  pinMode(${pin}, INPUT);`, false);
  return [`digitalRead(${pin})`, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["io_builtin_led"] = function(block) {
  const pin = block.getFieldValue("BUILT_IN_LED");
  const stateOutput = block.getFieldValue("STATE");
  arduinoGenerator.reservePin(block, pin, PinTypes.OUTPUT, "Set LED");
  arduinoGenerator.addSetup("io_" + pin, `  pinMode(${pin}, OUTPUT);`, false);
  return `digitalWrite(${pin}, ${stateOutput});
`;
};
arduinoGenerator.forBlock["io_analogwrite"] = function(block) {
  const pin = block.getFieldValue("PIN");
  const stateOutput = arduinoGenerator.valueToCode(block, "NUM", 0 /* ATOMIC */) || "0";
  arduinoGenerator.reservePin(block, pin, PinTypes.OUTPUT, "Analogue Write");
  arduinoGenerator.addSetup("io_" + pin, `  pinMode(${pin}, OUTPUT);`, false);
  const numVal = Number(stateOutput);
  if (!isNaN(numVal) && (numVal < 0 || numVal > 255)) {
    block.setWarningText("The analogue value set must be between 0 and 255", "pwm_value");
  } else {
    block.setWarningText(null, "pwm_value");
  }
  return `analogWrite(${pin}, ${stateOutput});
`;
};
arduinoGenerator.forBlock["io_analogreadVar"] = function(block) {
  const pin = block.getFieldValue("VAR");
  arduinoGenerator.reservePin(block, pin, PinTypes.INPUT, "Analogue Read");
  arduinoGenerator.addSetup("io_" + pin, `  pinMode(${pin}, INPUT);`, false);
  return [`analogRead(${pin})`, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["io_analogread"] = function(block) {
  const pin = block.getFieldValue("PIN");
  arduinoGenerator.reservePin(block, pin, PinTypes.INPUT, "Analogue Read");
  arduinoGenerator.addSetup("io_" + pin, `  pinMode(${pin}, INPUT);`, false);
  return [`analogRead(${pin})`, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["io_highlow"] = function(block) {
  return [block.getFieldValue("STATE"), 0 /* ATOMIC */];
};

// src/generators/hardware/time.ts
arduinoGenerator.forBlock["millis"] = function(_block) {
  return ["millis()", 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["micros"] = function(_block) {
  return ["micros()", 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["millis_sec"] = function(_block) {
  return ["millis()/1000", 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["base_delay"] = function(block) {
  const delayTime = arduinoGenerator.valueToCode(block, "DELAY_TIME", 0 /* ATOMIC */);
  return `delay(${delayTime});
`;
};
arduinoGenerator.forBlock["base_delay_sec"] = function(block) {
  const delayTime = arduinoGenerator.valueToCode(block, "DELAY_TIME", 0 /* ATOMIC */);
  return `delay(${delayTime} * 1000);
`;
};
arduinoGenerator.forBlock["tempo_no_delay"] = function(block) {
  const unit = block.getFieldValue("unite");
  const delayTime = arduinoGenerator.valueToCode(block, "DELAY_TIME", 0 /* ATOMIC */);
  const body = arduinoGenerator.statementToCode(block, "branche");
  const temps = "temps" + delayTime;
  arduinoGenerator.addDeclaration("temporisation" + delayTime, `long ${temps} = 0;`);
  let code;
  switch (unit) {
    case "us":
      code = `if ((micros()-${temps}>=${delayTime}) {
  ${temps}=micros();
${body}}
`;
      break;
    case "ms":
      code = `if ((millis()-${temps}>=${delayTime}) {
  ${temps}=millis();
${body}}
`;
      break;
    case "s":
      code = `if ((millis()-${temps}>=${delayTime}*1000) {
  ${temps}=millis();
${body}}
`;
      break;
    default:
      code = "";
  }
  return code;
};
arduinoGenerator.forBlock["io_pulsein"] = function(block) {
  const pin = block.getFieldValue("PIN");
  const stat = block.getFieldValue("STAT");
  arduinoGenerator.addSetup("setup_input_" + pin, `pinMode(${pin}, INPUT);`, true);
  return [`pulseIn(${pin},${stat})`, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["io_pulsein_timeout"] = function(block) {
  const pin = block.getFieldValue("PIN");
  const stat = block.getFieldValue("STAT");
  const timeout = arduinoGenerator.valueToCode(block, "TIMEOUT", 0 /* ATOMIC */) || "0";
  arduinoGenerator.addSetup("setup_input_" + pin, `pinMode(${pin}, INPUT);`, true);
  return [`pulseIn(${pin}, ${stat}, ${timeout})`, 0 /* ATOMIC */];
};

// src/generators/hardware/serial.ts
arduinoGenerator.forBlock["serial_init"] = function(block) {
  const speed = block.getFieldValue("SPEED");
  const serial = block.getFieldValue("SERIAL");
  arduinoGenerator.addSetup("setup_serial_speed", `  ${serial}.begin(${speed});`, true);
  return "";
};
arduinoGenerator.forBlock["serial_receive"] = function(_block) {
  return ["Serial.available() > 0", 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["serial_receive_byte"] = function(_block) {
  return ["Serial.read()", 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["serial_write"] = function(block) {
  const argument0 = arduinoGenerator.valueToCode(block, "SERIAL", 1 /* UNARY_POSTFIX */);
  return `Serial.write(${argument0});
`;
};

// src/generators/hardware/display.ts
arduinoGenerator.forBlock["led_digitalwrite"] = function(block) {
  const pin = block.getFieldValue("PIN");
  const stateOutput = block.getFieldValue("STATE") || "LOW";
  arduinoGenerator.reservePin(block, pin, PinTypes.OUTPUT, "LED");
  if (pin !== "j" && pin !== "i") {
    arduinoGenerator.addSetup("io_" + pin, `  pinMode(${pin}, OUTPUT);`, false);
  }
  return `digitalWrite(${pin}, ${stateOutput});
`;
};
arduinoGenerator.forBlock["lcd_i2c_lcdinit"] = function(block) {
  const address = block.getFieldValue("ADD") || "0x27";
  const size = block.getFieldValue("SIZE") || "16x2";
  const cursor = block.getFieldValue("Cr");
  const [cols, rows] = size.split("x").map((s) => s.trim());
  arduinoGenerator.addInclude("define_Wire", "#include <Wire.h>");
  arduinoGenerator.addInclude("define_LiquidCrystal_I2C", "#include <LiquidCrystal_I2C.h>");
  arduinoGenerator.addDeclaration("var_lcd", `LiquidCrystal_I2C lcd(${address}, ${cols}, ${rows});`);
  let setup = "  lcd.init();\n";
  setup += "  lcd.backlight();\n";
  setup += "  lcd.noBlink();\n";
  if (cursor === "TRUE") {
    setup += "  lcd.cursor();\n";
  } else {
    setup += "  lcd.noCursor();\n";
  }
  arduinoGenerator.addSetup("setup_lcd", setup, true);
  return "";
};
arduinoGenerator.forBlock["lcd_i2c_lcdclear"] = function(_block) {
  return "lcd.clear();\n";
};
arduinoGenerator.forBlock["lcd_i2c_lcdwrite"] = function(block) {
  const text = arduinoGenerator.valueToCode(block, "TEXT", 1 /* UNARY_POSTFIX */) || "''";
  const col = block.getFieldValue("Col");
  const row = block.getFieldValue("Row");
  return `lcd.setCursor(${col},${row});
lcd.print(${text});
`;
};

// src/generators/hardware/sensor.ts
arduinoGenerator.forBlock["Ultrasonic"] = function(block) {
  const trigPin = block.getFieldValue("PIN0") || "2";
  const echoPin = block.getFieldValue("PIN1") || "3";
  const name = block.getField("VAR")?.getText() || "myUltrasonic";
  arduinoGenerator.reservePin(block, trigPin, PinTypes.OUTPUT, "Ultrasonic Trig");
  arduinoGenerator.reservePin(block, echoPin, PinTypes.INPUT, "Ultrasonic Echo");
  arduinoGenerator.addInclude("includes_" + name, "#include <HCSR04.h>");
  arduinoGenerator.addDeclaration("var_" + name, `HCSR04 ${name}(${trigPin},${echoPin});`);
  arduinoGenerator.addVariable(name + "1", `const int ${name}_Trig = ${trigPin};`, true);
  arduinoGenerator.addVariable(name + "2", `const int ${name}_Echo = ${echoPin};`, true);
  arduinoGenerator.addSetup("setup_input_" + trigPin, `  pinMode(${name}_Trig, OUTPUT);`, true);
  arduinoGenerator.addSetup("setup_input_" + echoPin, `  pinMode(${name}_Echo, INPUT);`, true);
  return "";
};
arduinoGenerator.forBlock["Ultrasonic_read"] = function(block) {
  const name = block.getField("VAR")?.getText() || "myUltrasonic";
  arduinoGenerator.addVariable("var1" + name, `int Distance_${name};`, true);
  arduinoGenerator.addLoopCode("var2" + name, `Distance_${name} = ${name}.dist();`);
  return [`Distance_${name}`, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["SENSOR_lm35"] = function(block) {
  const pin = block.getFieldValue("PIN");
  arduinoGenerator.reservePin(block, pin, PinTypes.INPUT, "LM35");
  arduinoGenerator.addVariable("var_" + pin, `float Vout_${pin};`, true);
  arduinoGenerator.addVariable("var1" + pin, `float Temp_${pin};`, true);
  arduinoGenerator.addSetup("lm35", "analogReference(INTERNAL);", true);
  arduinoGenerator.addLoopCode("var1" + pin, `Vout_${pin} = analogRead(${pin});`);
  arduinoGenerator.addLoopCode("var2" + pin, `Temp_${pin} = (Vout_${pin}*500/1023);`);
  return [`Temp_${pin}`, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["SENSOR_dht11"] = function(block) {
  const pin = block.getFieldValue("PIN");
  const choice = block.getFieldValue("choix");
  arduinoGenerator.reservePin(block, pin, PinTypes.INPUT, "DHT11");
  arduinoGenerator.addInclude("dht.h", "#include <DHT.h>");
  arduinoGenerator.addDeclaration("dht", `DHT dht(${pin}, DHT11);`);
  arduinoGenerator.addSetup("dht", "  dht.begin();", true);
  let code;
  if (choice === "h") {
    arduinoGenerator.addVariable("var1" + pin, `float Hum_${pin};`, true);
    arduinoGenerator.addLoopCode("var1" + pin, `Hum_${pin} = dht.readHumidity();`);
    code = `Hum_${pin}`;
  } else {
    arduinoGenerator.addVariable("var2" + pin, `float Tmp_${pin};`, true);
    arduinoGenerator.addLoopCode("var2" + pin, `Tmp_${pin} = dht.readTemperature();`);
    code = `Tmp_${pin}`;
  }
  return [code, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["SENSOR_line_follower"] = function(block) {
  const pin = block.getFieldValue("PIN");
  arduinoGenerator.reservePin(block, pin, PinTypes.INPUT, "Line Follower");
  arduinoGenerator.addSetup("setup_input_" + pin, `  pinMode(${pin}, INPUT);`, true);
  return [`digitalRead(${pin}) == HIGH`, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["SENSOR_light_sensor"] = function(block) {
  const pin = block.getFieldValue("PIN");
  arduinoGenerator.reservePin(block, pin, PinTypes.INPUT, "Light Sensor");
  arduinoGenerator.addVariable("var_" + pin, `int LDRValue_${pin} = 0;`, true);
  arduinoGenerator.addLoopCode("var1" + pin, `LDRValue_${pin} = analogRead(${pin});`);
  return [`LDRValue_${pin}`, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["SENSOR_PIR"] = function(block) {
  const pin = block.getFieldValue("PIN");
  arduinoGenerator.reservePin(block, pin, PinTypes.INPUT, "PIR");
  arduinoGenerator.addVariable("var_" + pin, `bool motionState_${pin} = false;`, true);
  arduinoGenerator.addLoopCode("var1" + pin, `motionState_${pin} = digitalRead(${pin});`);
  return [`motionState_${pin}`, 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["RFID_module"] = function(block) {
  const csPin = block.getFieldValue("CS_PIN") || "10";
  const rstPin = block.getFieldValue("RST_PIN") || "9";
  arduinoGenerator.reservePin(block, csPin, PinTypes.SPI, "RFID CS");
  arduinoGenerator.reservePin(block, rstPin, PinTypes.SPI, "RFID RST");
  arduinoGenerator.addInclude("rfid", "#include <SPI.h>");
  arduinoGenerator.addInclude("rfid_mfrc522", "#include <MFRC522.h>");
  arduinoGenerator.addDeclaration("rfid_module", `MFRC522 mfrc522(${csPin}, ${rstPin});`);
  arduinoGenerator.addSetup("rfid_init", "  SPI.begin();", true);
  arduinoGenerator.addSetup("rfid_init2", "  mfrc522.PCD_Init();", true);
  return "";
};

// src/generators/hardware/motors.ts
arduinoGenerator.forBlock["motor_servo"] = function(block) {
  const command = block.getFieldValue("COMMAND") || "init";
  const varName = block.getField("VAR")?.getText() || "myServo";
  if (!varName.trim()) {
    return "// Error: Servo variable name cannot be empty\n";
  }
  switch (command) {
    case "init": {
      const pin = block.getFieldValue("PIN") || "9";
      arduinoGenerator.reservePin(block, pin, PinTypes.SERVO, "Servo");
      arduinoGenerator.addInclude("include-Servo", "#include <Servo.h>");
      arduinoGenerator.addDeclaration("define_Servo_" + varName, `Servo ${varName};`);
      arduinoGenerator.addSetup("setup_Servo_" + varName, `  ${varName}.attach(${pin});`, true);
      return "";
    }
    case "write": {
      block.setWarningText(null, "Servo");
      const angle = block.getFieldValue("ANGLE") ?? 90;
      return `${varName}.write(${angle});
`;
    }
    case "attach":
      block.setWarningText(null, "Servo");
      return `${varName}.attach();
`;
    case "detach":
      block.setWarningText(null, "Servo");
      return `${varName}.detach();
`;
    default:
      return "";
  }
};
arduinoGenerator.forBlock["DC_Motor"] = function(block) {
  const command = block.getFieldValue("COMMAND") || "init";
  const varName = block.getField("VAR")?.getText() || "MT";
  if (command === "init") {
    const pin0 = block.getFieldValue("PIN0");
    const pin1 = block.getFieldValue("PIN1");
    const pin2 = block.getFieldValue("PIN2");
    const pin3 = block.getFieldValue("PIN3");
    arduinoGenerator.reservePin(block, pin0, PinTypes.OUTPUT, "DC Motor A1");
    arduinoGenerator.reservePin(block, pin1, PinTypes.OUTPUT, "DC Motor A2");
    arduinoGenerator.reservePin(block, pin2, PinTypes.OUTPUT, "DC Motor B1");
    arduinoGenerator.reservePin(block, pin3, PinTypes.OUTPUT, "DC Motor B2");
    arduinoGenerator.addInclude(
      "init-motor",
      `int ${varName}A1  = ${pin0};
int ${varName}A2 = ${pin1};
int ${varName}B1 = ${pin2};
int ${varName}B2 = ${pin3};`
    );
    arduinoGenerator.addSetup(
      "setup_motor",
      `pinMode(${varName}A1, OUTPUT);
  pinMode(${varName}A2, OUTPUT);
  pinMode(${varName}B1, OUTPUT);
  pinMode(${varName}B2, OUTPUT);`,
      true
    );
    arduinoGenerator.addFunction(
      "FuncForward",
      `void ${varName}_Forward(){
  digitalWrite(${varName}A1, LOW);
  digitalWrite(${varName}A2, HIGH);
  digitalWrite(${varName}B1, LOW);
  digitalWrite(${varName}B2, HIGH);
}`
    );
    arduinoGenerator.addFunction(
      "FuncBackward",
      `void ${varName}_Backward(){
  digitalWrite(${varName}A1, HIGH);
  digitalWrite(${varName}A2, LOW);
  digitalWrite(${varName}B1, HIGH);
  digitalWrite(${varName}B2, LOW);
}`
    );
    arduinoGenerator.addFunction(
      "FuncLeft",
      `void ${varName}_Left(){
  digitalWrite(${varName}A1, HIGH);
  digitalWrite(${varName}A2, LOW);
  digitalWrite(${varName}B1, LOW);
  digitalWrite(${varName}B2, HIGH);
}`
    );
    arduinoGenerator.addFunction(
      "FuncRight",
      `void ${varName}_Right(){
  digitalWrite(${varName}A1, LOW);
  digitalWrite(${varName}A2, HIGH);
  digitalWrite(${varName}B1, HIGH);
  digitalWrite(${varName}B2, LOW);
}`
    );
    arduinoGenerator.addFunction(
      "FuncStop",
      `void ${varName}_Stop(){
  digitalWrite(${varName}A1, LOW);
  digitalWrite(${varName}A2, LOW);
  digitalWrite(${varName}B1, LOW);
  digitalWrite(${varName}B2, LOW);
}`
    );
    return "";
  }
  block.setWarningText(null, "DC Motor");
  return `${varName}_${command}();
`;
};

// src/generators/hardware/switch.ts
arduinoGenerator.forBlock["switch_button_read"] = function(block) {
  const pin = block.getFieldValue("PIN");
  arduinoGenerator.addVariable("button" + pin, `bool buttonState_${pin} = false;`, true);
  arduinoGenerator.addLoopCode("button1" + pin, `buttonState_${pin} = digitalRead(${pin});`);
  return [`buttonState_${pin}`, 0 /* ATOMIC */];
};

// src/generators/hardware/telecom.ts
arduinoGenerator.forBlock["bluetooth_init"] = function(block) {
  const pin0 = block.getFieldValue("PIN0");
  const pin1 = block.getFieldValue("PIN1");
  const speed = block.getFieldValue("SPEED");
  arduinoGenerator.reservePin(block, pin0, PinTypes.SERIAL, "Bluetooth TX");
  arduinoGenerator.reservePin(block, pin1, PinTypes.SERIAL, "Bluetooth RX");
  arduinoGenerator.addInclude("bluetooth_Soft", "#include <SoftwareSerial.h>");
  arduinoGenerator.addInclude("bluetooth_init", `SoftwareSerial BT(${pin1}, ${pin0}); // RX, TX`);
  arduinoGenerator.addSetup("setup_bluetooth", `  BT.begin(${speed});`, true);
  return "";
};
arduinoGenerator.forBlock["bluetooth_receive"] = function(_block) {
  return ["BT.available() > 0", 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["bluetooth_receive_byte"] = function(_block) {
  return ["BT.read()", 0 /* ATOMIC */];
};
arduinoGenerator.forBlock["bluetooth_write"] = function(block) {
  const argument0 = arduinoGenerator.valueToCode(block, "BT", 1 /* UNARY_POSTFIX */);
  return `BT.write(${argument0});
`;
};
//# sourceMappingURL=chunk-HRKKS4P4.js.map