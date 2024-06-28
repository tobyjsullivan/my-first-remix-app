import XYCoord from '../common/XYCoord'

export interface AppendElementAction {
  type: 'design/appendElement'
  payload: {
    elementType: 'div'
    position: XYCoord
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
