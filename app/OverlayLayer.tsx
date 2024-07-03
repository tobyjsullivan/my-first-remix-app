import React, { useEffect } from 'react'
import styles from './OverlayLayer.module.scss'
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

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent browser selection side-effects
    e.preventDefault()
    e.stopPropagation()

    designDispatch({
      type: 'design/mouseDown',
      payload: {
        event: {
          target: { targetType: 'frame' },
          pointerOffset: readPointerPosition(e),
        },
      },
    })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    designDispatch({
      type: 'design/mouseMove',
      payload: {
        event: {
          target: { targetType: 'frame' },
          pointerOffset: readPointerPosition(e),
        },
      },
    })
  }
  const handleMouseUp = (e: React.MouseEvent) => {
    designDispatch({
      type: 'design/mouseUp',
      payload: {
        event: {
          target: { targetType: 'frame' },
          pointerOffset: readPointerPosition(e),
        },
      },
    })
  }

  // Setup key listener on document
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key, shiftKey, metaKey: nativeMetaKey, ctrlKey: nativeCtrlKey } = e

      const metaKey = nativeMetaKey || nativeCtrlKey
      designDispatch({ type: 'design/keyDown', payload: { key, shiftKey, metaKey } })
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [designDispatch])

  return (
    <div
      className={styles.OverlayLayer}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {children}
    </div>
  )
}
