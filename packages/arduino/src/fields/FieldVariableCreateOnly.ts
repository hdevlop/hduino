import * as Blockly from 'blockly/core';

const RENAME_VARIABLE_ID = 'RENAME_VARIABLE_ID';
const DELETE_VARIABLE_ID = 'DELETE_VARIABLE_ID';

/**
 * A FieldVariable that only shows existing variables + "Create variable..."
 * Removes "Rename variable..." and "Delete variable..." from the dropdown.
 * Kid-friendly: no accidental renames or deletions.
 */
export class FieldVariableCreateOnly extends Blockly.FieldVariable {
  constructor(
    varName: string | null,
    validator?: Blockly.FieldVariableValidator,
    variableTypes?: string[],
    defaultType?: string,
  ) {
    super(varName, validator, variableTypes, defaultType);
    // Parent constructor sets menuGenerator_ to FieldVariable.dropdownCreate.
    // Override it to point to our filtered version.
    this.menuGenerator_ = FieldVariableCreateOnly.dropdownCreate;
  }

  static override dropdownCreate(this: Blockly.FieldVariable): Blockly.MenuOption[] {
    const options = Blockly.FieldVariable.dropdownCreate.call(this);
    return options.filter((opt) => {
      if (Array.isArray(opt)) {
        return opt[1] !== RENAME_VARIABLE_ID && opt[1] !== DELETE_VARIABLE_ID;
      }
      return true;
    });
  }

  // Safety net: ignore rename/delete if somehow triggered
  override onItemSelected_(menu: Blockly.Menu, menuItem: Blockly.MenuItem): void {
    const value = menuItem.getValue();
    if (value === RENAME_VARIABLE_ID || value === DELETE_VARIABLE_ID) return;
    super.onItemSelected_(menu, menuItem);
  }
}
