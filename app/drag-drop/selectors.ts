import DragDropState from './DragDropState'

export function selectDropEffect(state: DragDropState): 'move' | 'copy' | undefined {
  if (state.status !== 'dragging') {
    return undefined
  }

  return state.dropEffect
}

interface NotDragging {
  isDragging: false
}

interface Dragging {
  isDragging: true
  elementId: string
  dropEffect: 'move' | 'copy'
}

export type DraggingState = NotDragging | Dragging

export function selectDraggingState(state: DragDropState): DraggingState {
  const { status } = state
  if (status !== 'dragging') {
    return { isDragging: false }
  }

  const { dropEffect, draggingElementId } = state

  return {
    isDragging: true,
    dropEffect,
    elementId: draggingElementId,
  }
}
