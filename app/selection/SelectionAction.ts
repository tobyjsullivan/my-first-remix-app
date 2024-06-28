import XYCoord from '../common/XYCoord'
import DesignState from '../design/DesignState'

export interface UpdateDesignStateAction {
  type: 'selection/updateDesignState'
  payload: {
    designState: DesignState
  }
}

export interface ClickAction {
  type: 'selection/click'
  payload: {
    offset: XYCoord
  }
}

export interface KeyDownAction {
  type: 'selection/keyDown'
  payload: {
    key: string
    shiftKey: boolean
    metaKey: boolean
  }
}

type SelectionAction = UpdateDesignStateAction | ClickAction | KeyDownAction

export default SelectionAction
