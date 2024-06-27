import DesignState from './DesignState'
import useExpectedContext from '../common/useExpectedContext'
import createExpectedContext from '../common/createExpectedContext'

export const DesignStateContext = createExpectedContext<DesignState>()

export default function useDesignState(): DesignState {
  return useExpectedContext(DesignStateContext)
}
