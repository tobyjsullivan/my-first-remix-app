import React, { useEffect, useReducer } from 'react'
import dragDropReducer from './dragDropReducer'
import { INITIAL_DRAG_DROP_STATE } from './DragDropState'
import { DragDropDispatchContext } from './useDragDropDispatch'
import { DragDropStateContext } from './useDragDropState'
import useDesignState from '../design/useDesignState'

interface Props {
  children: React.ReactNode
}

export default function DragDropProvider({ children }: Props) {
  const [state, dispatch] = useReducer(dragDropReducer, INITIAL_DRAG_DROP_STATE)

  const designState = useDesignState()
  useEffect(() => {
    dispatch({ type: 'dragDrop/updateDesignState', payload: { designState } })
  }, [designState])

  return (
    <DragDropDispatchContext.Provider value={dispatch}>
      <DragDropStateContext.Provider value={state}>{children}</DragDropStateContext.Provider>
    </DragDropDispatchContext.Provider>
  )
}
