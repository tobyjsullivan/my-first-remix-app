import React from 'react'
import XYCoord from '../common/XYCoord'
import useDrag from '../drag-drop/useDrag'

import styles from './FrameElement.module.scss'
import classNames from 'classnames'
import useSelectionState from '../selection/useSelectionState'
import { isElementSelected } from '../selection/selectors'
import useElementProjection from './useElementProjection'

interface DivElementProps {
  elementId: string
  position: XYCoord
}

function DivElement({ elementId, position }: DivElementProps) {
  const selectionState = useSelectionState()

  const [dragStartRef] = useDrag(elementId, {})

  const isSelected = isElementSelected(selectionState, elementId)

  const { y: top, x: left } = position
  return (
    <div
      ref={dragStartRef}
      className={classNames(styles.DivElement)}
      style={{ top, left }}
      data-selected={isSelected}
    ></div>
  )
}

interface Props {
  elementId: string
}

export default function FrameElement({ elementId }: Props) {
  const element = useElementProjection(elementId)
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
