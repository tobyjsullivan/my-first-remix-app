import XYCoord from '../common/XYCoord'
import DesignState, { INITIAL_DESIGN_STATE } from '../design/DesignState'

export const INITIAL_DRAG_DROP_STATE: DragDropState = {
  draggingState: {
    status: 'inactive',
  },
  designState: INITIAL_DESIGN_STATE,
}

interface Inactive {
  status: 'inactive'
}

interface PendingElementDrag {
  status: 'pending-element-drag'
  elementId: string
  initialPointerOffset: XYCoord
}

interface PendingGripDrag {
  status: 'pending-grip-drag'
  elementId: string
  gripPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  initialPointerOffset: XYCoord
}

interface DraggingElement {
  status: 'dragging-element'
  elementId: string
  dropEffect: 'move' | 'copy'
  initialPointerOffset: XYCoord
  currentPointerOffset: XYCoord
}

interface DraggingGrip {
  status: 'dragging-grip'
  elementId: string
  gripPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  initialPointerOffset: XYCoord
  currentPointerOffset: XYCoord
}

type DragDropState = Readonly<{
  draggingState: Inactive | PendingElementDrag | PendingGripDrag | DraggingElement | DraggingGrip
  designState: DesignState
}>

export default DragDropState
