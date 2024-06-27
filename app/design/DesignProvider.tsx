import { useReducer } from 'react'
import { DesignDispatchContext } from './useDesignDispatch'
import designReducer from './designReducer'
import { INITIAL_DESIGN_STATE } from './DesignState'
import { DesignStateContext } from './useDesignState'

interface Props {
  children: React.ReactNode
}

export default function DesignProvider({ children }: Props) {
  const [state, dispatch] = useReducer(designReducer, INITIAL_DESIGN_STATE)

  return (
    <DesignDispatchContext.Provider value={dispatch}>
      <DesignStateContext.Provider value={state}>{children}</DesignStateContext.Provider>
    </DesignDispatchContext.Provider>
  )
}
