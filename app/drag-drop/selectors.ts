import XYCoord from '../common/XYCoord'
import DragDropState from './DragDropState'

export function selectDropEffect(state: DragDropState): 'move' | 'copy' | undefined {
  if (state.draggingState.status !== 'dragging') {
    return undefined
  }

  return state.draggingState.dropEffect
}

interface NotDragging {
  isDragging: false
}

interface Dragging {
  isDragging: true
  elementId: string
  dropEffect: 'move' | 'copy'
  currentPointerOffset: XYCoord
  initialPointerOffset: XYCoord
  initialElementOffset: XYCoord
}

export type DraggingState = NotDragging | Dragging

export function selectDraggingState(state: DragDropState): DraggingState {
  const { status } = state.draggingState
  if (status !== 'dragging') {
    return { isDragging: false }
  }

  const { dropEffect, draggingElementId, initialPointerOffset, currentPointerOffset, initialElementOffset } =
    state.draggingState

  return {
    isDragging: true,
    dropEffect,
    elementId: draggingElementId,
    currentPointerOffset,
    initialPointerOffset,
    initialElementOffset,
  }
}
