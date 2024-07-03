import XYCoord from '../common/XYCoord'
import Transform, { ResizeHeightStep, ResizeWidthStep, TranslateXStep, TranslateYStep } from '../design/Transform'

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
  transform: Transform
}

export type ElementDraggingState = NotDraggingElement | DraggingElement

export function selectElementDraggingState(state: DragDropState, elementIdFilter?: string): ElementDraggingState {
  const { draggingState, designState } = state
  const { status } = draggingState
  if (status !== 'dragging-element') {
    return { isDraggingElement: false }
  }

  const { dropEffect, elementId, initialPointerOffset, currentPointerOffset } = draggingState
  if (elementIdFilter !== undefined && elementIdFilter !== elementId) {
    return { isDraggingElement: false }
  }

  const deltaX = currentPointerOffset.x - initialPointerOffset.x
  const deltaY = currentPointerOffset.y - initialPointerOffset.y

  const transform = new Transform(designState)
    .step(new TranslateXStep(elementId, deltaX))
    .step(new TranslateYStep(elementId, deltaY))

  return {
    isDraggingElement: true,
    dropEffect,
    elementId,
    initialPointerOffset,
    currentPointerOffset,
    transform,
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
  transform: Transform
}

export type GripDraggingState = NotDraggingGrip | DraggingGrip

export function selectGripDraggingState(state: DragDropState, elementIdFilter?: string): GripDraggingState {
  const { draggingState, designState } = state
  const { status } = draggingState
  if (status !== 'dragging-grip') {
    return { isDraggingGrip: false }
  }

  const { elementId, gripPosition, initialPointerOffset, currentPointerOffset } = draggingState
  if (elementIdFilter !== undefined && elementIdFilter !== elementId) {
    return { isDraggingGrip: false }
  }

  const deltaX = currentPointerOffset.x - initialPointerOffset.x
  const deltaY = currentPointerOffset.y - initialPointerOffset.y

  const transform = new Transform(designState)

  switch (gripPosition) {
    case 'top-left': {
      transform
        .step(new TranslateXStep(elementId, deltaX))
        .step(new TranslateYStep(elementId, deltaY))
        .step(new ResizeWidthStep(elementId, -deltaX))
        .step(new ResizeHeightStep(elementId, -deltaY))
      break
    }
    case 'top-right': {
      transform
        .step(new TranslateYStep(elementId, deltaY))
        .step(new ResizeWidthStep(elementId, deltaX))
        .step(new ResizeHeightStep(elementId, -deltaY))
      break
    }
    case 'bottom-left': {
      transform
        .step(new TranslateXStep(elementId, deltaX))
        .step(new ResizeWidthStep(elementId, -deltaX))
        .step(new ResizeHeightStep(elementId, deltaY))
      break
    }
    case 'bottom-right': {
      transform //
        .step(new ResizeWidthStep(elementId, deltaX))
        .step(new ResizeHeightStep(elementId, deltaY))
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
    transform,
  }
}
