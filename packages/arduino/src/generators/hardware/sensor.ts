import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order, PinTypes } from '../../arduino/generator';

Arduino.forBlock['Ultrasonic'] = function (block: Blockly.Block): string {
  const trigPin = block.getFieldValue('PIN0') || '2';
  const echoPin = block.getFieldValue('PIN1') || '3';
  const name = block.getField('VAR')?.getText() || 'myUltrasonic';

  Arduino.reservePin(block, trigPin, PinTypes.OUTPUT, 'Ultrasonic Trig');
  Arduino.reservePin(block, echoPin, PinTypes.INPUT, 'Ultrasonic Echo');
  Arduino.addInclude('includes_' + name, '#include <HCSR04.h>');
  Arduino.addDeclaration('var_' + name, `HCSR04 ${name}(${trigPin},${echoPin});`);
  Arduino.addVariable(name + '1', `const int ${name}_Trig = ${trigPin};`, true);
  Arduino.addVariable(name + '2', `const int ${name}_Echo = ${echoPin};`, true);
  Arduino.addSetup('setup_input_' + trigPin, `  pinMode(${name}_Trig, OUTPUT);`, true);
  Arduino.addSetup('setup_input_' + echoPin, `  pinMode(${name}_Echo, INPUT);`, true);
  return '';
};

Arduino.forBlock['Ultrasonic_read'] = function (block: Blockly.Block): [string, number] {
  const name = block.getField('VAR')?.getText() || 'myUltrasonic';
  Arduino.addVariable('var1' + name, `int Distance_${name};`, true);
  Arduino.addLoopCode('var2' + name, `Distance_${name} = ${name}.dist();`);
  return [`Distance_${name}`, Order.ATOMIC];
};

Arduino.forBlock['SENSOR_lm35'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');
  Arduino.reservePin(block, pin, PinTypes.INPUT, 'LM35');
  Arduino.addVariable('var_' + pin, `float Vout_${pin};`, true);
  Arduino.addVariable('var1' + pin, `float Temp_${pin};`, true);
  Arduino.addSetup('lm35', 'analogReference(INTERNAL);', true);
  Arduino.addLoopCode('var1' + pin, `Vout_${pin} = analogRead(${pin});`);
  Arduino.addLoopCode('var2' + pin, `Temp_${pin} = (Vout_${pin}*500/1023);`);
  return [`Temp_${pin}`, Order.ATOMIC];
};

Arduino.forBlock['SENSOR_dht11'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');
  const choice = block.getFieldValue('choix');
  Arduino.reservePin(block, pin, PinTypes.INPUT, 'DHT11');
  Arduino.addInclude('dht.h', '#include <DHT.h>');
  Arduino.addDeclaration('dht', `DHT dht(${pin}, DHT11);`);
  Arduino.addSetup('dht', '  dht.begin();', true);

  let code: string;
  if (choice === 'h') {
    Arduino.addVariable('var1' + pin, `float Hum_${pin};`, true);
    Arduino.addLoopCode('var1' + pin, `Hum_${pin} = dht.readHumidity();`);
    code = `Hum_${pin}`;
  } else {
    Arduino.addVariable('var2' + pin, `float Tmp_${pin};`, true);
    Arduino.addLoopCode('var2' + pin, `Tmp_${pin} = dht.readTemperature();`);
    code = `Tmp_${pin}`;
  }
  return [code, Order.ATOMIC];
};

Arduino.forBlock['SENSOR_line_follower'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');
  Arduino.reservePin(block, pin, PinTypes.INPUT, 'Line Follower');
  Arduino.addSetup('setup_input_' + pin, `  pinMode(${pin}, INPUT);`, true);
  return [`digitalRead(${pin}) == HIGH`, Order.ATOMIC];
};

Arduino.forBlock['SENSOR_light_sensor'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');
  Arduino.reservePin(block, pin, PinTypes.INPUT, 'Light Sensor');
  Arduino.addVariable('var_' + pin, `int LDRValue_${pin} = 0;`, true);
  Arduino.addLoopCode('var1' + pin, `LDRValue_${pin} = analogRead(${pin});`);
  return [`LDRValue_${pin}`, Order.ATOMIC];
};

Arduino.forBlock['SENSOR_PIR'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');
  Arduino.reservePin(block, pin, PinTypes.INPUT, 'PIR');
  Arduino.addVariable('var_' + pin, `bool motionState_${pin} = false;`, true);
  Arduino.addLoopCode('var1' + pin, `motionState_${pin} = digitalRead(${pin});`);
  return [`motionState_${pin}`, Order.ATOMIC];
};

Arduino.forBlock['RFID_module'] = function (block: Blockly.Block): string {
  const csPin = block.getFieldValue('CS_PIN') || '10';
  const rstPin = block.getFieldValue('RST_PIN') || '9';

  Arduino.reservePin(block, csPin, PinTypes.SPI, 'RFID CS');
  Arduino.reservePin(block, rstPin, PinTypes.SPI, 'RFID RST');
  Arduino.addInclude('rfid', '#include <SPI.h>');
  Arduino.addInclude('rfid_mfrc522', '#include <MFRC522.h>');
  Arduino.addDeclaration('rfid_module', `MFRC522 mfrc522(${csPin}, ${rstPin});`);
  Arduino.addSetup('rfid_init', '  SPI.begin();', true);
  Arduino.addSetup('rfid_init2', '  mfrc522.PCD_Init();', true);

  return '';
};
