import React, { useEffect } from 'react'
import styles from './OverlayLayer.module.scss'
import useSelectionDispatch from './selection/useSelectionDispatch'
import useDragDropDispatch from './drag-drop/useDragDropDispatch'
import useDragDropState from './drag-drop/useDragDropState'
import { selectElementDraggingState, selectGripDraggingState } from './drag-drop/selectors'
import useDesignDispatch from './design/useDesignDispatch'
import XYCoord from './common/XYCoord'
import useDesignState from './design/useDesignState'
import { selectElementById } from './design/selectors'

function readPointerPosition(e: React.MouseEvent): XYCoord {
  const { clientX, clientY } = e

  return { x: clientX, y: clientY }
}

interface Props {
  children: React.ReactNode
}

export default function OverlayLayer({ children: children }: Props) {
  const designDispatch = useDesignDispatch()
  const designState = useDesignState()
  const dragDropDispatch = useDragDropDispatch()
  const dragDropState = useDragDropState()
  const selectionDispatch = useSelectionDispatch()

  const elementDrag = selectElementDraggingState(dragDropState)
  const gripDrag = selectGripDraggingState(dragDropState)

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent browser selection side-effects
    e.preventDefault()
    e.stopPropagation()

    dragDropDispatch({
      type: 'dragDrop/mouseDown',
      payload: {
        target: { targetType: 'frame' },
        pointerOffset: readPointerPosition(e),
      },
    })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    dragDropDispatch({
      type: 'dragDrop/mouseMove',
      payload: {
        pointerOffset: readPointerPosition(e),
      },
    })
  }
  const handleMouseUp = (e: React.MouseEvent) => {
    dragDropDispatch({
      type: 'dragDrop/mouseUp',
      payload: {
        pointerOffset: readPointerPosition(e),
      },
    })

    const pointerPosition = readPointerPosition(e)

    if (gripDrag.isDraggingGrip) {
      const { transform } = gripDrag

      designDispatch({ type: 'design/applyTransform', payload: { steps: transform.getSteps() } })

      return
    }

    if (elementDrag.isDraggingElement) {
      e.stopPropagation()

      const { transform } = elementDrag

      const draggingElement = selectElementById(designState, elementDrag.elementId)
      if (draggingElement === undefined) {
        throw new Error(`Could not find element in design. (${elementDrag.elementId})`)
      }

      designDispatch({ type: 'design/applyTransform', payload: { steps: transform.getSteps() } })

      return
    }

    // No drag was happening. Indicate a click.
    selectionDispatch({ type: 'selection/click', payload: { offset: pointerPosition } })
    dragDropDispatch({ type: 'dragDrop/click', payload: { pointerOffset: pointerPosition } })
  }
  const handleMouseLeave = () => {
    dragDropDispatch({
      type: 'dragDrop/mouseLeave',
      payload: {},
    })
  }

  // Setup key listener on document
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key, shiftKey, metaKey: nativeMetaKey, ctrlKey: nativeCtrlKey } = e

      const metaKey = nativeMetaKey || nativeCtrlKey
      selectionDispatch({ type: 'selection/keyDown', payload: { key, shiftKey, metaKey } })
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectionDispatch])

  return (
    <div
      className={styles.OverlayLayer}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
