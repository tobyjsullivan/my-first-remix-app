import { Dispatch } from 'react'
import SelectionAction from './SelectionAction'
import createExpectedContext from '../common/createExpectedContext'
import useExpectedContext from '../common/useExpectedContext'

export type SelectionDispatch = Dispatch<SelectionAction>

export const SelectionDispatchContext = createExpectedContext<SelectionDispatch>()

export default function useSelectionDispatch(): SelectionDispatch {
  return useExpectedContext(SelectionDispatchContext)
}
