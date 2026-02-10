import { CATEGORY_COLORS } from '../theme';
import type { ToolboxCategory, ToolboxItem } from './categories';

const ardBasicSubcategory: ToolboxCategory = {
  kind: 'category',
  name: 'ArdBasic',
  toolboxitemid: 'ARD_BASIC',
  colour: '#4C97FF',
  level: '1',
  levels: '1,2,3',
  cssConfig: { container: 'Category', icon: 'ring2 Basic' },
  contents: [
    { kind: 'block', type: 'base_begin' },
    { kind: 'block', type: 'pinmode' },
    { kind: 'block', type: 'base_setup' },
    { kind: 'block', type: 'base_loop' },
    { kind: 'block', type: 'base_code' },
    { kind: 'block', type: 'base_comment' },
    { kind: 'block', type: 'base_end' },
  ],
};

const ioSubcategory: ToolboxCategory = {
  kind: 'category',
  name: 'IN / OUT',
  toolboxitemid: 'ARD_OUTPUT',
  colour: CATEGORY_COLORS.arduino,
  level: '1',
  levels: '1,2,3',
  cssConfig: { container: 'Category', icon: 'ring2 Arduino' },
  contents: [
    { kind: 'block', type: 'io_highlow' },
    {
      kind: 'block',
      blockxml:
        "<block type='io_digitalwrite'><value name='STATE'><block type='io_highlow'></block ></value ></block >",
    },
    { kind: 'block', type: 'io_analogwrite' },
    { kind: 'block', type: 'io_builtin_led' },
    { kind: 'block', type: 'io_digitalread' },
    { kind: 'block', type: 'io_analogread' },
  ],
};

const timeCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Time',
  toolboxitemid: 'TIME',
  colour: CATEGORY_COLORS.control,
  cssConfig: { container: 'Category', icon: 'customTreeIcon time' },
  contents: [
    { kind: 'block', type: 'math_number' },
    { kind: 'block', type: 'tempo_no_delay' },
    {
      kind: 'block',
      blockxml:
        "<block type='base_delay'><value name='DELAY_TIME'><shadow type='math_number'><field name='NUM'>100</field></shadow></value ></block >",
    },
    {
      kind: 'block',
      blockxml:
        "<block type='base_delay_sec'><value name='DELAY_TIME'><shadow type='math_number'><field name='NUM'>1</field></shadow ></value ></block >",
    },
    { kind: 'block', type: 'micros' },
    { kind: 'block', type: 'millis' },
    { kind: 'block', type: 'millis_sec' },
    { kind: 'block', type: 'io_pulsein' },
    { kind: 'block', type: 'io_pulsein_timeout' },
  ],
};

const arduinoCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Arduino',
  toolboxitemid: 'ARDUINO',
  colour: CATEGORY_COLORS.arduino,
  expanded: 'false',
  cssConfig: { container: 'Category', icon: 'customTreeIcon arduino' },
  contents: [ardBasicSubcategory, ioSubcategory],
};

const displayCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Display',
  toolboxitemid: 'DISPLAY',
  colour: CATEGORY_COLORS.display,
  cssConfig: { container: 'Category', icon: 'customTreeIcon display' },
  contents: [
    { kind: 'block', type: 'led_digitalwrite' },
    { kind: 'block', type: 'lcd_i2c_lcdinit' },
    { kind: 'block', type: 'lcd_i2c_lcdclear' },
    { kind: 'block', type: 'lcd_i2c_lcdwrite' },
  ],
};

const sensorCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Sensor',
  toolboxitemid: 'SENSOR',
  colour: CATEGORY_COLORS.sensors,
  cssConfig: { container: 'Category', icon: 'customTreeIcon sensor' },
  contents: [
    { kind: 'block', type: 'Ultrasonic' },
    {
      kind: 'block',
      blockxml:
        "<block type='Ultrasonic_read'><value name='VAR'><block type='variables_get'></block ></value ></block >",
    },
    { kind: 'block', type: 'SENSOR_lm35' },
    { kind: 'block', type: 'SENSOR_dht11' },
    { kind: 'block', type: 'SENSOR_line_follower' },
    { kind: 'block', type: 'SENSOR_light_sensor' },
    { kind: 'block', type: 'SENSOR_PIR' },
    { kind: 'block', type: 'RFID_module' },
  ],
};

