import XYCoord from '../common/XYCoord'
import useElementProjection from './useElementProjection'

import styles from './ElementControls.module.scss'

interface SelectionBoxProps {
  left: number
  top: number
  width: number
  height: number
}

function SelectionBox({ left, top, width, height }: SelectionBoxProps) {
  return <div className={styles.SelectionBox} style={{ left, top, width, height }} />
}

interface DivElementControlsProps {
  position: XYCoord
}

function DivElementControls({ position }: DivElementControlsProps) {
  const { x: left, y: top } = position
  // TODO: Read width and height from element state once they are available
  const width = 250
  const height = 250

  return <SelectionBox top={top} left={left} width={width} height={height} />
}

interface Props {
  elementId: string
}

export default function ElementControls({ elementId }: Props) {
  const element = useElementProjection(elementId)
  if (element === undefined) {
    return null
  }

  const { elementType, position } = element
  switch (elementType) {
    case 'div':
      return <DivElementControls position={position} />
    default:
      throw new Error(`Unknown element type: ${elementType} (${elementId})`)
  }
}
