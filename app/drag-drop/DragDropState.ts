import XYCoord from '../common/XYCoord'
import DesignState, { INITIAL_DESIGN_STATE } from '../design/DesignState'
import SelectionState, { INITIAL_SELECTION_STATE } from '../selection/SelectionState'

export const INITIAL_DRAG_DROP_STATE: DragDropState = {
  draggingState: {
    status: 'inactive',
  },
  designState: INITIAL_DESIGN_STATE,
  selectionState: INITIAL_SELECTION_STATE,
}

interface Inactive {
  status: 'inactive'
}

interface Dragging {
  status: 'dragging'
  draggingElementId: string
  initialElementOffset: XYCoord
  initialPointerOffset: XYCoord
  dropEffect: 'move' | 'copy'
  currentPointerOffset: XYCoord
}

type DragDropState = Readonly<{
  draggingState: Inactive | Dragging
  designState: DesignState
  selectionState: SelectionState
}>

export default DragDropState
