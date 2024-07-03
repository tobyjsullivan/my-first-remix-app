import XYCoord from '../common/XYCoord'

export const INITIAL_DESIGN_STATE: DesignState = {
  elements: [],
  selection: {
    ranges: [],
  },
  draggingState: { status: 'inactive' },
}

export type SelectionRange = Readonly<{
  elementId: string
}>

export type Selection = Readonly<{
  ranges: readonly SelectionRange[]
}>

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

type DragState = Inactive | PendingElementDrag | PendingGripDrag | DraggingElement | DraggingGrip

export type ElementLayout = Readonly<{
  top: number
  left: number
  width: number
  height: number
}>

export type ElementType = 'div'

export type DesignElement = Readonly<{
  elementId: string
  elementType: ElementType
  layout: ElementLayout
}>

export default interface DesignState {
  elements: readonly DesignElement[]
  selection: Selection
  draggingState: DragState
}
