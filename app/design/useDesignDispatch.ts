import { Dispatch } from 'react'
import DesignAction from './DesignAction'
import createExpectedContext from '../common/createExpectedContext'
import useExpectedContext from '../common/useExpectedContext'

export type DesignDispatch = Dispatch<DesignAction>

export const DesignDispatchContext = createExpectedContext<DesignDispatch>()

export default function useDesignDispatch(): DesignDispatch {
  return useExpectedContext(DesignDispatchContext)
}
