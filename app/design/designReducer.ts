import { produce } from 'immer'
import { v4 as uuid } from 'uuid'
import DesignAction, { AppendElementAction, CloneElementAction, MoveElementAction } from './DesignAction'
import DesignState from './DesignState'

function applyAppendElement(state: DesignState, { payload }: AppendElementAction): DesignState {
  const { elementType, position } = payload

  const elementId = uuid()

  return produce(state, (draft) => {
    draft.elements.push({
      elementId,
      elementType,
      position,
    })
  })
}

function applyMoveElement(state: DesignState, { payload }: MoveElementAction): DesignState {
  const { elementId, position } = payload

  return produce(state, (draft) => {
    draft.elements
      .filter(({ elementId: candidateId }) => candidateId === elementId)
      .forEach((element) => {
        element.position = position
      })
  })
}

function applyCloneElement(state: DesignState, { payload }: CloneElementAction): DesignState {
  const { sourceElementId, position } = payload

  const elementId = uuid()

  const sourceElement = state.elements.find(({ elementId: candidateId }) => candidateId === sourceElementId)
  if (sourceElement === undefined) {
    throw new Error(`Cannot find clone source element. (${sourceElementId})`)
  }

  const { elementType } = sourceElement
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
    case 'design/moveElement':
      return applyMoveElement(state, action)
    case 'design/cloneElement':
      return applyCloneElement(state, action)
    default:
      throw new Error(`Unknown action type: ${actionType}`)
  }
}
