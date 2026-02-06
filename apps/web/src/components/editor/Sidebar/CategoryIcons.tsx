import Image from 'next/image';

// Import category images
import controlImg from '@/assets/img/control.png';
import mathImg from '@/assets/img/math.png';
import textImg from '@/assets/img/text.png';
import arrayImg from '@/assets/img/array.png';
import variableImg from '@/assets/img/variable.png';
import functionImg from '@/assets/img/function.png';
import chipImg from '@/assets/img/chip.png';
import timeImg from '@/assets/img/time.png';
import lightImg from '@/assets/img/light.png';
import sensorImg from '@/assets/img/sensor.png';
import motorsImg from '@/assets/img/motors.png';
import switchImg from '@/assets/img/switch.png';
import telecomImg from '@/assets/img/telecom.png';
import boolImg from '@/assets/img/bool.png';
import arduinoImg from '@/assets/img/arduino-icon.png';

// Helper component to create image-based icons
const createImageIcon = (src: typeof controlImg, alt: string) => {
  const IconComponent: React.FC<{ className?: string }> = ({ className }) => (
    <Image
      src={src}
      alt={alt}
      width={20}
      height={20}
      className={className}
      style={{ objectFit: 'contain' }}
      unoptimized={false}
    />
  );
  IconComponent.displayName = `${alt}Icon`;
  return IconComponent;
};

// Category icons using PNG images
export const OperatorsIcon = createImageIcon(boolImg, 'Operators');
export const ControlIcon = createImageIcon(controlImg, 'Control');
export const MathIcon = createImageIcon(mathImg, 'Math');
export const TextIcon = createImageIcon(textImg, 'Text');
export const ArrayIcon = createImageIcon(arrayImg, 'Array');
export const VariablesIcon = createImageIcon(variableImg, 'Variables');
export const FunctionsIcon = createImageIcon(functionImg, 'Functions');
export const ArduinoIcon = createImageIcon(arduinoImg, 'Arduino');
export const TimeIcon = createImageIcon(timeImg, 'Time');
export const LightIcon = createImageIcon(lightImg, 'Light');
export const SensorIcon = createImageIcon(sensorImg, 'Sensor');
export const MotorsIcon = createImageIcon(motorsImg, 'Motors');
export const SwitchIcon = createImageIcon(switchImg, 'Switch');
export const TelecomIcon = createImageIcon(telecomImg, 'Telecom');