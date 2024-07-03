import classNames from 'classnames'
import { ElementLayout } from '../design/DesignState'

import styles from './ElementControls.module.scss'
import React from 'react'
import readEventPointerOffset from './readEventPointerOffset'
import useDraggingProjection from './useDraggingProjection'
import { selectElementById } from '../design/selectors'
import useDesignDispatch from '../design/useDesignDispatch'
import { EventTarget } from '../design/DesignAction'

interface GripProps {
  elementId: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

function Grip({ elementId, position }: GripProps) {
  const designDispatch = useDesignDispatch()

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const pointerOffset = readEventPointerOffset(e.nativeEvent)

    const target: EventTarget = { targetType: 'grip', elementId, gripPosition: position }
    designDispatch({ type: 'design/mouseDown', payload: { event: { target, pointerOffset } } })
  }

  const positionClasses = []
  switch (position) {
    case 'top-left': {
      positionClasses.push(styles.top, styles.left)
      break
    }
    case 'top-right': {
      positionClasses.push(styles.top, styles.right)
      break
    }
    case 'bottom-left': {
      positionClasses.push(styles.bottom, styles.left)
      break
    }
    case 'bottom-right': {
      positionClasses.push(styles.bottom, styles.right)
      break
    }
    default:
      throw new Error(`Unknown position: ${position}`)
  }

  return (
    <div className={classNames(styles.Grip, positionClasses)} onMouseDown={handleMouseDown}>
      <div className={styles.icon} />
    </div>
  )
}

interface SelectionBoxProps {
  elementId: string
  layout: ElementLayout
}

function SelectionBox({ elementId, layout }: SelectionBoxProps) {
  const { left, top, width, height } = layout
  return (
    <div className={styles.SelectionBox} style={{ left, top, width, height }}>
      <Grip elementId={elementId} position="top-left" />
      <Grip elementId={elementId} position="top-right" />
      <Grip elementId={elementId} position="bottom-left" />
      <Grip elementId={elementId} position="bottom-right" />
    </div>
  )
}

interface DivElementControlsProps {
  elementId: string
  layout: ElementLayout
}

function DivElementControls({ elementId, layout }: DivElementControlsProps) {
  return <SelectionBox elementId={elementId} layout={layout} />
}

interface Props {
  elementId: string
}

export default function ElementControls({ elementId }: Props) {
  const designState = useDraggingProjection()

  const element = selectElementById(designState, elementId)
  if (element === undefined) {
    return null
  }

  const { elementType, layout } = element
  switch (elementType) {
    case 'div':
      return <DivElementControls elementId={elementId} layout={layout} />
    default:
      throw new Error(`Unknown element type: ${elementType} (${elementId})`)
  }
}
