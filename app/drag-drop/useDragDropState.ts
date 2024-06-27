import createExpectedContext from '../common/createExpectedContext'
import useExpectedContext from '../common/useExpectedContext'
import DragDropState from './DragDropState'

export const DragDropStateContext = createExpectedContext<DragDropState>()

export default function useDragDropState(): DragDropState {
  return useExpectedContext(DragDropStateContext)
}
