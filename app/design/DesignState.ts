export const INITIAL_DESIGN_STATE: DesignState = {
  elements: [],
  selection: {
    ranges: [],
  },
}

export type SelectionRange = Readonly<{
  elementId: string
}>

export type Selection = Readonly<{
  ranges: readonly SelectionRange[]
}>

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
}
