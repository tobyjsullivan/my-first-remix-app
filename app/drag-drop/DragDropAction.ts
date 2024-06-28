import XYCoord from '../common/XYCoord'
import DesignState from '../design/DesignState'
import SelectionState from '../selection/SelectionState'

export interface UpdateDesignStateAction {
  type: 'dragDrop/updateDesignState'
  payload: {
    designState: DesignState
  }
}

export interface UpdateSelectionStateAction {
  type: 'dragDrop/updateSelectionState'
  payload: {
    selectionState: SelectionState
  }
}

interface FrameEventTarget {
  targetType: 'frame'
}

interface GripEventTarget {
  targetType: 'grip'
  elementId: string
  gripPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export type EventTarget = FrameEventTarget | GripEventTarget

export interface MouseDownAction {
  type: 'dragDrop/mouseDown'
  payload: {
    target: EventTarget
    pointerOffset: XYCoord
  }
}

export interface MouseMoveAction {
  type: 'dragDrop/mouseMove'
  payload: {
    pointerOffset: XYCoord
  }
}

export interface MouseUpAction {
  type: 'dragDrop/mouseUp'
  payload: {
    pointerOffset: XYCoord
  }
}

export interface MouseLeaveAction {
  type: 'dragDrop/mouseLeave'
  payload: Record<string, never>
}

export interface ClickAction {
  type: 'dragDrop/click'
  payload: {
    pointerOffset: XYCoord
  }
}

type DragDropAction =
  | UpdateDesignStateAction
  | UpdateSelectionStateAction
  | MouseDownAction
  | MouseMoveAction
  | MouseUpAction
  | MouseLeaveAction
  | ClickAction

export default DragDropAction
