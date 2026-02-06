import * as Blockly from 'blockly/core';
import { CATEGORY_COLORS } from '../../theme';
import { Arduino } from '../../arduino/boards';
import { Types } from '../../arduino/types';

Blockly.Blocks['switch_button_read'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('/img/ico/button_ico.png', 35, 35, '*'))
      .appendField('BT State')
      .appendField(new Blockly.FieldDropdown(Arduino.AllPins), 'PIN');
    this.setOutput(true, Types.NUMBER.typeId);
    this.setColour(CATEGORY_COLORS.switch);
    this.setTooltip(Blockly.Msg.ARDUINO_VAR_CONST_tooltip);
    this.setHelpUrl(Blockly.Msg.HELPURL);
  },
  updateFields: function (this: Blockly.Block, workspace?: any) {
    Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'AllPins', workspace);
  },
};
