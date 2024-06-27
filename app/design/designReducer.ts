import { produce } from 'immer'
import DesignAction, { AppendElementAction } from './DesignAction'
import DesignState from './DesignState'

function applyAppendElement(state: DesignState, { payload }: AppendElementAction): DesignState {
  const { elementId, elementType, position } = payload

  return produce(state, (draft) => {
    draft.elements.push({
      elementId,
      elementType,
      position,
    })
  })
}

export default function designReducer(state: DesignState, action: DesignAction): DesignState {
  const { type: actionType } = action
  switch (actionType) {
    case 'design/appendElement':
      return applyAppendElement(state, action)
    default:
      throw new Error(`Unknown action type: ${actionType}`)
  }
}
