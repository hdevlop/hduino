import { BlockCategory } from '@/types/editor';
import {
  OperatorsIcon,
  ControlIcon,
  MathIcon,
  TextIcon,
  ArrayIcon,
  VariablesIcon,
  FunctionsIcon,
  ArduinoIcon,
  TimeIcon,
  LightIcon,
  SensorIcon,
  MotorsIcon,
  SwitchIcon,
  TelecomIcon,
} from '@/components/editor/Sidebar/CategoryIcons';

export const BLOCK_CATEGORIES: BlockCategory[] = [
  // Logic Group (separated from hardware by divider)
  {
    id: 'operators',
    name: 'Operators',
    icon: OperatorsIcon,
    color: '#59C059',      // Green
    hoverColor: '#4BA84B',
    group: 'logic',
  },
  {
    id: 'control',
    name: 'Control',
    icon: ControlIcon,
    color: '#FFAB19',      // Orange
    hoverColor: '#E89B0B',
    group: 'logic',
  },
  {
    id: 'math',
    name: 'Math',
    icon: MathIcon,
    color: '#6990ca',      // Blue
    hoverColor: '#5576B6',
    group: 'logic',
  },
  {
    id: 'text',
    name: 'Text',
    icon: TextIcon,
    color: '#774DCB',      // Purple
    hoverColor: '#6639B7',
    group: 'logic',
  },
  {
    id: 'array',
    name: 'Array',
    icon: ArrayIcon,
    color: '#FF6680',      // Pink
    hoverColor: '#E84C60',
    group: 'logic',
  },
  {
    id: 'variables',
    name: 'Variables',
    icon: VariablesIcon,
    color: '#ff764c',      // Red-Orange
    hoverColor: '#E85C32',
    group: 'logic',
  },
  {
    id: 'functions',
    name: 'Functions',
    icon: FunctionsIcon,
    color: '#995ba5',      // Purple
    hoverColor: '#854791',
    group: 'logic',
  },

  // Hardware Group (below divider line)
  {
    id: 'arduino',
    name: 'Arduino',
    icon: ArduinoIcon,
    color: '#00979D',      // Teal
    hoverColor: '#007A83',
    group: 'hardware',
  },
  {
    id: 'time',
    name: 'Time',
    icon: TimeIcon,
    color: '#FFAB19',      // Orange
    hoverColor: '#E89B0B',
    group: 'hardware',
  },
  {
    id: 'display',
    name: 'Display',
    icon: LightIcon,
    color: '#59C059',      // Gold
    hoverColor: '#4BA84B',
    group: 'hardware',
  },
  {
    id: 'sensor',
    name: 'Sensor',
    icon: SensorIcon,
    color: '#47A8D1',      // Light Blue
    hoverColor: '#3596BD',
    group: 'hardware',
  },
  {
    id: 'motors',
    name: 'Motors',
    icon: MotorsIcon,
    color: '#DC143C',      // Crimson
    hoverColor: '#C80828',
    group: 'hardware',
  },
  {
    id: 'switch',
    name: 'Switch',
    icon: SwitchIcon,
    color: '#9966FF',      // Violet
    hoverColor: '#8552EB',
    group: 'hardware',
  },
  {
    id: 'telecom',
    name: 'Telecom',
    icon: TelecomIcon,
    color: '#00CED1',      // Dark Turquoise
    hoverColor: '#00B8BD',
    group: 'hardware',
  },
];

export const LOGIC_CATEGORIES = BLOCK_CATEGORIES.filter(c => c.group === 'logic');
export const HARDWARE_CATEGORIES = BLOCK_CATEGORIES.filter(c => c.group === 'hardware');