import createExpectedContext from '../common/createExpectedContext'
import useExpectedContext from '../common/useExpectedContext'
import SelectionState from './SelectionState'

export const SelectionStateContext = createExpectedContext<SelectionState>()

export default function useSelectionState(): SelectionState {
  return useExpectedContext(SelectionStateContext)
}
