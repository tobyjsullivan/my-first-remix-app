import React, { useEffect } from 'react'
import styles from './OverlayLayer.module.scss'
import useSelectionDispatch from './selection/useSelectionDispatch'
import useDragDropDispatch from './drag-drop/useDragDropDispatch'
import useDragDropState from './drag-drop/useDragDropState'
import { selectDraggingState } from './drag-drop/selectors'
import useDesignDispatch from './design/useDesignDispatch'
import XYCoord from './common/XYCoord'

function readPointerPosition(e: React.MouseEvent): XYCoord {
  const { clientX, clientY } = e

  return { x: clientX, y: clientY }
}

interface Props {
  children: React.ReactNode
}

export default function OverlayLayer({ children: children }: Props) {
  const designDispatch = useDesignDispatch()
  const dragDropDispatch = useDragDropDispatch()
  const dragDropState = useDragDropState()
  const selectionDispatch = useSelectionDispatch()

  const draggingState = selectDraggingState(dragDropState)

  const handleMouseDown = (e: React.MouseEvent) => {
    dragDropDispatch({
      type: 'dragDrop/mouseDown',
      payload: {
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

    if (!draggingState.isDragging) {
      return
    }

    const { initialPointerOffset } = draggingState

    const { clientX, clientY } = e
    const dropElementOffset: XYCoord = {
      x: clientX - initialPointerOffset.x,
      y: clientY - initialPointerOffset.y,
    }
    if (draggingState.dropEffect === 'move') {
      designDispatch({
        type: 'design/moveElement',
        payload: {
          elementId: draggingState.elementId,
          position: dropElementOffset,
        },
      })
    } else if (draggingState.dropEffect === 'copy') {
      designDispatch({
        type: 'design/cloneElement',
        payload: {
          sourceElementId: draggingState.elementId,
          position: dropElementOffset,
        },
      })
    } else {
      throw new Error(`Unknown drop effect: ${draggingState.dropEffect}`)
    }
  }
  const handleMouseLeave = () => {
    dragDropDispatch({
      type: 'dragDrop/mouseLeave',
      payload: {},
    })
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (draggingState.isDragging) {
      // Prevent browser selection side-effects
      e.preventDefault()
    }
  }

  const handleClicked = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    selectionDispatch({ type: 'selection/click', payload: { offset: { x: clientX, y: clientY } } })
    dragDropDispatch({ type: 'dragDrop/click', payload: { pointerOffset: readPointerPosition(e) } })
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
      onClick={handleClicked}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      draggable
      onDragStart={handleDragStart}
    >
      {children}
    </div>
  )
}
