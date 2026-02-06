import { CATEGORY_COLORS } from '../theme';
import type { ToolboxCategory, ToolboxSeparator, ToolboxItem } from './categories';

const operatorsCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Operators',
  toolboxitemid: 'Operators',
  colour: CATEGORY_COLORS.operators,
  level: '1',
  levels: '1,2,3',
  cssConfig: { container: 'Category', icon: 'customTreeIcon operators' },
  contents: [
    { kind: 'block', type: 'logic_compare' },
    { kind: 'block', type: 'logic_operation' },
    { kind: 'block', type: 'logic_negate' },
    { kind: 'block', type: 'logic_boolean' },
    { kind: 'block', type: 'logic_null' },
  ],
};

const controlCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Control',
  toolboxitemid: 'Control',
  colour: CATEGORY_COLORS.control,
  level: '1',
  levels: '1,2,3',
  cssConfig: { container: 'Category', icon: 'customTreeIcon control' },
  contents: [
    { kind: 'block', type: 'controls_if' },
    { kind: 'block', type: 'controls_repeat' },
    { kind: 'block', type: 'controls_whileUntil' },
    {
      kind: 'block',
      blockxml:
        "<block type='controls_for'><value name='FROM'><shadow type='math_number'><field name='NUM'>1</field></shadow></value><value name='TO'><shadow type='math_number'><field name='NUM'>10</field></shadow></value><value name='BY'><shadow type='math_number'><field name='NUM'>1</field></shadow></value></block>",
    },
    { kind: 'block', type: 'controls_repeat_ext' },
    { kind: 'block', type: 'controls_flow_statements' },
  ],
};

const mathCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Math',
  toolboxitemid: 'MATH',
  colour: CATEGORY_COLORS.math,
  level: '1',
  levels: '1,2,3',
  cssConfig: { container: 'Category', icon: 'customTreeIcon maths' },
  contents: [
    { kind: 'block', blockxml: "<block type='math_number'><field name='NUM'>123</field></block>" },
    {
      kind: 'block',
      blockxml:
        "<block type='math_arithmetic'><value name='A'><shadow type='math_number'><field name='NUM'>1</field></shadow></value><value name='B'><shadow type='math_number'><field name='NUM'>1</field></shadow></value></block>",
    },
    {
      kind: 'block',
      blockxml:
        "<block type='math_single'><value name='NUM'><shadow type='math_number'><field name='NUM'>9</field></shadow></value></block>",
    },
    {
      kind: 'block',
      blockxml:
        "<block type='math_trig'><value name='NUM'><shadow type='math_number'><field name='NUM'>45</field></shadow></value></block>",
    },
    { kind: 'block', type: 'math_constant' },
    {
      kind: 'block',
      blockxml:
        "<block type='math_number_property'><value name='NUMBER_TO_CHECK'><shadow type='math_number'><field name='NUM'>0</field></shadow></value></block>",
    },
    {
      kind: 'block',
      blockxml:
        "<block type='math_round'><value name='NUM'><shadow type='math_number'><field name='NUM'>3.14</field></shadow></value></block>",
    },
    { kind: 'block', type: 'math_on_list' },
    {
      kind: 'block',
      blockxml:
        "<block type='math_modulo'><value name='DIVIDEND'><shadow type='math_number'><field name='NUM'>64</field></shadow></value><value name='DIVISOR'><shadow type='math_number'><field name='NUM'>10</field></shadow></value></block>",
    },
    {
      kind: 'block',
      blockxml:
        "<block type='math_constrain'><value name='VALUE'> <shadow type='math_number'> <field name='NUM'>50</field> </shadow> </value> <value name='LOW'> <shadow type='math_number'> <field name='NUM'>1</field> </shadow> </value> <value name='HIGH'> <shadow type='math_number'> <field name='NUM'>100</field> </shadow> </value></block>",
    },
    {
      kind: 'block',
      blockxml:
        "<block type='math_random_int'><value name='FROM'> <shadow type='math_number'> <field name='NUM'>1</field> </shadow> </value> <value name='TO'> <shadow type='math_number'> <field name='NUM'>100</field> </shadow> </value></block>",
    },
    {
      kind: 'block',
      blockxml:
        "<block type='math_atan2'><value name='X'> <shadow type='math_number'> <field name='NUM'>1</field> </shadow> </value> <value name='Y'> <shadow type='math_number'> <field name='NUM'>1</field> </shadow> </value></block>",
    },
  ],
};

const textCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Text',
  toolboxitemid: 'TEXT',
  colour: CATEGORY_COLORS.text,
  level: '1',
  levels: '1,2,3',
  cssConfig: { container: 'Category', icon: 'customTreeIcon text' },
  contents: [
    { kind: 'block', type: 'text' },
    { kind: 'block', type: 'text_join' },
    {
      kind: 'block',
      blockxml: "<block type='text_append'><value name='TEXT'><shadow type='text'></shadow></value></block>",
    },
    {
      kind: 'block',
      blockxml:
        "<block type='text_length'><value name='VALUE'><shadow type='text'><field name='TEXT'>abc</field></shadow></value></block>",
    },
    {
      kind: 'block',
      blockxml:
        "<block type='text_isEmpty'><value name='VALUE'><shadow type='text'><field name='TEXT'></field></shadow></value></block>",
    },
  ],
};

const arrayCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Array',
  toolboxitemid: 'ARRAY',
  colour: CATEGORY_COLORS.array,
  level: '1',
  levels: '1,2,3',
  cssConfig: { container: 'Category', icon: 'customTreeIcon array' },
  contents: [
    { kind: 'block', type: 'lists_create_with' },
    {
      kind: 'block',
      blockxml:
        "<block type='lists_getIndex'><value name='AT'><block type='math_number'><field name='NUM'>1</field></block></value></block>",
    },
  ],
};

const variablesCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Variables',
  toolboxitemid: 'VARIABLES',
  colour: CATEGORY_COLORS.variables,
  level: '1',
  levels: '1,2,3',
  cssConfig: { container: 'Category', icon: 'customTreeIcon variable' },
  custom: 'Variables',
};

const functionsCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Functions',
  toolboxitemid: 'FUNCTIONS',
  colour: CATEGORY_COLORS.functions,
  level: '1',
  levels: '1,2,3',
  cssConfig: { container: 'Category', icon: 'customTreeIcon function' },
  custom: 'PROCEDURE',
};

const separator: ToolboxSeparator = { kind: 'sep' };

export const standardCategories: ToolboxItem[] = [
  operatorsCategory,
  controlCategory,
  mathCategory,
  textCategory,
  arrayCategory,
  variablesCategory,
  functionsCategory,
  separator,
];
