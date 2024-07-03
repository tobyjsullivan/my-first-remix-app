import DesignState from '../design/DesignState'
import useDesignState from '../design/useDesignState'
import { selectElementDraggingState, selectGripDraggingState } from '../drag-drop/selectors'
import useDragDropState from '../drag-drop/useDragDropState'

export default function useDraggingProjection(): DesignState {
  const designState = useDesignState()
  const dragDropState = useDragDropState()

  const elementDrag = selectElementDraggingState(dragDropState)
  const gripDrag = selectGripDraggingState(dragDropState)

  if (elementDrag.isDraggingElement) {
    return elementDrag.transform.result
  }

  if (gripDrag.isDraggingGrip) {
    return gripDrag.transform.result
  }

  return designState
}
