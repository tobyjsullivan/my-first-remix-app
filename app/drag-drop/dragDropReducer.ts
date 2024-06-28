import { createDraft, produce } from 'immer'
import DragDropAction, {
  MouseDownAction,
  MouseMoveAction,
  UpdateDesignStateAction,
  UpdateSelectionStateAction,
} from './DragDropAction'
import DragDropState from './DragDropState'
import { selectElementsUnderPointer } from '../design/selectors'
import { selectSelectedElementsUnderPointer } from '../selection/selectors'
import XYCoord from '../common/XYCoord'

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
  const { pointerOffset } = payload

  const { designState, selectionState } = state
  let [clickedSelection] = selectSelectedElementsUnderPointer(selectionState, pointerOffset)
  if (clickedSelection === undefined) {
    // Find element which was clicked
    const [clickedElement] = selectElementsUnderPointer(designState, pointerOffset)
    if (clickedElement === undefined) {
      // Nothing dragged. No-op.
      // TODO: Support click-and-drag to multi-select
      return state
    }

    clickedSelection = clickedElement
  }
  const { elementId: draggingElementId, position: elementPosition } = clickedSelection

  const relativePointerOffset: XYCoord = {
    x: pointerOffset.x - elementPosition.x,
    y: pointerOffset.y - elementPosition.y,
  }

  const currentPointerOffset: XYCoord = {
    x: pointerOffset.x,
    y: pointerOffset.y,
  }

  // Move currently selected element
  return produce(state, (draft) => {
    draft.draggingState = {
      status: 'dragging',
      draggingElementId,
      initialElementOffset: elementPosition,
      initialPointerOffset: relativePointerOffset,
      dropEffect: 'move',
      currentPointerOffset,
    }
  })
}

function applyMouseUp(state: DragDropState): DragDropState {
  const { status } = state.draggingState
  if (status !== 'dragging') {
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
  if (status !== 'dragging') {
    // No-op
    return state
  }

  return produce(state, (draft) => {
    if (draft.draggingState.status !== 'dragging') {
      // No-op
      return
    }

    draft.draggingState.currentPointerOffset = pointerOffset
  })
}

function applyClick(state: DragDropState): DragDropState {
  const { status } = state.draggingState
  if (status !== 'dragging') {
    // No-op
    return state
  }

  // Cancel drag
  return produce(state, (draft) => {
    draft.draggingState = { status: 'inactive' }
  })
}

export default function dragDropReducer(state: DragDropState, action: DragDropAction): DragDropState {
  console.log(`[dragDropReducer] action type:`, action.type)

  const { type: actionType } = action
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
