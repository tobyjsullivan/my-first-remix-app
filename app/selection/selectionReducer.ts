import { createDraft, produce } from 'immer'
import SelectionAction, { ClickAction, KeyDownAction, UpdateDesignStateAction } from './SelectionAction'
import SelectionState from './SelectionState'
import { selectElementsUnderPointer } from '../design/selectors'

function applyUpdateDesignState(state: SelectionState, { payload }: UpdateDesignStateAction): SelectionState {
  const { designState } = payload

  return produce(state, (draft) => {
    draft.designState = createDraft(designState)
  })
}

function applyClick(state: SelectionState, { payload }: ClickAction): SelectionState {
  const { offset } = payload
  const { designState } = state

  const clickedElements = selectElementsUnderPointer(designState, offset)

  const clickedElementIds = clickedElements.map(({ elementId }) => elementId)

  // Select the top-most element in the stack
  const clickedElementId = clickedElementIds.length > 0 ? clickedElementIds[clickedElementIds.length - 1] : undefined
  if (clickedElementId === undefined) {
    return produce(state, (draft) => {
      // Clear selection
      draft.ranges = []
    })
  }

  return produce(state, (draft) => {
    draft.ranges = [{ elementId: clickedElementId }]
  })
}

function applyKeyDown(state: SelectionState, { payload }: KeyDownAction): SelectionState {
  const { key } = payload
  if (key === 'Escape') {
    // Clear selection
    return produce(state, (draft) => {
      draft.ranges = []
    })
  }

  return state
}

export default function selectionReducer(state: SelectionState, action: SelectionAction): SelectionState {
  const { type: actionType } = action
  switch (actionType) {
    case 'selection/updateDesignState':
      return applyUpdateDesignState(state, action)
    case 'selection/click':
      return applyClick(state, action)
    case 'selection/keyDown':
      return applyKeyDown(state, action)
    default:
      throw new Error(`Unknown action type: ${actionType}`)
  }
}
