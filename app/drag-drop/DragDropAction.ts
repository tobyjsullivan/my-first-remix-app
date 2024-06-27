import XYCoord from '../design/XYCoord'

export interface DragStartAction {
  type: 'dragDrop/dragStart'
  payload: {
    draggingElementId: string
    initialElementOffset: XYCoord
    initialPointerOffset: XYCoord
    dropEffect: 'move' | 'copy'
  }
}

export interface DragOverAction {
  type: 'dragDrop/dragOver'
  payload: {
    dropEffect: 'move' | 'copy'
    targetPointerOffset: XYCoord
  }
}

export interface DragEndAction {
  type: 'dragDrop/dragEnd'
  payload: Record<string, never>
}

export interface DropAction {
  type: 'dragDrop/drop'
  payload: {
    dropPointerOffset: XYCoord
  }
}

type DragDropAction = DragStartAction | DragOverAction | DragEndAction | DropAction

export default DragDropAction
