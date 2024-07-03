import XYCoord from '../common/XYCoord'
import { GripPosition } from './DesignAction'
import DesignState, { DesignElement } from './DesignState'
import Transform, { ResizeHeightStep, ResizeWidthStep, TranslateXStep, TranslateYStep } from './Transform'

export function selectAllElements(state: DesignState): DesignElement[] {
  return [...state.elements]
}

export function selectElementById(state: DesignState, elementId: string): DesignElement | undefined {
  return state.elements.find(({ elementId: candidateId }) => candidateId === elementId)
}

function elementOverlapsPoint(element: DesignElement, point: XYCoord): boolean {
  const {
    layout: { left, top, width, height },
  } = element

  const { x: pointerX, y: pointerY } = point

  return pointerX >= left && pointerX <= left + width && pointerY >= top && pointerY <= top + height
}

/** Results sorted in reverse-paint order. I.e., top-most element will be last in returned the list. */
export function selectElementsUnderPointer(state: DesignState, pointerOffset: XYCoord): DesignElement[] {
  const { elements } = state
  return elements.filter((element) => elementOverlapsPoint(element, pointerOffset))
}

export function isElementSelected(state: DesignState, elementId: string): boolean {
  return state.selection.ranges.some(({ elementId: rangeElementId }) => rangeElementId === elementId)
}

export function selectSelectedElements(state: DesignState): DesignElement[] {
  const {
    elements,
    selection: { ranges },
  } = state
  if (ranges.length === 0) {
    return []
  }

  const selectedElementIds = ranges.map(({ elementId }) => elementId)

  return elements.filter(({ elementId }) => selectedElementIds.includes(elementId))
}

export function selectSelectedElementsUnderPointer(state: DesignState, pointerOffset: XYCoord): DesignElement[] {
  const { ranges } = state.selection
  const selectedElementIds = ranges.map(({ elementId }) => elementId)
  if (selectedElementIds.length === 0) {
    return []
  }

  const intersectingElements = selectElementsUnderPointer(state, pointerOffset)

  return intersectingElements.filter(({ elementId }) => selectedElementIds.includes(elementId))
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

export function selectElementDraggingState(state: DesignState, elementIdFilter?: string): ElementDraggingState {
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

  const transform = new Transform(state)
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
  gripPosition: GripPosition
  initialPointerOffset: XYCoord
  currentPointerOffset: XYCoord
  transform: Transform
}

export type GripDraggingState = NotDraggingGrip | DraggingGrip

export function selectGripDraggingState(state: DesignState, elementIdFilter?: string): GripDraggingState {
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

  const transform = new Transform(state)

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
