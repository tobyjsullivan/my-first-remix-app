import { Dispatch } from 'react'
import DragDropAction from './DragDropAction'
import createExpectedContext from '../common/createExpectedContext'
import useExpectedContext from '../common/useExpectedContext'

export type DragDropDispatch = Dispatch<DragDropAction>
export const DragDropDispatchContext = createExpectedContext<DragDropDispatch>()

export default function useDragDropDispatch(): DragDropDispatch {
  return useExpectedContext(DragDropDispatchContext)
}
