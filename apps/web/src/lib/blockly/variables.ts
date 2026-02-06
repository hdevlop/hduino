import * as Blockly from 'blockly';

/**
 * Custom Variables flyout callback
 * Includes: create button, set, const, type cast, init, change, and getters
 * All setter blocks always show; getter blocks are added per variable
 */
export function variablesFlyoutCallback(
  workspace: Blockly.WorkspaceSvg
): Blockly.utils.toolbox.FlyoutItemInfoArray {
  const xmlList: Blockly.utils.toolbox.FlyoutItemInfoArray = [];

  // Add "Create variable" button
  xmlList.push({
    kind: 'button',
    text: Blockly.Msg['NEW_VARIABLE'] || 'Create variable...',
    callbackkey: 'CREATE_VARIABLE',
  } as Blockly.utils.toolbox.ButtonInfo);

  const variableModelList = workspace.getVariablesOfType('');
  const firstVarId = variableModelList.length > 0 ? variableModelList[0].getId() : undefined;

  // Add variables_set block (always visible)
  xmlList.push({
    kind: 'block',
    type: 'variables_set',
    ...(firstVarId && { fields: { VAR: { id: firstVarId } } }),
  });

  // Add variables_const block (always visible)
  xmlList.push({
    kind: 'block',
    type: 'variables_const',
    ...(firstVarId && { fields: { VAR: { id: firstVarId } } }),
  });

  // Add variables_set_type block (always visible)
  xmlList.push({
    kind: 'block',
    type: 'variables_set_type',
  });

  // Add variables_set_init block (always visible)
  xmlList.push({
    kind: 'block',
    type: 'variables_set_init',
    ...(firstVarId && { fields: { VAR: { id: firstVarId } } }),
  });

  // Add io_VarIN block (INPUT pin constant)
  xmlList.push({
    kind: 'block',
    type: 'io_VarIN',
    ...(firstVarId && { fields: { VAR: { id: firstVarId } } }),
  });

  // Add io_VarOut block (OUTPUT pin constant)
  xmlList.push({
    kind: 'block',
    type: 'io_VarOut',
    ...(firstVarId && { fields: { VAR: { id: firstVarId } } }),
  });


  // Add math_change block (always visible)
  xmlList.push({
    kind: 'block',
    type: 'math_change',
    ...(firstVarId && { fields: { VAR: { id: firstVarId } } }),
    inputs: {
      DELTA: {
        shadow: {
          type: 'math_number',
          fields: { NUM: 1 },
        },
      },
    },
  });

  // Add variable getter blocks for each variable (dynamic per variable)
  for (const variable of variableModelList) {
    xmlList.push({
      kind: 'block',
      type: 'variables_get',
      fields: { VAR: { id: variable.getId() } },
    });
  }

  return xmlList;
}
