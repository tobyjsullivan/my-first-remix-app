import { selectElementById } from '../design/selectors'
import useDesignState from '../design/useDesignState'
import { DesignElement } from '../design/DesignState'
import useDragDropState from '../drag-drop/useDragDropState'
import { selectDraggingState } from '../drag-drop/selectors'
import { produce } from 'immer'

export default function useElementProjection(elementId: string): DesignElement | undefined {
  const designState = useDesignState()
  const dragDropState = useDragDropState()

  const draggingState = selectDraggingState(dragDropState)

  const element = selectElementById(designState, elementId)
  if (element === undefined) {
    return undefined
  }

  if (!draggingState.isDragging || draggingState.elementId !== elementId) {
    return element
  }

  const { initialPointerOffset, initialElementOffset, currentPointerOffset } = draggingState

  const pointerDeltaX = currentPointerOffset.x - (initialElementOffset.x + initialPointerOffset.x)
  const pointerDeltaY = currentPointerOffset.y - (initialElementOffset.y + initialPointerOffset.y)

  return produce(element, (draft) => {
    draft.layout.left += pointerDeltaX
    draft.layout.top += pointerDeltaY
  })
}
