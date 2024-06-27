import styles from './Frame.module.scss'
import { selectAllElements } from './design/selectors'
import useDesignState from './design/useDesignState'
import FrameElement from './elements/FrameElement'

export default function Frame() {
  const state = useDesignState()

  const elementStates = selectAllElements(state)

  elementStates.forEach(({ elementId, elementType }) => {
    if (elementType !== 'div') {
      throw new Error(`Unknown element type: ${elementType} (${elementId})`)
    }
  })

  const elements = elementStates.map(({ elementId }) => <FrameElement key={elementId} elementId={elementId} />)

  return <div className={styles.Frame}>{elements}</div>
}
