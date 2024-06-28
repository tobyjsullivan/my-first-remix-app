import { selectElementById } from '../design/selectors'
import useDesignState from '../design/useDesignState'
import { DesignElement } from '../design/DesignState'
import useDragDropState from '../drag-drop/useDragDropState'
import { selectElementDraggingState, selectGripDraggingState } from '../drag-drop/selectors'
import { applyElementTransaction } from '../design/transaction'

export default function useElementProjection(elementId: string): DesignElement | undefined {
  const designState = useDesignState()
  const dragDropState = useDragDropState()

  const elementDrag = selectElementDraggingState(dragDropState, elementId)
  const gripDrag = selectGripDraggingState(dragDropState, elementId)

  const element = selectElementById(designState, elementId)
  if (element === undefined) {
    return undefined
  }

  if (elementDrag.isDraggingElement) {
    const { transaction } = elementDrag
    return applyElementTransaction(element, transaction)
  }

  if (gripDrag.isDraggingGrip) {
    const { transaction } = gripDrag
    return applyElementTransaction(element, transaction)
  }

  return element
}
