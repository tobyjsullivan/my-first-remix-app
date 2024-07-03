import React from 'react'

import classNames from 'classnames'
import { ElementLayout } from '../design/DesignState'

import styles from './FrameElement.module.scss'
import useDraggingProjection from './useDraggingProjection'
import { isElementSelected, selectElementById } from '../design/selectors'
import useDesignState from '../design/useDesignState'

interface DivElementProps {
  elementId: string
  layout: ElementLayout
}

function DivElement({ elementId, layout }: DivElementProps) {
  const designState = useDesignState()

  const isSelected = isElementSelected(designState, elementId)

  const { left, top, width, height } = layout
  return (
    <div
      className={classNames(styles.DivElement)}
      style={{ top, left, width, height }}
      data-selected={isSelected}
    ></div>
  )
}

interface Props {
  elementId: string
}

export default function FrameElement({ elementId }: Props) {
  const designState = useDraggingProjection()

  const element = selectElementById(designState, elementId)
  if (element === undefined) {
    return null
  }

  const { elementType, layout } = element
  switch (elementType) {
    case 'div':
      return <DivElement elementId={elementId} layout={layout} />
    default:
      throw new Error(`Unknown element type: ${elementType} (${elementId})`)
  }
}
