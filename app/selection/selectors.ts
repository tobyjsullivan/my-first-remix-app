import XYCoord from '../common/XYCoord'
import { DesignElement } from '../design/DesignState'
import { selectAllElements, selectElementsUnderPointer } from '../design/selectors'
import SelectionState from './SelectionState'

export function isElementSelected(state: SelectionState, elementId: string): boolean {
  return state.ranges.some(({ elementId: rangeElementId }) => rangeElementId === elementId)
}

export function selectSelectedElements(state: SelectionState): DesignElement[] {
  const { designState, ranges } = state
  if (ranges.length === 0) {
    return []
  }

  const selectedElementIds = ranges.map(({ elementId }) => elementId)

  return selectAllElements(designState).filter(({ elementId }) => selectedElementIds.includes(elementId))
}

export function selectSelectedElementsUnderPointer(state: SelectionState, pointerOffset: XYCoord): DesignElement[] {
  const { designState, ranges } = state
  const selectedElementIds = ranges.map(({ elementId }) => elementId)
  if (selectedElementIds.length === 0) {
    return []
  }

  const intersectingElements = selectElementsUnderPointer(designState, pointerOffset)

  return intersectingElements.filter(({ elementId }) => selectedElementIds.includes(elementId))
}
