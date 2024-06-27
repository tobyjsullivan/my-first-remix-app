import { DesignCoord } from './DesignState'

export interface AppendElementAction {
  type: 'design/appendElement'
  payload: {
    elementId: string
    elementType: 'div'
    position: DesignCoord
  }
}

type DesignAction = AppendElementAction

export default DesignAction
