# Adding New Blocks & Categories to Hduino

This guide explains how to add new blocks or categories to the Hduino block-based Arduino IDE.

## Architecture Overview

The block system has 4 key layers:

```
┌─────────────────────────────────────────────────────────────┐
│  1. Block Definition    → What the block looks like        │
│     (blocks/hardware/*.ts)                                  │
├─────────────────────────────────────────────────────────────┤
│  2. Code Generator      → What Arduino code it produces    │
│     (generators/hardware/*.ts)                              │
├─────────────────────────────────────────────────────────────┤
│  3. Toolbox Registration → Where the block appears in UI   │
│     (toolbox/hardware.ts)                                   │
├─────────────────────────────────────────────────────────────┤
│  4. Sidebar Category    → Icon and color in sidebar        │
│     (constants/categories.ts)                               │
└─────────────────────────────────────────────────────────────┘
```

## File Locations

| Purpose | Path |
|---------|------|
| Block definitions | `apps/web/src/lib/blockly/blocks/hardware/` |
| Code generators | `apps/web/src/lib/blockly/generators/hardware/` |
| Toolbox config | `apps/web/src/lib/blockly/toolbox/hardware.ts` |
| Theme colors | `apps/web/src/lib/blockly/theme.ts` |
| Sidebar categories | `apps/web/src/constants/categories.ts` |
| Category icons | `apps/web/src/components/editor/Sidebar/CategoryIcons.tsx` |

---

## Part 1: Adding a New Block to an Existing Category

### Example: Adding a Soil Moisture Sensor to the Sensor Category

#### Step 1: Create Block Definition

Edit `apps/web/src/lib/blockly/blocks/hardware/sensor.ts`:

```typescript
import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Arduino } from '../../arduino/boards';
import { Types } from '../../arduino/types';

Blockly.Blocks['SENSOR_soil_moisture'] = {
  init: function (this: Blockly.Block) {
    // Block color (use existing category color)
    this.setColour(CATEGORY_COLORS.sensors);

    // Optional: Add an icon image (40x40 recommended)
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/soil_moisture_ico.png', 40, 40, '*'))
      .appendField('Soil Moisture at ')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPinsAnalog), 'PIN');

    // This block returns a Number value
    this.setOutput(true, 'Number');

    // Tooltip shown on hover
    this.setTooltip('Returns soil moisture value (0-1023). Higher = more moisture.');
  },

  // Required for dynamic pin dropdowns when board changes
  updateFields: function (this: Blockly.Block) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPinsAnalog');
  },

  // Optional: Specify return type for type checking
  getBlockType: function () {
    return Types.NUMBER;
  },
};
```

#### Step 2: Create Code Generator

Edit `apps/web/src/lib/blockly/generators/hardware/sensor.ts`:

```typescript
import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';

Arduino.forBlock['SENSOR_soil_moisture'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');

  // Add global variable (only added once, even if block used multiple times)
  Arduino.addVariable('var_soil_' + pin, `int soilMoisture_${pin} = 0;`, true);

  // Add code to loop() function
  Arduino.addLoopCode('soil_' + pin, `soilMoisture_${pin} = analogRead(${pin});`);

  // Return [code, precedence]
  // Order.ATOMIC means this is a simple value, no parentheses needed
  return [`soilMoisture_${pin}`, Order.ATOMIC];
};
```

#### Step 3: Add to Toolbox

Edit `apps/web/src/lib/blockly/toolbox/hardware.ts`:

```typescript
const sensorCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Sensor',
  toolboxitemid: 'SENSOR',
  colour: CATEGORY_COLORS.sensors,
  cssConfig: { container: 'Category', icon: 'customTreeIcon sensor' },
  contents: [
    // ... existing blocks ...
    { kind: 'block', type: 'SENSOR_soil_moisture' },  // Add your new block
  ],
};
```

That's it! The block is now available in the Sensor category.

---

## Part 2: Adding a New Category

### Example: Adding a "Display" Category for OLED, TFT, etc.

#### Step 1: Add Color to Theme

Edit `apps/web/src/lib/blockly/theme.ts`:

