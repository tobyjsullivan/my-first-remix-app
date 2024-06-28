import React from 'react'
import XYCoord from '../common/XYCoord'
import { selectElementById } from '../design/selectors'
import useDesignState from '../design/useDesignState'
import useDrag from '../drag-drop/useDrag'

import styles from './FrameElement.module.scss'
import classNames from 'classnames'
import useSelectionState from '../selection/useSelectionState'
import { isElementSelected } from '../selection/selectors'
import { DesignElement } from '../design/DesignState'
import useDragDropState from '../drag-drop/useDragDropState'
import { selectDraggingState } from '../drag-drop/selectors'
import { produce } from 'immer'

const SELECTED_STYLE = styles.selected ?? '__unknown-style__'

function useElementProjection(elementId: string): DesignElement | undefined {
  const designState = useDesignState()
  const dragDropState = useDragDropState()

  const draggingState = selectDraggingState(dragDropState)

  const element = selectElementById(designState, elementId)
  if (element === undefined) {
    return undefined
  }

  if (!draggingState.isDragging || draggingState.elementId !== elementId) {
    return element
  }

  const { initialPointerOffset, initialElementOffset, currentPointerOffset } = draggingState

  const pointerDeltaX = currentPointerOffset.x - (initialElementOffset.x + initialPointerOffset.x)
  const pointerDeltaY = currentPointerOffset.y - (initialElementOffset.y + initialPointerOffset.y)

  const projectedPosition: XYCoord = {
    x: element.position.x + pointerDeltaX,
    y: element.position.y + pointerDeltaY,
  }

  return produce(element, (draft) => {
    draft.position = projectedPosition
  })
}

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
      className={classNames(styles.DivElement, {
        [SELECTED_STYLE]: isSelected,
      })}
      style={{ top, left }}
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
