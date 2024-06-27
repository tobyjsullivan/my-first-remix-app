import XYCoord from '../design/XYCoord'

export const INITIAL_DRAG_DROP_STATE: DragDropState = {
  status: 'inactive',
}

interface InactiveState {
  status: 'inactive'
}

interface DraggingState {
  status: 'dragging'
  draggingElementId: string
  initialElementOffset: XYCoord
  initialPointerOffset: XYCoord
  dropEffect: 'move' | 'copy'
  targetPointerOffset: XYCoord | undefined
}

interface DroppedState {
  status: 'dropped'
  draggingElementId: string
  initialElementOffset: XYCoord
  initialPointerOffset: XYCoord
  dropPointerOffset: XYCoord
}

type DragDropState = InactiveState | DraggingState | DroppedState

export default DragDropState
