import XYCoord from '../common/XYCoord'
import { Step } from './Transform'

export type GripPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface FrameEventTarget {
  targetType: 'frame'
}

interface GripEventTarget {
  targetType: 'grip'
  elementId: string
  gripPosition: GripPosition
}

export type EventTarget = FrameEventTarget | GripEventTarget

export type MouseEvent = Readonly<{
  target: EventTarget
  pointerOffset: XYCoord
}>

export interface ApplyTransformAction {
  type: 'design/applyTransform'
  payload: {
    steps: Step[]
  }
}

export interface MouseDownAction {
  type: 'design/mouseDown'
  payload: {
    event: MouseEvent
  }
}

export interface MouseMoveAction {
  type: 'design/mouseMove'
  payload: {
    event: MouseEvent
  }
}

export interface MouseUpAction {
  type: 'design/mouseUp'
  payload: {
    event: MouseEvent
  }
}

export interface KeyDownAction {
  type: 'design/keyDown'
  payload: {
    key: string
    shiftKey: boolean
    metaKey: boolean
  }
}

type DesignAction = ApplyTransformAction | MouseDownAction | MouseMoveAction | MouseUpAction | KeyDownAction

export default DesignAction
