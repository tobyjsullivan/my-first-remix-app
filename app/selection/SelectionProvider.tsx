import { useEffect, useReducer } from 'react'
import useDesignState from '../design/useDesignState'
import selectionReducer from './selectionReducer'
import { SelectionDispatchContext } from './useSelectionDispatch'
import { SelectionStateContext } from './useSelectionState'
import { INITIAL_SELECTION_STATE } from './SelectionState'

interface Props {
  children: React.ReactNode
}

export default function SelectionProvider({ children }: Props) {
  const [state, dispatch] = useReducer(selectionReducer, INITIAL_SELECTION_STATE)

  const designState = useDesignState()
  useEffect(() => {
    dispatch({ type: 'selection/updateDesignState', payload: { designState } })
  }, [designState])

  return (
    <SelectionDispatchContext.Provider value={dispatch}>
      <SelectionStateContext.Provider value={state}>{children}</SelectionStateContext.Provider>
    </SelectionDispatchContext.Provider>
  )
}
