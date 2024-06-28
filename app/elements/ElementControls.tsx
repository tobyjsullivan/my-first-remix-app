import useElementProjection from './useElementProjection'

import styles from './ElementControls.module.scss'
import { ElementLayout } from '../design/DesignState'

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
  layout: ElementLayout
}

function DivElementControls({ layout }: DivElementControlsProps) {
  const { top, left, width, height } = layout

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

  const { elementType, layout } = element
  switch (elementType) {
    case 'div':
      return <DivElementControls layout={layout} />
    default:
      throw new Error(`Unknown element type: ${elementType} (${elementId})`)
  }
}
