export const INITIAL_DESIGN_STATE: DesignState = {
  elements: [],
}

export type DesignCoord = Readonly<{
  top: number
  left: number
}>

export type DesignElement = Readonly<{
  elementId: string
  elementType: 'div'
  position: DesignCoord
}>

export default interface DesignState {
  elements: readonly DesignElement[]
}