const servoSubcategory: ToolboxCategory = {
  kind: 'category',
  name: 'Servo',
  toolboxitemid: 'SERVO',
  colour: CATEGORY_COLORS.motors,
  cssConfig: { container: 'Category', icon: 'customTreeIcon motors' },
  contents: [
    { kind: 'block', type: 'motor_servo_init' },
    { kind: 'block', type: 'motor_servo_write' },
    { kind: 'block', type: 'motor_servo_attach' },
    { kind: 'block', type: 'motor_servo_detach' },
  ],
};

const l293Subcategory: ToolboxCategory = {
  kind: 'category',
  name: 'L293',
  toolboxitemid: 'L293',
  colour: CATEGORY_COLORS.motors,
  cssConfig: { container: 'Category', icon: 'customTreeIcon motors' },
  contents: [
    { kind: 'block', type: 'l293_init' },
    { kind: 'block', type: 'l293_movement' },
    { kind: 'block', type: 'l293_set_speed' },
  ],
};

const l293ShieldSubcategory: ToolboxCategory = {
  kind: 'category',
  name: 'L293 Shield',
  toolboxitemid: 'L293_SHIELD',
  colour: CATEGORY_COLORS.motors,
  cssConfig: { container: 'Category', icon: 'customTreeIcon motors' },
  contents: [
    { kind: 'block', type: 'L293_Motor_Shield_InitAll' },
    { kind: 'block', type: 'L293_Motor_Shield_Init' },
    { kind: 'block', type: 'L293_Motor_Shield_Movement' },
    { kind: 'block', type: 'L293_Motor_Shield_SetSpeed' },
  ],
};

const l298Subcategory: ToolboxCategory = {
  kind: 'category',
  name: 'L298',
  toolboxitemid: 'L298',
  colour: CATEGORY_COLORS.motors,
  cssConfig: { container: 'Category', icon: 'customTreeIcon motors' },
  contents: [
    { kind: 'block', type: 'l298_init' },
    { kind: 'block', type: 'l298_movement' },
    { kind: 'block', type: 'l298_set_speed' },
  ],
};

const motorsCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Motors',
  toolboxitemid: 'MOTORS',
  colour: CATEGORY_COLORS.motors,
  cssConfig: { container: 'Category', icon: 'customTreeIcon motors' },
  contents: [servoSubcategory, l293Subcategory, l293ShieldSubcategory, l298Subcategory],
};

const switchCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Switch',
  toolboxitemid: 'SWITCH',
  colour: CATEGORY_COLORS.switch,
  cssConfig: { container: 'Category', icon: 'customTreeIcon switch' },
  contents: [
    { kind: 'block', type: 'switch_button_read' },
    { kind: 'block', type: 'io_highlow' },
  ],
};

const telecomCategory: ToolboxCategory = {
  kind: 'category',
  name: 'Telecom',
  toolboxitemid: 'TELECOM',
  colour: CATEGORY_COLORS.telecom,
  cssConfig: { container: 'Category', icon: 'customTreeIcon telecom' },
  contents: [
    { kind: 'block', type: 'serial_init' },
    { kind: 'block', type: 'serial_receive' },
    { kind: 'block', type: 'serial_receive_byte' },
    { kind: 'block', type: 'serial_write' },
    { kind: 'block', type: 'bluetooth_init' },
    { kind: 'block', type: 'bluetooth_receive' },
    { kind: 'block', type: 'bluetooth_receive_byte' },
    { kind: 'block', type: 'bluetooth_write' },
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
];
