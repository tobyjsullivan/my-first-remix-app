import React from 'react'
import { selectAllElements } from './design/selectors'
import useDesignState from './design/useDesignState'
import useDrop from './drag-drop/useDrop'
import FrameElement from './elements/FrameElement'

import styles from './Frame.module.scss'
import useDesignDispatch from './design/useDesignDispatch'
import useDragDropState from './drag-drop/useDragDropState'
import { selectDropEffect } from './drag-drop/selectors'

export default function Frame() {
  const dispatch = useDesignDispatch()
  const state = useDesignState()
  const dragDropState = useDragDropState()

  const [dropRef] = useDrop({
    onDrop({ droppedElementId, initialPointerOffset, dropPointerOffset }) {
      const dropOffsetX = dropPointerOffset.x - initialPointerOffset.x
      const dropOffsetY = dropPointerOffset.y - initialPointerOffset.y

      const dropEffect = selectDropEffect(dragDropState)
      if (dropEffect === undefined) {
        throw new Error(`dropEffect is unexpectedly empty`)
      }

      const position = { x: dropOffsetX, y: dropOffsetY }
      console.log(`[onDrop]`, { dropEffect })

      if (dropEffect === 'copy') {
        dispatch({
          type: 'design/cloneElement',
          payload: { sourceElementId: droppedElementId, position },
        })
      } else {
        dispatch({
          type: 'design/moveElement',
          payload: { elementId: droppedElementId, position },
        })
      }
    },
  })

  const elementStates = selectAllElements(state)

  elementStates.forEach(({ elementId, elementType }) => {
    if (elementType !== 'div') {
      throw new Error(`Unknown element type: ${elementType} (${elementId})`)
    }
  })

  const elements = elementStates.map(({ elementId }) => <FrameElement key={elementId} elementId={elementId} />)

  return (
    <div ref={dropRef} className={styles.Frame}>
      {elements}
    </div>
  )
}
