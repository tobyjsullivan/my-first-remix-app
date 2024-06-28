import XYCoord from '../common/XYCoord'

export const INITIAL_DESIGN_STATE: DesignState = {
  elements: [],
}

export type DesignElement = Readonly<{
  elementId: string
  elementType: 'div'
  position: XYCoord
}>

export default interface DesignState {
  elements: readonly DesignElement[]
}
