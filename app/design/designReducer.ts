import { produce } from 'immer'
import DesignAction, { ApplyTransformAction, KeyDownAction, MouseDownAction } from './DesignAction'
import DesignState from './DesignState'
import Transform from './Transform'
import { selectElementsUnderPointer } from './selectors'

function applyTransformAction(state: DesignState, { payload }: ApplyTransformAction): DesignState {
  const { steps } = payload

  const transform = new Transform(state)
  steps.forEach((step) => transform.step(step))
  return transform.result
}

function applyMouseDown(state: DesignState, { payload }: MouseDownAction): DesignState {
  const {
    event: { pointerOffset },
  } = payload

  const clickedElements = selectElementsUnderPointer(state, pointerOffset)

  const clickedElementIds = clickedElements.map(({ elementId }) => elementId)

  // Select the top-most element in the stack
  const clickedElementId = clickedElementIds.length > 0 ? clickedElementIds[clickedElementIds.length - 1] : undefined
  if (clickedElementId === undefined) {
    return produce(state, (draft) => {
      // Clear selection
      draft.selection.ranges = []
    })
  }

  return produce(state, (draft) => {
    draft.selection.ranges = [{ elementId: clickedElementId }]
  })
}

function applyKeyDown(state: DesignState, { payload }: KeyDownAction): DesignState {
  const { key } = payload
  if (key === 'Escape') {
    // Clear selection
    return produce(state, (draft) => {
      draft.selection.ranges = []
    })
  }

  return state
}

export default function designReducer(state: DesignState, action: DesignAction): DesignState {
  const { type: actionType } = action
  switch (actionType) {
    case 'design/applyTransform':
      return applyTransformAction(state, action)
    case 'design/mouseDown':
      return applyMouseDown(state, action)
    case 'design/mouseMove':
      throw new Error(`Not implemented (${action.type})`)
    case 'design/mouseUp':
      throw new Error(`Not implemented (${action.type})`)
    case 'design/keyDown':
      return applyKeyDown(state, action)
    default:
      throw new Error(`Unknown action type: ${actionType}`)
  }
}
