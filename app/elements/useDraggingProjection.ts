import DesignState from '../design/DesignState'
import { selectElementDraggingState, selectGripDraggingState } from '../design/selectors'
import useDesignState from '../design/useDesignState'

export default function useDraggingProjection(): DesignState {
  const designState = useDesignState()

  const elementDrag = selectElementDraggingState(designState)
  const gripDrag = selectGripDraggingState(designState)

  if (elementDrag.isDraggingElement) {
    return elementDrag.transform.result
  }

  if (gripDrag.isDraggingGrip) {
    return gripDrag.transform.result
  }

  return designState
}
