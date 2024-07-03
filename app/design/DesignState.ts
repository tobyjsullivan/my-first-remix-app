export const INITIAL_DESIGN_STATE: DesignState = {
  elements: [],
}

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
}
