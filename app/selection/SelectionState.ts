import DesignState, { INITIAL_DESIGN_STATE } from '../design/DesignState'

export const INITIAL_SELECTION_STATE: SelectionState = {
  ranges: [],
  designState: INITIAL_DESIGN_STATE,
}

export type SelectionRange = Readonly<{
  elementId: string
}>

type SelectionState = Readonly<{
  ranges: readonly SelectionRange[]
  designState: DesignState
}>

export default SelectionState
