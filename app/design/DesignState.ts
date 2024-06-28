export const INITIAL_DESIGN_STATE: DesignState = {
  elements: [],
}

export type ElementLayout = Readonly<{
  top: number
  left: number
  width: number
  height: number
}>

export type DesignElement = Readonly<{
  elementId: string
  elementType: 'div'
  layout: ElementLayout
}>

export default interface DesignState {
  elements: readonly DesignElement[]
}
