import XYCoord from '../common/XYCoord'
import DesignState, { DesignElement } from './DesignState'

export function selectAllElements(state: DesignState): DesignElement[] {
  return [...state.elements]
}

export function selectElementById(state: DesignState, elementId: string): DesignElement | undefined {
  return state.elements.find(({ elementId: candidateId }) => candidateId === elementId)
}

function elementOverlapsPoint(element: DesignElement, point: XYCoord): boolean {
  const {
    position: { x: left, y: top },
  } = element
  // TODO: Read width and height from design element once those properties are added
  const width = 250
  const height = 250

  const { x: pointerX, y: pointerY } = point

  return pointerX >= left && pointerX <= left + width && pointerY >= top && pointerY <= top + height
}

/** Results sorted in reverse-paint order. I.e., top-most element will be last in returned the list. */
export function selectElementsUnderPointer(state: DesignState, pointerOffset: XYCoord): DesignElement[] {
  const { elements } = state
  return elements.filter((element) => elementOverlapsPoint(element, pointerOffset))
}
