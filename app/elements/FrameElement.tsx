import { DesignCoord } from '../design/DesignState'
import { selectElementById } from '../design/selectors'
import useDesignState from '../design/useDesignState'
import styles from './FrameElement.module.scss'

interface DivElementProps {
  position: DesignCoord
}

function DivElement({ position }: DivElementProps) {
  const { top, left } = position
  return <div className={styles.DivElement} style={{ top, left }}></div>
}

interface Props {
  elementId: string
}

export default function FrameElement({ elementId }: Props) {
  const state = useDesignState()
  const element = selectElementById(state, elementId)

  if (element === undefined) {
    return null
  }

  const { elementType, position } = element
  switch (elementType) {
    case 'div':
      return <DivElement position={position} />
    default:
      throw new Error(`Unknown element type: ${elementType} (${elementId})`)
  }
}
