import { createDraft, produce } from 'immer'
import DragDropAction, {
  MouseDownAction,
  MouseMoveAction,
  UpdateDesignStateAction,
  UpdateSelectionStateAction,
} from './DragDropAction'
import DragDropState from './DragDropState'
import { selectSelectedElementsUnderPointer } from '../selection/selectors'
import { selectElementsUnderPointer } from '../design/selectors'

const DRAG_THRESHOLD = 5

function applyUpdateDesignState(state: DragDropState, { payload }: UpdateDesignStateAction): DragDropState {
  const { designState } = payload

  return produce(state, (draft) => {
    draft.designState = createDraft(designState)
  })
}

function applyUpdateSelectionState(state: DragDropState, { payload }: UpdateSelectionStateAction): DragDropState {
  const { selectionState } = payload

  return produce(state, (draft) => {
    draft.selectionState = createDraft(selectionState)
  })
}

function applyMouseDown(state: DragDropState, { payload }: MouseDownAction): DragDropState {
  const { target, pointerOffset } = payload
  const { selectionState, designState } = state

  // TODO: Place dragging into a pending state to start
  const { targetType } = target
  if (targetType === 'grip') {
    const { elementId, gripPosition } = target

    return produce(state, (draft) => {
      draft.draggingState = {
        status: 'pending-grip-drag',
        elementId,
        gripPosition,
        initialPointerOffset: pointerOffset,
      }
    })
  }

  if (targetType !== 'frame') {
    throw new Error(`Unknown target type: ${targetType}`)
  }

  const [clickedSelection] = selectSelectedElementsUnderPointer(selectionState, pointerOffset)
  if (clickedSelection !== undefined) {
    const { elementId } = clickedSelection
    return produce(state, (draft) => {
      draft.draggingState = {
        status: 'pending-element-drag',
        elementId,
        initialPointerOffset: pointerOffset,
      }
    })
  }

  const [clickedElement] = selectElementsUnderPointer(designState, pointerOffset)
  if (clickedElement !== undefined) {
    const { elementId } = clickedElement
    return produce(state, (draft) => {
      draft.draggingState = {
        status: 'pending-element-drag',
        elementId,
        initialPointerOffset: pointerOffset,
      }
    })
  }

  // No-op
  return state
}

function applyMouseUp(state: DragDropState): DragDropState {
  const { status } = state.draggingState
  if (status === 'inactive') {
    // No-op
    return state
  }

  return produce(state, (draft) => {
    draft.draggingState = {
      status: 'inactive',
    }
  })
}

function applyMouseLeave(state: DragDropState): DragDropState {
  // End any dragging
  return produce(state, (draft) => {
    draft.draggingState = { status: 'inactive' }
  })
}

function applyMouseMove(state: DragDropState, { payload }: MouseMoveAction): DragDropState {
  const { pointerOffset } = payload

  const { status } = state.draggingState
  if (status === 'pending-element-drag') {
    const { initialPointerOffset } = state.draggingState
    const deltaX = pointerOffset.x - initialPointerOffset.x
    const deltaY = pointerOffset.y - initialPointerOffset.y
    const netDelta = Math.sqrt(deltaX ** 2 + deltaY ** 2)
    if (netDelta < DRAG_THRESHOLD) {
      // No-op. Drag threshold has not been reached.
      return state
    }

    // Drag threshold has been reached. Transition to a dragging state.
    const { elementId } = state.draggingState
    return produce(state, (draft) => {
      draft.draggingState = {
        status: 'dragging-element',
        elementId,
        dropEffect: 'move',
        initialPointerOffset,
        currentPointerOffset: pointerOffset,
      }
    })
  }

  if (status === 'pending-grip-drag') {
    const { initialPointerOffset } = state.draggingState
    const deltaX = pointerOffset.x - initialPointerOffset.x
    const deltaY = pointerOffset.y - initialPointerOffset.y
    const netDelta = Math.sqrt(deltaX ** 2 + deltaY ** 2)
    if (netDelta < DRAG_THRESHOLD) {
      // No-op. Drag threshold has not been reached.
      return state
    }

    // Drag threshold has been reached. Transition to a dragging state.
    const { elementId, gripPosition } = state.draggingState
    return produce(state, (draft) => {
      draft.draggingState = {
        status: 'dragging-grip',
        elementId,
        gripPosition,
        initialPointerOffset,
        currentPointerOffset: pointerOffset,
      }
    })
  }

  return produce(state, (draft) => {
    const { status } = draft.draggingState
    if (status === 'dragging-element' || status === 'dragging-grip') {
      draft.draggingState.currentPointerOffset = pointerOffset
    }
  })
}

function applyClick(state: DragDropState): DragDropState {
  const { status } = state.draggingState
  if (status === 'inactive') {
    // No-op
    return state
  }

  // Cancel drag
  return produce(state, (draft) => {
    draft.draggingState = { status: 'inactive' }
  })
}

export default function dragDropReducer(state: DragDropState, action: DragDropAction): DragDropState {
  const { type: actionType } = action

  if (actionType !== 'dragDrop/mouseMove') {
    console.log(`[dragDropReducer] actionType:`, actionType)
  }

  switch (actionType) {
    case 'dragDrop/updateDesignState':
      return applyUpdateDesignState(state, action)
    case 'dragDrop/updateSelectionState':
      return applyUpdateSelectionState(state, action)
    case 'dragDrop/mouseDown':
      return applyMouseDown(state, action)
    case 'dragDrop/mouseMove':
      return applyMouseMove(state, action)
    case 'dragDrop/mouseUp':
      return applyMouseUp(state)
    case 'dragDrop/mouseLeave':
      return applyMouseLeave(state)
    case 'dragDrop/click':
      return applyClick(state)
    default:
      throw new Error(`Unknown action type: ${actionType}`)
  }
}
