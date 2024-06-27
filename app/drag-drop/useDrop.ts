import { useEffect, useState } from 'react'
import XYCoord from '../design/XYCoord'
import readEventPointerOffset from './readEventPointerOffset'
import useDragDropState from './useDragDropState'
import useDragDropDispatch from './useDragDropDispatch'

type UseDropResult = [dropRef: (domRef: HTMLElement | null) => void]

export interface DropEvent {
  nativeEvent: DragEvent
  droppedElementId: string
  initialElementOffset: XYCoord
  initialPointerOffset: XYCoord
  dropPointerOffset: XYCoord
}

interface Options {
  onDrop(event: DropEvent): void
}

export default function useDrop({ onDrop }: Options): UseDropResult {
  const state = useDragDropState()
  const dispatch = useDragDropDispatch()
  const [domNode, setDomNode] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (domNode === null) {
      return
    }

    const handleDraggedOver = (e: DragEvent) => {
      if (state.status !== 'dragging') {
        return
      }

      e.preventDefault()

      const dropEffect = e.dataTransfer?.dropEffect === 'copy' || e.altKey ? 'copy' : 'move'
      const dropPointerOffset = readEventPointerOffset(e)

      if (e.dataTransfer?.dropEffect === 'none') {
        e.dataTransfer.dropEffect = dropEffect
      }

      dispatch({ type: 'dragDrop/dragOver', payload: { dropEffect, targetPointerOffset: dropPointerOffset } })
    }

    const handleDropped = (e: DragEvent) => {
      if (state.status !== 'dragging') {
        // No-op. Likely a drag in from another context (eg system file).
        // TODO: Handle content dragged from outside the editor.
        return
      }

      e.preventDefault()

      const { draggingElementId, initialElementOffset, initialPointerOffset } = state
      const dropPointerOffset = readEventPointerOffset(e)

      dispatch({ type: 'dragDrop/drop', payload: { dropPointerOffset } })

      const dropEvent: DropEvent = {
        nativeEvent: e,
        droppedElementId: draggingElementId,
        initialElementOffset,
        initialPointerOffset,
        dropPointerOffset,
      }
      onDrop(dropEvent)
    }

    domNode.addEventListener('dragover', handleDraggedOver)
    domNode.addEventListener('drop', handleDropped)

    return () => {
      domNode.removeEventListener('dragover', handleDraggedOver)
      domNode.removeEventListener('drop', handleDropped)
    }
  }, [dispatch, domNode, onDrop, state])

  return [setDomNode]
}