```typescript
export const CATEGORY_COLORS = {
  // ... existing colors ...
  display: '#FF8C00',  // Orange for display category
} as const;
```

#### Step 2: Create Block Definition File

Create `apps/web/src/lib/blockly/blocks/hardware/display.ts`:

```typescript
import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Arduino } from '../../arduino/boards';

// OLED Initialize Block
Blockly.Blocks['DISPLAY_oled_init'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.display);
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/oled_ico.png', 60, 40, '*'))
      .appendField('Initialize OLED 128x64');
    this.setPreviousStatement(true, null);  // Can connect above
    this.setNextStatement(true, null);      // Can connect below
    this.setTooltip('Initialize I2C OLED display (128x64)');
  },
};

// OLED Print Text Block
Blockly.Blocks['DISPLAY_oled_print'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.display);
    this.appendValueInput('TEXT')
      .setCheck(['String', 'Number'])
      .appendField('OLED print');
    this.appendValueInput('X')
      .setCheck('Number')
      .appendField('at X:');
    this.appendValueInput('Y')
      .setCheck('Number')
      .appendField('Y:');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Print text on OLED at specified position');
  },
};

// OLED Clear Block
Blockly.Blocks['DISPLAY_oled_clear'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.display);
    this.appendDummyInput()
      .appendField('OLED clear');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Clear the OLED display');
  },
};
```

#### Step 3: Create Generator File

Create `apps/web/src/lib/blockly/generators/hardware/display.ts`:

```typescript
import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';

Arduino.forBlock['DISPLAY_oled_init'] = function (_block: Blockly.Block): string {
  // Add required libraries
  Arduino.addInclude('wire', '#include <Wire.h>');
  Arduino.addInclude('adafruit_gfx', '#include <Adafruit_GFX.h>');
  Arduino.addInclude('adafruit_ssd1306', '#include <Adafruit_SSD1306.h>');

  // Add display declaration
  Arduino.addDeclaration('oled', 'Adafruit_SSD1306 display(128, 64, &Wire, -1);');

  // Add setup code
  Arduino.addSetup('oled_init', `
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.display();`, true);

  return '';
};

Arduino.forBlock['DISPLAY_oled_print'] = function (block: Blockly.Block): string {
  const text = Arduino.valueToCode(block, 'TEXT', Order.NONE) || '""';
  const x = Arduino.valueToCode(block, 'X', Order.NONE) || '0';
  const y = Arduino.valueToCode(block, 'Y', Order.NONE) || '0';

  return `display.setCursor(${x}, ${y});\ndisplay.print(${text});\ndisplay.display();\n`;
};

Arduino.forBlock['DISPLAY_oled_clear'] = function (_block: Blockly.Block): string {
  return 'display.clearDisplay();\ndisplay.display();\n';
};
```

#### Step 4: Register in Index Files

Edit `apps/web/src/lib/blockly/blocks/hardware/index.ts`:

```typescript
import './arduino';
import './time';
import './serial';
import './display';
import './sensor';
import './motors';
import './switch';
import './telecom';
import './display';  // Add this line
```

Edit `apps/web/src/lib/blockly/generators/hardware/index.ts`:

```typescript
import './arduino';
import './time';
import './serial';
import './display';
import './sensor';
import './motors';
import './switch';
import './telecom';
import './display';  // Add this line
```

#### Step 5: Add to Toolbox

Edit `apps/web/src/lib/blockly/toolbox/hardware.ts`:

```typescript
const displayCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Display',
  toolboxitemid: 'DISPLAY',
  colour: CATEGORY_COLORS.display,
  cssConfig: { container: 'Category', icon: 'customTreeIcon display' },
  contents: [
    { kind: 'block', type: 'DISPLAY_oled_init' },
    { kind: 'block', type: 'DISPLAY_oled_print' },
    { kind: 'block', type: 'DISPLAY_oled_clear' },
  ],
};

export const hardwareCategories: ToolboxItem[] = [
  arduinoCategory,
  timeCategory,
  displayCategory,
  sensorCategory,
  motorsCategory,
  switchCategory,
  telecomCategory,
  displayCategory,  // Add this line
];
```

