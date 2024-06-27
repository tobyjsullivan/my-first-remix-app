import React from 'react'
import XYCoord from '../design/XYCoord'
import { selectElementById } from '../design/selectors'
import useDesignState from '../design/useDesignState'
import useDrag from '../drag-drop/useDrag'

import styles from './FrameElement.module.scss'

interface DivElementProps {
  elementId: string
  position: XYCoord
}

function DivElement({ elementId, position }: DivElementProps) {
  const [dragStartRef] = useDrag(elementId, {})

  const { y: top, x: left } = position
  return <div ref={dragStartRef} className={styles.DivElement} style={{ top, left }}></div>
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
      return <DivElement elementId={elementId} position={position} />
    default:
      throw new Error(`Unknown element type: ${elementType} (${elementId})`)
  }
}
