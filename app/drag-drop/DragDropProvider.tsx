import React, { useReducer } from 'react'
import dragDropReducer from './dragDropReducer'
import { INITIAL_DRAG_DROP_STATE } from './DragDropState'
import { DragDropDispatchContext } from './useDragDropDispatch'
import { DragDropStateContext } from './useDragDropState'

interface Props {
  children: React.ReactNode
}

export default function DragDropProvider({ children }: Props) {
  const [state, dispatch] = useReducer(dragDropReducer, INITIAL_DRAG_DROP_STATE)

  return (
    <DragDropDispatchContext.Provider value={dispatch}>
      <DragDropStateContext.Provider value={state}>{children}</DragDropStateContext.Provider>
    </DragDropDispatchContext.Provider>
  )
}