#### Step 6: Add Sidebar Icon

Edit `apps/web/src/components/editor/Sidebar/CategoryIcons.tsx`:

```tsx
export const DisplayIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2"/>
    <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2"/>
    <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2"/>
  </svg>
);
```

#### Step 7: Add to Sidebar Categories

Edit `apps/web/src/constants/categories.ts`:

```typescript
import { DisplayIcon } from '@/components/editor/Sidebar/CategoryIcons';

export const BLOCK_CATEGORIES: BlockCategory[] = [
  // ... existing categories ...
  {
    id: 'display',
    name: 'Display',
    icon: DisplayIcon,
    color: '#FF8C00',
    hoverColor: '#E87800',
    group: 'hardware',
  },
];
```

---

## Block Types Reference

### Statement Block (does something, chains with others)

```typescript
Blockly.Blocks['my_statement_block'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.sensors);
    this.appendDummyInput().appendField('Do something');
    this.setPreviousStatement(true, null);  // Can connect above
    this.setNextStatement(true, null);      // Can connect below
  },
};

// Generator returns string
Arduino.forBlock['my_statement_block'] = function (block): string {
  return 'doSomething();\n';
};
```

### Value Block (returns a value)

```typescript
Blockly.Blocks['my_value_block'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.sensors);
    this.appendDummyInput().appendField('Get value');
    this.setOutput(true, 'Number');  // Returns a Number
  },
};

// Generator returns [code, precedence]
Arduino.forBlock['my_value_block'] = function (block): [string, number] {
  return ['getValue()', Order.ATOMIC];
};
```

### Block with Input Connection

```typescript
Blockly.Blocks['my_block_with_input'] = {
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLORS.sensors);
    this.appendValueInput('VALUE')
      .setCheck('Number')  // Only accept Number blocks
      .appendField('Process');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

// Get connected value in generator
Arduino.forBlock['my_block_with_input'] = function (block): string {
  const value = Arduino.valueToCode(block, 'VALUE', Order.NONE) || '0';
  return `process(${value});\n`;
};
```

---

## Generator Helper Methods

| Method | Purpose |
|--------|---------|
| `Arduino.addInclude(tag, code)` | Add `#include` statement |
| `Arduino.addDeclaration(tag, code)` | Add global declaration |
| `Arduino.addVariable(tag, code, overwrite)` | Add global variable |
| `Arduino.addSetup(tag, code, overwrite)` | Add code to `setup()` |
| `Arduino.addLoopCode(tag, code)` | Add code to `loop()` |
| `Arduino.addFunction(name, code)` | Add custom function |
| `Arduino.valueToCode(block, name, order)` | Get code from connected value block |
| `Arduino.statementToCode(block, name)` | Get code from connected statement block |

---

## Pin Dropdown Options

| Dropdown | Description |
|----------|-------------|
| `Arduino.AllPins` | All digital + analog pins |
| `Arduino.AllPinsAnalog` | Analog pins only (A0, A1...) |
| `Arduino.Boards.selected.digitalPins` | Digital pins only |
| `Arduino.Boards.selected.pwmPins` | PWM-capable pins |
| `Arduino.onlyVar` | Variable names (auto-populated from workspace) |

### Example: Block using `Arduino.onlyVar`

```typescript
Blockly.Blocks['my_variable_block'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Use variable')
      .appendField(new Blockly.FieldDropdown(Arduino.onlyVar), 'VAR_FIELD');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('A block that uses variables from the workspace');
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'VAR_FIELD', 'onlyVar', workspace);
  },
};
```

**Note:** The `updateFields` method must accept an optional `workspace` parameter and pass it to `refreshBlockFieldDropdown` for variable dropdowns to work properly.

---

## Tips

1. **Block naming**: Use `CATEGORY_blockname` format (e.g., `SENSOR_dht11`)
2. **Icons**: Place icons in `public/img/ico/` (40x40 PNG recommended)
3. **Colors**: Reuse `CATEGORY_COLORS` for consistency
4. **updateFields**: Always implement if using pin dropdowns
5. **Test**: Run `bun dev` and check your block appears in the toolbox
