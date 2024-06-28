import XYCoord from '../common/XYCoord'
import { ElementTransaction } from '../design/transaction'

import DragDropState from './DragDropState'

export function selectDropEffect(state: DragDropState): 'move' | 'copy' | undefined {
  if (state.draggingState.status !== 'dragging-element') {
    return undefined
  }

  return state.draggingState.dropEffect
}

interface NotDraggingElement {
  isDraggingElement: false
}

interface DraggingElement {
  isDraggingElement: true
  elementId: string
  dropEffect: 'move' | 'copy'
  initialPointerOffset: XYCoord
  currentPointerOffset: XYCoord
  transaction: ElementTransaction
}

export type ElementDraggingState = NotDraggingElement | DraggingElement

export function selectElementDraggingState(state: DragDropState, elementIdFilter?: string): ElementDraggingState {
  const { status } = state.draggingState
  if (status !== 'dragging-element') {
    return { isDraggingElement: false }
  }

  const { dropEffect, elementId, initialPointerOffset, currentPointerOffset } = state.draggingState
  if (elementIdFilter !== undefined && elementIdFilter !== elementId) {
    return { isDraggingElement: false }
  }

  const deltaX = currentPointerOffset.x - initialPointerOffset.x
  const deltaY = currentPointerOffset.y - initialPointerOffset.y

  const transaction: ElementTransaction = {
    translateX: deltaX,
    translateY: deltaY,
  }

  return {
    isDraggingElement: true,
    dropEffect,
    elementId,
    initialPointerOffset,
    currentPointerOffset,
    transaction,
  }
}

interface NotDraggingGrip {
  isDraggingGrip: false
}

interface DraggingGrip {
  isDraggingGrip: true
  elementId: string
  gripPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  initialPointerOffset: XYCoord
  currentPointerOffset: XYCoord
  transaction: ElementTransaction
}

export type GripDraggingState = NotDraggingGrip | DraggingGrip

export function selectGripDraggingState(state: DragDropState, elementIdFilter?: string): GripDraggingState {
  const { status } = state.draggingState
  if (status !== 'dragging-grip') {
    return { isDraggingGrip: false }
  }

  const { elementId, gripPosition, initialPointerOffset, currentPointerOffset } = state.draggingState
  if (elementIdFilter !== undefined && elementIdFilter !== elementId) {
    return { isDraggingGrip: false }
  }

  const deltaX = currentPointerOffset.x - initialPointerOffset.x
  const deltaY = currentPointerOffset.y - initialPointerOffset.y

  let transaction: ElementTransaction
  switch (gripPosition) {
    case 'top-left': {
      transaction = {
        translateX: deltaX,
        translateY: deltaY,
        resizeWidth: -deltaX,
        resizeHeight: -deltaY,
      }
      break
    }
    case 'top-right': {
      transaction = {
        translateY: deltaY,
        resizeWidth: deltaX,
        resizeHeight: -deltaY,
      }
      break
    }
    case 'bottom-left': {
      transaction = {
        translateX: deltaX,
        resizeWidth: -deltaX,
        resizeHeight: deltaY,
      }
      break
    }
    case 'bottom-right': {
      transaction = {
        resizeWidth: deltaX,
        resizeHeight: deltaY,
      }
      break
    }
    default:
      throw new Error(`Unknown grip position: ${gripPosition}`)
  }

  return {
    isDraggingGrip: true,
    elementId,
    gripPosition,
    initialPointerOffset,
    currentPointerOffset,
    transaction,
  }
}
