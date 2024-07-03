import DesignAction, { ApplyTransformAction, KeyDownAction, MouseDownAction, MouseMoveAction } from './DesignAction'
import DesignState from './DesignState'
import Transform, {
  PrepareElementDrag,
  PrepareGripDrag,
  ClearSelectionStep,
  SelectElementStep,
  StartDraggingElement,
  StartDraggingGrip,
  UpdateDragPositionStep,
  EndDragStep,
} from './Transform'
import {
  selectElementDraggingState,
  selectElementsUnderPointer,
  selectGripDraggingState,
  selectSelectedElementsUnderPointer,
} from './selectors'

const DRAG_THRESHOLD = 5

function applyTransformAction(state: DesignState, { payload }: ApplyTransformAction): DesignState {
  const { steps } = payload

  const transform = new Transform(state)
  steps.forEach((step) => transform.step(step))
  return transform.result
}

function applyMouseDown(state: DesignState, { payload }: MouseDownAction): DesignState {
  const {
    event: { target, pointerOffset },
  } = payload

  const { targetType } = target

  if (targetType === 'grip') {
    const { elementId, gripPosition } = target

    return new Transform(state).step(new PrepareGripDrag(elementId, gripPosition, pointerOffset)).result
  }

  if (targetType !== 'frame') {
    throw new Error(`Unknown target type: ${targetType}`)
  }

  const [clickedSelection] = selectSelectedElementsUnderPointer(state, pointerOffset)
  if (clickedSelection !== undefined) {
    const { elementId } = clickedSelection

    return new Transform(state).step(new PrepareElementDrag(elementId, pointerOffset)).result
  }

  const [clickedElement] = selectElementsUnderPointer(state, pointerOffset)
  if (clickedElement !== undefined) {
    const { elementId } = clickedElement

    return (
      new Transform(state)
        // Select the element before starting to drag
        .step(new SelectElementStep(elementId))
        .step(new PrepareElementDrag(elementId, pointerOffset)).result
    )
  }

  // Clear selection
  return new Transform(state).step(new ClearSelectionStep()).result
}

function applyMouseMove(state: DesignState, { payload }: MouseMoveAction): DesignState {
  const { pointerOffset } = payload.event

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
    return new Transform(state).step(new StartDraggingElement(pointerOffset)).result
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
    return new Transform(state).step(new StartDraggingGrip(pointerOffset)).result
  }

  return new Transform(state).step(new UpdateDragPositionStep(pointerOffset)).result
}

function applyMouseUp(state: DesignState): DesignState {
  const elementDrag = selectElementDraggingState(state)
  if (elementDrag.isDraggingElement) {
    const { transform } = elementDrag

    return transform.step(new EndDragStep()).result
  }

  const gripDrag = selectGripDraggingState(state)
  if (gripDrag.isDraggingGrip) {
    const { transform } = gripDrag

    return transform.step(new EndDragStep()).result
  }

  return new Transform(state).step(new EndDragStep()).result
}

function applyKeyDown(state: DesignState, { payload }: KeyDownAction): DesignState {
  const { key } = payload
  if (key === 'Escape') {
    // Clear the selection
    return new Transform(state).step(new ClearSelectionStep()).result
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
      return applyMouseMove(state, action)
    case 'design/mouseUp':
      return applyMouseUp(state)
    case 'design/keyDown':
      return applyKeyDown(state, action)
    default:
      throw new Error(`Unknown action type: ${actionType}`)
  }
}
