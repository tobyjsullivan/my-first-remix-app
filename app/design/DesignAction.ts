import XYCoord from '../common/XYCoord'
import { ElementLayout } from './DesignState'

export interface AppendElementAction {
  type: 'design/appendElement'
  payload: {
    elementType: 'div'
    layout: ElementLayout
  }
}

export interface MoveElementAction {
  type: 'design/moveElement'
  payload: {
    elementId: string
    position: XYCoord
  }
}

export interface CloneElementAction {
  type: 'design/cloneElement'
  payload: {
    sourceElementId: string
    position: XYCoord
  }
}

type DesignAction = AppendElementAction | MoveElementAction | CloneElementAction

export default DesignAction
